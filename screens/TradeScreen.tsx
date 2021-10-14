import React, { memo, useState, useEffect } from 'react';
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
import { BlurView } from 'expo-blur';
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

const TradeScreen = ({ navigation, route }: Props) => {
	const token = route.params;
	console.log('token', token);
	const [fromTo, setFromTo] = useState({
		from: token,
		to: {
			symbol: 'USDC',
			name: 'USD Coin',
			logoURI:
				'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
			amount: 110.53,
			price: 1.0,
		},
	});
	const [toToken, setToToken] = useState({
		symbol: 'USDC',
		name: 'USD Coin',
		logoURI:
			'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
	});
	const [fromToken, setFromToken] = useState(token);

	useEffect(() => {
		if (fromTo.from.symbol && fromTo.from.symbol === 'USDC') {
			setFromTo({
				...fromTo,
				to: {
					symbol: 'SOL',
					name: 'Solana',
					logoURI:
						'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
					amount: 10,
					price: 150.53,
				},
			});
		}
	}, [token]);

	return (
		<Background>
			<SubPageHeader
				subText={`$${(fromTo.from.amount * fromTo.from.price).toFixed(
					2,
				)} available`}
				backButton
			>
				Trade {fromTo.from.name}{' '}
			</SubPageHeader>
			<View>
				<Text style={{ ...styles.bigNumber, alignSelf: 'center' }}>
					$0
				</Text>
			</View>
			<View
				style={{
					borderColor: colors.border,
					borderWidth: 1,
					borderRadius: 18,
					padding: 16,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity
					style={{ flexDirection: 'row', alignItems: 'center' }}
				>
					<Image
						source={{ uri: fromTo.from.logoURI }}
						style={{
							width: 40,
							height: 40,
							borderRadius: 100,
							marginRight: 16,
						}}
					/>
					<View>
						<Text style={styles.toFrom}>From</Text>
						<Text style={styles.swapTokens}>
							{fromTo.from.symbol}
						</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.swapContainer}
					onPress={() => {
						const fromToken2 = fromTo.from;
						const toToken2 = fromTo.to;
						setFromTo({
							...fromTo,
							from: toToken2,
							to: fromToken2,
						});
					}}
				>
					<Image
						source={require('../assets/icons/Swap.png')}
						style={{ width: 24, height: 24 }}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={{ flexDirection: 'row', alignItems: 'center' }}
				>
					<View>
						<Text style={styles.toFrom}>To</Text>
						<Text style={styles.swapTokens}>
							{fromTo.to.symbol}
						</Text>
					</View>
					<Image
						source={{ uri: fromTo.to.logoURI }}
						style={{
							width: 40,
							height: 40,
							borderRadius: 100,
							marginLeft: 16,
						}}
					/>
				</TouchableOpacity>
			</View>
			<View>
				<View style={styles.numRow}>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>1</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>2</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>3</Text>
					</View>
				</View>
				<View style={styles.numRow}>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>4</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>5</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>6</Text>
					</View>
				</View>
				<View style={styles.numRow}>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>7</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>8</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>9</Text>
					</View>
				</View>
				<View style={{ ...styles.numRow, marginBottom: 0 }}>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>.</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>0</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>3</Text>
					</View>
				</View>
			</View>
			<View style={{ marginBottom: 40 }}>
				<Button>Review Trade</Button>
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
		color: colors.primary,
	},
	bigNumber: {
		fontSize: 84,
		fontFamily: 'Nunito Sans',
		fontWeight: '400',
		color: colors.black_two,
	},
	mediumNumber: {
		fontSize: 48,
		fontFamily: 'Nunito Sans',
		fontWeight: '400',
		color: colors.black_one,
	},
	numberContainer: {
		width: 56,
		height: 66,
		justifyContent: 'center',
		alignItems: 'center',
	},
	toFrom: {
		...Nunito_Sans.Caption_M_Regular,
		color: colors.black_five,
		marginBottom: 4,
	},
	swapTokens: {
		...Nunito_Sans.Body_M_Regular,
		color: colors.black_two,
	},
	swapContainer: {
		borderColor: colors.border,
		borderWidth: 1,
		borderRadius: 18,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	numRow: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		marginHorizontal: 16,
		marginBottom: 16,
	},
});

export default memo(TradeScreen);
