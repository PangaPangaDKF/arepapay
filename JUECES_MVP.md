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
| Live MVP funcional | FALTA | Actualmente corre en local (ngrok). Necesita hosting permanente |
| Web3 verificable en Fuji testnet | FALTA CRITICO | Contratos deployados en subnet local, no en Fuji |
| Contratos verificados con explorer | FALTA | Fuji tiene Snowtrace explorer para verificar |

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

## Resumen ejecutivo para el pitch

ArepaPay es una app de pagos P2P para venezolanos construida sobre Avalanche.
Los usuarios pagan con USDT, ganan tickets por cada transaccion y participan en rifas de premios fisicos.
Sin bancos, sin intermediarios. Autocustodia total.
