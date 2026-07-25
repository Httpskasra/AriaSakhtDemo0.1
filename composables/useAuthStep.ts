import { useState } from "#app";

export type AuthStep = "signin" | "signup" | "otp" | null;

export const useAuthStep = () => {
  const authStep = useState<AuthStep>("auth:step", () => null);
  const setStep = (step: AuthStep) => {
    authStep.value = step;
  };

  return {
    authStep,
    setStep,
  };
};
