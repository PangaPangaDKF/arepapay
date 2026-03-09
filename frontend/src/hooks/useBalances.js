import { useState, useEffect, useCallback } from "react";
import { JsonRpcProvider, Contract, formatUnits } from "ethers";
import { NETWORK } from "../config/network";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)"
];

export function useBalances(provider, address) {
  const [usdtBalance, setUsdtBalance]       = useState("0");
  const [arepaBalance, setArepaBalance]     = useState("0.00");
  const [tickets, setTickets]               = useState(0);
  const [internetMinutes, setInternetMinutes] = useState(0);
  const [poolBalance, setPoolBalance]       = useState(0);
  const [loading, setLoading]               = useState(false);
  const [fetchError, setFetchError]         = useState(null);

  const fetchBalances = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setFetchError(null);
    try {
      const rpcProvider = new JsonRpcProvider(NETWORK.rpcUrl);
      const usdt    = new Contract(NETWORK.contracts.mockUSDT,      ERC20_ABI, rpcProvider);
      const reward  = new Contract(NETWORK.contracts.rewardTicket,  ERC20_ABI, rpcProvider);
      const voucher = new Contract(NETWORK.contracts.internetVoucher, ERC20_ABI, rpcProvider);

      const [rawUsdt, rawNative, rawTickets, rawMinutes, rawPool] = await Promise.all([
        usdt.balanceOf(address),
        rpcProvider.getBalance(address),
        reward.balanceOf(address),
        voucher.balanceOf(address),
        usdt.balanceOf(NETWORK.contracts.liquidityManager)
      ]);

      setUsdtBalance(parseFloat(formatUnits(rawUsdt,   18)).toLocaleString("es-VE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
      setArepaBalance(parseFloat(formatUnits(rawNative, 18)).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setTickets(Number(rawTickets));
      setInternetMinutes(Number(rawMinutes));
      setPoolBalance(parseFloat(formatUnits(rawPool, 18)));
    } catch (e) {
      setFetchError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { usdtBalance, arepaBalance, tickets, internetMinutes, poolBalance, loading, fetchError, refetch: fetchBalances };
}
