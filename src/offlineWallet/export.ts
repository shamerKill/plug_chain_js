import { DirectSecp256k1HdWallet, DirectSecp256k1HdWalletOptions } from '@shamer.lib/proto-signing';
import { offlineWalletOptions } from '../config';
import { OfflineWallet } from './wallet';

async function _generate(length?: 12 | 15 | 18 | 21 | 24, options?: Partial<DirectSecp256k1HdWalletOptions>): Promise<OfflineWallet> {
	return new OfflineWallet(await DirectSecp256k1HdWallet.generate(length, options));
}
async function _fromMnemonic(mnemonic: string, options?: Partial<DirectSecp256k1HdWalletOptions>): Promise<OfflineWallet> {
	return new OfflineWallet(await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, options));
}

// Prc10 account
export function generatePrcX(length?: 12 | 15 | 18 | 21 | 24, options?: Partial<DirectSecp256k1HdWalletOptions>): Promise<OfflineWallet> {
	return _generate(length, { prefix: offlineWalletOptions.addressPrefix, accountType: 'default', ...options });
}

// Prc20 account
export function generatePrcXX(length?: 12 | 15 | 18 | 21 | 24, options?: Partial<DirectSecp256k1HdWalletOptions>): Promise<OfflineWallet> {
	return _generate(length, { prefix: offlineWalletOptions.addressPrefix, accountType: 'evm', ...options });
}

// mnemonic list to Prc10 wallet
export function byMnemonicX(mnemonic: string, options?: Partial<DirectSecp256k1HdWalletOptions>): Promise<OfflineWallet> {
	return _fromMnemonic(mnemonic, { prefix: offlineWalletOptions.addressPrefix, accountType: 'default', ...options });
}

// mnemonic list to Prc20 wallet
export function byMnemonicXX(mnemonic: string, options?: Partial<DirectSecp256k1HdWalletOptions>): Promise<OfflineWallet> {
	return _fromMnemonic(mnemonic, { prefix: offlineWalletOptions.addressPrefix, accountType: 'evm', ...options });
}

export async function bySerializeStr(encodeStr: string, password: string) {
	return new OfflineWallet(await DirectSecp256k1HdWallet.deserialize(encodeStr, password));
}