import { ref } from "vue";

const phoneNumber = ref<string>("");

export const useAuthData = () => {
  return {
    phoneNumber,
  };
};
