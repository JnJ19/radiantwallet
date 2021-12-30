import React, { memo, useState, useEffect } from 'react';
import { Text } from 'react-native';
import { Background, SubPageHeader } from '../components';
import { Navigation } from '../types';
import {
	View,
	Image,
	StyleSheet,
	TouchableOpacity,
	DevSettings,
} from 'react-native';
import { theme } from '../core/theme';
const {
	colors,
	fonts: { Nunito_Sans },
} = theme;
import { useStoreState, useStoreActions } from '../hooks/storeHooks';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

type Props = {
	navigation: Navigation;
	route: Object;
};

const PassCodeScreen = ({ navigation, route }: Props) => {
	const [code, setCode] = useState('');
	const updatePasscode = useStoreActions((actions) => actions.updatePasscode);
	const passcode = useStoreState((state) => state.passcode);
	const [error, setError] = useState(false);

	async function checkLocalPasscode(passcodeKey: string, code: string) {
		let result = await SecureStore.getItemAsync(passcodeKey);
		if (result === code) {
			updatePasscode(code);
			const mnemonic = await SecureStore.getItemAsync(code);
			if (mnemonic) {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success,
				);
				navigation.navigate('Main');
			} else {
				navigation.navigate('Onboarding');
			}
		} else {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			setError(true);
			setCode('');
		}
	}

	// async function logout() {
	// 	console.warn('hit');
	// 	const passcodeKey = passcode + 'key';
	// 	await SecureStore.deleteItemAsync(passcodeKey);
	// 	console.warn('hit1');
	// 	await SecureStore.deleteItemAsync(passcode);
	// 	console.warn('hit2');
	// 	await AsyncStorage.removeItem('hasAccount');
	// 	console.warn('hit3');
	// 	DevSettings.reload();
	// }

	useEffect(() => {
		// logout();
		if (code.length === 4) {
			const passcodeKey = code + 'key';
			checkLocalPasscode(passcodeKey, code);
		}
		if (code.length === 1) {
			setError(false);
		}
	}, [code]);

	function addNumber(numberString: string) {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		if (code.length < 4) {
			if (code === '0') {
				const replaceZero = code.slice(0, -1);
				const newAmount = replaceZero.concat(numberString);
				setCode(newAmount);
			} else {
				const newAmount = code.concat(numberString);
				setCode(newAmount);
			}
		}
	}

	useEffect(() => {
		SecureStore.setItemAsync('test', 'test1');
	}, []);

	function removeNumber() {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		if (code.length === 1) {
			setCode('');
		} else {
			const newAmount = code.slice(0, -1);
			setCode(newAmount);
		}
	}

	return (
		<Background blackBackground={true}>
				<Image
					source={require('../assets/images/logo_passcode.png')}
					style={{
						width: 120,
						height: 124,
						alignSelf: 'center',
						marginTop: 64,
					}}
				/>

				<View
					style={{
						flexDirection: 'row',
						width: 160,
						justifyContent: 'space-between',
						alignSelf: 'center',
					}}
				>
					<View
						style={code.length >= 1 ? styles.filled : styles.outlined}
					/>
					<View
						style={code.length >= 2 ? styles.filled : styles.outlined}
					/>
					<View
						style={code.length >= 3 ? styles.filled : styles.outlined}
					/>
					<View
						style={code.length >= 4 ? styles.filled : styles.outlined}
					/>
				</View>
				{error ? (
					<Text
						style={{
							...Nunito_Sans.Body_M_Regular,
							color: 'white',
							opacity: 0.75,
							alignSelf: 'center',
						}}
					>
						Incorrect passcode, try again.
					</Text>
				) : null}

				<View style={{ marginBottom: 40 }}>
					<View style={styles.numRow}>
						<TouchableOpacity
							onPress={() => addNumber('1')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>1</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => addNumber('2')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>2</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => addNumber('3')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>3</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.numRow}>
						<TouchableOpacity
							onPress={() => addNumber('4')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>4</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => addNumber('5')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>5</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => addNumber('6')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>6</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.numRow}>
						<TouchableOpacity
							onPress={() => addNumber('7')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>7</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => addNumber('8')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>8</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => addNumber('9')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>9</Text>
						</TouchableOpacity>
					</View>
					<View style={{ ...styles.numRow, marginBottom: 0 }}>
						<View style={styles.numberContainer}>
							<Text style={styles.mediumNumber}></Text>
						</View>
						<TouchableOpacity
							onPress={() => addNumber('0')}
							style={styles.numberContainer}
						>
							<Text style={styles.mediumNumber}>0</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => removeNumber()}
							style={styles.numberContainer}
						>
							{/* <Text style={styles.mediumNumber}>3</Text> */}
							<Image
								source={require('../assets/icons/arrow-left-big-green.png')}
								style={{ width: 40, height: 40 }}
							/>
						</TouchableOpacity>
					</View>
				</View>	
		</Background>
	);
};

const styles = StyleSheet.create({
	tableLabel: {
		fontSize: 14,
		color: '#727D8D',
	},
	outlined: {
		width: 16,
		height: 16,
		borderRadius: 1000,
		borderWidth: 1,
		borderColor: colors.accent,
	},
	filled: {
		width: 16,
		height: 16,
		borderRadius: 1000,
		// borderWidth: 1,
		backgroundColor: colors.accent,
	},
	tableData: {
		fontSize: 17,
		color: colors.primary,
	},
	bigNumber: {
		fontSize: 84,
		fontFamily: 'Nunito Sans',
		fontWeight: '400',
		color: colors.black_two,
	},
	mediumNumber: {
		fontSize: 48,
		fontFamily: 'Nunito Sans',
		fontWeight: '400',
		color: colors.accent,
	},
	numberContainer: {
		width: 56,
		height: 66,
		justifyContent: 'center',
		alignItems: 'center',
	},
	toFrom: {
		...Nunito_Sans.Caption_M_Regular,
		color: colors.black_five,
		marginBottom: 4,
	},
	swapTokens: {
		...Nunito_Sans.Body_M_Regular,
		color: colors.black_two,
	},
	swapContainer: {
		borderColor: colors.border,
		borderWidth: 1,
		borderRadius: 18,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	numRow: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		marginHorizontal: 16,
		marginBottom: 16,
	},
});

export default memo(PassCodeScreen);
