<script setup lang="ts">
useHead({ title: 'درباره تجاریس' });

const values = [
  {
    icon: 'i-lucide-badge-check',
    title: 'تأمین‌کنندگان معتبر',
    description: 'فروشندگان و تولیدکنندگان را با اطلاعات شفاف‌تر و قابل بررسی به خریداران معرفی می‌کنیم.',
  },
  {
    icon: 'i-lucide-search-check',
    title: 'خرید آگاهانه',
    description: 'جست‌وجو، مقایسه و دریافت اطلاعات محصول را برای خریدهای صنعتی ساده‌تر می‌کنیم.',
  },
  {
    icon: 'i-lucide-handshake',
    title: 'ارتباط مستقیم',
    description: 'مسیر ارتباط کسب‌وکارها با تأمین‌کنندگان را کوتاه و حرفه‌ای طراحی کرده‌ایم.',
  },
];

const team = [
  { name: 'علی رضایی', role: 'مدیرعامل' },
  { name: 'سارا محمدی', role: 'مدیر فروش' },
  { name: 'مهدی کریمی', role: 'پشتیبانی' },
];
</script>

<template>
  <div class="public-page">
    <PublicPageHeader
      icon="i-lucide-building-2"
      title="درباره تجاریس"
      description="تجاریس بازار آنلاین تخصصی صنعت و ساختمان است؛ جایی برای پیدا کردن محصول، مقایسه تأمین‌کنندگان و شروع همکاری مطمئن."
    />

    <main class="section-container public-page__content">
      <section class="about-intro panel-surface">
        <div class="about-intro__icon" aria-hidden="true"><UIcon name="i-lucide-target" class="size-icon-action" /></div>
        <div>
          <p class="section-kicker">چرا تجاریس؟</p>
          <h2 class="section-title">مسیر خرید صنعتی را شفاف‌تر می‌کنیم</h2>
          <p class="section-copy">
            هدف ما ایجاد یک بازار تخصصی و قابل اعتماد برای محصولات صنعتی و ساختمانی است؛ بستری که در آن خریداران سریع‌تر به گزینه‌های مناسب برسند و فروشندگان بتوانند محصولات خود را به بازار هدف معرفی کنند.
          </p>
        </div>
      </section>

      <section aria-labelledby="values-title">
        <div class="section-heading">
          <div>
            <p class="section-kicker">اصول ما</p>
            <h2 id="values-title" class="section-title">تجربه‌ای برای همکاری بهتر</h2>
          </div>
        </div>
        <div class="values-grid">
          <article v-for="value in values" :key="value.title" class="value-card panel-surface">
            <div class="value-card__icon" aria-hidden="true"><UIcon :name="value.icon" class="size-icon-action" /></div>
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </article>
        </div>
      </section>

      <section class="team-section panel-surface" aria-labelledby="team-title">
        <div>
          <p class="section-kicker">تیم تجاریس</p>
          <h2 id="team-title" class="section-title">همراه کسب‌وکار شما</h2>
          <p class="section-copy">تیم ما برای ساختن تجربه‌ای ساده، پاسخ‌گو و حرفه‌ای در کنار خریداران و فروشندگان فعالیت می‌کند.</p>
        </div>
        <div class="team-list">
          <div v-for="member in team" :key="member.name" class="team-member">
            <div class="team-member__avatar" aria-hidden="true"><UIcon name="i-lucide-user-round" class="size-icon-inline" /></div>
            <div>
              <strong>{{ member.name }}</strong>
              <span>{{ member.role }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="about-cta">
        <div>
          <h2>برای شروع همکاری آماده‌اید؟</h2>
          <p>محصولات را بررسی کنید یا اطلاعات کسب‌وکار خود را برای فروشندگی ثبت کنید.</p>
        </div>
        <div class="about-cta__actions">
          <UButton to="/products" color="primary" size="lg" icon="i-lucide-store">مشاهده فروشگاه</UButton>
          <UButton to="/dashboard/company/register" color="neutral" variant="outline" size="lg">فروشنده شوید</UButton>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.public-page__content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding-block: 2.5rem 4rem;
}

.about-intro,
.team-section {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 1.25rem;
  padding: 1.5rem;
}

.about-intro__icon,
.value-card__icon,
.team-member__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brand-blue);
}

.about-intro__icon {
  width: 3rem;
  height: 3rem;
  border-radius: .875rem;
  background: #dbeafe;
}

.section-kicker {
  color: var(--color-brand-blue);
  font-size: .75rem;
  font-weight: 700;
}

.section-title {
  margin-top: .25rem;
  color: var(--color-text-heading);
  font-size: 1.25rem;
  font-weight: 800;
}

.section-copy {
  margin-top: .625rem;
  color: var(--color-text-body);
  line-height: 2;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.value-card {
  padding: 1.25rem;
}

.value-card__icon {
  width: 2.75rem;
  height: 2.75rem;
  margin-bottom: 1rem;
  border-radius: .75rem;
  background: #eff6ff;
}

.value-card h3 {
  color: var(--color-text-heading);
  font-size: 1rem;
  font-weight: 700;
}

.value-card p {
  margin-top: .5rem;
  color: var(--color-text-body);
  font-size: .875rem;
  line-height: 1.9;
}

.team-section {
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 1fr);
  align-items: center;
}

.team-list {
  display: grid;
  gap: .75rem;
}

.team-member {
  display: flex;
  align-items: center;
  gap: .75rem;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-field);
  padding: .75rem;
}

.team-member__avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #eff6ff;
}

.team-member strong,
.team-member span {
  display: block;
}

.team-member strong { color: var(--color-text-heading); font-size: .875rem; }
.team-member span { margin-top: .125rem; color: var(--color-text-muted); font-size: .75rem; }

.about-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-card);
  padding: 1.5rem;
  background: #eff6ff;
}

.about-cta h2 { color: var(--color-text-heading); font-size: 1.125rem; font-weight: 800; }
.about-cta p { margin-top: .375rem; color: var(--color-text-body); font-size: .875rem; }
.about-cta__actions { display: flex; flex-wrap: wrap; gap: .75rem; }

@media (max-width: 767px) {
  .public-page__content { gap: 2rem; padding-block: 1.5rem 3rem; }
  .values-grid,
  .team-section { grid-template-columns: 1fr; }
  .about-cta { align-items: flex-start; flex-direction: column; }
}
</style>
