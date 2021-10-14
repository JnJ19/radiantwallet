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
		</Background>
	);
};

{
	/* const styles = StyleSheet.create({
	tableLabel: {
		fontSize: 14,
		color: '#727D8D',
	},
	tableData: {
		fontSize: 17,
		color: theme.colors.primary,
	},
}); */
}

export default memo(TradeScreen);
