import { Writer } from 'protobufjs/minimal';

export const bufferToHex = (data: Uint8Array, add0x = false): string => {
  let out = add0x ? '0x' : '';
  for (const byte of data) out += ('0' + byte.toString(16)).slice(-2);
  return out;
};

export const strToHex = (data: string): string => {
	return bufferToHex(Writer.create().uint32(10).string(data).finish());
};