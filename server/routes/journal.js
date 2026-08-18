const express = require("express");
const JournalPost = require("../models/JournalPost");

const router = express.Router();

/** Public journal content, consumed by the Next.js site. */

router.get("/", async (req, res, next) => {
  try {
    const posts = await JournalPost.find({ published: true })
      .sort({ date: -1 })
      .select("-__v")
      .lean();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const post = await JournalPost.findOne({
      slug: req.params.slug,
      published: true,
    })
      .select("-__v")
      .lean();
    if (!post) return res.status(404).json({ error: "Not found." });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
