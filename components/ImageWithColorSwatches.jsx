import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useFormValue, set, unset } from "sanity";
import { Inline } from "@sanity/ui";
import useSanityClient from "../lib/useSanityClient";
import { getSampledColors } from "../utils/color";
import ColorSwatch from "./ColorSwatch";

function colorsMatch(colors1, colors2) {
  return (
    colors1?.primary?.r === colors2?.primary?.r &&
    colors1?.primary?.g === colors2?.primary?.g &&
    colors1?.primary?.b === colors2?.primary?.b &&
    colors1?.secondary?.r === colors2?.secondary?.r &&
    colors1?.secondary?.g === colors2?.secondary?.g &&
    colors1?.secondary?.b === colors2?.secondary?.b
  );
}

function useSampledColors(props = {}) {
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

  const sampledColors = useMemo(() => {
    // Wait for `image.metadata.palette` to be fetched or custom colors to be defined
    if (palette || (primaryColor?.hex && secondaryColor?.hex)) {
      return getSampledColors({ swatchName, palette, primaryColor, secondaryColor });
    }
  }, [palette, primaryColor, secondaryColor, swatchName]);

  return sampledColors;
}

const ImageWithColorSwatches = props => {
  const { value, renderDefault, onChange } = props;
  const image = useFormValue(["image"])?.asset?._ref;

  const colors = useSampledColors({
    swatchName: value?.colorPalette ?? "vibrant",
    primaryColor: value?.primaryColor,
    secondaryColor: value?.secondaryColor,
    image
  });

  useEffect(() => {
    // If colors have changed
    if (colors && value && !colorsMatch(colors, value.sampledColors)) {
      // value.sampledColors = colors; // Mutate draft document (unnecessary and maybe a bad idea)
      const nextValue = { ...value, sampledColors: colors };
      onChange(nextValue ? set(nextValue) : unset()); // Patch document
    }
  }, [colors, onChange, value]);

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
  renderDefault: PropTypes.func,
  onChange: PropTypes.func
};

export default ImageWithColorSwatches;
