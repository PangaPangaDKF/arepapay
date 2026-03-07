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
    name: "ArepaPay",
    currency: "AREPA",
    explorerUrl: "",
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
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: NETWORK.chainIdHex,
        chainName: "ArepaPay",
        nativeCurrency: { name: "Arepa Token", symbol: "AREPA", decimals: 18 },
        rpcUrls: [NETWORK.rpcUrl],
        blockExplorerUrls: []
      }]
    });
  };

  useEffect(() => {
    // Browser de wallet (Core, MetaMask) — proveedor inyectado
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then(async accounts => {
        if (accounts.length > 0) {
          try { await switchToArepaPay(); } catch (_) { /* continúa */ }
          setAddress(accounts[0]);
          setProvider(new BrowserProvider(window.ethereum));
          setConnected(true);
        }
      });
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
    }

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

    // Caso 1: browser interno de wallet (window.ethereum disponible)
    if (window.ethereum) {
      try {
        try { await switchToArepaPay(); } catch (_) { /* continúa aunque falle */ }

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAddress(accounts[0]);
        setProvider(new BrowserProvider(window.ethereum));
        setConnected(true);
      } catch (e) {
        setError("No se pudo conectar. Intenta de nuevo.");
      }
      return;
    }

    // Caso 2: Chrome externo → abre WalletConnect modal
    modal.open();
  }

  function disconnect() {
    setAddress(null); setProvider(null); setConnected(false);
    if (!window.ethereum) modal.disconnect();
  }

  return { address, provider, connected, connect, disconnect, error, switchChain: switchToArepaPay };
}
