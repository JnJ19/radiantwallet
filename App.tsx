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

LogBox.ignoreAllLogs(true);

export default function App() {
	const isLoadingComplete = useCachedResources();
	const [globalActiveWallet, setGlobalActiveWallet] = useState(0);
	const [globalPreviousActiveWallet, setGlobalPreviousActiveWallet] = useState(0);

	const globalActions = {
		globalActiveWallet: globalActiveWallet,
		globalPreviousActiveWallet: globalPreviousActiveWallet,
		setGlobalActiveWallet,
		setGlobalPreviousActiveWallet,
	}

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
