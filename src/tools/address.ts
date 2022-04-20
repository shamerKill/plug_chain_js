import {
  stripHexPrefix,
  toChecksumAddress,
} from '@rsksmart/rsk-utils';
import { bech32 } from 'bech32';

function makeChecksummedHexDecoder() {
  return (data: string) => {
    return Buffer.from(stripHexPrefix(data), 'hex');
  };
}

function makeChecksummedHexEncoder() {
  return (data: Buffer) =>
    toChecksumAddress(data.toString('hex'), null);
}

const hexChecksumChain = () => ({
  decoder: makeChecksummedHexDecoder(),
  encoder: makeChecksummedHexEncoder(),
});

function makeBech32Encoder(prefix: string) {
  return (data: Buffer) => bech32.encode(prefix, bech32.toWords(data));
}

function makeBech32Decoder() {
  return (data: string) => {
    const { words } = bech32.decode(data);
    return Buffer.from(bech32.fromWords(words));
  };
}

const bech32Chain = (prefix: string) => ({
  decoder: makeBech32Decoder(),
  encoder: makeBech32Encoder(prefix),
});


const ETH = hexChecksumChain();
const PLUG = bech32Chain('gx');

export const hexToPlug = (ethAddress: string) => {
  const data = ETH.decoder(ethAddress);
  return PLUG.encoder(data);
};

export const plugToHex = (plugAddress: string) => {
  const data = PLUG.decoder(plugAddress);
  return ETH.encoder(data);
};