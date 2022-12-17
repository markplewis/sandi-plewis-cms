// import descriptionField from "../fields/description";

const CategorySchema = {
  name: "category",
  title: "Category",
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
      description: "This will appear in the category page's URL",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }
    // {
    //   ...descriptionField,
    //   description:
    //     "Optional description to display on the category page. Also used for search engines.",
    //   validation: null
    // }
  ]
};
export default CategorySchema;
