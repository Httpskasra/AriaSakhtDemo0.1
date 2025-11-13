/**
 * تبدیل شماره تماس به فرمت بین‌المللی
 * مثال‌ها:
 * - "0910" => "+989..."
 * - "9101234567" => "+989101234567"
 * - "989101234567" => "+989101234567"
 */
export const toInternationalPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("0")) return "+98" + digits.slice(1);
  if (digits.startsWith("9")) return "+98" + digits;
  if (digits.startsWith("98")) return "+" + digits;

  return phone;
};

/**
 * تبدیل شماره تماس به فرمت ملی (09xxxxxxxxx)
 * مثال‌ها:
 * - "+989101234567" => "09101234567"
 * - "989101234567" => "09101234567"
 * - "9101234567" => "09101234567"
 */
export const toNationalPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");

  // اگر با 98 شروع شود (پیش‌فیکس بین‌المللی)
  if (digits.startsWith("98")) {
    return "0" + digits.slice(2);
  }

  // اگر با 9 شروع شود
  if (digits.startsWith("9")) {
    return "0" + digits;
  }

  // اگر قبلاً 09 است
  if (digits.startsWith("09")) {
    return digits;
  }

  return phone;
};

/**
 * تنظیف و اعتبارسنجی شماره تماس
 * بررسی می‌کند که شماره معتبر ایرانی است
 */
export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");

  // شماره باید 10 یا 12 رقم باشد
  if (digits.length === 10 && digits.startsWith("9")) {
    return true; // 9xxxxxxxxx
  }
  if (digits.length === 11 && digits.startsWith("09")) {
    return true; // 09xxxxxxxxx
  }
  if (digits.length === 12 && digits.startsWith("98")) {
    return true; // 989xxxxxxxxx
  }
  if (digits.length === 13 && digits.startsWith("+98")) {
    return true; // +989xxxxxxxxx
  }

  return false;
};

/**
 * نمایش شماره تماس به فرمت خوانا
 * مثال: "09101234567" => "0910 123 4567"
 */
export const formatPhoneForDisplay = (phone: string): string => {
  const national = toNationalPhone(phone);
  const digits = national.replace(/\D/g, "");

  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  return national;
};
