// Icons:
// https://www.sanity.io/docs/icons-for-data-types
// https://icons.sanity.build/all
import {
  // EyeOpenIcon,
  EditIcon
} from "@sanity/icons";
import {
  HiOutlineHome
  // HiOutlineBookOpen,
  // HiOutlineUser,
  // HiOutlineDocumentText,
  // HiOutlineFolderOpen,
  // HiOutlineStar
} from "react-icons/hi";

// Structure Builder: https://www.sanity.io/docs/structure-builder-reference
// Note: context includes `currentUser` and the client

// TODO: figure out how to implement page previews
// See: https://github.com/sanity-io/nextjs-blog-cms-sanity-v3/blob/main/sanity.config.ts

export const structure = (S, context) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Home page")
        .schemaType("homePage")
        .icon(HiOutlineHome)
        .child(
          S.document()
            .documentId("homePage")
            .schemaType("homePage")
            .views([
              S.view.form().icon(EditIcon)
              // S.view.component(IframePreview).icon(EyeIcon).title("Web Preview")
            ])
        ),
      ...S.documentTypeListItems().filter(listItem => {
        return listItem.getId() !== "homePage";
      })
    ]);

export const defaultDocumentNode = S => {
  return S.document().views([
    S.view.form()
    // S.view.component(JsonView).title('JSON')
  ]);
};

// export const structure = (S, context) =>
//   S.list()
//     .title('Content')
//     .items([
//       S.listItem()
//         .title('Settings')
//         .child(
//           S.document()
//             .schemaType('siteSettings')
//             .documentId('siteSettings')
//         ),
//       ...S.documentTypeListItems()
//     ])
