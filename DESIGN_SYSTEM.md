# 🎨 DESIGN SYSTEM — ArepaPay
> Archivo de referencia de diseño. Leer SIEMPRE antes de construir cualquier pantalla o componente.
> Estilo: Pixel art venezolano — RPG cálido, retro, inclusivo.
> Referencias: imágenes de juego RPG pixel art con inventario y botones de torneo.

---

## 🎨 PALETA DE COLORES

```js
// Fondos — estilo pergamino/parchment del RPG
BG_PARCHMENT:  "#F5E8C0"   // fondo principal — pergamino cálido
BG_CARD:       "#E8D5A0"   // tarjetas y paneles
BG_CARD_DARK:  "#D4B87A"   // borde interno de tarjetas
BG_DARK:       "#2C1A0E"   // café oscuro — bordes gruesos, texto importante
BG_PANEL:      "#F0DCA0"   // panel interior

// Botones verdes — EXACTAMENTE como los botones de torneo del RPG
BTN_GREEN:      "#78C040"   // verde principal del botón
BTN_GREEN_LIGHT:"#A8E060"   // highlight superior del botón
BTN_GREEN_DARK: "#508020"   // verde oscuro — sombra inferior
BTN_GREEN_SHADOW:"#3A5A10"  // sombra sólida bajo el botón

// Texto
TEXT_DARK:   "#2C1A0E"   // café oscuro — todo texto principal
TEXT_MID:    "#6B4A2A"   // café medio — subtítulos
TEXT_LIGHT:  "#F5E8C0"   // crema — texto sobre fondos oscuros/verdes

// Acento venezolano
ORANGE:      "#D4842A"   // naranja arepa — balance principal
ORANGE_DARK: "#8B5E3C"   // sombra naranja
YELLOW:      "#FFD100"   // bandera VE
RED_VE:      "#CC0001"   // bandera VE

// Estados
SUCCESS:     "#78C040"   // mismo verde del botón
ERROR:       "#CC2222"
```

---

## 📐 ESPACIADO Y BORDES — ESTILO PIXEL RPG

```js
// REGLA DE ORO: todos los bordes son SÓLIDOS y GRUESOS, sin blur
MAX_WIDTH:        "420px"        // mobile-first
BORDER_THICK:     "3px solid #2C1A0E"   // borde principal de tarjetas y botones
BORDER_THIN:      "2px solid #2C1A0E"   // borde secundario
BORDER_RADIUS_CARD: "10px"              // tarjetas y paneles
BORDER_RADIUS_BTN:  "24px"             // botones pill como el RPG
SHADOW_BTN:       "0 4px 0 #2C1A0E"    // sombra sólida ABAJO del botón (efecto 3D)
SHADOW_CARD:      "4px 4px 0px #2C1A0E" // sombra sólida diagonal de tarjeta
PADDING_PAGE:     "0 16px"
PADDING_CARD:     "16px 20px"
```

---

## 🔤 TIPOGRAFÍA

```js
FONT_FAMILY:   "Inter, sans-serif"
FONT_TITLE:    { fontSize: "22px", fontWeight: "900", letterSpacing: "1px", color: "#2C1A0E" }
FONT_BALANCE:  { fontSize: "38px", fontWeight: "bold", color: "#2C1A0E" }
FONT_BTN:      { fontSize: "16px", fontWeight: "bold", color: "#2C1A0E" }
FONT_LABEL:    { fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#6B4A2A" }
FONT_SMALL:    { fontSize: "11px", color: "#6B4A2A" }
```

---

## 🟢 BOTÓN PIXEL RPG (componente PixelButton)

Exactamente como los botones verdes de los screenshots de torneo:

```jsx
// Botón primario — verde pill
{
  background: "linear-gradient(180deg, #A8E060 0%, #78C040 40%, #58A030 100%)",
  border: "3px solid #2C1A0E",
  borderRadius: "24px",
  boxShadow: "0 4px 0 #2C1A0E",           // sombra sólida = efecto 3D
  padding: "14px 24px",
  color: "#2C1A0E",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  width: "100%",
  textAlign: "center",
  activeStyle: { transform: "translateY(2px)", boxShadow: "0 2px 0 #2C1A0E" }  // al presionar
}

// Botón secundario — naranja arepa
{
  background: "linear-gradient(180deg, #F0A050 0%, #D4842A 40%, #A06020 100%)",
  border: "3px solid #2C1A0E",
  borderRadius: "24px",
  boxShadow: "0 4px 0 #2C1A0E",
}
```

---

## 🧩 PANELES / TARJETAS — ESTILO INVENTARIO RPG

```jsx
// Panel principal (como el panel de inventario)
{
  background: "#F0DCA0",
  border: "3px solid #2C1A0E",
  borderRadius: "10px",
  boxShadow: "4px 4px 0px #2C1A0E",
  padding: "16px 20px"
}

// Panel de balance (fondo naranja, estilo especial)
{
  background: "linear-gradient(180deg, #F0A050 0%, #D4842A 100%)",
  border: "3px solid #2C1A0E",
  borderRadius: "10px",
  boxShadow: "4px 4px 0px #2C1A0E",
}

// Header de panel (título con fondo más oscuro)
{
  background: "#D4B87A",
  borderBottom: "3px solid #2C1A0E",
  padding: "10px 20px",
  borderRadius: "8px 8px 0 0"
}
```

---

## 📱 LAYOUT MÓVIL

```
+-------------------+
|  HEADER (café)    |  ← sticky top, fondo BG_DARK con borde café
+-------------------+
|                   |
|  BG_PARCHMENT     |  ← scrollable, fondo pergamino
|  tarjetas con     |
|  borde café       |
|                   |
+-------------------+
|  BOTTOM NAV       |  ← fixed bottom, BG_DARK, borde top café
+-------------------+
```

---

## 🫓 IDENTIDAD Y TONO

- Logo: 🫓 siempre presente
- Nombre: **AREPAPAY** — bold, letterSpacing
- Tono: venezolano, cercano, sin jerga crypto
- Palabras clave UI: "Tu saldo", "Enviar", "Recibir" — nunca "wallet", "token", "gas"
- Tickets → siempre 🎟️ Tickets

---

## 📋 CHECKLIST ANTES DE HACER UN COMPONENTE

- [ ] ¿Botones son pill verde con borde café y sombra sólida?
- [ ] ¿Paneles tienen borde café grueso y sombra diagonal sólida?
- [ ] ¿Fondo es pergamino (#F5E8C0)?
- [ ] ¿Funciona en 375px (iPhone SE)?
- [ ] ¿Los números no rompen el layout?
- [ ] ¿Tiene BottomNav fijo?
