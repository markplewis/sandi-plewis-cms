import { defineField } from "sanity";

const colorPaletteField = defineField({
  title: "Colour palette",
  name: "colorPalette",
  description: `Colours will be extracted from the photo unless you choose "custom", in which case you'll be able to select your own colours`,
  type: "string",
  options: {
    // See: https://www.sanity.io/docs/image-metadata#5bb0c7e96f42
    list: [
      { title: "Dominant", value: "dominant" },
      { title: "Vibrant", value: "vibrant" },
      { title: "Light Vibrant", value: "lightVibrant" },
      { title: "Dark Vibrant", value: "darkVibrant" },
      { title: "Muted", value: "muted" },
      { title: "Light Muted", value: "lightMuted" },
      { title: "Dark Muted", value: "darkMuted" },
      { title: "Custom", value: "custom" }
    ]
  }
});

const primaryColorField = defineField({
  name: "primaryColor",
  title: "Primary colour",
  type: "color",
  options: {
    disableAlpha: true
  },
  // See: https://github.com/sanity-io/color-input/issues/12
  // initialValue: "#FF3333",
  // hidden: ({ parent }) => parent?.image?.colorPalette !== "custom"
  hidden: ({ document }) => document?.image?.colorPalette !== "custom"
});

const secondaryColorField = defineField({
  name: "secondaryColor",
  title: "Secondary colour",
  type: "color",
  options: {
    disableAlpha: true
  },
  hidden: ({ document }) => document?.image?.colorPalette !== "custom"
});

const pageColorsField = defineField({
  title: "Page colors",
  name: "pageColors",
  type: "object",
  hidden: true,
  fields: [
    {
      name: "primary",
      type: "object",
      fields: [
        { name: "r", type: "number" },
        { name: "g", type: "number" },
        { name: "b", type: "number" },
        { name: "h", type: "number" },
        { name: "s", type: "number" },
        { name: "l", type: "number" }
      ]
    },
    {
      name: "secondary",
      type: "object",
      fields: [
        { name: "r", type: "number" },
        { name: "g", type: "number" },
        { name: "b", type: "number" },
        { name: "h", type: "number" },
        { name: "s", type: "number" },
        { name: "l", type: "number" }
      ]
    }
  ]
});

const imageColorFields = [
  primaryColorField,
  secondaryColorField,
  colorPaletteField,
  pageColorsField
];

export default imageColorFields;
