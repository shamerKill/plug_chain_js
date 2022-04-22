import { EncodeObject, DirectSecp256k1HdWallet, makeSignDoc, makeSignBytes, AccountData, makeAuthInfoBytes } from '@shamer.lib/proto-signing';
import { Account, SigningStargateClient, StdFee } from '@cosmjs/stargate';
import { fromBase64 } from '@cosmjs/encoding';
import { Int53 } from '@cosmjs/math';
import { Secp256k1 } from '@cosmjs/crypto';
import { fromByteArray } from 'base64-js';
import { keccak_256 } from '@noble/hashes/sha3';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { sha3, isHex, stripHexPrefix, toTwosComplement, hexToBytes, bytesToHex, toHex } from 'web3-utils';
import { Transaction, TxData } from '@ethereumjs/tx';
import Common, { Hardfork } from '@ethereumjs/common';
import { InWalletOptions } from '../@types';
import { offlineWalletOptions } from '../config';
import { accountPubKeyFormat, bufferToHex, isPlugAddress, plugToHex} from '../tools';
import { PubKey } from '../../proto';

export class OfflineWallet {
	protected _wallet: DirectSecp256k1HdWallet;
	protected _options: InWalletOptions;
	protected _accounts?: AccountData[];
	protected get accounts () {
		return new Promise<AccountData[]>(async (resolve) => {
			if (this._accounts === undefined) {
				this._accounts = [...await this._wallet.getAccounts()];
			}
			resolve(this._accounts);
		});
	};
	protected get _hexPrivateKey (): Promise<string> {
		return (this._wallet as any).getAccountsWithPrivkeys().then((res: any[]) => {
			return bufferToHex(res[0].privkey, true);
		});
	}

	constructor(
		wallet: DirectSecp256k1HdWallet,
		options?: Partial<InWalletOptions>
	) {
		this._wallet = wallet;
		this._options = {
			...offlineWalletOptions,
			...options,
		};
	}

	public get wallet () { return this._wallet; }
	public get options() { return this._options; }
	public get mnemonicStr()  { return this._wallet.mnemonic; }
	public get mnemonicList() { return this.mnemonicStr.split(' '); }
	/**
	 * get wallet first account
	**/
	public get account() { return this.accounts.then(res => res[0]); }
	public get isPrc20() { return this.account.then(res => res.algo === 'eth_secp256k1') };
	/**
	 * encrypted wallet to string with password
	**/
	public async serialize(password: string) { return await this.wallet.serialize(password); }
	/**
	 * signed info with account's privateKey to hash
	**/
	public async signTx(
		{account, messages, fee, memo = '', chainId = this._options.chainId }:
		{ account: Account, messages: readonly EncodeObject[], fee: StdFee, memo?: string, chainId?: string }
	): Promise<string> {
		const walletClient = await SigningStargateClient.offline(this._wallet as any);
		let result: TxRaw;
		if (await this.isPrc20) {
			const memPubkey = Uint8Array.from([ 10, 33, ...(await this.account).pubkey ]);
			const accountPubKey = account.pubkey || accountPubKeyFormat(memPubkey);
			const [ accountNumber, sequence ] = [ account.accountNumber, account.sequence ];
			const pubkeyProto = PubKey.fromPartial({
				key: fromBase64(accountPubKey.value),
			});
			const pubkey = Any.fromPartial({
				typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey',
				value: pubkeyProto.key,
			});
			const txBodyEncodeObject = {
				typeUrl: '/cosmos.tx.v1beta1.TxBody',
				value: {
					messages: messages,
					memo: memo,
				},
			};
			const txBodyBytes = walletClient.registry.encode(txBodyEncodeObject);
			const gasLimit = Int53.fromString(fee.gas).toNumber();
			const authInfoBytes = makeAuthInfoBytes(
				[ { pubkey, sequence } ], fee.amount, gasLimit
			);
			const signDoc = makeSignDoc(
				txBodyBytes, authInfoBytes, chainId, accountNumber,
			);
			const signBytes = makeSignBytes(signDoc);
			const hashedMessage = keccak_256(signBytes);
			const accounts = (await (this._wallet as any).getAccountsWithPrivkeys());
			const signature = await Secp256k1.createSignature(hashedMessage, accounts[0].privkey);
			const signatureBytes = new Uint8Array([ ...signature.r(32), ...signature.s(32), (signature.recovery + 27) ]);
			result = TxRaw.fromPartial({
				bodyBytes: signDoc.bodyBytes,
				authInfoBytes: signDoc.authInfoBytes,
				signatures: [ signatureBytes ],
			});
		} else {
			result = await (walletClient.sign(
				account.address, [ ...messages ], fee, memo, { accountNumber: account.accountNumber, sequence: account.sequence, chainId: chainId },
			));
		}
		const raw = TxRaw.encode(result).finish();
		const rawTx = fromByteArray(raw);
		return rawTx;
	}
	/**
	 * pvm contract call data to hex
	**/
	public getContractData({ callFunc, callArgs }: { callFunc: string, callArgs: string[] }): string {
		let data = sha3(callFunc)?.slice(0, 10)!;
		for (let arg of callArgs) {
			if (isPlugAddress(arg)) arg = plugToHex(arg);
			if (isHex(arg)) data += stripHexPrefix(toTwosComplement(arg));
			else data += stripHexPrefix(toTwosComplement(toHex(arg)??''));
		}
		return data;
	}
	/**
	 * pvm sign transfer data
	**/
	public async signContractData(
		{ callFunc, callArgs, config }: { callFunc: string, callArgs: string[], config?: TxData }
	) {
		const _config = { ...config };
		_config.data = this.getContractData({ callFunc, callArgs });
		if (typeof _config.to === 'string' && isPlugAddress(_config.to)) _config.to = plugToHex(_config.to);
		const tx = new Transaction(_config, {
			common: Common.custom({
				chainId: parseInt(this._options.chainId),
				networkId: parseInt(this._options.chainId),
				defaultHardfork: Hardfork.Petersburg,
			}, {
				baseChain: 'mainnet'
			}),
		});
		return bytesToHex(Array.from(tx.sign(Buffer.from(hexToBytes(await this._hexPrivateKey))).serialize()));
	}
}