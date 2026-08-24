import { useState } from "#app";
import { useAuthData } from "~/composables/useAuthData";

export type AuthStep = "signin" | "signup" | "otp" | null;

export const useAuthStep = () => {
  const authStep = useState<AuthStep>("auth:step", () => null);
  const { clearAuthData } = useAuthData();
  const setStep = (step: AuthStep) => {
    authStep.value = step;
    if (step === null) clearAuthData();
  };

  return {
    authStep,
    setStep,
  };
};
