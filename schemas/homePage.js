import descriptionField from "./fields/description";
import { defineField, defineType } from "sanity";

// This schema is a "singleton". See:
// https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

export default defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      hidden: true
    }),
    defineField({
      name: "featuredItem",
      title: "Featured item",
      description: "An item to feature on the home page",
      type: "reference",
      to: [{ type: "novel" }, { type: "newsItem" }]
    }),
    defineField({
      name: "reviews",
      title: "Featured reviews",
      description: "A few of the featured novel's reviews",
      type: "array",
      of: [{ type: "reference", to: { type: "review" } }],
      validation: Rule => Rule.unique().max(3)
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" }
    }),
    defineField(descriptionField)
  ],
  initialValue: {
    name: "Home page"
  }
});
