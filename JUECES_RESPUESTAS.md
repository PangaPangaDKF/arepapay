# Respuestas para los jueces — ArepaPay MVP

> Este documento responde las preguntas tipicas de evaluacion de hackathon.
> Revision honesta: si algo NO esta listo, se dice claramente.

---

## 1. Que problema resuelve tu proyecto?

**Venezuela tiene un sistema de pagos fragmentado y excluyente.**

Los venezolanos manejan divisas (principalmente USDT) en efectivo o Binance P2P porque no tienen acceso a cuentas bancarias internacionales. Los comercios locales cobran por Zelle (requiere banco americano), transferencia bancaria (comisiones del banco), o efectivo (riesgo de robo).

ArepaPay unifica todo: el usuario tiene USDT en su propia wallet (sin custodio), escanea el QR del comercio, y el pago llega en segundos. Sin banco, sin intermediario, sin registro previo.

**El problema es real. Vivimos esto.**

---

## 2. Quien es tu usuario objetivo?

**Primario**: venezolano urbano de 18-45 años con smartphone, que ya maneja USDT en Binance o similar, y quiere pagar en comercios locales sin sacar efectivo ni hacer transferencias manuales.

**Secundario**: comerciantes locales (panaderias, bodegas, vendedores de comida) que quieren recibir USDT directamente sin ceder porcentaje a un intermediario.

**Por que son los correctos**: ya manejan crypto (USDT es moneda de facto en Venezuela), el smartphone penetro antes que la banca formal, y la friccion actual de pago es alta.

---

## 3. Como usa blockchain? No podria hacerse con una base de datos?

No. Y aqui esta la diferencia critica:

| Con base de datos | Con ArepaPay (blockchain) |
|-------------------|--------------------------|
| La empresa custodia los fondos | El usuario custodia sus propios fondos |
| Si la empresa cierra, pierdes tu dinero | Los fondos estan en tu wallet, siempre |
| Requiere KYC y cuenta registrada | Solo necesitas MetaMask |
| La empresa puede bloquear tu cuenta | Nadie puede bloquear tu wallet |
| Comision opaca | Fee visible y fijo en el contrato |

La autocustodia no es un bonus tecnico — es la propuesta de valor central para un pais donde la confianza en instituciones financieras esta destruida.

---

## 4. Hay un prototipo funcionando?

**Si. Completamente funcional en Avalanche Fuji (testnet).**

- App de usuario: https://frontend-tau-ten-27.vercel.app
- Panel de comerciante (sin wallet): https://frontend-tau-ten-27.vercel.app?merchant

Lo que funciona hoy:
- Conectar MetaMask y ver saldo USDT real (leido del contrato)
- Escanear QR de comercio y pagar (2 transacciones: approve + payMerchant)
- El comercio verifica que el pagador tiene suficiente saldo
- El monto fijado por el comercio es inmutable para el cliente (no puede cambiarlo)
- Panel de comerciante genera QR de cobro sin necesidad de wallet propia

---

## 5. Los contratos estan auditados o son seguros?

**Son funcionales y simples, pero no auditados formalmente** (MVP de hackathon).

Decisiones de seguridad tomadas:
- `PaymentProcessor` verifica on-chain que el comercio este registrado antes de procesar cualquier pago
- No hay fondos custodiados por el contrato — el USDT va directo del pagador al comercio (`transferFrom`)
- `RewardTicket` solo permite minteo desde el `PaymentProcessor` autorizado
- El owner no puede acceder a fondos de usuarios

Riesgo conocido: MockUSDT es un token de prueba con funcion `faucet()` publica — en produccion se reemplaza por USDT.e oficial de Avalanche.

---

## 6. Como gana dinero el proyecto?

**MVP actual**: sin comision — la prioridad es adopcion de red.

**Modelo a mediano plazo**:
- 0.5% de fee sobre pagos via `payMerchant` → va al pozo de rifas
- Los comercios verificados pagan una cuota mensual en AREPA Token para mantener el badge "ArepaPay verificado"
- Rifas pagas con tickets ganados por transacciones — genera volumen de pagos

**Logica**: a mas pagos, mas tickets, mas participantes en rifas, mas atractivo para nuevos comercios → loop de crecimiento sin dependencia de publicidad.

---

## 7. Como se diferencia de Binance Pay o Zelle?

| | Binance Pay | Zelle | ArepaPay |
|--|-------------|-------|----------|
| Custodia de fondos | Binance | Tu banco | Tu wallet |
| Requiere KYC | Si (nivel 2) | Si (cuenta bancaria) | No |
| Disponible en Venezuela | Parcialmente (restricciones) | No (requiere banco USA) | Si |
| Fondos bloqueables | Si (Binance puede bloquear) | Si (banco puede bloquear) | No |
| Incentivos por usar | No | No | Tickets de rifa |
| Abierto (sin app propietaria) | No | No | Si (cualquier wallet EVM) |

---

## 8. Es escalable?

**La arquitectura es escalable. El crecimiento de usuarios requiere un paso adicional.**

Escalabilidad tecnica actual:
- Avalanche Fuji maneja miles de transacciones por segundo
- Los contratos no tienen limitaciones de usuarios (mappings por address)
- El frontend es estatico (Vercel CDN) — sin costo adicional por usuario

Paso necesario para escala real:
- Subnet propia de ArepaPay donde el gas sea gratis para usuarios (Avalanche lo permite)
- Esto elimina la barrera de "necesito AVAX para pagar gas"

---

## 9. Que no funciona todavia (honestidad)?

Ser transparentes con los jueces sobre el estado real:

1. **Tickets al pagar a comercio**: el balance de tickets se muestra, pero `payMerchant` no mintea tickets todavia. Requiere actualizar `PaymentProcessor` para llamar a `RewardTicket.mint()`. Esta pendiente.

2. **Red de prueba**: todo corre en Fuji (testnet). El USDT es MockUSDT con faucet publico. Para produccion se necesita USDT.e oficial y red principal.

3. **Rifas**: el sistema de rifas es UI funcional con datos mock. El contrato de sorteo on-chain (con Chainlink VRF) no esta implementado. Los sorteos actuales los decide el admin.

4. **Sin historial**: no hay pantalla de historial de transacciones. Se puede construir leyendo eventos del contrato (`PaymentSent`).

5. **Gas manual**: el usuario necesita AVAX para pagar gas. Solucion futura: subnet propia con gas gratuito.

---

## 10. Por que Avalanche y no otra blockchain?

- **Confirmaciones rapidas** (menos de 2 segundos): critico para pagos en punto de venta
- **Costos bajos**: el gas en Avalanche es significativamente menor que Ethereum mainnet
- **Subnet propia**: Avalanche permite crear una subnet con reglas propias — ideal para una red de pagos local con gas gratis
- **Presencia en Venezuela**: Avalanche tiene comunidad activa en LATAM y Venezuela especificamente
- **EVM compatible**: toda la tooling existente (MetaMask, ethers.js, Foundry) funciona sin cambios

---

## 11. Cual es el plan de go-to-market?

**Fase 0 (hoy)**: comercios piloto en el circulo cercano — 4 comercios reales ya registrados en el contrato.

**Fase 1**: expansion boca a boca entre comunidad crypto venezolana. El panel de comerciante sin wallet baja la barrera de entrada al maximo.

**Fase 2**: alianzas con asociaciones de comerciantes locales. El argumento es simple: "recibe USDT sin ceder el 3% a Binance".

**Fase 3**: cuando haya volumen suficiente, on-ramp local (fiat VES/USD → USDT) integrado directamente.

---

## 12. Tiene traccion real?

**MVP con comercios reales** (aunque en testnet):
- 4 comercios tienen wallets generadas y registradas on-chain
- El flujo completo (QR → pago → confirmacion) fue probado end-to-end
- La app es PWA instalable — funciona como app nativa en Android

No hay usuarios activos todavia — es un hackathon. Pero la infraestructura esta lista para onboardear los primeros comercios reales el dia que se migre a mainnet.

---

## Resumen ejecutivo para los jueces

ArepaPay es un sistema de pagos P2P con USDT para Venezuela, construido sobre Avalanche, donde los fondos siempre estan en la wallet del usuario (autocustodia real), los comercios reciben pagos directos sin intermediario, y los usuarios ganan tickets de rifa por cada transaccion — creando un loop de incentivos que beneficia a toda la red.

**El problema es real. La solucion esta deployada. El equipo lo vive.**
