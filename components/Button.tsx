import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { theme } from "../core/theme";

type Props = React.ComponentProps<typeof PaperButton>;

const Button = ({ mode, style, children, ...props }: Props) => (
  <PaperButton
    style={[
      styles.button,
      mode === "outlined" && { backgroundColor: '#C9F977' },
      style,
    ]}
    labelStyle={[styles.text, mode === "outlined" && {color: '#1E2122'}, style]}
    mode={mode}
  uppercase={false}
    {...props}
  >
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    // width: "auto",
    flex: 1,
    marginBottom: 8,
    borderRadius: 30,
    backgroundColor: '#1E2122',
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
    fontFamily: "Inter_600SemiBold",
    color: '#C9F977',
  },
});

export default memo(Button);
