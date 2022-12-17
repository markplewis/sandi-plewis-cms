import { defineCliConfig } from "sanity/cli";

// https://www.sanity.io/docs/cli
// https://www.sanity.io/docs/cli-reference

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET
  },
  reactStrictMode: true
});
