<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-4 bg-gray-50 border-b flex justify-between items-center">
      <h2 class="text-lg font-bold">مدیریت موجودی کالا</h2>
      <div class="flex items-center gap-4">
        <UCheckbox v-model="showDeleted" label="نمایش کالاهای حذف شده" color="red" />
        <UButton color="green" icon="i-lucide-plus" @click="navigateTo('/dashboard/admin/products/create')">افزودن کالا</UButton>
      </div>
    </div>

    <UTable
      :rows="filteredProducts"
      :columns="columns"
      :loading="loading"
    >
      <template #status-data="{ row }">
        <UBadge :color="statusColor(row.status)" size="xs" variant="soft" class="font-bold">
          {{ statusLabel(row.status) }}
        </UBadge>
      </template>

      <template #basePrice-data="{ row }">
        <div class="flex items-baseline gap-1">
          <span class="font-bold">{{ formatPrice(row.basePrice) }}</span>
          <span class="text-[10px] text-gray-400">تومان</span>
        </div>
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-1">
          <UButton
            v-if="row.status !== 'deleted'"
            color="blue"
            variant="ghost"
            icon="i-lucide-edit"
            square
            size="xs"
            @click="editProduct(row)"
          />
          
          <UButton
            v-if="row.status === 'deleted'"
            color="green"
            variant="ghost"
            icon="i-lucide-rotate-ccw"
            label="بازگردانی"
            size="xs"
            @click="handleRestore(row)"
          />
          <UButton
            v-else
            color="red"
            variant="ghost"
            icon="i-lucide-trash-2"
            square
            size="xs"
            @click="handleSoftDelete(row)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAllProducts, updateProductStatus } from '~/services/productService'

const products = ref<any[]>([])
const loading = ref(true)
const showDeleted = ref(false)
const toast = useToast()

const columns = [
  { key: 'sku', label: 'کد کالا (SKU)' },
  { key: 'name', label: 'نام محصول' },
  { key: 'basePrice', label: 'قیمت پایه' },
  { key: 'stock.quantity', label: 'موجودی' },
  { key: 'status', label: 'وضعیت' },
  { key: 'actions', label: 'عملیات' }
]

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await getAllProducts(100, 1)
    // Assuming backend might return a mixed list if using admin endpoint
    products.value = res.data.items || []
  } catch (err) {
    console.error('Fetch failed:', err)
  } finally {
    loading.value = false
  }
}

const filteredProducts = computed(() => {
  if (showDeleted.value) return products.value
  return products.value.filter(p => p.status !== 'deleted')
})

const statusLabel = (s: string) => {
  const map: any = { active: 'فعال', inactive: 'غیرفعال', draft: 'پیش‌نویس', deleted: 'حذف شده' }
  return map[s] || s
}

const statusColor = (s: string) => {
  const map: any = { active: 'green', inactive: 'orange', draft: 'gray', deleted: 'red' }
  return map[s] || 'gray'
}

const formatPrice = (p: number) => new Intl.NumberFormat('fa-IR').format(p)

const handleSoftDelete = async (row: any) => {
  if (!confirm(`آیا از حذف کالا "${row.name}" اطمینان دارید؟`)) return
  
  try {
    await updateProductStatus(row._id || row.id, 'deleted')
    toast.add({ title: 'حذف شد', description: 'کالا به لیست حذفیات منتقل شد.', color: 'orange' })
    await fetchProducts()
  } catch (err) {
    toast.add({ title: 'خطا', description: 'عملیات ناموفق بود', color: 'red' })
  }
}

const handleRestore = async (row: any) => {
  try {
    await updateProductStatus(row._id || row.id, 'active')
    toast.add({ title: 'بازگردانی شد', description: 'کالا دوباره فعال گردید.', color: 'green' })
    await fetchProducts()
  } catch (err) {
    toast.add({ title: 'خطا', description: 'عملیات ناموفق بود', color: 'red' })
  }
}

const editProduct = (row: any) => {
  navigateTo(`/dashboard/admin/products/edit/${row._id || row.id}`)
}

onMounted(fetchProducts)
</script>
