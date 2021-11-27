const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
module.exports = {
	resolver: {
		sourceExts: [
			...defaultConfig.resolver.sourceExts,
			'svg',
			'jsx',
			'js',
			'ts',
			'tsx',
			'cjs',
		],
		// extraNodeModules: {
		//   stream: require.resolve("readable-stream"),
		// },
		extraNodeModules: require('node-libs-expo'),
		assetExts: [
			...defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
		],
		transformer: {
			babelTransformerPath: require.resolve(
				'react-native-svg-transformer',
			),
		},
	},
};
