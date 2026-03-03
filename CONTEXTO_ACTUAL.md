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
│   │   │   ├── PaymentProcessor.sol ✅ deployado (tiene evento PaymentSent)
│   │   │   ├── LiquidityManager.sol ✅ deployado
│   │   │   └── RewardNFT.sol        ⚠️ deployado PERO necesita refactor
│   │   └── script/
│   │       └── Deploy.s.sol         ✅ funciona
│   ├── CONTEXTO_ACTUAL.md           ← este archivo
│   ├── README.md
│   └── .gitignore
│
├── arepapay/                        ← ❌ IGNORAR — carpeta vieja y desordenada
└── arepapay-frontend/               ← Frontend React + Vite (local, aún no en GitHub)
    └── src/
        ├── App.jsx                  ← solo template default, sin modificar
        ├── main.jsx
        └── index.css
```

---

## 🌐 RED Y CONTRATOS

| Campo | Valor |
|-------|-------|
| Network | ArepaPay Subnet (Avalanche local) |
| Chain ID | 4321987 |
| RPC | `http://127.0.0.1:9650/ext/bc/V9NDW69xy4W7PVdCggpHN2VFZEn1VCXNDgez9GbQpRwo9p2gn/rpc` |

| Contrato | Dirección |
|----------|-----------|
| ArepaToken (AREPA) | `0xa4dff80b4a1d748bf28bc4a271ed834689ea3407` |
| MockUSDT | `0xe336d36faca76840407e6836d26119e1ece0a2b4` |
| MerchantRegistry | `0x95ca0a568236fc7413cd2b794a7da24422c2bbb6` |
| PaymentProcessor | `0x789a5fdac2b37fcd290fb2924382297a6ae65860` |
| LiquidityManager | `0xe3573540ab8a1c4c754fd958dc1db39bbe81b208` |
| RewardNFT | `0x8b3bc4270be2abbb25bc04717830bd1cc493a461` |

⚠️ Estas direcciones cambiarán después del redesploy con RewardNFT nuevo.

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

---

## 🚧 EN QUÉ ESTOY AHORA

**Tarea actual:** Refactor RewardNFT.sol

**Por qué:** El contrato actual es un ERC721 básico que no sirve para tickets.
Necesita ser un contrato simple con balance propio (NO ERC721, NO ERC1155).

**Lo que necesita el nuevo contrato:**
1. mint(address to) — solo llamable por PaymentProcessor, da 1 ticket
2. burn(address from, uint256 amount) — el usuario quema tickets para entrar a rifas
3. balanceOf(address) — cuántos tickets tiene el usuario
4. setPaymentProcessor(address) — para conectar con PaymentProcessor
5. Eventos: TicketMinted(address user) y TicketBurned(address user, uint256 amount)

**Después de escribir el contrato:**
- Reemplazar ~/arepapay-clean/contracts/src/RewardNFT.sol con el nuevo
- Actualizar Deploy.s.sol si es necesario
- Redesployar y actualizar direcciones en este archivo

---

## ⏳ LO QUE FALTA (en orden)

| # | Tarea | Por qué |
|---|-------|---------|
| 1 | ⬅️ Refactor RewardNFT → sistema de tickets | Sin esto el frontend no puede dar/quemar tickets |
| 2 | Redesployar contratos | Aplicar cambios on-chain |
| 3 | Actualizar direcciones en este archivo | Mantener contexto sincronizado |
| 4 | Construir frontend: config/network.js | Base de toda la app |
| 5 | Construir frontend: hooks/useWallet.js | Conectar wallet y agregar red |
| 6 | Construir frontend: Dashboard | Pantalla principal |
| 7 | Construir frontend: Pagar/Recibir + QR | Core del negocio |
| 8 | Construir frontend: Rifas y Tickets | Sistema de recompensas |
| 9 | Subir frontend a GitHub | Versionado |
| 10 | Panel de comerciante (desktop) | Fase 3 |
| 11 | Bridge custodial | Fase 4 |

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
cd ~/arepapay-clean/contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast --legacy

# 4. Levantar frontend
cd ~/arepapay-frontend
npm run dev

# 5. Git — guardar progreso
cd ~/arepapay-clean
git add . && git commit -m "descripción" && git push
```
