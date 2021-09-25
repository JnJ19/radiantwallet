import React, { memo } from "react";
import { Background, Button, Paragraph, Header } from "../components";
import { Navigation } from "../types";
import { StatusBar } from 'expo-status-bar';


type Props = {
  navigation: Navigation;
};

const OnboardingScreen = ({ navigation }: Props) => (
  <Background position="bottom">
    <StatusBar style="light" />
    <Header>Test</Header>

    <Paragraph bold center>The easiest way to swap tokens in the Solana ecosystem</Paragraph>
    <Button mode="contained" onPress={() => navigation.navigate("Set Pin")}>
      Continue
    </Button>
  </Background>
);

export default memo(OnboardingScreen);
