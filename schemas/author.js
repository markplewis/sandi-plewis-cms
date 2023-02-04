import blockContentLightFields from "./fields/blockContentLight";
import imageColorFields from "./fields/colors";
import descriptionField from "./fields/description";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "This will appear in the page's URL",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true
      },
      fields: imageColorFields
    }),
    defineField({
      name: "shortBiography",
      title: "Short biography",
      description: "Brief overview that will appear on the home page",
      type: "array",
      of: blockContentLightFields
    }),
    defineField({
      name: "biography",
      title: "Full biography",
      type: "blockContent"
    }),
    defineField(descriptionField)
  ],
  preview: {
    select: {
      title: "name",
      media: "image"
    }
  }
});
