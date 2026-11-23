/**
 * Helper utility functions
 */

import { format, parseISO } from 'date-fns';

/**
 * Format a date string for display
 */
export function formatDate(dateStr, pattern = 'dd MMM yyyy') {
  try {
    if (!dateStr) return 'N/A';
    const d = dateStr.includes('T') ? parseISO(dateStr) : new Date(dateStr);
    return format(d, pattern);
  } catch {
    return dateStr;
  }
}

/**
 * Format a time string
 */
export function formatTime(timeStr) {
  try {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${String(minutes).padStart(2, '0')} ${ampm}`;
  } catch {
    return timeStr;
  }
}

/**
 * Get greeting based on time of day
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Get color for attendance percentage
 */
export function getAttendanceColor(percentage, colors) {
  if (percentage >= 75) return colors.success;
  if (percentage >= 50) return colors.warning;
  return colors.error;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str, maxLength = 30) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format confidence for display
 */
export function formatConfidence(value) {
  const n = parseFloat(value) || 0;
  return `${Math.round(n)}%`;
}

/**
 * Check if network error
 */
export function isNetworkError(error) {
  return error?.message === 'Network Error' || error?.code === 'ECONNABORTED';
}

/**
 * Extract API error message
 */
export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (isNetworkError(error)) return 'Cannot connect to server. Check your internet connection.';
  return error?.response?.data?.message || error?.message || fallback;
}
