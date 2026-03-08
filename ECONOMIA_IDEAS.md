# ArepaPay — Ideas Económicas y Hoja de Ruta Post-MVP

> Archivo de referencia. Sujeto a cambios. Prioridad: después del MVP.
> Seguridad del proyecto y conservación de liquidez son lo primero.

---

## Arquitectura Económica Propuesta

### Capa 1: Pagos (ya existe)
- Usuario paga comercio en USDT → fee al protocolo → ticket de rifa + minutos de internet

### Capa 2: Tipo de Cambio
- Oracle BCV en tiempo real — la app muestra el precio oficial del Banco Central de Venezuela
- Solo se acepta esa tasa como referencia de intercambio dentro de la red
- Al entrar USDT/AVAX: el contrato captura automáticamente la diferencia entre tasa BCV y tasa paralela como fee anti-especulación
- Resultado: imposible arbitrar sacando plata barata para venderla afuera

### Capa 3: Liquidez de Comerciantes (el motor)

```
Comerciante deposita $50 USDT como colateral
    ↓
Puede procesar más pagos (liquidez disponible en red)
    ↓
Quiere retirar → contacta al operador
    ↓
Operador le da Bs a tasa BCV + 10% (mejor que el paralelo para el comerciante)
    ↓
Operador se queda con los USDT → los trabaja afuera (trading/arbitraje)
    ↓
Ganancia regresa a la red como fondo de recompensas
```

**Regla clave:** El comerciante solo puede reclamar **la ganancia**, no el principal.
El principal queda como colateral permanente de liquidez en la red.

### Capa 4: Fondo de Recompensas (autosostenido)

```
Fee de red (ej. 2% por tx)
├── 30% → validadores / gas
├── 40% → fondo de premios (rifas, internet, helados, incentivos físicos)
└── 30% → reserva operacional del protocolo
```

### Capa 5: Modelo del Operador

- Compra USDT a comerciantes a BCV + 10%
- Tiene colateral trabajando en arbitraje/trading externo
- Bolivares que recibe → reinvertidos o usados para próximos retiros de comerciantes
- **Ganancia real:** spread entre tasa BCV y paralela + rendimiento del colateral externo
- Los bolivares que circulan internamente financian los incentivos físicos (premios de rifas, helados, etc.)

---

## Riesgos y Mitigaciones con Contratos

| Riesgo | Solución técnica |
|--------|-----------------|
| Oracle BCV manipulado | Multisig para actualizar tasa + timelock de 1 hora |
| Bank run de comerciantes | `withdrawalCooldown`: máx 20% del colateral por semana |
| Saqueo de liquidez | Límite de retiro diario por dirección en el contrato |
| Comerciante nuevo con capital falso | Staking mínimo de 30 días antes de poder hacer pagos |
| Arbitraje entrada/salida rápida | Fee de salida del 3% en los primeros 90 días |

---

## Tokenomics — El problema que hay que evitar

### La paradoja del gas

Imagina que abres una tienda de fotocopias. Cobras $1 por copia. Tu negocio crece y compras
máquinas más rápidas y baratas. Ahora cobras $0.01 por copia y haces 100 veces más copias.
Pero ganas menos dinero que antes aunque tengas más clientes.

Eso exactamente le pasa a las blockchains. El token vale porque la gente lo necesita para
pagar transacciones (gas). Pero los ingenieros trabajan todo el día para hacer las transacciones
más baratas. Entonces mientras mejor es la tecnología, menos vale el token. Es una contradicción
dentro del sistema.

### Sobre los "burns" — quemar tokens

La narrativa popular dice: "quemamos tokens, hay menos supply, el precio sube". Suena bien
pero tiene dos problemas:

1. Al mismo tiempo que quemas tokens, la blockchain crea tokens nuevos para pagar a los
   validadores. Entonces básicamente solo estás reduciendo la inflación, no creando escasez real.

2. Como cada vez hay menos gas fees porque las transacciones son más baratas, también hay
   menos tokens para quemar. El efecto se va reduciendo solo con el tiempo. Ethereum pasó de
   quemar 2000 ETH por día a solo 300-400. Ahora está creando más tokens de los que quema.

### La solución — DATs (Direct Acquisitions of Tokens)

*(Idea del CIO de Avalanche — aplicar a ArepaPay)*

En lugar de depender del gas para dar valor al token, los protocolos deberían **comprar sus
propios tokens en el mercado abierto con ingresos reales**. Como Aave que gasta $1M por semana
recomprando su token.

La diferencia con el burn es que esto actúa sobre la **demanda** (más gente quiere el token)
en lugar del **supply** (hay menos tokens). Y la demanda tiene impacto más directo en el precio.

### Por qué importa más allá del precio

En blockchains PoS, la seguridad de la red depende de cuánto vale el token. Si el token vale
poco, atacar la red es barato. Entonces si el modelo económico está roto, la seguridad también
está rota. No es solo un problema de inversores — es un problema de si la red puede sobrevivir.

### Relevancia para ArepaPay

El token AREPA ya está diseñado correctamente para este problema: se usa solo para gas, sin
pretender que sea una reserva de valor. Eso evita caer en la trampa.

**La propuesta de valor de ArepaPay está en el uso real (pagos, rifas, internet) no en la
especulación del token.**

**Aplicación práctica del modelo DAT a ArepaPay:**
- % del fee de red → recompra tokens AREPA en mercado abierto
- Tokens recomprados → van al fondo de recompensas (rifas, premios)
- Resultado: el uso real de la app crea demanda real del token, no especulación
- El comerciante que staquea tiene colateral que sube si la red crece de forma orgánica

---

## Pendientes Post-MVP

- [ ] Contrato LiquidityPool con staking de comerciantes
- [ ] Oracle BCV on-chain con multisig y timelock
- [ ] Mecanismo de retiro con cooldown y límite semanal
- [ ] InternetVoucher con integración MikroTik (hotspot captivo)
- [ ] Fee anti-especulación al entrar capital externo
- [ ] DAT: recompra automática de tokens con % del fee
- [ ] Panel de administración para el operador (retiros, gestión de liquidez)
