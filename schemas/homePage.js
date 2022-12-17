import descriptionField from "../fields/description";

// This schema is a "singleton". See:
// https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list

const HomePageSchema = {
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      hidden: true
    },
    {
      name: "novel",
      title: "Featured novel",
      description: "A novel to feature on the home page",
      type: "reference",
      to: { type: "novel" }
    },
    {
      name: "reviews",
      title: "Featured reviews",
      description: "One or two of the featured novel's reviews",
      type: "array",
      of: [{ type: "reference", to: { type: "review" } }],
      validation: Rule => Rule.unique().max(2)
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: { type: "author" }
    },
    descriptionField
  ],
  initialValue: {
    name: "Home page"
  }
};
export default HomePageSchema;
