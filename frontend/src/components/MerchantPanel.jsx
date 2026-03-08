import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import MerchantQRPage from "./MerchantQRPage";

const panel = {
  background: "#F0DCA0",
  border: "3px solid #2C1A0E",
  borderRadius: "10px",
  boxShadow: "4px 4px 0px #2C1A0E",
  overflow: "hidden",
  marginBottom: "14px"
};

const panelHeader = {
  background: "#D4B87A",
  borderBottom: "3px solid #2C1A0E",
  padding: "10px 16px",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const inputStyle = {
  width: "100%",
  background: "#FFF8E8",
  border: "3px solid #2C1A0E",
  borderRadius: "8px",
  padding: "14px 16px",
  fontSize: "16px",
  fontFamily: "Inter, sans-serif",
  color: "#2C1A0E",
  fontWeight: "600",
  boxSizing: "border-box",
  outline: "none"
};

// Formato del QR: JSON con tipo arepapay
function buildQRData(address, amount, name) {
  return JSON.stringify({
    type:   "arepapay",
    to:     address,
    amount: amount,
    name:   name || "Comercio ArepaPay"
  });
}

export default function MerchantPanel({ address, onBack }) {
  const [amount, setAmount]       = useState("");
  const [name,   setName]         = useState("");
  const [showQR, setShowQR]       = useState(false);
  const [showAllQRs, setShowAllQRs] = useState(false);

  const amountValid = parseFloat(amount) > 0;

  function generateQR() {
    if (amountValid) setShowQR(true);
  }

  function reset() {
    setShowQR(false);
    setAmount("");
  }

  if (showAllQRs) {
    return <MerchantQRPage onBack={() => setShowAllQRs(false)} />;
  }

  if (showQR) {
    const qrData = buildQRData(address, amount, name);
    return (
      <div style={{ padding: "16px", paddingBottom: "80px" }}>
        <button onClick={reset} style={{ background: "transparent", border: "none", color: "#6B4A2A", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "12px", padding: "4px 0", fontFamily: "Inter, sans-serif" }}>
          ← Nuevo cobro
        </button>

        <div style={{ ...panel, textAlign: "center" }}>
          <div style={{ ...panelHeader, justifyContent: "center" }}>
            <span style={{ fontSize: "18px" }}>🏪</span>
            <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>QR de Cobro</span>
          </div>
          <div style={{ padding: "28px 20px" }}>
            <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "0 0 6px 0" }}>Monto a cobrar</p>
            <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "32px", margin: "0 0 20px 0" }}>
              {parseFloat(amount).toFixed(2)} <span style={{ fontSize: "18px", color: "#CC1111" }}>USDT</span>
            </p>

            {name && (
              <p style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px", margin: "0 0 16px 0" }}>{name}</p>
            )}

            {/* QR */}
            <div style={{ display: "inline-block", background: "white", border: "4px solid #2C1A0E", borderRadius: "12px", padding: "16px", boxShadow: "4px 4px 0px #2C1A0E", marginBottom: "20px" }}>
              <QRCodeSVG
                value={qrData}
                size={200}
                bgColor="#ffffff"
                fgColor="#2C1A0E"
                level="M"
              />
            </div>

            <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "0 0 16px 0" }}>
              El cliente escanea este QR desde la seccion <strong>Enviar</strong>
            </p>

            <div style={{ background: "#FFF8E8", border: "2px solid #2C1A0E", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
              <p style={{ color: "#6B4A2A", fontSize: "11px", margin: 0, wordBreak: "break-all" }}>
                Tu direccion: {address?.slice(0, 10)}...{address?.slice(-8)}
              </p>
            </div>

            <button
              onClick={reset}
              style={{ width: "100%", background: "#1A2472", color: "white", border: "3px solid #0D1040", borderRadius: "8px", padding: "14px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "3px 3px 0px #0D1040" }}
            >
              + Nuevo cobro
            </button>
          </div>
        </div>

        {/* Nota de dust AREPA */}
        <div style={{ background: "#1A2472", border: "3px solid #0D1040", borderRadius: "10px", padding: "12px 16px", boxShadow: "4px 4px 0px #0D1040" }}>
          <p style={{ color: "#FFD84A", fontWeight: "bold", fontSize: "12px", margin: "0 0 4px 0" }}>
            Proximamente: AREPA Dust
          </p>
          <p style={{ color: "#8899CC", fontSize: "11px", margin: 0, lineHeight: 1.5 }}>
            Al recibir tu primer pago, la app te enviara automaticamente un poco de AREPA para cubrir el gas de futuras transacciones. Sin costo, sin registro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", paddingBottom: "80px" }}>
      <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#6B4A2A", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "12px", padding: "4px 0", fontFamily: "Inter, sans-serif" }}>
        ← Volver
      </button>

      <div style={panel}>
        <div style={panelHeader}>
          <span style={{ fontSize: "18px" }}>🏪</span>
          <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>Panel de Comerciante</span>
        </div>
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "18px" }}>

          <div>
            <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
              Nombre de tu negocio (opcional)
            </label>
            <input
              style={inputStyle}
              placeholder="Panaderia El Arepazo"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
              Monto a cobrar
            </label>
            <input
              style={{ ...inputStyle, fontSize: "28px" }}
              placeholder="0.00"
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "6px 0 0 0" }}>USDT</p>
          </div>

          <button
            onClick={generateQR}
            disabled={!amountValid}
            style={{
              background: amountValid ? "#1A2472" : "#8899CC",
              color: "white",
              border: `3px solid ${amountValid ? "#0D1040" : "#6677AA"}`,
              borderRadius: "8px",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: amountValid ? "pointer" : "not-allowed",
              fontFamily: "Inter, sans-serif",
              boxShadow: amountValid ? "4px 4px 0px #0D1040" : "none"
            }}
          >
            Generar QR de Cobro
          </button>

          <div style={{ background: "#FFF8E8", border: "2px solid #D4B87A", borderRadius: "8px", padding: "12px" }}>
            <p style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "12px", margin: "0 0 6px 0" }}>Como funciona</p>
            <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0, lineHeight: 1.6 }}>
              1. Ingresa el monto del cobro<br />
              2. Muestra el QR al cliente<br />
              3. El cliente escanea y aprueba en MetaMask<br />
              4. El USDT llega directamente a tu wallet
            </p>
          </div>

          <button
            onClick={() => setShowAllQRs(true)}
            style={{ width: "100%", background: "#F0DCA0", color: "#2C1A0E", border: "3px solid #2C1A0E", borderRadius: "8px", padding: "12px", fontSize: "13px", fontWeight: "bold", cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "3px 3px 0px #2C1A0E" }}
          >
            Ver QR de todos los comercios
          </button>
        </div>
      </div>
    </div>
  );
}
