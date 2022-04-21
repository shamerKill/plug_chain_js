import { DirectSecp256k1HdWallet } from '@shamer.lib/proto-signing';
import { onlineWalletOptions } from '../config';
import { InOnlineWalletOptions } from '../@types';
import { OfflineWallet } from '../offlineWallet';

export class OnlineWallet extends OfflineWallet {
	private get hasMainPrc () { return this._options.mainRpc; }
	private get hasPvmPrc () { return this._options.pvmRpc; }

	protected _options: InOnlineWalletOptions;
	
	constructor(
		wallet: DirectSecp256k1HdWallet,
		options?: Partial<InOnlineWalletOptions>
	) {
		super(wallet, options);
		this._options = {
			...onlineWalletOptions,
			...options,
		};
	}
}