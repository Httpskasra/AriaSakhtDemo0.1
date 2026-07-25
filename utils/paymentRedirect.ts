const DEFAULT_ALLOWED_PAYMENT_ORIGINS = [
  'https://gateway.zibal.ir',
  'https://sandbox.zibal.ir',
];

/** Return an absolute HTTPS payment URL only when its exact origin is trusted. */
export function getValidatedPaymentUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const configuredOrigins = useRuntimeConfig().public.paymentAllowedOrigins;
  const allowedOrigins = Array.isArray(configuredOrigins) && configuredOrigins.length > 0
    ? configuredOrigins
    : DEFAULT_ALLOWED_PAYMENT_ORIGINS;

  if (url.protocol !== 'https:' || !allowedOrigins.includes(url.origin)) {
    return null;
  }

  return url.toString();
}
