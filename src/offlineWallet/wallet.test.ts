import { offlineWalletOptions } from '../config';
import { OfflineWallet, byMnemonicX, byMnemonicXX } from ".";

describe('offlineWallet test', () => {
	const demoMnemonicStr = 'pitch text slow much leave myth absorb silent blossom mechanic again merge';
	let walletPrcX: OfflineWallet;
	let walletPrcXX: OfflineWallet;
	beforeAll(async () => {
		walletPrcX = await byMnemonicX(demoMnemonicStr);
		walletPrcXX = await byMnemonicXX(demoMnemonicStr);
	});


	test('default options config', async () => {
		expect(walletPrcX.options.addressPrefix).toBe(offlineWalletOptions.addressPrefix);
		expect(walletPrcXX.options.addressPrefix).toBe(offlineWalletOptions.addressPrefix);
	});
	test('setting options config', async () => {
		const demoPrefix = 'demo';
		const newWallet = new OfflineWallet(walletPrcXX.wallet, {
			addressPrefix: demoPrefix
		});
		expect(newWallet.options.addressPrefix).toBe(demoPrefix);
	});

	test('prc10 wallet account type', async () => {
		const account = await walletPrcX.account;
		expect(account.algo).toBe('secp256k1');
		expect(account.hexAddress).toBeUndefined();
		expect(account.address).toBe('gx1snsqaysv9j3y3eayv887af3paj3zwqvvhtsgdy');
		expect(account.pubkey).toEqual(new Uint8Array([
			2, 111, 245, 156, 197,  61,  38, 86,
			242, 246, 255, 220, 201, 170,  17, 81,
			66, 201, 135, 190, 236, 188, 135, 86,
			209, 133, 190, 143, 143, 137, 214, 44,
			50
		]));
	});
	test('prc20 wallet account type', async () => {
		const account = await walletPrcXX.account;
		expect(account.algo).toBe('eth_secp256k1');
		expect(account.hexAddress).toBe('0xaa776c8c890ff5c6faa71032bc401836638abfa5');
		expect(account.address).toBe('gx14fmkeryfpl6ud748zqetcsqcxe3c40a9ks0kc9');
		expect(account.pubkey).toEqual(new Uint8Array([
			3,  45,  51, 250, 114, 248, 107, 169,
			144,  48, 177, 219, 241, 198, 129,  25,
			106, 186, 129,  63, 159,  50, 214,  71,
			125, 156, 226, 158, 186, 185,  94, 127,
			202
		]));
	});

	test('wallet type', async () => {
		const typePrc20 = await walletPrcXX.isPrc20;
		expect(typePrc20).toBeTruthy();
		const typePrc10 = await walletPrcX.isPrc20;
		expect(typePrc10).toBeFalsy();
	});

	test('wallet encode for password', async () => {
		const encodeStrPrc20 = await walletPrcXX.serialize('123456');
		const rootPrc20 = JSON.parse(encodeStrPrc20);
		expect(rootPrc20.type).toBe('directsecp256k1hdwallet-v1');
		const encodeStrPrc10 = await walletPrcX.serialize('123456');
		const rootPrc10 = JSON.parse(encodeStrPrc10);
		expect(rootPrc10.type).toBe('directsecp256k1hdwallet-v1');
	});
});