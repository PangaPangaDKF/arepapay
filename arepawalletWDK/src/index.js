/**
 * ArepaWallet WDK — Entry point
 *
 * Embedded wallet para ArepaPay. No requiere MetaMask.
 * Estado: WIP — base funcional, pendiente integración con UI y subnet
 *
 * Uso desde la app React:
 *   import { createWallet, unlockWallet, hasWallet, getSavedAddress } from './arepawalletWDK/src/wallet.js'
 */

export { createWallet, unlockWallet, hasWallet, getSavedAddress, deleteWallet } from "./wallet.js";
export { AREPAPAY_NETWORK } from "./network.js";
export { deriveKey, encrypt, decrypt } from "./crypto.js";

// Log de estado al importar (solo dev)
console.log("[ArepaWallet WDK] v0.1.0 — WIP. Red:", "PENDING_SUBNET_DEPLOY");
