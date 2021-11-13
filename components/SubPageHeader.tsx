import { NavigationContainer } from '@react-navigation/native';
import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet, View, Text } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import { theme } from '../core/theme';
import { Subheader } from 'react-native-paper/lib/typescript/components/List/List';

type Props = {
	children: React.ReactNode;
	backButton: boolean;
	subText: string;
};

const SubPageHeader = ({ children, backButton, subText = '' }: Props) => {
	const navigation = useNavigation();
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center'}}>
			{backButton && (
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{
						borderWidth: 1,
						borderColor: theme.colors.border,
						justifyContent: 'center',
						height: 40,
						width: 40,
						borderRadius: 18,
						marginRight: 16,
						alignItems: 'center'
					}}
				>
					<Image
						source={require('../assets/icons/left-arrow.jpg')}
						fadeDuration={0}
						style={{ width: 16, height: 16, alignSelf: 'center', alignItems: 'center' }}
					/>
				</TouchableOpacity>
			)}
			<View style={{ paddingVertical: 24 }}>
				<Text style={styles.header}>{children}</Text>
				{/* <Header>{children}</Header> */}
				{subText ? (
					<View>
						<Text style={styles.subHeader}>{subText}</Text>
					</View>
				) : null}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		// position: "absolute",
		top: 40 + getStatusBarHeight(),
		left: 10,
		backgroundColor: 'blue',
	},
	image: {
		width: 24,
		height: 24,
	},
	header: {
		color: theme.colors.text,
		...theme.fonts.Azeret_Mono.Header_S_SemiBold,
		//marginBottom: 4,
	},
	subHeader: {
		...theme.fonts.Nunito_Sans.Body_M_SemiBold,
		color: theme.colors.black_five,
	},
});

export default memo(SubPageHeader);
