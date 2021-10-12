import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Image, View, Text } from 'react-native';
import { useState } from 'react';

import { useStoreState } from '../hooks/storeHooks';

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
} from '../screens';
import { theme } from '../core/theme';

const Tab = createBottomTabNavigator();

console.log('tabs', Tab);

const Stack = createNativeStackNavigator();

function Dashboard() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="Dashboard"
				component={DashboardScreen2}
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
				name="Test Screen"
				component={TestScreen}
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

export default function Onboarding() {
	return (
		<NavigationContainer>
			<RootNavigator2 />
		</NavigationContainer>
	);
}
