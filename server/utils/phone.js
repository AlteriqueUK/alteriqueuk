/**
 * Canonical form of a phone number — digits only, without the country code or
 * trunk prefix. "+44 7887 255558", "0044 7887 255558" and "07887 255558" all
 * reduce to "7887255558", so the same person is recognised however the number
 * was typed. Customers are matched and sorted on this.
 */
function phoneKey(phone) {
  let digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2); // 0044… → 44…
  // Only strip the UK country code from a number long enough to still have one
  if (digits.startsWith("44") && digits.length > 10) digits = digits.slice(2);
  return digits.replace(/^0+/, ""); // 07887… → 7887…
}

function emailKey(email) {
  return String(email || "").trim().toLowerCase();
}

module.exports = { phoneKey, emailKey };
