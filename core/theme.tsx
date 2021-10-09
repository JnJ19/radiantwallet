import { DefaultTheme } from 'react-native-paper';

export const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#1E2122',
		accent: '#C9F977',
		text: '#000',
		background: '#ffffff',
		border: '#DFE4EB',
		black: {
			one: '#0C0C0D',
			two: '#1F2328',
			three: '#30363F',
			four: '#4A5059',
			five: '#6E7681',
			six: '#CBD0D6',
			seven: '#E5E8EF',
			eight: '#F6F9FF',
			nine: '#FDFDFE',
		},
		error: {
			one: '#E8083E',
			two: '#F16B8B',
			three: '#F9C1D2',
			four: '#FEF2F6',
		},
		success: {
			one: '#0CC36C',
			two: '#8BECB8',
			three: '#C5F6DB',
			four: '#DDFAEA',
		},
	},
	fonts: {
		Nunito_Sans: {
			Header_XL_Regular: {
				fontFamily: 'NunitoSans_400Regular',
				fontSize: 32,
			},
			Header_L_Regular: {
				fontFamily: 'NunitoSans_400Regular',
				fontSize: 28,
			},
			Header_M_Regular: {
				fontFamily: 'NunitoSans_700Bold',
				fontSize: 24,
			},
			Body_Regular: {
				fontFamily: 'NunitoSans_400Regular',
				fontSize: 17,
			},
			Body_SemiBold: {
				fontFamily: 'NunitoSans_600SemiBold',
				fontSize: 17,
			},
			Body_Bold: {
				fontFamily: 'NunitoSans_700Bold',
				fontSize: 17,
			},
			Body_ExtraBold: {
				fontFamily: 'NunitoSans_800ExtraBold',
				fontSize: 17,
			},
			Caption_M_Regular: {
				fontFamily: 'NunitoSans_400Regular',
				fontSize: 17,
			},
			Caption_M_SemiBold: {
				fontFamily: 'NunitoSans_600SemiBold',
				fontSize: 17,
			},
			Caption_M_Bold: {
				fontFamily: 'NunitoSans_700Bold',
				fontSize: 17,
			},
			Caption_S_Regular: {
				fontFamily: 'NunitoSans_400Regular',
				fontSize: 17,
			},
			Caption_S_SemiBold: {
				fontFamily: 'NunitoSans_600SemiBold',
				fontSize: 17,
			},
			Caption_S_Bold: {
				fontFamily: 'NunitoSans_700Bold',
				fontSize: 17,
			},
			Caption_XS_SemiBold: {
				fontFamily: 'NunitoSans_600SemiBold',
				fontSize: 17,
			},
			Caption_XS_Bold: {
				fontFamily: 'NunitoSans_700Bold',
				fontSize: 17,
			},
		},
		Azeret_Mono: {
			Header_L_SemiBold: {
				fontFamily: 'AzeretMono_SemiBold',
				fontSize: 28,
			},
			Header_M_SemiBold: {
				fontFamily: 'AzeretMono_SemiBold',
				fontSize: 24,
			},
			Header_M_Bold: {
				fontFamily: 'AzeretMono_Bold',
				fontSize: 24,
			},
			Header_S_SemiBold: {
				fontFamily: 'AzeretMono_SemiBold',
				fontSize: 22,
			},
			Header_S_Bold: {
				fontFamily: 'AzeretMono_Bold',
				fontSize: 22,
			},
			Body_M_SemiBold: {
				fontFamily: 'AzeretMono_SemiBold',
				fontSize: 17,
			},
			Body_M_Bold: {
				fontFamily: 'AzeretMono_Bold',
				fontSize: 17,
			},
			Body_M_ExtraBold: {
				fontFamily: 'AzeretMono_ExtraBold',
				fontSize: 17,
			},
		},
	},
};
