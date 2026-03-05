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
      url: "http://localhost:5173",
      icons: []
    }
  }),
  chains: [AREPA_CHAIN],
  projectId: PROJECT_ID,
  themeMode: "light"
});

export function useWallet() {
  const [address, setAddress]   = useState(null);
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    modal.subscribeProvider(({ address, isConnected, provider }) => {
      if (isConnected && address) {
        setAddress(address);
        setProvider(new BrowserProvider(provider));
        setConnected(true);
      } else {
        setAddress(null);
        setProvider(null);
        setConnected(false);
      }
    });
  }, []);

  const connect    = () => modal.open();
  const disconnect = () => modal.disconnect();

  return { address, provider, connected, connect, disconnect };
}
