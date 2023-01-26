import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { defineConfig, useDocumentOperation, useFormValue } from "sanity";
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

function getPageColors({ swatchName, palette, primaryColor, secondaryColor }) {
  const swatchColor = palette?.[swatchName]?.background;

  if (!swatchColor && !primaryColor?.hex && !secondaryColor?.hex) {
    console.log("No colors to work with", { swatchColor, primaryColor, secondaryColor });
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

  return {
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
  };
}

function usePageColors(props = {}) {
  const { colorPalette = "", primaryColor = {}, secondaryColor = {}, image = "" } = props;
  const [palette, setPalette] = useState();
  const swatchName = colorPalette; // Selected by user
  const client = useSanityClient();

  useEffect(() => {
    if (image) {
      const getPalette = () =>
        client.fetch(`*[_id == $id][0].metadata.palette`, { id: image }).then(setPalette);
      getPalette();
    }
  }, [client, image]);

  const pageColors = useMemo(() => {
    return getPageColors({ swatchName, palette, primaryColor, secondaryColor });
  }, [palette, primaryColor, secondaryColor, swatchName]);

  return pageColors;
}

// TODO: figure out why this error occurs when creating a new post and uploading a new photo:
// Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
//     at ListWithSwatch (http://localhost:3333/sanity.config.jsx:106:5)

const ListWithSwatch = props => {
  // const { changed, value, renderDefault } = props;
  const { value, renderDefault } = props;
  const image = useFormValue(["image"])?.asset?._ref;

  const pageColors = usePageColors({
    colorPalette: value?.colorPalette ?? "vibrant",
    primaryColor: value?.primaryColor,
    secondaryColor: value?.secondaryColor,
    image
  });
  // const pageColors = usePageColors(
  //   changed
  //     ? {
  //         colorPalette: value?.colorPalette ?? "vibrant",
  //         primaryColor: value?.primaryColor,
  //         secondaryColor: value?.secondaryColor,
  //         image
  //       }
  //     : {}
  // );
  useEffect(() => pageColors && console.log("onChange pageColors:", pageColors), [pageColors]);

  return (
    <Inline space={3}>
      {renderDefault(props)}
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

export function createAsyncPublishAction(originalAction, context) {
  const client = context.getClient({ apiVersion });

  const AsyncPublishAction = props => {
    const { patch, publish } = useDocumentOperation(props.id, props.type);
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
      // if the isPublishing state was set to true and the draft has changed
      // to become `null` the document has been published
      if (isPublishing && !props.draft) {
        setIsPublishing(false);
      }
    }, [isPublishing, props.draft]);

    return {
      disabled: publish.disabled,
      label: isPublishing ? "Publishing…" : "Publish",
      onHandle: async () => {
        setIsPublishing(true);

        const query = `
          *[_id == $id][0] {
            "image": image {
              colorPalette,
              primaryColor,
              secondaryColor,
              ...asset->{ "palette": metadata.palette }
            }
          }
        `;
        const doc = await client.fetch(query, { id: context.documentId });
        const { colorPalette, primaryColor, secondaryColor, palette } = doc?.image ?? {};
        const swatchName = colorPalette;
        const pageColors = getPageColors({ swatchName, palette, primaryColor, secondaryColor });
        console.log("onPublish pageColors:", pageColors);

        // TODO: save page colors instead of changing publish date
        patch.execute([{ set: { publishedAt: new Date().toISOString() } }]);
        publish.execute();
        props.onComplete();
      }
    };
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
    actions: (prev, context) => {
      return context.schemaType === "post"
        ? prev.map(originalAction =>
            originalAction.action === "publish"
              ? createAsyncPublishAction(originalAction, context)
              : originalAction
          )
        : prev;
    }
  }
});
