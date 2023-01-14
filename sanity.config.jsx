import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { defineConfig, useFormValue } from "sanity";
import { deskTool } from "sanity/desk";
// https://www.sanity.io/plugins/sanity-plugin-asset-source-unsplash
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
// https://www.sanity.io/plugins/color-input
import { colorInput } from "@sanity/color-input";
import { Avatar, Inline } from "@sanity/ui";
// https://www.sanity.io/docs/the-vision-plugin
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { structure, defaultDocumentNode } from "./structure";
import useSanityClient from "./lib/useSanityClient";

// TODO: upgrage Pexels to Sanity v3:
// https://www.sanity.io/plugins/asset-source-pexels

// See: https://www.sanity.io/docs/config-api-reference

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID;
const dataset = import.meta.env.SANITY_STUDIO_DATASET;

const defaultSwatchColor = "fff";

const ListWithSwatch = props => {
  const { value, renderDefault } = props;
  const [palette, setPalette] = useState();
  const [swatchColor, setSwatchColor] = useState();
  const image = useFormValue(["image"]).asset._ref;
  const client = useSanityClient();

  useEffect(() => {
    const getPalette = () =>
      client.fetch(`*[_id == $id][0].metadata.palette`, { id: image }).then(setPalette);
    getPalette();
  }, [client, image]);

  useEffect(() => {
    if (palette && value?.colorPalette) {
      setSwatchColor(palette[value.colorPalette]?.background || defaultSwatchColor);
    }
  }, [value, palette]);

  return (
    <Inline space={3}>
      {renderDefault(props)}
      {value?.colorPalette !== "custom" ? (
        <Avatar style={{ backgroundColor: swatchColor || defaultSwatchColor }} />
      ) : null}
    </Inline>
  );
};
ListWithSwatch.propTypes = {
  value: PropTypes.object,
  renderDefault: PropTypes.func
};

export default defineConfig({
  name: "default",
  title: "Sandi Plewis' Blog",
  projectId,
  dataset,
  plugins: [
    deskTool({
      structure,
      defaultDocumentNode
    }),
    visionTool(),
    colorInput(),
    unsplashImageAsset()
  ],
  // https://www.sanity.io/docs/schema-types
  schema: {
    types: schemaTypes
  },
  // Customize the `colorPalette` form component by adding color swatches to reflect the
  // palette that's currently selected. See: https://www.sanity.io/docs/component-api
  form: {
    components: {
      // TODO: why is `schemaType.name` "string" instead of "colorPalette"?
      input: props =>
        ["Main image", "Image"].includes(props.schemaType?.title) ? (
          <ListWithSwatch {...props} />
        ) : (
          props.renderDefault(props)
        )
    }
  }
});
