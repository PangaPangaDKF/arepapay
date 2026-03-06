import { useState, useEffect, useCallback } from "react";
import { Contract, formatUnits } from "ethers";
import { NETWORK } from "../config/network";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)"
];

export function useBalances(provider, address) {
  const [usdtBalance, setUsdtBalance] = useState("0.00");
  const [arepaBalance, setArepaBalance] = useState("0.00");
  const [tickets, setTickets]           = useState(0);
  const [loading, setLoading]           = useState(false);

  const fetchBalances = useCallback(async () => {
    if (!provider || !address) return;
    setLoading(true);
    try {
      const usdt   = new Contract(NETWORK.contracts.mockUSDT,     ERC20_ABI, provider);
      const arepa  = new Contract(NETWORK.contracts.arepaToken,   ERC20_ABI, provider);
      const reward = new Contract(NETWORK.contracts.rewardTicket, ERC20_ABI, provider);

      const [rawUsdt, rawArepa, rawTickets] = await Promise.all([
        usdt.balanceOf(address),
        arepa.balanceOf(address),
        reward.balanceOf(address)
      ]);

      setUsdtBalance(parseFloat(formatUnits(rawUsdt,  18)).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setArepaBalance(parseFloat(formatUnits(rawArepa, 18)).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setTickets(Number(rawTickets));
    } catch (e) {
      console.error("Error al leer balances:", e);
    } finally {
      setLoading(false);
    }
  }, [provider, address]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { usdtBalance, arepaBalance, tickets, loading, refetch: fetchBalances };
}
