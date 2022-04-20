import {
	accountFromBaseAccount, accountPubKeyFormat
} from './account';

describe('test account tool', () => {
	it('test base account type', () => {
		const account = accountFromBaseAccount({
			address: 'gx14fmkeryfpl6ud748zqetcsqcxe3c40a9ks0kc9',
			accountNumber: 1,
			sequence: 1,
			pubkey: null,
		});
		expect(account).toEqual({
			address: 'gx14fmkeryfpl6ud748zqetcsqcxe3c40a9ks0kc9',
			pubkey: null,
			accountNumber: 1,
			sequence: 1
		});
	});
	it('test ethermint base account type', () => {
		const account = accountFromBaseAccount({
			address: 'gx14fmkeryfpl6ud748zqetcsqcxe3c40a9ks0kc9',
			accountNumber: 1,
			sequence: 1,
			pubkey: {
				typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
				value: new Uint8Array([10, 33, 3, 45, 51, 250, 114, 248, 107, 169, 144, 48, 177, 219, 241, 198, 129, 25, 106, 186, 129, 63, 159, 50, 214, 71, 125, 156, 226, 158, 186, 185, 94, 127, 202])
			} as any,
		});
		expect(account).toEqual({
			address: 'gx14fmkeryfpl6ud748zqetcsqcxe3c40a9ks0kc9',
			pubkey: {
				type: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
				value: 'CiEDLTP6cvhrqZAwsdvxxoEZarqBP58y1kd9nOKeurlef8o='
			},
			accountNumber: 1,
			sequence: 1
		});
	});
	it('test ethermint account pubKey', () => {
		const pubKey = accountPubKeyFormat(new Uint8Array([10, 33, 3, 45, 51, 250, 114, 248, 107, 169, 144, 48, 177, 219, 241, 198, 129, 25, 106, 186, 129, 63, 159, 50, 214, 71, 125, 156, 226, 158, 186, 185, 94, 127, 202]));
		expect(pubKey).toEqual({
			type: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
			value: 'CiEDLTP6cvhrqZAwsdvxxoEZarqBP58y1kd9nOKeurlef8o='
		});
	});
});