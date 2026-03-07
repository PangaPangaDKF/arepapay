import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers";

const PROJECT_ID = "db994a81d918a65fc29e115033e4b47a";

const AREPA_CHAIN = {
  chainId: 4321987,
  name: "ArepaPay",
  currency: "AREPA",
  explorerUrl: "",
  rpcUrl: "http://127.0.0.1:9650/ext/bc/V9NDW69xy4W7PVdCggpHN2VFZEn1VCXNDgez9GbQpRwo9p2gn/rpc"
};

const modal = createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata: {
      name: "ArepaPay",
      description: "Pagos P2P venezolanos",
      url: window.location.origin,
      icons: []
    }
  }),
  chains: [AREPA_CHAIN],
  projectId: PROJECT_ID,
  themeMode: "light"
});

export function useWallet() {
  const [address, setAddress]     = useState(null);
  const [provider, setProvider]   = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Si hay proveedor inyectado (Core/MetaMask en browser interno), conéctalo directo
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
        if (accounts.length > 0) {
          const p = new BrowserProvider(window.ethereum);
          setAddress(accounts[0]);
          setProvider(p);
          setConnected(true);
        }
      });

      window.ethereum.on("accountsChanged", accounts => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setProvider(new BrowserProvider(window.ethereum));
          setConnected(true);
        } else {
          setAddress(null);
          setProvider(null);
          setConnected(false);
        }
      });
    }

    // WalletConnect como respaldo
    modal.subscribeProvider(({ address, isConnected, provider }) => {
      if (isConnected && address) {
        setAddress(address);
        setProvider(new BrowserProvider(provider));
        setConnected(true);
      } else if (!window.ethereum) {
        setAddress(null);
        setProvider(null);
        setConnected(false);
      }
    });
  }, []);

  async function connect() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAddress(accounts[0]);
        setProvider(new BrowserProvider(window.ethereum));
        setConnected(true);
      } catch (e) {
        console.error("Error conectando wallet:", e);
      }
    } else {
      modal.open();
    }
  }

  function disconnect() {
    setAddress(null);
    setProvider(null);
    setConnected(false);
    if (!window.ethereum) modal.disconnect();
  }

  return { address, provider, connected, connect, disconnect };
}
