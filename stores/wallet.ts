import { defineStore } from 'pinia';
import type { Transaction, Wallet } from '~/services/walletService';

export const useWalletStore = defineStore('wallet', () => {
  const wallet = ref<Wallet | null>(null);
  const transactions = ref<Transaction[]>([]);
  const initialized = ref(false);

  function setWallet(next: Wallet | null): void { wallet.value = next; initialized.value = true; }
  function setTransactions(next: Transaction[]): void { transactions.value = next; initialized.value = true; }
  function clear(): void { wallet.value = null; transactions.value = []; initialized.value = false; }

  return { wallet, transactions, initialized, setWallet, setTransactions, clear };
});
