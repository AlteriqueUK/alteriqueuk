const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
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

module.exports = { uploadPhoto, r2Configured: !!configured };
