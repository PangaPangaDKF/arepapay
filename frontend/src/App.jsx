import { useWallet } from "./hooks/useWallet";
import Dashboard from "./components/Dashboard";
import PixelButton from "./components/PixelButton";

export default function App() {
  const { address, provider, connected, connect, disconnect, error } = useWallet();

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
      background: "#F5E8C0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: "20px",
      maxWidth: "420px",
      margin: "0 auto"
    }}>

      {/* Panel principal login */}
      <div style={{
        background: "#F0DCA0",
        border: "3px solid #2C1A0E",
        borderRadius: "10px",
        boxShadow: "6px 6px 0px #2C1A0E",
        width: "100%",
        overflow: "hidden"
      }}>
        {/* Header panel */}
        <div style={{
          background: "#D4B87A",
          borderBottom: "3px solid #2C1A0E",
          padding: "12px 20px",
          textAlign: "center"
        }}>
          <span style={{ fontSize: "40px" }}>🫓</span>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 20px", textAlign: "center" }}>
          <h1 style={{
            color: "#2C1A0E",
            fontSize: "28px",
            fontWeight: "900",
            margin: "0 0 6px 0",
            letterSpacing: "3px"
          }}>
            AREPAPAY
          </h1>
          <p style={{
            color: "#6B4A2A",
            fontSize: "13px",
            margin: "0 0 28px 0"
          }}>
            La arepa es venezolana. 🇻🇪
          </p>

          <PixelButton variant="green" onClick={connect}>
            🔌 Conectar Wallet
          </PixelButton>

          {error && (
            <p style={{ color: "#CC2222", fontSize: "12px", margin: "12px 0 0 0", lineHeight: 1.4 }}>
              ⚠️ {error}
            </p>
          )}

          <p style={{
            color: "#6B4A2A",
            fontSize: "11px",
            margin: "16px 0 0 0",
            lineHeight: 1.5
          }}>
            Autocustodia · Red ArepaPay · Avalanche
          </p>
        </div>
      </div>

    </div>
  );
}
