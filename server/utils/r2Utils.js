import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "../config/r2Client.js";

export async function uploadFileToR2({ buffer, key, contentType }) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=10, s-maxage=31536000",
    });

    const response = await r2Client.send(command);

    if (response.$metadata.httpStatusCode !== 200) {
      return false;
    }
    return `https://images.dgdine.in/${key}`;
  } catch (error) {
    return false;
  }
}

export async function deleteFileFromR2({ key }) {
  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }),
  );
}
