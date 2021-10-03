import React, { memo, useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
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
import { View } from 'react-native';
import { DashboardScreen } from '.';
import { AreaChart, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { SubPageHeader } from '../components';
import { theme } from '../core/theme';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

type Props = {
	navigation: Navigation;
};

const DashboardScreen2 = ({ navigation }: Props) => {
	const [name, setName] = useState('');
	const [secret, setSecret] = useState('');
	const [logos, setLogos] = useState('');
	const data = [50, 10, 40, 30, 10, 10, 85, 91, 35, 53, 10, 24, 50, 10, 10];
	const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());

	useEffect(() => {
		const apiKey = 'f7353e06-2e44-4912-9fff-05929a5681a7';
		fetch(
			`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=sol,btc,eth`,
			{
				headers: {
					'X-CMC_PRO_API_KEY': apiKey,
					Accept: 'application/json',
					'Accept-Encoding': 'deflate, gzip',
				},
			},
		)
			.then((response) => response.json())
			.then((data) => {});
	}, []);

	useEffect(() => {
		//         const tokenList1 = new TokenListProvider().resolve().then((tokens) => {
		//   const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
		//   console.log(tokenList);
		//         });

		new TokenListProvider().resolve().then((tokens) => {
			const tokenList = tokens
				.filterByClusterSlug('mainnet-beta')
				.getList();

			console.log('token list', tokenList);

			setTokenMap(
				tokenList.reduce((map, item) => {
					map.set(item.address, item);
					return map;
				}, new Map()),
			);
		});
	}, [setTokenMap]);

	const address = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
	const address2 = '6dk8qW3qLQz3KRBUAQf71k7aQw87rXTiqb6eguWD9rjK';
	const token = tokenMap.get(address2);

	console.log('tokenmap', tokenMap);

	console.log('token url', token?.logoURI);

	return (
		<Background>
			<SubPageHeader backButton={false}>Dashboard</SubPageHeader>

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

			<View style={{ marginTop: 24, marginBottom: 8 }}>
				<Text>Portfolio</Text>
			</View>
			<TouchableOpacity
				onPress={() => navigation.navigate('Token Details')}
			>
				<Card.Title
					title="SOL"
					titleStyle={{ color: '#1F1F1F', fontSize: 17 }}
					subtitle="Solana"
					subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
					style={{
						backgroundColor: 'white',
						borderRadius: 8,
						marginBottom: 8,
						borderWidth: 1,
						borderColor: theme.colors.border,
					}}
					left={(props) => {
						return <Avatar.Icon {...props} icon="folder" />;
					}}
					right={(props) => {
						return (
							<View
								style={{
									alignItems: 'flex-end',
									marginRight: 16,
								}}
							>
								<Text
									style={{ fontSize: 17, color: '#1F1F1F' }}
								>
									10.5
								</Text>
								<Text
									style={{ fontSize: 14, color: '#727D8D' }}
								>
									$1,280
								</Text>
							</View>
						);
					}}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => navigation.navigate('Search Tokens')}
			>
				<Card.Title
					title="SOL"
					titleStyle={{ color: '#1F1F1F', fontSize: 17 }}
					subtitle="Solana"
					subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
					style={{
						backgroundColor: 'white',
						borderRadius: 8,
						marginBottom: 8,
					}}
					left={(props) => {
						return <Avatar.Icon {...props} icon="folder" />;
					}}
					right={(props) => {
						return (
							<View
								style={{
									alignItems: 'flex-end',
									marginRight: 16,
								}}
							>
								<Text
									style={{ fontSize: 17, color: '#1F1F1F' }}
								>
									10.5
								</Text>
								<Text
									style={{ fontSize: 14, color: '#727D8D' }}
								>
									$1,280
								</Text>
							</View>
						);
					}}
				/>
			</TouchableOpacity>
			<Card.Title
				title="SOL"
				titleStyle={{ color: '#1F1F1F', fontSize: 17 }}
				subtitle="Solana"
				subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
				style={{
					backgroundColor: 'white',
					borderRadius: 8,
					marginBottom: 8,
				}}
				left={(props) => {
					return <Avatar.Icon {...props} icon="folder" />;
				}}
				right={(props) => {
					return (
						<View
							style={{ alignItems: 'flex-end', marginRight: 16 }}
						>
							<Text style={{ fontSize: 17, color: '#1F1F1F' }}>
								10.5
							</Text>
							<Text style={{ fontSize: 14, color: '#727D8D' }}>
								$1,280
							</Text>
						</View>
					);
				}}
			/>

			<View style={{ marginTop: 24, marginBottom: 8 }}>
				<Text>Popular Tokens</Text>
			</View>
			<Card.Title
				title="SOL"
				titleStyle={{ color: '#1F1F1F', fontSize: 17 }}
				subtitle="Solana"
				subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
				style={{
					backgroundColor: 'white',
					borderRadius: 8,
					marginBottom: 8,
				}}
				left={(props) => {
					return <Avatar.Icon {...props} icon="folder" />;
				}}
				right={(props) => {
					return (
						<View
							style={{ alignItems: 'flex-end', marginRight: 16 }}
						>
							<Text style={{ fontSize: 17, color: '#1F1F1F' }}>
								10.5
							</Text>
							<Text style={{ fontSize: 14, color: '#727D8D' }}>
								$1,280
							</Text>
						</View>
					);
				}}
			/>
		</Background>
	);
};

export default memo(DashboardScreen2);
