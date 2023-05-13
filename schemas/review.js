import { defineField, defineType } from "sanity";

export default defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string"
    }),
    defineField({
      name: "text",
      title: "Review",
      type: "text",
      rows: 4,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: "author",
      title: "Author of the review",
      type: "string"
    }),
    defineField({
      name: "novel",
      title: "Novel that was reviewed",
      type: "reference",
      to: { type: "novel" }
    })
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      novel: "novel.title"
    },
    prepare(selection) {
      const { title, author, novel } = selection;
      return Object.assign({}, selection, {
        title: title,
        subtitle: [author && `by ${author}`, novel && `(${novel})`].filter(v => v).join(" ")
      });
    }
  }
});
