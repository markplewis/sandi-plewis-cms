import React from "react";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { colorInput } from "@sanity/color-input";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure, defaultDocumentNode } from "./structure";
import ImageWithColorSwatches from "./components/ImageWithColorSwatches";

// TODO: upgrage Pexels to Sanity v3 or wait for this plugin to mature:
// https://github.com/reywright/sanity-plugin-asset-source-stock-images
// https://www.sanity.io/plugins/asset-source-pexels

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;

// See: https://www.sanity.io/docs/config-api-reference

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
          <ImageWithColorSwatches {...props} />
        ) : (
          props.renderDefault(props)
        )
    }
  }
});
