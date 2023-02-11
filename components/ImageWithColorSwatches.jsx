import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useFormValue } from "sanity";
import { Inline } from "@sanity/ui";
import useSanityClient from "../lib/useSanityClient";
import { getPageColors } from "../utils/color";
import ColorSwatch from "./ColorSwatch";

function usePageColors(props = {}) {
  const { swatchName = "", primaryColor = {}, secondaryColor = {}, image = "" } = props;
  const [palette, setPalette] = useState();
  const client = useSanityClient();

  useEffect(() => {
    if (image) {
      const getPalette = () =>
        client.fetch(`*[_id == $id][0].metadata.palette`, { id: image }).then(setPalette);
      getPalette();
    }
  }, [client, image]);

  const pageColors = useMemo(() => {
    // Wait for `image.metadata.palette` to be fetched or custom colors to be defined
    if (palette || (primaryColor?.hex && secondaryColor?.hex)) {
      return getPageColors({ swatchName, palette, primaryColor, secondaryColor });
    }
  }, [palette, primaryColor, secondaryColor, swatchName]);

  return pageColors;
}

const ImageWithColorSwatches = props => {
  const { value, renderDefault } = props;
  const image = useFormValue(["image"])?.asset?._ref;

  const colors = usePageColors({
    swatchName: value?.colorPalette ?? "vibrant",
    primaryColor: value?.primaryColor,
    secondaryColor: value?.secondaryColor,
    image
  });

  // useEffect(() => console.log("pageColors", colors), [colors]);

  if (value && colors) {
    // Mutate draft document
    // TODO: this doesn't seem to make the changes available to `next-sanity` live preview mode
    value.pageColors = colors;
  }
  return (
    <Inline space={3}>
      {renderDefault(props)}
      {colors ? (
        <div style={{ display: "inline-block" }}>
          <ColorSwatch color={colors.primary} first={true} />
          <ColorSwatch color={colors.secondary} />
        </div>
      ) : null}
    </Inline>
  );
};

ImageWithColorSwatches.propTypes = {
  value: PropTypes.object,
  renderDefault: PropTypes.func
};

export default ImageWithColorSwatches;
