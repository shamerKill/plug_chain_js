import { Writer } from 'protobufjs/minimal';

export const bufferToHex = (data: Uint8Array): string => {
  let out = '';
  for (const byte of data) out += ('0' + byte.toString(16)).slice(-2);
  return out;
};

export const strToHex = (data: string): string => {
	return bufferToHex(Writer.create().uint32(10).string(data).finish());
};