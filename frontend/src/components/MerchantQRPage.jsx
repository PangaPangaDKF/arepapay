import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { MERCHANTS } from "../config/network";

const BCV_RATE = 400;

function buildQRData(merchant, usdtAmount) {
  return JSON.stringify({
    type:   "arepapay",
    to:     merchant.address,
    name:   merchant.name,
    amount: usdtAmount || undefined,
  });
}

// Soporta URL param ?merchant&id=agua&bs=350 para demos
function getURLParams() {
  const p = new URLSearchParams(window.location.search);
  return { id: p.get("id"), bs: p.get("bs") };
}

export default function MerchantQRPage({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [bsAmount, setBsAmount] = useState("");
  const [showQR, setShowQR]     = useState(false);

  // Auto-load desde URL params (para video demo)
  useEffect(() => {
    const { id, bs } = getURLParams();
    if (id) {
      const m = MERCHANTS.find(m => m.id === id);
      if (m) {
        setSelected(m);
        if (bs && parseFloat(bs) > 0) {
          setBsAmount(bs);
          setShowQR(true);
        }
      }
    }
  }, []);

  const usdtAmount   = bsAmount ? (parseFloat(bsAmount) / BCV_RATE).toFixed(6) : "";
  const amountValid  = parseFloat(bsAmount) > 0;
  const usdtDisplay  = amountValid ? (parseFloat(bsAmount) / BCV_RATE).toFixed(2) : "0.00";

  if (showQR && selected) {
    return (
      <div style={{ padding: "16px", fontFamily: "Inter, sans-serif" }}>
        <button onClick={() => { setShowQR(false); setBsAmount(""); }} style={{ background: "transparent", border: "none", color: "#6B4A2A", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "16px" }}>
          ← Nuevo cobro
        </button>
        <div style={{ background: "#FFF8E8", border: "3px solid #2C1A0E", borderRadius: "12px", boxShadow: "4px 4px 0px #2C1A0E", padding: "24px 16px", textAlign: "center" }}>
          <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "0 0 2px 0" }}>Cobro de</p>
          <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "36px", margin: "0 0 2px 0" }}>
            {parseFloat(bsAmount).toLocaleString("es-VE")} <span style={{ fontSize: "18px", color: "#CC1111" }}>Bs</span>
          </p>
          <p style={{ color: "#6B4A2A", fontSize: "13px", margin: "0 0 4px 0" }}>= {usdtDisplay} USDT</p>
          <p style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px", margin: "0 0 20px 0" }}>{selected.emoji} {selected.name}</p>
          <div style={{ display: "inline-block", background: "white", border: "4px solid #2C1A0E", borderRadius: "12px", padding: "16px", boxShadow: "4px 4px 0px #2C1A0E" }}>
            <QRCodeSVG value={buildQRData(selected, usdtAmount)} size={220} bgColor="#ffffff" fgColor="#2C1A0E" level="M" />
          </div>
          <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "16px 0 0 0" }}>El cliente escanea con el botón 📷 PAGAR</p>
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
          <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
            Monto del cobro (Bs)
          </label>
          <div style={{ position: "relative", marginBottom: "6px" }}>
            <input
              type="number" min="0" placeholder="0"
              value={bsAmount}
              onChange={e => setBsAmount(e.target.value)}
              style={{ width: "100%", background: "#FFF8E8", border: "3px solid #2C1A0E", borderRadius: "8px", padding: "14px 56px 14px 16px", fontSize: "28px", fontFamily: "Inter, sans-serif", color: "#2C1A0E", fontWeight: "900", boxSizing: "border-box", outline: "none" }}
            />
            <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#C89038", fontWeight: "900", fontSize: "18px" }}>Bs</span>
          </div>
          {amountValid && (
            <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "0 0 16px 0" }}>= {usdtDisplay} USDT · Tasa {BCV_RATE} Bs/$</p>
          )}
          {!amountValid && <div style={{ marginBottom: "16px" }} />}
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
        <p style={{ color: "#8899CC", fontSize: "11px", margin: 0 }}>Ingresa el monto en Bs y genera el QR para que el cliente pague.</p>
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
