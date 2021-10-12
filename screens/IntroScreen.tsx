import React, { memo } from 'react';
import {
	Background,
	Button,
	Paragraph,
	Header,
	SubPageHeader,
} from '../components';
import { Navigation } from '../types';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, Image } from 'react-native';
import { theme } from '../core/theme';

type Props = {
	navigation: Navigation;
};

const IntroScreen = ({ navigation }: Props) => (
	<Background blackBackground={true}>
		<View style={{ justifyContent: 'space-between' }}>
			<View style={{ alignItems: 'center', marginTop: 24 }}>
				{/* <View style={{marginBottom: 16}}> */}
				<Image
					source={require('../assets/images/logo2.png')}
					style={{
						width: 206,
						height: 212,
						alignSelf: 'center',
						marginBottom: 32,
					}}
				/>
				<Image
					source={require('../assets/images/radiant.png')}
					style={{
						width: 224,
						height: 33,
						alignSelf: 'center',
						marginBottom: 32,
					}}
				/>
				<Text
					style={{
						color: 'white',
						...theme.fonts.Nunito_Sans.Body_M_Regular,
					}}
				>
					Import a wallet you already use or create a new wallet to
					transfer Solana ecosystem.
				</Text>
			</View>

			<View style={{ height: 450, marginTop: 48 }}>
				<View
					style={{
						flexDirection: 'column',
						borderColor: '#C9F977',
						borderWidth: 1,
						borderRadius: 20,
						marginTop: 180,
					}}
				>
					<Button
						mode="contained"
						onPress={() => navigation.navigate('Onboarding')}
					>
						Get Started
					</Button>
				</View>
				<Text
					style={{
						...theme.fonts.Nunito_Sans.Caption_M_Regular,
						color: '#C3C3C3',
						alignSelf: 'center',
						marginTop: 32,
					}}
				>
					Copyright Radiant Wallet 2021
				</Text>
			</View>
		</View>
	</Background>
);

const styles = StyleSheet.create({
	container: {
		// flex: 1
	},
});

export default memo(IntroScreen);
