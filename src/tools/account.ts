import { Pubkey } from '@cosmjs/amino';
import { Uint64 } from '@cosmjs/math';
import { toBase64 } from '@cosmjs/encoding';
import { Account } from '@cosmjs/stargate';

function uint64FromProto(input: number) {
  return Uint64.fromString(input.toString());
}

export function accountFromBaseAccount(input: Account): Account {
  const { address, pubkey, accountNumber, sequence } = input;
  let pubKey: Pubkey | null = null;
  if (pubkey && (pubkey as any).typeUrl === '/ethermint.crypto.v1.ethsecp256k1.PubKey') pubKey = accountPubKeyFormat(pubkey.value);
  return {
    address: address,
    pubkey: pubKey,
    accountNumber: uint64FromProto(accountNumber).toNumber(),
    sequence: uint64FromProto(sequence).toNumber(),
  };
}

export function accountPubKeyFormat(input: Uint8Array) {
  const value = toBase64(input);
  const pubkey: Pubkey = {
    type: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
    value,
  };
  return pubkey;
}