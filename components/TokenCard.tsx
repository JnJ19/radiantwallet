import React, { memo, useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { View, FlatList, Image } from 'react-native';
import { Card } from 'react-native-paper';
import { theme } from '../core/theme';

const TokenCard = (info: object) => {
	const { mint, price, amount, name, symbol, logo, change_24h } =
		info.token.item;
	const { onPress } = info;

	return (
		<TouchableOpacity onPress={onPress}>
			<Card.Title
				title={symbol}
				titleStyle={{
					color: '#1F1F1F',
					...theme.fonts.Nunito_Sans.Body_M_Bold,
					marginBottom: 0,
				}}
				subtitle={name}
				subtitleStyle={{
					...theme.fonts.Nunito_Sans.Caption_M_SemiBold,
					color: '#727D8D',
				}}
				style={{
					backgroundColor: 'white',
					borderRadius: 18,
					marginBottom: 8,
					borderWidth: 1,
					borderColor: theme.colors.border,
				}}
				left={(props) => {
					return (
						<Image
							style={{ height: 32, width: 32, borderRadius: 100 }}
							source={{ uri: logo }}
						/>
					);
				}}
				right={(props) => {
					return (
						<View
							style={{
								alignItems: 'flex-end',
								marginRight: 16,
							}}
						>
							<Text
								style={{
									...theme.fonts.Nunito_Sans.Body_M_Bold,
									color: '#1F1F1F',
									marginBottom: 4,
								}}
							>
								${(amount * price).toFixed(2)}
							</Text>
							<View style={{ flexDirection: 'row' }}>
								{change_24h > 0 ? (
									<Image
										source={require('../assets/icons/Upward.jpg')}
										style={{
											width: 16,
											height: 16,
											marginVertical: 2,
										}}
									/>
								) : (
									<Image
										source={require('../assets/icons/Downward.jpg')}
										style={{
											width: 16,
											height: 16,
											marginVertical: 2,
										}}
									/>
								)}
								<Text
									style={[
										theme.fonts.Nunito_Sans
											.Caption_M_SemiBold,
										change_24h > 0
											? {
													color: theme.colors
														.success_one,
											  }
											: {
													color: theme.colors
														.error_one,
											  },
									]}
								>{`${change_24h.toFixed(1)}%`}</Text>
								<View
									style={{
										borderLeftColor: theme.colors.black_six,
										borderLeftWidth: 1,
										marginHorizontal: 8,
										marginVertical: 3,
									}}
								/>
								<Text
									style={{
										...theme.fonts.Nunito_Sans
											.Caption_M_SemiBold,
										color: '#727D8D',
									}}
								>
									{amount.toFixed(1)}
								</Text>
							</View>
						</View>
					);
				}}
			/>
		</TouchableOpacity>
	);
};

export default TokenCard;
