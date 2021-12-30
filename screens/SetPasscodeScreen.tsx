import React, { memo, useState, useEffect } from 'react';
import { Text } from 'react-native';
import { Background, ThemeButton, SubPageHeader } from '../components';
import { Navigation } from '../types';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme';
const {
	colors,
	fonts: { Azeret_Mono, Nunito_Sans },
} = theme;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';
import * as SecureStore from 'expo-secure-store';

type Props = {
	navigation: Navigation;
	route: Object;
};

const SetPassCodeScreen = ({ navigation, route }: Props) => {
	const [code, setCode] = useState('');
	const updatePasscode = useStoreActions((actions) => actions.updatePasscode);
	const passcode = useStoreState((state) => state.passcode);

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
		const passcodeKey = code + 'key';
		await AsyncStorage.setItem('hasAccount', 'true');
		await SecureStore.setItemAsync(passcodeKey, code);
		navigation.navigate('Onboarding');
	}

	return (
		<Background blackBackground={true} fullView={false}>
			<SubPageHeader backButton={true} whiteBackButton={true} >Set Passcode</SubPageHeader>
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

				<View>
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
				<View
					style={{
						borderColor: '#C9F977',
						borderWidth: 1,
						borderRadius: 18,
						marginBottom: 40,
					}}
				>
					<ThemeButton
						mode="contained"
						onPress={() => storeCodeAndContinue()}
						style={{ backgroundColor: 'black' }}
					>
						Save & Continue
					</ThemeButton>
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

export default memo(SetPassCodeScreen);
