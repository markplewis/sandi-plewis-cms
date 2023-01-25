import { calcAPCA, fontLookupAPCA } from "apca-w3";
import Color from "colorjs.io";
import { colorParsley } from "colorparsley";

// https://css-tricks.com/converting-color-spaces-in-javascript/#hex-to-hsl
// https://www.sarasoueidan.com/blog/hex-rgb-to-hsl/#hsl-and-color-harmonies

// For dark text on light backgrounds, and the text is 24px or smaller, the text should be #000000
// See: https://github.com/Myndex/SAPC-APCA/discussions/64
const black = hexToColor("#000");
const white = hexToColor("#fff");

function hexToColor(hexColor) {
  // colorParsley returns RGB numbers, not RGB percentages
  const [r, g, b] = colorParsley(hexColor);
  return new Color(`rgb(${r} ${g} ${b})`);
}

// Hue and saturation may be NaN if the color is achromatic or fully desaturated (i.e. greyscale)
function getHue(h) {
  return !h || Number.isNaN(h) ? 0 : h;
}
function getSaturation(s) {
  return !s || Number.isNaN(s) ? 0 : s;
}

// function findBestColorCombo(blackFgColor, whiteFgColor) {
//   let bestColor;
//   if (
//     (whiteFgColor.limitReached && blackFgColor.limitReached) ||
//     (!whiteFgColor.limitReached && !blackFgColor.limitReached)
//   ) {
//     bestColor = whiteFgColor.iterations <= blackFgColor.iterations ? whiteFgColor : blackFgColor;
//   } else if (blackFgColor.limitReached) {
//     bestColor = whiteFgColor;
//   } else if (whiteFgColor.limitReached) {
//     bestColor = blackFgColor;
//   }
//   return bestColor;
// }

/**
 * If light (`#FFF`) text over the background colour has higher contrast than dark (`#000`) text,
 * keep darkening the background color until `fontLookupAPCA` returns a font size smaller than or
 * equal to the desired size, for the desired font weight. Otherwise, keep lightening the
 * background color until we've reached this point.
 * @param {Object} fgColor - HSL color
 * @param {Object} bgColor - HSL color
 * @param {Boolean} darkenBg - Whether to progressively darken the background color or lighten it
 */
function adjustBackgroundColor(fgColor, bgColor, darkenBg, targetFontSizes, iterations = 0) {
  // if (iterations === 0) {
  //   console.log(`Initial: hsl(${bgColor.hsl.h} ${bgColor.hsl.s}% ${bgColor.hsl.l}%)`);
  // }
  const iterationCount = iterations + 1;
  const currentLightness = parseFloat(bgColor.hsl.l);
  let lightness;
  let limitReached = false;

  // Lighten or darken the target color
  if (darkenBg && currentLightness - 1 >= 0) {
    lightness = currentLightness - 1;
  } else if (!darkenBg && currentLightness + 1 <= 100) {
    lightness = currentLightness + 1;
  } else {
    // Lightness has bottomed out at zero (black) or topped out at 100 (white), so test the contrast
    lightness = currentLightness;
    limitReached = true;
  }
  bgColor.hsl.l = lightness; // Mutate the color

  // APCA reports lightness contrast as an Lc value from Lc 0 to Lc 106 for dark text on a light
  // background, and Lc 0 to Lc -108 for light text on a dark background (dark mode). The minus
  // sign merely indicates negative contrast, which means light text on a dark background.
  // See: https://www.myndex.com/APCA/
  const contrast = calcAPCA(
    `hsl(${getHue(fgColor.hsl.h)} ${getSaturation(fgColor.hsl.s)}% ${fgColor.hsl.l}%)`,
    `hsl(${getHue(bgColor.hsl.h)} ${getSaturation(bgColor.hsl.s)}% ${bgColor.hsl.l}%)`
  );
  const fontSizes = fontLookupAPCA(contrast);

  const passedContrastTest = targetFontSizes.every(size => {
    const fontSize = fontSizes[size.weight / 100];
    // We're assuming that the font size returned by APCA for this font weight represents
    // a minimum value, so it's safe to use font sizes that are smaller than this. However,
    // the https://www.myndex.com/APCA/ tool sometimes says "Usage: small body text only".
    return fontSize <= size.size;
  });

  if (passedContrastTest || limitReached) {
    // console.log(`Final: hsl(${bgColor.hsl.h} ${bgColor.hsl.s}% ${bgColor.hsl.l}%)`);

    // if (limitReached) {
    //   console.warn("Limit reached");
    // }
    return {
      fgColor,
      bgColor,
      contrast,
      iterations: iterationCount,
      limitReached
    };
  }
  return adjustBackgroundColor(fgColor, bgColor, darkenBg, targetFontSizes, iterationCount);
}

function adjustColorContrast({ primary, secondary }) {
  const targetFontSizes = [
    {
      // Meta text (Open Sans font)
      weight: 400,
      size: 16 // px
    },
    {
      // Date text (Literata font)
      weight: 700,
      size: 28 // px
    }
  ];
  // TODO: leave colors as-is when they were manually selected within Sanity? (i.e. do not transform)

  // Let's just generate a dark colour 100% of the time and assume the foreground text will be white
  const whiteOnPrimary = adjustBackgroundColor(white, primary, true, targetFontSizes);
  const whiteOnSecondary = adjustBackgroundColor(white, secondary, true, targetFontSizes);
  // const blackOnPrimary = adjustBackgroundColor(black, primary, false, targetFontSizes);
  // const blackOnSecondary = adjustBackgroundColor(black, secondary, false, targetFontSizes);

  // Select whichever color required fewer iterations to lighten or darken
  // (i.e. the color that was transformed the least)
  // const bestPrimary = findBestColorCombo(blackOnPrimary, whiteOnPrimary);
  // const bestSecondary = findBestColorCombo(blackOnSecondary, whiteOnSecondary);

  // return {
  //   primary: {
  //     fgColor: bestPrimary.fgColor,
  //     bgColor: bestPrimary.bgColor
  //   },
  //   secondary: {
  //     fgColor: bestSecondary.fgColor,
  //     bgColor: bestSecondary.bgColor
  //   }
  // };

  return {
    primary: whiteOnPrimary.bgColor,
    secondary: whiteOnSecondary.bgColor
  };
}

/**
 * Fetches color palette data from a given Sanity document
 * @param {Object} doc - A Sanity document (https://www.sanity.io/docs/document-type)
 * @returns {Object|null} in format: {primaryHex: "", secondaryHex: ""}
 */
export function getDocumentColors({
  swatchName, // Sanity palette name
  swatchColor = "#FF3333", // Sanity palette color
  primaryColor = "#FF3333", // User-chosen color
  secondaryColor = "#600000" // User-chosen color
}) {
  // See: https://www.sanity.io/docs/image-metadata#5bb0c7e96f42
  // const isSanityPalette = swatchName !== "custom" && swatchColor ? true : false;
  const isSanityPalette = swatchName !== "custom";
  let documentColors = null;

  if (isSanityPalette) {
    const complimentary = hexToColor(swatchColor);
    complimentary.hsl.h = getHue(complimentary.hsl.h) + 180;

    documentColors = {
      primary: hexToColor(swatchColor),
      secondary: complimentary
    };
  } else {
    documentColors = {
      primary: hexToColor(primaryColor),
      secondary: hexToColor(secondaryColor)
    };
  }
  const { primary, secondary } = documentColors;

  // console.log("documentColors", {
  //   isSanityPalette,
  //   primary: `hsl(${primary.hsl.h} ${primary.hsl.s}% ${primary.hsl.l}%)`,
  //   secondary: `hsl(${secondary.hsl.h} ${secondary.hsl.s}% ${secondary.hsl.l}%)`,
  //   white: `hsl(${white.hsl.h} ${white.hsl.s}% ${white.hsl.l}%)`,
  //   black: `hsl(${black.hsl.h} ${black.hsl.s}% ${black.hsl.l}%)`
  // });

  if (isSanityPalette) {
    return {
      ...adjustColorContrast(documentColors),
      isSanityPalette
    };
  }
  return { primary, secondary, isSanityPalette };
  // return isSanityPalette ? adjustColorContrast(documentColors) : { primary, secondary };
}
