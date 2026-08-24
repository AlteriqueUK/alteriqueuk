const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

/**
 * Cloudflare R2 storage (S3-compatible) for uploaded garment photos.
 * If R2 env vars are not configured, uploads are skipped gracefully so the
 * quote itself is never lost.
 */

const configured =
  process.env.R2_ACCOUNT_ID &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET;

const client = configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

async function uploadPhoto(file) {
  if (!client) return null;
  const ext = (file.originalname.split(".").pop() || "jpg").toLowerCase();
  const key = `quotes/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );
  return key;
}

// The S3 API endpoint only answers signed requests, so using it as the public
// base makes every photo link 400. Ignore it and sign links instead.
function publicBase() {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) return null;
  if (/\.r2\.cloudflarestorage\.com/i.test(base)) {
    console.warn(
      "R2_PUBLIC_URL points at the S3 API endpoint — ignoring it and using presigned links. Set it to the bucket's public r2.dev URL or a custom domain."
    );
    return null;
  }
  return base.replace(/\/$/, "");
}

/**
 * Public link for an uploaded photo. Uses R2_PUBLIC_URL (r2.dev or custom
 * domain on the bucket) when set; otherwise falls back to a presigned URL
 * valid for 7 days — the S3 API maximum.
 */
async function photoUrl(key) {
  if (!key) return null;
  const base = publicBase();
  if (base) {
    return `${base}/${key}`;
  }
  if (!client) return null;
  return getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }),
    { expiresIn: 7 * 24 * 60 * 60 }
  );
}

async function photoUrls(keys) {
  return (await Promise.all((keys || []).map(photoUrl))).filter(Boolean);
}

module.exports = { uploadPhoto, photoUrl, photoUrls, r2Configured: !!configured };
