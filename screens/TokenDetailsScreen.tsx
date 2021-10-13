import React, { memo, useState } from 'react';
import { SafeAreaView, Text, ScrollView, Linking } from 'react-native';
import {
	Background,
	Button,
	BackButton,
	Paragraph,
	TextInput,
	Header,
} from '../components';
import { Navigation } from '../types';
import { StatusBar } from 'expo-status-bar';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DashboardScreen } from '.';
import { AreaChart, Grid } from 'react-native-svg-charts';
import { LinearGradient } from 'react-native-svg';
import * as shape from 'd3-shape';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { theme } from '../core/theme';
const {
	colors,
	fonts: { Azeret_Mono, Nunito_Sans },
} = theme;
import { SubPageHeader } from '../components';
const addCommas = new Intl.NumberFormat('en-US');

type Props = {
	navigation: Navigation;
	route: Object;
};

const TokenDetailsScreen = ({ navigation, route }: Props) => {
	const [name, setName] = useState('');
	const [secret, setSecret] = useState('');
	const data = [50, 10, 40, 30, 10, 10, 85, 91, 35, 53, 10, 24, 50, 10, 10];
	const token = route.params.item;

	return (
		<Background>
			<ScrollView showsVerticalScrollIndicator={false}>
				<SubPageHeader backButton>{token.name} Details</SubPageHeader>

				<View
					style={{
						borderWidth: 1,
						borderColor: theme.colors.border,
						backgroundColor: 'white',
						borderRadius: 8,
						padding: 16,
						marginBottom: 16,
					}}
				>
					<Text
						style={{
							marginVertical: 8,
							...Azeret_Mono.Body_M_SemiBold,
						}}
					>
						Price History
					</Text>
					<View
						style={{ flexDirection: 'row', alignItems: 'flex-end' }}
					>
						<Text style={{ fontSize: 24, marginRight: 8 }}>
							$5,302
						</Text>
						<Text style={{ color: '#07CC79' }}>Up 10% Today</Text>
					</View>

					<AreaChart
						style={{ height: 200 }}
						data={data}
						showGrid={false}
						animate={true}
						contentInset={{ top: 30, bottom: 30 }}
						curve={shape.curveNatural}
						svg={{
							fill: theme.colors.accent,
							stroke: 'rgba(0, 0, 0, 1)',
						}}
					></AreaChart>
				</View>

				<View
					style={{
						borderWidth: 1,
						borderColor: theme.colors.border,
						borderRadius: 16,
						marginBottom: 16,
					}}
				>
					<View style={{ margin: 16 }}>
						<Text
							style={{
								...Azeret_Mono.Body_M_SemiBold,
								marginBottom: 16,
							}}
						>
							Details
						</Text>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								marginVertical: 16,
							}}
						>
							<Text
								style={{
									...Nunito_Sans.Caption_M_SemiBold,
									color: colors.black_five,
								}}
							>
								Market Cap
							</Text>
							<Text
								style={{
									...Nunito_Sans.Body_M_SemiBold,
									color: colors.black_one,
								}}
							>
								${addCommas.format(token.market_cap.toFixed(0))}
							</Text>
						</View>
						<View
							style={{
								height: 1,
								backgroundColor: theme.colors.border,
							}}
						/>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								marginVertical: 16,
							}}
						>
							<Text
								style={{
									...Nunito_Sans.Caption_M_SemiBold,
									color: colors.black_five,
								}}
							>
								Share of All Crypto
							</Text>
							<Text
								style={{
									...Nunito_Sans.Body_M_SemiBold,
									color: colors.black_one,
								}}
							>
								% {token.market_cap_dominance.toFixed(2)}
							</Text>
						</View>
						<View
							style={{
								height: 1,
								backgroundColor: colors.border,
							}}
						/>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								marginVertical: 16,
							}}
						>
							<Text
								style={{
									...Nunito_Sans.Caption_M_SemiBold,
									color: colors.black_five,
								}}
							>
								24hr Volume
							</Text>
							<Text
								style={{
									...Nunito_Sans.Body_M_SemiBold,
									color: colors.black_one,
								}}
							>
								$
								{addCommas.format(
									token.volume_24h
										.toFixed(0)
										.toLocaleString('en-US'),
								)}
							</Text>
						</View>
					</View>
				</View>

				<View
					style={{
						borderWidth: 1,
						borderColor: theme.colors.border,
						borderRadius: 16,
					}}
				>
					<View style={{ margin: 16 }}>
						<Text
							style={{
								...Azeret_Mono.Body_M_SemiBold,
								marginBottom: 24,
							}}
						>
							Additional Info
						</Text>
						<View
							style={{
								borderWidth: 1,
								borderColor: colors.black_six,
								width: 56,
							}}
						/>
						<View
							style={{ flexDirection: 'row', marginVertical: 24 }}
						>
							<TouchableOpacity
								onPress={() =>
									Linking.openURL(token.extensions.twitter)
								}
								style={{
									borderWidth: 1,
									borderColor: colors.black_six,
									borderRadius: 20,
									width: 56,
									height: 56,
									marginRight: 16,
								}}
							>
								<Image
									source={require('../assets/icons/Twitter_Logo.png')}
									style={{
										width: 24,
										height: 20,
										margin: 16,
									}}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() =>
									Linking.openURL(token.extensions.website)
								}
								style={{
									borderWidth: 1,
									borderColor: colors.black_six,
									borderRadius: 20,
									width: 56,
									height: 56,
									marginRight: 16,
								}}
							>
								<Image
									source={require('../assets/icons/Discord_Logo.png')}
									style={{
										width: 24,
										height: 19,
										margin: 16,
										marginRight: 16,
									}}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() =>
									Linking.openURL(token.extensions.website)
								}
								style={{
									borderWidth: 1,
									borderColor: colors.black_six,
									borderRadius: 20,
									width: 56,
									height: 56,
								}}
							>
								<Image
									source={require('../assets/icons/globe.png')}
									style={{
										width: 24,
										height: 24,
										margin: 16,
									}}
								/>
							</TouchableOpacity>
						</View>
						<Text
							style={{
								...Nunito_Sans.Body_M_Regular,
								color: colors.black_four,
							}}
						>
							{token.aboutData}
						</Text>
					</View>
				</View>

				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}
				>
					<Button
						mode="outlined"
						onPress={() => navigation.navigate('Set Pin')}
					>
						Send
					</Button>
					<View style={{ width: 8 }} />
					<Button
						mode="contained"
						onPress={() => navigation.navigate('Import Wallet')}
					>
						Swap
					</Button>
				</View>
			</ScrollView>
		</Background>
	);
};

const styles = StyleSheet.create({
	tableLabel: {
		fontSize: 14,
		color: '#727D8D',
	},
	tableData: {
		fontSize: 17,
		color: theme.colors.primary,
	},
});

export default memo(TokenDetailsScreen);
