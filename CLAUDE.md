# ArepaPay — Instrucciones para Claude Code

## Regla principal
**Siempre responde en español**, aunque el prompt interno esté en inglés.

## Slash command disponible
Escribe `/prompt` antes de cualquier request para que Claude:
1. Traduzca internamente tu mensaje al inglés
2. Lo reescriba como prompt optimizado con mejores prácticas de LLM
3. Ejecute ese prompt y responda en español

Ejemplo: `/prompt quiero agregar un historial de transacciones`

## Contexto del proyecto

**App:** ArepaPay — pagos P2P venezolanos en Avalanche Fuji Testnet
**GitHub:** https://github.com/PangaPangaDKF/arepapay
**Frontend local:** http://localhost:5173
**Carpeta activa:** C:\Users\dulbi\arepapay-clean\

### Stack
- React 19 + Vite + ethers.js v6
- Solidity 0.8.x + Foundry
- Red: Avalanche Fuji Testnet (chainId 43113)
- Deploy: Vercel → https://frontend-tau-ten-27.vercel.app

### Contratos en Fuji
| Contrato | Dirección |
|----------|-----------|
| MockUSDT | 0xcfefb29bd69c0af628a1d206c366133629011820 |
| MerchantRegistry | 0x53ac07432c22eee0ee6ce5c003bf198f4712bc0b |
| RewardTicket | 0x5430B7598ea098eB2E217bebda1406805f142aEf |
| PaymentProcessor | 0xb10EE9c97Db6be098406618c2088eAC87e994483 |
| Raffle | 0x3c25B5E7C32f258932071801Ea200BbDdd3A1CC0 |
| InternetVoucher | 0xd72a6a47B342971380Fc02eF911103E09b47B8AD |

### Archivos clave
- `frontend/src/config/network.js` — direcciones y comercios
- `frontend/src/hooks/useBalances.js` — balances USDT, tickets, internet
- `frontend/src/hooks/useRaffle.js` — lógica de rifas
- `frontend/src/components/Dashboard.jsx` — pantalla principal
- `frontend/src/components/SendScreen.jsx` — enviar USDT
- `frontend/src/components/RafflesScreen.jsx` — rifas
- `frontend/src/components/InternetScreen.jsx` — vouchers WiFi

## Reglas de seguridad
- **Nunca** mostrar, usar ni buscar claves privadas en archivos
- Scripts de prueba usan solo variables de entorno ($PRIVATE_KEY, $PK1, etc.)
- Si hay un .env en el repo, advertir al usuario

## Estilo y diseño
- UI en español, tono venezolano informal
- Colores: marrón oscuro #2C1A0E, dorado #D4B87A, crema #FFF8E0, rojo #CC1111, azul #1A2472
- Mobile-first, max-width 420px
- Pixel RPG aesthetic (paneles con borde grueso, sombras offset)

## Git
- Commits en inglés (convención: feat/fix/docs/chore)
- Remote: https://github.com/PangaPangaDKF/arepapay.git
- Branch: main
