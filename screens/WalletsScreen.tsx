import React, {
	memo,
	useState,
	useMemo,
	useRef,
	useCallback,
	useEffect,
} from 'react';
import { Text, TouchableOpacity, StyleSheet, DevSettings } from 'react-native';
import { Background, Button } from '../components';
import { Navigation } from '../types';
import { View, FlatList, Image } from 'react-native';
import { SubPageHeader } from '../components';
import { theme } from '../core/theme';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';
// import {
// 	BottomSheetModal,
// 	BottomSheetModalProvider,
// } from '@gorhom/bottom-sheet';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

type Props = {
	navigation: Navigation;
};

const WalletsScreen = ({ navigation }: Props) => {
	const passcode = useStoreState((state) => state.passcode);

	// bottomsheet stuff
	// const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	// const snapPoints = useMemo(() => ['25%', '50%'], []);
	// const handlePresentModalPress = useCallback(() => {
	// 	bottomSheetModalRef.current?.present();
	// }, []);
	// const handleSheetChanges = useCallback((index: number) => {
	// 	console.log('handleSheetChanges', index);
	// }, []);

	return (
		<Background>
			<View>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<SubPageHeader backButton={false}>Wallets</SubPageHeader>
					<TouchableOpacity
						onPress={async () => {
							const passcodeKey = passcode + 'key';
							await SecureStore.deleteItemAsync(passcodeKey);
							await SecureStore.deleteItemAsync(passcode);
							await AsyncStorage.removeItem('hasAccount');
							DevSettings.reload();
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
					style={{
						borderColor: theme.colors.border,
						borderWidth: 1,
						borderRadius: 18,
						flexDirection: 'row',
						padding: 16,
						alignItems: 'center',
						marginBottom: 8,
					}}
				>
					<Image
						source={require('../assets/icons/green_plus.png')}
						style={{ width: 40, height: 40, marginRight: 16 }}
					/>

					<Text style={styles.cardTitle}>Add / Connect Wallet</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						borderColor: theme.colors.border,
						borderWidth: 1,
						borderRadius: 18,
						flexDirection: 'row',
						padding: 16,
						alignItems: 'center',
						marginBottom: 8,
					}}
				>
					<Image
						source={require('../assets/icons/wallet_gray.png')}
						style={{ width: 40, height: 40, marginRight: 16 }}
					/>
					<View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 4,
							}}
						>
							<Text style={styles.cardTitle}>Wallet 1</Text>
							<View
								style={{
									...styles.activeContainer,
									marginLeft: 4,
								}}
							>
								<Text style={styles.active}>Active Wallet</Text>
							</View>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Text style={styles.subTitle}>400.02</Text>
							<Text style={styles.address}>• FEVc...uWhU</Text>
						</View>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						borderColor: theme.colors.border,
						borderWidth: 1,
						borderRadius: 18,
						flexDirection: 'row',
						padding: 16,
						alignItems: 'center',
						marginBottom: 8,
					}}
				>
					<Image
						source={require('../assets/icons/wallet_gray.png')}
						style={{ width: 40, height: 40, marginRight: 16 }}
					/>
					<View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 4,
							}}
						>
							<Text style={styles.cardTitle}>Wallet 2</Text>
							{/* <View
								style={{
									...styles.activeContainer,
									marginLeft: 4,
								}}
							>
								<Text style={styles.active}>Active Wallet</Text>
							</View> */}
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Text style={styles.subTitle}>15.95</Text>
							<Text style={styles.address}>• BxMF...pAGn</Text>
						</View>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						borderColor: theme.colors.border,
						borderWidth: 1,
						borderRadius: 18,
						flexDirection: 'row',
						padding: 16,
						alignItems: 'center',
					}}
				>
					<Image
						source={require('../assets/icons/wallet_gray.png')}
						style={{ width: 40, height: 40, marginRight: 16 }}
					/>
					<View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginBottom: 4,
							}}
						>
							<Text style={styles.cardTitle}>Wallet 3</Text>
							{/* <View
								style={{
									...styles.activeContainer,
									marginLeft: 4,
								}}
							>
								<Text style={styles.active}>Active Wallet</Text>
							</View> */}
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}
						>
							<Text style={styles.subTitle}>$143.67</Text>
							<Text style={styles.address}>• GfaY...5DLs</Text>
						</View>
					</View>
				</TouchableOpacity>
			</View>
			{/* <BottomSheetModalProvider>
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
								marginTop: 8,
							}}
						>
							<Text
								style={
									theme.fonts.Azeret_Mono.Header_M_SemiBold
								}
							>
								What is a Secret Phrase?
							</Text>
						</View>
						<Text
							style={{
								...theme.fonts.Nunito_Sans.Body_M_SemiBold,
								marginBottom: 16,
							}}
						>
							The secret phrase is like a password, but generated
							programmatically and more secure.
						</Text>
						<Text
							style={{
								...theme.fonts.Nunito_Sans.Body_M_SemiBold,
								marginBottom: 16,
							}}
						>
							You should have received it from where you generated
							your wallet and it should be 12-20 words long.
						</Text>
						<Text
							style={{
								...theme.fonts.Nunito_Sans.Body_M_SemiBold,
								marginBottom: 16,
							}}
						>
							Be sure to enter it in the exact word order you
							received it with a space between each word.
						</Text>
						<Button
							onPress={() =>
								bottomSheetModalRef.current?.dismiss()
							}
						>
							{' '}
							I Understand
						</Button>
					</View>
				</BottomSheetModal>
			</BottomSheetModalProvider> */}
		</Background>
	);
};

const styles = StyleSheet.create({
	cardTitle: {
		...theme.fonts.Nunito_Sans.Body_M_Bold,
		color: theme.colors.black_one,
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
});

export default memo(WalletsScreen);
