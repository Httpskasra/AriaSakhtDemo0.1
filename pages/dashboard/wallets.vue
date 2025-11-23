<template>
  <NuxtLayout name="dashboard">
    <div class="container" dir="rtl">
      <div class="title">
        <h1 class="title">کیف پول</h1>
        <img src="/icons/wallet.png" alt="" />
      </div>
    </div>

    <div class="space-y-4" dir="rtl">
      <!-- Wallet Balance Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold text-gray-800">موجودی کیف پول</h2>
          <div class="text-3xl font-bold text-blue-600">
            {{ wallet?.balance || 0 }} تومان
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div
        class="actions flex justify-between items-center mb-4 bg-white rounded-lg py-2 px-4">
        <SearchBar v-model="search" :dark="true" />
        <div class="flex gap-2">
          <button
            v-if="canCreate"
            @click="openCreditModal()"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm">
            + شارژ کیف پول
          </button>
          <button
            v-if="canCreate"
            @click="openDebitModal()"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm">
            - برداشت
          </button>
        </div>
      </div>

      <!-- Transaction History Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-gray-50 text-gray-600">
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  تاریخ
                </th>
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  نوع
                </th>
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  مبلغ
                </th>
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  شرح
                </th>
                <th
                  class="text-right font-medium px-4 py-3 border-b border-gray-100">
                  موجودی بعد از تراکنش
                </th>
              </tr>
            </thead>
            <tbody class="text-gray-800">
              <tr
                v-for="(transaction, idx) in filteredTransactions"
                :key="transaction._id || idx"
                class="hover:bg-gray-50 border-b border-gray-100">
                <td class="px-4 py-3">
                  {{ formatDate(transaction.createdAt) }}
                </td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 rounded text-white text-xs"
                    :class="
                      transaction.type === 'credit'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    ">
                    {{ transaction.type === "credit" ? "شارژ" : "برداشت" }}
                  </span>
                </td>
                <td class="px-4 py-3 font-medium">
                  {{ transaction.amount }} تومان
                </td>
                <td class="px-4 py-3 text-gray-700 truncate max-w-[200px]">
                  {{ transaction.description || "—" }}
                </td>
                <td class="px-4 py-3 text-gray-700">
                  {{ transaction.balanceAfter || "—" }} تومان
                </td>
              </tr>
              <tr v-if="transactions.length === 0" class="text-center">
                <td colspan="5" class="px-4 py-6 text-gray-500">
                  تراکنشی یافت نشد
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Credit Modal -->
      <BaseModal v-if="showCreditModal" @close="closeCreditModal">
        <div class="w-full max-w-md mx-auto space-y-4" dir="rtl">
          <h2 class="text-lg font-bold">شارژ کیف پول</h2>
          <form @submit.prevent="creditWallet" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">مبلغ (تومان)</label>
              <input
                v-model.number="creditForm.amount"
                type="number"
                min="0"
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1"
                >شرح (اختیاری)</label
              >
              <textarea
                v-model="creditForm.description"
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <button
                type="button"
                @click="closeCreditModal"
                class="px-4 py-2 rounded border border-gray-200 bg-white hover:bg-gray-100 text-sm">
                انصراف
              </button>
              <button
                type="submit"
                :disabled="creditLoading"
                class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm disabled:opacity-50">
                {{ creditLoading ? "درحال پردازش..." : "شارژ" }}
              </button>
            </div>
          </form>
        </div>
      </BaseModal>

      <!-- Debit Modal -->
      <BaseModal v-if="showDebitModal" @close="closeDebitModal">
        <div class="w-full max-w-md mx-auto space-y-4" dir="rtl">
          <h2 class="text-lg font-bold">برداشت از کیف پول</h2>
          <form @submit.prevent="debitWallet" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">مبلغ (تومان)</label>
              <input
                v-model.number="debitForm.amount"
                type="number"
                min="0"
                :max="wallet?.balance || 0"
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1"
                >شرح (اختیاری)</label
              >
              <textarea
                v-model="debitForm.description"
                class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <button
                type="button"
                @click="closeDebitModal"
                class="px-4 py-2 rounded border border-gray-200 bg-white hover:bg-gray-100 text-sm">
                انصراف
              </button>
              <button
                type="submit"
                :disabled="debitLoading"
                class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm disabled:opacity-50">
                {{ debitLoading ? "درحال پردازش..." : "برداشت" }}
              </button>
            </div>
          </form>
        </div>
      </BaseModal>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";

useHead({
  title: " آریاساخت | داشبورد | کیف پول",
});

definePageMeta({
  middleware: "dashboard-auth",
});

// Permissions
const { canCreate, canRead, canUpdate, canDelete } = {
  canCreate: true,
  canDelete: true,
  canRead: true,
  canUpdate: true,
};

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
const showCreditModal = ref(false);
const showDebitModal = ref(false);
const creditLoading = ref(false);
const debitLoading = ref(false);

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
  if (!canRead) return;
  try {
    const res = await $axios.get("/wallets");
    wallet.value = res.data;
  } catch (err) {
    console.warn("خطا در دریافت کیف پول:", err);
    wallet.value = null;
  }
};

// Fetch transaction history
const fetchTransactions = async () => {
  if (!canRead) return;
  try {
    const res = await $axios.get("/transaction");
    transactions.value = res.data || [];
  } catch (err) {
    console.warn("خطا در دریافت تاریخچه تراکنش:", err);
    transactions.value = [];
  }
};

// Format date
const formatDate = (date: string | undefined) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fa-IR");
};

// Open credit modal
function openCreditModal() {
  if (!canCreate) return alert("شما اجازه ایجاد ندارید!");
  creditForm.value = { amount: 0, description: "" };
  showCreditModal.value = true;
}

function closeCreditModal() {
  showCreditModal.value = false;
}

// Open debit modal
function openDebitModal() {
  if (!canCreate) return alert("شما اجازه ایجاد ندارید!");
  debitForm.value = { amount: 0, description: "" };
  showDebitModal.value = true;
}

function closeDebitModal() {
  showDebitModal.value = false;
}

// Credit wallet
const creditWallet = async () => {
  if (!canCreate) return alert("شما اجازه ایجاد ندارید!");
  if (creditForm.value.amount <= 0)
    return alert("مبلغ باید بزرگتر از صفر باشد!");

  try {
    creditLoading.value = true;
    await $axios.post("/wallets/credit", {
      amount: creditForm.value.amount,
      
    });
    await fetchWallet();
    await fetchTransactions();
    closeCreditModal();
    alert("کیف پول با موفقیت شارژ شد");
  } catch (err) {
    console.error("خطا در شارژ کیف پول:", err);
    alert("خطا در شارژ کیف پول. دوباره تلاش کنید.");
  } finally {
    creditLoading.value = false;
  }
};

// Debit wallet
const debitWallet = async () => {
  if (!canCreate) return alert("شما اجازه ایجاد ندارید!");
  if (debitForm.value.amount <= 0)
    return alert("مبلغ باید بزرگتر از صفر باشد!");
  if ((wallet.value?.balance || 0) < debitForm.value.amount)
    return alert("موجودی کافی نیست!");

  try {
    debitLoading.value = true;
    await $axios.post("/wallets/debit", {
      amount: debitForm.value.amount,
      description: debitForm.value.description,
    });
    await fetchWallet();
    await fetchTransactions();
    closeDebitModal();
    alert("برداشت با موفقیت انجام شد");
  } catch (err) {
    console.error("خطا در برداشت از کیف پول:", err);
    alert("خطا در برداشت. دوباره تلاش کنید.");
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
  font-family: "iran-yekan-Bold";
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
