import blockContentLightFields from "../fields/blockContentLight";
import colorFields from "../fields/colors";
import descriptionField from "../fields/description";

const AuthorSchema = {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: Rule => Rule.required()
    },
    {
      name: "slug",
      title: "Slug",
      description: "This will appear in the page's URL",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    ...colorFields,
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true
      }
    },
    {
      name: "shortBiography",
      title: "Short biography",
      description: "Brief overview that will appear on the home page",
      type: "array",
      of: blockContentLightFields
    },
    {
      name: "biography",
      title: "Full biography",
      type: "blockContent"
    },
    descriptionField
  ],
  preview: {
    select: {
      title: "name",
      media: "image"
    }
  }
};
export default AuthorSchema;
