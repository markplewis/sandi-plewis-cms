import { LinkIcon } from "@sanity/icons";
import { defineArrayMember, defineField } from "sanity";

const blockContentLightFields = [
  defineArrayMember({
    title: "Block",
    type: "block",
    styles: [{ title: "Normal", value: "normal" }],
    lists: [
      { title: "Bullet", value: "bullet" },
      { title: "Numbered", value: "number" }
    ],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
        { title: "Underline", value: "underline" },
        { title: "Strike", value: "strike-through" }
      ],
      annotations: [
        {
          title: "URL",
          name: "link",
          type: "object",
          fields: [
            defineField({
              title: "URL",
              name: "href",
              type: "url"
            })
          ]
        },
        {
          title: "Internal link",
          name: "internalLink",
          type: "object",
          icon: LinkIcon,
          fields: [
            defineField({
              name: "reference",
              type: "reference",
              to: [{ type: "post" }, { type: "novel" }, { type: "shortStory" }]
            })
          ]
        }
      ]
    }
  })
];

export default blockContentLightFields;
