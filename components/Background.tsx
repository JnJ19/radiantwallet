import React, { memo } from "react";
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView, View,
} from "react-native";


type Props = {
  children: React.ReactNode;
  position?: String;
};

const Background = ({ children, position }: Props) => (
  // <ImageBackground
  //   source={require("../assets/images/background.jpg")}
  //   resizeMode="cover"
  //   style={styles.background}
  // >
  <SafeAreaView style={{backgroundColor: 'white', height: '100%', flex: 1}}>

    <KeyboardAvoidingView
      style={styles.container}
      // behavior="padding"
      >
      {children}
    </KeyboardAvoidingView>

      </SafeAreaView>
  // </ImageBackground>
);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
    // paddingBottom: 32,
    width: "100%",
    // maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: 'white',
  },

  bottom: {
    justifyContent: "flex-end",
  },
});

export default memo(Background);
