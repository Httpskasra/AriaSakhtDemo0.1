export interface ContactInquiryDto {
  name: string;
  email: string;
  message: string;
}

export const sendContactInquiry = async (payload: ContactInquiryDto) => {
  const { $axios } = useNuxtApp();
  const { data } = await $axios.post('/contact', payload);
  return data;
};
