// import client from "../client";
import colorFields from "../fields/colors";
import descriptionField from "../fields/description";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
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
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
      validation: Rule => Rule.unique()
    }),
    ...colorFields,
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
        })
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

  // TODO: migrate to Initial Value Templates: https://www.sanity.io/docs/initial-value-templates
  // See: https://www.sanity.io/guides/getting-started-with-initial-values-for-new-documents
  // And: https://www.sanity.io/docs/query-cheat-sheet
  // initialValue: async () => ({
  //   publishedAt: new Date().toISOString(),
  //   // First author in the database
  //   author: await client.fetch(`
  //     *[_type == "author"][0]{
  //       "_type": "reference",
  //       "_ref": _id
  //     }
  //   `),
  //   colorPalette: "dominant"
  // }),

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
