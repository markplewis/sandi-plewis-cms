import React from "react";
import { defineConfig } from "sanity"; // useDocumentOperation
import { deskTool } from "sanity/desk";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { colorInput } from "@sanity/color-input";
import { visionTool } from "@sanity/vision"; // https://www.sanity.io/docs/the-vision-plugin
import { schemaTypes } from "./schemas";
import { structure, defaultDocumentNode } from "./structure";
import ImageWithColorSwatches from "./components/ImageWithColorSwatches";

// TODO: upgrage Pexels to Sanity v3 or wait for this plugin to mature:
// https://github.com/reywright/sanity-plugin-asset-source-stock-images
// https://www.sanity.io/plugins/asset-source-pexels

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID;
const dataset = import.meta.env.SANITY_STUDIO_DATASET;

// // https://www.sanity.io/docs/document-actions#362c883e4421
// export function createAsyncPublishAction(originalAction, context) {
//   const client = context.getClient({ apiVersion });

//   const AsyncPublishAction = props => {
//     const { patch, publish } = useDocumentOperation(props.id, props.type);
//     const [isPublishing, setIsPublishing] = useState(false);
//     // const originalResult = originalAction(props);

//     useEffect(() => {
//       // if the isPublishing state was set to true and the draft has changed
//       // to become `null` the document has been published
//       if (isPublishing && !props.draft) {
//         setIsPublishing(false);
//       }
//     }, [isPublishing, props.draft]);

//     return {
//       disabled: publish.disabled,
//       label: isPublishing ? "Publishing…" : "Publish",
//       onHandle: async () => {
//         setIsPublishing(true);

//         // TODO: it seems like this grabbing the stale values from the saved document instead of the
//         // new values from the current draft. Do I need to somehow `useFormValue()` here instead?
//         // This syncs the `pageColors` field with the source colour fields, but it's always one
//         // edit/save behind.
//         const query = `
//           *[_id == $id][0] {
//             "image": image {
//               colorPalette,
//               primaryColor,
//               secondaryColor,
//               ...asset->{ "palette": metadata.palette }
//             }
//           }
//         `;
//         const doc = await client.fetch(query, { id: context.documentId });
//         const { colorPalette, primaryColor, secondaryColor, palette } = doc?.image ?? {};
//         const swatchName = colorPalette;
//         const pageColors = getPageColors({ swatchName, palette, primaryColor, secondaryColor });

//         patch.execute([{ set: { pageColors } }]);
//         // patch.execute([{ set: { "image.pageColors": pageColors } }]);
//         publish.execute();
//         console.log("Publish pageColors:", pageColors);
//         props.onComplete();
//         // originalResult.onHandle();
//       }
//     };
//   };
//   return AsyncPublishAction;
// }

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
  // document: {
  //   actions: (prev, context) => {
  //     return ["author", "novel", "post", "shortStory"].includes(context.schemaType)
  //       ? prev.map(originalAction =>
  //           originalAction.action === "publish"
  //             ? createAsyncPublishAction(originalAction, context)
  //             : originalAction
  //         )
  //       : prev;
  //   }
  // }
});
