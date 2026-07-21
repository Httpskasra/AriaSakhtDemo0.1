/**
 * Centralized Date and Time formatting utilities for the Tejaris platform.
 * Uses Intl.DateTimeFormat for robust Persian (fa-IR) localization.
 */

export const formatDate = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return '---';
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'تاریخ نامعتبر';
    
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (e) {
    return '---';
  }
};

export const formatTime = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return '--:--';
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return '--:--';

    return new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (e) {
    return '--:--';
  }
};

export const formatFullDateTime = (dateValue: string | Date | undefined): string => {
  if (!dateValue) return '---';
  return `${formatDate(dateValue)} - ${formatTime(dateValue)}`;
};
