import { generatePrcXX, OnlineWallet } from './main';

describe('test main export class type', () => {
	test('test offlineWallet exports function', () => {
		const offlineWallet = generatePrcXX();
	});
	test('test onlineWallet exports function', () => {
		const onlineWallet = new OnlineWallet();
	});
});