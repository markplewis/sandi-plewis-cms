// import client from "../client";
import colorFields from "../fields/colors";
import descriptionField from "../fields/description";

const ShortStorySchema = {
  name: "shortStory",
  title: "Short story",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: Rule => Rule.required()
    },
    {
      name: "slug",
      title: "Slug",
      description: "This will appear in the page's URL",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" }
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime"
    },
    ...colorFields,
    {
      name: "image",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true
      },
      fields: [
        {
          title: "Alternative Text",
          description: "A short description of the photo (for screen readers)",
          name: "alt",
          type: "string",
          validation: Rule => Rule.required()
          // options: {
          //   isHighlighted: true
          // }
        }
      ]
    },
    {
      name: "overview",
      title: "Overview",
      description: "Brief overview that will appear at the top of the page",
      type: "blockContent"
    },
    {
      name: "body",
      title: "Body",
      description: "Detailed information about the short story",
      type: "blockContent"
    },
    {
      ...descriptionField,
      description:
        "Used when linking to this short story from other pages and also for search engines"
    }
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
};
export default ShortStorySchema;
