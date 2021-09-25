import React, { memo } from "react";
import { Background, Button, Paragraph, Header } from "../components";
import { Navigation } from "../types";
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';


type Props = {
  navigation: Navigation;
};

const OnboardingScreen = ({ navigation }: Props) => (
  <Background position="bottom">
    <StatusBar style="light" />
    <Header>radiant</Header>
    <Paragraph bold center>The easiest way to swap tokens in the Solana ecosystem</Paragraph>

    <View style={{height: 450}}></View>
    <Button mode="outlined" onPress={() => navigation.navigate("Set Pin")}>
      Create Wallet
    </Button>
    <Button mode="contained" onPress={() => navigation.navigate("Set Pin")}>
      Import Wallet
    </Button>
  </Background>
);

export default memo(OnboardingScreen);
