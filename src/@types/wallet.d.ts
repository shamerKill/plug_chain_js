export interface InWalletOptions {
	addressPrefix: string;
	chainId: string;
}

export interface InOnlineWalletOptions extends InWalletOptions {
	mainRpc: string; // 26657
	pvmRpc: string; // 8545
}