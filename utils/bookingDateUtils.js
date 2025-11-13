// utils/bookingDateUtils.js
// Shared helpers for booking form input + validation.
// Keeps BookingScreen simple and focused on UI only.

// durations shown as quick-select pills
export const DURATIONS = [30, 45, 60, 90];

// remove any non-numeric characters
export function digitsOnly(s = "") {
  return s.replace(/\D+/g, "");
}

// live-format into "YYYY-MM-DD" while typing
export function formatDateInput(raw) {
  const d = digitsOnly(raw).slice(0, 8); // YYYYMMDD
  const y = d.slice(0, 4);
  const m = d.slice(4, 6);
  const day = d.slice(6, 8);

  let out = y;
  if (m.length) out += "-" + m;
  if (day.length) out += "-" + day;
  return out;
}

// live-format into "HH:mm" (24h) with clamping to valid ranges
export function formatTimeInput(raw) {
  let d = digitsOnly(raw).slice(0, 4); // HHmm
  let h = d.slice(0, 2);
  let m = d.slice(2, 4);

  if (h.length === 2)
    h = String(Math.max(0, Math.min(23, +h))).padStart(2, "0");

  if (m.length === 2)
    m = String(Math.max(0, Math.min(59, +m))).padStart(2, "0");

  return m.length ? `${h}:${m}` : h;
}

// simple format validators
export const isValidDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
export const isValidTime = (s) => /^\d{2}:\d{2}$/.test(s);

// check if an ISO datetime is in the future
export const isFuture = (iso) => new Date(iso).getTime() > Date.now();

// build an ISO datetime string from form fields (local timezone)
export function buildStartISO(dateStr, timeStr) {
  const [yy, mm, dd] = dateStr.split("-").map(Number);
  const [HH, MM] = timeStr.split(":").map(Number);

  if (!yy || !mm || !dd || HH === undefined || MM === undefined) return null;

  const local = new Date(yy, mm - 1, dd, HH, MM, 0);
  return local.toISOString();
}

// same as above buildSartISO but returns a Date object (for notifications)
export function getBookingStartDate(dateStr, timeStr) {
  const [yy, mm, dd] = dateStr.split("-").map(Number);
  const [HH, MM] = timeStr.split(":").map(Number);

  if (!yy || !mm || !dd || HH === undefined || MM === undefined) return null;

  return new Date(yy, mm - 1, dd, HH, MM, 0);
}
