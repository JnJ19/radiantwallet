import React, { memo, useState, useEffect } from 'react';
import {
	SafeAreaView,
	Text,
	ScrollView,
	Linking,
	AsyncStorageStatic,
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
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { DashboardScreen } from '.';
import { AreaChart, Path } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import * as shape from 'd3-shape';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { theme } from '../core/theme';
import { BlurView } from 'expo-blur';
const {
	colors,
	fonts: { Azeret_Mono, Nunito_Sans },
} = theme;
import { SubPageHeader } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';
import * as SecureStore from 'expo-secure-store';
const addCommas = new Intl.NumberFormat('en-US');

type Props = {
	navigation: Navigation;
	route: Object;
};

const PassCodeScreen = ({ navigation, route }: Props) => {
	const [code, setCode] = useState('');
	const updatePasscode = useStoreActions((actions) => actions.updatePasscode);
	const passcode = useStoreState((state) => state.passcode);
	const [error, setError] = useState(false);

	console.log('code', code);

	async function getPhrase(passcode: string) {
		let result = await SecureStore.getItemAsync(passcode);
		if (result) {
			return result;
		} else {
			console.log('No values stored under that key.', result);
		}
	}

	async function storePhraseAndContinue(passcode: string, phrase: string) {
		await SecureStore.setItemAsync(passcode, phrase);
		// navigation.navigate('Main');
	}

	async function checkLocalPasscode(passcodeKey: string, code: string) {
		let result = await SecureStore.getItemAsync(passcodeKey);
		if (result === code) {
			updatePasscode(code);
			navigation.navigate('Main');
		} else {
			setError(true);
			setCode('');
		}
	}

	async function storePassKey() {
		await SecureStore.setItemAsync('6595key', '6595');
	}

	useEffect(() => {
		if (code.length === 4) {
			const passcodeKey = code + 'key';
			checkLocalPasscode(passcodeKey, code);
		}
		if (code.length === 1) {
			setError(false);
		}
	}, [code]);

	function addNumber(numberString: string) {
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

	function removeNumber() {
		if (code.length === 1) {
			setCode('');
		} else {
			const newAmount = code.slice(0, -1);
			setCode(newAmount);
		}
	}

	async function storeCodeAndContinue() {
		updatePasscode(code);
		await AsyncStorage.setItem('hasAccount', 'true');
		const result = await AsyncStorage.getItem('hasAccount');
		navigation.navigate('Onboarding');
	}

	async function storeLocal() {
		const setStorage = await AsyncStorage.setItem('testKey', 'testValue');
		console.log('setStorage: ', setStorage);
		const getStorage = await AsyncStorage.getItem('testKeyyy');
		console.log('getStorage: ', getStorage);
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
			{/* <View
				style={{
					borderColor: '#C9F977',
					borderWidth: 1,
					borderRadius: 18,
					// marginTop: 180,
					marginBottom: 40,
				}}
			>
				<Button
					mode="contained"
					onPress={() => storePassKey()}
					style={{ backgroundColor: 'black' }}
				>
					Save & Continue
				</Button>
			</View> */}
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