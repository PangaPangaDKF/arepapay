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
      background: "#1B2A6B",
      display: "flex",
      height: "64px",
      borderTop: "3px solid #0D1A45",
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
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              padding: "8px 0"
            }}
          >
            <span style={{ fontSize: "20px", lineHeight: 1 }}>{tab.emoji}</span>
            <span style={{
              fontSize: "10px",
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#D4842A" : "#A0B0E0",
              fontFamily: "Inter, sans-serif"
            }}>
              {tab.label}
            </span>
            {isActive && (
              <div style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#D4842A",
                marginTop: "1px"
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
