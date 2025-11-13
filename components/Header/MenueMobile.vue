<template>
  <div class="menu-item" :class="{ open: isMenuOpen, isScrolled: isScrolled }">
    <ul>
      <li>
        <NuxtLink to="/">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 12.7595C5 11.4018 5 10.7229 5.27446 10.1262C5.54892 9.52943 6.06437 9.08763 7.09525 8.20401L8.09525 7.34687C9.95857 5.74974 10.8902 4.95117 12 4.95117C13.1098 4.95117 14.0414 5.74974 15.9047 7.34687L16.9047 8.20401C17.9356 9.08763 18.4511 9.52943 18.7255 10.1262C19 10.7229 19 11.4018 19 12.7595V16.9999C19 18.8856 19 19.8284 18.4142 20.4142C17.8284 20.9999 16.8856 20.9999 15 20.9999H9C7.11438 20.9999 6.17157 20.9999 5.58579 20.4142C5 19.8284 5 18.8856 5 16.9999V12.7595Z"
              stroke="#253D4E"
              stroke-width="1" />
            <path
              d="M14.5 21V16C14.5 15.4477 14.0523 15 13.5 15H10.5C9.94772 15 9.5 15.4477 9.5 16V21"
              stroke="#253D4E"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
          <span>خانه</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/products">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.5 21V16C14.5 15.4477 14.0523 15 13.5 15H10.5C9.94772 15 9.5 15.4477 9.5 16V21"
              stroke="#253D4E"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M5 11V17C5 18.8856 5 19.8284 5.58579 20.4142C6.17157 21 7.11438 21 9 21H15C16.8856 21 17.8284 21 18.4142 20.4142C19 19.8284 19 18.8856 19 17V11"
              stroke="#253D4E"
              stroke-width="1" />
            <path
              d="M4.62127 4.51493C4.80316 3.78737 4.8941 3.42359 5.16536 3.21179C5.43663 3 5.8116 3 6.56155 3H17.4384C18.1884 3 18.5634 3 18.8346 3.21179C19.1059 3.42359 19.1968 3.78737 19.3787 4.51493L20.5823 9.32938C20.6792 9.71675 20.7276 9.91044 20.7169 10.0678C20.6892 10.4757 20.416 10.8257 20.0269 10.9515C19.8769 11 19.6726 11 19.2641 11V11C18.7309 11 18.4644 11 18.2405 10.9478C17.6133 10.8017 17.0948 10.3625 16.8475 9.76781C16.7593 9.55555 16.7164 9.29856 16.6308 8.78457V8.78457C16.6068 8.64076 16.5948 8.56886 16.5812 8.54994C16.5413 8.49439 16.4587 8.49439 16.4188 8.54994C16.4052 8.56886 16.3932 8.64076 16.3692 8.78457L16.2877 9.27381C16.2791 9.32568 16.2747 9.35161 16.2704 9.37433C16.0939 10.3005 15.2946 10.9777 14.352 10.9995C14.3289 11 14.3026 11 14.25 11V11C14.1974 11 14.1711 11 14.148 10.9995C13.2054 10.9777 12.4061 10.3005 12.2296 9.37433C12.2253 9.35161 12.2209 9.32568 12.2123 9.27381L12.1308 8.78457C12.1068 8.64076 12.0948 8.56886 12.0812 8.54994C12.0413 8.49439 11.9587 8.49439 11.9188 8.54994C11.9052 8.56886 11.8932 8.64076 11.8692 8.78457L11.7877 9.27381C11.7791 9.32568 11.7747 9.35161 11.7704 9.37433C11.5939 10.3005 10.7946 10.9777 9.85199 10.9995C9.82887 11 9.80258 11 9.75 11V11C9.69742 11 9.67113 11 9.64801 10.9995C8.70541 10.9777 7.90606 10.3005 7.7296 9.37433C7.72527 9.35161 7.72095 9.32568 7.7123 9.27381L7.63076 8.78457C7.60679 8.64076 7.59481 8.56886 7.58122 8.54994C7.54132 8.49439 7.45868 8.49439 7.41878 8.54994C7.40519 8.56886 7.39321 8.64076 7.36924 8.78457V8.78457C7.28357 9.29856 7.24074 9.55555 7.15249 9.76781C6.90524 10.3625 6.38675 10.8017 5.75951 10.9478C5.53563 11 5.26905 11 4.73591 11V11C4.32737 11 4.12309 11 3.97306 10.9515C3.58403 10.8257 3.31078 10.4757 3.28307 10.0678C3.27239 9.91044 3.32081 9.71675 3.41765 9.32938L4.62127 4.51493Z"
              stroke="#253D4E"
              stroke-width="1" />
          </svg>
          <span>محصولات</span></NuxtLink
        >
      </li>
      <li>
        <NuxtLink to="/">
          <nav class="mobile-menu">
            <!-- آیتم اصلی که والدها را باز می‌کند -->
            <button
              class="toggle-cats"
              @click="toggleCategories"
              :aria-expanded="catsOpen">
              <img src="/dashboardIcons/categories.svg" alt="" />
              دسته‌بندی‌ها
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  :d="catsOpen ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>

            <div v-if="loading" class="loading">درحال بارگذاری...</div>

            <transition name="fade">
              <div v-if="catsOpen && !loading" class="parents-wrapper">
                <MobileCategoryItem
                  v-for="parent in parents"
                  :key="getId(parent)"
                  :category="parent"
                  :children="childrenMap[getId(parent)] ?? []"
                  @child-click="onChildClick" />
              </div>
            </transition>
          </nav>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/contact">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.7071 13.7071L20.3552 16.3552C20.7113 16.7113 20.7113 17.2887 20.3552 17.6448C18.43 19.57 15.3821 19.7866 13.204 18.153L11.6286 16.9714C9.88504 15.6638 8.33622 14.115 7.02857 12.3714L5.84701 10.796C4.21341 8.61788 4.43001 5.56999 6.35523 3.64477C6.71133 3.28867 7.28867 3.28867 7.64477 3.64477L10.2929 6.29289C10.6834 6.68342 10.6834 7.31658 10.2929 7.70711L9.27175 8.72825C9.10946 8.89054 9.06923 9.13846 9.17187 9.34373C10.3585 11.7171 12.2829 13.6415 14.6563 14.8281C14.8615 14.9308 15.1095 14.8905 15.2717 14.7283L16.2929 13.7071C16.6834 13.3166 17.3166 13.3166 17.7071 13.7071Z"
              stroke="#253D4E" />
          </svg>
          <span>ارتباط با ما </span></NuxtLink
        >
      </li>
      <li>
        <NuxtLink to="/about"
          ><svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="8"
              r="3"
              stroke="#253D4E"
              stroke-width="1"
              stroke-linecap="round" />
            <path
              d="M15.2679 8C15.5332 7.54063 15.97 7.20543 16.4824 7.06815C16.9947 6.93086 17.5406 7.00273 18 7.26795C18.4594 7.53317 18.7946 7.97 18.9319 8.48236C19.0691 8.99472 18.9973 9.54063 18.7321 10C18.4668 10.4594 18.03 10.7946 17.5176 10.9319C17.0053 11.0691 16.4594 10.9973 16 10.7321C15.5406 10.4668 15.2054 10.03 15.0681 9.51764C14.9309 9.00528 15.0027 8.45937 15.2679 8L15.2679 8Z"
              stroke="#253D4E"
              stroke-width="1" />
            <path
              d="M5.26795 8C5.53317 7.54063 5.97 7.20543 6.48236 7.06815C6.99472 6.93086 7.54063 7.00273 8 7.26795C8.45937 7.53317 8.79457 7.97 8.93185 8.48236C9.06914 8.99472 8.99727 9.54063 8.73205 10C8.46683 10.4594 8.03 10.7946 7.51764 10.9319C7.00528 11.0691 6.45937 10.9973 6 10.7321C5.54063 10.4668 5.20543 10.03 5.06815 9.51764C4.93086 9.00528 5.00273 8.45937 5.26795 8L5.26795 8Z"
              stroke="#253D4E"
              stroke-width="1" />
            <path
              d="M16.8816 18L15.9012 18.1974L16.0629 19H16.8816V18ZM20.7201 16.9042L21.6626 16.5699L20.7201 16.9042ZM14.7808 14.7105L14.1759 13.9142L13.0193 14.7927L14.2526 15.5597L14.7808 14.7105ZM19.8672 17H16.8816V19H19.8672V17ZM19.7777 17.2384C19.7706 17.2186 19.7641 17.181 19.7725 17.1354C19.7803 17.0921 19.7982 17.0593 19.8151 17.0383C19.8473 16.9982 19.8739 17 19.8672 17V19C21.0132 19 22.1413 17.9194 21.6626 16.5699L19.7777 17.2384ZM17 15C18.6415 15 19.4026 16.1811 19.7777 17.2384L21.6626 16.5699C21.1976 15.2588 19.9485 13 17 13V15ZM15.3856 15.5069C15.7701 15.2148 16.2819 15 17 15V13C15.8381 13 14.9027 13.3622 14.1759 13.9142L15.3856 15.5069ZM14.2526 15.5597C15.2918 16.206 15.727 17.3324 15.9012 18.1974L17.8619 17.8026C17.6439 16.7204 17.0374 14.9364 15.3089 13.8614L14.2526 15.5597Z"
              fill="#253D4E" />
            <path
              d="M9.21924 14.7105L9.74736 15.5597L10.9807 14.7927L9.82409 13.9142L9.21924 14.7105ZM3.27986 16.9041L4.22233 17.2384L4.22233 17.2384L3.27986 16.9041ZM7.11841 18V19H7.93709L8.09873 18.1974L7.11841 18ZM7.00008 15C7.71809 15 8.22992 15.2148 8.61439 15.5069L9.82409 13.9142C9.09729 13.3621 8.16196 13 7.00008 13V15ZM4.22233 17.2384C4.59738 16.1811 5.35849 15 7.00008 15V13C4.05157 13 2.80244 15.2587 2.33739 16.5699L4.22233 17.2384ZM4.13284 17C4.12606 17 4.1527 16.9982 4.18492 17.0383C4.20182 17.0593 4.21967 17.0921 4.22754 17.1354C4.23586 17.181 4.22937 17.2186 4.22233 17.2384L2.33739 16.5699C1.8587 17.9194 2.98683 19 4.13284 19V17ZM7.11841 17H4.13284V19H7.11841V17ZM8.09873 18.1974C8.27295 17.3324 8.7082 16.206 9.74736 15.5597L8.69112 13.8614C6.96263 14.9363 6.35606 16.7203 6.1381 17.8026L8.09873 18.1974Z"
              fill="#253D4E" />
            <path
              d="M12 14C15.5715 14 16.5919 16.5512 16.8834 18.0089C16.9917 18.5504 16.5523 19 16 19H8C7.44772 19 7.00829 18.5504 7.11659 18.0089C7.4081 16.5512 8.42846 14 12 14Z"
              stroke="#253D4E"
              stroke-width="1"
              stroke-linecap="round" />
          </svg>
          <span>درباره ما </span></NuxtLink
        >
      </li>
      <li>
        <NuxtLink to="/collabration">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <title />

            <g
              fill="none"
              fill-rule="evenodd"
              id="页面-1"
              stroke="none"
              stroke-width="1">
              <g id="导航图标" transform="translate(-250.000000, -15.000000)">
                <g id="编组" transform="translate(249.000000, 15.000000)">
                  <polygon
                    fill="#253D4EFF"
                    fill-opacity="0.01"
                    fill-rule="nonzero"
                    id="路径"
                    points="26 0 0 0 0 26 26 26" />

                  <path
                    d="M13,21.6666667 L19.5,15.1666667 L17.3333333,17.3333333 L15.1666667,19.5 L13,21.6666667 Z M13,21.6666667 L2.16666667,10.8333333 L8.66666667,4.33333333 L13,8.66666667"
                    id="形状"
                    stroke="#253D4E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5" />

                  <path
                    d="M9.20833333,12.4583333 L17.3333333,4.33333333 L23.8333333,10.8333333 L19.5,15.1666667 L15.1666667,10.8333333 L11.9166667,14.0833333 L9.20833333,12.4583333 Z M9.20833333,12.4583333 L13,8.66666667"
                    id="形状"
                    stroke="#253D4E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5" />

                  <line
                    id="路径"
                    stroke="#253D4E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    x1="15.1666667"
                    x2="13.5416667"
                    y1="19.5"
                    y2="17.875" />

                  <line
                    id="路径"
                    stroke="#253D4E"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    x1="17.3333333"
                    x2="15.7083333"
                    y1="17.3333333"
                    y2="15.7083333" />
                </g>
              </g>
            </g>
          </svg>
          <span>همکاری</span>
        </NuxtLink>
      </li>
      <li>
        <button class="close" @click="$emit('update:isMenuOpen', false)">
          بستن x
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineEmits(["update:isMenuOpen"]);

defineProps({
  isMenuOpen: {
    type: Boolean,
    default: false,
  },
  isScrolled: {
    type: Boolean,
    default: false,
  },
});
import { ref, computed, onMounted } from "vue";
import MobileCategoryItem from "./MobileCategoryItem.vue";
import { useCategories } from "@/composables/useCategories";
import type { Category } from "~/services/categories";

const { categories, loading, load, error } = useCategories();

const catsOpen = ref(false);

function toggleCategories() {
  catsOpen.value = !catsOpen.value;
  // اگر باز شد و داده لود نشده، لود کن
  if (catsOpen.value && categories.value.length === 0) {
    load().catch((e) => console.error("failed to load categories", e));
  }
}

// normalize id helper
function getId(c: any) {
  return c._id ?? c.id ?? String(c.name);
}

// parents: دسته‌هایی که parentId ندارند یا null/''/undefined
const parents = computed(() => {
  return categories.value.filter(
    (c: any) => !c.parentId && c.status !== "draft"
  );
});

// children map: parentId -> array(children)
const childrenMap = computed(() => {
  const map: Record<string, Category[]> = {};
  for (const c of categories.value) {
    const pid = c.parentId ?? null;
    if (!pid) continue;
    const key = String(pid);
    if (!map[key]) map[key] = [];
    map[key].push(c);
  }
  return map;
});

// رویداد وقتی کاربر روی یک فرزند تپ می‌کند
function onChildClick(child: Category) {
  // این تابع را طبق نیازت تغییر بده: روت کردن، بستن منو و ...
  console.log("child clicked", child);
  // مثلا: router.push({ name: 'Category', params: { slug: child.slug } });
  // و سپس منو را ببند
  catsOpen.value = false;
}

onMounted(() => {
  // اگر می‌خواهی قبل از باز شدن لود کنی، از اینجا load کن
  // load();
});
</script>

<style scoped>
.menu-item {
  font-family: "iran-yekan-Bold";
  color: var(--blue-dark);
  position: fixed;
  top: 150px;
  right: -500px;
  width: 50%;
  height: 100%;
  background-color: #fff;
  z-index: 100;
  transition: 0.5s;
  padding: 20px;
  padding-top: 30px;
}
.menu-item.isScrolled {
  top: 70px;
}
.menu-item.open {
  right: 0px;
}
ul {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
li {
  padding: 15px 0;
}
li a {
  text-align: right;
  width: 80%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  text-decoration: none;
  font-size: 14px;
  padding: 10px 0;
}
svg {
  margin-left: 13px;
  color: var(--blue-dark);
}
.close {
  color: var(--red-danger);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 8px;
}
.close:hover {
  opacity: 0.8;
}
.toggle-cats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  /* padding: 10px 6px; */
  font-weight: 700;
  cursor: pointer;
}
.parents-wrapper {
  margin-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: #fff;
}
.loading {
  padding: 12px;
  color: #666;
}

/* fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.toggle-cats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toggle-cats img {
  width: 24px;
  height: 24px;
  margin-left: 10px;
}
</style>
