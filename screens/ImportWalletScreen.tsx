import React, { memo, useState } from "react";
import { Background, Button, BackButton, Paragraph, TextInput, Header } from "../components";
import { Navigation } from "../types";
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';


type Props = {
  navigation: Navigation;
};

const ImportWalletScreen = ({ navigation }: Props) => {

    const [name, setName] = useState('');
    const [secret, setSecret] = useState('');
    
    return (
      <Background position="bottom">
        <StatusBar style="dark" />
        <BackButton goBack={() => navigation.navigate("Onboarding")} />
            
        <Header>Import Wallet</Header>
            <TextInput
                label="Wallet Name"
                mode="outlined"
          value={name}
                onChangeText={text => setName(text)}
                theme={{
                    colors: { text: "#000" },
                    fonts: {
                        regular: {
                        fontFamily: "Inter_500Medium",
                    } },
                }}
            />
            <TextInput
                label="Secret"
                mode="outlined"
                multiline
                // numberOfLines={10}
                minHeight={150}
          value={secret}
                onChangeText={text => setSecret(text)}
                theme={{
                    colors: { text: "#000" },
                    fonts: {
                        regular: {
                        fontFamily: "Inter_500Medium",
                    } },
                }}
        />
    
        <View style={{height: 250}}></View>
        <Button mode="contained" onPress={() => navigation.navigate("Dashboard")}>
          Import
        </Button>
      </Background>
    );
}

export default memo(ImportWalletScreen);
