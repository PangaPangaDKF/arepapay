import { useState, useEffect, useCallback } from "react";
import { JsonRpcProvider, Contract, formatUnits } from "ethers";
import { NETWORK } from "../config/network";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)"
];

export function useBalances(provider, address) {
  const [usdtBalance, setUsdtBalance] = useState("0.00");
  const [arepaBalance, setArepaBalance] = useState("0.00");
  const [tickets, setTickets]           = useState(0);
  const [loading, setLoading]           = useState(false);
  const [fetchError, setFetchError]     = useState(null);

  const fetchBalances = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setFetchError(null);
    try {
      // Leer directo del RPC — no depende de la red activa en MetaMask
      const rpcProvider = new JsonRpcProvider(NETWORK.rpcUrl);
      const usdt   = new Contract(NETWORK.contracts.mockUSDT,     ERC20_ABI, rpcProvider);
      const arepa  = new Contract(NETWORK.contracts.arepaToken,   ERC20_ABI, rpcProvider);
      const reward = new Contract(NETWORK.contracts.rewardTicket, ERC20_ABI, rpcProvider);

      const [rawUsdt, rawArepa, rawTickets] = await Promise.all([
        usdt.balanceOf(address),
        arepa.balanceOf(address),
        reward.balanceOf(address)
      ]);

      setUsdtBalance(parseFloat(formatUnits(rawUsdt,  18)).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setArepaBalance(parseFloat(formatUnits(rawArepa, 18)).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setTickets(Number(rawTickets));
    } catch (e) {
      setFetchError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { usdtBalance, arepaBalance, tickets, loading, fetchError, refetch: fetchBalances };
}
