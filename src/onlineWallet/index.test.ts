import { byMnemonicX, byMnemonicXX, OfflineWallet } from '../offlineWallet';
import { OnlineWallet } from '.';

describe('test OnlineWallet', () => {
	const demoMnemonicStr = 'pitch text slow much leave myth absorb silent blossom mechanic again merge';
	let walletPrcX: OnlineWallet;
	let walletPrcXX: OnlineWallet;
	beforeAll(async () => {
		walletPrcX = new OnlineWallet((await byMnemonicX(demoMnemonicStr)).wallet);
		walletPrcXX = new OnlineWallet((await byMnemonicXX(demoMnemonicStr)).wallet);
	});
	test('', () => {});
});
