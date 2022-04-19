import {
	generatePrcX, generatePrcXX, byMnemonicX, byMnemonicXX, bySerializeStr,
} from './export';

describe('test OfflineWallet generate function', () => {
	const demoMnemonicStr = 'pitch text slow much leave myth absorb silent blossom mechanic again merge';
	const encodeStr = '{"type":"directsecp256k1hdwallet-v1","kdf":{"algorithm":"argon2id","params":{"outputLength":32,"opsLimit":24,"memLimitKib":12288}},"encryption":{"algorithm":"xchacha20poly1305-ietf"},"data":"IDCSNPYT/pWW6YhvigvtJXNZY0ED7YtMIMDiy8VYerfzdjSj3quGGPocn/DJZbPTjGVQR/JuJGGD4VmbVb+MOfR1liZTuf5hSRPwhXBFmDg+227f+3YI25cb2UGThDwkeMK99vLcoEVcIs7Zlr5FPT0gHcW2ZoKoTEZXchqgoOfRc1qeaPZg1Yd4iPscpe8WAwy5nwn+52Od35UO8Bm+lyX+hX0m4XIPtQSoHCXGNc91q05M/2xLvsqgyhmHhRpNu6nKwNpnVqFbW+bVc2Y="}';
	const encodePass = '123456';

	test('create a new wallet at Prc10', async () => {
		const wallet = await generatePrcX();
		expect(wallet.mnemonicList.length).toBe(12);
	});
	test('create a new wallet at Prc20', async () => {
		const wallet = await generatePrcXX();
		expect(wallet.mnemonicList.length).toBe(12);
	});
	test('back wallet at Prc10 with mnemonic list string', async () => {
		const newWallet = await byMnemonicX(demoMnemonicStr);
		expect(newWallet.wallet.mnemonic).toBe(demoMnemonicStr);
		expect(newWallet.mnemonicList).toEqual(demoMnemonicStr.split(' '));
	});
	test('back wallet at Prc20 with mnemonic list string', async () => {
		const newWallet = await byMnemonicXX(demoMnemonicStr);
		expect(newWallet.mnemonicList).toEqual(demoMnemonicStr.split(' '));
	});

	test('decode account', async () => {
		const newWallet = await byMnemonicXX(demoMnemonicStr);
		expect(newWallet.mnemonicStr).toBe((await bySerializeStr(encodeStr, encodePass)).mnemonicStr);
		expect(await newWallet.account).toEqual(await (await bySerializeStr(encodeStr, encodePass)).account);
	});
});