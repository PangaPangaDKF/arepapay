import { useState } from "react";
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

// Mock de rifas activas — se conectarán al contrato en la siguiente fase
const RIFAS = [
  {
    id: 1,
    emoji: "🍦",
    nombre: "Helados por un mes",
    descripcion: "1 helado diario durante 30 días en heladerías participantes",
    costo: 5,
    participantes: 38,
    maximo: 100,
    activa: true
  },
  {
    id: 2,
    emoji: "📶",
    nombre: "Internet 30 días",
    descripcion: "Plan de datos móviles 4G por 30 días",
    costo: 10,
    participantes: 21,
    maximo: 50,
    activa: true
  },
  {
    id: 3,
    emoji: "🎬",
    nombre: "Netflix 1 mes",
    descripcion: "Suscripción Netflix estándar por 30 días",
    costo: 8,
    participantes: 44,
    maximo: 60,
    activa: true
  },
  {
    id: 4,
    emoji: "🛒",
    nombre: "Mercado $20",
    descripcion: "$20 en productos de primera necesidad en comercios ArepaPay",
    costo: 15,
    participantes: 12,
    maximo: 30,
    activa: true
  }
];

export default function RafflesScreen({ tickets, onBack }) {
  const [entered, setEntered] = useState({});
  const [showConfirm, setShowConfirm] = useState(null);
  const ticketsRestantes = tickets - Object.values(entered).reduce((a, b) => a + b, 0);

  function entrar(rifa) {
    if (ticketsRestantes < rifa.costo) return;
    setEntered(prev => ({ ...prev, [rifa.id]: (prev[rifa.id] || 0) + rifa.costo }));
    setShowConfirm(rifa.id);
    setTimeout(() => setShowConfirm(null), 2500);
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

      {/* Mis tickets */}
      <div style={{
        background: "linear-gradient(180deg, #4A3020 0%, #2C1A0E 100%)",
        border: "3px solid #2C1A0E",
        borderRadius: "10px",
        boxShadow: "4px 4px 0px #0A0804",
        marginBottom: "14px",
        overflow: "hidden"
      }}>
        <div style={{ background: "#1A0C04", borderBottom: "3px solid #0A0804", padding: "8px 16px" }}>
          <span style={{ color: "#D4B87A", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
            Mis Tickets disponibles
          </span>
        </div>
        <div style={{ padding: "18px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#F5E8C0", fontSize: "48px", fontWeight: "900", margin: 0, lineHeight: 1 }}>
              {ticketsRestantes}
            </p>
            <p style={{ color: "#A08060", fontSize: "12px", margin: "4px 0 0 0" }}>
              tickets para usar en rifas
            </p>
          </div>
          <span style={{ fontSize: "52px" }}>🎟️</span>
        </div>
        <div style={{ background: "#1A0C04", borderTop: "2px solid #0A0804", padding: "10px 16px" }}>
          <p style={{ color: "#A08060", fontSize: "12px", margin: 0 }}>
            💡 Ganas 1 ticket por cada pago enviado o recibido
          </p>
        </div>
      </div>

      {/* Rifas activas */}
      <div style={{ ...panel, marginBottom: "6px" }}>
        <div style={panelHeader}>
          <span style={{ fontSize: "18px" }}>🎰</span>
          <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>Rifas activas</span>
          <span style={{
            marginLeft: "auto",
            background: "#78C040",
            border: "2px solid #2C1A0E",
            borderRadius: "12px",
            padding: "2px 10px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#2C1A0E"
          }}>
            {RIFAS.length} abiertas
          </span>
        </div>
      </div>

      {RIFAS.map(rifa => {
        const yaEntro = !!entered[rifa.id];
        const puedeEntrar = ticketsRestantes >= rifa.costo && !yaEntro;
        const progreso = Math.round((rifa.participantes / rifa.maximo) * 100);

        return (
          <div key={rifa.id} style={panel}>
            <div style={{ padding: "16px" }}>

              {/* Encabezado de rifa */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "12px" }}>
                <div style={{
                  background: "#D4B87A",
                  border: "3px solid #2C1A0E",
                  borderRadius: "10px",
                  width: "56px",
                  height: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  flexShrink: 0
                }}>
                  {rifa.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "16px", margin: "0 0 4px 0" }}>
                    {rifa.nombre}
                  </p>
                  <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0, lineHeight: 1.4 }}>
                    {rifa.descripcion}
                  </p>
                </div>
              </div>

              {/* Progreso */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ color: "#6B4A2A", fontSize: "12px" }}>Participantes</span>
                  <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "12px" }}>
                    {rifa.participantes} / {rifa.maximo}
                  </span>
                </div>
                <div style={{
                  background: "#C4A870",
                  border: "2px solid #2C1A0E",
                  borderRadius: "8px",
                  height: "12px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    background: "linear-gradient(90deg, #A8E060, #78C040)",
                    height: "100%",
                    width: `${progreso}%`,
                    borderRadius: "6px"
                  }} />
                </div>
              </div>

              {/* Costo + botón */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  background: "#FFF8E8",
                  border: "2px solid #2C1A0E",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: "16px" }}>🎟️</span>
                  <span style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "18px" }}>{rifa.costo}</span>
                </div>
                <div style={{ flex: 1 }}>
                  {showConfirm === rifa.id ? (
                    <div style={{
                      background: "#78C040",
                      border: "2px solid #2C1A0E",
                      borderRadius: "24px",
                      padding: "12px",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#2C1A0E",
                      fontSize: "14px"
                    }}>
                      ✅ ¡Participando!
                    </div>
                  ) : (
                    <PixelButton
                      variant={yaEntro ? "ghost" : puedeEntrar ? "green" : "ghost"}
                      onClick={() => entrar(rifa)}
                      disabled={!puedeEntrar}
                    >
                      {yaEntro ? "✅ Ya participas" : !puedeEntrar ? "Tickets insuficientes" : "Participar"}
                    </PixelButton>
                  )}
                </div>
              </div>

            </div>
          </div>
        );
      })}

      {/* Aviso MVP */}
      <div style={{
        background: "#FFF8E8",
        border: "2px solid #C4A870",
        borderRadius: "10px",
        padding: "12px 14px",
        textAlign: "center"
      }}>
        <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0, lineHeight: 1.5 }}>
          🛠️ Los sorteos los decide el admin. Cuando se sorteen, los ganadores serán notificados directamente.
        </p>
      </div>

    </div>
  );
}
