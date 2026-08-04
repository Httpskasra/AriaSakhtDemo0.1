<template>
  <section class="py-20">
    <div class="section-container">
      <div class="premium-card bg-blue-600 p-8 md:p-16 text-white flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 overflow-hidden relative border-0">
        <UIcon name="i-lucide-building-2" class="absolute -bottom-10 -right-10 size-64 text-white/5 -rotate-12" />
        
        <div class="relative z-10 text-center lg:text-right max-w-2xl">
          <h2 class="text-3xl md:text-5xl font-black mb-5 leading-tight">به بازار تخصصی ساختمان تجاریس بپیوندید</h2>
          <p class="text-base text-blue-100 leading-relaxed mb-8 opacity-90">فرقی نمی‌کند تولیدکننده هستید یا پیمانکار؛ تجاریس ابزارهای موردنیاز برای توسعه کسب‌وکار شما را فراهم کرده است.</p>
          <div class="flex flex-wrap justify-center lg:justify-start gap-4">
            <UButton to="/dashboard/company/register" size="xl" color="neutral" variant="solid">ثبت‌نام فروشندگان</UButton>
            <UButton to="/contact" size="xl" color="neutral" variant="outline">مشاوره سازمانی</UButton>
          </div>
        </div>

        <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="bg-white/10 backdrop-blur-md p-6 rounded-card border border-white/20 flex flex-col items-center">
            <UIcon name="i-lucide-store" class="size-icon-empty-state mb-3 text-white" />
            <span class="text-xs text-blue-200">ثبت درخواست فروشندگی</span>
          </div>
          <div class="bg-white/10 backdrop-blur-md p-6 rounded-card border border-white/20 flex flex-col items-center sm:mt-8">
            <UIcon name="i-lucide-headphones" class="size-icon-empty-state mb-3 text-white" />
            <span class="text-xs text-blue-200">ارتباط با تیم تجاریس</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
