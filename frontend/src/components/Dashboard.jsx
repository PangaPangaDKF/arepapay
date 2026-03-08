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

export default function Dashboard({ address, disconnect, provider, switchChain }) {
  const { usdtBalance, arepaBalance, tickets, internetMinutes, poolBalance, loading, fetchError, refetch } = useBalances(provider, address);
  const [activeTab, setActiveTab]               = useState("home");
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [showScanner, setShowScanner]           = useState(false);

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  function handleQRScan(raw) {
    setShowScanner(false);
    try {
      const data = JSON.parse(raw);
      if (data.type === "arepapay" && data.to) {
        const merchant = MERCHANTS.find(m => m.address.toLowerCase() === data.to.toLowerCase());
        setSelectedMerchant(
          merchant
            ? { ...merchant, amount: data.amount || "" }
            : { address: data.to, name: data.name || "", amount: data.amount || "" }
        );
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
          onBack={() => { setActiveTab("home"); setSelectedMerchant(null); }}
          onSuccess={() => { setActiveTab("home"); setSelectedMerchant(null); refetch(); }}
        />
      )}
      {activeTab === "receive"   && <ReceiveScreen address={address} onBack={() => setActiveTab("home")} />}
      {activeTab === "internet"  && <InternetScreen internetMinutes={internetMinutes} provider={provider} address={address} onBack={() => setActiveTab("home")} onActivated={refetch} />}
      {activeTab === "raffles"   && <RafflesScreen tickets={tickets} provider={provider} address={address} onBack={() => setActiveTab("home")} />}
      {activeTab === "merchants" && <MerchantPanel address={address} onBack={() => setActiveTab("home")} />}

      {/* BODY PRINCIPAL */}
      {activeTab !== "send" && activeTab !== "receive" && activeTab !== "internet" && activeTab !== "raffles" && activeTab !== "merchants" && (
        <div style={{ padding: "16px" }}>

          {fetchError && (
            <div style={{ background: "#FFF0F0", border: "3px solid #CC1111", borderRadius: "10px", padding: "14px 16px", marginBottom: "14px", textAlign: "center" }}>
              <p style={{ color: "#CC1111", fontSize: "11px", margin: 0, wordBreak: "break-all" }}>⚠️ {fetchError}</p>
            </div>
          )}

          {/* BALANCE USDT */}
          <div style={{ background: "#1A2472", border: "3px solid #0D1040", borderRadius: "12px", boxShadow: "4px 4px 0px #0D1040", marginBottom: "14px", overflow: "hidden" }}>
            <div style={{ height: "8px", ...CHECKER }} />
            <div style={{ padding: "16px", textAlign: "center" }}>
              <p style={{ color: "#8899CC", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>
                Tu Saldo
              </p>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px" }}>
                <span style={{ color: "#FFFFFF", fontSize: "46px", fontWeight: "900", lineHeight: 1 }}>{loading ? "—" : usdtBalance}</span>
                <span style={{ color: "#CC1111", fontSize: "20px", fontWeight: "bold" }}>USDT</span>
              </div>
            </div>
            <div style={{ height: "8px", ...CHECKER }} />
          </div>

          {/* RPG STATS — AREPA + TICKETS + INTERNET */}
          <div style={{
            background: "#0D1040",
            border: "3px solid #2C1A0E",
            borderRadius: "12px",
            boxShadow: "4px 4px 0px #2C1A0E",
            padding: "10px 16px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ArepaLogo size={24} />
              <span style={{ color: "#FFD84A", fontWeight: "900", fontSize: "15px" }}>{loading ? "—" : arepaBalance}</span>
            </div>
            <div style={{ width: "2px", height: "28px", background: "#1A2472" }} />
            <div
              style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
              onClick={() => setActiveTab("raffles")}
            >
              <span style={{ fontSize: "20px" }}>🎟️</span>
              <span style={{ color: "#FFD84A", fontWeight: "900", fontSize: "15px" }}>{loading ? "—" : tickets}</span>
            </div>
            <div style={{ width: "2px", height: "28px", background: "#1A2472" }} />
            <div
              style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
              onClick={() => setActiveTab("internet")}
            >
              <span style={{ fontSize: "20px" }}>🌐</span>
              <span style={{ color: "#FFD84A", fontWeight: "900", fontSize: "15px" }}>{loading ? "—" : `${internetMinutes}m`}</span>
            </div>
          </div>

          {/* BOTON PAGAR */}
          <button
            onClick={() => setShowScanner(true)}
            style={{
              width: "100%", background: "#CC1111", color: "white",
              border: "3px solid #8A0A0A", borderRadius: "12px",
              padding: "18px", fontSize: "20px", fontWeight: "900",
              cursor: "pointer", fontFamily: "Inter, sans-serif",
              boxShadow: "5px 5px 0px #8A0A0A",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
              marginBottom: "14px", letterSpacing: "1px"
            }}
          >
            <span style={{ fontSize: "26px" }}>📷</span>
            PAGAR
          </button>

          {/* COMERCIOS SOCIOS */}
          <div style={{ background: "#FFFFFF", border: "3px solid #C89038", borderRadius: "12px", boxShadow: "4px 4px 0px #C89038", marginBottom: "14px", overflow: "hidden" }}>
            <div style={{ background: "#FFF8E0", borderBottom: "2px solid #C89038", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#1A2472", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Comercios Socios</span>
              <span style={{ color: "#CC1111", fontSize: "10px", fontWeight: "bold" }}>Toca para pagar</span>
            </div>
            <div style={{ padding: "14px" }}>
              {/* Socios principales (grandes) */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                {MERCHANTS.filter(m => m.big).map(m => (
                  <MerchantCard
                    key={m.id}
                    big
                    emoji={m.emoji}
                    name={m.name}
                    category={m.category}
                    onClick={() => { setSelectedMerchant(m); setActiveTab("send"); }}
                  />
                ))}
              </div>
              {/* Artesanales */}
              <div style={{ display: "flex", gap: "8px" }}>
                {MERCHANTS.filter(m => !m.big).map(m => (
                  <MerchantCard key={m.id} emoji={m.emoji} name={m.name} onClick={() => { setSelectedMerchant(m); setActiveTab("send"); }} />
                ))}
                <MerchantCard emoji="🎂" name="Tortas Mafe" coming />
                <MerchantCard emoji="🍦" name="Helados Coco" coming />
              </div>
            </div>
          </div>

        </div>
      )}

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
