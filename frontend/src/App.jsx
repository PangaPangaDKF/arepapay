import { useWallet } from "./hooks/useWallet";
import Dashboard from "./components/Dashboard";

export default function App() {
  const { address, provider, connected, connect, disconnect } = useWallet();

  if (connected) {
    return (
      <Dashboard
        address={address}
        provider={provider}
        disconnect={disconnect}
      />
    );
  }

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
    </div>
  );
}
