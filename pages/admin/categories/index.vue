<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'dashboard-auth' });

const { data: categories, refresh } = await useAsyncData('admin-categories', fetchCategories);
const toast = useToast();

const isModalOpen = ref(false);
const editingCategory = ref<any>(null);
const form = reactive({
  name: '',
  slug: '',
  parentId: null as string | null
});

const openCreate = () => {
  editingCategory.value = null;
  form.name = '';
  form.slug = '';
  form.parentId = null;
  isModalOpen.value = true;
};

const openEdit = (cat: any) => {
  editingCategory.value = cat;
  form.name = cat.name;
  form.slug = cat.slug;
  form.parentId = cat.parentId;
  isModalOpen.value = true;
};

const save = async () => {
  try {
    if (editingCategory.value) {
      await updateCategory(editingCategory.value.id || editingCategory.value._id, form);
      toast.add({ title: 'بروزرسانی شد', color: 'success' });
    } else {
      await createCategory(form);
      toast.add({ title: 'ایجاد شد', color: 'success' });
    }
    isModalOpen.value = false;
    refresh();
  } catch (err: any) {
    toast.add({ title: 'خطا', description: err.message, color: 'red' });
  }
};

const remove = async (id: string) => {
  if (!confirm('آیا از حذف این دسته مطمئن هستید؟')) return;
  await deleteCategory(id);
  refresh();
};
</script>

<template>
  <UContainer class="py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
      <UButton icon="i-lucide-plus" @click="openCreate">دسته جدید</UButton>
    </div>

    <UTable :rows="categories || []" :columns="[
      { key: 'name', label: 'نام' },
      { key: 'slug', label: 'اسلاگ' },
      { key: 'actions', label: 'عملیات' }
    ]">
      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <UButton variant="ghost" icon="i-lucide-edit" @click="openEdit(row)" />
          <UButton variant="ghost" color="red" icon="i-lucide-trash" @click="remove(row.id || row._id)" />
        </div>
      </template>
    </UTable>

    <UModal v-model="isModalOpen">
      <UCard>
        <template #header>
          <div class="font-bold">{{ editingCategory ? 'ویرایش دسته' : 'ایجاد دسته' }}</div>
        </template>
        <UForm :state="form" class="space-y-4" @submit="save">
          <UFormField label="نام دسته">
            <UInput v-model="form.name" />
          </UFormField>
          <UFormField label="اسلاگ (URL)">
            <UInput v-model="form.slug" />
          </UFormField>
          <UFormField label="دسته والد">
            <USelectMenu v-model="form.parentId" :options="categories || []" value-attribute="id" option-attribute="name" />
          </UFormField>
          <div class="flex justify-end gap-2 pt-4">
            <UButton variant="ghost" @click="isModalOpen = false">انصراف</UButton>
            <UButton type="submit" color="primary">ذخیره</UButton>
          </div>
        </UForm>
      </UCard>
    </UModal>
  </UContainer>
</template>
