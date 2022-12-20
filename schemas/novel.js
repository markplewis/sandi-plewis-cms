// import client from "../client";
import colorFields from "../fields/colors";
import descriptionField from "../fields/description";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "novel",
  title: "Novel",
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
        // defineField({
        //   title: "Caption",
        //   description: "An optional caption to display alongside the photo",
        //   name: "caption",
        //   type: "text",
        //   rows: 3
        // })
      ]
    }),
    // defineField({
    //   name: "images",
    //   title: "Images",
    //   type: "array",
    //   options: {
    //     layout: "grid"
    //   },
    //   of: [
    //     {
    //       name: "image",
    //       title: "Image",
    //       type: "image",
    //       options: {
    //         hotspot: true
    //       },
    //       fields: [
    //         defineField({
    //           title: "Alternative Text",
    //           description: "A short description of the photo (for screen readers)",
    //           name: "alt",
    //           type: "string",
    //           validation: Rule => Rule.required()
    //         }),
    //         defineField({
    //           title: "Caption",
    //           description: "An optional caption to display alongside the photo",
    //           name: "caption",
    //           type: "text",
    //           rows: 3
    //         }),
    //         defineField({
    //           title: "Link URL",
    //           description: "URL of the page this image should link to",
    //           name: "url",
    //           type: "url"
    //         })
    //       ]
    //     }
    //   ]
    // }),

    // See: https://www.sanity.io/docs/block-type
    // defineField({
    //   name: "overview",
    //   title: "Home page overview",
    //   description: "A brief overview that will appear when this novel is featured on the home page",
    //   type: "array",
    //   of: [{ type: "block" }]
    // }),
    defineField({
      name: "overview",
      title: "Overview",
      description:
        "Brief overview that will appear at the top of the page and also on the home page when this novel is featured",
      type: "blockContent"
    }),
    defineField({
      name: "body",
      title: "Body",
      description: "The novel's synopsis, etc.",
      type: "blockContent"
    }),
    defineField({
      ...descriptionField,
      description: "Used when linking to this novel from other pages and also for search engines"
    })
  ],

  // TODO: migrate to Initial Value Templates: https://www.sanity.io/docs/initial-value-templates
  // See: https://www.sanity.io/guides/getting-started-with-initial-values-for-new-documents
  // And: https://www.sanity.io/docs/query-cheat-sheet
  // initialValue: async () => ({
  //   author: await client.fetch(`
  //     *[_type == "author"][0]{
  //       "_type": "reference",
  //       "_ref": _id
  //     }
  //   `)
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
