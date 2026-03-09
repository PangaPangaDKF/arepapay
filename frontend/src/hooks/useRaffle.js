import { useState, useEffect, useCallback } from "react";
import { Contract, JsonRpcProvider, BrowserProvider } from "ethers";
import { NETWORK } from "../config/network";

const RAFFLE_ABI = [
  "function getRaffleState() view returns (uint256 txCount, uint256 txThreshold, uint256 currentRound, bool isOpen, uint256 totalStaked, uint256 participantCount, address[3] winners, uint256 winnersCount, bool drawn, string prize)",
  "function myStake(address user) view returns (uint256)",
  "function enter(uint256 amount) external",
];

export function useRaffle(provider, address) {
  const [state, setState]       = useState(null);
  const [myStake, setMyStake]   = useState(0);
  const [loading, setLoading]   = useState(true);
  const [entering, setEntering] = useState(false);
  const [error, setError]       = useState("");

  const fetch = useCallback(async () => {
    try {
      const rpc    = new JsonRpcProvider(NETWORK.rpcUrl);
      const raffle = new Contract(NETWORK.contracts.raffle, RAFFLE_ABI, rpc);
      const s = await raffle.getRaffleState();
      setState({
        txCount:          Number(s[0]),
        txThreshold:      Number(s[1]),
        currentRound:     Number(s[2]),
        isOpen:           s[3],
        totalStaked:      Number(s[4]),
        participantCount: Number(s[5]),
        winners:          [...s[6]],       // address[3]
        winnersCount:     Number(s[7]),
        drawn:            s[8],
        prize:            s[9],
      });
      if (address) {
        const stake = await raffle.myStake(address);
        setMyStake(Number(stake));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 15000);
    return () => clearInterval(id);
  }, [fetch]);

  async function enter(ticketAmount) {
    if (!provider || !ticketAmount || ticketAmount < 1) return;
    setEntering(true);
    setError("");
    try {
      const signer = await provider.getSigner();
      const raffle = new Contract(NETWORK.contracts.raffle, RAFFLE_ABI, signer);
      const tx = await raffle.enter(BigInt(ticketAmount));
      await tx.wait();
      await fetch();
    } catch (e) {
      setError(e?.reason || e?.message || "Error desconocido");
    } finally {
      setEntering(false);
    }
  }

  return { state, myStake, loading, entering, error, refetch: fetch, enter };
}
