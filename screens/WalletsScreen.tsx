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
	View,
	Image,
} from 'react-native';
import { Background, SubPageHeader, Button, RedButton } from '../components';
import { Navigation } from '../types';
import { theme } from '../core/theme';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';
import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { getAccountFromSeed, DERIVATION_PATH } from '../utils';
import { Account, Connection, PublicKey, Keypair } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

type Props = {
	navigation: Navigation;
};

const WalletsScreen = ({ navigation }: Props) => {
	const passcode = useStoreState((state) => state.passcode);
	const selectedWallet = useStoreState((state) => state.selectedWallet);
	const subWallets = useStoreState((state) => state.subWallets);
	const setSelectedWallet = useStoreActions(
		(actions) => actions.setSelectedWallet,
	);
	const [localSelectedWallet, setLocalSelectedWallet] =
		useState(selectedWallet);
	console.log('subWallets: ', subWallets);
	console.log('selectedWallet: ', selectedWallet);

	async function getSubWallets() {
		const url =
			'https://solana--mainnet.datahub.figment.io/apikey/5d2d7ea54a347197ccc56fd24ecc2ac5';
		const connection = new Connection(url);
		let mnemonic = await SecureStore.getItemAsync(passcode);
		const bip39 = await import('bip39');

		const seed = await bip39.mnemonicToSeed(mnemonic); //returns 64 byte array

		let count;
		const subWallets1 = [];
		for (let i = 0; i < 100; i++) {
			const newAccount = getAccountFromSeed(
				seed,
				i,
				DERIVATION_PATH.bip44Change,
			);

			const { publicKey } = newAccount;
			console.log('publicKey: ', publicKey.toString('hex'));

			const programId = new PublicKey(
				'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
			);
			const ownedTokens = await connection
				.getTokenAccountsByOwner(publicKey, { programId })
				.catch((err) => console.log('errorr', err));
			const result2 = await connection.getParsedAccountInfo(publicKey);
			//console.log('ownedTokens: ', ownedTokens);
			//console.log('result2: ', result2);

			if (!result2.value) {
				count = i + 1;
				i = 100;
			} else {
				subWallets1.push({
					publicKey: publicKey.toString('hex'),
				});
			}
		}

		setSubWallets(subWallets1);
	}

	function shortenPublicKey(publicKey: string) {
		return publicKey.slice(0, 4) + '...' + publicKey.slice(-4);
	}

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => [0, '48%'], []);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleSheetChanges = useCallback((index: number) => {
		//console.log('handleSheetChanges', index);
	}, []);

	if (subWallets.length === 0) {
		return <Text>Loading...</Text>;
	}

	return (
		<Background>
			{console.log('subWallets TESTING: ', subWallets)}
			<View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<SubPageHeader backButton>Wallets</SubPageHeader>
					<TouchableOpacity
						onPress={async () => {
							// const passcodeKey = passcode + 'key';
							// await SecureStore.deleteItemAsync(passcodeKey);
							// await SecureStore.deleteItemAsync(passcode);
							// await AsyncStorage.removeItem('hasAccount');
							// DevSettings.reload();
							bottomSheetModalRef.current?.present();
						}}
						style={{
							borderWidth: 1,
							borderColor: theme.colors.border,
							borderRadius: 18,
							padding: 8,
							height: 40,
						}}
					>
						<Image
							source={require('../assets/icons/logout.png')}
							style={{ width: 24, height: 24 }}
						/>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					onPress={() => navigation.navigate('Onboarding')}
					style={styles.pressableContainer}
				>
					<Image
						source={require('../assets/icons/green_plus.png')}
						style={styles.icons}
					/>

					<Text style={styles.cardTitle}>Add Subwallet</Text>
				</TouchableOpacity>

				{subWallets.map((subWallet, index) => {
					return (
						<TouchableOpacity
							key={index}
							style={styles.pressableContainer}
							onPress={() => {
								navigation.navigate('Wallet Details', {
									shortKey: shortenPublicKey(
										subWallet.publicKey,
									),
									longKey: subWallet.publicKey,
								});
								console.log('hit');
								setLocalSelectedWallet(index);
								setSelectedWallet(index);
							}}
						>
							<Image
								source={require('../assets/icons/wallet_gray.png')}
								style={styles.icons}
							/>
							<View>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginBottom: 4,
									}}
								>
									<Text style={styles.cardTitle}>
										Subwallet {index + 1}
									</Text>
									{localSelectedWallet === index && (
										<View
											style={{
												...styles.activeContainer,
												marginLeft: 4,
											}}
										>
											<Text style={styles.active}>
												Active Wallet
											</Text>
										</View>
									)}
								</View>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									{/* <Text style={styles.subTitle}>400.02</Text> */}
									<Text style={styles.address}>
										{shortenPublicKey(subWallet.publicKey)}
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					);
				})}
			</View>
			<BottomSheetModal
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
							Logout of Main Wallet
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
						Please ensure that you have access to your secret phrase
						before logging out.
					</Text>
					<Text
						style={{
							...theme.fonts.Nunito_Sans.Body_M_SemiBold,
							marginBottom: 24,
						}}
					>
						Radiant does not store it and has no ability to access
						it for you.
					</Text>
					<View style={styles.removeWalletButton}>
						<RedButton
							mode="contained"
							onPress={async () => {
								const passcodeKey = passcode + 'key';
								await SecureStore.deleteItemAsync(passcodeKey);
								await SecureStore.deleteItemAsync(passcode);
								await AsyncStorage.removeItem('hasAccount');
								DevSettings.reload();
								bottomSheetModalRef.current?.dismiss();
							}}
						>
							Yes, Logout of Wallet
						</RedButton>
					</View>
					<View style={styles.setAsActiveButton}>
						<Button
							onPress={() =>
								bottomSheetModalRef.current?.dismiss()
							}
						>
							No, Stay Logged In
						</Button>
					</View>
				</View>
			</BottomSheetModal>
		</Background>
	);
};

const styles = StyleSheet.create({
	cardTitle: {
		...theme.fonts.Nunito_Sans.Body_M_Bold,
		color: theme.colors.black_one,
	},
	icons: {
		width: 40,
		height: 40,
		marginRight: 16,
	},
	active: {
		...theme.fonts.Nunito_Sans.Caption_S_SemiBold,
	},
	activeContainer: {
		backgroundColor: theme.colors.success_three,
		borderRadius: 6,
		paddingHorizontal: 8,
		paddingVertical: 3,
	},
	subTitle: {
		...theme.fonts.Nunito_Sans.Body_M_SemiBold,
		color: theme.colors.black_one,
	},
	address: {
		...theme.fonts.Nunito_Sans.Caption_M_SemiBold,
		color: theme.colors.black_five,
		marginLeft: 4,
	},
	container: {
		flex: 1,
		width: '100%',
		flexDirection: 'row',
		alignContent: 'space-between',
		paddingHorizontal: 40,
	},
	row: {
		flex: 1,
	},
	pressableContainer: {
		borderColor: theme.colors.border,
		borderWidth: 1,
		borderRadius: 18,
		flexDirection: 'row',
		padding: 16,
		alignItems: 'center',
		marginBottom: 8,
	},
	iconsLeft: {
		width: 40,
		height: 40,
		marginRight: 16,
	},
	removeWalletButton: {
		marginBottom: 16,
	},
	setAsActiveButton: {
		marginBottom: 24,
	},
});

export default memo(WalletsScreen);
