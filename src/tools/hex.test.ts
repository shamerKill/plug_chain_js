import { bufferToHex, strToHex } from './hex';

describe('test tool hex', () => {
	
	it('buffer to hex', () => {
		const hexStr = bufferToHex(new Uint8Array([0, 10, 20, 30]));
		expect(hexStr).toBe('000a141e');
	});

	it('buffer to hex with 0x', () => {
		const hexStr = bufferToHex(new Uint8Array([0, 10, 20, 30]), true);
		expect(hexStr).toBe('0x000a141e');
	});

	it('string to hex', () => {
		const hexStr = strToHex('gx1snsqaysv9j3y3eayv887af3paj3zwqvvhtsgdy');
		expect(hexStr).toBe('0a29677831736e737161797376396a3379336561797638383761663370616a337a77717676687473676479');
	});
});