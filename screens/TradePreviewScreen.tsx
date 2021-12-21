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
import { normalizeNumber, mnemonicToSeed, accountFromSeed } from '../utils';
import * as Haptics from 'expo-haptics';
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core';

type Props = {
	navigation: Navigation;
	route: Object;
};

interface Token {
	chainId: number; // 101,
	address: string; // 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
	symbol: string; // 'USDC',
	name: string; // 'Wrapped USDC',
	decimals: number; // 6,
	logoURI: string; // 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/BXXkv6z8ykpG1yuvUDPgh732wzVHB69RnB9YgSYh3itW/logo.png',
	tags: string[]; // [ 'stablecoin' ]
}

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

	const getPossiblePairsTokenInfo = ({
		tokens,
		routeMap,
		inputToken,
	}: {
		tokens: Token[];
		routeMap: Map<string, string[]>;
		inputToken?: Token;
	}) => {
		try {
			if (!inputToken) {
				return {};
			}

			const possiblePairs = inputToken
				? routeMap.get(inputToken.address) || []
				: []; // return an array of token mints that can be swapped with SOL
			const possiblePairsTokenInfo: { [key: string]: Token | undefined } =
				{};
			possiblePairs.forEach((address) => {
				possiblePairsTokenInfo[address] = tokens.find((t) => {
					return t.address == address;
				});
			});
			// Perform your conditionals here to use other outputToken
			// const alternativeOutputToken = possiblePairsTokenInfo[USDT_MINT_ADDRESS]
			return possiblePairsTokenInfo;
		} catch (error) {
			throw error;
		}
	};

	const getRoutes = async ({
		jupiter,
		inputToken,
		outputToken,
		inputAmount,
		slippage,
	}: {
		jupiter: Jupiter;
		inputToken?: Token;
		outputToken?: Token;
		inputAmount: number;
		slippage: number;
	}) => {
		try {
			if (!inputToken || !outputToken) {
				return null;
			}

			console.log('Getting routes');
			const inputAmountLamports = inputToken
				? Math.round(inputAmount * 10 ** inputToken.decimals)
				: 0; // Lamports based on token decimals
			const routes =
				inputToken && outputToken
					? await jupiter.computeRoutes(
							new PublicKey(inputToken.address),
							new PublicKey(outputToken.address),
							inputAmountLamports,
							slippage,
							true,
					  )
					: null;

			if (routes && routes.routesInfos) {
				console.log(
					'Possible number of routes:',
					routes.routesInfos.length,
				);
				console.log('Best quote: ', routes.routesInfos[0].outAmount);
				return routes;
			} else {
				return null;
			}
		} catch (error) {
			throw error;
		}
	};

	const executeSwap = async ({
		jupiter,
		route,
	}: {
		jupiter: Jupiter;
		route: RouteInfo;
	}) => {
		try {
			// Prepare execute exchange
			const { execute } = await jupiter.exchange({
				route,
			});
			// Execute swap
			const swapResult: any = await execute(); // Force any to ignore TS misidentifying SwapResult type

			if (swapResult.error) {
				console.log(swapResult.error);
			} else {
				console.log(
					`https://explorer.solana.com/tx/${swapResult.txid}`,
				);
				console.log(
					`inputAddress=${swapResult.inputAddress.toString()} outputAddress=${swapResult.outputAddress.toString()}`,
				);
				console.log(
					`inputAmount=${swapResult.inputAmount} outputAmount=${swapResult.outputAmount}`,
				);
			}
		} catch (error) {
			throw error;
		}
	};

	async function getJupObject() {
		const connection = new Connection(
			'https://solana--mainnet.datahub.figment.io/apikey/5d2d7ea54a347197ccc56fd24ecc2ac5',
		);

		let mnemonic = await SecureStore.getItemAsync(passcode);
		const seed = await mnemonicToSeed(mnemonic);
		const fromWallet = accountFromSeed(seed, 0, 'bip44', 0);

		const jupiter = await Jupiter.load({
			connection,
			cluster: 'mainnet-beta',
			user: fromWallet, // or public key
		});

		return jupiter;
	}

	async function getTokens() {
		const tokens: Token[] = await (
			await fetch(TOKEN_LIST_URL['mainnet-beta'])
		).json();
		return tokens;
	}

	async function getPrice(inputMint, outPutMint, size) {
		const jupiter = await getJupObject();
		const tokens = await getTokens();

		const inputToken = tokens.find((t) => t.address == inputMint);
		const outputToken = tokens.find((t) => t.address == outPutMint);
		//usdc token
		const usdcToken = tokens.find(
			(t) => t.address == 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
		);

		//get usdc price
		const usdcRoutes = await getRoutes({
			jupiter,
			inputToken,
			outputToken: usdcToken,
			inputAmount: 1, // 1 unit in UI
			slippage: 1, // 1% slippage
		});

		//get dollar price and convert it to dollars instead of lamports
		const dollarPrice = usdcRoutes?.routesInfos[0]?.outAmount / 1000000;
		setPrice(dollarPrice);
		const tradeSize = parseFloat(tradeAmount) / dollarPrice;
		setSize(tradeSize);

		//get conversion price between tokens
		const routes = await getRoutes({
			jupiter,
			inputToken,
			outputToken,
			inputAmount: tradeSize, // 1 unit in UI
			slippage: 1, // 1% slippage
		});
		console.log('routes: ', routes);

		const bestRoute = routes?.routesInfos[0];
		const ratio = bestRoute?.outAmount / bestRoute?.inAmount;
		setDisplayPrice(ratio);
	}

	const submitJupTrade = async (inputMint, outPutMint, size) => {
		const jupiter = await getJupObject();

		const tokens = await getTokens();

		// //usdc
		// const INPUT_MINT_ADDRESS =
		// 	'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
		// //usdt
		// const OUTPUT_MINT_ADDRESS =
		// 	'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

		const routeMap = jupiter.getRouteMap();

		const inputToken = tokens.find((t) => t.address == inputMint);
		console.log('inputToken: ', inputToken);
		const outputToken = tokens.find((t) => t.address == outPutMint);
		console.log('outputToken: ', outputToken);

		const possiblePairsTokenInfo = await getPossiblePairsTokenInfo({
			tokens,
			routeMap,
			inputToken,
		});

		console.log('sisisisize: ', size);

		console.log('routes stuff ', {
			jupiter,
			inputToken,
			outputToken,
			inputAmount: size, // 1 unit in UI
			slippage: 1, // 1% slippage
		});
		const routes = await getRoutes({
			jupiter,
			inputToken,
			outputToken,
			inputAmount: size, // 1 unit in UI
			slippage: 1, // 1% slippage
		});
		console.log('routes: ', routes);

		const bestRoute = routes?.routesInfos[0];
		console.log('bestRoute: ', bestRoute);
		await executeSwap({ jupiter, route: bestRoute });
	};

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

		// const url = 'https://solana-api.projectserum.com';
		const url =
			'https://solana--mainnet.datahub.figment.io/apikey/5d2d7ea54a347197ccc56fd24ecc2ac5';
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
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success,
				);
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
		getPrice(fromTo.from.mint, fromTo.to.mint, size);
	}, []);

	// useEffect(() => {
	// 	const originalPair = fromTo.to.pairs.filter((pair) =>
	// 		pair.pair.includes(fromTo.from.symbol),
	// 	)[0].pair;

	// 	const pairIsNotOriginal =
	// 		fromTo.from.symbol + '/' + fromTo.to.symbol !== originalPair;

	// 	let marketName;
	// 	if (pairIsNotOriginal) {
	// 		marketName = fromTo.to.symbol + fromTo.from.symbol;
	// 		setSide('buy');
	// 	} else {
	// 		marketName = fromTo.from.symbol + fromTo.to.symbol;
	// 	}

	// 	console.log('marketName: ', marketName);

	// 	fetch(`https://serum-api.bonfida.com/trades/${marketName}`)
	// 		.then((res) => res.json())
	// 		.then((resp) => {
	// 			console.log('marketname', marketName);

	// 			console.log(resp);
	// 			const recentPrice = resp.data[0].price;
	// 			const newPrice = recentPrice * 1.005;
	// 			console.log('newprice', newPrice);
	// 			pairIsNotOriginal
	// 				? setDisplayPrice(1 / newPrice)
	// 				: setDisplayPrice(newPrice);
	// 			setSize(parseFloat(tradeAmount) / newPrice);
	// 			setPrice(newPrice);
	// 			setMarketAddress(resp.data[0].marketAddress);
	// 		})
	// 		.catch((err) => console.log('error ', err));
	// }, []);

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
								${normalizeNumber(tradeAmount * 0.004)}
							</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={{ marginBottom: 40 }}>
				<Button
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
						setModalVisible(true);
						submitJupTrade(fromTo.from.mint, fromTo.to.mint, size);
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
