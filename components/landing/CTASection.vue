<template>
  <section class="py-20">
    <div class="section-container">
      <div class="premium-card bg-blue-600 p-8 md:p-16 rounded-[40px] text-white flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative border-0">
        <UIcon name="i-lucide-building-2" class="absolute -bottom-10 -right-10 size-64 text-white/5 -rotate-12" />
        
        <div class="relative z-10 text-center lg:text-right max-w-2xl">
          <h2 class="text-3xl md:text-5xl font-black mb-6 leading-tight">شما هم به بزرگترین بازار تخصصی ساختمان بپیوندید</h2>
          <p class="text-lg text-blue-100 leading-relaxed mb-8 opacity-90">فرقی نمی‌کند تولیدکننده هستید یا پیمانکار؛ تجاریس ابزارهای مورد نیاز برای توسعه کسب‌وکار شما را فراهم کرده است.</p>
          <div class="flex flex-wrap justify-center lg:justify-start gap-4">
            <UButton size="xl" color="white" class="px-10 py-4 font-black rounded-2xl text-blue-600">ثبت‌نام فروشندگان</UButton>
            <UButton size="xl" variant="ghost" class="px-10 py-4 font-black rounded-2xl text-white border border-white/30 hover:bg-white/10">مشاوره سازمانی</UButton>
          </div>
        </div>

        <div class="relative z-10 grid grid-cols-2 gap-4">
          <div class="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center">
            <span class="text-3xl font-black font-num mb-1">۴۸٪</span>
            <span class="text-xs text-blue-200">کاهش هزینه‌های تامین</span>
          </div>
          <div class="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center mt-8">
            <span class="text-3xl font-black font-num mb-1">۳۰</span>
            <span class="text-xs text-blue-200">دقیقه میانگین استعلام</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>