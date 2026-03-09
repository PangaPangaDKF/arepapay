import { useState, useEffect, useCallback } from "react";
import { Contract, parseUnits, isAddress, JsonRpcProvider } from "ethers";
import PixelButton from "./PixelButton";
import QRScanner from "./QRScanner";
import { NETWORK, MERCHANTS } from "../config/network";

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
const BCV_RATE = 400; // Bs por 1 USDT

export default function SendScreen({ provider, address, usdtBalance, onBack, onSuccess, prefilledTo = "", prefilledName = "", prefilledAmount = "", switchChain }) {
  const [step, setStep]           = useState(STEPS.FORM);
  const [to, setTo]               = useState(prefilledTo);
  // bsInput: lo que escribe el usuario en Bs; usdtAmount: lo que se envía
  const initBs = prefilledAmount ? String(Math.round(parseFloat(prefilledAmount) * BCV_RATE)) : "";
  const [bsInput, setBsInput]     = useState(initBs);
  const usdtAmount = bsInput ? (parseFloat(bsInput) / BCV_RATE).toFixed(6) : "";
  const [loading, setLoading]     = useState(false);
  const [txHash, setTxHash]       = useState("");
  const [errorMsg, setErrorMsg]   = useState("");
  const [wrongChain, setWrongChain] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [merchantName, setMerchantName]   = useState(prefilledName);
  const [isMerchantPay, setIsMerchantPay] = useState(false);
  const [checkingMerchant, setCheckingMerchant] = useState(false);
  const [showContacts, setShowContacts]     = useState(false);
  const [showScanner, setShowScanner]       = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [savedContacts, setSavedContacts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("arepapay_contacts") || "[]"); }
    catch { return []; }
  });

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

  function handleScan(raw) {
    setShowScanner(false);
    try {
      const data = JSON.parse(raw);
      if (data.type === "arepapay" && isAddress(data.to)) {
        setTo(data.to);
        if (data.amount) setBsInput(String(Math.round(parseFloat(data.amount) * BCV_RATE)));
        if (data.name) setMerchantName(data.name);
        return;
      }
    } catch (_) {}
    if (isAddress(raw.trim())) setTo(raw.trim());
  }

  function saveContact(addr, name) {
    const already = [...MERCHANTS, ...savedContacts].some(c => c.address.toLowerCase() === addr.toLowerCase());
    if (already) return;
    const updated = [...savedContacts, { address: addr, name: name || `${addr.slice(0,6)}...${addr.slice(-4)}`, emoji: "👤" }];
    setSavedContacts(updated);
    localStorage.setItem("arepapay_contacts", JSON.stringify(updated));
  }

  const toValid     = isAddress(to);
  const usdtNum     = parseFloat(usdtAmount) || 0;
  const balanceNum  = parseFloat(usdtBalance.replace(/\./g, "").replace(",", ".")) || 0;
  const amountValid = usdtNum > 0 && usdtNum <= balanceNum;
  const canContinue = toValid && amountValid && !wrongChain;

  async function sendPayment() {
    setLoading(true);
    try {
      const signer = await provider.getSigner();
      const value  = parseUnits(usdtAmount, 18);

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

  // ─── COMPROBANTE MODAL (overlay fijo hasta que el usuario lo cierra) ───
  if (step === STEPS.SUCCESS) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.82)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px"
      }}>
        <div style={{
          background: "#FFF8E0",
          border: "4px solid #C89038",
          borderRadius: "20px",
          boxShadow: "0 0 0 4px #2C1A0E",
          width: "100%",
          maxWidth: "380px",
          overflow: "hidden",
          textAlign: "center"
        }}>
          {/* Header verde */}
          <div style={{ background: "#1A7A1A", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>✅</span>
            <span style={{ color: "#FFFFFF", fontWeight: "900", fontSize: "15px", letterSpacing: "1px" }}>PAGO CONFIRMADO</span>
          </div>

          {/* Cuerpo del comprobante */}
          <div style={{ padding: "28px 24px 20px 24px" }}>
            {/* Monto grande */}
            <p style={{ color: "#8899CC", fontSize: "12px", margin: "0 0 4px 0", fontWeight: "600" }}>MONTO PAGADO</p>
            <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "48px", margin: "0 0 2px 0", lineHeight: 1 }}>
              {parseFloat(bsInput).toLocaleString("es-VE")}
            </p>
            <p style={{ color: "#CC1111", fontWeight: "900", fontSize: "20px", margin: "0 0 6px 0" }}>Bolívares</p>
            <p style={{ color: "#6B4A2A", fontSize: "14px", margin: "0 0 20px 0" }}>
              = <strong>{usdtNum.toFixed(2)} USDT</strong>
            </p>

            {/* Separador */}
            <div style={{ borderTop: "2px dashed #C89038", margin: "0 0 16px 0" }} />

            {/* Destinatario */}
            <p style={{ color: "#8899CC", fontSize: "11px", margin: "0 0 4px 0", fontWeight: "600" }}>
              {isMerchantPay ? "COMERCIO" : "ENVIADO A"}
            </p>
            {isMerchantPay && (
              <div style={{ display: "inline-block", background: "#1A2472", color: "#FFD84A", fontSize: "11px", fontWeight: "bold", padding: "3px 10px", borderRadius: "6px", marginBottom: "6px" }}>
                🏪 Comercio verificado ArepaPay
              </div>
            )}
            <p style={{ color: "#2C1A0E", fontWeight: "900", fontSize: "18px", margin: "0 0 4px 0" }}>
              {merchantName || `${to.slice(0, 8)}...${to.slice(-6)}`}
            </p>
            {merchantName && (
              <p style={{ color: "#8899CC", fontSize: "11px", margin: "0 0 16px 0", fontFamily: "monospace" }}>
                {to.slice(0, 10)}...{to.slice(-8)}
              </p>
            )}

            {/* TX */}
            {txHash && (
              <>
                <div style={{ borderTop: "2px dashed #C89038", margin: "0 0 12px 0" }} />
                <p style={{ color: "#8899CC", fontSize: "10px", wordBreak: "break-all", margin: "0 0 16px 0" }}>
                  TX: {txHash.slice(0, 22)}...{txHash.slice(-6)}
                </p>
              </>
            )}

            {/* Nota */}
            <div style={{ background: "#FFF0D0", border: "2px solid #C89038", borderRadius: "8px", padding: "10px 12px", marginBottom: "20px" }}>
              <p style={{ color: "#6B4A2A", fontSize: "11px", margin: 0, lineHeight: 1.5 }}>
                📱 Muestra esta pantalla al comerciante como comprobante de pago
              </p>
            </div>

            <PixelButton variant="blue" onClick={onBack}>
              Continuar →
            </PixelButton>
          </div>
        </div>
      </div>
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

            <Row label="Monto" value={`${bsInput} Bs`} big />
            <Row label="Equivale a" value={`${usdtNum.toFixed(2)} USDT`} />
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
                ⚠️ Wallet en red equivocada
              </p>
              {switchChain && (
                <button
                  onClick={async () => { try { await switchChain(); } catch (_) {} }}
                  style={{ width: "100%", background: "#CC1111", border: "none", borderRadius: "8px", color: "white", fontWeight: "bold", fontSize: "13px", padding: "10px", cursor: "pointer", fontFamily: "Inter, sans-serif", marginBottom: "8px" }}
                >
                  🔀 Cambiar a Avalanche Fuji
                </button>
              )}
              <button
                onClick={() => setShowManualInstructions(v => !v)}
                style={{ width: "100%", background: "transparent", border: "2px solid #CC1111", borderRadius: "8px", color: "#CC1111", fontWeight: "bold", fontSize: "12px", padding: "8px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
              >
                {showManualInstructions ? "▲ Ocultar instrucciones" : "¿Cómo cambiar manualmente?"}
              </button>
              {showManualInstructions && (
                <div style={{ marginTop: "10px", background: "#FFF8E8", border: "2px solid #CC1111", borderRadius: "8px", padding: "12px" }}>
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
            style={{ width: "100%", background: "#1A2472", color: "white", border: "3px solid #0D1040", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", fontFamily: "Inter, sans-serif", boxShadow: "3px 3px 0px #0D1040", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <span style={{ fontSize: "18px" }}>📷</span>
            Escanear QR del comercio
          </button>

          {/* Balance disponible */}
          <div style={{ background: "#D4B87A", border: "2px solid #2C1A0E", borderRadius: "8px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#2C1A0E", fontSize: "13px", fontWeight: "600" }}>Disponible</span>
            <span style={{ color: "#2C1A0E", fontSize: "16px", fontWeight: "900" }}>{usdtBalance} USDT</span>
          </div>

          {/* Destinatario */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold" }}>
                A quien le envias?
              </label>
              <button
                onClick={() => setShowContacts(v => !v)}
                style={{ background: "#1A2472", color: "white", border: "2px solid #0D1040", borderRadius: "8px", padding: "5px 12px", fontSize: "12px", fontWeight: "bold", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
              >
                👥 Contactos
              </button>
            </div>

            {showContacts && (
              <div style={{ background: "#FFF8E8", border: "2px solid #C89038", borderRadius: "8px", marginBottom: "8px", overflow: "hidden" }}>
                {MERCHANTS.length === 0 && savedContacts.length === 0 && (
                  <p style={{ color: "#8899CC", fontSize: "12px", padding: "12px 14px", margin: 0 }}>No hay contactos guardados aún.</p>
                )}
                {[...MERCHANTS, ...savedContacts].map((m, i) => (
                  <button
                    key={m.id || m.address}
                    onClick={() => { setTo(m.address); setMerchantName(m.name); setShowContacts(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "transparent", border: "none", borderBottom: i < MERCHANTS.length + savedContacts.length - 1 ? "1px solid #E8D8A0" : "none", cursor: "pointer", fontFamily: "Inter, sans-serif", textAlign: "left" }}
                  >
                    <span style={{ fontSize: "22px" }}>{m.emoji || "👤"}</span>
                    <div>
                      <p style={{ color: "#2C1A0E", fontWeight: "bold", fontSize: "13px", margin: 0 }}>{m.name}</p>
                      <p style={{ color: "#8899CC", fontSize: "10px", margin: 0, fontFamily: "monospace" }}>{m.address.slice(0, 10)}...{m.address.slice(-6)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <input
              style={{ ...inputStyle, borderColor: to && !toValid ? "#CC2222" : "#2C1A0E" }}
              placeholder="0x..."
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
            {toValid && !checkingMerchant && ![...MERCHANTS, ...savedContacts].some(c => c.address.toLowerCase() === to.toLowerCase()) && (
              <button
                onClick={() => saveContact(to, merchantName)}
                style={{ marginTop: "8px", background: "#FFF8E0", border: "2px solid #C89038", borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontWeight: "bold", color: "#6B4A2A", cursor: "pointer", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: "6px" }}
              >
                ➕ Agregar a contactos
              </button>
            )}
            {toValid && !checkingMerchant && savedContacts.some(c => c.address.toLowerCase() === to.toLowerCase()) && (
              <p style={{ color: "#5A8A20", fontSize: "12px", margin: "8px 0 0 0" }}>✓ Guardado en contactos</p>
            )}
          </div>

          {/* Monto en Bs */}
          <div>
            <label style={{ color: "#2C1A0E", fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
              {prefilledAmount ? "Monto fijado por el comercio" : "Cuanto envias?"}
            </label>
            <div style={{ position: "relative" }}>
              <input
                style={{
                  ...inputStyle,
                  fontSize: "28px",
                  paddingRight: "56px",
                  ...(prefilledAmount ? { background: "#E8F0D8", borderColor: "#5A8A20", color: "#2C5A10", cursor: "not-allowed" } : {})
                }}
                placeholder="0"
                type="number"
                min="0"
                value={bsInput}
                readOnly={!!prefilledAmount}
                onChange={prefilledAmount ? undefined : e => setBsInput(e.target.value)}
              />
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#C89038", fontWeight: "900", fontSize: "16px" }}>Bs</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
              <p style={{ color: "#6B4A2A", fontSize: "12px", margin: 0 }}>
                {usdtAmount && usdtNum > 0 ? `= ${usdtNum.toFixed(2)} USDT` : "Ingresa un monto en Bolívares"}
              </p>
              <p style={{ color: "#8899CC", fontSize: "10px", margin: 0 }}>Tasa: {BCV_RATE} Bs/$</p>
            </div>
            {usdtNum > balanceNum && usdtNum > 0 && (
              <p style={{ color: "#CC1111", fontSize: "12px", margin: "4px 0 0 0" }}>Saldo insuficiente</p>
            )}
          </div>

          <PixelButton
            variant="green"
            onClick={() => setStep(STEPS.CONFIRM)}
            disabled={!canContinue}
          >
            Continuar →
          </PixelButton>

          {/* Instrucciones colapsables */}
          <button
            onClick={() => setShowInstructions(v => !v)}
            style={{ width: "100%", background: "transparent", border: "none", color: "#8899CC", fontSize: "12px", cursor: "pointer", fontFamily: "Inter, sans-serif", padding: "4px 0", textAlign: "center" }}
          >
            {showInstructions ? "▲ Ocultar ayuda" : "💡 ¿Cómo funciona?"}
          </button>
          {showInstructions && (
            <div style={{ background: "#FFF8E8", border: "2px solid #C89038", borderRadius: "8px", padding: "12px 14px" }}>
              {[
                "📷  Escanea el QR del comercio",
                "👥  O selecciona un contacto guardado",
                "✏️  O escribe la dirección 0x... manual",
                "💰  Ingresa el monto en Bolívares (Bs)"
              ].map((s, i) => (
                <p key={i} style={{ color: "#2C1A0E", fontSize: "12px", margin: "0 0 3px 0", lineHeight: 1.4 }}>{s}</p>
              ))}
            </div>
          )}

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
