import React, { memo, useState, useEffect } from 'react';
import { Background, Button } from '../components';
import { Navigation } from '../types';
import {
	Text,
	View,
	Image,
	StyleSheet,
	TouchableOpacity,
	TextInput as TextInputRN,
} from 'react-native';
import { theme } from '../core/theme';
const {
	colors,
	fonts: { Azeret_Mono, Nunito_Sans },
} = theme;
import { SubPageHeader } from '../components';
import { useStoreState, useStoreActions } from '../hooks/storeHooks';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { web3, Wallet } from '@project-serum/anchor';
import { Account, Connection, PublicKey, Keypair } from '@solana/web3.js';
import {
	findAssociatedTokenAddress,
	getAccountFromSeed,
	DERIVATION_PATH,
	normalizeNumber,
	deriveSeed2,
} from '../utils';
import * as SecureStore from 'expo-secure-store';
import * as ed25519 from 'ed25519-hd-key';
import nacl from 'tweetnacl';

type Props = {
	navigation: Navigation;
	route: Object;
};

const SendScreen = ({ navigation, route }: Props) => {
	console.log('route . params', route.params);
	const token = route.params;
	const [tradeAmount, setTradeAmount] = useState('0');
	const [recipientAddress, setRecipientAddress] = useState('');
	const ownedTokens = useStoreState((state) => state.ownedTokens);
	const allTokens = useStoreState((state) => state.allTokens);
	const [filteredTo, setFilteredTo] = useState('');
	const passcode = useStoreState((state) => state.passcode);
	const selectedWallet = useStoreState(
		(state) => state.selectedWallet,
		(prev, next) => prev.selectedWalle === next.selectedWallet,
	);

	async function initiateTransfer() {
		const url = 'https://solana-api.projectserum.com';
		const connection = new Connection(url);

		// let mnemonic = await SecureStore.getItemAsync(passcode);
		// Generate a random mnemonic (12 words) (uses crypto.randomBytes under the hood)

		const bip39 = await import('bip39');
		var mnemonic = bip39.generateMnemonic();

		// Convert 12 word mnemonic to 32 byte seed

		// bip39.mnemonicToSeed(mnemonic);
		console.log('mnemonic: ', mnemonic);

		const seed = await bip39.mnemonicToSeed(mnemonic); //returns 64 byte array
		// const newKeyPair = nacl.sign.keyPair.fromSeed(seed.slice(0, 32));
		// const newKeyPair = nacl.sign.keyPair.fromSeed(seed);
		console.log('seed: ', seed);
		// const newKeyPair = Keypair.fromSeed(seed);
		// const newKeyPair = ed25519.generateKeyPair(seed);
		const newAccount = getAccountFromSeed(
			seed,
			selectedWallet,
			DERIVATION_PATH.bip44Change,
		);
		console.log('newAccount: ', newAccount);

		console.log('wallet', Wallet);
		console.log('web3', web3);

		// const wallet = new Wallet(newKeyPair);
		const publickey = newAccount.publicKey;
		console.log('publickey: ', publickey);

		transfer(
			token.mint,
			newAccount,
			recipientAddress,
			connection,
			parseFloat(tradeAmount),
		);
	}

	async function transfer(
		tokenMintAddress: string,
		wallet,
		to: string,
		connection: web3.Connection,
		amount: number,
	) {
		const mintPublicKey = new web3.PublicKey(tokenMintAddress);
		console.log('mintPublicKey: ', mintPublicKey);
		const mintToken = new Token(
			connection,
			mintPublicKey,
			TOKEN_PROGRAM_ID,
			wallet.secretKey, // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
		);
		console.log('mintToken: ', mintToken);

		const fromTokenAccount =
			await mintToken.getOrCreateAssociatedAccountInfo(wallet.publicKey);
		console.log('fromTokenAccount: ', fromTokenAccount);

		const destPublicKey = new web3.PublicKey(to);
		console.log('destPublicKey: ', destPublicKey);

		// Get the derived address of the destination wallet which will hold the custom token
		const associatedDestinationTokenAddr =
			await Token.getAssociatedTokenAddress(
				mintToken.associatedProgramId,
				mintToken.programId,
				mintPublicKey,
				destPublicKey,
			);

		console.log(
			'associatedDestinationTokenAddr: ',
			associatedDestinationTokenAddr,
		);
		const receiverAccount = await connection.getAccountInfo(
			associatedDestinationTokenAddr,
		);
		console.log('receiverAccount: ', receiverAccount);

		const instructions: web3.TransactionInstruction[] = [];
		console.log('instructions: ', instructions);

		if (receiverAccount === null) {
			instructions.push(
				Token.createAssociatedTokenAccountInstruction(
					mintToken.associatedProgramId,
					mintToken.programId,
					mintPublicKey,
					associatedDestinationTokenAddr,
					destPublicKey,
					wallet.publicKey,
				),
			);
		}

		instructions.push(
			Token.createTransferInstruction(
				TOKEN_PROGRAM_ID,
				fromTokenAccount.address,
				associatedDestinationTokenAddr,
				wallet.publicKey,
				[],
				amount,
			),
		);

		const transaction = new web3.Transaction().add(...instructions);
		console.log('transaction: ', transaction);
		transaction.feePayer = wallet.publicKey;
		transaction.recentBlockhash = (
			await connection.getRecentBlockhash()
		).blockhash;

		const transactionSignature = await connection.sendRawTransaction(
			transaction.serialize(),
			{ skipPreflight: true },
		);
		console.log('transactionSignature: ', transactionSignature);

		await connection.confirmTransaction(transactionSignature);

		navigation.navigate('Send Success', {
			tradeAmount,
			token,
			recipientAddress,
		});
	}

	function addNumber(numberString: string) {
		if (tradeAmount === '0') {
			const replaceZero = tradeAmount.slice(0, -1);
			const newAmount = replaceZero.concat(numberString);
			setTradeAmount(newAmount);
		} else {
			const newAmount = tradeAmount.concat(numberString);
			setTradeAmount(newAmount);
		}
	}

	function removeNumber() {
		if (tradeAmount.length === 1) {
			setTradeAmount('0');
		} else {
			const newAmount = tradeAmount.slice(0, -1);
			setTradeAmount(newAmount);
		}
	}

	return (
		<Background dismissKeyboard={true}>
			<SubPageHeader
				subText={`$${normalizeNumber(
					token.amount * token.price,
				)} available`}
				backButton
			>
				Send {token.name}{' '}
			</SubPageHeader>
			<View>
				<Text style={{ ...styles.bigNumber, alignSelf: 'center' }}>
					${tradeAmount}
				</Text>
			</View>
			<View
				style={{
					height: 64,
					borderWidth: 1,
					borderColor: theme.colors.black_seven,
					borderRadius: 18,
					padding: 16,
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<Image
					source={require('../assets/icons/wallet_plain.png')}
					style={{ width: 24, height: 24, marginRight: 8 }}
				/>

				<TextInputRN
					style={{
						borderColor: 'black',
						borderWidth: 0,
						...theme.fonts.Nunito_Sans.Body_M_Regular,
					}}
					onChangeText={(text: string) => setRecipientAddress(text)}
					value={recipientAddress}
					placeholder="Recipient's Wallet Address"
					keyboardType="default"
				/>
			</View>
			<View>
				<View style={styles.numRow}>
					<TouchableOpacity
						onPress={() => addNumber('1')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>1</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => addNumber('2')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>2</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => addNumber('3')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>3</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.numRow}>
					<TouchableOpacity
						onPress={() => addNumber('4')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>4</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => addNumber('5')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>5</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => addNumber('6')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>6</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.numRow}>
					<TouchableOpacity
						onPress={() => addNumber('7')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>7</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => addNumber('8')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>8</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => addNumber('9')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>9</Text>
					</TouchableOpacity>
				</View>
				<View style={{ ...styles.numRow, marginBottom: 0 }}>
					<TouchableOpacity
						onPress={() => addNumber('.')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>.</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => addNumber('0')}
						style={styles.numberContainer}
					>
						<Text style={styles.mediumNumber}>0</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => removeNumber()}
						style={styles.numberContainer}
					>
						{/* <Text style={styles.mediumNumber}>3</Text> */}
						<Image
							source={require('../assets/icons/arrow-left-big.png')}
							style={{ width: 40, height: 40 }}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<View style={{ marginBottom: 40 }}>
				<Button
					onPress={() => {
						if (tradeAmount !== '0' && recipientAddress !== '') {
							initiateTransfer();
						}
					}}
				>
					Send ${tradeAmount}
				</Button>
			</View>
		</Background>
	);
};

const styles = StyleSheet.create({
	tableLabel: {
		fontSize: 14,
		color: '#727D8D',
	},
	tableData: {
		fontSize: 17,
		color: colors.primary,
	},
	bigNumber: {
		fontSize: 84,
		fontFamily: 'Nunito Sans',
		fontWeight: '400',
		color: colors.black_two,
	},
	mediumNumber: {
		fontSize: 48,
		fontFamily: 'Nunito Sans',
		fontWeight: '400',
		color: colors.black_one,
	},
	numberContainer: {
		width: 56,
		height: 66,
		justifyContent: 'center',
		alignItems: 'center',
	},
	toFrom: {
		...Nunito_Sans.Caption_M_Regular,
		color: colors.black_five,
		marginBottom: 4,
	},
	swapTokens: {
		...Nunito_Sans.Body_M_Regular,
		color: colors.black_two,
	},
	swapContainer: {
		borderColor: colors.border,
		borderWidth: 1,
		borderRadius: 18,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	numRow: {
		flexDirection: 'row',
		alignSelf: 'stretch',
		justifyContent: 'space-between',
		marginHorizontal: 16,
		marginBottom: 16,
	},
});

export default memo(SendScreen);
