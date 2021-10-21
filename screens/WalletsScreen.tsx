import React, { memo, useState, useEffect } from 'react';
import {
	SafeAreaView,
	Text,
	TouchableOpacity,
	StyleSheet,
	DevSettings,
} from 'react-native';
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
import TokenCard from '../components/TokenCard';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';

import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

type Props = {
	navigation: Navigation;
};

const WalletsScreen = ({ navigation }: Props) => {
	const [search, setSearch] = useState('');
	const [secret, setSecret] = useState('');
	const [logos, setLogos] = useState('');
	const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
	const [tokens, setTokens] = useState('');
	const allTokens = useStoreState((state) => state.allTokens);
	const passcode = useStoreState((state) => state.passcode);

	return (
		<Background>
			<View>
				<SubPageHeader backButton={false}>Wallets</SubPageHeader>
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
					onPress={async () => {
						const passcodeKey = passcode + 'key';
						await SecureStore.deleteItemAsync(passcodeKey);
						await SecureStore.deleteItemAsync(passcode);
						await AsyncStorage.removeItem('hasAccount');
						DevSettings.reload();
					}}
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
