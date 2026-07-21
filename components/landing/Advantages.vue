<script setup lang="ts">
const advantages = [
  {
    title: 'تأمین‌کنندگان معتبر',
    desc: 'احراز هویت دقیق تمامی فروشندگان برای تضمین اصالت کالا.',
    icon: 'i-lucide-shield-check',
    color: 'blue'
  },
  {
    title: 'خرید بی‌واسطه',
    desc: 'ارتباط مستقیم با تولیدکننده و حذف هزینه‌های اضافی.',
    icon: 'i-lucide-handshake',
    color: 'orange'
  },
  {
    title: 'استعلام سریع',
    desc: 'دریافت پیش‌فاکتور رسمی در کمترین زمان ممکن.',
    icon: 'i-lucide-file-text',
    color: 'indigo'
  },
  {
    title: 'ارسال کشوری',
    desc: 'لجستیک هوشمند و ارسال بار به تمام نقاط ایران.',
    icon: 'i-lucide-truck',
    color: 'green'
  }
];
</script>

<template>
  <section class="py-20">
    <div class="section-container">
      <div class="grid lg:grid-cols-4 gap-8">
        <div 
          v-for="item in advantages" 
          :key="item.title"
          class="flex flex-col items-start gap-4 p-6 rounded-brand border border-slate-100 hover:border-brand-blue/20 hover:bg-slate-50 transition-all group"
        >
          <div class="p-3 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-brand-blue group-hover:text-white transition-all duration-500">
            <UIcon :name="item.icon" class="size-8" />
          </div>
          <div class="space-y-2">
            <h3 class="font-bold text-lg text-slate-900">{{ item.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
