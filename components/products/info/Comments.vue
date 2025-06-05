<template>
  <div>
    <div class="container">
      <div class="user">
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00033 8.49998C5.88699 8.49998 4.16699 6.77998 4.16699 4.66665C4.16699 2.55331 5.88699 0.833313 8.00033 0.833313C10.1137 0.833313 11.8337 2.55331 11.8337 4.66665C11.8337 6.77998 10.1137 8.49998 8.00033 8.49998ZM8.00033 1.83331C6.44033 1.83331 5.16699 3.10665 5.16699 4.66665C5.16699 6.22665 6.44033 7.49998 8.00033 7.49998C9.56033 7.49998 10.8337 6.22665 10.8337 4.66665C10.8337 3.10665 9.56033 1.83331 8.00033 1.83331Z"
            fill="#57626D"
          />
          <path
            d="M13.7268 15.1667C13.4534 15.1667 13.2268 14.94 13.2268 14.6667C13.2268 12.3667 10.8801 10.5 8.0001 10.5C5.1201 10.5 2.77344 12.3667 2.77344 14.6667C2.77344 14.94 2.54677 15.1667 2.27344 15.1667C2.0001 15.1667 1.77344 14.94 1.77344 14.6667C1.77344 11.82 4.56677 9.5 8.0001 9.5C11.4334 9.5 14.2268 11.82 14.2268 14.6667C14.2268 14.94 14.0001 15.1667 13.7268 15.1667Z"
            fill="#57626D"
          />
        </svg>
        <span>{{ data.sender }}</span>
      </div>
      <div class="comment">
        <!-- <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 6L15 12L9 18" stroke="#ADADAD" stroke-width="2" />
        </svg> -->
        <p>
          {{ data.comment }}
        </p>
        <!-- <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15 6L9 12L15 18" stroke="#ADADAD" stroke-width="2" />
        </svg> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    sender: string;
    comment: string;
  };
}>();
</script>

<style scoped>
.container {
  width: 100%;
  margin: auto;
  height: 180px;
  padding: 15px;
  background-color: #fff;
  border-radius: 15px;
  position: relative;
  margin-top: 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
}
.user {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  top: 24px;
  margin-right: 15px;
}
.user svg {
  margin-left: 8px;
}
.comment {
  width: 100%;
  position: absolute;
  bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 5px 0 5px;
}
.comment p {
  flex-basis: 90%;
  line-height: 22px;
}
.comment p span {
  color: #adadad;
}
@media (max-width: 767px) {
  .container {
    width: 90%;
    height: 100px;
  }
  .user span {
    font-size: 8px;
  }
  .user svg {
    width: 12px;
    font-size: 10px;
  }
  .comment {
    width: 90%;
  }
  p {
    font-size: 6px;
    line-height: 22px;
    width: 100%;
  }
}
</style>
