const mongoose = require("mongoose");

const journalPostSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, trim: true, maxlength: 500 },
    category: { type: String, trim: true, maxlength: 60 },
    date: { type: String, trim: true, maxlength: 10 }, // YYYY-MM-DD
    readTime: { type: String, trim: true, maxlength: 30 },
    image: {
      src: { type: String, trim: true, maxlength: 500 },
      label: { type: String, trim: true, maxlength: 200 },
      tone: { type: String, trim: true, maxlength: 20 },
    },
    relatedService: { type: String, trim: true, maxlength: 60 },
    body: [
      {
        _id: false,
        heading: { type: String, trim: true, maxlength: 200 },
        paragraphs: [{ type: String, maxlength: 5000 }],
      },
    ],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JournalPost", journalPostSchema);
