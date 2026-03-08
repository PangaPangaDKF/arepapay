# Requisitos Jueces — Stage 2 MVP
> Mensaje de Andrea Vargas (admin) en el canal del hackathon.
> Guardado: 2026-03-07

---

## Mensaje original

"After discussing with our technical judges and considering that this was a common request from teams, we've decided to introduce more flexibility in how technical execution is evaluated. This allows some teams to keep their repositories private if they prefer, while still ensuring judges can verify the team's ability to deliver.

To ensure our judges can efficiently review 400+ projects while keeping the process agile, your submission must include AT LEAST ONE (the more the better) of the following:

- Public GitHub repository with source code and a README explaining how the project works.
- Live MVP site where judges can test the functionality (web3 integrations should be verifiable on Fuji testnet).
- Links to Verified smart contracts with explorer links if your project is primarily on-chain.
- Public code repository with documentation if your project is an SDK, developer tool, or infrastructure project without a user interface.

Please note that judges will not request access to private repositories. If judges cannot access or test your project using the materials provided, it may impact your evaluation."

---

## Analisis: que tenemos vs que falta

| Requisito | Estado | Notas |
|-----------|--------|-------|
| Repo publico en GitHub | LISTO | https://github.com/PangaPangaDKF/arepapay |
| README explicando el proyecto | FALTA | Necesita README completo con descripcion, screenshots, instrucciones |
| Live MVP funcional | LISTO | https://frontend-tau-ten-27.vercel.app |
| Web3 verificable en Fuji testnet | LISTO | Contratos deployados en Fuji C-Chain (chainId 43113) |
| Contratos verificados con explorer | LISTO | Ver links abajo en seccion de contratos |

---

## Plan de accion para los jueces (en orden de prioridad)

### 1. Desplegar contratos en Fuji testnet (CRITICO)
- Fuji es la testnet publica de Avalanche C-Chain
- Chain ID: 43113
- Los jueces pueden verificar transacciones en https://testnet.snowtrace.io
- Requiere AVAX de testnet (gratis via faucet: https://faucet.avax.network)
- Los contratos (ArepaToken, MockUSDT, MerchantRegistry, PaymentProcessor, LiquidityManager, RewardTicket) se redesployarian en Fuji
- El frontend cambia network.js: chainId 43113, rpcUrl Fuji

### 2. Hosting permanente del frontend
- Opciones: Vercel, Netlify, GitHub Pages (build estatico)
- Vercel es el mas facil: conecta repo GitHub y despliega automatico
- El RPC seria el endpoint publico de Fuji (no necesita ngrok)

### 3. Verificar contratos en Snowtrace
- forge verify-contract con la API de Snowtrace
- Los jueces pueden leer el codigo fuente en el explorer

### 4. README completo
- Descripcion del proyecto
- Screenshots de la app
- Como funciona (flujo usuario)
- Arquitectura tecnica
- Links a contratos verificados

---

## Cambios tecnicos necesarios para Fuji

### network.js (cambios)
```
chainId:    43113
chainIdHex: "0xA869"
rpcUrl:     "https://api.avax-test.network/ext/bc/C/rpc"
```

### Diferencias Fuji vs subnet local
- USDT en Fuji = necesitamos usar un MockUSDT deployado por nosotros (igual que ahora)
- Gas en Fuji = AVAX (no AREPA) — el token nativo de la C-Chain es AVAX
- No hay subnet personalizada — todo va en la C-Chain de Avalanche
- ArepaToken en Fuji = solo sirve como token ERC20, no como gas nativo
- Los usuarios necesitan AVAX de testnet para pagar gas (faucet gratuito)

### Impacto en la app
- El concepto de "AREPA como gas" desaparece en Fuji (AVAX es el gas)
- MockUSDT se puede distribuir desde el deployer a wallets de prueba
- Todo lo demas funciona igual

---

## Contratos verificados en Snowtrace (Fuji testnet)

| Contrato | Direccion | Explorer |
|----------|-----------|---------|
| MockUSDT | 0xcfefb29bd69c0af628a1d206c366133629011820 | https://testnet.snowscan.xyz/address/0xcfefb29bd69c0af628a1d206c366133629011820 |
| MerchantRegistry | 0x53ac07432c22eee0ee6ce5c003bf198f4712bc0b | https://testnet.snowscan.xyz/address/0x53ac07432c22eee0ee6ce5c003bf198f4712bc0b |
| RewardTicket | 0x5430B7598ea098eB2E217bebda1406805f142aEf | https://testnet.snowscan.xyz/address/0x5430B7598ea098eB2E217bebda1406805f142aEf |
| Raffle | 0x3c25B5E7C32f258932071801Ea200BbDdd3A1CC0 | https://testnet.snowscan.xyz/address/0x3c25B5E7C32f258932071801Ea200BbDdd3A1CC0 |
| InternetVoucher | 0xd72a6a47B342971380Fc02eF911103E09b47B8AD | https://testnet.snowscan.xyz/address/0xd72a6a47B342971380Fc02eF911103E09b47B8AD |
| PaymentProcessor | 0xb10EE9c97Db6be098406618c2088eAC87e994483 | https://testnet.snowscan.xyz/address/0xb10EE9c97Db6be098406618c2088eAC87e994483 |
| ArepaToken | 0x67b3a03cb0518bb3cb0d33e9951ba2764cb2b4fe | https://testnet.snowscan.xyz/address/0x67b3a03cb0518bb3cb0d33e9951ba2764cb2b4fe |
| LiquidityManager | 0xe404e1d6b01971d0643494eeabc10d78521cf602 | https://testnet.snowscan.xyz/address/0xe404e1d6b01971d0643494eeabc10d78521cf602 |

---

## Resumen ejecutivo para el pitch

ArepaPay es una app de pagos P2P para venezolanos construida sobre Avalanche.
Los usuarios pagan con USDT, ganan tickets por cada transaccion y participan en rifas de premios fisicos.
Sin bancos, sin intermediarios. Autocustodia total.

---

## Preguntas del formulario de submission (RESPONDER ANTES DE ENVIAR)

### 1. GitHub Repository
```
https://github.com/PangaPangaDKF/arepapay
```

### 2. Technical Documentation — Tech stack, architecture decisions, implementation approach
```
Stack: Solidity (Foundry) + React (Vite) + ethers.js v6 + MetaMask.

Arquitectura:
- Capa de contratos: 6 contratos en Avalanche. ArepaToken (ERC20, gas nativo en produccion),
  MockUSDT (ERC20 para pagos), MerchantRegistry (registro de comercios verificados),
  PaymentProcessor (procesa pagos y acumula tickets), RewardTicket (ERC20 de tickets),
  LiquidityManager (reservas de liquidez).
- Capa frontend: React SPA sin backend. Se comunica directo con la chain via RPC.
  useBalances usa JsonRpcProvider para leer sin depender de la red activa en MetaMask.
  useWallet usa BrowserProvider para firmar transacciones.
- Decision clave: subnet personalizada en produccion para controlar gas (AREPA en vez de AVAX),
  seguridad de red y permisos de validadores. Para el MVP/demo se usa Fuji C-Chain.
```

### 3. Architecture Design Overview — Components, workflows, data flow, on-chain vs off-chain
```
Componentes principales:
  [Usuario/MetaMask] → [React Frontend] → [RPC Avalanche] → [Contratos Solidity]

Flujo de datos:
  - Lectura de balances: Frontend → JsonRpcProvider → balanceOf() en MockUSDT, ArepaToken, RewardTicket
  - Envio de pago: Usuario firma → BrowserProvider → MockUSDT.transfer() → on-chain
  - Tickets: PaymentProcessor detecta pago → mintea RewardTicket al pagador (pendiente integrar en frontend)

On-chain: Todo el estado de saldos, pagos y tickets. Sin base de datos centralizada.
Off-chain: Solo el frontend estatico (Vercel). Sin servidor, sin backend, sin custodio.

El MVP demuestra el flujo completo P2P: conectar wallet → ver balance USDT → enviar a otra
direccion → recibir confirmacion on-chain.
```

### 4. User Journey — How does a user interact from start to finish?
```
Paso 1: Usuario abre la app en el navegador de MetaMask (mobile) o desktop.
Paso 2: Toca "Conectar Wallet" → MetaMask pide aprobacion → conectado.
Paso 3: Dashboard muestra balance USDT, balance AREPA (gas), y tickets disponibles.
Paso 4: Toca "Enviar" → ingresa direccion del destinatario y monto en USDT.
Paso 5: Pantalla de confirmacion muestra resumen del pago con advertencia de irreversibilidad.
Paso 6: Toca "Confirmar y Enviar" → MetaMask abre popup para firmar la transaccion.
Paso 7: Usuario aprueba → transaccion se ejecuta on-chain → pantalla de exito con TX hash.
Paso 8: El destinatario puede ver el pago recibido en su propio dashboard al conectar su wallet.
Flujo alternativo: "Recibir" muestra QR con la direccion para que otro usuario escanee y envie.
```

### 5. MoSCoW Framework — Feature Prioritization
```
Must Have:
- Enviar USDT a cualquier direccion (P2P directo, sin intermediario)
- Ver balance USDT en tiempo real
- Conectar MetaMask (autocustodia, sin registro)
- Confirmacion on-chain de la transaccion

Should Have:
- Tickets por cada pago (gamificacion de la app)
- QR para recibir pagos (flujo mobile-first)
- Deteccion de red incorrecta con instrucciones claras
- Dashboard con balance de gas (AREPA) y tickets

Could Have:
- Rifas/sorteos con los tickets acumulados
- Directorio de comercios verificados
- Historial de transacciones
- Panel de comerciante para recibir pagos con monto fijo

Won't Have (en este MVP):
- KYC/identidad de usuarios
- Bridge a otras redes (BSC, ETH mainnet)
- Conversion fiat automatica
- Custodio centralizado de fondos
```

### 6. Video walkthrough (max 5 minutos) — PENDIENTE GRABAR
Guion sugerido:
1. (0:00-0:30) Problema: venezolanos sin acceso bancario, remesas costosas
2. (0:30-1:00) Solucion: ArepaPay, pagos P2P con USDT, autocustodia total
3. (1:00-2:30) Demo en vivo: conectar wallet → ver balance → enviar USDT → confirmar en MetaMask → exito
4. (2:30-3:30) Mostrar TX en Snowtrace explorer (verificacion on-chain)
5. (3:30-4:30) Arquitectura rapida: contratos en Avalanche, sin backend, sin custodio
6. (4:30-5:00) Vision: subnet propia con AREPA como gas, directorio de comercios, rifas
