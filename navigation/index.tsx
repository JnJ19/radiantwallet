import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Image, View, Text } from 'react-native';
import { useState, useEffect } from 'react';

import { useStoreState, useStoreActions } from '../hooks/storeHooks';

import {
	OnboardingScreen,
	SetPinScreen,
	DashboardScreen,
	ReceiveScreen,
	SendScreen,
	SettingsScreen,
	BackupScreen,
	QRScannerScreen,
	ImportWalletScreen,
	DashboardScreen2,
	TokenDetailsScreen,
	TestScreen,
	SearchTokensScreen,
	IntroScreen,
	TradeScreen,
	TradePreviewScreen,
	TradeSuccessScreen,
	SetPasscodeScreen,
	PasscodeScreen,
	WalletsScreen,
} from '../screens';
import { theme } from '../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function Dashboard() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Dashboard"
				component={DashboardScreen2}
				options={{ headerShown: false }}
			/>
			{/* <Stack.Screen
				name="Token Details"
				component={TokenDetailsScreen}
				options={{ headerShown: false }}
			/> */}
		</Stack.Navigator>
	);
}

function Browse() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Search Tokens"
				component={SearchTokensScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Token Details"
				component={TokenDetailsScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

function Wallets() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Wallets"
				component={WalletsScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

function OnboardingFlow() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Intro"
				component={IntroScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Onboarding"
				component={OnboardingScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Import Wallet"
				component={ImportWalletScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

function Main() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarStyle: {
					height: 87,
					borderTopColor: '#D8DCE0',
					borderTopWidth: 1,
				},
				headerShown: false,
				tabBarLabelStyle: {
					...theme.fonts.Nunito_Sans.Caption_S_Regular,
				},
				tabBarActiveTintColor: theme.colors.black_one,
				tabBarLabel: ({ focused }) => {
					if (focused) {
						return (
							<View style={{ alignItems: 'center' }}>
								<Text
									style={{
										...theme.fonts.Nunito_Sans
											.Caption_S_Bold,
									}}
								>
									{route.name}
								</Text>
							</View>
						);
					}
					return (
						<View style={{ alignItems: 'center' }}>
							<Text
								style={{
									...theme.fonts.Nunito_Sans
										.Caption_S_Regular,
								}}
							>
								{route.name}
							</Text>
						</View>
					);
				},
			})}
		>
			<Tab.Screen
				name="Dashboard"
				component={Dashboard}
				options={{
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Image
								source={require('../assets/icons/Dashboard_Active.png')}
								style={{ width: 24, height: 24 }}
							/>
						) : (
							<Image
								source={require('../assets/icons/Dashboard.jpg')}
								style={{ width: 24, height: 24 }}
							/>
						),
				}}
			/>
			<Tab.Screen
				name="Browse"
				component={Browse}
				options={{
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Image
								source={require('../assets/icons/Search_Active.jpg')}
								style={{ width: 24, height: 24 }}
							/>
						) : (
							<Image
								source={require('../assets/icons/Search.jpg')}
								style={{ width: 24, height: 24 }}
							/>
						),
				}}
			/>
			<Tab.Screen
				name="Wallet"
				component={Wallets}
				options={{
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Image
								source={require('../assets/icons/wallet_active.jpg')}
								style={{ width: 24, height: 24 }}
							/>
						) : (
							<Image
								source={require('../assets/icons/wallet.jpg')}
								style={{ width: 24, height: 24 }}
							/>
						),
				}}
			/>
		</Tab.Navigator>
	);
}

function RootNavigator2() {
	const [hasWallet, setHasWallet] = useState(true);
	if (!hasWallet) {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="Intro"
					component={IntroScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Onboarding"
					component={OnboardingScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Import Wallet"
					component={ImportWalletScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Main"
					component={Main}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		);
	}
	return <Main />;
}

function RootNavigator() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Intro"
				component={IntroScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Onboarding"
				component={OnboardingScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Test Screen"
				component={TestScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Set Pin"
				component={SetPinScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Import Wallet"
				component={ImportWalletScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Token Details"
				component={TokenDetailsScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Search Tokens"
				component={SearchTokensScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Dashboard"
				component={DashboardScreen2}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

function RootNavigator3() {
	const [hasAccount, setHasAccount] = useState(false);

	async function checkForAccount() {
		const accountStatus = await AsyncStorage.getItem('hasAccount');
		if (accountStatus) {
			setHasAccount(accountStatus);
		}
		// return accountStatus;
	}

	useEffect(() => {
		checkForAccount();
	}, []);

	if (hasAccount === 'true') {
		return (
			<Stack.Navigator>
				<Stack.Screen
					name="Passcode"
					component={PasscodeScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Main"
					component={Main}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Token Details"
					component={TokenDetailsScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Trade"
					component={TradeScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Trade Preview"
					component={TradePreviewScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Trade Success"
					component={TradeSuccessScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Onboarding"
					component={OnboardingScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="Import Wallet"
					component={ImportWalletScreen}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		);
	}

	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Intro"
				component={IntroScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Set Passcode"
				component={SetPasscodeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Onboarding"
				component={OnboardingScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Import Wallet"
				component={ImportWalletScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Passcode"
				component={PasscodeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Main"
				component={Main}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Token Details"
				component={TokenDetailsScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Trade"
				component={TradeScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Trade Preview"
				component={TradePreviewScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="Trade Success"
				component={TradeSuccessScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

export default function Onboarding() {
	return (
		<NavigationContainer>
			<RootNavigator3 />
		</NavigationContainer>
	);
}
