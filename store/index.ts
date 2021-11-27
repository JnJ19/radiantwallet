import {
	Generic,
	generic,
	Computed,
	computed,
	createStore,
	action,
	Action,
	persist,
} from 'easy-peasy';
import storage from '../storage';

const store = createStore({
	account: 'hello',
	passcode: '1234',
	updatePasscode: action((state, payload) => {
		state.passcode = payload;
	}),
	updateAccount: action((state, payload) => {
		state.account = payload;
	}),
	ownedTokens: '',
	allTokens: '',
	setOwnedTokens: action((state, payload) => {
		state.ownedTokens = payload;
	}),
	setAllTokens: action((state, payload) => {
		state.allTokens = payload;
	}),
	selectedWallet: 0,
	setSelectedWallet: action((state, payload) => {
		state.selectedWallet = payload;
	}),
	activeSubWallet: 0,
	setActiveSubWallet: action((state, payload) => {
		state.activeSubWallet = payload;
	}),
	subWallets: '',
	setSubWallets: action((state, payload) => {
		state.subWallets = payload;
	}),
	subWalletTokensArray: '',
	setSubWalletTokensArray: action((state, payload) => {
		state.subWalletTokensArray = payload;
	}),
	finalSubWallets: '',
	setFinalSubWallets: action((state, payload) => {
		state.finalSubWallets = payload;
	}),
});

// const store = createStore<WalletModel>(
//   persist(
//     {
//       wallet: generic({}),
//       accounts: [],
//       hasWallet: computed(
//         (state) =>
//           Object.keys(state.wallet).length !== 0 && state.accounts.length !== 0
//       ),
//       addWallet: action((state, payload) => {
//         state.wallet = {
//           passcode: payload.passcode,
//           mnemonic: payload.mnemonic,
//           seed: payload.seed,
//         };
//       }),
//       addDefaultAccount: action((state, payload) => {
//         state.accounts.push({
//           index: 0,
//           title: "default",
//           derivationPath: "bip44Change",
//         });
//       }),
//       addAccount: action((state, payload) => {
//         state.accounts.push({
//           index: payload.index,
//           title: payload.title,
//           derivationPath: "bip44Change",
//         });
//       }),
//     },
//     {
//       storage: storage,
//     }
//   )
// );

export default store;
