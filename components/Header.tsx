import React, { memo } from "react";
import { StyleSheet, Text } from "react-native";
import { theme } from "../core/theme";

type Props = {
  children: React.ReactNode;
};

const Header = ({ children }: Props) => (
  <Text style={styles.header}>{children}</Text>
);

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: "bold",
    fontFamily: "Sumo",
    paddingVertical: 24,
  },
});

export default memo(Header);
