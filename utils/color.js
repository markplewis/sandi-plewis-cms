import Color from "colorjs.io";

function hexToColor(hexColor = "") {
  if (!hexColor) {
    return;
  }
  let color;
  try {
    color = new Color(hexColor);
  } catch (e) {
    console.error(e);
  }
  return color;
}

// Hue and saturation may be NaN if the color is achromatic or fully desaturated (i.e. greyscale)
function getHue(h) {
  return !h || Number.isNaN(h) ? 0 : h;
}

/**
 * Fetches color palette data from a given Sanity document
 * @param {Object} doc - A Sanity document (https://www.sanity.io/docs/document-type)
 * @returns {Object|null} in format: {primaryHex: "", secondaryHex: ""}
 */
export function getDocumentColors({
  swatchName = "", // Sanity palette name
  swatchColor = "", // Sanity palette hex color
  primaryColor = "", // User-chosen hex color
  secondaryColor = "" // User-chosen hex color
}) {
  // console.log("getDocumentColors", {
  //   swatchName,
  //   swatchColor,
  //   primaryColor,
  //   secondaryColor
  // });
  // See: https://www.sanity.io/docs/image-metadata#5bb0c7e96f42
  const isCustomPalette = swatchName === "custom";
  let documentColors = {};

  if (isCustomPalette) {
    documentColors = {
      primary: hexToColor(primaryColor),
      secondary: hexToColor(secondaryColor)
    };
  } else {
    // Generate a complimentary color
    // See: https://www.sarasoueidan.com/blog/hex-rgb-to-hsl/#hsl-and-color-harmonies
    const complimentary = hexToColor(swatchColor);
    if (complimentary?.hsl?.h) {
      complimentary.hsl.h = getHue(complimentary.hsl.h) + 180;
    }
    documentColors = {
      primary: hexToColor(swatchColor),
      secondary: complimentary
    };
  }
  // console.log("documentColors", documentColors);
  return documentColors;
}

export function getPageColors({
  swatchName = "",
  palette = {},
  primaryColor = {},
  secondaryColor = {}
}) {
  const swatchColor = palette?.[swatchName]?.background;

  if (!swatchColor && !primaryColor?.hex && !secondaryColor?.hex) {
    return;
  }
  const { primary, secondary } = getDocumentColors({
    swatchName,
    swatchColor,
    primaryColor: primaryColor?.hex,
    secondaryColor: secondaryColor?.hex
  });

  if (!primary || !secondary) {
    return;
  }
  return {
    primary: {
      // Convert colorjs.io RGB values into percentages
      r: primary.srgb.r * 100,
      g: primary.srgb.g * 100,
      b: primary.srgb.b * 100,
      h: primary.hsl.h,
      s: primary.hsl.s,
      l: primary.hsl.l
    },
    secondary: {
      r: secondary.srgb.r * 100,
      g: secondary.srgb.g * 100,
      b: secondary.srgb.b * 100,
      h: secondary.hsl.h,
      s: secondary.hsl.s,
      l: secondary.hsl.l
    }
  };
}
