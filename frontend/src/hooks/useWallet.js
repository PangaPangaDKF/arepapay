import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers";
import { NETWORK } from "../config/network";

const PROJECT_ID = "db994a81d918a65fc29e115033e4b47a";

const modal = createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata: {
      name: "ArepaPay",
      description: "Pagos P2P venezolanos",
      url: window.location.origin,
      icons: [`${window.location.origin}/icon-192.svg`]
    }
  }),
  chains: [{
    chainId: NETWORK.chainId,
    name: "Avalanche Fuji Testnet",
    currency: "AVAX",
    explorerUrl: "https://testnet.snowtrace.io",
    rpcUrl: NETWORK.rpcUrl
  }],
  projectId: PROJECT_ID,
  themeMode: "light"
});

export function useWallet() {
  const [address, setAddress]     = useState(null);
  const [provider, setProvider]   = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError]         = useState(null);

  const switchToArepaPay = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NETWORK.chainIdHex }]
      });
    } catch (e) {
      // 4902 = cadena no agregada aun — la agregamos
      if (e?.code === 4902 || e?.code === -32603) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: NETWORK.chainIdHex,
            chainName: "Avalanche Fuji Testnet",
            nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
            rpcUrls: [NETWORK.rpcUrl],
            blockExplorerUrls: ["https://testnet.snowtrace.io"]
          }]
        });
      }
    }
  };

  useEffect(() => {
    // Browser de wallet (Core, MetaMask) — proveedor inyectado
    // Wrapped in try-catch para manejar conflictos entre extensiones (MetaMask vs Core)
    try {
      if (window.ethereum) {
        window.ethereum.request({ method: "eth_accounts" }).then(async accounts => {
          if (accounts.length > 0) {
            try { await switchToArepaPay(); } catch (_) { /* continúa */ }
            setAddress(accounts[0]);
            setProvider(new BrowserProvider(window.ethereum));
            setConnected(true);
          }
        }).catch(() => { /* extensión en conflicto — usa WalletConnect */ });
        try {
          window.ethereum.on("accountsChanged", accounts => {
            if (accounts.length > 0) {
              setAddress(accounts[0]);
              setProvider(new BrowserProvider(window.ethereum));
              setConnected(true);
            } else {
              setAddress(null); setProvider(null); setConnected(false);
            }
          });
          window.ethereum.on("chainChanged", () => {
            setProvider(new BrowserProvider(window.ethereum));
          });
        } catch (_) { /* listeners no disponibles — usa WalletConnect */ }
      }
    } catch (_) { /* window.ethereum roto por conflicto de extensiones */ }

    // WalletConnect — Chrome externo → Core/MetaMask app
    modal.subscribeProvider(({ address, isConnected, provider }) => {
      if (isConnected && address) {
        setAddress(address);
        setProvider(new BrowserProvider(provider));
        setConnected(true);
      } else if (!window.ethereum) {
        setAddress(null); setProvider(null); setConnected(false);
      }
    });
  }, []);

  async function connect() {
    setError(null);

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (!accounts || accounts.length === 0) {
          setError("MetaMask no devolvió cuentas. Desbloquea tu wallet e intenta de nuevo.");
          return;
        }
        setAddress(accounts[0]);
        setProvider(new BrowserProvider(window.ethereum));
        setConnected(true);
        return;
      } catch (e) {
        const code = e?.code;
        if (code === 4001) {
          setError("Conexión rechazada. Acepta en tu wallet.");
        } else if (code === -32002) {
          setError("MetaMask tiene una solicitud pendiente. Abre MetaMask y acepta la solicitud.");
        } else {
          setError(`Error (${code ?? "?"}): ${e?.message?.slice(0, 80) ?? "desconocido"}`);
        }
        return;
      }
    }

    // Sin window.ethereum → WalletConnect
    modal.open();
  }

  function disconnect() {
    setAddress(null); setProvider(null); setConnected(false);
    if (!window.ethereum) modal.disconnect();
  }

  return { address, provider, connected, connect, disconnect, error, switchChain: switchToArepaPay };
}
