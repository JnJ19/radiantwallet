import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import {
	useFonts,
	NunitoSans_400Regular,
	NunitoSans_400Regular_Italic,
	NunitoSans_600SemiBold,
	NunitoSans_600SemiBold_Italic,
	NunitoSans_700Bold,
	NunitoSans_700Bold_Italic,
	NunitoSans_800ExtraBold,
	NunitoSans_800ExtraBold_Italic,
} from '@expo-google-fonts/nunito-sans';

export default function useCachedResources() {
	const [isLoadingComplete, setLoadingComplete] = React.useState(false);

	// Load any resources or data that we need prior to rendering the app
	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync();

				// Load fonts
				await Font.loadAsync({
					NunitoSans_400Regular,
					NunitoSans_400Regular_Italic,
					NunitoSans_600SemiBold,
					NunitoSans_600SemiBold_Italic,
					NunitoSans_700Bold,
					NunitoSans_700Bold_Italic,
					NunitoSans_800ExtraBold,
					NunitoSans_800ExtraBold_Italic,
					AzeretMono_Bold: require('../assets/fonts/AzeretMono-Bold.ttf'),
					AzeretMono_ExtraBold: require('../assets/fonts/AzeretMono-ExtraBold.ttf'),
					AzeretMono_SemiBold: require('../assets/fonts/AzeretMono-SemiBold.ttf'),
				});
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
				SplashScreen.hideAsync();
			}
		}

		loadResourcesAndDataAsync();
	}, []);

	return isLoadingComplete;
}
