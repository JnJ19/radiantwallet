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
import { getAccountFromSeed, DERIVATION_PATH, shortenPublicKey, getSubWalletsData, normalizeNumber, summarySubWallet } from '../utils';
import { Account, Connection, PublicKey, Keypair } from '@solana/web3.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

type Props = {
	navigation: Navigation;
};

const WalletsScreen = ({ navigation }: Props) => {
	const activeSubWallet = useStoreState((state) => state.activeSubWallet);
	const passcode = useStoreState((state) => state.passcode);
	const selectedWallet = useStoreState((state) => state.selectedWallet);
	const subWallets = useStoreState((state) => state.subWallets);
	const setSelectedWallet = useStoreActions(
		(actions) => actions.setSelectedWallet,
	);
	const [localSelectedWallet, setLocalSelectedWallet] =
		useState(selectedWallet);
	const subWalletTokensArray = useStoreState((state) => state.subWalletTokensArray);

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const snapPoints = useMemo(() => [0, '48%'], []);
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleSheetChanges = useCallback((index: number) => {
	}, []);
	
	summarySubWallet(subWalletTokensArray, subWallets); //doesn't cause 'subWallets' to change because the array isn't changed. The object inside the array changes but this won't trigger an effect in Dashboard. Refer to: https://stackoverflow.com/questions/35922429/why-does-a-js-map-on-an-array-modify-the-original-array

	useEffect(() => {
		//if (createNewWallet) {getSubWalletsData(passcode)};
		//getSubWalletsData(passcode);
		
		
	}, []);//createNewWallet

	if (subWallets.length === 0) {
		return <Text>Loading...</Text>;
	}

	return (
		<Background>
			<View>
				<View style={styles.screenTitle}>
					<SubPageHeader>Wallets</SubPageHeader>
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
					style={styles.pressableContainer}
					//onPress={() => navigation.navigate('Onboarding')}
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
								navigation.navigate('Wallet Details');
								setLocalSelectedWallet(index);
								setSelectedWallet(index);
							}}
						>
							<View
								style={{ flexDirection: 'row', alignItems: 'center' }}
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
											{subWallet.subWalletName}
										</Text>
										{activeSubWallet === index && (
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
										<View >
										</View>
									</View>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
										}}
									>
										{/* <Text style={styles.subTitle}>400.02</Text> */}
										<Text style={styles.address}>
											{shortenPublicKey(subWallet.publicKey, 0, 4, -4)}
										</Text>
									</View>
								</View>
							</View>
							<View
							> 
								<Text 
									style={{
										...theme.fonts.Nunito_Sans.Body_M_Bold,
										color: '#1F1F1F',
										marginBottom: 4,
									}}
								>
									${subWallet.totalBalance}
								</Text>
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
							onPress={() =>
								bottomSheetModalRef.current?.dismiss()
							}
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
	screenTitle: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
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
		justifyContent: 'space-between',
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
