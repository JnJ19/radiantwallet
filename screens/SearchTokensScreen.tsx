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
import { View, FlatList, Image } from 'react-native';
import { DashboardScreen } from '.';
import { AreaChart, Grid } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Shadow } from 'react-native-shadow-2';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { SubPageHeader } from '../components';
import { theme } from '../core/theme';
import TokenCard from '../components/TokenCard';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';

import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';

type Props = {
	navigation: Navigation;
};

const SearchTokensScreen = ({ navigation }: Props) => {
	const [search, setSearch] = useState('');
	const [secret, setSecret] = useState('');
	const [logos, setLogos] = useState('');
	const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());
	const [tokens, setTokens] = useState('');
	const allTokens = useStoreState((state) => state.allTokens);

	console.log('tokenmappp', tokenMap);
	const renderItem = (data) => {
		console.log('hello', data.item);
		return (
			<View>
				<Card.Title
					title={data.item.symbol}
					titleStyle={{ color: '#1F1F1F', fontSize: 17 }}
					subtitle={data.item.name}
					subtitleStyle={{ fontSize: 14, color: '#727D8D' }}
					style={{
						backgroundColor: 'white',
						borderRadius: 8,
						marginBottom: 8,
						borderWidth: 1,
						borderColor: theme.colors.border,
					}}
					left={(props) => {
						return (
							<Image
								style={{ height: 24, width: 24 }}
								source={{ uri: data.item.logoURI }}
							/>
							// <Text>Test</Text>
						);
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
			</View>
		);
	};

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
		new TokenListProvider().resolve().then((tokens) => {
			const tokenList = tokens
				.filterByClusterSlug('mainnet-beta')
				.getList();
			console.log(tokenList);
			setTokens(tokenList);
		});

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
			<View>
				<SubPageHeader backButton={false}>Browse Tokens</SubPageHeader>

				<TextInput
					label="Search"
					mode="outlined"
					value={search}
					onChangeText={(text) => setSearch(text)}
					theme={{
						colors: { text: '#000' },
						fonts: {
							regular: {
								fontFamily: 'Inter_500Medium',
							},
						},
					}}
				/>
			</View>

			<FlatList
				data={tokens}
				renderItem={renderItem}
				keyExtractor={(item) => item.address}
			/>
			{/* {tokens ? (
				<FlatList
					data={allTokens}
					renderItem={(token) => (
						<TokenCard
							token={token}
							onPress={() =>
								navigation.navigate('Token Details', token.item)
							}
						/>
					)}
					// renderItem={TokenCard}
					keyExtractor={(item) => item.address}
				/>
			) : null} */}
		</Background>
	);
};

export default memo(SearchTokensScreen);
