import { useState } from "react";
import { useBalances } from "../hooks/useBalances";
import BottomNav from "./BottomNav";
import PixelButton from "./PixelButton";
import SendScreen from "./SendScreen";
import ReceiveScreen from "./ReceiveScreen";

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
  padding: "8px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
};

const panelBody = {
  padding: "14px 16px"
};

export default function Dashboard({ address, disconnect, provider }) {
  const { usdtBalance, arepaBalance, tickets, loading, refetch } = useBalances(provider, address);
  const [activeTab, setActiveTab]             = useState("home");
  const [showBalanceMenu, setShowBalanceMenu] = useState(false);

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div style={{
      minHeight: "100vh",
      maxWidth: "420px",
      margin: "0 auto",
      background: "#F5E8C0",
      fontFamily: "Inter, sans-serif",
      paddingBottom: "80px"
    }}>

      {/* HEADER */}
      <div style={{
        background: "#2C1A0E",
        borderBottom: "3px solid #0A0804",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🫓</span>
          <div>
            <p style={{ color: "#F5E8C0", fontWeight: "900", fontSize: "16px", letterSpacing: "2px", margin: 0 }}>
              AREPAPAY
            </p>
            <p style={{ color: "#A08060", fontSize: "11px", margin: 0 }}>{shortAddr}</p>
          </div>
        </div>
        <PixelButton variant="ghost" onClick={disconnect} style={{ width: "auto", padding: "6px 14px", fontSize: "13px" }}>
          Salir
        </PixelButton>
      </div>

      {/* PANTALLA ENVIAR */}
      {activeTab === "send" && (
        <SendScreen
          provider={provider}
          address={address}
          usdtBalance={usdtBalance}
          onBack={() => setActiveTab("home")}
          onSuccess={() => { setActiveTab("home"); refetch(); }}
        />
      )}

      {/* PANTALLA RECIBIR */}
      {activeTab === "receive" && (
        <ReceiveScreen
          address={address}
          onBack={() => setActiveTab("home")}
        />
      )}

      {/* BODY PRINCIPAL */}
      {activeTab !== "send" && activeTab !== "receive" && <div style={{ padding: "16px" }}>

        {/* PANEL BALANCE USDT — tappable */}
        <div style={{
          background: "linear-gradient(180deg, #F0A050 0%, #D4842A 100%)",
          border: "3px solid #2C1A0E",
          borderRadius: "10px",
          boxShadow: "4px 4px 0px #2C1A0E",
          marginBottom: showBalanceMenu ? "0px" : "14px",
          overflow: "hidden",
          cursor: "pointer",
          borderBottom: showBalanceMenu ? "none" : "3px solid #2C1A0E",
          borderRadius: showBalanceMenu ? "10px 10px 0 0" : "10px"
        }} onClick={() => setShowBalanceMenu(v => !v)}>
          <div style={{ background: "#A06020", borderBottom: "3px solid #2C1A0E", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ color: "#F5E8C0", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
              Tu Saldo
            </span>
            <span style={{ color: "#F5E8C0", fontSize: "14px" }}>{showBalanceMenu ? "▲" : "▼"}</span>
          </div>
          <div style={{ padding: "16px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "8px" }}>
              <span style={{ color: "#2C1A0E", fontSize: "42px", fontWeight: "900", lineHeight: 1 }}>
                {loading ? "—" : usdtBalance}
              </span>
              <span style={{ color: "#2C1A0E", fontSize: "18px", fontWeight: "bold" }}>USDT</span>
            </div>
            <p style={{ color: "#2C1A0E", fontSize: "11px", margin: "6px 0 0 0", opacity: 0.7 }}>
              Toca para opciones 👆
            </p>
          </div>
        </div>

        {/* MENÚ RÁPIDO */}
        {showBalanceMenu && (
          <div style={{
            background: "#F0DCA0",
            border: "3px solid #2C1A0E",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            marginBottom: "14px",
            overflow: "hidden"
          }}>
            {[
              { emoji: "📤", label: "Enviar USDT",      tab: "send"    },
              { emoji: "📥", label: "Recibir USDT",     tab: "receive" },
              { emoji: "🔄", label: "Actualizar saldo", action: refetch },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setShowBalanceMenu(false);
                  if (item.tab) setActiveTab(item.tab);
                  if (item.action) item.action();
                }}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: i < 2 ? "2px solid #C4A870" : "none",
                  padding: "13px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer"
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.emoji}</span>
                <span style={{ color: "#2C1A0E", fontWeight: "700", fontSize: "14px" }}>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* AREPA + TICKETS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
          {[
            { label: "Gas", emoji: "🫓", value: loading ? "—" : arepaBalance, sub: "AREPA" },
            { label: "Tickets", emoji: "🎟️", value: loading ? "—" : tickets, sub: "disponibles" },
          ].map(item => (
            <div key={item.label} style={{ ...panel, marginBottom: 0 }}>
              <div style={panelHeader}>
                <span style={{ color: "#2C1A0E", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase" }}>{item.label}</span>
                <span style={{ fontSize: "16px" }}>{item.emoji}</span>
              </div>
              <div style={panelBody}>
                <p style={{ color: "#2C1A0E", fontSize: "22px", fontWeight: "900", margin: 0, lineHeight: 1 }}>
                  {item.value}
                </p>
                <p style={{ color: "#6B4A2A", fontSize: "11px", margin: "4px 0 0 0" }}>{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ACCIONES — botones verdes RPG */}
        <div style={panel}>
          <div style={panelHeader}>
            <span style={{ color: "#2C1A0E", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
              Acciones
            </span>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <PixelButton variant="green" onClick={() => setActiveTab("send")}>
              📤 Enviar USDT
            </PixelButton>
            <PixelButton variant="green" onClick={() => setActiveTab("receive")}>
              📥 Recibir / Mi QR
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => setActiveTab("merchants")}>
              🏪 Ver Comercios
            </PixelButton>
            <PixelButton variant="orange" onClick={() => setActiveTab("raffles")}>
              🎰 Ver Rifas
            </PixelButton>
          </div>
        </div>

        {/* PLACEHOLDER — pantallas aún no construidas */}
        {(activeTab === "merchants" || activeTab === "raffles") && (
          <div style={panel}>
            <div style={panelHeader}>
              <span style={{ color: "#2C1A0E", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
                Próximamente
              </span>
            </div>
            <div style={{ ...panelBody, textAlign: "center" }}>
              <p style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "16px", margin: "0 0 14px 0" }}>
                {activeTab === "merchants" && "🏪 Directorio de Comercios"}
                {activeTab === "raffles"   && "🎰 Rifas y Premios"}
              </p>
              <PixelButton variant="ghost" onClick={() => setActiveTab("home")} style={{ fontSize: "13px", padding: "10px 20px" }}>
                ← Volver
              </PixelButton>
            </div>
          </div>
        )}

      </div>}

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
