/* eslint-disable no-case-declarations */
import * as solanaWeb3 from '@solana/web3.js';
import * as Random from 'expo-random';
import { ethers } from 'ethers';
import { Buffer } from 'buffer';
import * as ed25519 from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Account, Connection, PublicKey, Keypair } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { derivePath } from 'ed25519-hd-key';
import * as bip32 from 'bip32';
import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
	'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);

async function findAssociatedTokenAddress(
	walletAddress: PublicKey,
	tokenMintAddress: PublicKey,
): Promise<PublicKey> {
	return (
		await PublicKey.findProgramAddress(
			[
				walletAddress.toBuffer(),
				TOKEN_PROGRAM_ID.toBuffer(),
				tokenMintAddress.toBuffer(),
			],
			SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
		)
	)[0];
}

function normalizeNumber(number: number) {
	return number
		?.toFixed(2)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const DERIVATION_PATH = {
	deprecated: undefined,
	bip44: 'bip44',
	bip44Change: 'bip44Change',
	bip44Root: 'bip44Root', // Ledger only.
};

function getAccountFromSeed(
	seed,
	walletIndex,
	dPath = undefined,
	accountIndex = 0,
) {
	const derivedSeed = deriveSeed(seed, walletIndex, dPath, accountIndex);
	return new Account(nacl.sign.keyPair.fromSeed(derivedSeed).secretKey);
}

const deriveSeed = (
	seed: string,
	walletIndex: number,
	derivationPath: string,
	accountIndex: number,
): Buffer | undefined => {
	const path44Change = `m/44'/501'/${walletIndex}'/0'`;
	return ed25519.derivePath(path44Change, Buffer.from(seed, 'hex')).key;
};

const deriveSeed2 = (
	seed: string,
	walletIndex: number,
	derivationPath: string,
	accountIndex: number,
): Buffer | undefined => {
	const path44Change = `m/44'/501'/${walletIndex}'/0'`;
	return ed25519.derivePath(path44Change, Buffer.from(seed, 'hex')).key;
};

// export const DERIVATION_PATH = {
// 	bip44Change: 'bip44Change',
// };

const generateMnemonic = async () => {
	const randomBytes = await Random.getRandomBytesAsync(32);
	const mnemonic = ethers.utils.entropyToMnemonic(randomBytes);
	return mnemonic;
};

const mnemonicToSeed = async (mnemonic: string) => {
	const bip39 = await import('bip39');
	const seed = await bip39.mnemonicToSeed(mnemonic);
	return Buffer.from(seed).toString('hex');
};

const accountFromSeed = (
	seed: string,
	walletIndex: number,
	derivationPath: string,
	accountIndex: 0,
) => {
	const derivedSeed = deriveSeed(
		seed,
		walletIndex,
		derivationPath,
		accountIndex,
	);
	const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);

	const acc = new solanaWeb3.Keypair(keyPair);
	return acc;
};

const maskedAddress = (address: string) => {
	if (!address) return;
	return `${address.slice(0, 8)}...${address.slice(address.length - 8)}`;
};

const copyToClipboard = async (
	copiedText: string,
	copiedTextName = 'Address',
) => {
	Clipboard.setString(copiedText);
	Alert.alert(`${copiedTextName} Copied!`, copiedText, [
		{ text: 'Okay', style: 'destructive' },
	]);
};

export {
	generateMnemonic,
	mnemonicToSeed,
	accountFromSeed,
	maskedAddress,
	deriveSeed,
	deriveSeed2,
	findAssociatedTokenAddress,
	getAccountFromSeed,
	DERIVATION_PATH,
	normalizeNumber,
	copyToClipboard,
};
