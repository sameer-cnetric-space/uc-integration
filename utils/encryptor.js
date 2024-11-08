const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const encryptionKey = process.env.ENCRYPTION_KEY;
const iv = crypto.randomBytes(16);

if (!encryptionKey || encryptionKey.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be 32 characters long");
}

function encrypt(text) {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = textParts.join(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(encryptionKey),
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encrypt, decrypt };
