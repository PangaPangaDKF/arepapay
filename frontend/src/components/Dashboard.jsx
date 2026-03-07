import { useState } from "react";
import { useBalances } from "../hooks/useBalances";
import BottomNav from "./BottomNav";
import PixelButton from "./PixelButton";
import SendScreen from "./SendScreen";
import ReceiveScreen from "./ReceiveScreen";
import RafflesScreen from "./RafflesScreen";

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

const panel = {
  background: "#FFFFFF",
  border: "3px solid #C89038",
  borderRadius: "12px",
  boxShadow: "4px 4px 0px #C89038",
  overflow: "hidden",
  marginBottom: "14px"
};

const panelHeader = {
  background: "#FFF8E0",
  borderBottom: "2px solid #C89038",
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

const panelBody = { padding: "14px 16px" };

export default function Dashboard({ address, disconnect, provider, switchChain }) {
  const { usdtBalance, arepaBalance, tickets, loading, fetchError, refetch } = useBalances(provider, address);
  const [activeTab, setActiveTab]             = useState("home");
  const [showBalanceMenu, setShowBalanceMenu] = useState(false);

  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <div style={{ minHeight: "100vh", maxWidth: "420px", margin: "0 auto", background: "#FFF8E0", fontFamily: "Inter, sans-serif", paddingBottom: "80px" }}>

      {/* HEADER */}
      <div style={{ background: "#1A2472", borderBottom: "3px solid #0D1040", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "36px", height: "36px", background: "#FFF8E0", border: "2px solid #C89038", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🫓</div>
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
      {activeTab === "send" && <SendScreen provider={provider} address={address} usdtBalance={usdtBalance} onBack={() => setActiveTab("home")} onSuccess={() => { setActiveTab("home"); refetch(); }} />}
      {activeTab === "receive" && <ReceiveScreen address={address} onBack={() => setActiveTab("home")} />}
      {activeTab === "raffles" && <RafflesScreen tickets={tickets} onBack={() => setActiveTab("home")} />}

      {/* BODY PRINCIPAL */}
      {activeTab !== "send" && activeTab !== "receive" && activeTab !== "raffles" && (
        <div style={{ padding: "16px" }}>

          {fetchError && (
            <div style={{ background: "#FFF0F0", border: "3px solid #CC1111", borderRadius: "10px", padding: "14px 16px", marginBottom: "14px", textAlign: "center" }}>
              {fetchError.includes("Red incorrecta") ? (
                <>
                  <p style={{ color: "#CC1111", fontWeight: "bold", fontSize: "14px", margin: "0 0 12px 0" }}>⚠️ Red incorrecta en MetaMask</p>
                  <PixelButton variant="blue" onClick={async () => { await switchChain(); refetch(); }}>🔌 Cambiar a Red ArepaPay</PixelButton>
                </>
              ) : (
                <p style={{ color: "#CC1111", fontSize: "11px", margin: 0, wordBreak: "break-all" }}>⚠️ {fetchError}</p>
              )}
            </div>
          )}

          {/* BALANCE USDT */}
          <div style={{ background: "#1A2472", border: "3px solid #0D1040", borderRadius: showBalanceMenu ? "12px 12px 0 0" : "12px", boxShadow: "4px 4px 0px #0D1040", marginBottom: showBalanceMenu ? "0px" : "14px", overflow: "hidden", cursor: "pointer" }} onClick={() => setShowBalanceMenu(v => !v)}>
            <div style={{ height: "8px", ...CHECKER }} />
            <div style={{ padding: "16px", textAlign: "center" }}>
              <p style={{ color: "#8899CC", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px 0" }}>
                Tu Saldo · Toca para opciones {showBalanceMenu ? "▲" : "▼"}
              </p>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px" }}>
                <span style={{ color: "#FFFFFF", fontSize: "46px", fontWeight: "900", lineHeight: 1 }}>{loading ? "—" : usdtBalance}</span>
                <span style={{ color: "#CC1111", fontSize: "20px", fontWeight: "bold" }}>USDT</span>
              </div>
            </div>
            <div style={{ height: "8px", ...CHECKER }} />
          </div>

          {/* MENÚ RÁPIDO */}
          {showBalanceMenu && (
            <div style={{ background: "#FFFFFF", border: "3px solid #0D1040", borderTop: "none", borderRadius: "0 0 12px 12px", marginBottom: "14px", overflow: "hidden" }}>
              {[
                { emoji: "📤", label: "Enviar USDT",      tab: "send"    },
                { emoji: "📥", label: "Recibir USDT",     tab: "receive" },
                { emoji: "🔄", label: "Actualizar saldo", action: refetch },
              ].map((item, i) => (
                <button key={i} onClick={() => { setShowBalanceMenu(false); if (item.tab) setActiveTab(item.tab); if (item.action) item.action(); }}
                  style={{ width: "100%", background: "transparent", border: "none", borderBottom: i < 2 ? "2px solid #E8E0C8" : "none", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <span style={{ fontSize: "20px" }}>{item.emoji}</span>
                  <span style={{ color: "#1A2472", fontWeight: "700", fontSize: "14px" }}>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* GAS + TICKETS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
            {[
              { label: "AREPA", emoji: "🫓", value: loading ? "—" : arepaBalance, sub: "tokens" },
              { label: "Tickets", emoji: "🎟️", value: loading ? "—" : tickets, sub: "disponibles" },
            ].map(item => (
              <div key={item.label} style={{ ...panel, marginBottom: 0 }}>
                <div style={panelHeader}>
                  <span style={{ color: "#1A2472", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>{item.label}</span>
                  <span style={{ fontSize: "16px" }}>{item.emoji}</span>
                </div>
                <div style={panelBody}>
                  <p style={{ color: "#1A2472", fontSize: "22px", fontWeight: "900", margin: 0, lineHeight: 1 }}>{item.value}</p>
                  <p style={{ color: "#8899CC", fontSize: "11px", margin: "4px 0 0 0" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ACCIONES 2x2 */}
          <div style={panel}>
            <div style={panelHeader}>
              <span style={{ color: "#1A2472", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>Acciones</span>
            </div>
            <div style={{ padding: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <PixelButton variant="blue" onClick={() => setActiveTab("send")} style={{ fontSize: "14px", padding: "12px 8px" }}>📤 Enviar</PixelButton>
              <PixelButton variant="blue" onClick={() => setActiveTab("receive")} style={{ fontSize: "14px", padding: "12px 8px" }}>📥 Recibir</PixelButton>
              <PixelButton variant="ghost" onClick={() => setActiveTab("merchants")} style={{ fontSize: "14px", padding: "12px 8px" }}>🏪 Comercios</PixelButton>
              <PixelButton variant="red" onClick={() => setActiveTab("raffles")} style={{ fontSize: "14px", padding: "12px 8px" }}>🎰 Rifas</PixelButton>
            </div>
          </div>

          {activeTab === "merchants" && (
            <div style={panel}>
              <div style={panelHeader}>
                <span style={{ color: "#1A2472", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Próximamente</span>
              </div>
              <div style={{ ...panelBody, textAlign: "center" }}>
                <p style={{ color: "#1A2472", fontWeight: "bold", fontSize: "16px", margin: "0 0 14px 0" }}>🏪 Directorio de Comercios</p>
                <PixelButton variant="ghost" onClick={() => setActiveTab("home")} style={{ fontSize: "13px", padding: "10px 20px" }}>← Volver</PixelButton>
              </div>
            </div>
          )}

        </div>
      )}

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
