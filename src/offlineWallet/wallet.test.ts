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

	test('test prc20 sign chain tx', async () => {
		const signRaw = await walletPrcXX.signTx({
			account: {
				address: (await walletPrcXX.account).address,
				pubkey: null,
				accountNumber: 1,
				sequence: 1,
			},
			messages: [{
				typeUrl: '/cosmos.bank.v1beta1.MsgSend',
				value: {
					fromAddress: (await walletPrcXX.account).address,
					toAddress: 'gx1snsqaysv9j3y3eayv887af3paj3zwqvvhtsgdy',
					amount: [ { amount: '1000000', denom: 'uplugcn' } ],
				},
			}],
			fee: {
				gas: '200000',
				amount: [{
					denom: 'uplugcn',
					amount: '200',
				}],
			},
			chainId: 'plugchain_520-1'
		});
		const rawTx = 'Co0BCooBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmoKKWd4MTRmbWtlcnlmcGw2dWQ3NDh6cWV0Y3NxY3hlM2M0MGE5a3Mwa2M5EilneDFzbnNxYXlzdjlqM3kzZWF5djg4N2FmM3BhajN6d3F2dmh0c2dkeRoSCgd1cGx1Z2NuEgcxMDAwMDAwEnEKWQpPCigvZXRoZXJtaW50LmNyeXB0by52MS5ldGhzZWNwMjU2azEuUHViS2V5EiMKIQMtM/py+GupkDCx2/HGgRlquoE/nzLWR32c4p66uV5/yhIECgIIARgBEhQKDgoHdXBsdWdjbhIDMjAwEMCaDBpBVADZKf0Ei+r8dCOZKu6NbTh9ZbDTGUbDjJsFDIxGkghmNkcEfVs5qTGKce96FuHpIyH/4YfsPkkUh6Ei1bTtxRs='
		expect(signRaw).toBe(rawTx);
	});

	test('test prc10 sign chain tx', async () => {
		const signRaw = await walletPrcX.signTx({
			account: {
				address: (await walletPrcX.account).address,
				pubkey: null,
				accountNumber: 1,
				sequence: 1,
			},
			messages: [{
				typeUrl: '/cosmos.bank.v1beta1.MsgSend',
				value: {
					fromAddress: (await walletPrcX.account).address,
					toAddress: 'gx1snsqaysv9j3y3eayv887af3paj3zwqvvhtsgdy',
					amount: [ { amount: '1000000', denom: 'uplugcn' } ],
				},
			}],
			fee: {
				gas: '200000',
				amount: [{
					denom: 'uplugcn',
					amount: '200',
				}],
			},
		});
		const rawTx = 'Co0BCooBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmoKKWd4MXNuc3FheXN2OWozeTNlYXl2ODg3YWYzcGFqM3p3cXZ2aHRzZ2R5EilneDFzbnNxYXlzdjlqM3kzZWF5djg4N2FmM3BhajN6d3F2dmh0c2dkeRoSCgd1cGx1Z2NuEgcxMDAwMDAwEmgKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQJv9ZzFPSZW8vb/3MmqEVFCyYe+7LyHVtGFvo+PidYsMhIECgIIARgBEhQKDgoHdXBsdWdjbhIDMjAwEMCaDBpAOZuuyK67cHsH67QSbTp68D3C+iSexy2+Wpbwku08bcluSZ8jjTf4/JlcDENb/TYf33nGVYL6Fc6a4Tj4N5y6mA=='
		expect(signRaw).toBe(rawTx);
	});
});
