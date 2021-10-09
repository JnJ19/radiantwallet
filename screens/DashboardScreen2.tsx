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

import { Market } from '@project-serum/serum';

console.log('market', Market);

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
		const { mint, price, amount, name, symbol, logoURI } = data.item;

		return (
			<View>
				<Card.Title
					title={symbol}
					titleStyle={{ color: '#1F1F1F', fontSize: 17 }}
					subtitle={name}
					subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
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
									style={{ fontSize: 17, color: '#1F1F1F' }}
								>
									{amount}
								</Text>
								<Text
									style={{ fontSize: 14, color: '#727D8D' }}
								>
									${(amount * price).toFixed(2)}
								</Text>
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
		const connection = await new Connection(url);
		const publicKey = await new PublicKey(
			'FEVcXsrw9gVSSQ5GtNAr9Q1wz9hGrUJoDFA7q9CVuWhU',
		);
		const programId = await new PublicKey(
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
				};
				tokens2.push(tokenObject);
			}),
		);
		setTokens(tokens2);
	}

	async function testMarkets() {
		// const url = 'https://api.mainnet-beta.solana.com';
		const url = 'http://solana-api.projectserum.com';
		const connection = new Connection(url);
		//SOLUSDC market address
		const marketAddress = new PublicKey(
			'9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT',
		);
		//serum v3 program address
		const programAddress = new PublicKey(
			'9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
		);
		//serum stuff
		let market = await Market.load(
			connection,
			marketAddress,
			{},
			programAddress,
		);

		console.log('market', market);
		// Fetching orderbooks
		let bids = await market.loadBids(connection);
		let asks = await market.loadAsks(connection);
		console.log('bids', bids);
		console.log('asks', asks);

		// L2 orderbook data
		for (let [price, size] of bids.getL2(20)) {
			console.log(price, size);
		}
		// Full orderbook data
		// for (let order of asks) {
		// 	console.log('hello');
		// 	console.log(
		// 		order.orderId,
		// 		order.price,
		// 		order.size,
		// 		order.side, // 'buy' or 'sell'
		// 	);
		// }

		let phrase =
			'***REMOVED***';

		const bip39 = await import('bip39');
		const seed = await bip39.mnemonicToSeed(phrase);

		//serum only cares about first 32 bytes
		const seed32 = seed.slice(0, 32);

		const keyPair = Keypair.fromSeed(seed32);

		const secretKey = keyPair.secretKey;
		console.log('secretKey: ', secretKey);

		let owner = new Account(secretKey);
		console.log('owner', owner);
		//usdc account - not sure if this is right - maybe needs to be solana account? I don't freaking know
		// let payer = new PublicKey(
		// 	'FEVcXsrw9gVSSQ5GtNAr9Q1wz9hGrUJoDFA7q9CVuWhU',
		// ); // spl-token account
		//solana account
		console.log('connection', connection);
		let payer = new PublicKey(
			'FEVcXsrw9gVSSQ5GtNAr9Q1wz9hGrUJoDFA7q9CVuWhU',
		); // spl-token account
		// await market
		// 	.placeOrder(connection, {
		// 		owner,
		// 		payer,
		// 		side: 'sell', // 'buy' or 'sell'
		// 		price: 165.45,
		// 		size: 1.0,
		// 		orderType: 'limit', // 'limit', 'ioc', 'postOnly'
		// 	})
		// 	.then((response) => console.log(response))
		// 	.catch((err) => console.log(err));
	}

	useEffect(() => {
		getOwnedTokens();
		testMarkets();
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
			<SubPageHeader backButton={true}>Dashboard</SubPageHeader>

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
					<Text style={{ color: '#07CC79' }}>
						{percentChange > 0 ? 'Up' : 'Down'}{' '}
						{percentChange.toFixed(1)}% Today
					</Text>
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
				<Text style={{ marginBottom: 8 }}>Portfolio</Text>
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
