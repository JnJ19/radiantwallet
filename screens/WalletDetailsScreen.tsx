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
	const [subWallets, setSubWallets] = useState([]);
	const selectedWallet = useStoreState((state) => state.selectedWallet);
	const setSelectedWallet = useStoreActions(
		(actions) => actions.setSelectedWallet,
	);
	const [localSelectedWallet, setLocalSelectedWallet] =
		useState(selectedWallet);
	const [copiedKey, setCopiedKey] = useState('');
	console.log('subWallets: ', subWallets);
	console.log('selectedWallet: ', selectedWallet);

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

	// 		const { publicKey } = newAccount;
	// 		console.log('publicKey: ', publicKey.toString('hex'));

	// 		const programId = new PublicKey(
	// 			'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
	// 		);
	// 		const ownedTokens = await connection
	// 			.getTokenAccountsByOwner(publicKey, { programId })
	// 			.catch((err) => console.log('errorr', err));
	// 		const result2 = await connection.getParsedAccountInfo(publicKey);
	// 		console.log('ownedTokens: ', ownedTokens);
	// 		console.log('result2: ', result2);

	// 		if (!result2.value) {
	// 			count = i + 1;
	// 			i = 100;
	// 		} else {
	// 			subWallets1.push({
	// 				publicKey: publicKey.toString('hex'),
	// 			});
	// 		}
	// 	}

	// 	setSubWallets(subWallets1);
	// }

	let publicKeyVariable;

	function shortenPublicKey(publicKey: string) {
		return publicKey.slice(0, 4) + '...' + publicKey.slice(-4);
	}

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => [0, '40%'], []);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

	// useEffect(() => {
	// 	getSubWallets();
	// }, []);

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
					<Text style={styles.WalletBalance}>$5,000.00</Text>
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
