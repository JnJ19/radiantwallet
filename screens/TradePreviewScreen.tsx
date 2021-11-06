import React, { memo, useState, useEffect } from 'react';
import { Text } from 'react-native';
import { Background, Button } from '../components';
import { Navigation } from '../types';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme';
import Modal from 'react-native-modal';
const {
	colors,
	fonts: { Azeret_Mono, Nunito_Sans },
} = theme;
import { SubPageHeader } from '../components';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';
import * as SecureStore from 'expo-secure-store';
import {
	findAssociatedTokenAddress,
	getAccountFromSeed,
	DERIVATION_PATH,
} from '../utils';
import { Account, Connection, PublicKey, Keypair } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Market } from '@project-serum/serum';
import { normalizeNumber } from '../utils';

type Props = {
	navigation: Navigation;
	route: Object;
};

const TradePreviewScreen = ({ navigation, route }: Props) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [price, setPrice] = useState('');
	const [displayPrice, setDisplayPrice] = useState('');
	const [size, setSize] = useState('');
	const [side, setSide] = useState('sell');
	const [marketAddress, setMarketAddress] = useState('');
	const tradeAmount = route.params.tradeAmount;
	const fromTo = route.params.pair;
	const passcode = useStoreState((state) => state.passcode);
	const ownedTokens = useStoreState((state) => state.ownedTokens);

	async function submitTrade() {
		//prep trade
		let mnemonic = await SecureStore.getItemAsync(passcode);
		const bip39 = await import('bip39');
		const seed = await bip39.mnemonicToSeed(mnemonic);
		const newAccount = getAccountFromSeed(
			seed,
			0,
			DERIVATION_PATH.bip44Change,
		);

		const url = 'https://solana-api.projectserum.com';
		const connection = new Connection(url);

		//make the trade
		const marketAddressKey = new PublicKey(marketAddress);
		const programAddressKey = new PublicKey(
			'9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
		);

		let market = await Market.load(
			connection,
			marketAddressKey,
			{},
			programAddressKey,
		);
		console.log('market: ', market);

		let owner = new Account(newAccount.secretKey);
		console.log('owner: ', owner);

		console.log('minttt', fromTo.from);

		const mintKey = new PublicKey(fromTo.from.mint);
		console.log('mintKey: ', mintKey);

		const associatedTokenAddress = findAssociatedTokenAddress(
			owner.publicKey,
			mintKey,
		).catch((err) => console.log('errrrrror', err));

		console.log('associatedTokenAddress: ', associatedTokenAddress);

		const hash = (await associatedTokenAddress).toString('hex');
		console.log('hash: ', hash);

		let payer = new PublicKey(hash);
		console.log('payer: ', payer);

		await market
			.placeOrder(connection, {
				owner,
				payer,
				side: side, //sell is from left side (use dxl as payer), buy is from right (use usdc as payer)
				price: price,
				size: size,
				orderType: 'ioc',
			})
			.then((response) => {
				console.log('response hit');
				console.log(response);
				setModalVisible(false);
				navigation.navigate('Trade Success', {
					tradeAmount,
					price,
					fromTo,
				});
			})
			.catch((err) => console.log(err));

		//Settle Funds
		// for (let openOrders of await market.findOpenOrdersAccountsForOwner(
		// 	connection,
		// 	owner.publicKey,
		// )) {
		// 	if (openOrders.baseTokenFree > 0 || openOrders.quoteTokenFree > 0) {
		// 		// spl-token accounts to which to send the proceeds from trades
		// 		await market
		// 			.settleFunds(
		// 				connection,
		// 				owner,
		// 				openOrders,
		// 				baseTokenAccount,
		// 				quoteTokenAccount,
		// 			)
		// 			.then((res) => console.log('response', res))
		// 			.catch((err) => console.log('error', err));
		// 	} else {
		// 		console.log('hit other');
		// 	}
		// }
	}

	useEffect(() => {
		const originalPair = fromTo.to.pairs.filter((pair) =>
			pair.pair.includes(fromTo.from.symbol),
		)[0].pair;

		const pairIsNotOriginal =
			fromTo.from.symbol + '/' + fromTo.to.symbol !== originalPair;

		let marketName;
		if (pairIsNotOriginal) {
			marketName = fromTo.to.symbol + fromTo.from.symbol;
			setSide('buy');
		} else {
			marketName = fromTo.from.symbol + fromTo.to.symbol;
		}

		console.log('marketName: ', marketName);

		fetch(`https://serum-api.bonfida.com/trades/${marketName}`)
			.then((res) => res.json())
			.then((resp) => {
				console.log('marketname', marketName);

				console.log(resp);
				const recentPrice = resp.data[0].price;
				const newPrice = recentPrice * 1.005;
				console.log('newprice', newPrice);
				pairIsNotOriginal
					? setDisplayPrice(1 / newPrice)
					: setDisplayPrice(newPrice);
				setSize(parseFloat(tradeAmount) / newPrice);
				setPrice(newPrice);
				setMarketAddress(resp.data[0].marketAddress);
			})
			.catch((err) => console.log('error ', err));
	}, []);

	return (
		<Background>
			<View>
				<SubPageHeader backButton>Trade Preview</SubPageHeader>
				<Text
					style={{
						...styles.bigNumber,
						alignSelf: 'center',
						marginVertical: 32,
					}}
				>
					${tradeAmount}
				</Text>
				<View
					style={{
						borderWidth: 1,
						borderColor: theme.colors.border,
						borderRadius: 18,
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
								Pay With
							</Text>
							<Text
								style={{
									...Nunito_Sans.Body_M_SemiBold,
									color: colors.black_one,
								}}
							>
								{fromTo.from.name}
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
								Receive
							</Text>
							<Text
								style={{
									...Nunito_Sans.Body_M_SemiBold,
									color: colors.black_one,
								}}
							>
								{fromTo.to.name}
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
								Exchange Rate
							</Text>
							<Text
								style={{
									...Nunito_Sans.Body_M_SemiBold,
									color: colors.black_one,
								}}
							>
								{price
									? `1 ${
											fromTo.from.symbol
									  } = ${normalizeNumber(displayPrice)} ${
											fromTo.to.symbol
									  }`
									: 'loading...'}
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
								Radiant Fee
							</Text>
							<Text
								style={{
									...Nunito_Sans.Body_M_SemiBold,
									color: colors.black_one,
								}}
							>
								$0.00
							</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={{ marginBottom: 40 }}>
				<Button
					onPress={() => {
						setModalVisible(true);
						submitTrade();
					}}
				>
					Submit Trade
				</Button>
			</View>
			<Modal
				isVisible={modalVisible}
				backdropColor={colors.black_two}
				backdropOpacity={0.35}
				// onBackdropPress={() => setModalVisible(false)}
			>
				<TouchableOpacity
					onPress={() => {
						setModalVisible(false);
					}}
					style={{
						paddingHorizontal: 32,
						paddingBottom: 32,
						paddingTop: 8,
						backgroundColor: '#111111',
						borderRadius: 32,
						width: 194,
						alignItems: 'center',
						alignSelf: 'center',
					}}
				>
					<Image
						source={require('../assets/images/logo_loader.png')}
						style={{ width: 110, height: 114, marginBottom: 2 }}
					/>
					<Text style={styles.loaderLabel}>Submitting...</Text>
				</TouchableOpacity>
			</Modal>
		</Background>
	);
};

const styles = StyleSheet.create({
	loaderLabel: {
		fontFamily: 'AzeretMono_SemiBold',
		color: 'white',
		fontSize: 12,
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

export default memo(TradePreviewScreen);
