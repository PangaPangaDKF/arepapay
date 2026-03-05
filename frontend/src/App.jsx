import { useWallet } from "./hooks/useWallet";

export default function App() {
  const { address, connected, connect, disconnect } = useWallet();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F0E8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: "20px"
    }}>
      {/* Logo */}
      <div style={{ fontSize: "64px", marginBottom: "8px" }}>🫓</div>
      <h1 style={{
        color: "#1B2A6B",
        fontSize: "28px",
        fontWeight: "bold",
        margin: "0 0 8px 0",
        letterSpacing: "2px"
      }}>AREPAPAY</h1>
      <p style={{
        color: "#6B5B45",
        fontSize: "14px",
        marginBottom: "40px"
      }}>La arepa es venezolana. 🇻🇪</p>

      {!connected ? (
        <button
          onClick={connect}
          style={{
            background: "#D4842A",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "16px 40px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "4px 4px 0px #8B5E3C"
          }}
        >
          🔌 Conectar Wallet
        </button>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{
            background: "#F0E8D0",
            borderRadius: "12px",
            padding: "20px 32px",
            boxShadow: "4px 4px 0px #8B5E3C",
            marginBottom: "16px"
          }}>
            <p style={{ color: "#6B5B45", fontSize: "12px", margin: "0 0 4px 0" }}>
              Conectado
            </p>
            <p style={{ color: "#1B2A6B", fontWeight: "bold", margin: 0, fontSize: "14px" }}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
          <button
            onClick={disconnect}
            style={{
              background: "#CC2222",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Desconectar
          </button>
        </div>
      )}
    </div>
  );
}
