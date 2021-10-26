import React, { memo, useState, useEffect } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { Background, Button } from '../components';
import { Navigation } from '../types';
import { View, FlatList, Image } from 'react-native';
import { AreaChart, Path } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import * as shape from 'd3-shape';
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
import Modal from 'react-native-modal';
const addCommas = new Intl.NumberFormat('en-US');

type Props = {
	navigation: Navigation;
};

const DashboardScreen2 = ({ navigation }: Props) => {
	const [chartData, setChartData] = useState('');
	const [modalVisible, setModalVisible] = useState(true);
	const [account, setAccount] = useState('');
	const [connection, setConnection] = useState('');
	const [tokens, setTokens] = useState('');
	const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
	const passcode = useStoreState((state) => state.passcode);
	const allTokens = useStoreState((state) => state.allTokens);
	const setAllTokens = useStoreActions((actions) => actions.setAllTokens);
	const setOwnedTokens = useStoreActions((actions) => actions.setOwnedTokens);

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
			0,
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
			const priceData = await fetch(
				`https://radiant-wallet-server.travissehansen.repl.co/api`,
				{
					method: 'POST',
					body: JSON.stringify({
						url: '/quotes/latest?symbol=sol',
					}),
					headers: { 'Content-type': 'application/json' },
				},
			)
				.then((response) => response.json())
				.then((data) => {
					const dataArray = Object.values(data.data);
					const percent_change_24h =
						dataArray[0].quote.USD.percent_change_24h;
					const percent_change_30d =
						dataArray[0].quote.USD.percent_change_30d;
					const percent_change_60d =
						dataArray[0].quote.USD.percent_change_60d;
					const percent_change_90d =
						dataArray[0].quote.USD.percent_change_90d;
					const {
						price,
						volume_24h,
						market_cap,
						market_cap_dominance,
					} = dataArray[0].quote.USD;
					return {
						price,
						percent_change_24h,
						percent_change_30d,
						percent_change_60d,
						percent_change_90d,
						volume_24h,
						market_cap,
						market_cap_dominance,
					};
				})
				.catch((error) => console.log('hello error', error));

			const {
				price,
				percent_change_24h,
				percent_change_30d,
				percent_change_60d,
				percent_change_90d,
				volume_24h,
				market_cap,
				market_cap_dominance,
			} = priceData;
			const price_30d = price * (1 + percent_change_30d * 0.01);
			const price_60d = price * (1 + percent_change_60d * 0.01);
			const price_90d = price * (1 + percent_change_90d * 0.01);
			const tokenObject = {
				mint: 'So11111111111111111111111111111111111111112',
				amount: realSolBalance,
				name: 'Solana',
				symbol: 'SOL',
				logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
				chat: 'https://discord.com/invite/pquxPsq',
				twitter: 'https://twitter.com/solana',
				website: 'https://solana.com/',
				price,
				price_30d,
				price_60d,
				price_90d,
				percent_change_24h,
				percent_change_30d,
				percent_change_60d,
				percent_change_90d,
				volume_24h,
				market_cap,
				description:
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
				if (otherDetails) {
					// console.log('otherdetails', otherDetails);
					const { name, symbol, logoURI, extensions } = otherDetails;
					const logo = logoURI;

					const mintKey = new PublicKey(mint);
					const walletAddress = new PublicKey(
						'FEVcXsrw9gVSSQ5GtNAr9Q1wz9hGrUJoDFA7q9CVuWhU',
					);

					const associatedTokenAddress =
						await findAssociatedTokenAddress(
							walletAddress,
							mintKey,
						);

					const associatedTokenAddressHash =
						associatedTokenAddress.toString('hex');

					const aboutData = await fetch(
						`https://radiant-wallet-server.travissehansen.repl.co/api`,
						{
							method: 'POST',
							body: JSON.stringify({
								url: `/info?symbol=${symbol}`,
							}),
							headers: { 'Content-type': 'application/json' },
						},
					)
						.then((response) => response.json())
						.then((data) => {
							const dataArray = Object.values(data.data);
							// console.log('data array', dataArray);
							return {
								description: dataArray[0].description,
								logo: dataArray[0].logo,
								name: dataArray[0].name,
								website: dataArray[0].urls.website[0],
								twitter: dataArray[0].urls.twitter[0],
								chat: dataArray[0].urls.chat[0],
							};
						})
						.catch((err) => console.log('error', err));

					const priceData = await fetch(
						`https://radiant-wallet-server.travissehansen.repl.co/api`,
						{
							method: 'POST',
							body: JSON.stringify({
								url: `/quotes/latest?symbol=${symbol}`,
							}),
							headers: { 'Content-type': 'application/json' },
						},
					)
						.then((response) => response.json())
						.then((data) => {
							const dataArray = Object.values(data.data);
							const percent_change_24h =
								dataArray[0].quote.USD.percent_change_24h;
							const percent_change_30d =
								dataArray[0].quote.USD.percent_change_30d;
							const percent_change_60d =
								dataArray[0].quote.USD.percent_change_60d;
							const percent_change_90d =
								dataArray[0].quote.USD.percent_change_90d;
							const {
								price,
								volume_24h,
								market_cap,
								market_cap_dominance,
							} = dataArray[0].quote.USD;
							return {
								price,
								percent_change_24h,
								percent_change_30d,
								percent_change_60d,
								percent_change_90d,
								volume_24h,
								market_cap,
								market_cap_dominance,
							};
						})
						.catch((error) => console.log(error));
					const {
						price,
						percent_change_24h,
						percent_change_30d,
						percent_change_60d,
						percent_change_90d,
						volume_24h,
						market_cap,
						market_cap_dominance,
					} = priceData;

					const price_30d = price * (1 + percent_change_30d * 0.01);
					const price_60d = price * (1 + percent_change_60d * 0.01);
					const price_90d = price * (1 + percent_change_90d * 0.01);

					const tokenObject = {
						mint,
						amount,
						name,
						symbol,
						logo,
						extensions,
						price,
						percent_change_24h,
						percent_change_30d,
						percent_change_60d,
						percent_change_90d,
						price_30d,
						price_60d,
						price_90d,
						associatedTokenAddress,
						associatedTokenAddressHash,
						volume_24h,
						market_cap,
						market_cap_dominance,
						...aboutData,
					};
					tokens2.push(tokenObject);
				}
			}),
		);

		// console.log('tokens2', tokens2);

		setTokens(tokens2);
		setOwnedTokens(tokens2);
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
			if (openOrders.baseTokenFree > 0 || openOrders.quoteTokenFree > 0) {
				// spl-token accounts to which to send the proceeds from trades
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

	async function getAllTokens() {
		const tokenPairs = await getTokenPairs();
		const symbolsList = await getCleanTokenList();
		const combinedSymbolList = symbolsList.join();

		const coinMarketCapTokens = await fetch(
			`https://radiant-wallet-server.travissehansen.repl.co/api`,
			{
				method: 'POST',
				body: JSON.stringify({
					url: `/info?symbol=${combinedSymbolList}`,
				}),
				headers: { 'Content-type': 'application/json' },
			},
		)
			.then((response) => response.json())
			.then((data) => {
				return Object.values(data.data);
			});
		//combine token pairs and coinmarketcap data
		const combinedArray = [];
		for (let i = 0; i < coinMarketCapTokens.length; i++) {
			const cmToken = coinMarketCapTokens[i];
			const pairs = tokenPairs.find(
				(pair: object) => pair.symbol === cmToken.symbol,
			);
			// console.log('pairs: ', pairs);

			if (pairs) {
				const {
					name,
					logo,
					symbol,
					description,
					urls: { twitter, chat, website },
				} = cmToken;

				const newObject = {
					name,
					logo,
					symbol,
					description,
					twitter,
					chat,
					website,
					pairs: pairs.pairs,
				};
				combinedArray.push(newObject);
			}
		}

		// console.log('combeind array', combinedArray);

		//get and combine prices now too
		const coinMarketCapPrices = await fetch(
			`https://radiant-wallet-server.travissehansen.repl.co/api`,
			{
				method: 'POST',
				body: JSON.stringify({
					url: `/quotes/latest?symbol=${combinedSymbolList}`,
				}),
				headers: { 'Content-type': 'application/json' },
			},
		)
			.then((response) => response.json())
			.then((data) => {
				return Object.values(data.data);
			});

		// console.log('cmc prices', coinMarketCapPrices);

		const combinedArrayWithPrices = [];
		for (let i = 0; i < combinedArray.length; i++) {
			const element = combinedArray[i];
			const prices = coinMarketCapPrices.find(
				(priceSet) => priceSet.symbol === element.symbol,
			);

			const {
				percent_change_24h,
				market_cap,
				market_cap_dominance,
				percent_change_30d,
				percent_change_60d,
				percent_change_90d,
				price,
				volume_24h,
			} = prices.quote.USD;

			const price_30d = price * (1 + percent_change_30d * 0.01);
			const price_60d = price * (1 + percent_change_60d * 0.01);
			const price_90d = price * (1 + percent_change_90d * 0.01);

			const newObject = {
				...element,
				percent_change_24h,
				market_cap,
				market_cap_dominance,
				percent_change_30d,
				percent_change_60d,
				percent_change_90d,
				price_30d,
				price_60d,
				price_90d,
				price,
				volume_24h,
			};
			combinedArrayWithPrices.push(newObject);
		}

		console.log('combined array with prices', combinedArrayWithPrices);
		setAllTokens(combinedArrayWithPrices);

		//now add market address
	}

	function getTokenPair(symbol: string) {
		return fetch('https://serum-api.bonfida.com/pairs')
			.then((res) => res.json())
			.then((res) => {
				//remove pools and dashes
				const removedDashes = res.data.filter(
					(str: string) => str.indexOf('-') === -1,
				);
				const removedToken = removedDashes.filter(
					(str: string) => str.indexOf('LIQD') === -1,
				);
				const removedPools = removedToken.filter(
					(str: string) => str.indexOf('POOL') === -1,
				);

				//clean this up to take the inputted token
				const finishedArray = [];

				//find matching pairs
				const pairs = removedPools.filter(
					(str: string) => str.indexOf(symbol) >= 0,
				);
				const pairsArray = [];
				for (let i = 0; i < pairs.length; i++) {
					const el2 = pairs[i];

					//take away the name and slash
					const removeSymbol = el2.replace(symbol, '');
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

				return pairsArray;
			})
			.catch((err) => console.log(err));
	}

	function getTokenPairs() {
		//get a clean list of all symbols in bonfida (remove all the perps ones), dedupe them, then grab their symbols, then grab their pairs, then list if it's buy side or sell side for each one

		//then make two big calls to coinmarketcap - one for data, the other for price
		//then combine all of those results based on symbol name 🎉
		return fetch('https://serum-api.bonfida.com/pairs')
			.then((res) => res.json())
			.then((res) => {
				//remove pools and dashes
				const removedDashes = res.data.filter(
					(str: string) => str.indexOf('-') === -1,
				);
				const removedToken = removedDashes.filter(
					(str: string) => str.indexOf('LQID') === -1,
				);
				const removedToken2 = removedToken.filter(
					(str: string) => str.indexOf('ODOP') === -1,
				);
				const removedToken3 = removedToken2.filter(
					(str: string) => str.indexOf('xCOPE') === -1,
				);
				const removedToken4 = removedToken3.filter(
					(str: string) => str.indexOf('CCAI') === -1,
				);
				const removedToken5 = removedToken4.filter(
					(str: string) => str.indexOf('PLEB') === -1,
				);
				const removedToken6 = removedToken5.filter(
					(str: string) => str.indexOf('BVOL') === -1,
				);
				const removedPools = removedToken6.filter(
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
				return finishedArray;
			})
			.catch((err) => console.log(err));
	}

	function getCleanTokenList() {
		return fetch('https://serum-api.bonfida.com/pairs')
			.then((res) => res.json())
			.then((res) => {
				//remove pools and dashes
				const removedDashes = res.data.filter(
					(str: string) => str.indexOf('-') === -1,
				);
				const removedToken = removedDashes.filter(
					(str: string) => str.indexOf('LQID') === -1,
				);
				const removedToken2 = removedToken.filter(
					(str: string) => str.indexOf('ODOP') === -1,
				);
				const removedToken3 = removedToken2.filter(
					(str: string) => str.indexOf('xCOPE') === -1,
				);
				const removedToken4 = removedToken3.filter(
					(str: string) => str.indexOf('CCAI') === -1,
				);
				const removedToken5 = removedToken4.filter(
					(str: string) => str.indexOf('PLEB') === -1,
				);
				const removedToken6 = removedToken5.filter(
					(str: string) => str.indexOf('FIDID') === -1,
				);
				const removedPools = removedToken6.filter(
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
				return cleanArray;
			})
			.catch((err) => console.log(err));
	}

	useEffect(() => {
		getAllTokens();
		// getCleanTokenList();
		// getAddress();
	}, []);

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

			setModalVisible(false);
		}
	}, [tokens]);

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
		const totals = tokens?.map((item) => {
			return item.amount * item.price;
		});

		todayTotal = totals.reduce((prev, current) => prev + current);

		const yesterdayTotals = tokens?.map((item) => {
			const change = item.percent_change_24h * 0.01;
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
				<ScrollView>
					<Modal
						isVisible={modalVisible}
						backdropColor={theme.colors.black_two}
						backdropOpacity={0.35}
						// onBackdropPress={() => setModalVisible(false)}
					>
						<View
							// onPress={() => {
							// 	setModalVisible(false);
							// 	navigation.navigate('Trade Success', token);
							// }}
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
								style={{
									width: 110,
									height: 114,
									marginBottom: 2,
								}}
							/>
							<Text style={styles.loaderLabel}>Loading...</Text>
						</View>
					</Modal>
				</ScrollView>
			</Background>
		);
	}

	return (
		<Background>
			<ScrollView showsVerticalScrollIndicator={false}>
				<SubPageHeader backButton={false}>Dashboard</SubPageHeader>
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
							{`$${addCommas.format(todayTotal.toFixed(2))}`}
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

const styles = StyleSheet.create({
	loaderLabel: {
		fontFamily: 'AzeretMono_SemiBold',
		color: 'white',
		fontSize: 12,
	},
});

export default memo(DashboardScreen2);
