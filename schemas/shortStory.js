import imageColorFields from "./fields/colors";
import descriptionField from "./fields/description";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "shortStory",
  title: "Short story",
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
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" }
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
      description: "Brief overview that will appear at the top of the page",
      type: "blockContent"
    }),
    defineField({
      name: "body",
      title: "Body",
      description: "Detailed information about the short story",
      type: "blockContent"
    }),
    defineField({
      ...descriptionField,
      description:
        "Used when linking to this short story from other pages and also for search engines"
    })
  ],
  initialValue: async (props, context) => {
    const { getClient } = context;
    const client = getClient({ apiVersion: import.meta.env.SANITY_STUDIO_VERSION });
    return {
      author: await client.fetch(`
        *[_type == "author"][0]{
          "_type": "reference",
          "_ref": _id
        }
      `)
    };
  },
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "image"
    },
    prepare(selection) {
      const { author } = selection;
      return Object.assign({}, selection, {
        subtitle: author && `by ${author}`
      });
    }
  }
});
