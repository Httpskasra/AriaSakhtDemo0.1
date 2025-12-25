<template>
  <div class="container">
    <img class="mainPic" src="/productpage/communicaiton.png" alt="" />
    <div class="first">
      <h3>تجریه و نظرتان را با ما به اشتراک بگذارید</h3>
      <input
        v-model="form.title"
        type="text"
        placeholder="عنوان نقد و بررسی شما" />
      <div class="inner">
        <Raiting :size="raitingSize" @rate="form.rating = $event" />
        <span>میزان رضایت شما از 1تا5</span>
      </div>
    </div>
    <div class="sec">
      <textarea
        v-model="form.comment"
        rows="10"
        cols="20"
        placeholder=" نقد و بررسی شما"
        resize></textarea>
      <button @click="submitReview" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? "درحال ثبت..." : "ثبت" }}
      </button>
      <div v-if="errorMsg" class="error-message">
        {{ errorMsg }}
      </div>
      <div v-if="successMsg" class="success-message">
        {{ successMsg }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Product } from "~/types/product";
import { createRating } from "@/services/ratingService";
import Raiting from "~/components/userPannel/orders/Raiting.vue";

const props = defineProps<{
  data: Product;
}>();

const isMobile = ref(false);
const isSubmitting = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const form = ref({
  title: "",
  comment: "",
  rating: 0,
});

const checkMobile = () => {
  isMobile.value = window.innerWidth < 767;
};

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});

const raitingSize = computed(() => (isMobile.value ? "18px" : "30px"));

const submitReview = async () => {
  // بررسی validation
  if (!form.value.title.trim()) {
    errorMsg.value = "لطفا عنوان نقد و بررسی را وارد کنید";
    return;
  }
  if (!form.value.comment.trim()) {
    errorMsg.value = "لطفا متن نقد و بررسی را وارد کنید";
    return;
  }
  if (form.value.rating === 0) {
    errorMsg.value = "لطفا امتیاز را انتخاب کنید";
    return;
  }

  isSubmitting.value = true;
  errorMsg.value = "";
  successMsg.value = "";

  try {
    await createRating({
      productId: props.data.id || props.data._id || "",
      title: form.value.title,
      comment: form.value.comment,
      rating: form.value.rating,
    });

    successMsg.value = "نقد و بررسی شما با موفقیت ثبت شد";

    // ریست فرم
    form.value = {
      title: "",
      comment: "",
      rating: 0,
    };

    // پنهان کردن پیام موفقیت بعد از 3 ثانیه
    setTimeout(() => {
      successMsg.value = "";
    }, 3000);
  } catch (err: any) {
    const message =
      err?.message || err?.response?.data?.message || "خطا در ثبت نقد و بررسی";
    errorMsg.value = message;
    console.error("خطا:", err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<style scoped>
.container {
  margin: 120px 0;
  width: 100%;
  min-height: 280px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.mainPic {
  width: 160px;
  height: auto;
  flex-shrink: 0;
}

.first {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.first input {
  padding: 12px 15px;
  background-color: rgba(173, 173, 173, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.first input:focus {
  border-color: var(--yellow-warning);
  background-color: rgba(173, 173, 173, 0.05);
}

.inner {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.inner span {
  font-size: 16px;
  color: #333;
  white-space: nowrap;
}

h3 {
  font-size: 20px;
  color: #333;
  margin: 0;
}

textarea {
  resize: none;
  padding: 15px;
  background-color: rgba(173, 173, 173, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 480px;
  height: 200px;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

textarea:focus {
  border-color: var(--yellow-warning);
  background-color: rgba(173, 173, 173, 0.05);
}

.sec {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 480px;
}

.submit-btn {
  align-self: flex-end;
  padding: 12px 24px;
  background-color: var(--yellow-warning);
  font-family: "iran-yekan-DemiBold", sans-serif;
  color: var(--blue-dark);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #ffc107;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
  font-size: 14px;
  text-align: right;
}

.success-message {
  padding: 12px 15px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  font-size: 14px;
  text-align: right;
}

@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    flex-direction: column;
    height: auto;
    margin: 80px 0;
    padding: 15px;
  }

  .mainPic {
    width: 120px;
    margin-bottom: 15px;
  }

  .first {
    width: 100%;
  }

  .first h3 {
    font-size: 16px;
  }

  .first input {
    font-size: 12px;
    padding: 10px;
  }

  .inner span {
    font-size: 13px;
  }

  .sec {
    width: 100%;
    max-width: none;
  }

  textarea {
    width: 100%;
    max-width: none;
    height: 150px;
    font-size: 12px;
  }

  .submit-btn {
    padding: 10px 20px;
    font-size: 12px;
  }
}

@media (max-width: 767px) {
  .container {
    flex-direction: column;
    margin: 50px 0;
    padding: 12px;
    min-height: auto;
  }

  .mainPic {
    width: 80px;
    margin-bottom: 15px;
  }

  .first {
    width: 100%;
  }

  .first h3 {
    font-size: 14px;
  }

  .first input {
    width: 100%;
    height: auto;
    font-size: 12px;
    padding: 8px 10px;
  }

  .inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .inner span {
    font-size: 12px;
    width: 100%;
  }

  .sec {
    width: 100%;
    max-width: none;
  }

  textarea {
    width: 100%;
    max-width: none;
    height: 120px;
    font-size: 12px;
    padding: 10px;
  }

  .submit-btn {
    padding: 8px 16px;
    font-size: 12px;
    margin-top: 10px;
  }

  .error-message,
  .success-message {
    font-size: 12px;
    padding: 10px 12px;
  }
}
</style>
