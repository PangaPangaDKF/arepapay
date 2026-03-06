import { useState } from "react";

/**
 * PixelButton — botón estilo RPG pixel art
 * variant: "green" (default) | "orange" | "dark" | "ghost"
 */
export default function PixelButton({ children, onClick, variant = "green", disabled = false, style = {} }) {
  const [pressed, setPressed] = useState(false);

  const variants = {
    green: {
      background: "linear-gradient(180deg, #A8E060 0%, #78C040 45%, #58A030 100%)",
      border: "3px solid #2C1A0E",
      color: "#2C1A0E",
      shadow: "0 5px 0 #2C1A0E",
      shadowPressed: "0 2px 0 #2C1A0E",
    },
    orange: {
      background: "linear-gradient(180deg, #F0A050 0%, #D4842A 45%, #A06020 100%)",
      border: "3px solid #2C1A0E",
      color: "#2C1A0E",
      shadow: "0 5px 0 #2C1A0E",
      shadowPressed: "0 2px 0 #2C1A0E",
    },
    dark: {
      background: "linear-gradient(180deg, #4A3020 0%, #2C1A0E 100%)",
      border: "3px solid #2C1A0E",
      color: "#F5E8C0",
      shadow: "0 5px 0 #0A0804",
      shadowPressed: "0 2px 0 #0A0804",
    },
    ghost: {
      background: "#F0DCA0",
      border: "3px solid #2C1A0E",
      color: "#2C1A0E",
      shadow: "0 5px 0 #2C1A0E",
      shadowPressed: "0 2px 0 #2C1A0E",
    },
  };

  const v = variants[variant] || variants.green;

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
        background: disabled ? "#B0A080" : v.background,
        border: v.border,
        borderRadius: "24px",
        boxShadow: pressed ? v.shadowPressed : v.shadow,
        padding: "13px 24px",
        color: disabled ? "#7A6A50" : v.color,
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
