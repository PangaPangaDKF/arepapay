# 🫓 CONTEXTO ACTUAL — ArepaPay
> Pega este archivo COMPLETO al inicio de cualquier chat con cualquier AI.
> Actualízalo cada vez que termines algo o cambies de tarea.
> Última actualización: 2026-03-03

---

## 💡 INSTRUCCIÓN PARA LA AI
Cuando recibas este archivo:
1. Lee TODO antes de responder
2. No repitas lo que ya está hecho
3. Continúa desde "EN QUÉ ESTOY AHORA"
4. Si necesitas ver un archivo específico, pídelo
5. Un paso a la vez — no des 10 cosas a la vez
6. Si termino algo, dime exactamente qué línea actualizar en este archivo

---

## 🎯 IDENTIDAD DE MARCA

**Bio oficial de X (Twitter):**
> "Obtén $ a tasa oficial con autocustodia, realiza pagos, participa y obtén incentivos.
> Usando la tecnología de Avalanche para romper la barrera entre web0, web1, web2, web3 y todos los web.
> Y la arepa es venezolana. 🫓🇻🇪"

**Conceptos clave:**
- **Autocustodia** = el usuario controla su wallet, nadie más. Sin bancos, sin intermediarios.
- **Tasa oficial** = acceso a dólares al precio justo, sin cambistas
- **Romper barreras web0→web3** = cualquier persona puede usarlo aunque no sepa de crypto
- **La arepa es venezolana** = identidad cultural, orgullo, humor venezolano

**Tono:** cercano, venezolano, sin jerga crypto, inclusivo

---

## 🧠 QUÉ ES ESTE PROYECTO

ArepaPay es una app de pagos P2P venezolana que corre en una subnet de Avalanche.
- Los usuarios pagan con USDT entre sí y en comercios verificados
- Por cada pago (enviado o recibido) ganan tickets 🫓
- Los tickets se usan para entrar a rifas de premios físicos (helados, internet, Netflix, etc.)
- El admin (yo) decide cuándo se sortea cada rifa
- AREPA token = solo para gas de la red, NO para pagos

---

## 📁 ESTRUCTURA DE CARPETAS (CORRECTA)
```
~/
├── arepapay-clean/                  ← ✅ CARPETA CORRECTA — usar siempre esta
│   ├── contracts/                   ← Contratos Solidity (Foundry)
│   │   ├── src/
│   │   │   ├── ArepaToken.sol       ✅ deployado
│   │   │   ├── MockUSDT.sol         ✅ deployado
│   │   │   ├── MerchantRegistry.sol ✅ deployado
│   │   │   ├── PaymentProcessor.sol ✅ deployado
│   │   │   ├── LiquidityManager.sol ✅ deployado
│   │   │   └── RewardNFT.sol        ✅ refactorizado como RewardTicket
│   │   └── script/
│   │       └── Deploy.s.sol         ✅ funciona
│   ├── frontend/                    ← ✅ App React + Vite
│   │   └── src/
│   │       ├── App.jsx              ✅ pantalla de conexión lista
│   │       ├── hooks/useWallet.js   ✅ WalletConnect v2
│   │       └── config/network.js   ✅ direcciones de contratos
│   ├── CONTEXTO_ACTUAL.md
│   ├── README.md
│   └── .gitignore
│
└── arepapay-frontend/               ← ❌ IGNORAR (copia vieja)
---

## 🌐 RED Y CONTRATOS

| Campo | Valor |
|-------|-------|
| Network | ArepaPay Subnet (Avalanche local) |
| Chain ID | 4321987 |
| RPC | `http://127.0.0.1:9650/ext/bc/V9NDW69xy4W7PVdCggpHN2VFZEn1VCXNDgez9GbQpRwo9p2gn/rpc` |

| Contrato | Dirección |
|----------|-----------|
| ArepaToken (AREPA) | `0x52c84043cd9c865236f11d9fc9f56aa003c1f922` |
| MockUSDT | `0x17ab05351fc94a1a67bf3f56ddbb941ae6c63e25` |
| MerchantRegistry | `0x5aa01b3b5877255ce50cc55e8986a7a5fe29c70e` |
| PaymentProcessor | `0x4ac1d98d9cef99ec6546ded4bd550b0b287aad6d` |
| LiquidityManager | `0xa4cd3b0eb6e5ab5d8ce4065bccd70040adab1f00` |
| RewardTicket | `0x5db9a7629912ebf95876228c24a848de0bfb43a9` |

⚠️ Estas direcciones son locales — cambian cada vez que se reinicia la subnet y se redesploya.

Wallet deployer (ewoq - solo desarrollo local):
- Address: `0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC`
- PK: `0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027`
⚠️ Solo para red local. Nunca en mainnet.

---

## ✅ LO QUE ESTÁ HECHO

- [x] Foundry instalado y funcionando
- [x] Subnet ArepaPay corriendo localmente (avalanche network start)
- [x] Todos los contratos compilados y deployados
- [x] Frontend React + Vite inicializado (npm run dev funciona en localhost:5173)
- [x] Prompt maestro del frontend documentado en PROMPT_MAESTRO_FRONTEND.md
- [x] Repo limpio en ~/arepapay-clean/ subido a GitHub
- [x] VS Code configurado con terminal integrada
- [x] Sistema de contexto (este archivo) funcionando
- [x] Refactor RewardNFT → RewardTicket
- [x] Redesployar todos los contratos
- [x] network.js creado con direcciones finales
- [x] Frontend movido a ~/arepapay-clean/frontend/
- [x] useWallet.js con WalletConnect v2
- [x] Pantalla de conexión con botón naranja
- [x] Dashboard: balance USDT, tickets y botones de acción (Enviar, Recibir, Rifas)
- [x] Dashboard mejorado: balance AREPA, mobile-first, BottomNav, tap en balance
- [x] DESIGN_SYSTEM.md creado (referencia de estilos permanente)
---

## 🚧 EN QUÉ ESTOY AHORA

**Tarea actual:** Construir Enviar / Recibir + QR

**Contexto:** Dashboard listo. Muestra balance USDT y tickets leídos del contrato.
Siguiente: pantalla de enviar USDT (llama PaymentProcessor), pantalla de recibir con QR.

**Para levantar el frontend:**
cd ~/arepapay-clean/frontend
npm run dev

---

## ⏳ LO QUE FALTA (en orden)



| # | Tarea | Por qué |
|---|-------|---------|
| 1 | ✅ Construir frontend: Dashboard | Pantalla principal |
| 2 | ⬅️ Construir frontend: Pagar/Recibir + QR | Core del negocio |
| 3 | Construir frontend: Rifas y Tickets | Sistema de recompensas |
| 4 | Subir frontend a GitHub | Versionado |
| 5 | Panel de comerciante (desktop) | Fase 3 |
| 6 | Bridge custodial | Fase 4 |

---

## 🔗 LINKS IMPORTANTES

- GitHub: https://github.com/PangaPangaDKF/arepapay
- Frontend local: http://localhost:5173
- Docs Foundry: https://book.getfoundry.sh
- Docs Avalanche CLI: https://docs.avax.network/tooling/avalanche-cli

---

## 📋 COMANDOS PARA RETOMAR EL ENTORNO

```bash
# 1. Levantar la subnet
avalanche network start
avalanche blockchain deploy ArepaPay --local

# 2. Variables de entorno para deploy
export PRIVATE_KEY=0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027
export RPC_URL=http://127.0.0.1:9650/ext/bc/V9NDW69xy4W7PVdCggpHN2VFZEn1VCXNDgez9GbQpRwo9p2gn/rpc

# 3. Redesployar contratos
cd ~/arepapay-clean/frontend
forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --legacy

# 4. Levantar frontend
cd ~/arepapay-clean/frontend
npm run dev

# 5. Git — guardar progreso
cd ~/arepapay-clean
git add . && git commit -m "descripción" && git push
```
