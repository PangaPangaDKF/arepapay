# 🫓 ArepaWallet WDK

> **Estado: En desarrollo (WIP)**
> Base de la wallet embebida de ArepaPay. No requiere MetaMask ni extensiones externas.

## ¿Qué es esto?

ArepaWallet WDK es una wallet embebida diseñada para que cualquier venezolano pueda usar ArepaPay **sin necesidad de instalar MetaMask ni conocer nada de crypto**.

El usuario:
1. Entra a la app
2. Crea su wallet con un PIN de 6 dígitos
3. Listo — puede enviar y recibir USDT

Sin seed phrases. Sin extensiones. Sin fricción.

## Stack técnico

- **Red:** ArepaPay Subnet (Avalanche L1)
- **Chain ID:** 13370
- **Token de gas:** AREPA
- **Token de pago:** USDT (mockUSDT en testnet)
- **Wallet management:** WDK (Wallet Developer Kit) by Tether
- **Encriptación:** AES-256 — clave derivada del PIN del usuario

## Estructura (WIP)

```
arepawalletWDK/
├── src/
│   ├── index.js          ← Entry point
│   ├── wallet.js         ← Creación, cifrado, recuperación de wallet
│   ├── network.js        ← Config de red ArepaPay Subnet
│   └── crypto.js         ← Helpers de encriptación PIN → clave AES
├── package.json
└── README.md
```

## Flow de usuario planeado

```
[Pantalla inicio]
      │
      ├─ Primera vez → [Crear wallet con PIN]
      │                      │
      │                [Wallet creada y guardada cifrada en localStorage]
      │
      └─ Ya tiene wallet → [Ingresar PIN] → [Dashboard]
                                                  │
                                            [Enviar USDT]
                                            [Recibir USDT]
                                            [Rifas]
                                            [Internet WiFi]
```

## TODO (próximos pasos)

- [ ] `wallet.js`: generación de wallet, cifrado con PIN, guardado en localStorage
- [ ] `crypto.js`: derivación de clave AES desde PIN + salt
- [ ] Integración con WDK MCP Server para gestión avanzada
- [ ] UI React: `WalletSetup.jsx` → crear/restaurar wallet
- [ ] Conectar con contratos ArepaPay en la subnet
- [ ] Exportación de seed phrase (opción avanzada)
- [ ] Biometría (WebAuthn) como alternativa al PIN

## Contexto del proyecto

Esta wallet es parte del roadmap de ArepaPay para eliminar la barrera de entrada de MetaMask.
El MVP actual usa MetaMask + Fuji Testnet.
Esta wallet embebida está planeada para la V2 con subnet propia.

Ver el proyecto principal: [../README.md](../README.md)
