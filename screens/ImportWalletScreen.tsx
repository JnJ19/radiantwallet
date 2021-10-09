import React, { memo, useState } from 'react';
import {
	Background,
	Button,
	BackButton,
	Paragraph,
	TextInput,
	Header,
	SubPageHeader,
} from '../components';
import { Navigation } from '../types';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../core/theme';
import {
	View,
	Text,
	TextInput as TextInputRN,
	Image,
	TextInputProps,
} from 'react-native';

type Props = {
	navigation: Navigation;
};

interface InputProps extends TextInputProps {
	name: string;
	icon: string;
	placeholder: string;
	placeholderTextColor: color;
}

const ImportWalletScreen = ({ navigation }: Props) => {
	const [name, setName] = useState('');
	const [secret, setSecret] = useState('');

	return (
		<Background position="bottom">
			<SubPageHeader backButton={true}>Import Wallet</SubPageHeader>
			<Text style={theme.fonts.Nunito_Sans.Body_L_Bold}>
				Add your secret phrase to import your wallet
			</Text>
			<View
				style={{
					borderWidth: 1,
					borderColor: theme.colors.black_seven,
					// padding: 8,
					borderRadius: 18,
					padding: 16,
				}}
			>
				<TextInputRN
					style={{
						borderColor: 'black',
						borderWidth: 0,
						...theme.fonts.Nunito_Sans.Body_M_Regular,
					}}
					onChangeText={(text) => setSecret(text)}
					value={secret}
					placeholder="Enter your secret phrase"
					// placeholderTextColor: theme.colors.primary
					keyboardType="default"
					multiline={true}
					minHeight={150}
				/>
				<View
					style={{
						borderBottomColor: theme.colors.black_seven,
						borderBottomWidth: 1,
						marginBottom: 8,
					}}
				></View>
				<View style={{ flexDirection: 'row' }}>
					<View
						style={{
							flexDirection: 'row',
							marginRight: 8,
							padding: 6,
							backgroundColor: '#F1F4F9',
							borderRadius: 6,
						}}
					>
						<Image
							source={require('../assets/icons/scan.jpg')}
							style={{
								width: 16,
								height: 16,
								alignSelf: 'center',
								marginRight: 6,
							}}
						/>
						<Text
							style={theme.fonts.Nunito_Sans.Caption_S_SemiBold}
						>
							Scan
						</Text>
					</View>
					<View
						style={{
							flexDirection: 'row',
							marginRight: 8,
							padding: 6,
							backgroundColor: '#F1F4F9',
							borderRadius: 6,
						}}
					>
						<Image
							source={require('../assets/icons/copy.jpg')}
							style={{
								width: 16,
								height: 16,
								alignSelf: 'center',
								marginRight: 6,
							}}
						/>
						<Text
							style={theme.fonts.Nunito_Sans.Caption_S_SemiBold}
						>
							sport seek found
						</Text>
					</View>
				</View>
			</View>
			<Text style={theme.fonts.Nunito_Sans.Body_M_Bold}>
				What is a secret phrase?
			</Text>
			<View style={{ height: 250 }}></View>
			<Button
				mode="contained"
				onPress={() => navigation.navigate('Dashboard')}
			>
				Import Wallet
			</Button>
		</Background>
	);
};

export default memo(ImportWalletScreen);
