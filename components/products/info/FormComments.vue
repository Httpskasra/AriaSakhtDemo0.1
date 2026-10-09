<template>
  <section class="product-comment-form" aria-labelledby="comment-form-title">
    <header class="product-comment-form__header">
      <div>
        <span class="product-comment-form__eyebrow">بازخورد خریداران</span>
        <h3 id="comment-form-title">ثبت دیدگاه و امتیاز</h3>
      </div>
      <UIcon name="i-lucide-message-square-plus" aria-hidden="true" />
    </header>

    <div v-if="!isAuthenticated" class="product-comment-state product-comment-state--info">
      <UIcon name="i-lucide-info" aria-hidden="true" />
      <p>برای ثبت نظر، ابتدا وارد حساب کاربری خود شوید.</p>
    </div>

    <div v-else-if="checkingEligibility" class="product-comment-state product-comment-state--loading" role="status" aria-live="polite">
      <UIcon name="i-lucide-loader-circle" class="animate-spin" aria-hidden="true" />
      <p>در حال بررسی شرایط ثبت دیدگاه…</p>
    </div>

    <div v-else-if="!canComment" class="product-comment-state product-comment-state--warning">
      <UIcon name="i-lucide-circle-alert" aria-hidden="true" />
      <p>تنها کاربرانی که این محصول را خریداری کرده و سفارش آن‌ها تکمیل شده است، مجاز به ثبت نظر هستند.</p>
    </div>

    <form v-else class="product-comment-form__fields" @submit.prevent="handleSubmit">
      <fieldset class="product-comment-form__rating">
        <legend>امتیاز شما</legend>
        <div class="product-comment-form__stars" role="radiogroup" aria-label="امتیاز شما از یک تا پنج">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            role="radio"
            :aria-checked="form.rating === star"
            :aria-label="`امتیاز ${star} از ۵`"
            :tabindex="form.rating === star ? 0 : -1"
            @click="form.rating = star"
            @keydown="handleRatingKeydown($event, star)"
          >
            <UIcon name="i-lucide-star" :class="{ 'product-comment-form__star--active': star <= form.rating }" aria-hidden="true" />
          </button>
        </div>
      </fieldset>

      <div class="product-comment-form__message">
        <label for="comment">متن دیدگاه</label>
        <UTextarea id="comment" v-model="form.comment" placeholder="تجربه خرید خود را بنویسید..." :rows="4" required />
      </div>

      <div class="product-comment-form__actions">
        <UButton type="submit" color="primary" :loading="submitting" icon="i-lucide-send">ثبت دیدگاه</UButton>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useUser } from '~/composables/useUser'
import { listOrders } from '~/services/orderService'
import { OrderStatus } from '~/types/order'
import { createRating } from '~/services/ratingService'
import { toUserFacingError } from '~/services/apiClient'

const props = defineProps<{
  productId: string
}>()

const emit = defineEmits(['comment-added'])

const { user, isAuthenticated, isUserLoading } = useUser()
const toast = useToast()

const checkingEligibility = ref(true)
const canComment = ref(false)
const submitting = ref(false)

const form = reactive({
  rating: 5,
  comment: ''
})

const checkEligibility = async () => {
  checkingEligibility.value = true
  if (!isAuthenticated.value) {
    checkingEligibility.value = false
    return
  }

  try {
    const response = await listOrders({ userId: user.value?.userId })
    const orders = Array.isArray(response) ? response : response.items || []
    
    // A delivered order is eligible for a product comment.
    canComment.value = orders.some(order => 
      order.status === OrderStatus.Delivered &&
      order.items.some(item => {
        const productId = typeof item.productId === 'string' ? item.productId : item.productId?._id || item.productId?.id
        return productId === props.productId
      })
    )
  } catch (err) {
    console.error('Eligibility check failed:', err)
    canComment.value = false
  } finally {
    checkingEligibility.value = false
  }
}

const handleSubmit = async () => {
  if (form.comment.length < 5) {
    toast.add({ title: 'خطا', description: 'متن نظر بسیار کوتاه است', color: 'error' })
    return
  }

  submitting.value = true
  try {
    await createRating({
      productId: props.productId,
      rating: form.rating,
      comment: form.comment
    })
    
    toast.add({ title: 'موفقیت', description: 'دیدگاه شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.', color: 'success' })
    form.comment = ''
    form.rating = 5
    emit('comment-added')
  } catch (err: any) {
    const apiError = toUserFacingError(err, 'ثبت دیدگاه فعلاً ممکن نیست.')
    toast.add({ 
      title: 'خطا در ثبت', 
      description: apiError.message,
      color: 'error'
    })
  } finally {
    submitting.value = false
  }
}

watch([isAuthenticated, isUserLoading], ([authenticated, loading]) => {
  if (loading) return
  if (!authenticated) {
    checkingEligibility.value = false
    canComment.value = false
    return
  }
  void checkEligibility()
}, { immediate: true })

function handleRatingKeydown(event: KeyboardEvent, current: number) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  event.preventDefault()
  const next = event.key === 'Home' ? 1 : event.key === 'End' ? 5 : Math.min(5, Math.max(1, current + (event.key === 'ArrowLeft' ? 1 : -1)))
  form.rating = next
  requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[aria-label="امتیاز ${next} از ۵"]`)?.focus())
}
</script>

<style scoped>
.product-comment-form { display: grid; gap: 1rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--color-border); }
.product-comment-form__header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.product-comment-form__header > svg { color: var(--color-brand-blue); }
.product-comment-form__eyebrow { display: block; margin-bottom: .25rem; color: var(--color-text-muted); font-size: .7rem; font-weight: var(--font-weight-bold); }
.product-comment-form h3 { margin: 0; color: var(--color-text-heading); font-size: 1rem; font-weight: var(--font-weight-extrabold); }
.product-comment-state { display: flex; align-items: flex-start; gap: .65rem; padding: .85rem 1rem; border-radius: var(--radius-field); line-height: 1.8; }
.product-comment-state svg { flex: 0 0 auto; margin-top: .2rem; }
.product-comment-state p { margin: 0; font-size: .8rem; }
.product-comment-state--info { color: var(--color-info-fg); background: var(--color-info-bg); }
.product-comment-state--warning { color: var(--color-warning-fg); background: var(--color-warning-bg); }
.product-comment-state--loading { justify-content: center; color: var(--color-text-muted); }
.product-comment-form__fields { display: grid; gap: 1rem; }
.product-comment-form__rating { margin: 0; padding: 0; border: 0; }
.product-comment-form__rating legend, .product-comment-form__message label { display: block; margin-bottom: .45rem; color: var(--color-text-heading); font-size: .8rem; font-weight: var(--font-weight-extrabold); }
.product-comment-form__stars { display: inline-flex; gap: .2rem; direction: rtl; }
.product-comment-form__stars button { display: inline-grid; min-width: 2.2rem; min-height: 2.2rem; place-items: center; border-radius: var(--radius-field); color: var(--color-border-strong); }
.product-comment-form__stars button:hover, .product-comment-form__stars button:focus-visible { color: var(--color-brand-yellow); background: var(--color-bg-light); }
.product-comment-form__stars button:focus-visible { outline: none; box-shadow: var(--focus-ring); }
.product-comment-form__stars svg { width: 1.2rem; height: 1.2rem; }
.product-comment-form__star--active { color: var(--color-brand-yellow); fill: currentColor; }
.product-comment-form__message :deep(textarea) { width: 100%; }
.product-comment-form__actions { display: flex; justify-content: flex-start; }
@media (max-width: 640px) { .product-comment-form__actions { justify-content: stretch; } .product-comment-form__actions :deep(button) { width: 100%; } }
</style>
