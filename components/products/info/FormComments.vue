<template>
  <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4">ثبت دیدگاه و امتیاز</h3>

    <div v-if="!isAuthenticated" class="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
      <UIcon name="i-lucide-info" class="text-blue-500 size-5" />
      <p class="text-sm text-blue-700 font-medium">برای ثبت نظر، ابتدا وارد حساب کاربری خود شوید.</p>
    </div>

    <div v-else-if="checkingEligibility" class="flex justify-center py-6">
      <UIcon name="i-lucide-loader-2" class="animate-spin size-8 text-green-500" />
    </div>

    <div v-else-if="!canComment" class="bg-amber-50 p-4 rounded-lg flex items-center gap-3 border border-amber-100">
      <UIcon name="i-lucide-alert-circle" class="text-amber-500 size-5 shrink-0" />
      <p class="text-sm text-amber-800">
        تنها کاربرانی که این محصول را خریداری کرده و سفارش آن‌ها تکمیل شده است، مجاز به ثبت نظر هستند.
      </p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Star Rating -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">امتیاز شما</label>
        <div class="flex gap-1">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="form.rating = star"
            class="focus:outline-none transition-transform active:scale-95"
          >
            <UIcon
              :name="star <= form.rating ? 'i-lucide-star' : 'i-lucide-star'"
              class="size-6 transition-colors"
              :class="star <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'"
            />
          </button>
        </div>
      </div>

      <!-- Comment Text -->
      <div>
        <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">متن دیدگاه</label>
        <UTextarea
          id="comment"
          v-model="form.comment"
          placeholder="تجربه خرید خود را بنویسید..."
          :rows="4"
          required
        />
      </div>

      <div class="flex justify-end">
        <UButton
          type="submit"
          color="primary"
          :loading="submitting"
          icon="i-lucide-send"
        >
          ثبت دیدگاه
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUser } from '~/composables/useUser'
import { listOrders } from '~/services/orderService'
import { createRating } from '~/services/ratingService'

const props = defineProps<{
  productId: string
}>()

const emit = defineEmits(['comment-added'])

const { user, isAuthenticated } = useUser()
const toast = useToast()

const checkingEligibility = ref(true)
const canComment = ref(false)
const submitting = ref(false)

const form = reactive({
  rating: 5,
  comment: ''
})

const checkEligibility = async () => {
  if (!isAuthenticated.value) {
    checkingEligibility.value = false
    return
  }

  try {
    const response = await listOrders({ userId: user.value?.userId })
    const orders = Array.isArray(response) ? response : response.items || []
    
    // Check if any completed order contains this product
    canComment.value = orders.some(order => 
      order.status === 'completed' && 
      order.items.some(item => item.productId === props.productId)
    )
  } catch (err) {
    console.error('Eligibility check failed:', err)
  } finally {
    checkingEligibility.value = false
  }
}

const handleSubmit = async () => {
  if (form.comment.length < 5) {
    toast.add({ title: 'خطا', description: 'متن نظر بسیار کوتاه است', color: 'red' })
    return
  }

  submitting.value = true
  try {
    await createRating({
      productId: props.productId,
      rating: form.rating,
      comment: form.comment
    })
    
    toast.add({ title: 'موفقیت', description: 'دیدگاه شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.', color: 'green' })
    form.comment = ''
    form.rating = 5
    emit('comment-added')
  } catch (err: any) {
    toast.add({ 
      title: 'خطا در ثبت', 
      description: err.response?.data?.message || 'مشکلی پیش آمد', 
      color: 'red' 
    })
  } finally {
    submitting.value = false
  }
}

onMounted(checkEligibility)
</script>
