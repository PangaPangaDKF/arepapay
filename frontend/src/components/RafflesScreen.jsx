import { useState } from "react";
import PixelButton from "./PixelButton";
import { useRaffle } from "../hooks/useRaffle";

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

export default function RafflesScreen({ tickets, provider, address, onBack, onTicketsChanged }) {
  const { state, myStake, loading, entering, drawing, error, enter, draw } = useRaffle(provider, address, onTicketsChanged);
  const [ticketsToEnter, setTicketsToEnter] = useState(1);

  const txCount      = state?.txCount     ?? 0;
  const txThreshold  = state?.txThreshold ?? 10;
  const isOpen       = state?.isOpen      ?? false;
  const txProgress   = txCount % txThreshold;
  const progressPct  = isOpen ? 100 : Math.round((txProgress / txThreshold) * 100);
  const canEnter     = isOpen && !state?.drawn && tickets > 0;
  const maxTickets   = Math.min(tickets, 99);
  const ZERO_ADDR    = "0x0000000000000000000000000000000000000000";
  const realWinners  = (state?.winners ?? []).slice(0, state?.winnersCount ?? 0).filter(w => w !== ZERO_ADDR);
  const medals       = ["🥇", "🥈", "🥉"];
  const myWinnerIndex = address ? realWinners.findIndex(w => w.toLowerCase() === address.toLowerCase()) : -1;
  const iWon         = myWinnerIndex !== -1 && state?.drawn;

  return (
    <div style={{ padding: "16px", paddingBottom: "80px" }}>
      <button
        onClick={onBack}
        style={{ background: "transparent", border: "none", color: "#6B4A2A", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "12px", padding: "4px 0", fontFamily: "Inter, sans-serif" }}
      >
        ← Volver
      </button>

      {/* BANNER GANADOR — visible solo si el usuario conectado ganó */}
      {iWon && (
        <div style={{
          background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)",
          border: "4px solid #2C1A0E",
          borderRadius: "14px",
          boxShadow: "6px 6px 0px #2C1A0E",
          marginBottom: "16px",
          overflow: "hidden",
          textAlign: "center"
        }}>
          <div style={{ background: "#2C1A0E", padding: "10px 16px" }}>
            <p style={{ color: "#FFD700", fontWeight: "900", fontSize: "16px", letterSpacing: "2px", margin: 0 }}>
              {medals[myWinnerIndex]} ¡GANASTE LA RIFA!
            </p>
          </div>
          <div style={{ padding: "20px 16px" }}>
            <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "22px", margin: "0 0 4px 0" }}>
              {state.prize}
            </p>
            <p style={{ color: "#5A3500", fontSize: "13px", margin: "0 0 16px 0", lineHeight: 1.5 }}>
              Ronda #{state.currentRound} · Posición {myWinnerIndex + 1}
            </p>
            <div style={{ background: "rgba(0,0,0,0.12)", borderRadius: "10px", padding: "12px 14px", marginBottom: "14px" }}>
              <p style={{ color: "#2C1A0E", fontSize: "12px", margin: 0, lineHeight: 1.6, fontWeight: "600" }}>
                📲 Muestra esta pantalla para reclamar tu premio.<br />
                El equipo ArepaPay te contactará para la entrega.
              </p>
            </div>
            <div style={{ background: "#2C1A0E", borderRadius: "8px", padding: "8px 14px" }}>
              <p style={{ color: "#FFD84A", fontSize: "10px", margin: 0, fontFamily: "monospace" }}>
                {address.slice(0, 14)}...{address.slice(-10)}
              </p>
            </div>
          </div>
        </div>
      )}

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
            Mis Tickets
          </span>
        </div>
        <div style={{ padding: "18px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#F5E8C0", fontSize: "48px", fontWeight: "900", margin: 0, lineHeight: 1 }}>{tickets}</p>
            <p style={{ color: "#A08060", fontSize: "12px", margin: "4px 0 0 0" }}>tickets disponibles para rifas</p>
          </div>
          <span style={{ fontSize: "52px" }}>🎟️</span>
        </div>
        <div style={{ background: "#1A0C04", borderTop: "2px solid #0A0804", padding: "10px 16px" }}>
          <p style={{ color: "#A08060", fontSize: "12px", margin: 0 }}>
            Ganas 1 ticket por cada pago a comercio enviado o recibido
          </p>
        </div>
      </div>

      {/* Progreso hacia la proxima rifa */}
      <div style={{ background: "#FFFFFF", border: "3px solid #C89038", borderRadius: "10px", boxShadow: "4px 4px 0px #C89038", marginBottom: "14px", overflow: "hidden" }}>
        <div style={{ background: "#FFF8E0", borderBottom: "2px solid #C89038", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#1A2472", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
            {isOpen ? "Rifa activa" : "Proxima rifa"}
          </span>
          <span style={{ color: "#CC1111", fontSize: "12px", fontWeight: "bold" }}>
            {isOpen ? "ABIERTA" : `${txProgress} / ${txThreshold} pagos`}
          </span>
        </div>
        <div style={{ padding: "12px 16px" }}>
          <div style={{ background: "#E8E0C8", borderRadius: "6px", height: "18px", overflow: "hidden", border: "2px solid #2C1A0E" }}>
            <div style={{ width: `${progressPct}%`, height: "100%", background: isOpen ? "#78C040" : "#CC1111", transition: "width 0.5s ease", borderRadius: "4px" }} />
          </div>
          <p style={{ color: "#6B4A2A", fontSize: "11px", margin: "6px 0 0 0", textAlign: "center" }}>
            {loading
              ? "Cargando..."
              : isOpen
                ? `${state.participantCount} participantes — ${state.totalStaked} tickets apostados en total`
                : `Faltan ${txThreshold - txProgress} pago(s) para abrir la rifa`}
          </p>
        </div>
      </div>

      {/* Rifa abierta — entrada */}
      {isOpen && state && !state.drawn && (
        <div style={panel}>
          <div style={panelHeader}>
            <span style={{ fontSize: "22px" }}>🍦</span>
            <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>{state.prize || "Rifa Activa"}</span>
            <span style={{ marginLeft: "auto", background: "#78C040", border: "2px solid #2C1A0E", borderRadius: "12px", padding: "2px 10px", fontSize: "12px", fontWeight: "bold", color: "#2C1A0E" }}>
              ABIERTA
            </span>
          </div>
          <div style={{ padding: "16px" }}>

            {/* Stats */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
              {[
                { label: "Participantes", value: state.participantCount },
                { label: "Tickets en juego", value: state.totalStaked },
                { label: "Mis tickets", value: myStake, highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} style={{ flex: 1, background: "#FFF8E8", border: "2px solid #2C1A0E", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                  <p style={{ color: "#6B4A2A", fontSize: "11px", margin: "0 0 4px 0" }}>{label}</p>
                  <p style={{ color: highlight ? "#1A2472" : "#2C1A0E", fontWeight: "900", fontSize: "22px", margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Mi probabilidad actual */}
            {myStake > 0 && state.totalStaked > 0 && (
              <div style={{ background: "#1A2472", border: "2px solid #0D1040", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", textAlign: "center" }}>
                <p style={{ color: "#FFD84A", fontWeight: "bold", fontSize: "13px", margin: 0 }}>
                  Tu probabilidad actual: {((myStake / state.totalStaked) * 100).toFixed(1)}%
                </p>
              </div>
            )}

            {/* Entrada */}
            {canEnter ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ color: "#2C1A0E", fontSize: "13px", fontWeight: "bold" }}>
                  Cuantos tickets apostar?
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="number"
                    min={1}
                    max={maxTickets}
                    value={ticketsToEnter}
                    onChange={e => setTicketsToEnter(Math.max(1, Math.min(maxTickets, parseInt(e.target.value) || 1)))}
                    style={{ flex: 1, background: "#FFF8E8", border: "3px solid #2C1A0E", borderRadius: "8px", padding: "12px 14px", fontSize: "22px", fontFamily: "Inter, sans-serif", color: "#2C1A0E", fontWeight: "900", outline: "none" }}
                  />
                  <span style={{ fontSize: "28px" }}>🎟️</span>
                </div>
                {ticketsToEnter > 0 && (
                  <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0, textAlign: "center" }}>
                    Con {ticketsToEnter} ticket(s) tendrias{" "}
                    <strong>
                      {(((myStake + ticketsToEnter) / Math.max(1, state.totalStaked + ticketsToEnter)) * 100).toFixed(1)}%
                    </strong>{" "}
                    de probabilidad
                  </p>
                )}
                <PixelButton variant="green" onClick={() => enter(ticketsToEnter)} disabled={entering}>
                  {entering ? "Apostando..." : `Apostar ${ticketsToEnter} ticket(s)`}
                </PixelButton>
              </div>
            ) : myStake > 0 ? (
              <div style={{ background: "#78C040", border: "2px solid #2C1A0E", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <p style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px", margin: 0 }}>
                  Ya estas participando con {myStake} ticket(s)
                </p>
              </div>
            ) : (
              <div style={{ background: "#FFF8E8", border: "2px solid #C4A870", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <p style={{ color: "#6B4A2A", fontSize: "13px", margin: 0 }}>
                  Necesitas tickets para participar. Realiza pagos a comercios para ganarlos.
                </p>
              </div>
            )}

            {error && <p style={{ color: "#CC1111", fontSize: "12px", margin: "8px 0 0 0", textAlign: "center" }}>{error}</p>}

            {/* Boton sortear — visible cuando hay participantes (solo funciona para el owner) */}
            {state.participantCount > 0 && (
              <div style={{ marginTop: "14px", borderTop: "2px dashed #C4A870", paddingTop: "14px" }}>
                <PixelButton variant="red" onClick={draw} disabled={drawing}>
                  {drawing ? "Sorteando..." : "🎲 Sortear ahora (Admin)"}
                </PixelButton>
                <p style={{ color: "#8899CC", fontSize: "10px", margin: "6px 0 0 0", textAlign: "center" }}>
                  Solo el dueño del contrato puede ejecutar el sorteo
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ganadores de la ultima rifa sorteada */}
      {state?.drawn && realWinners.length > 0 && (
        <div style={{ background: "#1A2472", border: "3px solid #0D1040", borderRadius: "10px", boxShadow: "4px 4px 0px #0D1040", marginBottom: "14px", overflow: "hidden" }}>
          <div style={{ background: "#0D1040", borderBottom: "2px solid #0A0830", padding: "10px 16px", textAlign: "center" }}>
            <p style={{ color: "#FFD84A", fontWeight: "bold", fontSize: "14px", margin: 0 }}>
              Ganadores — Ronda {state.currentRound}
            </p>
            <p style={{ color: "#8899CC", fontSize: "11px", margin: "2px 0 0 0" }}>Premio: {state.prize}</p>
          </div>
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {realWinners.map((winner, i) => (
              <div key={winner} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "8px 12px" }}>
                <span style={{ fontSize: "22px", minWidth: "28px" }}>{medals[i]}</span>
                <span style={{ color: "#FFFFFF", fontSize: "11px", fontFamily: "monospace", wordBreak: "break-all" }}>{winner}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sin rifa activa — explicacion */}
      {!loading && !isOpen && (
        <div style={panel}>
          <div style={panelHeader}>
            <span style={{ fontSize: "18px" }}>🎰</span>
            <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>Proxima rifa</span>
          </div>
          <div style={{ padding: "16px" }}>
            <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "18px", margin: "0 0 6px 0" }}>3 Helados Coco</p>
            <p style={{ color: "#6B4A2A", fontSize: "13px", margin: "0 0 12px 0", lineHeight: 1.5 }}>
              Se abre cuando se acumulen {txThreshold} pagos en comercios ArepaPay.
            </p>
            <div style={{ background: "#FFF8E8", border: "2px solid #D4B87A", borderRadius: "8px", padding: "10px 12px" }}>
              <p style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "12px", margin: "0 0 6px 0" }}>Como funciona</p>
              <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0, lineHeight: 1.7 }}>
                1. Paga en comercios → ganas tickets por cada pago<br />
                2. Al llegar a {txThreshold} pagos totales → rifa se abre<br />
                3. Apuesta tus tickets (minimo 1, maximo los que tengas)<br />
                4. Mas tickets apostas = mayor % de ganar<br />
                5. Se sortea y el ganador recibe el premio fisico
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "#FFF8E8", border: "2px solid #C4A870", borderRadius: "10px", padding: "12px 14px", textAlign: "center" }}>
        <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0, lineHeight: 1.5 }}>
          El sorteo es ejecutado por el admin. El ganador es contactado directamente.
        </p>
      </div>
    </div>
  );
}
