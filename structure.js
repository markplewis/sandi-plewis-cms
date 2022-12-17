// Icons:
// https://www.sanity.io/docs/icons-for-data-types
// https://icons.sanity.build/all
import {
  // EyeOpenIcon,
  EditIcon
} from "@sanity/icons";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineUser,
  HiOutlineDocumentText,
  HiOutlineFolderOpen,
  HiOutlineStar
} from "react-icons/hi";

// Structure Builder: https://www.sanity.io/docs/structure-builder-reference
// Note: context includes `currentUser` and the client

// TODO: figure out how to implement page previews
// See: https://github.com/sanity-io/nextjs-blog-cms-sanity-v3/blob/main/sanity.config.ts

function splitPaneViews(S, listItem, title, schema, Icon) {
  return listItem
    .title(title)
    .schemaType(schema)
    .icon(Icon)
    .child(
      S.documentTypeList(schema)
        .title(title)
        .child(documentId =>
          S.document()
            .documentId(documentId)
            .schemaType(schema)
            .views([
              S.view.form().icon(EditIcon)
              // TODO: figure out how to implement page previews
              // S.view.component(IframePreview).icon(EyeIcon).title("Web Preview")
            ])
        )
    );
}

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
      ...S.documentTypeListItems()
        .filter(listItem => {
          return listItem.getId() !== "homePage";
        })
        .map(listItem => {
          switch (listItem.getId()) {
            case "author":
              return splitPaneViews(S, listItem, "Authors", "author", HiOutlineUser);
            case "category":
              return splitPaneViews(S, listItem, "Categories", "category", HiOutlineFolderOpen);
            case "novel":
              return splitPaneViews(S, listItem, "Novels", "novel", HiOutlineBookOpen);
            case "shortStory":
              return splitPaneViews(S, listItem, "Short stories", "shortStory", HiOutlineBookOpen);
            case "post":
              return splitPaneViews(S, listItem, "Posts", "post", HiOutlineDocumentText);
            case "review":
              return listItem.title("Reviews").icon(HiOutlineStar);
            default:
              return listItem;
          }
        })
    ]);

export const defaultDocumentNode = S => {
  return S.document().views([
    S.view.form()
    // S.view.component(JsonView).title('JSON')
  ]);
};
