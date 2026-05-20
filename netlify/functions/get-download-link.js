/**
 * GET /.netlify/functions/get-download-link?token=<download_token>
 *
 * Validates a signed download token and serves the PDF file.
 *
 * For production, consider hosting PDFs in a private S3 bucket and signing URLs
 * via AWS SDK rather than streaming through this function.
 *
 * Required env vars:
 *   LICENSE_SIGNING_SECRET   — see _lib/license.js
 */

const fs = require("fs");
const path = require("path");
const { verifyToken } = require("./_lib/license.js");

// Where the actual PDF files live (relative to function bundle).
// Netlify includes files via netlify.toml `included_files` setting.
const PRODUCTS_ROOT = path.join(__dirname, "..", "..", "products");

exports.handler = async (event) => {
  const token = event.queryStringParameters?.token;
  if (!token) {
    return { statusCode: 400, body: "Missing token" };
  }

  const payload = verifyToken(token);
  if (!payload || payload.type !== "download") {
    return { statusCode: 403, body: "Invalid or expired token" };
  }

  const { file } = payload;
  if (!file || file.includes("..") || file.startsWith("/")) {
    return { statusCode: 400, body: "Invalid file reference" };
  }

  const fullPath = path.join(PRODUCTS_ROOT, file);

  // Defense in depth: confirm resolved path is still within PRODUCTS_ROOT
  if (!fullPath.startsWith(PRODUCTS_ROOT)) {
    return { statusCode: 400, body: "Invalid path" };
  }

  if (!fs.existsSync(fullPath)) {
    console.warn("[get-download-link] file not found:", fullPath);
    return { statusCode: 404, body: "File not found" };
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const filename = path.basename(file);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store, max-age=0",
    },
    body: fileBuffer.toString("base64"),
    isBase64Encoded: true,
  };
};
