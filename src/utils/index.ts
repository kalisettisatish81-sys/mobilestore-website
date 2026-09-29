/**
 * Currency formatter for mobile prices in Indian Rupees (₹)
 * Example: ₹49,999
 */
export function formatPrice(price: number | string | undefined | null): string {
  const numericPrice = typeof price === 'number' ? price : Number(price);
  const safePrice = !isNaN(numericPrice) ? numericPrice : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safePrice);
}

/**
 * Formats ISO date string into user-friendly Indian date-time format.
 * Example: "28 Sep 2026, 10:45 PM"
 */
export function formatDateTime(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch {
    return String(dateStr);
  }
}
