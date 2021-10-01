import React, { memo } from "react";
import { Background, Button, Paragraph, Header } from "../components";
import { Navigation } from "../types";
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet} from 'react-native';


type Props = {
  navigation: Navigation;
};

const OnboardingScreen = ({ navigation }: Props) => (
  <Background>
    {/* <View style={styles.container}> */}
    <View style={{alignItems: 'center', marginTop: '20%'}}>
      {/* <View style={{marginBottom: 16}}> */}
        
      <Header>radiant</Header>
      <Paragraph bold center>The easiest way to swap tokens in the Solana ecosystem</Paragraph>
      </View>

    <View style={{ height: 450 }}>
      
      <View style={{flexDirection: 'column'}}>
        <Button mode="outlined" onPress={() => navigation.navigate("Set Pin")}>
          Create Wallet
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate("Import Wallet")}>
          Import Wallet
        </Button>
      </View>

    </View>
  </Background>
);

const styles = StyleSheet.create({
  container: {
    // flex: 1
  }
});

export default memo(OnboardingScreen);
