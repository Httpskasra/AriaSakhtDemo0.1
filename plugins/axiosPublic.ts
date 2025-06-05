import axios, { type AxiosInstance } from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const publicApi: AxiosInstance = axios.create({
    baseURL: config.public.apiBase as string,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  nuxtApp.provide("publicAxios", publicApi);
});
