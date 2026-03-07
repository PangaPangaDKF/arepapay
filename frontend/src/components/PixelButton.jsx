import { useState } from "react";

export default function PixelButton({ children, onClick, variant = "blue", disabled = false, style = {} }) {
  const [pressed, setPressed] = useState(false);

  const variants = {
    // Azul marino — botón principal
    blue: {
      background: "linear-gradient(180deg, #2A3A9E 0%, #1A2472 45%, #111855 100%)",
      border: "3px solid #0D1040",
      color: "#FFFFFF",
      shadow: "0 5px 0 #0D1040",
      shadowPressed: "0 2px 0 #0D1040",
    },
    // Alias "green" → mismo azul para no romper código existente
    green: {
      background: "linear-gradient(180deg, #2A3A9E 0%, #1A2472 45%, #111855 100%)",
      border: "3px solid #0D1040",
      color: "#FFFFFF",
      shadow: "0 5px 0 #0D1040",
      shadowPressed: "0 2px 0 #0D1040",
    },
    // Rojo — acción destructiva o secundaria
    red: {
      background: "linear-gradient(180deg, #E02222 0%, #CC1111 45%, #991111 100%)",
      border: "3px solid #770000",
      color: "#FFFFFF",
      shadow: "0 5px 0 #770000",
      shadowPressed: "0 2px 0 #770000",
    },
    // Alias "orange" → rojo
    orange: {
      background: "linear-gradient(180deg, #E02222 0%, #CC1111 45%, #991111 100%)",
      border: "3px solid #770000",
      color: "#FFFFFF",
      shadow: "0 5px 0 #770000",
      shadowPressed: "0 2px 0 #770000",
    },
    // Ghost — blanco con borde marino
    ghost: {
      background: "#FFFFFF",
      border: "3px solid #1A2472",
      color: "#1A2472",
      shadow: "0 5px 0 #1A2472",
      shadowPressed: "0 2px 0 #1A2472",
    },
    // Dark — marino oscuro
    dark: {
      background: "linear-gradient(180deg, #1A2472 0%, #0D1040 100%)",
      border: "3px solid #0D1040",
      color: "#FFFFFF",
      shadow: "0 5px 0 #050820",
      shadowPressed: "0 2px 0 #050820",
    },
  };

  const v = variants[variant] || variants.blue;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: disabled ? "#AAAACC" : v.background,
        border: v.border,
        borderRadius: "24px",
        boxShadow: pressed ? v.shadowPressed : v.shadow,
        padding: "13px 24px",
        color: disabled ? "#888" : v.color,
        fontWeight: "bold",
        fontSize: "16px",
        fontFamily: "Inter, sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        width: "100%",
        textAlign: "center",
        transform: pressed ? "translateY(3px)" : "translateY(0)",
        transition: "transform 0.05s, box-shadow 0.05s",
        letterSpacing: "0.5px",
        ...style
      }}
    >
      {children}
    </button>
  );
}
