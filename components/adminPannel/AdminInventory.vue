<template>
  <div class="space-y-6">
    <!-- Action Bar -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div class="flex-1 w-full md:max-w-md relative">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="جستجو در انبار (نام کالا، SKU یا برند)..."
          class="w-full"
          color="gray"
          size="lg"
        />
      </div>
      <div class="flex gap-2 w-full md:w-auto">
        <UButton
          color="gray"
          variant="outline"
          icon="i-lucide-filter"
          label="فیلتر پیشرفته"
        />
        <UButton
          color="primary"
          icon="i-lucide-plus"
          label="افزودن محصول جدید"
          @click="isCreateModalOpen = true"
        />
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <UTable 
        :rows="filteredProducts" 
        :columns="columns" 
        :loading="loading"
        class="w-full"
        :ui="{ th: { base: 'bg-gray-50 font-bold' } }"
      >
        <template #image-data="{ row }">
          <div class="size-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
            <img :src="row.images?.[0]?.url || 'https://picsum.photos/seed/inv/50/50'" class="size-full object-cover" />
          </div>
        </template>

        <template #name-data="{ row }">
          <div class="flex flex-col min-w-48">
            <span class="font-bold text-gray-800">{{ row.name }}</span>
            <span class="text-[10px] text-muted font-mono uppercase tracking-wider">SKU: {{ row.sku }}</span>
          </div>
        </template>

        <template #stock-data="{ row }">
          <div class="flex items-center gap-2">
            <UBadge 
              :color="row.stock?.quantity > 20 ? 'green' : (row.stock?.quantity > 0 ? 'orange' : 'red')" 
              variant="soft"
              class="font-num"
            >
              {{ row.stock?.quantity }} عدد
            </UBadge>
          </div>
        </template>

        <template #basePrice-data="{ row }">
          <span class="font-num font-semibold">{{ formatPrice(row.basePrice) }}</span>
          <span class="text-[10px] mr-1 text-muted">تومان</span>
        </template>

        <template #status-data="{ row }">
          <USelectMenu
            v-model="row.status"
            :options="['active', 'draft', 'inactive']"
            size="xs"
            @change="updateStatus(row)"
          >
            <template #default="{ open }">
              <UButton
                color="gray"
                variant="ghost"
                size="xs"
                class="flex-1 justify-between"
                :label="statusLabels[row.status]"
                :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              />
            </template>
          </USelectMenu>
        </template>

        <template #actions-data="{ row }">
          <div class="flex gap-1">
            <UButton color="gray" variant="ghost" icon="i-lucide-edit" size="xs" @click="editProduct(row)" />
            <UButton color="red" variant="ghost" icon="i-lucide-trash-2" size="xs" @click="deleteProduct(row.id)" />
          </div>
        </template>
      </UTable>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-100 flex justify-center bg-gray-50/50">
        <UPagination v-model="page" :total="totalCount" :page-count="10" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  products: { type: Array, default: () => [] },
  loading: Boolean,
  totalCount: { type: Number, default: 0 }
})

const searchQuery = ref('')
const page = ref(1)

const columns = [
  { key: 'image', label: '' },
  { key: 'name', label: 'نام محصول / شناسه' },
  { key: 'stock', label: 'موجودی انبار' },
  { key: 'basePrice', label: 'قیمت پایه' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: 'عملیات' }
]

const statusLabels = {
  active: 'فعال',
  draft: 'پیش‌نویس',
  inactive: 'غیرفعال'
}

const formatPrice = (p) => new Intl.NumberFormat('fa-IR').format(p)

const filteredProducts = computed(() => {
  if (!searchQuery.value) return props.products
  const q = searchQuery.value.toLowerCase()
  return props.products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.sku.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q)
  )
})

const updateStatus = (row) => console.log('Updating status', row)
const editProduct = (row) => console.log('Editing', row)
const deleteProduct = (id) => console.log('Deleting', id)
</script>
