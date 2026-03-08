export const NETWORK = {
  chainId:    43113,
  chainIdHex: "0xA869",
  rpcUrl:     "https://api.avax-test.network/ext/bc/C/rpc",
  contracts: {
    arepaToken:       "0x67b3a03cb0518bb3cb0d33e9951ba2764cb2b4fe",
    mockUSDT:         "0xcfefb29bd69c0af628a1d206c366133629011820",
    merchantRegistry: "0x53ac07432c22eee0ee6ce5c003bf198f4712bc0b",
    rewardTicket:     "0x5430B7598ea098eB2E217bebda1406805f142aEf",
    paymentProcessor: "0xb10EE9c97Db6be098406618c2088eAC87e994483",
    raffle:           "0x3c25B5E7C32f258932071801Ea200BbDdd3A1CC0",
    internetVoucher:  "0xd72a6a47B342971380Fc02eF911103E09b47B8AD",
    liquidityManager: "0xe404e1d6b01971d0643494eeabc10d78521cf602"
  }
};

// Comercios verificados on-chain en MerchantRegistry
export const MERCHANTS = [
  {
    id:       "panaderia",
    name:     "Panaderia El Arepazo",
    category: "Pan • Cachitos • Cafe",
    emoji:    "🍞",
    address:  "0x9bEDc23e74204Ab4507a377ab5B59A7B7265a6c5",
    big:      true,
  },
  {
    id:       "agua",
    name:     "Botellones El Mono",
    category: "Agua 22L • Delivery",
    emoji:    "💧",
    address:  "0xc79D59461fC9deF5C725b2272174230cd88Cd621",
    big:      true,
  },
  {
    id:       "perros",
    name:     "Perros Juancho",
    category: "Comida rapida",
    emoji:    "🌭",
    address:  "0xeB484FaA415111198E2abcd79B286CAE7A4FfD8A",
    big:      false,
  },
  {
    id:       "bodega",
    name:     "La Bodega",
    category: "Abarrotes • Charcuteria",
    emoji:    "🏪",
    address:  "0x07727f6710C01f2f075284Fc5FCCb05BaB3A48c2",
    big:      false,
  },
];
