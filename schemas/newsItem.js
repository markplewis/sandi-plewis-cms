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
      name: "overview",
      title: "Overview",
      description:
        "Brief overview that will appear at the top of the page and also on the home page when this news item is featured",
      type: "blockContent"
    }),
    defineField({
      name: "body",
      title: "Body",
      description: "The news item's main content",
      type: "blockContent"
    }),
    defineField({
      ...descriptionField,
      description:
        "Used when linking to this news item from other pages and also for search engines"
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
