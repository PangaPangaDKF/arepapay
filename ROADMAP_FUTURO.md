# ArepaPay — Roadmap de Ideas Futuras

> Este archivo documenta funcionalidades planeadas para versiones posteriores al MVP.
> No implementar sin análisis previo de contratos y UX.

---

## 🎟️ Sistema de Cupones / Reclamo de Premios (post-rifa)

**Idea:** Cuando un usuario gana una rifa, el contrato le otorga un NFT o token de cupón
que puede mostrar digitalmente para reclamar el premio físico, y luego "quemar" (burn)
para marcarlo como canjeado. Esto hace el proceso verificable on-chain.

**Flujo propuesto:**
1. `draw()` sortea ganadores → mintea `PrizeCoupon` NFT (ERC721) a cada ganador
2. Ganador abre la app → ve su cupón con nombre del premio y estado (canjeado / sin canjear)
3. Muestra el NFT al comerciante / organizador
4. Organizador (o el owner) llama `burnCoupon(tokenId)` → queda registrado on-chain
5. El NFT desaparece del wallet del ganador

**Contratos necesarios:** `PrizeCoupon.sol` (ERC721 con burn controlado)
**Dificultad:** Media — requiere deploy nuevo, integrar con Raffle.sol

---

## 🎯 Sistema de Misiones (Engagement + Onboarding)

**Idea:** Los usuarios completan misiones y reciben tickets de recompensa o vouchers de internet.
Inspirado en "quests" de protocolos DeFi y plataformas de gaming.

**Misiones propuestas:**

### Misiones Sociales (off-chain verificadas por admin)
| Misión | Recompensa | Verificación |
|--------|-----------|--------------|
| Seguir @ArepaPay en X/Twitter | 2 tickets | Manual / OAuth |
| Hacer un post sobre ArepaPay con #ArepaPay | 5 tickets | Manual |
| Referir a un amigo (que haga su primer pago) | 10 tickets | On-chain: referral code |

### Misiones en Avalanche (on-chain verificables)
| Misión | Recompensa | Verificación |
|--------|-----------|--------------|
| Probar otra dApp de Avalanche LATAM | 3 tickets | Submit TX hash |
| Hacer swap en Trader Joe (DEX) | 5 tickets | Verificar evento on-chain |
| Bridgear activos con Core Wallet | 3 tickets | Verificar TX en bridge |
| Comprar un NFT en Joepegs | 5 tickets | Verificar transfer ERC721 |
| Agregar liquidez en Benqi | 8 tickets | Verificar LP token |

### Misiones ArepaPay (on-chain automáticas)
| Misión | Recompensa | Trigger |
|--------|-----------|---------|
| Primer pago en comercio | 5 tickets | PaymentProcessor evento |
| 10 pagos totales | 10 tickets + badge | Counter en contrato |
| Pagar 5 comercios distintos | 15 tickets | Set de addresses |
| Recibir primer pago | 2 tickets | Transfer entrante |

**Contratos necesarios:** `MissionBoard.sol` (registro de misiones, reclamación, prevención de doble claim)
**Frontend:** Pantalla "Misiones" en el bottom nav
**Dificultad:** Alta — requiere sistema de verificación hybrid on/off-chain

---

## 🌐 Subnet Propia de ArepaPay

**Idea:** Crear una Avalanche L1 (subnet) donde AREPA Token sea el gas nativo.
Esto elimina la barrera de "necesito AVAX para pagar gas."

**Beneficios:**
- Gas gratis para usuarios (patrocinado por el protocolo)
- Control total sobre validadores y reglas de la red
- Posibilidad de KYC selectivo a nivel de validador sin afectar la privacidad del usuario
- Fee model propio: ArepaPay cobra en AREPA y quema parte para deflación

**Pasos para implementar:**
1. Adquirir validadores Avalanche (staking mínimo)
2. Configurar la subnet con Avalanche-CLI
3. Deployar los contratos en la subnet propia
4. Actualizar el frontend para conectar a la nueva chain
5. Campaña de distribución de AREPA para que usuarios tengan gas

**Dificultad:** Muy Alta — requiere infraestructura, validadores y fondos para staking

---

## 📊 Historial de Transacciones

**Idea:** Mostrar el historial de pagos del usuario directamente en la app.
No requiere backend — se leen los eventos del contrato.

**Implementación:**
- Escuchar eventos `Transfer(from, to, value)` en MockUSDT filtrando por address
- Escuchar `PaymentSent(payer, merchant, amount)` en PaymentProcessor
- Mostrar lista con fecha, monto en Bs, destinatario, y TX hash
- Cache en localStorage para no re-fetchear en cada apertura

**Dificultad:** Baja — solo frontend, sin nuevo contrato

---

## 🏪 Onboarding de Comerciantes

**Idea:** Flujo de registro de comerciante directamente desde la app.
Actualmente los comercios se registran manualmente via script del admin.

**Flujo propuesto:**
1. Comerciante toca "Quiero ser comercio verificado"
2. Rellena nombre, emoji, categoría, y confirma su wallet
3. Se envía una solicitud (evento on-chain o form off-chain) al admin
4. Admin aprueba → `MerchantRegistry.register(address, name)` → comercio aparece en el directorio

**Dificultad:** Media — requiere UI + posiblemente panel de admin

---

## 💱 On-Ramp Local (VES → USDT)

**Idea:** Integrar un sistema donde el usuario pueda comprar USDT directamente
dentro de la app usando bolívares (transferencia bancaria venezolana).

**Mecanismo:**
- ArepaPay actúa como P2P local: comprador envía Bs a cuenta del vendedor
- LiquidityManager libera el USDT equivalente al wallet del comprador
- Requiere reservas de USDT en el LiquidityManager
- Tasa = BCV del día + pequeño spread para el protocolo

**Riesgo:** Regulatorio — operación similar a casa de cambio, requiere análisis legal
**Dificultad:** Alta — requiere integración bancaria, gestión de reservas, KYC

---

## 📱 PWA con Notificaciones Push

**Idea:** Enviar notificación al usuario cuando recibe un pago, cuando su rifa gana,
o cuando se abre una nueva rifa.

**Implementación:**
- Service Worker + Web Push API
- Backend ligero (Vercel Edge Functions) para escuchar eventos on-chain y disparar notificaciones
- El usuario otorga permiso la primera vez que abre la app

**Dificultad:** Media — requiere backend mínimo

---

*Última actualización: Marzo 2026*
*Estado del MVP actual: Pagos P2P + Rifas + Internet Vouchers + Panel de Comerciante*
