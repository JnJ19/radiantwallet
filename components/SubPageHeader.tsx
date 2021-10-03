import { NavigationContainer } from '@react-navigation/native';
import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import { theme } from '../core/theme';

type Props = {
	children: React.ReactNode;
	backButton: boolean;
};

const SubPageHeader = ({ children, backButton }: Props) => {
	const navigation = useNavigation();

	return (
		<View style={{ flexDirection: 'row', alignItems: 'center' }}>
			{backButton && (
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{
						borderWidth: 1,
						borderColor: theme.colors.border,
						justifyContent: 'center',
						height: 40,
						width: 40,
						borderRadius: 16,
						marginRight: 16,
					}}
				>
					<Image
						source={require('../assets/icons/left-arrow.jpg')}
						fadeDuration={0}
						style={{ width: 16, height: 16, alignSelf: 'center' }}
					/>
				</TouchableOpacity>
			)}
			<Header>{children}</Header>
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
});

export default memo(SubPageHeader);
