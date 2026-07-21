<script setup lang="ts">
const vendors = [
  { name: 'فولاد مبارکه اصفهان', location: 'اصفهان', rate: 4.9, products: '۱۲۰+', status: 'تایید شده' },
  { name: 'سیمان تهران', location: 'تهران', rate: 4.8, products: '۴۵+', status: 'تایید شده' },
  { name: 'گروه صنعتی پمپیران', location: 'تبریز', rate: 4.7, products: '۸۸+', status: 'تایید شده' },
  { name: 'کاشی تبریز', location: 'تبریز', rate: 4.9, products: '۲۰۰+', status: 'تایید شده' }
];
</script>

<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div v-for="vendor in vendors" :key="vendor.name" class="premium-card p-6 group">
      <div class="flex items-start justify-between mb-6">
        <div class="size-14 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden">
          <UIcon name="i-lucide-building-2" class="text-slate-400 size-8" />
        </div>
        <UBadge color="success" variant="soft" size="xs" class="rounded-lg font-bold">
          <UIcon name="i-lucide-badge-check" class="me-1" />
          {{ vendor.status }}
        </UBadge>
      </div>

      <h4 class="text-lg font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{{ vendor.name }}</h4>
      <p class="text-xs text-slate-500 flex items-center gap-1 mb-6">
        <UIcon name="i-lucide-map-pin" class="size-3" />
        {{ vendor.location }}
      </p>

      <div class="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
        <div class="flex flex-col">
          <span class="text-xs text-slate-400 mb-1">کالاها</span>
          <span class="font-bold text-slate-800 font-num">{{ vendor.products }}</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-xs text-slate-400 mb-1">امتیاز</span>
          <div class="flex items-center gap-1 text-amber-500 font-bold font-num">
            {{ vendor.rate }}
            <UIcon name="i-lucide-star" class="size-3 fill-current" />
          </div>
        </div>
      </div>

      <UButton block color="neutral" variant="outline" class="font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
        مشاهده غرفه تامین‌کننده
      </UButton>
    </div>
  </div>
</template>