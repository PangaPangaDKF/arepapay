const RPC_PATH = "/ext/bc/V9NDW69xy4W7PVdCggpHN2VFZEn1VCXNDgez9GbQpRwo9p2gn/rpc";

export const NETWORK = {
  chainId:    4321987,
  chainIdHex: "0x41F7C3",
  // RPC dinámico: Vite proxea /ext → 127.0.0.1:9650 en cualquier entorno
  get rpcUrl() { return `${window.location.origin}${RPC_PATH}`; },
  contracts: {
    arepaToken:       "0x52c84043cd9c865236f11d9fc9f56aa003c1f922",
    mockUSDT:         "0x17ab05351fc94a1a67bf3f56ddbb941ae6c63e25",
    merchantRegistry: "0x5aa01b3b5877255ce50cc55e8986a7a5fe29c70e",
    rewardTicket:     "0x5db9a7629912ebf95876228c24a848de0bfb43a9",
    paymentProcessor: "0x4ac1d98d9cef99ec6546ded4bd550b0b287aad6d",
    liquidityManager: "0xa4cd3b0eb6e5ab5d8ce4065bccd70040adab1f00"
  }
};
