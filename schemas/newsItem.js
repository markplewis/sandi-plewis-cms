import imageColorFields from "./fields/colors";
import descriptionField from "./fields/description";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsItem",
  title: "News item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "This will appear in the page's URL",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime"
    }),
    defineField({
      name: "image",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          title: "Alternative Text",
          description: "A short description of the photo (for screen readers)",
          name: "alt",
          type: "string",
          validation: Rule => Rule.required()
        }),
        ...imageColorFields
      ]
    }),
    defineField({
      ...descriptionField,
      description: "Used when linking to this post from another page and also for search engines"
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent"
    })
  ],
  initialValue: async (props, context) => {
    return {
      publishedAt: new Date().toISOString(),
      image: { colorPalette: "dominant" }
    };
  },
  preview: {
    select: {
      title: "title",
      media: "image"
    }
  }
});
