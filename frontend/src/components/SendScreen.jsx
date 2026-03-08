import { useState, useEffect, useCallback } from "react";
import { Contract, parseUnits, isAddress, JsonRpcProvider } from "ethers";
import PixelButton from "./PixelButton";
import QRScanner from "./QRScanner";
import { NETWORK } from "../config/network";

const USDT_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)"
];

const PAYMENT_PROCESSOR_ABI = [
  "function payMerchant(address _merchant, uint256 _amount) external"
];

const MERCHANT_REGISTRY_ABI = [
  "function isMerchant(address) view returns (bool)"
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

export default function SendScreen({ provider, address, usdtBalance, onBack, onSuccess, prefilledTo = "", prefilledName = "", prefilledAmount = "" }) {
  const [step, setStep]           = useState(STEPS.FORM);
  const [to, setTo]               = useState(prefilledTo);
  const [amount, setAmount]       = useState(prefilledAmount);
  const [loading, setLoading]     = useState(false);
  const [txHash, setTxHash]       = useState("");
  const [errorMsg, setErrorMsg]   = useState("");
  const [wrongChain, setWrongChain] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [showScanner, setShowScanner]     = useState(false);
  const [merchantName, setMerchantName]   = useState(prefilledName);
  const [isMerchantPay, setIsMerchantPay] = useState(false);
  const [checkingMerchant, setCheckingMerchant] = useState(false);

  // Verificar red al abrir
  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.request({ method: "eth_chainId" }).then(chainId => {
      setWrongChain(parseInt(chainId, 16) !== NETWORK.chainId);
    });
    const handler = (chainId) => setWrongChain(parseInt(chainId, 16) !== NETWORK.chainId);
    window.ethereum.on("chainChanged", handler);
    return () => window.ethereum.removeListener("chainChanged", handler);
  }, []);

  // Verificar si la direccion es comercio registrado on-chain
  const checkIsMerchant = useCallback(async (addr) => {
    setCheckingMerchant(true);
    try {
      const rpc      = new JsonRpcProvider(NETWORK.rpcUrl);
      const registry = new Contract(NETWORK.contracts.merchantRegistry, MERCHANT_REGISTRY_ABI, rpc);
      const verified = await registry.isMerchant(addr);
      setIsMerchantPay(verified);
    } catch (_) {
      setIsMerchantPay(false);
    } finally {
      setCheckingMerchant(false);
    }
  }, []);

  useEffect(() => {
    if (isAddress(to)) checkIsMerchant(to);
    else setIsMerchantPay(false);
  }, [to, checkIsMerchant]);

  // Leer QR del comerciante
  function handleScan(raw) {
    setShowScanner(false);
    try {
      const data = JSON.parse(raw);
      if (data.type === "arepapay" && isAddress(data.to)) {
        setTo(data.to);
        if (data.amount) setAmount(String(data.amount));
        if (data.name)   setMerchantName(data.name);
        return;
      }
    } catch (_) {}
    if (isAddress(raw.trim())) setTo(raw.trim());
  }

  const toValid     = isAddress(to);
  const amountValid = parseFloat(amount) > 0 && parseFloat(amount) <= parseFloat(usdtBalance.replace(/\./g, "").replace(",", "."));
  const canContinue = toValid && amountValid && !wrongChain;

  async function sendPayment() {
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const value  = parseUnits(amount, 18);

      if (isMerchantPay) {
        // Flujo comerciante: approve + payMerchant (2 txns)
        const usdt      = new Contract(NETWORK.contracts.mockUSDT, USDT_ABI, signer);
        const approveTx = await usdt.approve(NETWORK.contracts.paymentProcessor, value);
        await approveTx.wait();

        const processor = new Contract(NETWORK.contracts.paymentProcessor, PAYMENT_PROCESSOR_ABI, signer);
        const tx        = await processor.payMerchant(to, value);
        await tx.wait();
        setTxHash(tx.hash);
      } else {
        // Flujo P2P: transfer directo
        const usdt = new Contract(NETWORK.contracts.mockUSDT, USDT_ABI, signer);
        const tx   = await usdt.transfer(to, value);
        await tx.wait();
        setTxHash(tx.hash);
      }

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

  // ─── SCANNER ───
  if (showScanner) {
    return <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />;
  }

  // ─── EXITO ───
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
            <p style={{ color: "#6B4A2A", fontSize: "13px", margin: "0 0 6px 0" }}>
              enviados a {merchantName || `${to.slice(0, 10)}...${to.slice(-8)}`}
            </p>
            {isMerchantPay && (
              <div style={{ display: "inline-block", background: "#1A2472", color: "#FFD84A", fontSize: "11px", fontWeight: "bold", padding: "4px 10px", borderRadius: "6px", marginBottom: "12px" }}>
                Comercio verificado ArepaPay
              </div>
            )}
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

  // ─── CONFIRMACION ───
  if (step === STEPS.CONFIRM) {
    return (
      <ScreenWrapper onBack={() => setStep(STEPS.FORM)}>
        <div style={panel}>
          <div style={panelHeader}>
            <span style={{ fontSize: "18px" }}>🔍</span>
            <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "14px" }}>Confirmar envio</span>
          </div>
          <div style={{ padding: "20px 16px" }}>

            {isMerchantPay && (
              <div style={{ background: "#1A2472", border: "2px solid #0D1040", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>🏪</span>
                <div>
                  <p style={{ color: "#FFD84A", fontWeight: "bold", fontSize: "12px", margin: 0 }}>Comercio verificado ArepaPay</p>
                  {merchantName && <p style={{ color: "#8899CC", fontSize: "11px", margin: "2px 0 0 0" }}>{merchantName}</p>}
                </div>
              </div>
            )}

            <Row label="Monto" value={`${amount} USDT`} big />
            <Row label="Para"  value={merchantName || `${to.slice(0, 8)}...${to.slice(-6)}`} />
            <Row label="Red"   value="Avalanche Fuji" />
            {isMerchantPay && <Row label="Via" value="PaymentProcessor" />}

            {isMerchantPay && (
              <div style={{ background: "#FFF8E8", border: "2px solid #D4B87A", borderRadius: "8px", padding: "10px 12px", margin: "12px 0 8px 0" }}>
                <p style={{ color: "#6B4A2A", fontSize: "11px", margin: 0, lineHeight: 1.5 }}>
                  Se realizaran 2 transacciones: primero apruebas el gasto de USDT, luego se procesa el pago al comercio.
                </p>
              </div>
            )}

            <div style={{ background: "#FFF8E8", border: "2px solid #2C1A0E", borderRadius: "8px", padding: "12px", margin: "16px 0", textAlign: "center" }}>
              <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0 }}>
                Revisa bien la direccion. Los pagos en blockchain son irreversibles.
              </p>
            </div>

            <PixelButton variant="green" onClick={sendPayment} disabled={loading}>
              {loading
                ? (isMerchantPay ? "Procesando (2 pasos)..." : "Enviando...")
                : "Confirmar y Enviar"}
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

          {wrongChain && (
            <div style={{ background: "#FFF0F0", border: "3px solid #CC1111", borderRadius: "10px", padding: "14px" }}>
              <p style={{ color: "#CC1111", fontWeight: "bold", fontSize: "13px", margin: "0 0 10px 0", textAlign: "center" }}>
                MetaMask esta en la red equivocada
              </p>
              <button
                onClick={() => setShowManualInstructions(v => !v)}
                style={{ width: "100%", background: "#CC1111", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold", fontSize: "13px", padding: "10px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
              >
                {showManualInstructions ? "▲ Ocultar instrucciones" : "Como cambiar a ArepaPay?"}
              </button>
              {showManualInstructions && (
                <div style={{ marginTop: "12px", background: "#FFF8E8", border: "2px solid #CC1111", borderRadius: "8px", padding: "12px" }}>
                  {["1. Toca el icono de MetaMask", "2. Toca el nombre de la red actual (arriba)", "3. Busca \"Avalanche Fuji\" en la lista", "4. Seleccionala y vuelve aqui"].map((s, i) => (
                    <p key={i} style={{ color: "#2C1A0E", fontSize: "12px", margin: "0 0 4px 0", lineHeight: 1.4 }}>{s}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Boton escanear QR */}
          <button
            onClick={() => setShowScanner(true)}
            style={{
              width: "100%", background: "#1A2472", color: "white",
              border: "3px solid #0D1040", borderRadius: "8px",
              padding: "14px", fontSize: "15px", fontWeight: "bold",
              cursor: "pointer", fontFamily: "Inter, sans-serif",
              boxShadow: "4px 4px 0px #0D1040",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
            }}
          >
            <span style={{ fontSize: "20px" }}>📷</span>
            Escanear QR del comercio
          </button>

          {/* Balance disponible */}
          <div style={{ background: "#D4B87A", border: "2px solid #2C1A0E", borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#2C1A0E", fontSize: "13px", fontWeight: "600" }}>Disponible</span>
            <span style={{ color: "#2C1A0E", fontSize: "16px", fontWeight: "900" }}>{usdtBalance} USDT</span>
          </div>

          {/* Destinatario */}
          <div>
            <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
              A quien le envias?
            </label>
            <input
              style={{ ...inputStyle, borderColor: to && !toValid ? "#CC2222" : "#2C1A0E" }}
              placeholder="0x... o escanea el QR del comercio"
              value={to}
              onChange={e => { setTo(e.target.value.trim()); setMerchantName(""); }}
            />
            {to && !toValid && (
              <p style={{ color: "#CC2222", fontSize: "12px", margin: "6px 0 0 0" }}>Direccion invalida</p>
            )}
            {toValid && !checkingMerchant && isMerchantPay && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                <span style={{ fontSize: "14px" }}>🏪</span>
                <p style={{ color: "#1A2472", fontSize: "12px", fontWeight: "bold", margin: 0 }}>
                  Comercio verificado ArepaPay{merchantName && ` — ${merchantName}`}
                </p>
              </div>
            )}
            {toValid && checkingMerchant && (
              <p style={{ color: "#8899CC", fontSize: "12px", margin: "6px 0 0 0" }}>Verificando comercio...</p>
            )}
          </div>

          {/* Monto */}
          <div>
            <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
              {prefilledAmount ? "Monto fijado por el comercio" : "Cuanto envias?"}
            </label>
            <input
              style={{
                ...inputStyle,
                fontSize: "24px",
                ...(prefilledAmount ? { background: "#E8F0D8", borderColor: "#5A8A20", color: "#2C5A10", cursor: "not-allowed" } : {})
              }}
              placeholder="0.00"
              type="number"
              min="0"
              value={amount}
              readOnly={!!prefilledAmount}
              onChange={prefilledAmount ? undefined : e => setAmount(e.target.value)}
            />
            <p style={{ color: "#6B4A2A", fontSize: "12px", margin: "6px 0 0 0" }}>
              USDT{prefilledAmount && " — fijado por el comercio, no editable"}
            </p>
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

function ScreenWrapper({ children, onBack }) {
  return (
    <div style={{ padding: "16px", paddingBottom: "80px" }}>
      <button
        onClick={onBack}
        style={{ background: "transparent", border: "none", color: "#6B4A2A", fontSize: "14px", fontWeight: "bold", cursor: "pointer", marginBottom: "12px", padding: "4px 0", fontFamily: "Inter, sans-serif" }}
      >
        ← Volver
      </button>
      {children}
    </div>
  );
}

function Row({ label, value, big }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "2px solid #C4A870" }}>
      <span style={{ color: "#6B4A2A", fontSize: "13px" }}>{label}</span>
      <span style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: big ? "20px" : "14px" }}>{value}</span>
    </div>
  );
}
