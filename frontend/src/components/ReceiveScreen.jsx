import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import PixelButton from "./PixelButton";

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

export default function ReceiveScreen({ address, onBack }) {
  const [copied, setCopied] = useState(false);

  function copyAddress() {
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ padding: "16px", paddingBottom: "80px" }}>
      <button
        onClick={onBack}
        style={{
          background: "transparent",
          border: "none",
          color: "#6B4A2A",
          fontSize: "14px",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "12px",
          padding: "4px 0",
          fontFamily: "Inter, sans-serif"
        }}
      >
        ← Volver
      </button>

      {/* QR Panel */}
      <div style={panel}>
        <div style={panelHeader}>
          <span style={{ fontSize: "18px" }}>📥</span>
          <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>
            Recibir USDT
          </span>
        </div>

        <div style={{ padding: "24px 16px", textAlign: "center" }}>
          <p style={{ color: "#6B4A2A", fontSize: "13px", margin: "0 0 20px 0" }}>
            Muestra este código para recibir pagos
          </p>

          {/* QR Code */}
          <div style={{
            display: "inline-block",
            background: "white",
            border: "4px solid #2C1A0E",
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "4px 4px 0px #2C1A0E",
            marginBottom: "20px"
          }}>
            <QRCodeSVG
              value={address}
              size={180}
              bgColor="white"
              fgColor="#2C1A0E"
              level="M"
            />
          </div>

          {/* Dirección */}
          <div style={{
            background: "#FFF8E8",
            border: "3px solid #2C1A0E",
            borderRadius: "8px",
            padding: "12px 14px",
            marginBottom: "16px",
            wordBreak: "break-all",
            textAlign: "left"
          }}>
            <p style={{ color: "#6B4A2A", fontSize: "11px", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
              Tu dirección
            </p>
            <p style={{ color: "#2C1A0E", fontSize: "13px", fontWeight: "bold", margin: 0, lineHeight: 1.5 }}>
              {address}
            </p>
          </div>

          <PixelButton variant="green" onClick={copyAddress}>
            {copied ? "✅ ¡Copiado!" : "📋 Copiar dirección"}
          </PixelButton>
        </div>
      </div>

      {/* Instrucciones */}
      <div style={panel}>
        <div style={panelHeader}>
          <span style={{ fontSize: "16px" }}>💡</span>
          <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "13px" }}>¿Cómo funciona?</span>
        </div>
        <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { n: "1", text: "Muestra el QR o comparte tu dirección" },
            { n: "2", text: "La otra persona te envía USDT desde ArepaPay" },
            { n: "3", text: "El saldo llega directo a tu wallet" },
            { n: "4", text: "Ambos ganan un 🎟️ ticket por la transacción" },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{
                background: "#2C1A0E",
                color: "#F5E8C0",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold",
                flexShrink: 0
              }}>
                {s.n}
              </div>
              <p style={{ color: "#2C1A0E", fontSize: "14px", margin: 0, lineHeight: 1.4 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
