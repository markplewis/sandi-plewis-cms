import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useFormValue } from "sanity";
import { Avatar, Inline } from "@sanity/ui"; // https://www.sanity.io/ui
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

const ColorSwatch = ({ color = {}, first = false }) => {
  // TODO: keep an eye on the new "Theming API" so we canmaybe  write proper CSS
  // https://www.sanity.io/docs/migrating-styling-and-branding
  return (
    <div
      style={{ display: "inline-block", position: "relative", marginRight: first ? "-4px" : "0" }}>
      <Avatar
        size={1}
        style={{
          // colorjs.io RGB values should be treated as percentages, not numbers
          backgroundColor: `rgb(${color.r}% ${color.g}% ${color.b}%)`
        }}
      />
      <div
        style={{
          width: "100%",
          textAlign: "center",
          color: "white",
          position: "absolute",
          top: "50%"
        }}>
        Aa
      </div>
    </div>
  );
};

ColorSwatch.propTypes = {
  color: PropTypes.object,
  first: PropTypes.bool
};

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
          {/* <div>
            <p>{colors.primary.r}%</p>
            <p>{colors.primary.g}%</p>
            <p>{colors.primary.b}%</p>
          </div>{" "} */}
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
