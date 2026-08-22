<template>
    <div class="container" dir="rtl">
      <div class="title">
        <h1 class="title">کیف پول</h1>
        <img src="/icons/wallet.png" alt="" />
      </div>
    </div>

    <div class="space-y-4" dir="rtl">
      <!-- Wallet Balance Card -->
      <div class="premium-card border border-gray-100 p-6">
        <SharedAsyncState
          v-if="walletLoading"
          state="loading"
          :skeleton-rows="1" />
        <SharedAsyncState
          v-else-if="walletError"
          state="error"
          :message="walletError"
          @retry="fetchWallet" />
        <div v-else class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-800">موجودی کیف پول</h2>
          <div class="text-3xl font-bold text-blue-600">
            {{ wallet?.balance ?? 0 }} تومان
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div
        class="actions flex justify-between items-center mb-4 bg-white rounded-field py-2 px-4">
        <div class="flex gap-2">
          <ActionButton
            tone="primary"
            v-if="canCreate"
            @click="openCreditModal()"
            class="text-sm">
            + شارژ کیف پول
          </ActionButton>
          <ActionButton
            tone="destructive"
            v-if="canCreate"
            @click="openDebitModal()"
            class="text-sm">
            - برداشت
          </ActionButton>
        </div>
      </div>

      <!-- Transaction History Table -->
      <div class="premium-card border border-gray-100 overflow-hidden">
        <SharedAsyncState
          v-if="transactionsLoading"
          state="loading"
          :skeleton-rows="5" />
        <SharedAsyncState
          v-else-if="transactionsError"
          state="error"
          :message="transactionsError"
          @retry="fetchTransactions" />
        <template v-else>
          <UTable :rows="filteredTransactions" :columns="walletTransactionColumns">
          <template #createdAt-data="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
          <template #type-data="{ row }">
            <StatusPill
              :label="row.type === 'credit' ? 'شارژ' : 'برداشت'"
              :semantic="row.type === 'credit' ? 'success' : 'danger'"
              size="compact" />
          </template>
          <template #amount-data="{ row }">
            <span class="font-medium">{{ row.amount }} تومان</span>
          </template>
          <template #description-data="{ row }">
            <span class="text-gray-700 truncate max-w-[200px] block">
              {{ row.description || "—" }}
            </span>
          </template>
          <template #balanceAfter-data="{ row }">
            {{ row.balanceAfter || "—" }} تومان
          </template>
          </UTable>
          <SharedAsyncState
            v-if="filteredTransactions.length === 0"
            state="empty"
            title="تراکنشی یافت نشد"
            message="هنوز تراکنشی برای این کیف پول ثبت نشده است." />
        </template>
      </div>

      <!-- Credit Modal -->
      <BaseModal v-if="showCreditModal" @close="closeCreditModal">
        <div class="w-full max-w-md mx-auto space-y-4" dir="rtl">
          <h2 class="text-lg font-bold">شارژ کیف پول</h2>
          <form @submit.prevent="creditWalletHandler" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">مبلغ (تومان)</label>
              <UInput v-model.number="creditForm.amount" type="number" min="0" required />
            </div>

            <!-- <div>
              <label class="block text-sm font-medium mb-1"
                >شرح (اختیاری)</label
              >
              <textarea
                v-model="creditForm.description"
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div> -->

            <div
              v-if="errorMsg"
              class="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
              {{ errorMsg }}
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <ActionButton
                tone="secondary"
                type="button"
                @click="closeCreditModal"
                class="text-sm">
                انصراف
              </ActionButton>
              <ActionButton
                tone="primary"
                type="submit"
                :disabled="creditLoading"
                class="text-sm">
                {{ creditLoading ? "درحال پردازش..." : "شارژ" }}
              </ActionButton>
            </div>
          </form>
        </div>
      </BaseModal>

      <!-- Debit Modal -->
      <BaseModal v-if="showDebitModal" @close="closeDebitModal">
        <div class="w-full max-w-md mx-auto space-y-4" dir="rtl">
          <h2 class="text-lg font-bold">برداشت از کیف پول</h2>
          <form @submit.prevent="debitWalletHandler" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">مبلغ (تومان)</label>
              <UInput v-model.number="debitForm.amount" type="number" min="0" :max="wallet?.balance || 0" required />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1"
                >شرح (اختیاری)</label
              >
              <UTextarea v-model="debitForm.description" />
            </div>

            <div
              v-if="errorMsg"
              class="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
              {{ errorMsg }}
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <ActionButton
                tone="secondary"
                type="button"
                @click="closeDebitModal"
                class="text-sm">
                انصراف
              </ActionButton>
              <ActionButton
                tone="destructive"
                type="submit"
                :disabled="debitLoading"
                class="text-sm">
                {{ debitLoading ? "درحال پردازش..." : "برداشت" }}
              </ActionButton>
            </div>
          </form>
        </div>
      </BaseModal>
    </div>
</template>

<script setup lang="ts">
const feedback = useFeedback();
import { ref, computed, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import {
  getWallet,
  getTransactions,
  creditWallet,
  debitWallet,
} from "~/services/walletService";
import { toUserFacingError } from "~/services/apiClient";
useHead({
  title: "داشبورد | کیف پول",
});

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "permission"],
  permission: { resource: "wallets", action: "r" },
});

// Permissions
const { canCreate, canRead, canUpdate, canDelete } = useAccess(
  Resource.WALLETS
);

// Types
type Wallet = {
  _id?: string;
  userId: string;
  balance: number;
  createdAt?: string;
  updatedAt?: string;
};

type Transaction = {
  _id?: string;
  type: "credit" | "debit";
  amount: number;
  description?: string;
  balanceAfter?: number;
  createdAt?: string;
};

const wallet = ref<Wallet | null>(null);
const transactions = ref<Transaction[]>([]);
const search = ref("");
const walletTransactionColumns = [
  { key: "createdAt", label: "تاریخ" },
  { key: "type", label: "نوع" },
  { key: "amount", label: "مبلغ" },
  { key: "description", label: "شرح" },
  { key: "balanceAfter", label: "موجودی بعد از تراکنش" },
];
const showCreditModal = ref(false);
const showDebitModal = ref(false);
const creditLoading = ref(false);
const debitLoading = ref(false);
const errorMsg = ref("");
const walletLoading = ref(false);
const transactionsLoading = ref(false);
const walletError = ref("");
const transactionsError = ref("");

const creditForm = ref({
  amount: 0,
  description: "",
});

const debitForm = ref({
  amount: 0,
  description: "",
});

const { $axios } = useNuxtApp();

// Filtered transactions based on search
const filteredTransactions = computed(() =>
  transactions.value.filter(
    (t) =>
      (t.description?.toLowerCase() || "").includes(
        search.value.toLowerCase()
      ) || t.type.includes(search.value.toLowerCase())
  )
);

// Fetch wallet data
const fetchWallet = async () => {
  if (!canRead.value) return;
  walletLoading.value = true;
  walletError.value = "";
  try {
    const result = await getWallet();
    wallet.value = result;
  } catch (err) {
    console.error("خطا در دریافت کیف پول:", err);
    wallet.value = null;
    walletError.value = toUserFacingError(err, "دریافت کیف پول انجام نشد.").message;
  } finally {
    walletLoading.value = false;
  }
};

// Fetch transaction history
const fetchTransactions = async () => {
  if (!canRead.value) return;
  transactionsLoading.value = true;
  transactionsError.value = "";
  try {
    const result = await getTransactions();
    transactions.value = result;
  } catch (err) {
    console.error("خطا در دریافت تاریخچه تراکنش:", err);
    transactions.value = [];
    transactionsError.value = toUserFacingError(err, "دریافت تراکنش‌ها انجام نشد.").message;
  } finally {
    transactionsLoading.value = false;
  }
};

// Format date
const formatDate = (date: string | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fa-IR");
};

// Open credit modal
function openCreditModal() {
  if (!canCreate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
  creditForm.value = { amount: 0, description: "" };
  errorMsg.value = "";
  showCreditModal.value = true;
}

function closeCreditModal() {
  showCreditModal.value = false;
  errorMsg.value = "";
}

// Open debit modal
function openDebitModal() {
  if (!canCreate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
  debitForm.value = { amount: 0, description: "" };
  errorMsg.value = "";
  showDebitModal.value = true;
}

function closeDebitModal() {
  showDebitModal.value = false;
  errorMsg.value = "";
}

// Credit wallet
const creditWalletHandler = async () => {
  if (!canCreate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
  if (creditForm.value.amount <= 0)
    return (errorMsg.value = "مبلغ باید بزرگتر از صفر باشد!");

  try {
    creditLoading.value = true;
    errorMsg.value = "";
    await creditWallet({
      amount: creditForm.value.amount,
    });
    await fetchWallet();
    await fetchTransactions();
    closeCreditModal();
    feedback.success("شارژ انجام شد", "کیف پول با موفقیت شارژ شد.");
  } catch (err: any) {
    errorMsg.value = toUserFacingError(err, "شارژ کیف پول انجام نشد.").message;
    console.error("خطا در شارژ کیف پول:", err);
  } finally {
    creditLoading.value = false;
  }
};

// Debit wallet
const debitWalletHandler = async () => {
  if (!canCreate.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
  if (debitForm.value.amount <= 0)
    return (errorMsg.value = "مبلغ باید بزرگتر از صفر باشد!");
  if ((wallet.value?.balance || 0) < debitForm.value.amount)
    return (errorMsg.value = "موجودی کافی نیست!");

  try {
    debitLoading.value = true;
    errorMsg.value = "";
    await debitWallet({
      amount: debitForm.value.amount,
    });
    await fetchWallet();
    await fetchTransactions();
    closeDebitModal();
    feedback.success("برداشت انجام شد", "درخواست برداشت با موفقیت ثبت شد.");
  } catch (err: any) {
    errorMsg.value = toUserFacingError(err, "برداشت از کیف پول انجام نشد.").message;
    console.error("خطا در برداشت از کیف پول:", err);
  } finally {
    debitLoading.value = false;
  }
};

onMounted(() => {
  fetchWallet();
  fetchTransactions();
});
</script>

<style scoped>
.container {
  width: 90%;
  margin: auto;
}
.title {
  color: var(--blue-dark);
  font-family: var(--font-yekan);
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
}
.title img {
  width: 50px;
  height: 50px;
}
</style>
