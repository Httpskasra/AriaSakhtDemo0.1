<script setup lang="ts">
const banners = [
  { id: 1, img: 'https://picsum.photos/seed/banner1/1920/600', title: 'تجهیزات صنعتی هوشمند', sub: 'ارتقای بهره‌وری با تکنولوژی نوین' },
  { id: 2, img: 'https://picsum.photos/seed/banner2/1920/600', title: 'تأمین قطعات زیرساختی', sub: 'بالاترین کیفیت، کمترین زمان' }
];
</script>

<template>
  <div class="relative w-full overflow-hidden bg-gray-100">
    <UCarousel v-slot="{ item }" :items="banners" :ui="{ item: 'basis-full' }" arrows indicators class="w-full">
      <div class="relative w-full h-[300px] md:h-[500px]">
        <NuxtImg
          :src="item.img"
          class="absolute inset-0 w-full h-full object-cover"
          alt="Banner"
        />
        <div class="absolute inset-0 bg-black/30 flex items-center justify-center text-center px-4">
          <div>
            <h2 class="text-3xl md:text-5xl font-bold text-white mb-4">{{ item.title }}</h2>
            <p class="text-lg md:text-xl text-white/90">{{ item.sub }}</p>
            <UButton size="xl" color="primary" class="mt-8 px-10">مشاهده محصولات</UButton>
          </div>
        </div>
      </div>
    </UCarousel>
  </div>
</template>
