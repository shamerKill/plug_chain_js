import { InOnlineWalletOptions } from "src/@types/wallet";
import { InWalletOptions } from "../@types";

export const offlineWalletOptions: InWalletOptions = {
	addressPrefix: 'gx',
	chainId: '520',
};

export const onlineWalletOptions: InOnlineWalletOptions = {
	...offlineWalletOptions,
	mainRpc: '',
	pvmRpc: '',
};