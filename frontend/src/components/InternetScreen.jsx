import { useState } from "react";
import { Contract, BrowserProvider } from "ethers";
import { NETWORK } from "../config/network";
import PixelButton from "./PixelButton";

const VOUCHER_ABI = [
  "function activate(uint256 minutes_) external",
  "function balanceOf(address) view returns (uint256)",
];

const PLAN_OPTIONS = [
  { mins: 30,  label: "30 minutos",  desc: "Navegacion rapida",    emoji: "⚡" },
  { mins: 60,  label: "1 hora",      desc: "Sesion completa",      emoji: "🌐" },
  { mins: 120, label: "2 horas",     desc: "Trabajo o estudio",    emoji: "💻" },
];

export default function InternetScreen({ internetMinutes, provider, address, onBack, onActivated }) {
  const [activating, setActivating] = useState(false);
  const [activated, setActivated]   = useState(null); // { mins, ts }
  const [error, setError]           = useState("");

  async function handleActivate(mins) {
    if (!provider || activating) return;
    if (internetMinutes < mins) {
      setError(`Necesitas ${mins} min, tienes ${internetMinutes}`);
      return;
    }
    setActivating(true);
    setError("");
    try {
      const signer  = await provider.getSigner();
      const voucher = new Contract(NETWORK.contracts.internetVoucher, VOUCHER_ABI, signer);
      const tx = await voucher.activate(BigInt(mins));
      await tx.wait();
      setActivated({ mins, ts: new Date().toLocaleTimeString("es-VE") });
      if (onActivated) onActivated();
    } catch (e) {
      setError(e?.reason || e?.message || "Error desconocido");
    } finally {
      setActivating(false);
    }
  }

  return (
    <div style={{ padding: "16px", paddingBottom: "80px" }}>
      <button
        onClick={onBack}
        style={{ background: "transparent", border: "none", color: "#6B4A2A", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "12px", padding: "4px 0", fontFamily: "Inter, sans-serif" }}
      >
        ← Volver
      </button>

      {/* Banner saldo */}
      <div style={{
        background: "linear-gradient(135deg, #0D1040 0%, #1A2472 100%)",
        border: "3px solid #0D1040",
        borderRadius: "12px",
        boxShadow: "4px 4px 0px #0D1040",
        marginBottom: "14px",
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#8899CC", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px 0" }}>
              Minutos disponibles
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ color: "#FFFFFF", fontSize: "52px", fontWeight: "900", lineHeight: 1 }}>{internetMinutes}</span>
              <span style={{ color: "#FFD84A", fontSize: "16px", fontWeight: "bold" }}>min</span>
            </div>
            <p style={{ color: "#8899CC", fontSize: "11px", margin: "6px 0 0 0" }}>
              Ganas 30 min por cada pago a comercio
            </p>
          </div>
          <span style={{ fontSize: "56px" }}>🌐</span>
        </div>
      </div>

      {/* Activacion exitosa */}
      {activated && (
        <div style={{
          background: "#78C040",
          border: "3px solid #4A8020",
          borderRadius: "10px",
          boxShadow: "4px 4px 0px #4A8020",
          padding: "16px",
          marginBottom: "14px",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "32px", margin: "0 0 6px 0" }}>✅</p>
          <p style={{ color: "#1A3008", fontWeight: "900", fontSize: "16px", margin: "0 0 4px 0" }}>
            WiFi Activado — {activated.mins} minutos
          </p>
          <p style={{ color: "#2A5010", fontSize: "12px", margin: 0 }}>
            Activado a las {activated.ts} · Conectate al WiFi del local
          </p>
        </div>
      )}

      {/* Planes */}
      <div style={{ background: "#FFFFFF", border: "3px solid #C89038", borderRadius: "12px", boxShadow: "4px 4px 0px #C89038", marginBottom: "14px", overflow: "hidden" }}>
        <div style={{ background: "#FFF8E0", borderBottom: "2px solid #C89038", padding: "10px 16px" }}>
          <span style={{ color: "#1A2472", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
            Elige tu plan
          </span>
        </div>
        <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
          {PLAN_OPTIONS.map(({ mins, label, desc, emoji }) => {
            const canAfford = internetMinutes >= mins;
            return (
              <div
                key={mins}
                style={{
                  background: canAfford ? "#FFF8E8" : "#F8F4EE",
                  border: `2px solid ${canAfford ? "#2C1A0E" : "#D4C8A8"}`,
                  borderRadius: "10px",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  opacity: canAfford ? 1 : 0.6
                }}
              >
                <span style={{ fontSize: "32px", minWidth: "40px", textAlign: "center" }}>{emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "15px", margin: "0 0 2px 0" }}>{label}</p>
                  <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0 }}>{desc} · {mins} min</p>
                </div>
                <PixelButton
                  variant={canAfford ? "green" : "ghost"}
                  onClick={() => canAfford && handleActivate(mins)}
                  disabled={!canAfford || activating}
                  style={{ width: "auto", padding: "8px 14px", fontSize: "13px", minWidth: "80px" }}
                >
                  {activating ? "..." : canAfford ? "Activar" : "Sin saldo"}
                </PixelButton>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div style={{ background: "#FFF0F0", border: "2px solid #CC1111", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px" }}>
          <p style={{ color: "#CC1111", fontSize: "12px", margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {/* Como funciona */}
      <div style={{ background: "#FFF8E8", border: "2px solid #D4B87A", borderRadius: "10px", padding: "14px 16px" }}>
        <p style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "12px", margin: "0 0 8px 0" }}>Como funciona</p>
        <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0, lineHeight: 1.7 }}>
          1. Paga en cualquier comercio socio → ganas 30 min<br />
          2. Elige un plan y toca Activar<br />
          3. Conectate al WiFi del local<br />
          4. El acceso se abre automaticamente
        </p>
      </div>
    </div>
  );
}
