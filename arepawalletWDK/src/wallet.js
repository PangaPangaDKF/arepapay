/**
 * wallet.js — Gestión de wallet embebida para ArepaWallet WDK
 *
 * Flujo:
 *  1. createWallet(pin) → genera wallet aleatoria, cifra con PIN, guarda en storage
 *  2. unlockWallet(pin) → descifra vault, devuelve Wallet (ethers.js)
 *  3. getAddress()      → dirección pública (no requiere PIN)
 *
 * El vault cifrado se guarda en localStorage (browser) o en archivo (Node).
 * La clave NUNCA sale del dispositivo en texto plano.
 *
 * TODO: Implementar completo + integrar con WDK MCP Server
 */

import { ethers } from "ethers";
import { deriveKey, encrypt, decrypt } from "./crypto.js";
import { AREPAPAY_NETWORK } from "./network.js";

const VAULT_KEY     = "arepawallet_vault";
const ADDRESS_KEY   = "arepawallet_address";

/**
 * Crea una wallet nueva, la cifra con el PIN y guarda el vault.
 * @param {string} pin - 6 dígitos
 * @returns {Promise<{ address: string, mnemonic: string }>}
 */
export async function createWallet(pin) {
  // Generar wallet aleatoria con ethers
  const wallet = ethers.Wallet.createRandom();
  const mnemonic = wallet.mnemonic.phrase;

  // Cifrar la seed con el PIN
  const salt    = crypto.getRandomValues(new Uint8Array(16));
  const key     = await deriveKey(pin, salt);
  const { iv, ciphertext } = await encrypt(key, mnemonic);

  // Guardar vault
  const vault = {
    salt:       btoa(String.fromCharCode(...salt)),
    iv,
    ciphertext,
    address:    wallet.address,
    createdAt:  Date.now(),
    version:    "1.0",
  };

  _saveVault(vault);
  return { address: wallet.address, mnemonic };
}

/**
 * Desbloquea la wallet con el PIN.
 * @param {string} pin
 * @returns {Promise<ethers.Wallet>} - Conectada al RPC de ArepaPay
 */
export async function unlockWallet(pin) {
  const vault = _loadVault();
  if (!vault) throw new Error("No hay wallet guardada. Crea una primero.");

  const salt = Uint8Array.from(atob(vault.salt), c => c.charCodeAt(0));
  const key  = await deriveKey(pin, salt);

  let mnemonic;
  try {
    mnemonic = await decrypt(key, vault.iv, vault.ciphertext);
  } catch {
    throw new Error("PIN incorrecto");
  }

  const wallet = ethers.Wallet.fromPhrase(mnemonic);

  // Conectar al RPC de ArepaPay (cuando esté disponible)
  if (AREPAPAY_NETWORK.rpcUrl !== "PENDING_SUBNET_DEPLOY") {
    const provider = new ethers.JsonRpcProvider(AREPAPAY_NETWORK.rpcUrl);
    return wallet.connect(provider);
  }

  return wallet; // sin provider por ahora
}

/**
 * Devuelve la dirección pública guardada (sin descifrar, sin PIN).
 * @returns {string | null}
 */
export function getSavedAddress() {
  const vault = _loadVault();
  return vault?.address ?? null;
}

/**
 * ¿Existe una wallet guardada?
 * @returns {boolean}
 */
export function hasWallet() {
  return !!_loadVault();
}

/**
 * Elimina el vault (logout permanente).
 */
export function deleteWallet() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(VAULT_KEY);
  }
}

// ── Storage helpers ──────────────────────────────────────────────────────────

function _saveVault(vault) {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
  }
}

function _loadVault() {
  if (typeof localStorage !== "undefined") {
    const raw = localStorage.getItem(VAULT_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}
