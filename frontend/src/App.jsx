import { useState, useEffect } from "react";
import { useWallet } from "./hooks/useWallet";
import Dashboard from "./components/Dashboard";
import PixelButton from "./components/PixelButton";
import MerchantQRPage from "./components/MerchantQRPage";

const CHECKER = {
  backgroundImage: [
    "linear-gradient(45deg, #CC1111 25%, transparent 25%)",
    "linear-gradient(-45deg, #CC1111 25%, transparent 25%)",
    "linear-gradient(45deg, transparent 75%, #CC1111 75%)",
    "linear-gradient(-45deg, transparent 75%, #CC1111 75%)",
  ].join(", "),
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
  backgroundColor: "#FFFFFF",
};

// SVG del logo de arepa (mismo que en Dashboard)
function ArepaLogo({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="aGl" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FFDC6A" />
          <stop offset="45%" stopColor="#D4921C" />
          <stop offset="100%" stopColor="#8A4A0A" />
        </radialGradient>
        <clipPath id="aClipl"><ellipse cx="50" cy="44" rx="40" ry="22" /></clipPath>
      </defs>
      <ellipse cx="52" cy="64" rx="36" ry="10" fill="#2C1A0E" opacity="0.15" />
      <ellipse cx="50" cy="54" rx="40" ry="16" fill="#7A3A08" />
      <ellipse cx="50" cy="44" rx="40" ry="22" fill="url(#aGl)" />
      <g clipPath="url(#aClipl)" opacity="0.28">
        {[-8, 0, 8, 16].map((dy, i) => <line key={`h${i}`} x1="10" y1={44+dy} x2="90" y2={44+dy} stroke="#7A3A08" strokeWidth="2.5" />)}
        {[16,26,36,46,56,66,76,86].map((dx, i) => <line key={`v${i}`} x1={dx} y1="22" x2={dx} y2="66" stroke="#7A3A08" strokeWidth="2.5" />)}
      </g>
      <ellipse cx="34" cy="34" rx="14" ry="6" fill="white" opacity="0.22" />
    </svg>
  );
}

const APP_URL = "frontend-tau-ten-27.vercel.app";
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default function App() {
  const { address, provider, connected, connect, disconnect, error, switchChain } = useWallet();
  const [connecting, setConnecting] = useState(false);
  const [hasEthereum, setHasEthereum] = useState(!!window.ethereum);

  // MetaMask puede inyectar window.ethereum después del primer render
  useEffect(() => {
    if (window.ethereum) { setHasEthereum(true); return; }
    const t = setTimeout(() => setHasEthereum(!!window.ethereum), 800);
    return () => clearTimeout(t);
  }, []);

  async function handleConnect() {
    setConnecting(true);
    try { await connect(); } finally { setConnecting(false); }
  }

  // Modo comerciante — URL con ?merchant (sin necesidad de wallet)
  const isMerchantMode = new URLSearchParams(window.location.search).has("merchant");
  if (isMerchantMode) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFF8E0", maxWidth: "420px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
        <div style={{ background: "#1A2472", borderBottom: "3px solid #0D1040", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", background: "#FFF8E0", border: "2px solid #C89038", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <ArepaLogo size={32} />
          </div>
          <div>
            <p style={{ color: "#FFFFFF", fontWeight: "900", fontSize: "14px", letterSpacing: "2px", margin: 0 }}>AREPAPAY</p>
            <p style={{ color: "#CC1111", fontSize: "10px", fontWeight: "bold", margin: 0 }}>Panel de Comercio</p>
          </div>
        </div>
        <MerchantQRPage onBack={() => window.location.href = "/"} />
      </div>
    );
  }

  if (connected) {
    return (
      <Dashboard
        address={address}
        provider={provider}
        disconnect={disconnect}
        switchChain={switchChain}
      />
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFF8E0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: "20px",
      maxWidth: "420px",
      margin: "0 auto"
    }}>

      {/* Card principal */}
      <div style={{
        background: "#FFFFFF",
        border: "4px solid #C89038",
        borderRadius: "16px",
        boxShadow: "6px 6px 0px #C89038",
        width: "100%",
        overflow: "hidden"
      }}>

        {/* Franja tablero arriba */}
        <div style={{ height: "14px", ...CHECKER }} />

        {/* Cuerpo */}
        <div style={{ padding: "28px 24px", textAlign: "center" }}>

          {/* Logo arepa */}
          <div style={{
            width: "96px",
            height: "96px",
            background: "#FFF8E0",
            border: "4px solid #C89038",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            boxShadow: "3px 3px 0px #C89038",
            overflow: "hidden"
          }}>
            <ArepaLogo size={80} />
          </div>

          {/* Título */}
          <h1 style={{
            color: "#1A2472",
            fontSize: "34px",
            fontWeight: "900",
            margin: "0 0 6px 0",
            letterSpacing: "4px",
            textTransform: "uppercase"
          }}>
            AREPAPAY
          </h1>

          <p style={{
            color: "#CC1111",
            fontSize: "13px",
            fontWeight: "bold",
            margin: "0 0 28px 0",
            letterSpacing: "1px",
            textTransform: "uppercase"
          }}>
            La arepa es venezolana 🇻🇪
          </p>

          {/* Botón principal: conectar si hay wallet, sino deep link */}
          {hasEthereum ? (
            <PixelButton variant="blue" onClick={handleConnect} disabled={connecting}>
              {connecting ? "Conectando..." : "🔌 Conectar Wallet"}
            </PixelButton>
          ) : (
            <PixelButton variant="blue" onClick={handleConnect} disabled={connecting}>
              {connecting ? "Conectando..." : "🔌 Conectar Wallet"}
            </PixelButton>
          )}

          {/* Deep link siempre visible en móvil */}
          {isMobile && (
            <a
              href={`https://metamask.app.link/dapp/${APP_URL}`}
              style={{ display: "block", marginTop: "10px", background: "#F6851B", color: "white", border: "3px solid #C96000", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", fontWeight: "bold", textDecoration: "none", boxShadow: "3px 3px 0px #C96000", fontFamily: "Inter, sans-serif" }}
            >
              🦊 Abrir en MetaMask
            </a>
          )}

          {/* Diagnóstico temporal */}
          <p style={{ color: "#8899CC", fontSize: "10px", margin: "8px 0 0 0" }}>
            wallet: {hasEthereum ? "✓ detectada" : "✗ no detectada"} · mobile: {isMobile ? "sí" : "no"}
          </p>

          {error && (
            <p style={{ color: "#CC1111", fontSize: "12px", margin: "12px 0 0 0", lineHeight: 1.4 }}>
              ⚠️ {error}
            </p>
          )}

          <p style={{
            color: "#8899CC",
            fontSize: "11px",
            margin: "18px 0 0 0",
            lineHeight: 1.5
          }}>
            Autocustodia · Red ArepaPay · Avalanche
          </p>
        </div>

        {/* Franja tablero abajo */}
        <div style={{ height: "14px", ...CHECKER }} />
      </div>

    </div>
  );
}
