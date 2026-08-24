<template>
    <section class="categories-page" dir="rtl">
      <PanelPageHeader title="دسته‌بندی‌ها" subtitle="ساختار دسته‌بندی محصولات را مدیریت کنید" icon="i-lucide-tags">
        <template #actions><UButton v-if="canCreate && canRead" icon="i-lucide-plus" @click="openCreateModal">افزودن دسته‌بندی</UButton></template>
      </PanelPageHeader>

    <PanelPermissionGuard :allowed="canRead" :ready="isReady">
    <div class="categories-content">
      <PanelFilterBar>
        <TableFilterInput
          v-model="search"
          placeholder="جستجوی دسته‌بندی..."
          aria-label="جستجوی دسته‌بندی" />
        <UButton v-if="search" variant="ghost" color="neutral" icon="i-lucide-x" @click="search = ''">حذف جستجو</UButton>
      </PanelFilterBar>

      <div class="premium-card panel-table-card">
        <SharedAsyncState v-if="loading" state="loading" :skeleton-rows="5" />
        <SharedAsyncState
          v-else-if="loadError"
          state="error"
          :message="loadError"
          @retry="fetchCategories" />
        <SharedAsyncState
          v-else-if="filteredCategories.length === 0"
          state="empty"
          title="دسته‌بندی‌ای پیدا نشد"
          message="جستجو را تغییر دهید یا دسته‌بندی جدید بسازید." />
        <TableScrollContainer v-else>
          <UTable :rows="filteredCategories" :columns="categoryColumns" class="min-w-[32rem]">
          <template #description-data="{ row }">
            {{ row.description || "-" }}
          </template>
          <template #actions-data="{ row }">
            <div class="panel-row-actions">
              <UButton
                v-if="canUpdate"
                size="xs"
                color="warning"
                variant="soft"
                @click="editCategory(row)">
                ویرایش
              </UButton>
              <UButton
                v-if="canDelete"
                size="xs"
                color="error"
                :loading="deletingId === row.id"
                :disabled="Boolean(deletingId)"
                @click="deleteCategory(row.id)">
                حذف
              </UButton>
            </div>
          </template>
          </UTable>
        </TableScrollContainer>
      </div>
    </div>
    </PanelPermissionGuard>

    <!-- مودال ساخت/ویرایش -->
    <BaseModal v-if="isModalOpen" @close="closeModal">
      <h2 class="panel-modal-title">
        {{ editMode ? "ویرایش دسته‌بندی" : "ایجاد دسته‌بندی جدید" }}
      </h2>

      <UForm :state="form" class="space-y-5" @submit.prevent="saveCategory">
        <!-- نام -->
        <UFormField label="نام" name="name">
          <UInput v-model="form.name" required />
        </UFormField>

        <!-- Slug -->
        <UFormField label="Slug" name="slug">
          <UInput v-model="form.slug" required />
        </UFormField>

        <!-- توضیحات -->
        <UFormField label="توضیحات" name="description">
          <UTextarea v-model="form.description" :rows="3" />
        </UFormField>

        <!-- والد (parentName = id والد) -->
        <UFormField label="دسته والد" name="parentName">
          <USelect
            v-model="form.parentName"
            :items="[{ label: 'بدون والد', value: '' }, ...categories.map((cat) => ({ label: cat.name, value: cat.id }))]" />
        </UFormField>

        <!-- وضعیت -->
        <UFormField label="وضعیت" name="status">
          <USelect
            v-model="form.status"
            :items="[
              { label: 'پیش‌نویس', value: 'draft' },
              { label: 'فعال', value: 'active' },
              { label: 'غیر فعال', value: 'inactive' }
            ]" />
        </UFormField>

        <!-- دکمه‌ها -->
        <div class="modal-actions">
          <UButton
            type="button"
            @click="closeModal"
            color="neutral"
            variant="soft">
            لغو
          </UButton>
          <UButton type="submit" :loading="saving" :disabled="saving">
            ذخیره
          </UButton>
        </div>
      </UForm>
    </BaseModal>
    <PanelConfirmModal
      v-if="deleteTarget"
      title="حذف دسته‌بندی"
      :message="`آیا از حذف «${deleteTarget.name}» مطمئن هستید؟`"
      confirm-label="حذف دسته‌بندی"
      :busy="Boolean(deletingId)"
      @close="deleteTarget = null"
      @confirm="confirmDelete" />
    </section>
</template>

<script setup lang="ts">
useHead({
  title: "داشبورد | دسته‌بندی‌ها",
});
import { computed, ref, onMounted, watch } from "vue";
import { useAccess } from "~/composables/useAccess";
import { Resource } from "~/types/permissions";
import { toUserFacingError } from "~/services/apiClient";
import BaseModal from "~/components/BaseModal.vue";
const feedback = useFeedback();

const { canCreate, canRead, canUpdate, canDelete, isReady } = useAccess(
  Resource.CATEGORIES
);

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentName?: string;
  status: "draft" | "active" | "inactive";
};

const categories = ref<Category[]>([]);
const search = ref("");
const loading = ref(false);
const loadError = ref("");
const categoryColumns = computed(() => [
  { key: "name", label: "نام دسته" },
  { key: "description", label: "توضیحات" },
  ...(canUpdate.value || canDelete.value
    ? [{ key: "actions", label: "عملیات" }]
    : []),
]);
const { $axios } = useNuxtApp();

const isModalOpen = ref(false);
const saving = ref(false);
const deletingId = ref<string | null>(null);
const deleteTarget = ref<Category | null>(null);
const editMode = ref(false);
const form = ref({
  id: "",
  name: "",
  slug: "",
  description: "",
  parentName: "",
  status: "draft",
});

const openCreateModal = () => {
  editMode.value = false;
  form.value = {
    id: "",
    name: "",
    slug: "",
    description: "",
    parentName: "",
    status: "draft",
  };
  isModalOpen.value = true;
};

const editCategory = (cat: Category) => {
  editMode.value = true;
  form.value = {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
    parentName: cat.parentName || "",
    status: cat.status as "draft" | "active" | "inactive",
  };
  isModalOpen.value = true;
};

const deleteCategory = async (id: string) => {
  if (!canDelete.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه حذف ندارید.");
  const category = categories.value.find((item) => item.id === id);
  if (!category) return feedback.error("حذف انجام نشد", "دسته‌بندی موردنظر پیدا نشد.");
  deleteTarget.value = category;
};

const confirmDelete = async () => {
  const id = deleteTarget.value?.id;
  if (!id) return;
  try {
    deletingId.value = id;
    await $axios.delete(`/categories/${id}`);
    deleteTarget.value = null;
    await fetchCategories();
  } catch (err) {
    console.error("خطا در حذف دسته‌بندی:", err);
    feedback.error("حذف دسته‌بندی انجام نشد", toUserFacingError(err).message);
  } finally {
    deletingId.value = null;
  }
};

const fetchCategories = async () => {
  if (!canRead.value) return;
  loading.value = true;
  loadError.value = "";
  try {
    const { data } = await $axios.get("/categories");
    categories.value = data;
    //console.log(data);
  } catch (err) {
    console.error("خطا در گرفتن دسته‌بندی‌ها:", err);
    loadError.value = toUserFacingError(err).message;
    categories.value = [];
  } finally {
    loading.value = false;
  }
};

const filteredCategories = computed(() => {
  const query = search.value.trim().toLowerCase();
  if (!query) return categories.value;

  return categories.value.filter((cat) =>
    [cat.name, cat.slug, cat.description, cat.status]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query)
  );
});

const saveCategory = async () => {
  if (saving.value) return;
  if (!canCreate.value && !editMode.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ایجاد ندارید.");
  if (!canUpdate.value && editMode.value) return feedback.error("دسترسی کافی ندارید", "شما اجازه ویرایش ندارید.");

  try {
    if (!form.value.name.trim() || !form.value.slug.trim()) {
      feedback.error("اطلاعات ناقص", "نام و slug دسته‌بندی الزامی است.");
      return;
    }
    saving.value = true;
    const parentId =
      form.value.parentName === "" ? null : form.value.parentName;

    let payload;
    if (editMode.value) {
      payload = {
        id: form.value.id,
        name: form.value.name,
        slug: form.value.slug,
        description: form.value.description,
        parentId,
        status: form.value.status,
      };
      await $axios.patch(`/categories/${form.value.id}`, payload);
    } else {
      payload = {
        name: form.value.name,
        slug: form.value.slug,
        description: form.value.description,
        parentId,
        status: form.value.status,
      };
      await $axios.post("/categories", payload);
    }

    isModalOpen.value = false;
    await fetchCategories();
  } catch (err) {
    console.error("خطا در ذخیره دسته‌بندی:", err);
    feedback.error("ذخیره دسته‌بندی انجام نشد", toUserFacingError(err).message);
  } finally {
    saving.value = false;
  }
};
const closeModal = () => {
  isModalOpen.value = false;
};
onMounted(() => { if (isReady.value) fetchCategories(); });
watch(isReady, (ready) => { if (ready) fetchCategories(); }, { once: true });
</script>
<style scoped>
.categories-page {
  display: grid;
  gap: 1rem;
  width: min(100%, 90rem);
  margin-inline: auto;
}

.categories-content {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

</style>
