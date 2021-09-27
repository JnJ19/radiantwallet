import React, { memo, useState } from "react";
import { SafeAreaView, Text } from "react-native";
import { Background, Button, BackButton, Paragraph, TextInput, Header } from "../components";
import { Navigation } from "../types";
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { DashboardScreen } from ".";
import { AreaChart, Grid } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Card, IconButton } from 'react-native-paper';



type Props = {
  navigation: Navigation;
};

const DashboardScreen2 = ({ navigation }: Props) => {

    const [name, setName] = useState('');
    const [secret, setSecret] = useState('');
    const data = [50, 10, 40, 30, 10, 10, 85, 91, 35, 53, 10, 24, 50, 10, 10]
    
    return (
            <SafeAreaView style={{margin: 16}}>

        <StatusBar style="light" />
        <BackButton goBack={() => navigation.navigate("Import Wallet")} />
            
            <Header>Dashboard</Header>
            <Shadow viewStyle={{alignSelf:"stretch"}}>

            <View style={{ backgroundColor: "white", borderRadius: 8, padding: 8 }}>
                <Text style={{marginLeft: 8, marginTop: 8, }}>Portfolio</Text>
                
            <AreaChart
                style={{ height: 200 }}
                data={data}
                showGrid={false}
                animate={true}
                contentInset={{ top: 30, bottom: 30 }}
                curve={shape.curveNatural}
                svg={{ fill: 'rgba(134, 65, 244, 0.2)', stroke: 'rgba(0, 0, 0, 1)' }}
                    >
                {/* <Grid /> */}
            </AreaChart>
            </View>
            </Shadow>
            <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={(props) => <Avatar.Icon {...props} icon="folder" />}
                right={(props) => <IconButton {...props} icon="more-vert" onPress={() => {}} />}
            />
            <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={(props) => <Avatar.Icon {...props} icon="folder" />}
                right={(props) => <IconButton {...props} icon="more-vert" onPress={() => {}} />}
            />
            <Card.Title
                title="Card Title"
                subtitle="Card Subtitle"
                left={(props) => <Avatar.Icon {...props} icon="folder" />}
                right={(props) => <IconButton {...props} icon="more-vert" onPress={() => {}} />}
            />
            
    
        <View style={{height: 50}}></View>
        <Button mode="contained" onPress={() => navigation.navigate("Set Pin")}>
          Import
        </Button>
            </SafeAreaView>
    );
}

export default memo(DashboardScreen2);
