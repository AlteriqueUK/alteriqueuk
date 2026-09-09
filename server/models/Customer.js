const mongoose = require("mongoose");
const { phoneKey } = require("../utils/phone");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    email: { type: String, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 40 },
    /**
     * Canonical phone number (see utils/phone.js) — what duplicates are
     * matched on and what the customer list is sorted by. Derived from
     * `phone` by the hooks below, never set by hand.
     */
    phoneKey: { type: String, trim: true, maxlength: 40, index: true },
    address: { type: String, trim: true, maxlength: 500 },
    comment: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

customerSchema.pre("validate", function (next) {
  this.phoneKey = phoneKey(this.phone);
  next();
});

customerSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (!update) return next();
  // The phone can arrive at the top level or inside $set (the timestamps
  // plugin has already added a $set of its own by the time this runs)
  for (const fields of [update, update.$set]) {
    if (fields && "phone" in fields) fields.phoneKey = phoneKey(fields.phone);
  }
  this.setUpdate(update);
  next();
});

module.exports = mongoose.model("Customer", customerSchema);
