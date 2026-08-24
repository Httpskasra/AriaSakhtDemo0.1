<template>
  <section class="seller-company-page" dir="rtl">
    <PanelPageHeader title="شرکت من" subtitle="اطلاعات شرکت و وضعیت فعالیت فروشندگی شما" icon="i-lucide-building-2">
      <template #actions>
        <UButton v-if="company && canUpdate" icon="i-lucide-pencil" @click="openEdit">ویرایش اطلاعات</UButton>
        <UButton v-else-if="!company && !loading" to="/dashboard/company/register" icon="i-lucide-plus">ثبت شرکت</UButton>
        <UButton icon="i-lucide-refresh-cw" variant="soft" :loading="loading" aria-label="به‌روزرسانی شرکت" @click="fetchCompany">به‌روزرسانی</UButton>
      </template>
    </PanelPageHeader>

    <SharedAsyncState v-if="!isReady || loading" state="loading" :skeleton-rows="3" />
    <SharedAsyncState v-else-if="errorMessage" state="error" :message="errorMessage" @retry="fetchCompany" />
    <SharedAsyncState v-else-if="!company" state="empty" title="هنوز شرکتی برای حساب شما ثبت نشده است" message="برای شروع فروشندگی، اطلاعات شرکت خود را ثبت کنید.">
      <template #actions><UButton to="/dashboard/company/register" icon="i-lucide-arrow-left">ثبت شرکت</UButton></template>
    </SharedAsyncState>
    <div v-else class="company-content">
      <article class="company-summary panel-surface">
        <div class="company-summary__identity">
          <img v-if="company.image" :src="company.image" :alt="`لوگوی ${company.name}`" class="company-logo" />
          <div v-else class="company-logo company-logo--placeholder" aria-hidden="true"><UIcon name="i-lucide-building-2" /></div>
          <div><h2>{{ company.name }}</h2><p class="ltr">{{ company.email }}</p></div>
        </div>
        <StatusPill :label="statusLabel(company.status)" :semantic="statusSemantic(company.status)" />
      </article>
      <article class="company-details panel-surface">
        <div class="section-heading"><div><h2>اطلاعات ثبت‌شده</h2><p>اطلاعات نمایش داده‌شده از حساب و شرکت شما دریافت شده است.</p></div></div>
        <dl class="details-grid">
          <div><dt>نام شرکت</dt><dd>{{ company.name || "—" }}</dd></div>
          <div><dt>ایمیل</dt><dd class="ltr">{{ company.email || "—" }}</dd></div>
          <div><dt>شماره تماس</dt><dd class="ltr">{{ company.phone || "—" }}</dd></div>
          <div><dt>شماره ثبت</dt><dd class="ltr">{{ company.registrationNumber || "—" }}</dd></div>
          <div class="details-grid__wide"><dt>آدرس</dt><dd>{{ company.address || "—" }}</dd></div>
        </dl>
      </article>
    </div>

    <BaseModal v-if="showEdit" title-id="edit-company-title" :busy="saving" @close="closeEdit">
      <form class="company-form" @submit.prevent="saveCompany">
        <h2 id="edit-company-title">ویرایش اطلاعات شرکت</h2>
        <div class="form-grid">
          <UFormField label="نام شرکت" name="name" required><UInput v-model="form.name" autocomplete="organization" /></UFormField>
          <UFormField label="ایمیل" name="email" required><UInput v-model="form.email" type="email" autocomplete="email" /></UFormField>
          <UFormField label="شماره تماس" name="phone"><UInput v-model="form.phone" type="tel" dir="ltr" autocomplete="tel" /></UFormField>
          <UFormField label="شماره ثبت" name="registrationNumber"><UInput v-model="form.registrationNumber" dir="ltr" /></UFormField>
          <UFormField class="form-grid__wide" label="آدرس"><UTextarea v-model="form.address" :rows="4" /></UFormField>
        </div>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
        <div class="modal-actions"><UButton type="button" color="neutral" variant="soft" :disabled="saving" @click="closeEdit">انصراف</UButton><UButton type="submit" :loading="saving">ذخیره تغییرات</UButton></div>
      </form>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import type { Company } from "~/types/company";
import { getMyCompany, updateCompany } from "~/services/companyService";
import { toUserFacingError } from "~/services/apiClient";

definePageMeta({ layout: "panel", middleware: ["auth", "permission"], permission: { resource: "companies", action: "r" } });
useHead({ title: "داشبورد | شرکت من" });

const { user } = useUser();
const { canUpdate, isReady } = useAccess(Resource.COMPANIES);
const company = ref<Company | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const showEdit = ref(false);
const saving = ref(false);
const formError = ref("");
const form = ref({ name: "", email: "", phone: "", registrationNumber: "", address: "" });

const companyId = () => {
  const current = user.value as (typeof user.value & { companyId?: string; profile?: { companyId?: string } }) | null;
  return current?.companyId || current?.profile?.companyId || "";
};

async function fetchCompany() {
  const id = companyId();
  if (!id) { company.value = null; errorMessage.value = ""; return; }
  loading.value = true; errorMessage.value = "";
  try { company.value = await getMyCompany(id); }
  catch (error) { company.value = null; errorMessage.value = toUserFacingError(error, "دریافت اطلاعات شرکت انجام نشد.").message; }
  finally { loading.value = false; }
}

function statusLabel(status?: Company["status"]) { return ({ active: "فعال", pending: "در انتظار بررسی", suspended: "معلق", rejected: "رد شده" } as Record<string, string>)[status || ""] || "نامشخص"; }
function statusSemantic(status?: Company["status"]) { return status === "active" ? "success" : status === "rejected" ? "danger" : "warning"; }
function openEdit() { if (!company.value) return; form.value = { name: company.value.name || "", email: company.value.email || "", phone: company.value.phone || "", registrationNumber: company.value.registrationNumber || "", address: company.value.address || "" }; formError.value = ""; showEdit.value = true; }
function closeEdit() { if (!saving.value) showEdit.value = false; }
async function saveCompany() {
  if (!company.value?._id || saving.value) return;
  if (!form.value.name.trim() || !form.value.email.trim()) { formError.value = "نام شرکت و ایمیل الزامی است."; return; }
  saving.value = true; formError.value = "";
  try { company.value = await updateCompany(company.value._id, form.value); showEdit.value = false; }
  catch (error) { formError.value = toUserFacingError(error, "ذخیره اطلاعات شرکت انجام نشد.").message; }
  finally { saving.value = false; }
}

onMounted(() => { if (isReady.value) fetchCompany(); });
watch(isReady, (ready) => { if (ready) fetchCompany(); }, { once: true });
</script>

<style scoped>
.seller-company-page, .company-content { display:grid; gap:1rem; }
.company-summary { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem; }
.company-summary__identity { display:flex; align-items:center; gap:1rem; min-width:0; }
.company-summary h2, .company-details h2, .company-form h2 { margin:0; color:var(--color-text-heading); font-size:1.1rem; font-weight:800; }
.company-summary p, .company-details p { margin:.35rem 0 0; color:var(--color-text-muted); font-size:.85rem; }
.company-logo { display:grid; place-items:center; width:4rem; height:4rem; flex:none; border-radius:var(--radius-field); object-fit:cover; background:var(--color-info-bg); color:var(--color-brand-blue); font-size:1.75rem; }
.company-details { padding:1.25rem; }
.section-heading { margin-bottom:1rem; }
.details-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1rem; margin:0; }
.details-grid > div { padding:1rem; border:1px solid var(--color-border); border-radius:var(--radius-field); background:var(--color-bg-light); }
.details-grid__wide { grid-column:1/-1; }
.details-grid dt { color:var(--color-text-muted); font-size:.78rem; }
.details-grid dd { margin:.4rem 0 0; color:var(--color-text-heading); font-weight:700; overflow-wrap:anywhere; }
.company-form { display:grid; gap:1rem; direction:rtl; }
.company-form h2 { padding-inline-end:2.5rem; }
.form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:1rem; }
.form-grid__wide { grid-column:1/-1; }
.form-error { margin:0; padding:.7rem; color:var(--color-danger-fg); background:var(--color-danger-bg); border-radius:var(--radius-field); }
.ltr { direction:ltr; text-align:right; }
@media (max-width:640px) { .company-summary { align-items:flex-start; flex-direction:column; } .details-grid, .form-grid { grid-template-columns:1fr; } .details-grid__wide, .form-grid__wide { grid-column:auto; } .modal-actions { flex-direction:column-reverse; } }
</style>
