import { useState } from "#app";

export type AuthFlow = "signin" | "signup" | null;

export const useAuthData = () => {
  const phoneNumber = useState<string>("auth:phone-number", () => "");
  const nationalId = useState<string>("auth:national-id", () => "");
  const flow = useState<AuthFlow>("auth:flow", () => null);

  return {
    phoneNumber,
    nationalId,
    flow,
  };
};
