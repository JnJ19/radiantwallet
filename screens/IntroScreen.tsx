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
		{/* <View style={styles.container}> */}
		<View style={{ alignItems: 'center', marginTop: 24 }}>
			{/* <View style={{marginBottom: 16}}> */}
			<Image
				source={require('../assets/images/logo_3.jpg')}
				style={{
					width: 224,
					height: 22,
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
			<View style={{ flexDirection: 'column' }}>
				<Button
					mode="contained"
					onPress={() => navigation.navigate('Onboarding')}
				>
					Get Started
				</Button>
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
