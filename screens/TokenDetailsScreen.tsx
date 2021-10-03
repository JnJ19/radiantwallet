import React, { memo, useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
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
import { AreaChart, Grid } from 'react-native-svg-charts';
import { LinearGradient } from 'react-native-svg';
import * as shape from 'd3-shape';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { theme } from '../core/theme';
import { SubPageHeader } from '../components';

type Props = {
	navigation: Navigation;
};

const TokenDetailsScreen = ({ navigation }: Props) => {
	const [name, setName] = useState('');
	const [secret, setSecret] = useState('');
	const data = [50, 10, 40, 30, 10, 10, 85, 91, 35, 53, 10, 24, 50, 10, 10];

	return (
		<Background>
			<SubPageHeader backButton>Token Details</SubPageHeader>

			<View
				style={{
					borderWidth: 1,
					borderColor: theme.colors.border,
					backgroundColor: 'white',
					borderRadius: 8,
					padding: 16,
				}}
			>
				<Text
					style={{
						marginVertical: 8,
						fontFamily: 'Sumo',
						fontWeight: 'bold',
						fontSize: 17,
					}}
				>
					Price History
				</Text>
				<View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
					<Text style={{ fontSize: 24, marginRight: 8 }}>$5,302</Text>
					<Text style={{ color: '#07CC79' }}>Up 10% Today</Text>
				</View>

				<AreaChart
					style={{ height: 200 }}
					data={data}
					showGrid={false}
					animate={true}
					contentInset={{ top: 30, bottom: 30 }}
					curve={shape.curveNatural}
					svg={{
						fill: theme.colors.accent,
						stroke: 'rgba(0, 0, 0, 1)',
					}}
				></AreaChart>
			</View>

			<View
				style={{
					borderWidth: 1,
					borderColor: theme.colors.border,
					borderRadius: 16,
				}}
			>
				<View style={{ margin: 16 }}>
					<Text
						style={{
							fontFamily: 'Sumo',
							fontWeight: 'bold',
							fontSize: 17,
						}}
					>
						Details
					</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginVertical: 16,
						}}
					>
						<Text style={styles.tableLabel}>Market Cap</Text>
						<Text style={styles.tableData}>$61.2 Billion</Text>
					</View>
					<View
						style={{
							height: 1,
							backgroundColor: theme.colors.border,
						}}
					/>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginVertical: 16,
						}}
					>
						<Text style={styles.tableLabel}>Market Rank</Text>
						<Text style={styles.tableData}>#7</Text>
					</View>
					<View
						style={{
							height: 1,
							backgroundColor: theme.colors.border,
						}}
					/>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginVertical: 16,
						}}
					>
						<Text style={styles.tableLabel}>24hr Volume</Text>
						<Text style={styles.tableData}>$544,384,983</Text>
					</View>
				</View>
			</View>

			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}
			>
				<Button
					mode="outlined"
					onPress={() => navigation.navigate('Set Pin')}
				>
					Send
				</Button>
				<View style={{ width: 8 }} />
				<Button
					mode="contained"
					onPress={() => navigation.navigate('Import Wallet')}
				>
					Swap
				</Button>
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
});

export default memo(TokenDetailsScreen);
