import React, { memo } from 'react';
import {
	ImageBackground,
	StyleSheet,
	KeyboardAvoidingView,
	SafeAreaView,
	View,
	ScrollView,
} from 'react-native';

type Props = {
	children: React.ReactNode;
	position?: String;
	// blackBackground: boolean;
};

const Background = ({ children, position, blackBackground = false }: Props) => (
	// <ImageBackground
	//   source={require("../assets/images/background.jpg")}
	//   resizeMode="cover"
	//   style={styles.background}
	// >
	<View
		style={[
			{ backgroundColor: 'white', height: '100%', flex: 1 },
			blackBackground && { backgroundColor: 'black' },
			{ paddingTop: 24 },
		]}
	>
		<KeyboardAvoidingView
			style={styles.container}
			// behavior="padding"
		>
			{children}
		</KeyboardAvoidingView>
	</View>
	// </ImageBackground>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		// paddingBottom: 32,
		width: '100%',
		// maxWidth: 340,
		// alignSelf: "center",
		// alignItems: "center",
		justifyContent: 'space-between',
		// backgroundColor: 'white',
	},

	bottom: {
		justifyContent: 'flex-end',
	},
});

export default memo(Background);
