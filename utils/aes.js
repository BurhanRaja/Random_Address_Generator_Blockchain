const { encode, decode } = require("js-base64");
const crypto = require("crypto");

exports.encryptAES = async (text, key) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Import the key
  const importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );

  // Generate an IV
  const iv = crypto.getRandomValues(new Uint8Array(16));

  // Encrypt the data
  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    importedKey,
    data
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.byteLength + encryptedData.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.byteLength);

  // Convert to Base64
  const base64String = encode(String.fromCharCode.apply(null, combined));
  return base64String;
};

exports.decryptAES = async (encryptedText, key) => {
  // Convert from Base64
  const bytes = new Uint8Array(
    decode(encryptedText)
      .split("")
      .map((c) => c.charCodeAt(0))
  );

  // Extract IV
  const iv = bytes.slice(0, 16);

  // Extract encrypted data
  const encryptedData = bytes.slice(16);

  // Import the key
  const importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    importedKey,
    encryptedData
  );

  // Convert to string
  const decoder = new TextDecoder();
  const plaintext = decoder.decode(decryptedData);
  return plaintext;
};
