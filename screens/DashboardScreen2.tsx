import React, { memo, useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
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
import { View, FlatList, Image } from 'react-native';
import { DashboardScreen } from '.';
import { AreaChart, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { SubPageHeader } from '../components';
import { theme } from '../core/theme';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import {
	Account,
	clusterApiUrl,
	Connection,
	PublicKey,
	sendAndConfirmTransaction,
	SystemProgram,
	Transaction,
	Keypair,
} from '@solana/web3.js';
import { generateMnemonic, mnemonicToSeed, accountFromSeed } from '../utils';
import bip39 from 'bip39';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Market } from '@project-serum/serum';
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
	'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);
import * as bip32 from 'bip32';
import nacl from 'tweetnacl';
import { derivePath } from 'ed25519-hd-key';

async function findAssociatedTokenAddress(
	walletAddress: PublicKey,
	tokenMintAddress: PublicKey,
): Promise<PublicKey> {
	return (
		await PublicKey.findProgramAddress(
			[
				walletAddress.toBuffer(),
				TOKEN_PROGRAM_ID.toBuffer(),
				tokenMintAddress.toBuffer(),
			],
			SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
		)
	)[0];
}

type Props = {
	navigation: Navigation;
};

const DashboardScreen2 = ({ navigation }: Props) => {
	// const [name, setName] = useState('');
	// const [secret, setSecret] = useState('');
	// const [logos, setLogos] = useState('');
	const data2 = [50, 10, 40, 30, 10, 10, 85, 91, 35, 53, 10, 24, 50, 10, 10];
	const [tokens, setTokens] = useState('');
	const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());

	const renderItem = (data: object) => {
		const { mint, price, amount, name, symbol, logoURI, change_24h } =
			data.item;

		return (
			<View>
				<Card.Title
					title={symbol}
					titleStyle={{
						color: '#1F1F1F',
						...theme.fonts.Nunito_Sans.Body_M_Bold,
						marginBottom: 0,
					}}
					subtitle={name}
					subtitleStyle={{
						...theme.fonts.Nunito_Sans.Caption_M_SemiBold,
						color: '#727D8D',
					}}
					style={{
						backgroundColor: 'white',
						borderRadius: 8,
						marginBottom: 8,
						borderWidth: 1,
						borderColor: theme.colors.border,
					}}
					left={(props) => {
						return (
							<Image
								style={{ height: 24, width: 24 }}
								source={{ uri: logoURI }}
							/>
						);
					}}
					right={(props) => {
						return (
							<View
								style={{
									alignItems: 'flex-end',
									marginRight: 16,
								}}
							>
								<Text
									style={{
										...theme.fonts.Nunito_Sans.Body_M_Bold,
										color: '#1F1F1F',
										marginBottom: 4,
									}}
								>
									${(amount * price).toFixed(2)}
								</Text>
								<View style={{ flexDirection: 'row' }}>
									{change_24h > 0 ? (
										<Image
											source={require('../assets/icons/Upward.jpg')}
											style={{
												width: 10,
												height: 10,
												marginVertical: 2,
											}}
										/>
									) : (
										<Image
											source={require('../assets/icons/Downward.jpg')}
											style={{
												width: 16,
												height: 16,
												marginVertical: 2,
											}}
										/>
									)}
									<Text
										style={[
											theme.fonts.Nunito_Sans
												.Caption_M_SemiBold,
											change_24h > 0
												? { color: 'green' }
												: { color: 'red' },
										]}
									>{`${change_24h.toFixed(1)}%`}</Text>
									<View
										style={{
											borderLeftColor:
												theme.colors.black_six,
											borderLeftWidth: 1,
											marginHorizontal: 8,
											marginVertical: 3,
										}}
									/>
									<Text
										style={{
											...theme.fonts.Nunito_Sans
												.Caption_M_SemiBold,
											color: '#727D8D',
										}}
									>
										{amount.toFixed(1)}
									</Text>
								</View>
							</View>
						);
					}}
				/>
			</View>
		);
	};

	//gets owned tokens, adds sol to it, adds detail to all the coins, then sets to state
	async function getOwnedTokens() {
		const url = 'https://api.mainnet-beta.solana.com';
		const connection = new Connection(url);
		const publicKey = new PublicKey(
			'FEVcXsrw9gVSSQ5GtNAr9Q1wz9hGrUJoDFA7q9CVuWhU',
		);
		const programId = new PublicKey(
			'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
		);
		const ownedTokens = await connection.getTokenAccountsByOwner(
			publicKey,
			{ programId },
		);
		const result2 = await connection.getParsedAccountInfo(publicKey);

		let tokens2 = [];
		const solBalance = await connection.getBalance(publicKey);
		const realSolBalance = solBalance * 0.000000001;
		if (solBalance > 0) {
			const apiKey = 'f7353e06-2e44-4912-9fff-05929a5681a7';

			const priceData = await fetch(
				`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=sol`,
				{
					headers: {
						'X-CMC_PRO_API_KEY': apiKey,
						Accept: 'application/json',
						'Accept-Encoding': 'deflate, gzip',
					},
				},
			)
				.then((response) => response.json())
				.then((data) => {
					const dataArray = Object.values(data.data);
					const price = dataArray[0].quote.USD.price;
					const change_24h =
						dataArray[0].quote.USD.percent_change_24h;
					return { price, change_24h };
				})
				.catch((error) => console.log(error));
			const { price, change_24h } = priceData;
			const tokenObject = {
				mint: 'So11111111111111111111111111111111111111112',
				amount: realSolBalance,
				name: 'Solana',
				symbol: 'SOL',
				logoURI:
					'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
				extensions: {
					coingeckoId: 'solana',
					discord: 'https://discord.com/invite/pquxPsq',
					serumV3Usdc: '7xMDbYTCqQEcK2aM9LbetGtNFJpzKdfXzLL5juaLh4GJ',
					twitter: 'https://twitter.com/solana',
					website: 'https://solana.com/',
				},
				price,
				change_24h,
			};
			tokens2.push(tokenObject);
		}

		await Promise.all(
			ownedTokens.value.map(async (item) => {
				const result = await connection.getParsedAccountInfo(
					item.pubkey,
				);

				const mint = result.value.data.parsed.info.mint;
				const amount =
					result.value.data.parsed.info.tokenAmount.uiAmount;
				const otherDetails = tokenMap.get(mint);
				const { name, symbol, logoURI, extensions } = otherDetails;

				const mintKey = new PublicKey(mint);
				const walletAddress = new PublicKey(
					'FEVcXsrw9gVSSQ5GtNAr9Q1wz9hGrUJoDFA7q9CVuWhU',
				);

				const associatedTokenAddress = await findAssociatedTokenAddress(
					walletAddress,
					mintKey,
				);

				const associatedTokenAddressHash =
					associatedTokenAddress.toString('hex');

				const apiKey = 'f7353e06-2e44-4912-9fff-05929a5681a7';

				// let price = '';

				const priceData = await fetch(
					`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
					{
						headers: {
							'X-CMC_PRO_API_KEY': apiKey,
							Accept: 'application/json',
							'Accept-Encoding': 'deflate, gzip',
						},
					},
				)
					.then((response) => response.json())
					.then((data) => {
						const dataArray = Object.values(data.data);
						const price = dataArray[0].quote.USD.price;
						const change_24h =
							dataArray[0].quote.USD.percent_change_24h;
						return { price, change_24h };
					})
					.catch((error) => console.log(error));
				const { price, change_24h } = priceData;

				const tokenObject = {
					mint,
					amount,
					name,
					symbol,
					logoURI,
					extensions,
					price,
					change_24h,
					associatedTokenAddress,
					associatedTokenAddressHash,
				};
				tokens2.push(tokenObject);
			}),
		);
		setTokens(tokens2);
	}

	async function testMarkets() {
		let mnemonic =
			'***REMOVED***';

		const bip39 = await import('bip39');

		const DERIVATION_PATH = {
			deprecated: undefined,
			bip44: 'bip44',
			bip44Change: 'bip44Change',
			bip44Root: 'bip44Root', // Ledger only.
		};

		function getAccountFromSeed(
			seed,
			walletIndex,
			dPath = undefined,
			accountIndex = 0,
		) {
			const derivedSeed = deriveSeed(
				seed,
				walletIndex,
				dPath,
				accountIndex,
			);
			return new Account(
				nacl.sign.keyPair.fromSeed(derivedSeed).secretKey,
			);
		}

		function deriveSeed(seed, walletIndex, derivationPath, accountIndex) {
			switch (derivationPath) {
				case DERIVATION_PATH.deprecated:
					const path = `m/501'/${walletIndex}'/0/${accountIndex}`;
					return bip32.fromSeed(seed).derivePath(path).privateKey;
				case DERIVATION_PATH.bip44:
					const path44 = `m/44'/501'/${walletIndex}'`;
					return derivePath(path44, seed).key;
				case DERIVATION_PATH.bip44Change:
					const path44Change = `m/44'/501'/${walletIndex}'/0'`;
					return derivePath(path44Change, seed).key;
				default:
					throw new Error(
						`invalid derivation path: ${derivationPath}`,
					);
			}
		}

		//wallet I'm pulling mnemonic from: FEVcXsrw9gVSSQ5GtNAr9Q1wz9hGrUJoDFA7q9CVuWhU
		const seed = await bip39.mnemonicToSeed(mnemonic); //returns 64 byte array
		const newAccount = getAccountFromSeed(
			seed,
			2,
			DERIVATION_PATH.bip44Change,
		);
		console.log('new Account', newAccount.publicKey.toString('hex'));
		const seed32 = seed.slice(0, 32);
		const keyPair = Keypair.fromSeed(seed32);
		console.log(keyPair.publicKey.toString('hex'));
		//returns BNjgSdrq3ybAQ8JqY8BkjMVRFcru1ABGP1qseBz5qBuv
		const secretKey = keyPair.secretKey;

		const url = 'https://solana-api.projectserum.com';
		const connection = new Connection(url);

		//dxl to usdc pulled from https://serum-api.bonfida.com/trades/DXLUSDC
		const marketAddress = new PublicKey(
			'DYfigimKWc5VhavR4moPBibx9sMcWYVSjVdWvPztBPTa',
		);
		//serum v3 program address pulled from Solana Explorer
		const programAddress = new PublicKey(
			'9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
		);

		let market = await Market.load(
			connection,
			marketAddress,
			{},
			programAddress,
		);

		let owner = new Account(newAccount.secretKey);

		const newbalance = await connection.getBalance(owner.publicKey);
		console.log('newbalance: ', newbalance);
		//DXL Associated Program Token Account
		// let payer = new PublicKey(
		// 	'4MJYFcV2WN7PBr17e6iACbxxgnTDzpG1cTTvBE11zMey',
		// );

		//USDC Associated Program Token Account
		let payer = new PublicKey(
			'2To9gKdDUxcBaavSY8wgDQTZaEYVXPy9uQ38mmTDbWAW',
		);
		console.log('payer', payer);

		// await market
		// 	.placeOrder(connection, {
		// 		owner,
		// 		payer,
		// 		side: 'buy',
		// 		price: 0.37,
		// 		size: 10,
		// 		orderType: 'limit',
		// 	})
		// 	.then((response) => {
		// 		console.log('response hit');
		// 		console.log(response);
		// 	})
		// 	.catch((err) => console.log(err));

		// let myOrders = await market.loadOrdersForOwner(
		// 	connection,
		// 	owner.publicKey,
		// );

		let otherOrders = await market.findOpenOrdersAccountsForOwner(
			connection,
			owner.publicKey,
		);

		//settle orders:
		const baseTokenAccount = new PublicKey(
			'2To9gKdDUxcBaavSY8wgDQTZaEYVXPy9uQ38mmTDbWAW',
		);
		const quoteTokenAccount = new PublicKey(
			'4MJYFcV2WN7PBr17e6iACbxxgnTDzpG1cTTvBE11zMey',
		);

		// const openOrders = await market.findOpenOrdersAccountsForOwner(
		// 	connection,
		// 	owner.publicKey,
		// );

		for (let openOrders of await market.findOpenOrdersAccountsForOwner(
			connection,
			owner.publicKey,
		)) {
			console.log('hit');
			if (openOrders.baseTokenFree > 0 || openOrders.quoteTokenFree > 0) {
				// spl-token accounts to which to send the proceeds from trades
				console.log('hit 2');
				await market.settleFunds(
					connection,
					owner,
					openOrders,
					baseTokenAccount,
					quoteTokenAccount,
				);
			}
		}

		console.log('open orders', openOrders[0].baseTokenFree > 0);
		console.log('open orders', openOrders[0].quoteTokenFree);

		console.log('my orders againa', otherOrders[0].orders);

		// console.log('myorders', myOrders);
	}

	useEffect(() => {
		getOwnedTokens();
		// testMarkets();
	}, [tokenMap]);

	useEffect(() => {
		new TokenListProvider().resolve().then((tokens) => {
			const tokenList = tokens
				.filterByClusterSlug('mainnet-beta')
				.getList();

			setTokenMap(
				tokenList.reduce((map, item) => {
					map.set(item.address, item);
					return map;
				}, new Map()),
			);
		});
	}, [setTokenMap]);

	const address = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
	const address2 = '6dk8qW3qLQz3KRBUAQf71k7aQw87rXTiqb6eguWD9rjK';
	const token = tokenMap.get(address2);

	let todayTotal;
	let percentChange;
	if (tokens) {
		console.log('tokens', tokens);
		const totals = tokens?.map((item) => {
			return item.amount * item.price;
		});

		todayTotal = totals.reduce((prev, current) => prev + current);

		const yesterdayTotals = tokens?.map((item) => {
			const change = item.change_24h * 0.001;
			let multiplier;
			change > 0 ? (multiplier = 1 - change) : (multiplier = 1 + change);

			const total = item.amount * item.price;

			const yesterday = total * multiplier;

			return yesterday;
		});

		const yesterdayTotal = yesterdayTotals.reduce(
			(prev, current) => prev + current,
		);

		percentChange = ((todayTotal - yesterdayTotal) / todayTotal) * 100;
	}

	if (!tokens) {
		return (
			<Background>
				<SubPageHeader backButton={true}>Dashboard</SubPageHeader>
				<Text>Loading...</Text>
			</Background>
		);
	}

	return (
		<Background>
			<SubPageHeader backButton={false}>Dashboard</SubPageHeader>
			{/* <Button
				onPress={() => {
					console.log('run');
					testMarkets();
				}}
			>
				Test Markets
			</Button> */}
			<View
				style={{
					borderWidth: 1,
					borderColor: theme.colors.border,
					backgroundColor: 'white',
					borderRadius: 8,
					padding: 16,
				}}
			>
				<Text
					style={{
						marginVertical: 8,
						...theme.fonts.Azeret_Mono.Body_M_SemiBold,
					}}
				>
					Price History
				</Text>
				<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
					<Text style={{ fontSize: 24, marginRight: 8 }}>
						${todayTotal.toFixed(2)}
					</Text>
					{percentChange > 0 ? (
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
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
								{percentChange?.toFixed(1)}% Today
							</Text>
						</View>
					) : (
						<View style={{ flexDirection: 'row' }}>
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
								{percentChange?.toFixed(1)}% Today
							</Text>
						</View>
					)}
					{/* <Text style={{ color: '#07CC79' }}>
						{percentChange > 0 ? 'Up' : 'Down'}{' '}
						{percentChange.toFixed(1)}% Today
					</Text> */}
				</View>

				<AreaChart
					style={{ height: 200 }}
					data={data2}
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

			<View style={{ marginTop: 24, marginBottom: 8 }}>
				<Text
					style={{
						marginBottom: 8,
						...theme.fonts.Azeret_Mono.Body_M_SemiBold,
					}}
				>
					Portfolio
				</Text>
				{tokens ? (
					<FlatList
						data={tokens}
						renderItem={renderItem}
						keyExtractor={(item) => item.address}
					/>
				) : null}
			</View>
		</Background>
	);
};

export default memo(DashboardScreen2);
