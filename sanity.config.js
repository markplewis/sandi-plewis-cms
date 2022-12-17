import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure, defaultDocumentNode } from "./structure";
// https://www.sanity.io/plugins/color-input
import { colorInput } from "@sanity/color-input";
// https://www.sanity.io/plugins/sanity-plugin-asset-source-unsplash
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";

// TODO: upgrage Pexels to Sanity v3:
// https://www.sanity.io/plugins/asset-source-pexels

// See: https://www.sanity.io/docs/config-api-reference

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID;
const dataset = import.meta.env.SANITY_STUDIO_DATASET;

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
  schema: {
    types: schemaTypes
  }
});
