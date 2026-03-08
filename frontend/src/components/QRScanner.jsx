import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export default function QRScanner({ onScan, onClose }) {
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    function tick() {
      if (!active) return;
      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx  = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
      if (code) {
        stop();
        onScan(code.data);
        return;
      }
      animRef.current = requestAnimationFrame(tick);
    }

    function stop() {
      active = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        tick();
      })
      .catch(e => setError("No se pudo acceder a la camara. Verifica los permisos."));

    return stop;
  }, [onScan]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
        {error ? (
          <p style={{ color: "#FF6B6B", textAlign: "center", padding: "32px 20px", fontSize: "14px" }}>{error}</p>
        ) : (
          <>
            <video ref={videoRef} style={{ width: "100%", display: "block" }} playsInline muted />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {/* Visor de enfoque */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ width: "220px", height: "220px", border: "3px solid #CC1111", borderRadius: "16px", boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)" }}>
                {/* Esquinas decorativas */}
                {[["0","0"],["0","auto"],["auto","0"],["auto","auto"]].map(([t,b], i) => (
                  <div key={i} style={{ position: "absolute", top: t === "0" ? "-3px" : "auto", bottom: b === "auto" ? "auto" : "-3px", left: i < 2 ? "-3px" : "auto", right: i >= 2 ? "-3px" : "auto", width: "24px", height: "24px", border: "4px solid #FFD84A", borderRadius: i === 0 ? "12px 0 0 0" : i === 1 ? "0 0 0 12px" : i === 2 ? "0 12px 0 0" : "0 0 12px 0" }} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <p style={{ color: "#8899CC", fontSize: "13px", margin: "20px 0 8px 0", textAlign: "center" }}>
        Apunta la camara al QR del comercio
      </p>
      <button
        onClick={onClose}
        style={{ background: "#CC1111", color: "white", border: "none", borderRadius: "8px", padding: "12px 36px", fontSize: "14px", fontWeight: "bold", cursor: "pointer", fontFamily: "Inter, sans-serif", marginTop: "8px" }}
      >
        Cancelar
      </button>
    </div>
  );
}
