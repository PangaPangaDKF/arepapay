import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { MERCHANTS } from "../config/network";

function buildQRData(merchant, amount) {
  return JSON.stringify({
    type:   "arepapay",
    to:     merchant.address,
    name:   merchant.name,
    amount: amount || undefined,
  });
}

// Modo 1: Lista de QR fijos por comercio (sin monto)
// Modo 2: Comerciante elige monto → QR con monto pre-llenado
export default function MerchantQRPage({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [amount, setAmount]     = useState("");
  const [showQR, setShowQR]     = useState(false);

  const amountValid = parseFloat(amount) > 0;

  if (showQR && selected) {
    return (
      <div style={{ padding: "16px", fontFamily: "Inter, sans-serif" }}>
        <button onClick={() => { setShowQR(false); setAmount(""); }} style={{ background: "transparent", border: "none", color: "#6B4A2A", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "16px" }}>
          ← Nuevo cobro
        </button>
        <div style={{ background: "#FFF8E8", border: "3px solid #2C1A0E", borderRadius: "12px", boxShadow: "4px 4px 0px #2C1A0E", padding: "24px 16px", textAlign: "center" }}>
          <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "0 0 4px 0" }}>Cobro de</p>
          <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "28px", margin: "0 0 4px 0" }}>{parseFloat(amount).toFixed(2)} <span style={{ fontSize: "16px", color: "#CC1111" }}>USDT</span></p>
          <p style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px", margin: "0 0 20px 0" }}>{selected.emoji} {selected.name}</p>
          <div style={{ display: "inline-block", background: "white", border: "4px solid #2C1A0E", borderRadius: "12px", padding: "16px", boxShadow: "4px 4px 0px #2C1A0E" }}>
            <QRCodeSVG value={buildQRData(selected, amount)} size={220} bgColor="#ffffff" fgColor="#2C1A0E" level="M" />
          </div>
          <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "16px 0 0 0" }}>El cliente escanea con el boton PAGAR</p>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div style={{ padding: "16px", fontFamily: "Inter, sans-serif" }}>
        <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: "#6B4A2A", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "16px" }}>
          ← Comercios
        </button>
        <div style={{ background: "#FFF8E8", border: "3px solid #2C1A0E", borderRadius: "12px", boxShadow: "4px 4px 0px #2C1A0E", padding: "20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "32px" }}>{selected.emoji}</span>
            <div>
              <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "16px", margin: 0 }}>{selected.name}</p>
              <p style={{ color: "#6B4A2A", fontSize: "11px", margin: 0 }}>Comercio verificado ArepaPay</p>
            </div>
          </div>
          <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>Monto del cobro</label>
          <input
            type="number" min="0" placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ width: "100%", background: "#FFF8E8", border: "3px solid #2C1A0E", borderRadius: "8px", padding: "14px 16px", fontSize: "28px", fontFamily: "Inter, sans-serif", color: "#2C1A0E", fontWeight: "900", boxSizing: "border-box", outline: "none", marginBottom: "6px" }}
          />
          <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "0 0 16px 0" }}>USDT</p>
          <button
            onClick={() => setShowQR(true)}
            disabled={!amountValid}
            style={{ width: "100%", background: amountValid ? "#CC1111" : "#8899CC", color: "white", border: `3px solid ${amountValid ? "#8A0A0A" : "#6677AA"}`, borderRadius: "8px", padding: "16px", fontSize: "16px", fontWeight: "bold", cursor: amountValid ? "pointer" : "not-allowed", fontFamily: "Inter, sans-serif", boxShadow: amountValid ? "4px 4px 0px #8A0A0A" : "none" }}
          >
            Generar QR de Cobro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", paddingBottom: "20px", fontFamily: "Inter, sans-serif" }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#6B4A2A", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "16px", padding: "4px 0" }}>
          ← Volver
        </button>
      )}

      <div style={{ background: "#1A2472", border: "3px solid #0D1040", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", boxShadow: "4px 4px 0px #0D1040" }}>
        <p style={{ color: "#FFD84A", fontWeight: "bold", fontSize: "13px", margin: "0 0 4px 0" }}>Selecciona tu comercio</p>
        <p style={{ color: "#8899CC", fontSize: "11px", margin: 0 }}>Ingresa el monto y genera el QR para que el cliente pague.</p>
      </div>

      {MERCHANTS.map(m => (
        <button
          key={m.id}
          onClick={() => setSelected(m)}
          style={{
            width: "100%", background: "#FFF8E8", border: "3px solid #2C1A0E", borderRadius: "12px",
            boxShadow: "4px 4px 0px #2C1A0E", padding: "16px", marginBottom: "10px",
            display: "flex", alignItems: "center", gap: "14px", cursor: "pointer",
            fontFamily: "Inter, sans-serif", textAlign: "left"
          }}
        >
          <span style={{ fontSize: "32px" }}>{m.emoji}</span>
          <div>
            <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "15px", margin: 0 }}>{m.name}</p>
            {m.category && <p style={{ color: "#6B4A2A", fontSize: "11px", margin: "2px 0 0 0" }}>{m.category}</p>}
          </div>
          <span style={{ marginLeft: "auto", color: "#CC1111", fontSize: "18px" }}>→</span>
        </button>
      ))}
    </div>
  );
}
