import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import * as React from 'react';

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

const Tab = createMaterialBottomTabNavigator();

console.log('tabs', Tab);

const Stack = createNativeStackNavigator();

function Dashboard() {
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

function RootNavigator2() {
	return (
		<Tab.Navigator>
			<Tab.Screen name="Dashboard" component={Dashboard} />
			<Tab.Screen name="Browse" component={Browse} />
			<Tab.Screen name="Walet" component={Wallets} />
		</Tab.Navigator>
	);
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
