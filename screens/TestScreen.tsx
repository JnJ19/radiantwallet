import React, { memo, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { Background, Button, BackButton, Paragraph, TextInput, Header } from "../components";
import { Navigation } from "../types";
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { DashboardScreen } from ".";
import { AreaChart, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Card, IconButton } from 'react-native-paper';



type Props = {
  navigation: Navigation;
};

const TestScreen = ({ navigation }: Props) => {

    const [name, setName] = useState('');
    const [secret, setSecret] = useState('');
    const data = [50, 10, 40, 30, 10, 10, 85, 91, 35, 53, 10, 24, 50, 10, 10]
    
    return (
            // <SafeAreaView style={{margin: 16}}>
            
            <View style={[styles.container]}>
      <View style={{ flex: 1, backgroundColor: "red" }} />
      <View style={{ flex: 2, backgroundColor: "darkorange" }} />
      <View style={{ flex: 3, backgroundColor: "green" }} />
    </View>
            
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
  },
});

export default memo(TestScreen);
