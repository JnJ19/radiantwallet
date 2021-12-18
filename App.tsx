require('node-libs-expo/globals');
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'text-encoding';
import './global';
import fetch from 'cross-fetch';
global.fetch = fetch;
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StoreProvider } from 'easy-peasy';
import { LogBox, View, Text } from 'react-native';
import bs58 from 'bs58';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './core/theme';
import useCachedResources from './hooks/useCachedResources';
import store from './store';
import Navigation from './navigation';

import AppContext from './components/AppContext';
import * as Sentry from 'sentry-expo';
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core';
import { PublicKey, Connection, Keypair } from '@solana/web3.js';
console.log('fetch: ', fetch);
console.log('Jupiter: ', Jupiter);

async function jupTest() {
	const connection = new Connection('https://mercurial.rpcpool.com');
	const publicKey = new PublicKey(
		'GfaY1fZfTF9WRqtdXhno9FS8Wn71fbj8qZawnGak5DLs',
	);

	const WALLET_PRIVATE_KEY =
		'2ctFe1fPcPas9yksTtU27CnvEB9UU9g5LKQM5nPqYBVxKdHPau1QmeunzhLsGkL27AzxifektRhN4zZ6o6FDNALs';
	const USER_PRIVATE_KEY = bs58.decode(WALLET_PRIVATE_KEY);
	const USER_KEYPAIR = Keypair.fromSecretKey(USER_PRIVATE_KEY);

	await Jupiter.load({
		connection,
		cluster: 'mainnet-beta',
		user: USER_KEYPAIR,
	})
		.then((res) => console.log('res: ', res))
		.catch((err) => console.log('err: ', err));
}

const routingInstrumentation =
	new Sentry.Native.ReactNavigationInstrumentation();
console.log('routingInstrumentation: ', routingInstrumentation);

Sentry.init({
	dsn: 'https://8622adb754c3410cbb75dc3a947de79d@o1082874.ingest.sentry.io/6091873',
	enableInExpoDevelopment: true,
	debug: true,
	enableAutoSessionTracking: true,
	// Sessions close after app is 10 seconds in the background.
	sessionTrackingIntervalMillis: 10000,
	integrations: [
		new Sentry.Native.ReactNativeTracing({
			tracingOrigins: ['localhost', /^\//, /^https:\/\//],
			routingInstrumentation,
		}),
	],
});

// Access any @sentry/react-native exports via:
// Sentry.Native.*

// Access any @sentry/browser exports via:
// Sentry.Browser.*

LogBox.ignoreAllLogs(true);

export default function App() {
	const isLoadingComplete = useCachedResources();
	const [globalActiveWallet, setGlobalActiveWallet] = useState(0);
	const [globalPreviousActiveWallet, setGlobalPreviousActiveWallet] =
		useState(0);

	React.useEffect(() => {
		jupTest();
	}, []);
	const globalActions = {
		globalActiveWallet: globalActiveWallet,
		globalPreviousActiveWallet: globalPreviousActiveWallet,
		setGlobalActiveWallet,
		setGlobalPreviousActiveWallet,
	};

	if (!isLoadingComplete) {
		return null;
	} else {
		// return (
		// 	<View>
		// 		<Text>helloo</Text>
		// 	</View>
		// );
		return (
			<AppContext.Provider value={globalActions}>
				<StoreProvider store={store}>
					<PaperProvider theme={theme}>
						<BottomSheetModalProvider>
							<Navigation />
							<StatusBar />
						</BottomSheetModalProvider>
					</PaperProvider>
				</StoreProvider>
			</AppContext.Provider>
		);
	}
}
