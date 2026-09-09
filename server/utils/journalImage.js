const { photoUrl } = require("../config/r2");

/**
 * Pictures uploaded from the admin panel are stored as R2 object keys rather
 * than URLs: unless the bucket has a public domain, the only link R2 gives us
 * is presigned and expires within a week. Resolving the link on every read
 * keeps journal images working forever, and means adding R2_PUBLIC_URL later
 * upgrades every existing article automatically.
 */
async function withImageUrl(post) {
  if (!post || !post.image || !post.image.key) return post;
  const src = await photoUrl(post.image.key);
  return src ? { ...post, image: { ...post.image, src } } : post;
}

async function withImageUrls(posts) {
  return Promise.all(posts.map((post) => withImageUrl(post)));
}

module.exports = { withImageUrl, withImageUrls };
