import React, { memo, useState, useEffect } from 'react';
import { Text, ScrollView } from 'react-native';
import { Background, Button } from '../components';
import { Navigation } from '../types';
import { View, FlatList, Image } from 'react-native';
import { AreaChart, Path } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import * as shape from 'd3-shape';
import { Card } from 'react-native-paper';
import { SubPageHeader } from '../components';
import { theme } from '../core/theme';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import { Account, Connection, PublicKey, Keypair } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Market } from '@project-serum/serum';
import {
	findAssociatedTokenAddress,
	getAccountFromSeed,
	DERIVATION_PATH,
} from '../utils';
import { derivePath } from 'ed25519-hd-key';
import TokenCard from '../components/TokenCard';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';
import * as SecureStore from 'expo-secure-store';

type Props = {
	navigation: Navigation;
};

const DashboardScreen2 = ({ navigation }: Props) => {
	const [chartData, setChartData] = useState('');
	const [account, setAccount] = useState('');
	const [connection, setConnection] = useState('');
	const [tokens, setTokens] = useState('');
	const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
	const passcode = useStoreState((state) => state.passcode);

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

	//gets owned tokens, adds sol to it, adds detail to all the coins, then sets to state
	async function getOwnedTokens() {
		const url = 'https://api.mainnet-beta.solana.com';
		const connection = new Connection(url);

		let mnemonic = await SecureStore.getItemAsync(passcode);
		const bip39 = await import('bip39');
		//wallet I'm pulling mnemonic from: FEVcXsrw9gVSSQ5GtNAr9Q1wz9hGrUJoDFA7q9CVuWhU
		const seed = await bip39.mnemonicToSeed(mnemonic); //returns 64 byte array
		const newAccount = getAccountFromSeed(
			seed,
			2,
			DERIVATION_PATH.bip44Change,
		);

		const { publicKey } = newAccount;

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
			//gmail key
			const apiKey = 'f7353e06-2e44-4912-9fff-05929a5681a7';
			//travppatset key
			const apiKey2 = '410f0e32-f228-4060-b13a-1b215476051a';

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
					const change_24h =
						dataArray[0].quote.USD.percent_change_24h;
					const change_30d =
						dataArray[0].quote.USD.percent_change_30d;
					const change_60d =
						dataArray[0].quote.USD.percent_change_60d;
					const change_90d =
						dataArray[0].quote.USD.percent_change_90d;
					const {
						price,
						volume_24h,
						market_cap,
						market_cap_dominance,
					} = dataArray[0].quote.USD;
					return {
						price,
						change_24h,
						change_30d,
						change_60d,
						change_90d,
						volume_24h,
						market_cap,
						market_cap_dominance,
					};
				})
				.catch((error) => console.log(error));

			const {
				price,
				change_24h,
				change_30d,
				change_60d,
				change_90d,
				volume_24h,
				market_cap,
				market_cap_dominance,
			} = priceData;
			const price_30d = price * (1 + change_30d * 0.01);
			const price_60d = price * (1 + change_60d * 0.01);
			const price_90d = price * (1 + change_90d * 0.01);
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
				price_30d,
				price_60d,
				price_90d,
				change_24h,
				change_30d,
				change_60d,
				change_90d,
				volume_24h,
				market_cap,
				aboutData:
					'Solana (SOL) is a cryptocurrency launched in 2020. Solana has a current supply of 506,348,680.4303728 with 299,902,995.15039116 in circulation. The last known price of Solana is 146.68289748 USD and is up 1.09 over the last 24 hours. It is currently trading on 161 active market(s) with $2,959,138,044.47 traded over the last 24 hours. More information can be found at https://solana.com.',
				market_cap_dominance,
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

				//gmail key
				const apiKey = 'f7353e06-2e44-4912-9fff-05929a5681a7';
				//travppatset key
				const apiKey2 = '410f0e32-f228-4060-b13a-1b215476051a';

				// let price = '';

				const aboutData = await fetch(
					`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${symbol}`,
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
						return dataArray[0].description;
					})
					.catch((err) => console.log('error', err));

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
						const change_24h =
							dataArray[0].quote.USD.percent_change_24h;
						const change_30d =
							dataArray[0].quote.USD.percent_change_30d;
						const change_60d =
							dataArray[0].quote.USD.percent_change_60d;
						const change_90d =
							dataArray[0].quote.USD.percent_change_90d;
						const {
							price,
							volume_24h,
							market_cap,
							market_cap_dominance,
						} = dataArray[0].quote.USD;
						return {
							price,
							change_24h,
							change_30d,
							change_60d,
							change_90d,
							volume_24h,
							market_cap,
							market_cap_dominance,
						};
					})
					.catch((error) => console.log(error));
				const {
					price,
					change_24h,
					change_30d,
					change_60d,
					change_90d,
					volume_24h,
					market_cap,
					market_cap_dominance,
				} = priceData;

				const price_30d = price * (1 + change_30d * 0.01);
				const price_60d = price * (1 + change_60d * 0.01);
				const price_90d = price * (1 + change_90d * 0.01);

				const tokenObject = {
					mint,
					amount,
					name,
					symbol,
					logoURI,
					extensions,
					price,
					change_24h,
					change_30d,
					change_60d,
					change_90d,
					price_30d,
					price_60d,
					price_90d,
					associatedTokenAddress,
					associatedTokenAddressHash,
					volume_24h,
					market_cap,
					market_cap_dominance,
					aboutData,
				};
				tokens2.push(tokenObject);
			}),
		);
		setTokens(tokens2);
	}

	async function prepTrade() {
		// let mnemonic =
		// 	'***REMOVED***';

		let mnemonic = await SecureStore.getItemAsync(passcode);
		const bip39 = await import('bip39');
		//wallet I'm pulling mnemonic from: FEVcXsrw9gVSSQ5GtNAr9Q1wz9hGrUJoDFA7q9CVuWhU
		const seed = await bip39.mnemonicToSeed(mnemonic); //returns 64 byte array
		const newAccount = getAccountFromSeed(
			seed,
			2,
			DERIVATION_PATH.bip44Change,
		);

		const url = 'https://solana-api.projectserum.com';
		const newConnection = new Connection(url);
		setAccount(newAccount);
		setConnection(newConnection);
		console.log('done');
	}

	async function testMarkets() {
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

		let owner = new Account(account.secretKey);

		console.log(
			'wallet address dashboard',
			owner.secretKey.toString('hex'),
		);

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

		await market
			.placeOrder(connection, {
				owner,
				payer,
				side: 'buy',
				price: 0.37,
				size: 10,
				orderType: 'ioc',
			})
			.then((response) => {
				console.log('response hit');
				console.log(response);
			})
			.catch((err) => console.log(err));

		// let myOrders = await market.loadOrdersForOwner(
		// 	connection,
		// 	owner.publicKey,
		// );

		// let otherOrders = await market.findOpenOrdersAccountsForOwner(
		// 	connection,
		// 	owner.publicKey,
		// );
	}

	async function settleFunds() {
		let owner = new Account(account.secretKey);
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

		// const openOrders = await market.findOpenOrdersAccountsForOwner(
		// 	connection,
		// 	owner.publicKey,
		// );

		//usdc associated token account
		const quoteTokenAccount = new PublicKey(
			'2To9gKdDUxcBaavSY8wgDQTZaEYVXPy9uQ38mmTDbWAW',
		);

		//dxl associated token account
		const baseTokenAccount = new PublicKey(
			'4MJYFcV2WN7PBr17e6iACbxxgnTDzpG1cTTvBE11zMey',
		);

		for (let openOrders of await market.findOpenOrdersAccountsForOwner(
			connection,
			owner.publicKey,
		)) {
			console.log('hit');
			if (openOrders.baseTokenFree > 0 || openOrders.quoteTokenFree > 0) {
				// spl-token accounts to which to send the proceeds from trades
				console.log('hit 2');
				await market
					.settleFunds(
						connection,
						owner,
						openOrders,
						baseTokenAccount,
						quoteTokenAccount,
					)
					.then((res) => console.log('response', res))
					.catch((err) => console.log('error', err));
			} else {
				console.log('hit other');
			}
		}
	}

	useEffect(() => {
		if (tokens) {
			let todayArray = [];
			let d30Array = [];
			let d60Array = [];
			let d90Array = [];
			tokens.forEach((token) => {
				todayArray.push(token.price * token.amount);
				d30Array.push(token.price_30d * token.amount);
				d60Array.push(token.price_60d * token.amount);
				d90Array.push(token.price_90d * token.amount);
			});
			let sumToday = 0;
			for (let i = 0; i < todayArray.length; i++) {
				sumToday += todayArray[i];
			}

			let sum30 = 0;
			for (let i = 0; i < d30Array.length; i++) {
				sum30 += d30Array[i];
			}
			let sum60 = 0;
			for (let i = 0; i < d60Array.length; i++) {
				sum60 += d60Array[i];
			}
			let sum90 = 0;
			for (let i = 0; i < d90Array.length; i++) {
				sum90 += d90Array[i];
			}

			const today = setChartData([sum90, sum60, sum30, sumToday]);
		}
	}, [tokens]);

	useEffect(() => {
		// getOwnedTokens();
		// testMarkets();
	}, [tokenMap]);

	// function filterString(string: string, matchString: string, isEqual: boolean) {
	// 	if (isEqual) {
	// 		return string.indexOf(matchString) >= 0
	// 	}
	// 	return string.indexOf(matchString) === -1;
	// }

	// function filterArray(string: string, matchString: string, isEqual: boolean) {

	// }

	useEffect(() => {
		//get a clean list of all symbols in bonfida (remove all the perps ones), dedupe them, then grab their symbols, then grab their pairs, then list if it's buy side or sell side for each one
		//then make two big calls to coinmarketcap - one for data, the other for price
		//then combine all of those results based on symbol name 🎉

		//to dedupe going to take the array and split them into individual symbols >> then dedupe that array >> then
		fetch('https://serum-api.bonfida.com/pairs')
			.then((res) => res.json())
			.then((res) => {
				//remove pools and dashes
				const removedDashes = res.data.filter(
					(str: string) => str.indexOf('-') === -1,
				);
				const removedPools = removedDashes.filter(
					(str: string) => str.indexOf('POOL') === -1,
				);

				//split the pairs into separate symbols
				const symbolsArray = [];
				for (let i = 0; i < removedPools.length; i++) {
					const el = removedPools[i];
					const splitArray = el.split('/');
					symbolsArray.push(...splitArray);
				}

				//dedupe symbols
				const dedupedSymbols = [...new Set(symbolsArray)];

				//remove random hashes
				const cleanArray = [];
				for (let i = 0; i < dedupedSymbols.length; i++) {
					const el = dedupedSymbols[i];
					if (el.length < 15) {
						cleanArray.push(el);
					}
				}

				const finishedArray = [];
				for (let i = 0; i < cleanArray.length; i++) {
					const el = cleanArray[i];

					//find matching pairs
					const pairs = removedPools.filter(
						(str: string) => str.indexOf(el) >= 0,
					);
					const pairsArray = [];
					for (let i = 0; i < pairs.length; i++) {
						const el2 = pairs[i];

						//take away the name and slash
						const removeSymbol = el2.replace(el, '');
						const removeSlash = removeSymbol.replace('/', '');

						//deduce whether sell or buy side
						let side;
						removeSlash === el2.slice(0, removeSlash.length)
							? (side = 'buy')
							: (side = 'sell');

						//construct array object
						const newPair = {
							pair: el2,
							symbol: removeSlash,
							side: side,
						};

						pairsArray.push(newPair);
					}

					const finishedObject = {
						symbol: el,
						pairs: pairsArray,
					};

					finishedArray.push(finishedObject);
				}
				console.log('finished array', finishedArray);
			})
			.catch((err) => console.log(err));
		return () => {
			console.log('hello');
		};
	}, []);

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
			const change = item.change_24h * 0.01;
			let multiplier = 1 - change;
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
			<ScrollView showsVerticalScrollIndicator={false}>
				<SubPageHeader backButton={false}>Dashboard</SubPageHeader>
				<Button onPress={() => prepTrade()}>Prep Trade</Button>
				<Button onPress={() => testMarkets()}>Test Market</Button>
				<Button onPress={() => settleFunds()}>Settle Funds</Button>
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
						Portfolio History
					</Text>
					<View
						style={{ flexDirection: 'row', alignItems: 'flex-end' }}
					>
						<Text
							style={{
								...theme.fonts.Nunito_Sans.Header_L_Semibold,
								marginRight: 4,
							}}
						>
							{`$${todayTotal.toFixed(2)}`}
						</Text>
						{percentChange > 0 ? (
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
									{percentChange?.toFixed(1)}% Today
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
									{percentChange?.toFixed(1)}% Today
								</Text>
							</View>
						)}
					</View>
					<AreaChart
						style={{ height: 200 }}
						data={chartData}
						// data={[1, 2, 3, 4]}
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
							renderItem={(token) => (
								<TokenCard
									token={token}
									onPress={() =>
										navigation.navigate(
											'Token Details',
											token.item,
										)
									}
								/>
							)}
							// renderItem={TokenCard}
							keyExtractor={(item) => item.address}
						/>
					) : null}
				</View>
			</ScrollView>
		</Background>
	);
};

export default memo(DashboardScreen2);
