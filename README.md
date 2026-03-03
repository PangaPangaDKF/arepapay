# 🫓 ArepaPay

> Obtén $ a tasa oficial con autocustodia, realiza pagos, participa y obtén incentivos.
> Usando la tecnología de Avalanche para romper la barrera entre web0, web1, web2, web3 y todos los web.
> **La arepa es venezolana. 🫓🇻🇪**

## ¿Qué es ArepaPay?
App de pagos P2P en una subnet de Avalanche. Los usuarios pagan con USDT, 
ganan tickets por cada transacción y participan en rifas de premios físicos 
en comercios locales.

## Stack
- Solidity + Foundry
- React + Vite (frontend)
- Avalanche Subnet (Chain ID: 4321987)

## Contratos
| Contrato | Dirección |
|----------|-----------|
| ArepaToken | `0xa4dff80b4a1d748bf28bc4a271ed834689ea3407` |
| MockUSDT | `0xe336d36faca76840407e6836d26119e1ece0a2b4` |
| MerchantRegistry | `0x95ca0a568236fc7413cd2b794a7da24422c2bbb6` |
| PaymentProcessor | `0x789a5fdac2b37fcd290fb2924382297a6ae65860` |
| LiquidityManager | `0xe3573540ab8a1c4c754fd958dc1db39bbe81b208` |
| RewardNFT | `0x8b3bc4270be2abbb25bc04717830bd1cc493a461` |

## Estado
- ✅ Fase 1: Contratos deployados en subnet local
- 🚀 Fase 2: Frontend React (en desarrollo)
