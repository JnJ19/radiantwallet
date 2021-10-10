import React, { memo, useState, useMemo, useRef, useCallback } from 'react';
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
	StyleSheet,
} from 'react-native';
import {
	BottomSheetModal,
	BottomSheetModalProvider,
	useBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
	navigation: Navigation;
};

// interface InputProps extends TextInputProps {
// 	name: string;
// 	icon: string;
// 	placeholder: string;
// 	placeholderTextColor: color;
// }

const ImportWalletScreen = ({ navigation }: Props) => {
	const [name, setName] = useState('');
	const [secret, setSecret] = useState('');
	// const { dismiss, dismissAll } = useBottomSheetModal();

	type dismiss = () => void;
	// ref
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);

	// variables
	const snapPoints = useMemo(() => ['25%', '50%'], []);

	// callbacks
	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);
	const handleSheetChanges = useCallback((index: number) => {
		console.log('handleSheetChanges', index);
	}, []);

	return (
		<Background position="bottom">
			<View>
				<SubPageHeader backButton={true}>Import Wallet</SubPageHeader>
				<Text
					style={{
						marginVertical: 24,
						...theme.fonts.Nunito_Sans.Body_L_Bold,
					}}
				>
					Add your secret phrase to import your wallet
				</Text>
				<View
					style={{
						borderWidth: 1,
						borderColor: theme.colors.black_seven,
						// padding: 8,
						borderRadius: 18,
						padding: 16,
						marginBottom: 24,
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
								style={
									theme.fonts.Nunito_Sans.Caption_S_SemiBold
								}
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
								style={
									theme.fonts.Nunito_Sans.Caption_S_SemiBold
								}
							>
								sport seek found
							</Text>
						</View>
					</View>
				</View>
				{/* <Button
				onPress={handlePresentModalPress}
				title="Present Modal"
				mode="contained"
				// color="black"
			/> */}
				<TouchableOpacity
					onPress={() => bottomSheetModalRef.current?.present()}
				>
					<Text style={theme.fonts.Nunito_Sans.Body_M_Bold}>
						What is a Secret Phrase?
					</Text>
				</TouchableOpacity>
				{/* <View style={{ height: 250 }}></View> */}
			</View>
			<Button
				mode="contained"
				onPress={() => navigation.navigate('Dashboard')}
			>
				Import Wallet
			</Button>
			<BottomSheetModalProvider>
				<BottomSheetModal
					ref={bottomSheetModalRef}
					index={1}
					snapPoints={snapPoints}
					onChange={handleSheetChanges}
					style={{ margin: 16 }}
				>
					<View style={{ justifyContent: 'space-between' }}>
						<View
							style={{
								marginBottom: 24,
								marginTop: 8,
							}}
						>
							<Text
								style={
									theme.fonts.Azeret_Mono.Header_M_SemiBold
								}
							>
								What is a Secret Phrase?
							</Text>
						</View>
						<Text
							style={{
								...theme.fonts.Nunito_Sans.Body_M_SemiBold,
								marginBottom: 16,
							}}
						>
							The secret phrase is like a password, but generated
							programmatically and more secure.
						</Text>
						<Text
							style={{
								...theme.fonts.Nunito_Sans.Body_M_SemiBold,
								marginBottom: 16,
							}}
						>
							You should have received it from where you generated
							your wallet and it should be 12-20 words long.
						</Text>
						<Text
							style={{
								...theme.fonts.Nunito_Sans.Body_M_SemiBold,
								marginBottom: 16,
							}}
						>
							Be sure to enter it in the exact word order you
							received it with a space between each word.
						</Text>
						<Button
							onPress={() =>
								bottomSheetModalRef.current?.dismiss()
							}
						>
							{' '}
							I Understand
						</Button>
					</View>
				</BottomSheetModal>
			</BottomSheetModalProvider>
			{/* <BottomSheet
				ref={bottomSheetRef}
				index={1}
				snapPoints={snapPoints}
				onChange={handleSheetChanges}
			>
				<View>
					<Text>Awesome 🎉</Text>
				</View>
			</BottomSheet> */}
		</Background>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		justifyContent: 'center',
		backgroundColor: 'grey',
	},
	contentContainer: {
		flex: 1,
		alignItems: 'center',
	},
});

export default memo(ImportWalletScreen);
