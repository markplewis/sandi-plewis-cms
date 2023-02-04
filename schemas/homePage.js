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
      name: "novel",
      title: "Featured novel",
      description: "A novel to feature on the home page",
      type: "reference",
      to: { type: "novel" }
    }),
    defineField({
      name: "reviews",
      title: "Featured reviews",
      description: "One or two of the featured novel's reviews",
      type: "array",
      of: [{ type: "reference", to: { type: "review" } }],
      validation: Rule => Rule.unique().max(2)
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
