import { useState } from "react";
import { useBalances } from "../hooks/useBalances";
import BottomNav from "./BottomNav";

export default function Dashboard({ address, disconnect, provider }) {
  const { usdtBalance, arepaBalance, tickets, loading, refetch } = useBalances(provider, address);
  const [activeTab, setActiveTab] = useState("home");
  const [showBalanceMenu, setShowBalanceMenu] = useState(false);

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div style={{
      minHeight: "100vh",
      maxWidth: "420px",
      margin: "0 auto",
      background: "#F5F0E8",
      fontFamily: "Inter, sans-serif",
      position: "relative",
      paddingBottom: "80px"
    }}>

      {/* HEADER */}
      <div style={{
        background: "#1B2A6B",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "26px" }}>🫓</span>
          <div>
            <p style={{ color: "white", fontWeight: "bold", fontSize: "16px", letterSpacing: "2px", margin: 0 }}>
              AREPAPAY
            </p>
            <p style={{ color: "#A0B0E0", fontSize: "11px", margin: 0 }}>{shortAddr}</p>
          </div>
        </div>
        <button
          onClick={disconnect}
          style={{
            background: "transparent",
            border: "1px solid #A0B0E0",
            borderRadius: "8px",
            color: "#A0B0E0",
            padding: "5px 12px",
            fontSize: "12px",
            cursor: "pointer"
          }}
        >
          Salir
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={{ padding: "20px" }}>

        {/* BALANCE USDT — tappable */}
        <div
          onClick={() => setShowBalanceMenu(v => !v)}
          style={{
            background: "#D4842A",
            borderRadius: "16px",
            padding: "24px 20px",
            boxShadow: "4px 4px 0px #8B5E3C",
            marginBottom: "12px",
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          <p style={{ color: "#FFD9A0", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 6px 0" }}>
            Tu saldo
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <p style={{ color: "white", fontSize: "40px", fontWeight: "bold", margin: 0, lineHeight: 1 }}>
              {loading ? "—" : usdtBalance}
            </p>
            <span style={{ color: "#FFD9A0", fontSize: "16px", fontWeight: "bold" }}>USDT</span>
          </div>
          <p style={{ color: "#FFD9A0", fontSize: "11px", margin: "8px 0 0 0" }}>
            Toca para opciones 👆
          </p>
        </div>

        {/* MENÚ RÁPIDO AL TOCAR BALANCE */}
        {showBalanceMenu && (
          <div style={{
            background: "white",
            borderRadius: "14px",
            border: "2px solid #E8DCC8",
            boxShadow: "4px 4px 0px #C8B898",
            marginBottom: "12px",
            overflow: "hidden"
          }}>
            {[
              { emoji: "📤", label: "Enviar USDT",   tab: "send"    },
              { emoji: "📥", label: "Recibir USDT",  tab: "receive" },
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
                  borderBottom: i < 2 ? "1px solid #E8DCC8" : "none",
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.emoji}</span>
                <span style={{ color: "#1B2A6B", fontWeight: "600", fontSize: "14px" }}>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* BALANCE AREPA */}
        <div style={{
          background: "#F0E8D0",
          borderRadius: "14px",
          padding: "16px 20px",
          boxShadow: "3px 3px 0px #C8B898",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <p style={{ color: "#6B5B45", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px 0" }}>
              Gas (AREPA)
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <p style={{ color: "#1B2A6B", fontSize: "22px", fontWeight: "bold", margin: 0 }}>
                {loading ? "—" : arepaBalance}
              </p>
              <span style={{ color: "#6B5B45", fontSize: "13px" }}>AREPA</span>
            </div>
          </div>
          <span style={{ fontSize: "32px" }}>🫓</span>
        </div>

        {/* TICKETS */}
        <div style={{
          background: "#F0E8D0",
          borderRadius: "14px",
          padding: "16px 20px",
          boxShadow: "3px 3px 0px #C8B898",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <div>
            <p style={{ color: "#6B5B45", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 4px 0" }}>
              Mis Tickets
            </p>
            <p style={{ color: "#1B2A6B", fontSize: "28px", fontWeight: "bold", margin: 0 }}>
              {loading ? "—" : tickets}
            </p>
          </div>
          <span style={{ fontSize: "36px" }}>🎟️</span>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <p style={{ color: "#6B5B45", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>
          Acciones rápidas
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
          {[
            { emoji: "📤", label: "Enviar",   tab: "send",    dark: true  },
            { emoji: "📥", label: "Recibir",  tab: "receive", dark: false },
          ].map(btn => (
            <button
              key={btn.tab}
              onClick={() => setActiveTab(btn.tab)}
              style={{
                background: btn.dark ? "#1B2A6B" : "white",
                border: `2px solid ${btn.dark ? "#1B2A6B" : "#E8DCC8"}`,
                borderRadius: "14px",
                padding: "18px 12px",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: `3px 3px 0px ${btn.dark ? "#0D1A45" : "#C8B898"}`
              }}
            >
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>{btn.emoji}</div>
              <p style={{ color: btn.dark ? "white" : "#1B2A6B", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                {btn.label}
              </p>
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {[
            { emoji: "🏪", label: "Comercios", tab: "merchants" },
            { emoji: "🎰", label: "Rifas",     tab: "raffles"   },
          ].map(btn => (
            <button
              key={btn.tab}
              onClick={() => setActiveTab(btn.tab)}
              style={{
                background: "white",
                border: "2px solid #E8DCC8",
                borderRadius: "14px",
                padding: "18px 12px",
                textAlign: "center",
                cursor: "pointer",
                boxShadow: "3px 3px 0px #C8B898"
              }}
            >
              <div style={{ fontSize: "26px", marginBottom: "6px" }}>{btn.emoji}</div>
              <p style={{ color: "#1B2A6B", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                {btn.label}
              </p>
            </button>
          ))}
        </div>

        {/* AVISO TAB ACTIVO (placeholders) */}
        {activeTab !== "home" && (
          <div style={{
            marginTop: "20px",
            background: "#1B2A6B",
            borderRadius: "14px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "4px 4px 0px #0D1A45"
          }}>
            <p style={{ color: "#A0B0E0", fontSize: "13px", margin: "0 0 4px 0" }}>Próximamente</p>
            <p style={{ color: "white", fontWeight: "bold", fontSize: "16px", margin: 0 }}>
              {activeTab === "send"      && "📤 Pantalla de Envío"}
              {activeTab === "receive"   && "📥 Pantalla de Recibir + QR"}
              {activeTab === "merchants" && "🏪 Directorio de Comercios"}
              {activeTab === "raffles"   && "🎰 Rifas y Premios"}
            </p>
          </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
