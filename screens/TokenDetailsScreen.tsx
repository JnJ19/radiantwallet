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
import { AreaChart, Path } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
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
	const [chartData, setChartData] = useState('');
	const data = [50, 10, 40, 30, 10, 10, 85, 91, 35, 53, 10, 24, 50, 10, 10];
	const token = route.params.item;

	//chart stuff
	const Line = ({ line }) => (
		<Path key={'line'} d={line} stroke={'black'} fill={'none'} />
	);

	const Gradient = () => (
		<Defs key={'defs'}>
			<LinearGradient
				id={'gradient'}
				x1={'0%'}
				y={'0%'}
				x2={'0%'}
				y2={'100%'}
			>
				<Stop
					offset={'0%'}
					stopColor={'rgb(222, 249, 119)'}
					stopOpacity={0.9}
				/>
				<Stop
					offset={'100%'}
					stopColor={'rgb(201, 249, 119)'}
					stopOpacity={0}
				/>
			</LinearGradient>
		</Defs>
	);

	const d90 = token.price_90d;
	const d60 = token.price_60d;
	const d30 = token.price_30d;
	const todayTotal = token.price;
	// setChartData([d90, d60, d30, todayTotal]);
	console.log('charts data', d90, d60, d30, todayTotal);

	return (
		<Background>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ marginBottom: 64 }}
			>
				<SubPageHeader backButton>{token.name} Details</SubPageHeader>

				<View
					style={{
						borderWidth: 1,
						borderColor: theme.colors.border,
						backgroundColor: 'white',
						borderRadius: 8,
						padding: 16,
						marginTop: 8,
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
							${token.price.toFixed(2)}
						</Text>
						{token.change_24h > 0 ? (
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginBottom: 2,
								}}
							>
								<Image
									source={require('../assets/icons/Upward_Big.jpg')}
									style={{
										width: 24,
										height: 24,
									}}
								/>
								<Text
									style={{
										color: theme.colors.success_one,
										...theme.fonts.Nunito_Sans
											.Caption_M_SemiBold,
									}}
								>
									{token.change_24h?.toFixed(1)}% Today
								</Text>
							</View>
						) : (
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									marginBottom: 2,
								}}
							>
								<Image
									source={require('../assets/icons/Downward_Big.jpg')}
									style={{
										width: 24,
										height: 24,
									}}
								/>
								<Text
									style={{
										color: theme.colors.error_one,
										...theme.fonts.Nunito_Sans
											.Caption_M_SemiBold,
									}}
								>
									{token.change_24h?.toFixed(1)}% Today
								</Text>
							</View>
						)}
					</View>

					<AreaChart
						style={{ height: 200 }}
						// data={chartData}
						data={[d90, d60, d30, todayTotal]}
						showGrid={false}
						animate={true}
						contentInset={{ top: 30, bottom: 30 }}
						curve={shape.curveNatural}
						svg={{
							fill: 'url(#gradient)',
						}}
					>
						<Gradient />
						<Line />
					</AreaChart>
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
			</ScrollView>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					position: 'absolute',
					bottom: 0,
					margin: 16,
					width: '100%',
					shadowColor: '#656565',
					shadowOpacity: 0.25,
					shadowOffset: { width: 0, height: 8 },
					shadowRadius: 24,
				}}
			>
				<Button
					mode="outlined"
					onPress={() => navigation.navigate('Set Pin')}
					style={{ width: '50%' }}
					icon={() => (
						<Image
							source={require('../assets/icons/Send.png')}
							style={{
								width: 24,
								height: 24,
								marginRight: -24,
							}}
						/>
					)}
				>
					Send
				</Button>
				<View style={{ width: 8 }} />
				<Button
					mode="contained"
					onPress={() => navigation.navigate('Import Wallet')}
					style={{ width: '50%' }}
					icon={() => (
						<Image
							source={require('../assets/icons/Trade.png')}
							style={{
								width: 24,
								height: 24,
								marginRight: -20,
							}}
						/>
					)}
				>
					Trade
				</Button>
			</View>
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
