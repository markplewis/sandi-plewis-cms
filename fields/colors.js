const colorFields = [
  {
    title: "Colour palette",
    name: "colorPalette",
    description: `Colours will be extracted from the photo unless you choose "custom", in which case you'll be able to select your own colours`,
    type: "string",
    options: {
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
  },
  {
    name: "primaryColor",
    title: "Primary colour",
    type: "color",
    hidden: ({ parent }) => parent?.colorPalette !== "custom"
  },
  {
    name: "secondaryColor",
    title: "Secondary colour",
    type: "color",
    hidden: ({ parent }) => parent?.colorPalette !== "custom"
  }
];
export default colorFields;
