const mongoose = require("mongoose");

const quoteRequestSchema = new mongoose.Schema(
  {
    service: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 40 },
    email: { type: String, trim: true, lowercase: true, maxlength: 200 },
    photoKeys: [{ type: String }], // R2 object keys
    status: {
      type: String,
      enum: ["new", "quoted", "accepted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuoteRequest", quoteRequestSchema);
