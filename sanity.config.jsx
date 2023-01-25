import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { defineConfig, useFormValue } from "sanity";
import { deskTool } from "sanity/desk";

// https://www.sanity.io/plugins/sanity-plugin-asset-source-unsplash
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";

// https://www.sanity.io/plugins/color-input
import { colorInput } from "@sanity/color-input";
import { Avatar, Inline } from "@sanity/ui";

// https://www.sanity.io/docs/the-vision-plugin
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure, defaultDocumentNode } from "./structure";
import useSanityClient from "./lib/useSanityClient";
import { getDocumentColors } from "./utils/color";

// TODO: upgrage Pexels to Sanity v3:
// https://www.sanity.io/plugins/asset-source-pexels

// See: https://www.sanity.io/docs/config-api-reference

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID;
const dataset = import.meta.env.SANITY_STUDIO_DATASET;
const apiVersion = import.meta.env.SANITY_STUDIO_VERSION;

const defaultSwatchColor = "#fff";

function usePageColors({ colorPalette, primaryColor, secondaryColor, image }) {
  const [palette, setPalette] = useState();
  const swatchName = colorPalette; // Selected by user
  const [swatchColor, setSwatchColor] = useState();
  const [pageColors, setPageColors] = useState();
  const client = useSanityClient();

  useEffect(() => {
    if (image) {
      const getPalette = () =>
        client.fetch(`*[_id == $id][0].metadata.palette`, { id: image }).then(setPalette);
      getPalette();
    }
  }, [client, image]);

  useEffect(() => {
    if (palette && swatchName) {
      setSwatchColor(palette[swatchName]?.background || defaultSwatchColor);
    }
  }, [palette, swatchName]);

  useEffect(() => {
    if (!swatchColor || (!primaryColor?.hex && secondaryColor?.hex)) {
      return;
    }
    const { primary, secondary } = getDocumentColors({
      swatchName,
      swatchColor,
      primaryColor: primaryColor?.hex,
      secondaryColor: secondaryColor?.hex
    });

    // console.log("pageColors", {
    //   isSanityPalette,
    //   // hsl: {
    //   //   primary: `hsl(${primary.hsl.h} ${primary.hsl.s}% ${primary.hsl.l}%)`,
    //   //   secondary: `hsl(${secondary.hsl.h} ${secondary.hsl.s}% ${secondary.hsl.l}%)`
    //   // },
    //   // rgb: {
    //   primary: `rgb(${primary.srgb.r * 100}% ${primary.srgb.g * 100}% ${primary.srgb.b * 100}%)`,
    //   secondary: `rgb(${secondary.srgb.r * 100}% ${secondary.srgb.g * 100}% ${
    //     secondary.srgb.b * 100
    //   }%)`
    //   // }
    // });

    setPageColors({
      primary: {
        // Convert colorjs.io RGB values into percentages
        r: primary.srgb.r * 100,
        g: primary.srgb.g * 100,
        b: primary.srgb.b * 100
      },
      secondary: {
        r: secondary.srgb.r * 100,
        g: secondary.srgb.g * 100,
        b: secondary.srgb.b * 100
      }
    });
  }, [primaryColor?.hex, secondaryColor?.hex, swatchColor, swatchName]);

  return pageColors;
}

const ListWithSwatch = props => {
  const { value, renderDefault } = props;
  const pageColors = usePageColors({
    colorPalette: value?.colorPalette ?? "vibrant",
    primaryColor: value?.primaryColor,
    secondaryColor: value?.secondaryColor,
    image: useFormValue(["image"])?.asset?._ref
  });
  return (
    <Inline space={3}>
      {renderDefault(props)}
      {/* {value?.colorPalette !== "custom" && pageColors ? ( */}
      {pageColors ? (
        <>
          <Avatar
            style={{
              // colorjs.io RGB values should be treated as percentages, not numbers
              backgroundColor: `rgb(${pageColors.primary.r}% ${pageColors.primary.g}% ${pageColors.primary.b}%)`,
              display: "inline-block",
              marginRight: "-6px"
            }}
          />
          <Avatar
            style={{
              backgroundColor: `rgb(${pageColors.secondary.r}% ${pageColors.secondary.g}% ${pageColors.secondary.b}%)`,
              display: "inline-block"
            }}
          />
        </>
      ) : null}
    </Inline>
  );
};
ListWithSwatch.propTypes = {
  value: PropTypes.object,
  renderDefault: PropTypes.func
};

function createAsyncPublishAction(originalAction, context) {
  console.log(`createAsyncPublishAction: ${originalAction.action}`);
  const client = context.getClient({ apiVersion });
  // console.log("context", context);

  client.fetch(`*[_id == $id][0]`, { id: context.documentId }).then(doc => {
    console.log(doc);
  });

  const AsyncPublishAction = props => {
    const originalResult = originalAction(props);
    // console.log("originalResult", originalResult);

    // const pageColors = usePageColors({
    //   colorPalette: value?.colorPalette ?? "vibrant",
    //   primaryColor: value?.primaryColor,
    //   secondaryColor: value?.secondaryColor,
    //   image: useFormValue(["image"])?.asset?._ref
    // });
    return originalResult;

    // return {
    //   ...originalResult,
    //   onHandle: async () => {
    //     await client
    //       .patch(context.documentId)
    //       // Data model must match https://www.sanity.io/plugins/color-input
    //       .set({
    //         primaryColor: {
    //           _type: "color",
    //           hex: primaryColor.hex,
    //           alpha: 1,
    //           hsl: {
    //             _type: "hslaColor",
    //             h: primaryColor.hsl.h,
    //             s: primaryColor.hsl.s,
    //             l: primaryColor.hsl.l,
    //             a: 1
    //           },
    //           hsv: {
    //             _type: "hsvaColor",
    //             h: primaryColor.hsv.h,
    //             s: primaryColor.hsv.s,
    //             v: primaryColor.hsv.v,
    //             a: 1
    //           },
    //           rgb: {
    //             _type: "rgbaColor",
    //             r: primaryColor.rgb.r,
    //             g: primaryColor.rgb.g,
    //             b: primaryColor.rgb.b,
    //             a: 1
    //           }
    //         },
    //         secondaryColor: {
    //           _type: "color",
    //           hex: secondaryColor.hex,
    //           alpha: 1,
    //           hsl: {
    //             _type: "hslaColor",
    //             h: secondaryColor.hsl.h,
    //             s: secondaryColor.hsl.s,
    //             l: secondaryColor.hsl.l,
    //             a: 1
    //           },
    //           hsv: {
    //             _type: "hsvaColor",
    //             h: secondaryColor.hsv.h,
    //             s: secondaryColor.hsv.s,
    //             v: secondaryColor.hsv.v,
    //             a: 1
    //           },
    //           rgb: {
    //             _type: "rgbaColor",
    //             r: secondaryColor.rgb.r,
    //             g: secondaryColor.rgb.g,
    //             b: secondaryColor.rgb.b,
    //             a: 1
    //           }
    //         }
    //       })
    //       .commit();
    //     await client
    //       .fetch(`*[_id == '${context.documentId}'][0]{ primaryColor, secondaryColor }`)
    //       .then(res => console.log(res));
    //     originalResult.onHandle();
    //   }
    // };
  };
  return AsyncPublishAction;
}

export default defineConfig({
  name: "default",
  title: "Sandi Plewis' Blog",
  projectId,
  dataset,
  plugins: [
    deskTool({
      structure,
      defaultDocumentNode
    }),
    visionTool(),
    colorInput(),
    unsplashImageAsset()
  ],
  // https://www.sanity.io/docs/schema-types
  schema: {
    types: schemaTypes
  },
  // Customize the `colorPalette` form component by adding color swatches to reflect the
  // palette that's currently selected. See: https://www.sanity.io/docs/component-api
  form: {
    components: {
      // TODO: why is `schemaType.name` "string" instead of "image"?
      input: props =>
        ["Main image", "Image"].includes(props.schemaType?.title) ? (
          <ListWithSwatch {...props} />
        ) : (
          props.renderDefault(props)
        )
    }
  },
  document: {
    actions: (prev, context) =>
      prev.map(originalAction =>
        originalAction.action === "publish"
          ? createAsyncPublishAction(originalAction, context)
          : originalAction
      )
  }
});
