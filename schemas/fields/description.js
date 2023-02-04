// Intentionally not wrapped in a `defineField()` so that `description` can be overridden

const descriptionField = {
  name: "description",
  title: "Short description",
  description: "For search engines",
  type: "text",
  rows: 4,
  validation: Rule => Rule.required()
};

export default descriptionField;
