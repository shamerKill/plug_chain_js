import { EncodeObject, DirectSecp256k1HdWallet, DirectSecp256k1HdWalletOptions, makeSignDoc, makeSignBytes, AccountData } from '@shamer.lib/proto-signing';
import { InWalletOptions } from '../@types';
import { offlineWalletOptions } from '../config';


export class OfflineWallet {
	private _wallet: DirectSecp256k1HdWallet;
	private _options: InWalletOptions;
	private _accounts?: AccountData[];
	private get accounts () {
		return new Promise<AccountData[]>(async (resolve) => {
			if (this._accounts === undefined) {
				this._accounts = [...await this._wallet.getAccounts()];
			}
			resolve(this._accounts);
		});
	};
	
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
	public get account() { return this.accounts.then(res => res[0]); }
	public get isPrc20() { return this.account.then(res => res.algo === 'eth_secp256k1') };
	public async serialize(password: string) { return await this.wallet.serialize(password); }
}