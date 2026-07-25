import { useState } from "#app";

export const useAuthData = () => {
  const phoneNumber = useState<string>("auth:phone-number", () => "");

  return {
    phoneNumber,
  };
};
