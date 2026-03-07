import { useState } from "react";
import { Contract, parseUnits, isAddress } from "ethers";
import PixelButton from "./PixelButton";
import { NETWORK } from "../config/network";

const USDT_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)"
];

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

const inputStyle = {
  width: "100%",
  background: "#FFF8E8",
  border: "3px solid #2C1A0E",
  borderRadius: "8px",
  padding: "14px 16px",
  fontSize: "16px",
  fontFamily: "Inter, sans-serif",
  color: "#2C1A0E",
  fontWeight: "600",
  boxSizing: "border-box",
  outline: "none"
};

const STEPS = { FORM: "form", CONFIRM: "confirm", SUCCESS: "success", ERROR: "error" };

export default function SendScreen({ provider, address, usdtBalance, onBack, onSuccess }) {
  const [step, setStep]       = useState(STEPS.FORM);
  const [to, setTo]           = useState("");
  const [amount, setAmount]   = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash]   = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const toValid     = isAddress(to);
  const amountValid = parseFloat(amount) > 0 && parseFloat(amount) <= parseFloat(usdtBalance.replace(/\./g, "").replace(",", "."));
  const canContinue = toValid && amountValid;

  async function sendUSDT() {
    setLoading(true);
    try {
      // Asegurar que MetaMask esté en ArepaPay antes de firmar
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: NETWORK.chainIdHex,
            chainName: "ArepaPay",
            nativeCurrency: { name: "Arepa Token", symbol: "AREPA", decimals: 18 },
            rpcUrls: [`${window.location.origin}/ext/bc/V9NDW69xy4W7PVdCggpHN2VFZEn1VCXNDgez9GbQpRwo9p2gn/rpc`],
            blockExplorerUrls: []
          }]
        });
      } catch (_) { /* continúa si falla */ }
      const signer = await provider.getSigner();
      const usdt   = new Contract(NETWORK.contracts.mockUSDT, USDT_ABI, signer);
      const value  = parseUnits(amount, 18);
      const tx     = await usdt.transfer(to, value);
      await tx.wait();
      setTxHash(tx.hash);
      setStep(STEPS.SUCCESS);
      onSuccess?.();
    } catch (e) {
      console.error(e);
      setErrorMsg(e?.reason || e?.message || "Error desconocido");
      setStep(STEPS.ERROR);
    } finally {
      setLoading(false);
    }
  }

  // ─── ÉXITO ───
  if (step === STEPS.SUCCESS) {
    return (
      <ScreenWrapper onBack={onBack}>
        <div style={{ ...panel, textAlign: "center" }}>
          <div style={{ ...panelHeader, justifyContent: "center" }}>
            <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>Pago enviado</span>
          </div>
          <div style={{ padding: "28px 20px" }}>
            <div style={{ fontSize: "56px", marginBottom: "12px" }}>✅</div>
            <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "22px", margin: "0 0 6px 0" }}>
              {amount} USDT
            </p>
            <p style={{ color: "#6B4A2A", fontSize: "13px", margin: "0 0 6px 0" }}>enviados a</p>
            <p style={{ color: "#2C1A0E", fontSize: "12px", fontWeight: "bold", wordBreak: "break-all", margin: "0 0 20px 0" }}>
              {to.slice(0, 10)}...{to.slice(-8)}
            </p>
            {txHash && (
              <p style={{ color: "#6B4A2A", fontSize: "10px", wordBreak: "break-all", marginBottom: "20px" }}>
                TX: {txHash.slice(0, 20)}...
              </p>
            )}
            <PixelButton variant="green" onClick={onBack}>
              ← Volver al inicio
            </PixelButton>
          </div>
        </div>
      </ScreenWrapper>
    );
  }

  // ─── ERROR ───
  if (step === STEPS.ERROR) {
    return (
      <ScreenWrapper onBack={onBack}>
        <div style={{ ...panel, textAlign: "center" }}>
          <div style={{ ...panelHeader, justifyContent: "center", background: "#CC2222" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "14px" }}>Error</span>
          </div>
          <div style={{ padding: "28px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>❌</div>
            <p style={{ color: "#2C1A0E", fontSize: "14px", margin: "0 0 20px 0" }}>{errorMsg}</p>
            <PixelButton variant="ghost" onClick={() => setStep(STEPS.FORM)}>
              Intentar de nuevo
            </PixelButton>
          </div>
        </div>
      </ScreenWrapper>
    );
  }

  // ─── CONFIRMACIÓN ───
  if (step === STEPS.CONFIRM) {
    return (
      <ScreenWrapper onBack={() => setStep(STEPS.FORM)}>
        <div style={panel}>
          <div style={panelHeader}>
            <span style={{ fontSize: "18px" }}>🔍</span>
            <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>Confirmar envío</span>
          </div>
          <div style={{ padding: "20px 16px" }}>

            <Row label="Monto" value={`${amount} USDT`} big />
            <Row label="Para" value={`${to.slice(0, 8)}...${to.slice(-6)}`} />
            <Row label="Red" value="ArepaPay" />

            <div style={{
              background: "#FFF8E8",
              border: "2px solid #2C1A0E",
              borderRadius: "8px",
              padding: "12px",
              margin: "16px 0",
              textAlign: "center"
            }}>
              <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0 }}>
                ⚠️ Revisa bien la dirección. Los pagos en blockchain son irreversibles.
              </p>
            </div>

            <PixelButton variant="green" onClick={sendUSDT} disabled={loading}>
              {loading ? "Enviando..." : "✅ Confirmar y Enviar"}
            </PixelButton>
            <div style={{ marginTop: "10px" }}>
              <PixelButton variant="ghost" onClick={() => setStep(STEPS.FORM)} disabled={loading}>
                ← Editar
              </PixelButton>
            </div>
          </div>
        </div>
      </ScreenWrapper>
    );
  }

  // ─── FORMULARIO ───
  return (
    <ScreenWrapper onBack={onBack}>
      <div style={panel}>
        <div style={panelHeader}>
          <span style={{ fontSize: "18px" }}>📤</span>
          <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>Enviar USDT</span>
        </div>
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "18px" }}>

          {/* Balance disponible */}
          <div style={{
            background: "#D4B87A",
            border: "2px solid #2C1A0E",
            borderRadius: "8px",
            padding: "10px 14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{ color: "#2C1A0E", fontSize: "13px", fontWeight: "600" }}>Disponible</span>
            <span style={{ color: "#2C1A0E", fontSize: "16px", fontWeight: "900" }}>{usdtBalance} USDT</span>
          </div>

          {/* ¿A quién? */}
          <div>
            <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
              ¿A quién le envías?
            </label>
            <input
              style={{ ...inputStyle, borderColor: to && !toValid ? "#CC2222" : "#2C1A0E" }}
              placeholder="0x... dirección del destinatario"
              value={to}
              onChange={e => setTo(e.target.value.trim())}
            />
            {to && !toValid && (
              <p style={{ color: "#CC2222", fontSize: "12px", margin: "6px 0 0 0" }}>
                Dirección inválida
              </p>
            )}
          </div>

          {/* ¿Cuánto? */}
          <div>
            <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
              ¿Cuánto envías?
            </label>
            <input
              style={{ ...inputStyle, fontSize: "24px" }}
              placeholder="0.00"
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "6px 0 0 0" }}>USDT</p>
          </div>

          <PixelButton
            variant="green"
            onClick={() => setStep(STEPS.CONFIRM)}
            disabled={!canContinue}
          >
            Continuar →
          </PixelButton>

        </div>
      </div>
    </ScreenWrapper>
  );
}

// ─── HELPERS ───
function ScreenWrapper({ children, onBack }) {
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
      {children}
    </div>
  );
}

function Row({ label, value, big }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: "2px solid #C4A870"
    }}>
      <span style={{ color: "#6B4A2A", fontSize: "13px" }}>{label}</span>
      <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: big ? "20px" : "14px" }}>{value}</span>
    </div>
  );
}
