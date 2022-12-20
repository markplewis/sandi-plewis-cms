// import descriptionField from "../fields/description";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
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
      description: "This will appear in the category page's URL",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    })
    // defineField({
    //   ...descriptionField,
    //   description:
    //     "Optional description to display on the category page. Also used for search engines.",
    //   validation: null
    // })
  ]
});
