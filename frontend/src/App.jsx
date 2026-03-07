import { useWallet } from "./hooks/useWallet";
import Dashboard from "./components/Dashboard";
import PixelButton from "./components/PixelButton";

const CHECKER = {
  backgroundImage: [
    "linear-gradient(45deg, #CC1111 25%, transparent 25%)",
    "linear-gradient(-45deg, #CC1111 25%, transparent 25%)",
    "linear-gradient(45deg, transparent 75%, #CC1111 75%)",
    "linear-gradient(-45deg, transparent 75%, #CC1111 75%)",
  ].join(", "),
  backgroundSize: "12px 12px",
  backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
  backgroundColor: "#FFFFFF",
};

export default function App() {
  const { address, provider, connected, connect, disconnect, error, switchChain } = useWallet();

  if (connected) {
    return (
      <Dashboard
        address={address}
        provider={provider}
        disconnect={disconnect}
        switchChain={switchChain}
      />
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFF8E0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: "20px",
      maxWidth: "420px",
      margin: "0 auto"
    }}>

      {/* Card principal */}
      <div style={{
        background: "#FFFFFF",
        border: "4px solid #C89038",
        borderRadius: "16px",
        boxShadow: "6px 6px 0px #C89038",
        width: "100%",
        overflow: "hidden"
      }}>

        {/* Franja tablero arriba */}
        <div style={{ height: "14px", ...CHECKER }} />

        {/* Cuerpo */}
        <div style={{ padding: "28px 24px", textAlign: "center" }}>

          {/* Logo arepa */}
          <div style={{
            width: "96px",
            height: "96px",
            background: "#FFF8E0",
            border: "4px solid #C89038",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            fontSize: "52px",
            boxShadow: "3px 3px 0px #C89038"
          }}>
            🫓
          </div>

          {/* Título */}
          <h1 style={{
            color: "#1A2472",
            fontSize: "34px",
            fontWeight: "900",
            margin: "0 0 6px 0",
            letterSpacing: "4px",
            textTransform: "uppercase"
          }}>
            AREPAPAY
          </h1>

          <p style={{
            color: "#CC1111",
            fontSize: "13px",
            fontWeight: "bold",
            margin: "0 0 28px 0",
            letterSpacing: "1px",
            textTransform: "uppercase"
          }}>
            La arepa es venezolana 🇻🇪
          </p>

          <PixelButton variant="blue" onClick={connect}>
            🔌 Conectar Wallet
          </PixelButton>

          {error && (
            <p style={{ color: "#CC1111", fontSize: "12px", margin: "12px 0 0 0", lineHeight: 1.4 }}>
              ⚠️ {error}
            </p>
          )}

          <p style={{
            color: "#8899CC",
            fontSize: "11px",
            margin: "18px 0 0 0",
            lineHeight: 1.5
          }}>
            Autocustodia · Red ArepaPay · Avalanche
          </p>
        </div>

        {/* Franja tablero abajo */}
        <div style={{ height: "14px", ...CHECKER }} />
      </div>

    </div>
  );
}
