// Formats an ISO date string (YYYY-MM-DD) for display. Parsed manually rather
// than with new Date(value), which treats a bare date as UTC and can therefore
// show the previous day in a negative-offset timezone.
export function formatDate(value) {
  if (!value) return "—";

  const iso = String(value).slice(0, 10);
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return String(value);

  const [, year, month, day] = match;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const monthName = months[Number(month) - 1] || month;
  return `${Number(day)} ${monthName} ${year}`;
}

// Formats a number as Malaysian ringgit, or a dash for missing values. Built by hand rather than with Intl's MYR currency style, because that renders the locale's short symbol "RM" instead of the ISO code the design uses.
export function formatCurrency(value) {
  const number = Number(value);
  if (value === null || value === undefined || Number.isNaN(number)) return "—";
  const formatted = number.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `MYR ${formatted}`;
}

// Formats an integer with thousands separators
export function formatNumber(value) {
  const number = Number(value);
  if (value === null || value === undefined || Number.isNaN(number)) return "—";
  return number.toLocaleString();
}

// Returns today's date as YYYY-MM-DD, for pre-filling date fields
export function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
