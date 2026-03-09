import { useState } from "react";
import { useBalances } from "../hooks/useBalances";
import BottomNav from "./BottomNav";
import PixelButton from "./PixelButton";
import SendScreen from "./SendScreen";
import ReceiveScreen from "./ReceiveScreen";
import RafflesScreen from "./RafflesScreen";
import InternetScreen from "./InternetScreen";
import MerchantPanel from "./MerchantPanel";
import { MERCHANTS } from "../config/network";
import ErrorBoundary from "./ErrorBoundary";
import QRScanner from "./QRScanner";

const CHECKER = {
  backgroundImage: [
    "linear-gradient(45deg, #CC1111 25%, transparent 25%)",
    "linear-gradient(-45deg, #CC1111 25%, transparent 25%)",
    "linear-gradient(45deg, transparent 75%, #CC1111 75%)",
    "linear-gradient(-45deg, transparent 75%, #CC1111 75%)",
  ].join(", "),
  backgroundSize: "10px 10px",
  backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px",
  backgroundColor: "#FFFFFF",
};


function ArepaLogo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="aG" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#FFDC6A" />
          <stop offset="45%" stopColor="#D4921C" />
          <stop offset="100%" stopColor="#8A4A0A" />
        </radialGradient>
        <clipPath id="aClip">
          <ellipse cx="50" cy="44" rx="40" ry="22" />
        </clipPath>
      </defs>
      <ellipse cx="52" cy="64" rx="36" ry="10" fill="#2C1A0E" opacity="0.15" />
      <ellipse cx="50" cy="54" rx="40" ry="16" fill="#7A3A08" />
      <ellipse cx="50" cy="44" rx="40" ry="22" fill="url(#aG)" />
      <g clipPath="url(#aClip)" opacity="0.28">
        {[-8, 0, 8, 16].map((dy, i) => (
          <line key={`h${i}`} x1="10" y1={44 + dy} x2="90" y2={44 + dy} stroke="#7A3A08" strokeWidth="2.5" />
        ))}
        {[16, 26, 36, 46, 56, 66, 76, 86].map((dx, i) => (
          <line key={`v${i}`} x1={dx} y1="22" x2={dx} y2="66" stroke="#7A3A08" strokeWidth="2.5" />
        ))}
      </g>
      <ellipse cx="34" cy="34" rx="14" ry="6" fill="white" opacity="0.22" />
    </svg>
  );
}

function MerchantCard({ emoji, name, category, big, coming, onClick }) {
  const colors = {
    "🍞": "#F5D9A0",
    "💧": "#A8D8F0",
    "🌭": "#F0C0A0",
    "🎂": "#F5C0D8",
    "🍦": "#D8F0F5",
    "🏪": "#D8F5D8",
  };
  const bg       = colors[emoji] || "#F0DCA0";
  const clickable = !!onClick && !coming;

  const baseStyle = {
    background: bg,
    border: `${big ? 3 : 2}px solid #2C1A0E`,
    borderRadius: big ? "12px" : "10px",
    boxShadow: `${big ? 4 : 3}px ${big ? 4 : 3}px 0px ${clickable ? "#1A2472" : "#2C1A0E"}`,
    padding: big ? "18px 14px" : "12px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: big ? "8px" : "5px",
    position: "relative",
    flex: 1,
    cursor: clickable ? "pointer" : "default",
    transition: "transform 0.1s",
  };

  return (
    <div
      style={baseStyle}
      onClick={clickable ? onClick : undefined}
      onMouseDown={e => { if (clickable) e.currentTarget.style.transform = "translate(2px,2px)"; }}
      onMouseUp={e => { if (clickable) e.currentTarget.style.transform = ""; }}
      onMouseLeave={e => { if (clickable) e.currentTarget.style.transform = ""; }}
    >
      {coming && (
        <div style={{ position: "absolute", top: big ? "8px" : "5px", right: big ? "8px" : "5px", background: "#8899CC", color: "white", fontSize: big ? "9px" : "8px", fontWeight: "bold", padding: big ? "2px 6px" : "1px 4px", borderRadius: "4px" }}>
          PRONTO
        </div>
      )}
      {clickable && (
        <div style={{ position: "absolute", top: big ? "8px" : "5px", right: big ? "8px" : "5px", background: "#CC1111", color: "white", fontSize: big ? "9px" : "8px", fontWeight: "bold", padding: big ? "2px 6px" : "1px 4px", borderRadius: "4px" }}>
          PAGAR
        </div>
      )}
      <div style={{ fontSize: big ? "48px" : "32px", lineHeight: 1 }}>{emoji}</div>
      <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: big ? "13px" : "11px", margin: 0, textAlign: "center" }}>{name}</p>
      {big && category && <p style={{ color: "#6B4A2A", fontSize: "11px", margin: 0, textAlign: "center" }}>{category}</p>}
    </div>
  );
}

const BCV_RATE = 400; // Bs por 1 USDT

export default function Dashboard({ address, disconnect, provider, switchChain }) {
  const { usdtBalance, arepaBalance, tickets, internetMinutes, poolBalance, loading, fetchError, refetch } = useBalances(provider, address);
  const [activeTab, setActiveTab]               = useState("home");
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showScanner, setShowScanner]           = useState(false);
  const [paymentResult, setPaymentResult]       = useState(null);

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const bsEquivalent = loading ? null : Math.round(parseFloat(usdtBalance.replace(/\./g, "").replace(",", ".")) * BCV_RATE);

  function handleQRScan(raw) {
    setShowScanner(false);
    try {
      const data = JSON.parse(raw);
      if (data.type === "arepapay" && data.to) {
        const merchant = MERCHANTS.find(m => m.address.toLowerCase() === data.to.toLowerCase());
        setSelectedMerchant(merchant ? { ...merchant, amount: data.amount || "" } : { address: data.to, name: data.name || "", amount: data.amount || "" });
        setActiveTab("send");
        return;
      }
    } catch (_) {}
    setSelectedMerchant({ address: raw.trim(), name: "", amount: "" });
    setActiveTab("send");
  }

  if (showScanner) {
    return <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />;
  }

  // ─── COMPROBANTE DE PAGO ───
  if (paymentResult) {
    const { bsInput, usdtNum, merchantName, to, isMerchantPay, txHash } = paymentResult;
    return (
      <div style={{ minHeight: "100vh", maxWidth: "420px", margin: "0 auto", background: "#1A1A2E", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", boxSizing: "border-box" }}>
        <div style={{ background: "#FFF8E0", border: "4px solid #C89038", borderRadius: "20px", boxShadow: "0 0 0 4px #2C1A0E, 8px 8px 0px #2C1A0E", width: "100%", overflow: "hidden", textAlign: "center" }}>

          {/* Header verde */}
          <div style={{ background: "#1A7A1A", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>✅</span>
            <span style={{ color: "#FFFFFF", fontWeight: "900", fontSize: "16px", letterSpacing: "2px" }}>PAGO CONFIRMADO</span>
          </div>

          <div style={{ padding: "28px 24px 24px 24px" }}>
            {/* Monto */}
            <p style={{ color: "#8899CC", fontSize: "11px", margin: "0 0 6px 0", fontWeight: "700", letterSpacing: "2px" }}>MONTO PAGADO</p>
            <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "52px", margin: "0 0 2px 0", lineHeight: 1 }}>
              {parseFloat(bsInput).toLocaleString("es-VE")}
            </p>
            <p style={{ color: "#CC1111", fontWeight: "900", fontSize: "22px", margin: "0 0 8px 0" }}>Bolívares</p>
            <p style={{ color: "#6B4A2A", fontSize: "15px", margin: "0 0 24px 0" }}>
              = <strong>{usdtNum.toFixed(2)} USDT</strong>
            </p>

            <div style={{ borderTop: "2px dashed #C89038", margin: "0 0 18px 0" }} />

            {/* Destinatario */}
            <p style={{ color: "#8899CC", fontSize: "11px", margin: "0 0 6px 0", fontWeight: "700", letterSpacing: "2px" }}>
              {isMerchantPay ? "COMERCIO" : "ENVIADO A"}
            </p>
            {isMerchantPay && (
              <div style={{ display: "inline-block", background: "#1A2472", color: "#FFD84A", fontSize: "11px", fontWeight: "bold", padding: "4px 12px", borderRadius: "6px", marginBottom: "8px" }}>
                🏪 Comercio verificado ArepaPay
              </div>
            )}
            <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "20px", margin: "0 0 4px 0" }}>
              {merchantName || `${to.slice(0, 8)}...${to.slice(-6)}`}
            </p>
            {merchantName && (
              <p style={{ color: "#8899CC", fontSize: "11px", margin: "0 0 20px 0", fontFamily: "monospace" }}>
                {to.slice(0, 10)}...{to.slice(-8)}
              </p>
            )}

            {txHash && (
              <>
                <div style={{ borderTop: "2px dashed #C89038", margin: "0 0 14px 0" }} />
                <p style={{ color: "#8899CC", fontSize: "10px", wordBreak: "break-all", margin: "0 0 18px 0", fontFamily: "monospace" }}>
                  TX: {txHash.slice(0, 22)}...{txHash.slice(-6)}
                </p>
              </>
            )}

            {/* Nota comprobante */}
            <div style={{ background: "#FFF0D0", border: "2px solid #C89038", borderRadius: "10px", padding: "12px 14px", marginBottom: "24px" }}>
              <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0, lineHeight: 1.6, fontWeight: "600" }}>
                📱 Muestra esta pantalla al comerciante como comprobante de pago
              </p>
            </div>

            <PixelButton variant="blue" onClick={() => setPaymentResult(null)}>
              Continuar →
            </PixelButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", maxWidth: "420px", margin: "0 auto", background: "#FFF8E0", fontFamily: "Inter, sans-serif", paddingBottom: "80px" }}>

      {/* HEADER */}
      <div style={{ background: "#1A2472", borderBottom: "3px solid #0D1040", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "40px", height: "40px", background: "#FFF8E0", border: "2px solid #C89038", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <ArepaLogo size={36} />
          </div>
          <div>
            <p style={{ color: "#FFFFFF", fontWeight: "900", fontSize: "16px", letterSpacing: "2px", margin: 0 }}>AREPAPAY</p>
            <p style={{ color: "#8899CC", fontSize: "11px", margin: 0 }}>{shortAddr}</p>
          </div>
        </div>
        <PixelButton variant="ghost" onClick={disconnect} style={{ width: "auto", padding: "6px 14px", fontSize: "13px" }}>Salir</PixelButton>
      </div>

      {/* FRANJA TABLERO */}
      <div style={{ height: "10px", ...CHECKER }} />

      {/* PANTALLAS */}
      {activeTab === "send" && (
        <SendScreen
          provider={provider}
          address={address}
          usdtBalance={usdtBalance}
          prefilledTo={selectedMerchant?.address}
          prefilledName={selectedMerchant?.name}
          prefilledAmount={selectedMerchant?.amount || ""}
          switchChain={switchChain}
          onBack={() => { setActiveTab("home"); setSelectedMerchant(null); }}
          onSuccess={(result) => { refetch(); setPaymentResult(result); setActiveTab("home"); setSelectedMerchant(null); }}
        />
      )}
      {activeTab === "receive"   && <ReceiveScreen address={address} onBack={() => setActiveTab("home")} />}
      {activeTab === "internet"  && <InternetScreen internetMinutes={internetMinutes} provider={provider} address={address} onBack={() => setActiveTab("home")} onActivated={refetch} />}
      {activeTab === "raffles"   && <ErrorBoundary><RafflesScreen tickets={tickets} provider={provider} address={address} onBack={() => setActiveTab("home")} /></ErrorBoundary>}
      {activeTab === "merchants" && <MerchantPanel address={address} onBack={() => setActiveTab("home")} />}

      {/* BODY PRINCIPAL */}
      {activeTab !== "send" && activeTab !== "receive" && activeTab !== "internet" && activeTab !== "raffles" && activeTab !== "merchants" && (
        <div style={{ padding: "12px 16px" }}>

          {fetchError && (
            <div style={{ background: "#FFF0F0", border: "2px solid #CC1111", borderRadius: "8px", padding: "8px 12px", marginBottom: "10px", textAlign: "center" }}>
              <p style={{ color: "#CC1111", fontSize: "11px", margin: 0 }}>⚠️ {fetchError}</p>
            </div>
          )}

          {/* BALANCE USDT — compacto horizontal */}
          <div style={{ background: "#1A2472", border: "3px solid #0D1040", borderRadius: "12px", boxShadow: "4px 4px 0px #0D1040", marginBottom: "10px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "#8899CC", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 2px 0" }}>Tu Saldo</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ color: "#FFFFFF", fontSize: "36px", fontWeight: "900", lineHeight: 1 }}>{loading ? "—" : usdtBalance}</span>
                <span style={{ color: "#CC1111", fontSize: "16px", fontWeight: "bold" }}>USDT</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              {!loading && bsEquivalent !== null && (
                <p style={{ color: "#FFD84A", fontSize: "22px", fontWeight: "900", margin: "0 0 2px 0" }}>{bsEquivalent.toLocaleString("es-VE")} Bs</p>
              )}
              <p style={{ color: "#8899CC", fontSize: "10px", margin: 0 }}>Tasa: {BCV_RATE} Bs/$</p>
            </div>
          </div>

          {/* STATS — AVAX + TICKETS + INTERNET */}
          <div style={{ background: "#0D1040", border: "3px solid #2C1A0E", borderRadius: "10px", boxShadow: "3px 3px 0px #2C1A0E", padding: "8px 16px", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <ArepaLogo size={20} />
              <span style={{ color: "#FFD84A", fontWeight: "900", fontSize: "13px" }}>{loading ? "—" : arepaBalance}</span>
            </div>
            <div style={{ width: "2px", height: "22px", background: "#1A2472" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }} onClick={() => setActiveTab("raffles")}>
              <span style={{ fontSize: "17px" }}>🎟️</span>
              <span style={{ color: "#FFD84A", fontWeight: "900", fontSize: "13px" }}>{loading ? "—" : tickets}</span>
            </div>
            <div style={{ width: "2px", height: "22px", background: "#1A2472" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }} onClick={() => setActiveTab("internet")}>
              <span style={{ fontSize: "17px" }}>🌐</span>
              <span style={{ color: "#FFD84A", fontWeight: "900", fontSize: "13px" }}>{loading ? "—" : `${internetMinutes}m`}</span>
            </div>
          </div>

          {/* BOTONES PAGAR */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button
              onClick={() => { setSelectedMerchant(null); setActiveTab("send"); }}
              style={{ flex: 1, background: "#CC1111", color: "white", border: "3px solid #8A0A0A", borderRadius: "12px", padding: "16px", fontSize: "20px", fontWeight: "900", cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "4px 4px 0px #8A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", letterSpacing: "1px" }}
            >
              <span style={{ fontSize: "22px" }}>💸</span>
              PAGAR
            </button>
            <button
              onClick={() => setShowScanner(true)}
              style={{ flex: 1, background: "#1A2472", color: "white", border: "3px solid #0D1040", borderRadius: "12px", padding: "16px", fontSize: "13px", fontWeight: "900", cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "4px 4px 0px #0D1040", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}
            >
              <span style={{ fontSize: "22px" }}>📷</span>
              Escanear QR
            </button>
          </div>

          {/* COMERCIOS — 4 iguales, sin scroll */}
          <div style={{ background: "#FFFFFF", border: "3px solid #C89038", borderRadius: "12px", boxShadow: "4px 4px 0px #C89038", overflow: "hidden" }}>
            <div style={{ background: "#FFF8E0", borderBottom: "2px solid #C89038", padding: "7px 14px" }}>
              <span style={{ color: "#1A2472", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>Comercios</span>
            </div>
            <div style={{ display: "flex", padding: "10px 10px" }}>
              {MERCHANTS.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedMerchant(m); setActiveTab("send"); }}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", background: "#FFF8E0", border: "2px solid #C89038", borderRadius: "10px", padding: "8px 4px", cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "2px 2px 0px #C89038", margin: "0 3px" }}
                >
                  <span style={{ fontSize: "24px" }}>{m.emoji}</span>
                  <span style={{ fontSize: "9px", fontWeight: "bold", color: "#2C1A0E", textAlign: "center" }}>{m.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
