import { AiOutlineLine, AiOutlinePaperClip } from "react-icons/ai";

// This is the schema definition for the rich text fields in our application. When this schema
// is imported into `schema.js`, it can be referenced by `name` in other document schemas, for
// example: `fields: [{ name: "biography", title: "Biography", type: "blockContent" }]`

const BlockContentSchema = {
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    {
      title: "Block",
      type: "block",
      // Styles let you define how your users can mark up blocks. The following styles correspond to
      // HTML elements, but you can define any title or value you want, and decide how to deal with
      // it however you like. See: https://www.sanity.io/docs/configuration
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Heading 5", value: "h5" },
        { title: "Heading 6", value: "h6" },
        { title: "Quote", value: "blockquote" }
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" }
      ],
      // Marks let you mark up inline text in the block editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" }
        ],
        // Annotations can be any object structure – e.g. a link or a footnote
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url"
              }
            ]
          },
          {
            title: "Internal link",
            name: "internalLink",
            type: "object",
            blockEditor: {
              icon: AiOutlinePaperClip
            },
            fields: [
              {
                name: "reference",
                type: "reference",
                to: [{ type: "post" }, { type: "novel" }, { type: "shortStory" }]
              }
            ]
          }
          // {
          //   title: "Break",
          //   name: "break",
          //   type: "object",
          //   blockEditor: {
          //     icon: AiOutlineLine
          //   },
          //   fields: [
          //     {
          //       name: "style",
          //       type: "string",
          //       options: {
          //         list: ["lineBreak", "readMore"]
          //       }
          //     }
          //   ]
          // }
        ]
      }
    },
    // You can add additional types here. Note that you can't use primitive types such as
    // `string` and `number` in the same array as a block type.
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          title: "Alternative Text",
          description: "A short description of the photo (for screen readers)",
          name: "alt",
          type: "string",
          validation: Rule => Rule.required(),
          // TODO: The "options.isHighlighted" property is deprecated. You can put fields behind a collapsed fieldset if you want to hide them from plain sight.
          // options: {
          //   isHighlighted: true
          // }
        },
        {
          title: "Caption",
          description: "An optional caption to display alongside the photo",
          name: "caption",
          type: "text",
          rows: 3
          // options: {
          //   isHighlighted: true
          // }
        },
        // {
        //   title: "Orientation",
        //   name: "orientation",
        //   type: "string",
        //   options: {
        //     list: [
        //       { title: "Landscape", value: "landscape" },
        //       { title: "Portrait", value: "portrait" },
        //       { title: "Square", value: "square" }
        //     ],
        //     layout: "radio", // Defaults to "dropdown"
        //     isHighlighted: true
        //   }
        // },
        {
          title: "Alignment",
          name: "alignment",
          type: "string",
          options: {
            list: [
              { title: "Left", value: "left" },
              { title: "Right", value: "right" },
              { title: "Center", value: "center" }
            ],
            layout: "radio" // Defaults to "dropdown"
            // isHighlighted: true
          }
        }
      ]
    },
    {
      title: "Break",
      name: "break",
      type: "object",
      icon: AiOutlineLine,
      fields: [
        {
          name: "style",
          type: "string",
          options: {
            list: [
              { title: "Line break (thin)", value: "thin" },
              { title: "Line break (thick)", value: "thick" }
            ]
          }
        }
      ]
    }
  ]
};
export default BlockContentSchema;
