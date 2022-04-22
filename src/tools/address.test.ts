import {
	plugToHex, hexToPlug, isPlugAddress,
} from './address';


describe('test address exchange', () => {
	const plugAddress = 'gx1q8y5uvvasdqgnu86g4286zzg86tqcpqp4jc7z9';
	const hexAddress = '0x01C94e319d834089f0fA45547d08483e960c0401';
	it('test plug address to hex Address', () => {
		expect(plugToHex(plugAddress)).toBe(hexAddress);
	});
	it('test hex address to plug Address', () => {
		expect(hexToPlug(hexAddress)).toBe(plugAddress);
	});
	it('test plug address match', () => {
		expect(isPlugAddress(hexAddress)).toBeFalsy();
		expect(isPlugAddress(plugAddress)).toBeTruthy();
		expect(isPlugAddress()).toBeFalsy();
	});
});