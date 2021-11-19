import React, {
	memo,
	useState,
	useMemo,
	useRef,
	useCallback,
	useEffect,
} from 'react';
import {
	Text,
	TouchableOpacity,
	StyleSheet,
	DevSettings,
	Alert,
} from 'react-native';
import { Background, Button, SubPageHeader, RedButton } from '../components';
import { Navigation } from '../types';
import { View, FlatList, Image } from 'react-native';
import { theme } from '../core/theme';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
	findAssociatedTokenAddress,
	getAccountFromSeed,
	DERIVATION_PATH,
	normalizeNumber,
} from '../utils';
import { Account, Connection, PublicKey, Keypair } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as Clipboard from 'expo-clipboard'; //might have to change to '@react-native-community/clipboard' when not using expo but will not work on Android with expo.

type Props = {
	navigation: Navigation;
	route: Object;
};

const WalletDetailsScreen = ({ navigation, route }: Props) => {
	const walletKey = route.params;
	console.log('walletKey: ', walletKey);
    const passcode = useStoreState((state) => state.passcode);
    const [account, setAccount] = useState('');
	const [connection, setConnection] = useState('');
    const [tokens, setTokens] = useState('');
    const [loading, setLoading] = useState(true);
    const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
	const [tokenMapSymbols, setTokenMapSymbols] = useState<
		Map<string, TokenInfo>
	>(new Map());
	const [subWallets, setSubWallets] = useState([]);
	const selectedWallet = useStoreState((state) => state.selectedWallet);
	const setSelectedWallet = useStoreActions(
		(actions) => actions.setSelectedWallet,
	);
	const [localSelectedWallet, setLocalSelectedWallet] =
		useState(selectedWallet);
    const [copiedKey, setCopiedKey] = useState(walletKey.longKey);
    const ownedTokens = useStoreState((state) => state.ownedTokens);
	const setOwnedTokens = useStoreActions((actions) => actions.setOwnedTokens);
    const totalBalance = useStoreState((state) => state.totalBalance);
	const setTotalBalance =useStoreActions((actions) => actions.setTotalBalance);


	//console.log('subWallets: ', subWallets);
	//console.log('selectedWallet: ', selectedWallet);

	const copyToClipboard = async () => {
		Clipboard.setString(copiedKey);
		Alert.alert('Address Copied!', copiedKey, [
			{ text: 'Okay', style: 'destructive' },
		]);
	};

	// async function getSubWallets() {
	// 	const url = 'https://solana-api.projectserum.com';
	// 	const connection = new Connection(url);
	// 	let mnemonic = await SecureStore.getItemAsync(passcode);
	// 	const bip39 = await import('bip39');

	// 	const seed = await bip39.mnemonicToSeed(mnemonic); //returns 64 byte array

	// 	let count;
	// 	const subWallets1 = [];
	// 	for (let i = 0; i < 100; i++) {
	// 		const newAccount = getAccountFromSeed(
	// 			seed,
	// 			i,
	// 			DERIVATION_PATH.bip44Change,
	// 		);

			const { publicKey } = newAccount;
			//console.log('publicKey: ', publicKey.toString('hex'));

			const programId = new PublicKey(
				'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
			);
			const ownedTokens = await connection
				.getTokenAccountsByOwner(publicKey, { programId })
				.catch((err) => console.log('errorr', err));
			const result2 = await connection.getParsedAccountInfo(publicKey);
			//console.log('ownedTokens: ', ownedTokens);
			//console.log('result2: ', result2);

	// 		if (!result2.value) {
	// 			count = i + 1;
	// 			i = 100;
	// 		} else {
	// 			subWallets1.push({
	// 				publicKey: publicKey.toString('hex'),
	// 			});
	// 		}
	// 	}

		setSubWallets(subWallets1);
    }

    function getTokenPairs() {
		//get a clean list of all symbols in bonfida (remove all the perps ones), dedupe them, then grab their symbols, then grab their pairs, then list if it's buy side or sell side for each one

		//then make two big calls to coinmarketcap - one for data, the other for price
		//then combine all of those results based on symbol name 🎉
		return fetch('https://serum-api.bonfida.com/pairs')
			.then((res) => res.json())
			.then((res) => {
				const removedPools = res.data.filter(
					(value) =>
						![
							'-',
							'LQID',
							'ODOP',
							'xCOPE',
							'CCAI',
							'PLEB',
							'BVOL',
							'POOL',
							'BTC/SRM',
							'FTT/SRM',
							'YFI/SRM',
							'SUSHI/SRM',
							'ETH/SRM',
							'RAY/SRM',
							'RAY/ETH',
							'MSRM',
						].some((el) => value.includes(el)),
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
    
    //gets owned tokens, adds sol to it, adds detail to all the coins, then sets to state
	async function getOwnedTokens() {
		// const url = 'https://api.mainnet-beta.solana.com';
		// const url = 'https://solana-api.projectserum.com';
		const url =
			'https://solana--mainnet.datahub.figment.io/apikey/5d2d7ea54a347197ccc56fd24ecc2ac5';
		const connection = new Connection(url);

		let mnemonic = await SecureStore.getItemAsync(passcode);
		const bip39 = await import('bip39');
		const seed = await bip39.mnemonicToSeed(mnemonic); //returns 64 byte array
		const newAccount = getAccountFromSeed(
			seed,
			selectedWallet,
			DERIVATION_PATH.bip44Change,
		);

		setAccount(newAccount);

		const { publicKey } = newAccount;

		const programId = new PublicKey(
			'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
		);
		const ownedTokens = await connection
			.getTokenAccountsByOwner(publicKey, { programId })
			.catch((err) => console.log('errorr', err));

		let tokens2 = [];
		const tokenPairs = await getTokenPairs();
		const solPairs = tokenPairs.find(
			(pair: object) => (pair.symbol = 'SOL'),
		);
		
		const solBalance = await connection.getBalance(publicKey);
		const realSolBalance = solBalance * 0.000000001;
		const apiKey = 'f7353e06-2e44-4912-9fff-05929a5681a7';

        
		if (solBalance > 0) {
			// const priceData = await fetch(
			// 	`https://radiant-wallet-server.travissehansen.repl.co/api`,
			// 	{
			// 		method: 'POST',
			// 		body: JSON.stringify({
			// 			url: '/quotes/latest?symbol=sol',
			// 		}),
			// 		headers: { 'Content-type': 'application/json' },
			// 	},
			// )
			const priceData = await fetch(
				`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=SOL`,
				{
					headers: {
						'X-CMC_PRO_API_KEY': apiKey,
						Accept: 'application/json',
						'Accept-Encoding': 'deflate, gzip',
					},
				},
			)
				.then((response) => {
					//console.log('response for SOL call: ', response);

					return response.json();
				})
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
				extensions: {
					discord: 'https://discord.com/invite/pquxPsq',
					twitter: 'https://twitter.com/solana',
					website: 'https://solana.com/',
				},
				price,
				price_30d,
				price_60d,
				price_90d,
				pairs: solPairs.pairs,
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
					const { name, symbol, logoURI, extensions } = otherDetails;
					const logo = logoURI;

					let pairs = tokenPairs.find(
						(pair: object) => pair.symbol === symbol,
					);

					if (!pairs) {
						pairs = { pairs: false };
					}

					const mintKey = new PublicKey(mint);

					const associatedTokenAddress =
						await findAssociatedTokenAddress(publicKey, mintKey);

					const associatedTokenAddressHash =
						associatedTokenAddress.toString('hex');

					// const aboutData = await fetch(
					// 	`https://radiant-wallet-server.travissehansen.repl.co/api`,
					// 	{
					// 		method: 'POST',
					// 		body: JSON.stringify({
					// 			url: `/info?symbol=${symbol}`,
					// 		}),
					// 		headers: { 'Content-type': 'application/json' },
					// 	},
					// )
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
						.then((response) => {
							return response.json();
						})

						.then((res) => {
							if (res.status.error_code !== 0) {
								return {
									description:
										'No description available for this project.',
									logo: 'https://radiantwallet.s3.us-east-2.amazonaws.com/Random_Token.png',
									name: symbol,
									extensions: {},
								};
							} else {
								const dataArray = Object.values(res.data);
								const logo = dataArray[0].logo
									? dataArray[0].logo
									: 'https://radiantwallet.s3.us-east-2.amazonaws.com/Random_Token.png';
								if (dataArray[0]) {
									return {
										description: dataArray[0]?.description,
										logo,
										name: dataArray[0]?.name,
										extensions: {
											website:
												dataArray[0]?.urls.website[0],
											twitter:
												dataArray[0]?.urls.twitter[0],
											discord:
												dataArray[0]?.urls.discord[0],
										},
									};
								} else {
									return {
										description:
											'No description available for this project.',
										logo: 'https://radiantwallet.s3.us-east-2.amazonaws.com/Random_Token.png',
										name: symbol,
										extensions: {},
									};
								}
							}
						})
						.catch((err) => console.log('info error', err));

					// const priceData = await fetch(
					// 	`https://radiant-wallet-server.travissehansen.repl.co/api`,
					// 	{
					// 		method: 'POST',
					// 		body: JSON.stringify({
					// 			url: `/quotes/latest?symbol=${symbol}`,
					// 		}),
					// 		headers: { 'Content-type': 'application/json' },
					// 	},
					// )
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
						.then((res) => {
							if (res.status.error_code !== 0) {
								return {
									price: 0,
									percent_change_24h: 0,
									percent_change_30d: 0,
									percent_change_60d: 0,
									percent_change_90d: 0,
									volume_24h: 0,
									market_cap: 0,
									market_cap_dominance: 0,
								};
							} else {
								const dataArray = Object.values(res.data);
								if (dataArray[0]) {
									const percent_change_24h =
										dataArray[0].quote.USD
											.percent_change_24h;
									const percent_change_30d =
										dataArray[0].quote.USD
											.percent_change_30d;
									const percent_change_60d =
										dataArray[0].quote.USD
											.percent_change_60d;
									const percent_change_90d =
										dataArray[0].quote.USD
											.percent_change_90d;
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
								} else {
									console.log('data array issues');

									return {
										price: 0,
										percent_change_24h: 0,
										percent_change_30d: 0,
										percent_change_60d: 0,
										percent_change_90d: 0,
										volume_24h: 0,
										market_cap: 0,
										market_cap_dominance: 0,
									};
								}
							}
						})
						.catch((error) => console.log('quotes error', error));
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
						pairs: pairs.pairs,
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
		setTokens(tokens2);
		setOwnedTokens(tokens2);
        setLoading(false);                
	}


	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => [0, '40%'], []);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleSheetChanges = useCallback((index: number) => {
		//console.log('handleSheetChanges', index);
	}, []);

	useEffect(() => {
        getSubWallets();
        getOwnedTokens();
    }, []);
    
    useEffect(() => {
		if (ownedTokens) {
			let balanceArray = [];
			ownedTokens.forEach((token) => {
				balanceArray.push(token.price * token.amount);
			});
			let sumTotal = 0;
			for (let i = 0; i < balanceArray.length; i++) {
				sumTotal += balanceArray[i];
			};
			let formattedSumTotal = normalizeNumber(sumTotal);
			setTotalBalance(formattedSumTotal);
		};
	}, [ownedTokens]);

	// if (subWallets.length === 0) {
	// 	return <Text>Loading...</Text>;
	// }

	let modal;
	if (modal) {
		<View style={{ backgroundColor: 'black' }}></View>;
	}

	return (
		<Background>
			<View>
				<View style={styles.screenTitle}>
					<SubPageHeader backButton>Wallet 1</SubPageHeader>
				</View>
				<View style={styles.balanceContainer}>
					<Text style={styles.totalBalanceTitle}>Total Balance</Text>
					<Text style={styles.WalletBalance}>${totalBalance}</Text>
				</View>
				<TouchableOpacity
					style={styles.pressableContainer}
					onPress={() => {
						navigation.navigate('Edit Wallet Name');
					}}
				>
					<View
						style={{ flexDirection: 'row', alignItems: 'center' }}
					>
						<Image
							source={require('../assets/icons/Info.png')}
							style={styles.iconsLeft}
						/>
						<View>
							<View style={styles.cardTitleContainer}>
								<Text style={styles.cardTitle}>
									Wallet Name
								</Text>
							</View>
							<View style={styles.cardSubTitleContainer}>
								<Text style={styles.cardSubTitle}>
									Wallet 1
								</Text>
							</View>
						</View>
					</View>
					<Image
						source={require('../assets/icons/Chevron_Left.png')}
						style={styles.iconRightArrow}
					/>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.pressableContainer}
					onPress={() => {
						copyToClipboard();
						setCopiedKey(walletKey.longKey);
						//setLocalSelectedWallet(index);
						//setSelectedWallet(index);
					}}
				>
					<View style={styles.cardSubTitleContainer}>
						<Image
							source={require('../assets/icons/Keys.png')}
							style={styles.iconsLeft}
						/>
						<View>
							<View style={styles.cardTitleContainer}>
								<Text style={styles.cardTitle}>
									Wallet Address
								</Text>
							</View>
							<View style={styles.cardSubTitleContainer}>
								<Text style={styles.cardSubTitle}>
									{walletKey.shortKey}
								</Text>
							</View>
						</View>
					</View>
					<Image
						source={require('../assets/icons/Copy.png')}
						style={styles.iconRightCopy}
					/>
				</TouchableOpacity>
			</View>
			<View>
				<View style={styles.removeWalletButton}>
					<RedButton
						mode="outlined"
						onPress={() => bottomSheetModalRef.current?.present()}
					>
						Remove Wallet
					</RedButton>
				</View>
				<View style={styles.setAsActiveButton}>
					<Button mode="contained">Set as Active</Button>
				</View>
			</View>

			<BottomSheetModal
				handleStyle
				ref={bottomSheetModalRef}
				index={1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
				style={{
					// margin: 16,
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 6,
					},
					shadowOpacity: 0.37,
					shadowRadius: 7.49,
					elevation: 12,
				}}
			>
				<View
					style={{
						justifyContent: 'space-between',
						margin: 16,
					}}
				>
					<View
						style={{
							marginBottom: 24,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Text style={theme.fonts.Azeret_Mono.Header_M_SemiBold}>
							Remove Wallet?
						</Text>
						<TouchableOpacity
							onPress={() =>
								bottomSheetModalRef.current?.dismiss()
							}
						>
							<Image
								source={require('../assets/icons/Close.png')}
								style={styles.iconsLeft}
							/>
						</TouchableOpacity>
					</View>
					<Text
						style={{
							...theme.fonts.Nunito_Sans.Body_M_SemiBold,
							marginBottom: 24,
						}}
					>
						You can always re-import this wallet to Radiant in the
						future.
					</Text>
					<View style={styles.removeWalletButton}>
						<RedButton
							mode="contained"
							onPress={() =>
								bottomSheetModalRef.current?.dismiss()
							}
						>
							Yes, Remove Wallet
						</RedButton>
					</View>
					<View style={styles.setAsActiveButton}>
						<Button
							onPress={() =>
								bottomSheetModalRef.current?.dismiss()
							}
						>
							No, Keep Wallet
						</Button>
					</View>
				</View>
			</BottomSheetModal>
		</Background>
	);
};

const styles = StyleSheet.create({
	screenTitle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	balanceContainer: {
		borderWidth: 1,
		borderColor: theme.colors.black_one,
		borderRadius: 18,
		marginBottom: 24,
		padding: 16,
	},
	totalBalanceTitle: {
		...theme.fonts.Azeret_Mono.Body_M_SemiBold,
		alignItems: 'center',
	},
	WalletBalance: {
		...theme.fonts.Nunito_Sans.Body_L_SemiBold,
		paddingVertical: 16,
	},
	pressableContainer: {
		borderColor: theme.colors.border,
		borderWidth: 1,
		borderRadius: 18,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 18,
		alignItems: 'center',
		marginBottom: 8,
	},
	cardTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	cardTitle: {
		...theme.fonts.Nunito_Sans.Body_M_Bold,
		color: theme.colors.black_one,
		justifyContent: 'flex-start',
	},
	iconsLeft: {
		width: 40,
		height: 40,
		marginRight: 16,
	},
	iconRightArrow: {
		width: 24,
		height: 24,
	},
	iconRightCopy: {
		width: 63,
		height: 30,
	},
	cardSubTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	cardSubTitle: {
		...theme.fonts.Nunito_Sans.Caption_M_SemiBold,
		color: theme.colors.black_five,
		marginLeft: 4,
	},
	removeWalletButton: {
		marginBottom: 16,
	},
	setAsActiveButton: {
		marginBottom: 24,
	},
});

export default memo(WalletDetailsScreen);
