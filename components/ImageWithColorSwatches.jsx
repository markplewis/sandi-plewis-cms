import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useFormValue } from "sanity";
import { Avatar, Inline } from "@sanity/ui";
import useSanityClient from "../lib/useSanityClient";
import { getPageColors } from "../utils/color";

function usePageColors(props = {}) {
  const { colorPalette = "", primaryColor = {}, secondaryColor = {}, image = "" } = props;
  const [palette, setPalette] = useState();
  const swatchName = colorPalette; // Selected by user
  const client = useSanityClient();

  useEffect(() => {
    if (image) {
      const getPalette = () =>
        client.fetch(`*[_id == $id][0].metadata.palette`, { id: image }).then(setPalette);
      getPalette();
    }
  }, [client, image]);

  const pageColors = useMemo(() => {
    return getPageColors({ swatchName, palette, primaryColor, secondaryColor });
  }, [palette, primaryColor, secondaryColor, swatchName]);

  return pageColors;
}

const ImageWithColorSwatches = props => {
  const { value, renderDefault } = props;
  const image = useFormValue(["image"])?.asset?._ref;

  const colors = usePageColors({
    colorPalette: value?.colorPalette ?? "vibrant",
    primaryColor: value?.primaryColor,
    secondaryColor: value?.secondaryColor,
    image
  });

  value.pageColors = colors; // Mutate draft document

  return (
    <Inline space={3}>
      {renderDefault(props)}

      {colors ? (
        <div style={{ display: "inline-block" }}>
          <div>
            <p>{colors.primary.r}%</p>
            <p>{colors.primary.g}%</p>
            <p>{colors.primary.b}%</p>
          </div>{" "}
          <Avatar
            style={{
              // colorjs.io RGB values should be treated as percentages, not numbers
              backgroundColor: `rgb(${colors.primary.r}% ${colors.primary.g}% ${colors.primary.b}%)`,
              display: "inline-block",
              marginRight: "-6px"
            }}
          />
          <Avatar
            style={{
              backgroundColor: `rgb(${colors.secondary.r}% ${colors.secondary.g}% ${colors.secondary.b}%)`,
              display: "inline-block"
            }}
          />
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
