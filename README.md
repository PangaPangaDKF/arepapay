# ArepaPay

> Pagos P2P con USDT en Avalanche Fuji. Sin bancos, sin intermediarios, con incentivos reales para comercios y usuarios venezolanos.
>
> **La arepa es venezolana. 🇻🇪**

---

## El problema que resuelve

Venezuela tiene dos problemas concretos con los pagos digitales:

1. **Fragmentación**: los pagos en divisas se hacen por Zelle, Binance P2P, transferencias bancarias o efectivo. Cada método tiene friccion, comisiones ocultas o riesgo de contraparte.
2. **Exclusion financiera**: millones de venezolanos no tienen acceso a cuentas bancarias internacionales ni tarjetas que funcionen con plataformas globales.

ArepaPay resuelve ambos con una sola app: el usuario conecta su MetaMask, tiene USDT en autocustodia, y puede pagar en cualquier comercio local escaneando un QR. Sin registro, sin KYC, sin intermediario.

---

## Como funciona (flujo completo)

### Para el cliente (usuario):
1. Conecta MetaMask con Avalanche Fuji
2. Ve su saldo USDT, tickets de rifa y minutos de internet en el dashboard
3. Presiona **PAGAR** y escanea el QR del comercio
4. El monto fijado por el comercio se pre-llena (no editable)
5. Confirma la transaccion en MetaMask
6. El USDT llega directamente al comercio — sin custodia intermedia
7. Gana automaticamente: 1 ticket de rifa + 30 minutos de internet WiFi

### Para el comerciante:
1. Abre `https://frontend-tau-ten-27.vercel.app?merchant` (sin necesidad de wallet)
2. Selecciona su comercio de la lista
3. Ingresa el monto del cobro
4. Muestra el QR al cliente
5. Recibe el USDT directamente en su wallet — sin intermediario
6. Tambien gana 1 ticket de rifa por cada pago recibido

---

## MVP — Lo que funciona hoy

| Funcionalidad | Estado |
|---------------|--------|
| Wallet connect (MetaMask + WalletConnect) | ✅ |
| Balance USDT en tiempo real | ✅ |
| Envio P2P de USDT | ✅ |
| Pago a comercio verificado via QR | ✅ |
| Monto fijado por comercio (read-only) | ✅ |
| 4 comercios registrados on-chain | ✅ |
| Panel de comerciante sin wallet (`?merchant`) | ✅ |
| Tickets de rifa por transaccion | ✅ |
| Rifa con 3 ganadores ponderados | ✅ |
| Minutos de internet WiFi por pago | ✅ |
| Activar internet on-chain (`activate()`) | ✅ |
| Generacion de QR de cobro | ✅ |
| PWA instalable en movil | ✅ |

---

## Stack tecnico

| Capa | Tecnologia |
|------|-----------|
| Blockchain | Avalanche Fuji Testnet (chainId 43113) |
| Smart contracts | Solidity 0.8.x + Foundry |
| Frontend | React 19 + Vite + ethers.js v6 |
| Deploy frontend | Vercel |
| Camara QR | jsQR (canvas nativo, sin dependencias extra) |

---

## Contratos desplegados (Avalanche Fuji Testnet)

| Contrato | Direccion | Funcion |
|----------|-----------|---------|
| MockUSDT | `0xcfEFB29Bd69c0AF628a1d206C366133629011820` | Token de pago (18 decimales) |
| MerchantRegistry | `0x53Ac07432c22eEe0eE6Ce5c003bF198F4712bc0b` | Registro y verificacion de comercios |
| RewardTicket | `0x5430B7598ea098eB2E217bebda1406805f142aEf` | Tickets por transaccion |
| Raffle | `0x3c25B5E7C32f258932071801Ea200BbDdd3A1CC0` | Rifas con 3 ganadores ponderados |
| InternetVoucher | `0xd72a6a47B342971380Fc02eF911103E09b47B8AD` | Minutos de WiFi por pago |
| PaymentProcessor | `0x49A214bEfC497B2fe7F63609A1CdfD7492C6E215` | Enruta pagos + mintea recompensas |
| ArepaToken | `0x67B3a03CB0518bB3CB0d33E9951Ba2764CB2B4FE` | Token nativo del ecosistema |
| LiquidityManager | `0xe404e1D6B01971D0643494eEaBc10d78521cF602` | Pozo de premios |

---

## Comercios registrados on-chain

| Comercio | Categoria | Wallet |
|----------|-----------|--------|
| Panaderia El Arepazo | Pan, Cachitos, Cafe | `0x9bEDc23e...A6c5` |
| Botellones El Mono | Agua 22L, Delivery | `0xc79D5946...d621` |
| Perros Juancho | Comida rapida | `0xeB484FaA...fD8A` |
| La Bodega | Abarrotes, Charcuteria | `0x07727f67...48c2` |

---

## Arquitectura de incentivos

```
Usuario paga a comercio
        ↓
PaymentProcessor.payMerchant()
    ├── USDT → comercio (directo, sin custodia)
    ├── RewardTicket.mint() → +1 ticket al pagador
    ├── RewardTicket.mint() → +1 ticket al comercio
    ├── InternetVoucher.mint() → +30 min WiFi al pagador
    └── Raffle.recordTransaction() → +1 al contador de rifas
                                     (cada 10 pagos → rifa abierta, 3 ganadores)
```

---

## Estructura del repositorio

```
arepapay-clean/
├── contracts/
│   ├── src/
│   │   ├── PaymentProcessor.sol   # Motor de pagos + recompensas
│   │   ├── RewardNFT.sol          # Tickets (RewardTicket)
│   │   ├── Raffle.sol             # Sistema de rifas 3 ganadores
│   │   ├── InternetVoucher.sol    # Vouchers de internet WiFi
│   │   ├── MerchantRegistry.sol   # Whitelist de comercios
│   │   ├── MockUSDT.sol           # USDT de prueba
│   │   └── ArepaToken.sol         # Token nativo
│   └── script/                    # Scripts de deploy (Foundry)
└── frontend/
    └── src/
        ├── components/            # Dashboard, SendScreen, RafflesScreen, InternetScreen...
        ├── hooks/                 # useWallet, useBalances, useRaffle
        └── config/network.js      # Contratos + comercios
```

---

## Roadmap

### Fase 2 (inmediata)
- Auto-reconexion MetaMask al abrir la app
- Historial de pagos desde eventos on-chain
- Oracle BCV en tiempo real (tipo de cambio oficial)

### Fase 3
- Integracion real de internet con routers MikroTik via `InternetVoucher.consume()`
- Sorteo automatico con Chainlink VRF
- Staking de comerciantes para proveer liquidez

### Fase 4
- Subnet propia de ArepaPay (AREPA como gas, transacciones gratis para usuarios)
- On-ramp fiat → USDT con proveedores locales
- Modelo DAT: recompra de tokens AREPA con fees de red

---

## Demo

**App de usuario:** https://frontend-tau-ten-27.vercel.app

**Panel de comercio:** https://frontend-tau-ten-27.vercel.app?merchant

---

*Construido en el Hackathon Avalanche Venezuela 2025*
