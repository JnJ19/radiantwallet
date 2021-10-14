import React, { memo, useState } from 'react';
import { SafeAreaView, Text, ScrollView, Linking } from 'react-native';
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
const addCommas = new Intl.NumberFormat('en-US');

type Props = {
	navigation: Navigation;
	route: Object;
};

const TradeScreen = ({ navigation, route }: Props) => {
	console.log('route', route);
	const token = route.params;

	return (
		<Background>
			<SubPageHeader
				subText={`$${(token.amount * token.price).toFixed(
					2,
				)} available`}
				backButton
			>
				Trade {token.name}{' '}
			</SubPageHeader>
			<View>
				<Text style={{ ...styles.bigNumber, alignSelf: 'center' }}>
					$0
				</Text>
			</View>
			<View>
				<View
					style={{
						flexDirection: 'row',
						alignSelf: 'stretch',
						justifyContent: 'space-between',
						marginHorizontal: 16,
						marginBottom: 16,
					}}
				>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>1</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>2</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>3</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignSelf: 'stretch',
						justifyContent: 'space-between',
						marginHorizontal: 16,
						marginBottom: 16,
					}}
				>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>4</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>5</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>6</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignSelf: 'stretch',
						justifyContent: 'space-between',
						marginHorizontal: 16,
						marginBottom: 16,
					}}
				>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>7</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>8</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>9</Text>
					</View>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignSelf: 'stretch',
						justifyContent: 'space-between',
						marginHorizontal: 16,
					}}
				>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>.</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>0</Text>
					</View>
					<View style={styles.numberContainer}>
						<Text style={styles.mediumNumber}>3</Text>
					</View>
				</View>
			</View>
			<View style={{ marginBottom: 40 }}>
				<Button>Review Trade</Button>
			</View>
		</Background>
	);
};

const styles = StyleSheet.create({
	tableLabel: {
		fontSize: 14,
		color: '#727D8D',
	},
	tableData: {
		fontSize: 17,
		color: theme.colors.primary,
	},
	bigNumber: {
		fontSize: 84,
		fontFamily: 'Nunito Sans',
		fontWeight: '400',
		color: theme.colors.black_two,
	},
	mediumNumber: {
		fontSize: 48,
		fontFamily: 'Nunito Sans',
		fontWeight: '400',
		color: theme.colors.black_one,
	},
	numberContainer: {
		width: 56,
		height: 66,
	},
});

export default memo(TradeScreen);
