import { useBalances } from "../hooks/useBalances";

const styles = {
  container: {
    minHeight: "100vh",
    background: "#F5F0E8",
    fontFamily: "Inter, sans-serif",
    maxWidth: "420px",
    margin: "0 auto",
    padding: "0 0 32px 0"
  },
  header: {
    background: "#1B2A6B",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  logo: { fontSize: "28px" },
  appName: {
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    letterSpacing: "2px",
    margin: 0
  },
  address: {
    color: "#A0B0E0",
    fontSize: "12px",
    margin: 0
  },
  disconnectBtn: {
    background: "transparent",
    border: "1px solid #A0B0E0",
    borderRadius: "8px",
    color: "#A0B0E0",
    padding: "6px 12px",
    fontSize: "12px",
    cursor: "pointer"
  },
  body: { padding: "24px 20px" },
  balanceCard: {
    background: "#D4842A",
    borderRadius: "16px",
    padding: "28px 24px",
    boxShadow: "4px 4px 0px #8B5E3C",
    marginBottom: "16px",
    textAlign: "center"
  },
  balanceLabel: {
    color: "#FFF3E0",
    fontSize: "13px",
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  balanceAmount: {
    color: "white",
    fontSize: "42px",
    fontWeight: "bold",
    margin: "0 0 4px 0"
  },
  balanceCurrency: {
    color: "#FFD9A0",
    fontSize: "16px"
  },
  ticketCard: {
    background: "#F0E8D0",
    borderRadius: "16px",
    padding: "20px 24px",
    boxShadow: "4px 4px 0px #C8B898",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  ticketLeft: {},
  ticketLabel: {
    color: "#6B5B45",
    fontSize: "13px",
    margin: "0 0 4px 0"
  },
  ticketCount: {
    color: "#1B2A6B",
    fontSize: "28px",
    fontWeight: "bold",
    margin: 0
  },
  ticketEmoji: { fontSize: "40px" },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "12px"
  },
  actionBtn: {
    background: "white",
    border: "2px solid #E8DCC8",
    borderRadius: "14px",
    padding: "20px 16px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #C8B898",
    transition: "transform 0.1s"
  },
  actionBtnPrimary: {
    background: "#1B2A6B",
    border: "2px solid #1B2A6B",
    borderRadius: "14px",
    padding: "20px 16px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #0D1A45"
  },
  actionEmoji: { fontSize: "28px", marginBottom: "6px" },
  actionLabel: {
    color: "#1B2A6B",
    fontWeight: "600",
    fontSize: "14px",
    margin: 0
  },
  actionLabelLight: {
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    margin: 0
  },
  raffleBtn: {
    background: "#9B2D6B",
    border: "none",
    borderRadius: "14px",
    padding: "18px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "3px 3px 0px #6B1D4B",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px"
  },
  raffleBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    margin: 0
  },
  refreshBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px"
  }
};

export default function Dashboard({ address, disconnect, provider }) {
  const { usdtBalance, tickets, loading, refetch } = useBalances(provider, address);

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>🫓</span>
          <div>
            <p style={styles.appName}>AREPAPAY</p>
            <p style={styles.address}>{shortAddr}</p>
          </div>
        </div>
        <button style={styles.disconnectBtn} onClick={disconnect}>
          Salir
        </button>
      </div>

      {/* Body */}
      <div style={styles.body}>

        {/* Balance USDT */}
        <div style={styles.balanceCard}>
          <p style={styles.balanceLabel}>Tu balance</p>
          <p style={styles.balanceAmount}>
            {loading ? "..." : usdtBalance}
          </p>
          <span style={styles.balanceCurrency}>USDT</span>
          <div>
            <button style={styles.refreshBtn} onClick={refetch} title="Actualizar">
              🔄
            </button>
          </div>
        </div>

        {/* Tickets */}
        <div style={styles.ticketCard}>
          <div style={styles.ticketLeft}>
            <p style={styles.ticketLabel}>Mis Tickets 🫓</p>
            <p style={styles.ticketCount}>
              {loading ? "..." : tickets}
            </p>
          </div>
          <span style={styles.ticketEmoji}>🎟️</span>
        </div>

        {/* Acciones */}
        <div style={styles.actionsGrid}>
          <button style={styles.actionBtnPrimary}>
            <div style={styles.actionEmoji}>📤</div>
            <p style={styles.actionLabelLight}>Enviar</p>
          </button>
          <button style={styles.actionBtn}>
            <div style={styles.actionEmoji}>📥</div>
            <p style={styles.actionLabel}>Recibir</p>
          </button>
        </div>

        <button style={styles.raffleBtn}>
          <span style={{ fontSize: "22px" }}>🎰</span>
          <p style={styles.raffleBtnText}>Ver Rifas</p>
        </button>

      </div>
    </div>
  );
}
