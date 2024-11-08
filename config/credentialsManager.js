const fs = require("fs");
const path = require("path");
const { encrypt, decrypt } = require("../utils/encryptor");

const credentialsFilePath = path.join(__dirname, "serviceCredentials.enc");

function loadCredentials() {
  if (!fs.existsSync(credentialsFilePath)) {
    throw new Error("Credentials file not found. Please set up credentials.");
  }
  const encryptedData = fs.readFileSync(credentialsFilePath, "utf8");
  const decryptedData = decrypt(encryptedData);
  return JSON.parse(decryptedData);
}

function saveCredentials(service, credentials) {
  let allCredentials = {};

  if (fs.existsSync(credentialsFilePath)) {
    const encryptedData = fs.readFileSync(credentialsFilePath, "utf8");
    const decryptedData = decrypt(encryptedData);
    allCredentials = JSON.parse(decryptedData);
  }

  allCredentials[service] = credentials;

  const encryptedData = encrypt(JSON.stringify(allCredentials));
  fs.writeFileSync(credentialsFilePath, encryptedData, "utf8");
}

module.exports = { loadCredentials, saveCredentials };
