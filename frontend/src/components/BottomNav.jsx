const tabs = [
  { id: "home",      emoji: "🏠", label: "Inicio"    },
  { id: "send",      emoji: "📤", label: "Enviar"    },
  { id: "receive",   emoji: "📥", label: "Recibir"   },
  { id: "merchants", emoji: "🏪", label: "Comercios" },
  { id: "raffles",   emoji: "🎰", label: "Rifas"     },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: "420px",
      background: "#2C1A0E",
      borderTop: "3px solid #0A0804",
      display: "flex",
      height: "64px",
      zIndex: 100
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              background: isActive ? "#3E2510" : "transparent",
              border: "none",
              borderTop: isActive ? "3px solid #78C040" : "3px solid transparent",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              padding: "6px 0",
              transition: "background 0.1s"
            }}
          >
            <span style={{ fontSize: "18px", lineHeight: 1 }}>{tab.emoji}</span>
            <span style={{
              fontSize: "10px",
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#78C040" : "#A08060",
              fontFamily: "Inter, sans-serif"
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
