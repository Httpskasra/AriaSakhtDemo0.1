import { ref } from "vue";

export type AuthStep = "signin" | "signup" | "otp" | null;

const authStep = ref<AuthStep>(null);

const setStep = (step: AuthStep) => {
  authStep.value = step;
};

export const useAuthStep = () => {
  return {
    authStep,
    setStep,
  };
};
