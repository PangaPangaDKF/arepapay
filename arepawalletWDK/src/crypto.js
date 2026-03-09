/**
 * crypto.js — Helpers de encriptación para ArepaWallet WDK
 *
 * Convierte el PIN del usuario en una clave AES-256 para cifrar la wallet.
 * Usa Web Crypto API (nativa en browsers modernos y Node 18+).
 *
 * TODO: Implementar completo
 */

const PBKDF2_ITERATIONS = 200_000;
const KEY_LENGTH = 256;

/**
 * Deriva una clave AES-256-GCM desde un PIN y un salt.
 * @param {string} pin - PIN de 6 dígitos del usuario
 * @param {Uint8Array} salt - Salt aleatorio (guardar junto al vault)
 * @returns {Promise<CryptoKey>}
 */
export async function deriveKey(pin, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Cifra datos con AES-256-GCM
 * @param {CryptoKey} key
 * @param {string} plaintext
 * @returns {Promise<{ iv: string, ciphertext: string }>} - Base64
 */
export async function encrypt(key, plaintext) {
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const buf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plaintext));
  return {
    iv:         btoa(String.fromCharCode(...iv)),
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(buf))),
  };
}

/**
 * Descifra datos AES-256-GCM
 * @param {CryptoKey} key
 * @param {string} ivB64 - IV en Base64
 * @param {string} ciphertextB64 - Ciphertext en Base64
 * @returns {Promise<string>}
 */
export async function decrypt(key, ivB64, ciphertextB64) {
  const iv  = Uint8Array.from(atob(ivB64),  c => c.charCodeAt(0));
  const buf = Uint8Array.from(atob(ciphertextB64), c => c.charCodeAt(0));
  const dec = new TextDecoder();
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, buf);
  return dec.decode(plain);
}
