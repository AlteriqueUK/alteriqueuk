const Customer = require("../models/Customer");
const { phoneKey, emailKey } = require("./phone");

/**
 * Keeping the customer list free of duplicates.
 *
 * Two records belong to the same person when they share a phone number (in
 * canonical form) or an email address. New records are checked against the
 * list before they are saved; anything that slipped in earlier can be merged
 * from the admin panel.
 */

/** The keys a record can be matched on — "p:" phone, "e:" email. */
function matchKeys(customer) {
  const keys = [];
  const phone = customer.phoneKey || phoneKey(customer.phone);
  const email = emailKey(customer.email);
  if (phone) keys.push(`p:${phone}`);
  if (email) keys.push(`e:${email}`);
  return keys;
}

/**
 * The customer already on file for this phone/email, or null.
 * Returns what it matched on so the panel can explain itself.
 */
async function findDuplicate({ phone, email }, excludeId) {
  const phoneMatch = phoneKey(phone);
  const emailMatch = emailKey(email);
  const or = [];
  if (phoneMatch) or.push({ phoneKey: phoneMatch });
  if (emailMatch) or.push({ email: emailMatch });
  if (!or.length) return null;

  const filter = { $or: or };
  if (excludeId) filter._id = { $ne: excludeId };
  const customer = await Customer.findOne(filter).lean();
  if (!customer) return null;

  return {
    customer,
    matchedOn:
      phoneMatch && customer.phoneKey === phoneMatch
        ? "phone number"
        : "email address",
  };
}

/**
 * Splits the list into groups of the same person. Records are linked
 * transitively: A shares a phone with B, B shares an email with C, so all
 * three are one customer.
 */
function groupDuplicates(customers) {
  const parent = customers.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a, b) => {
    const [ra, rb] = [find(a), find(b)];
    if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb);
  };

  const firstSeen = new Map();
  customers.forEach((customer, i) => {
    for (const key of matchKeys(customer)) {
      if (firstSeen.has(key)) union(firstSeen.get(key), i);
      else firstSeen.set(key, i);
    }
  });

  const groups = new Map();
  customers.forEach((customer, i) => {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(customer);
  });
  return [...groups.values()];
}

const MERGED_FIELDS = ["name", "email", "phone", "address"];

/**
 * The oldest record wins — it keeps its own details and its "Added" date, and
 * anything blank on it is filled in from the newer ones. Comments are kept in
 * full, oldest first, so nothing the workroom wrote down is lost.
 */
function mergedFields(group) {
  const [oldest, ...rest] = group;
  const newestFirst = [...rest].reverse();
  const merged = {};

  for (const field of MERGED_FIELDS) {
    const own = String(oldest[field] || "").trim();
    const fallback = newestFirst.find((c) => String(c[field] || "").trim());
    merged[field] = own || (fallback ? String(fallback[field]).trim() : "");
  }

  const comments = [];
  for (const customer of group) {
    const comment = String(customer.comment || "").trim();
    if (comment && !comments.includes(comment)) comments.push(comment);
  }
  merged.comment = comments.join(" · ").slice(0, 2000);

  return merged;
}

/** Merges every duplicate group in the collection. */
async function mergeDuplicates() {
  const customers = await Customer.find().sort({ createdAt: 1 }).lean();
  const groups = groupDuplicates(customers).filter((group) => group.length > 1);

  let removed = 0;
  for (const group of groups) {
    const [keep, ...rest] = group;
    await Customer.findByIdAndUpdate(keep._id, mergedFields(group), {
      runValidators: true,
    });
    const ids = rest.map((customer) => customer._id);
    await Customer.deleteMany({ _id: { $in: ids } });
    removed += ids.length;
  }

  return { groups: groups.length, removed };
}

/** One-off: fills phoneKey on records saved before the field existed. */
async function backfillPhoneKeys() {
  const stale = await Customer.find({ phoneKey: null }).select("phone").lean();
  if (!stale.length) return 0;
  await Customer.bulkWrite(
    stale.map((customer) => ({
      updateOne: {
        filter: { _id: customer._id },
        update: { $set: { phoneKey: phoneKey(customer.phone) } },
      },
    }))
  );
  return stale.length;
}

module.exports = {
  findDuplicate,
  groupDuplicates,
  mergeDuplicates,
  backfillPhoneKeys,
};
