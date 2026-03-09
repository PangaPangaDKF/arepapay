/**
 * ArepaPay Subnet — Configuración de red
 * Chain ID: 13370 (ArepaPay L1 Testnet en Avalanche)
 *
 * RPC se obtiene al hacer: avalanche blockchain deploy ArepaPay --testnet
 * Formato: https://subnets.avax.network/ext/bc/<BLOCKCHAIN_ID>/rpc
 */
export const AREPAPAY_NETWORK = {
  chainId:     13370,
  chainIdHex:  "0x3432",
  chainName:   "ArepaPay Testnet",
  rpcUrl:      "PENDING_SUBNET_DEPLOY", // actualizar tras deploy de subnet
  explorerUrl: "https://subnets-test.avax.network/arepapay",
  nativeCurrency: {
    name:     "AREPA Token",
    symbol:   "AREPA",
    decimals: 18,
  },

  // Contratos — actualizar tras redesploy en subnet
  contracts: {
    arepaToken:       "PENDING_DEPLOY",
    mockUSDT:         "PENDING_DEPLOY",
    merchantRegistry: "PENDING_DEPLOY",
    rewardTicket:     "PENDING_DEPLOY",
    paymentProcessor: "PENDING_DEPLOY",
    raffle:           "PENDING_DEPLOY",
    internetVoucher:  "PENDING_DEPLOY",
    liquidityManager: "PENDING_DEPLOY",
  },
};
