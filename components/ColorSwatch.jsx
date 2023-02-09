import PropTypes from "prop-types";
import React from "react";
import { Avatar } from "@sanity/ui"; // https://www.sanity.io/ui

const ColorSwatch = ({ color = {}, first = false }) => {
  // TODO: keep an eye on the new "Theming API". Maybe we can write proper CSS with pseudo elements.
  // https://www.sanity.io/docs/migrating-styling-and-branding
  return (
    <Avatar
      style={{
        // colorjs.io RGB values should be treated as percentages, not numbers
        backgroundColor: `rgb(${color.r}% ${color.g}% ${color.b}%)`,
        display: "inline-block",
        marginRight: first ? "-6px" : "0"
      }}
    />
  );
};

ColorSwatch.propTypes = {
  color: PropTypes.object,
  first: PropTypes.bool
};

export default ColorSwatch;
