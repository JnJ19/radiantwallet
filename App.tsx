require('node-libs-expo/globals');
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StoreProvider } from 'easy-peasy';
import { LogBox } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import './global';

import 'react-native-url-polyfill/auto';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './core/theme';
import useCachedResources from './hooks/useCachedResources';
import store from './store';
import Navigation from './navigation';

import AppContext from './components/AppContext';
import * as Sentry from 'sentry-expo';

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

	const globalActions = {
		globalActiveWallet: globalActiveWallet,
		globalPreviousActiveWallet: globalPreviousActiveWallet,
		setGlobalActiveWallet,
		setGlobalPreviousActiveWallet,
	};

	if (!isLoadingComplete) {
		return null;
	} else {
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
