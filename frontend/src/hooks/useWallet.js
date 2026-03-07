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
      icons: []
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

// Agrega la red ArepaPay a la wallet y cambia a ella
async function addArepaNetwork() {
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
}

export function useWallet() {
  const [address, setAddress]     = useState(null);
  const [provider, setProvider]   = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (!window.ethereum) return;

    // Reconectar si ya había una cuenta activa
    window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
      if (accounts.length > 0) {
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
  }, []);

  // WalletConnect como respaldo (sin window.ethereum)
  useEffect(() => {
    if (window.ethereum) return;
    modal.subscribeProvider(({ address, isConnected, provider }) => {
      if (isConnected && address) {
        setAddress(address);
        setProvider(new BrowserProvider(provider));
        setConnected(true);
      } else {
        setAddress(null); setProvider(null); setConnected(false);
      }
    });
  }, []);

  async function connect() {
    setError(null);
    if (window.ethereum) {
      try {
        // 1. Agrega y cambia a la red ArepaPay automáticamente
        await addArepaNetwork();
        // 2. Solicita acceso a la cuenta
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAddress(accounts[0]);
        setProvider(new BrowserProvider(window.ethereum));
        setConnected(true);
      } catch (e) {
        console.error(e);
        setError(e?.message || "Error al conectar");
      }
    } else {
      modal.open();
    }
  }

  function disconnect() {
    setAddress(null); setProvider(null); setConnected(false);
    if (!window.ethereum) modal.disconnect();
  }

  return { address, provider, connected, connect, disconnect, error };
}
