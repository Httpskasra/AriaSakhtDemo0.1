import { useAuthStore } from "~/stores/auth";
import { login } from "~/services/authService";
import { useRouter } from "vue-router";

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const email = ref("");
  const password = ref("");
  const errorMessage = ref("");

  const handleLogin = async () => {
    try {
      console.log("Email:", email.value);
      console.log("Password:", password.value);

      errorMessage.value = "";
      const response = await login(email.value, password.value);

      if (response.data.access_token && response.data.refresh_token) {
        authStore.setTokens(
          response.data.access_token,
          response.data.refresh_token
        );
        router.push("/products");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      errorMessage.value =
        error?.message || "ورود ناموفق بود. لطفاً دوباره تلاش کنید.";
      console.error("Login error:", error);
    }
  };

  return {
    email,
    password,
    errorMessage,
    handleLogin,
  };
}
