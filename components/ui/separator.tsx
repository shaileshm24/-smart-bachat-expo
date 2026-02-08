import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

interface SeparatorProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean; // just for API compatibility
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = "horizontal",
  style,
  decorative = true,
  ...props
}) => {
  return (
    <View
      style={[
        orientation === "horizontal" ? styles.horizontal : styles.vertical,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: "#e5e7eb",
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: "100%",
    backgroundColor: "#e5e7eb",
  },
});
