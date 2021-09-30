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

const TokenDetailsScreen = ({ navigation }: Props) => {

    const [name, setName] = useState('');
    const [secret, setSecret] = useState('');
    const data = [50, 10, 40, 30, 10, 10, 85, 91, 35, 53, 10, 24, 50, 10, 10]
    
    return (
            <SafeAreaView style={{margin: 16}}>

        <StatusBar style="light" />
            
            <Header>Token Details</Header>
        <BackButton goBack={() => navigation.navigate("Import Wallet")} />
            <Shadow viewStyle={{alignSelf:"stretch"}}>

            <View style={{ backgroundColor: "white", borderRadius: 8, padding: 8 }}>
                <Text style={{marginLeft: 8, marginTop: 8, }}>$12.56</Text>
                
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
            <View style={{marginTop: 24, marginBottom: 8}}>
                <Text>Portfolio</Text>
            </View>
            <Card.Title
                title="SOL"
                titleStyle={{color: '#1F1F1F', fontSize: 17}}
                subtitle="Solana"
                subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
                style={{backgroundColor: 'white', borderRadius: 8, marginBottom: 8}}
                left={(props) => {
                    console.log("props", props)
                    return <Avatar.Icon {...props} icon="folder" />
                } 
                }
                right={(props) => {
                    return (
                        <View style={{alignItems: 'flex-end', marginRight: 16}}>
                            <Text style={{fontSize: 17, color: '#1F1F1F'}}>
                                10.5
                            </Text>
                            <Text style={{fontSize: 14, color: '#727D8D'}}>
                                $1,280
                            </Text>
                        </View>
                    )
                }}
            />
            <Card.Title
                title="SOL"
                titleStyle={{color: '#1F1F1F', fontSize: 17}}
                subtitle="Solana"
                subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
                style={{backgroundColor: 'white', borderRadius: 8, marginBottom: 8}}
                left={(props) => {
                    console.log("props", props)
                    return <Avatar.Icon {...props} icon="folder" />
                } 
                }
                right={(props) => {
                    return (
                        <View style={{alignItems: 'flex-end', marginRight: 16}}>
                            <Text style={{fontSize: 17, color: '#1F1F1F'}}>
                                10.5
                            </Text>
                            <Text style={{fontSize: 14, color: '#727D8D'}}>
                                $1,280
                            </Text>
                        </View>
                    )
                }}
            />
            <Card.Title
                title="SOL"
                titleStyle={{color: '#1F1F1F', fontSize: 17}}
                subtitle="Solana"
                subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
                style={{backgroundColor: 'white', borderRadius: 8, marginBottom: 8}}
                left={(props) => {
                    console.log("props", props)
                    return <Avatar.Icon {...props} icon="folder" />
                } 
                }
                right={(props) => {
                    return (
                        <View style={{alignItems: 'flex-end', marginRight: 16}}>
                            <Text style={{fontSize: 17, color: '#1F1F1F'}}>
                                10.5
                            </Text>
                            <Text style={{fontSize: 14, color: '#727D8D'}}>
                                $1,280
                            </Text>
                        </View>
                    )
                }}
            />

            <View style={{marginTop: 24, marginBottom: 8}}>
                <Text>Popular Tokens</Text>
            </View>
            <Card.Title
                title="SOL"
                titleStyle={{color: '#1F1F1F', fontSize: 17}}
                subtitle="Solana"
                subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
                style={{backgroundColor: 'white', borderRadius: 8, marginBottom: 8}}
                left={(props) => {
                    console.log("props", props)
                    return <Avatar.Icon {...props} icon="folder" />
                } 
                }
                right={(props) => {
                    return (
                        <View style={{alignItems: 'flex-end', marginRight: 16}}>
                            <Text style={{fontSize: 17, color: '#1F1F1F'}}>
                                10.5
                            </Text>
                            <Text style={{fontSize: 14, color: '#727D8D'}}>
                                $1,280
                            </Text>
                        </View>
                    )
                }}
            />
            
    
        <Button mode="outlined" onPress={() => navigation.navigate("Set Pin")}>
      Create Wallet
    </Button>
    <Button mode="contained" onPress={() => navigation.navigate("Import Wallet")}>
      Import Wallet
    </Button>
            </SafeAreaView>
    );
}

export default memo(TokenDetailsScreen);
