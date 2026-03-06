# 🎨 DESIGN SYSTEM — ArepaPay
> Archivo de referencia de diseño. Leer SIEMPRE antes de construir cualquier pantalla o componente.
> Estilo: Pixel art venezolano — cálido, retro, inclusivo.

---

## 🎨 PALETA DE COLORES

```js
// Fondos
BG_CREAM:    "#F5F0E8"   // fondo principal — crema cálido
BG_CARD:     "#F0E8D0"   // tarjetas secundarias
BG_DARK:     "#1B2A6B"   // azul marino — header, nav, elementos primarios

// Acción principal
ORANGE:      "#D4842A"   // naranja arepa — balance, CTA principal
ORANGE_DARK: "#8B5E3C"   // sombra del naranja

// Acento venezolano
YELLOW:      "#FFD100"   // bandera VE — amarillo
RED:         "#CC0001"   // bandera VE — rojo
BLUE_FLAG:   "#003087"   // bandera VE — azul

// Texto
TEXT_DARK:   "#1B2A6B"   // titulos, valores importantes
TEXT_MID:    "#6B5B45"   // etiquetas, subtitulos
TEXT_LIGHT:  "#A0B0E0"   // texto sobre fondo oscuro

// Estados
SUCCESS:     "#2D7A3A"
ERROR:       "#CC2222"
```

---

## 📐 ESPACIADO Y BORDES

```js
// La app es MOBILE-FIRST — máximo 420px de ancho, centrado
MAX_WIDTH:       "420px"
BORDER_RADIUS:   "14px"   // tarjetas
BORDER_RADIUS_SM: "8px"   // botones pequeños
SHADOW:          "4px 4px 0px"  // sombra estilo pixel art — siempre sólida, sin blur
PADDING_PAGE:    "0 20px"
PADDING_CARD:    "20px 24px"
```

---

## 🔤 TIPOGRAFÍA

```js
FONT_FAMILY:   "Inter, sans-serif"
FONT_TITLE:    { fontSize: "28px", fontWeight: "bold", letterSpacing: "2px" }
FONT_BALANCE:  { fontSize: "42px", fontWeight: "bold" }
FONT_LABEL:    { fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }
FONT_BODY:     { fontSize: "14px" }
FONT_SMALL:    { fontSize: "12px" }
```

---

## 🧩 COMPONENTES BASE

### Tarjeta principal (balance)
- Fondo: ORANGE
- Sombra: `4px 4px 0px #8B5E3C`
- Texto valor: blanco, 42px, bold
- Etiqueta: #FFD9A0 (crema anaranjado)

### Tarjeta secundaria (tickets, info)
- Fondo: BG_CARD (#F0E8D0)
- Sombra: `4px 4px 0px #C8B898`
- Borde: ninguno

### Botón primario
- Fondo: BG_DARK (#1B2A6B)
- Texto: blanco
- Sombra: `3px 3px 0px #0D1A45`
- Hover: transform scale(0.98)

### Botón acción (grid 2x2)
- Fondo: blanco o BG_DARK
- Borde: `2px solid #E8DCC8`
- Sombra: `3px 3px 0px #C8B898`
- Emoji grande + label abajo

### Navegación inferior (BottomNav)
- Fondo: BG_DARK (#1B2A6B)
- Íconos activos: ORANGE (#D4842A)
- Íconos inactivos: TEXT_LIGHT (#A0B0E0)
- Altura: 64px fija
- 5 tabs: Inicio | Enviar | Recibir | Comercios | Rifas

---

## 📱 LAYOUT MÓVIL

```
+-------------------+
|      HEADER       |  ← fijo arriba, BG_DARK
+-------------------+
|                   |
|   CONTENIDO       |  ← scrollable, BG_CREAM
|   (tarjetas,      |
|    acciones)      |
|                   |
+-------------------+
|    BOTTOM NAV     |  ← fijo abajo, BG_DARK, 64px
+-------------------+
```

**Regla importante:** La tarjeta de balance NO debe expandirse según el número — usar `min-width` fijo y fuente que no cambie el layout.

---

## 🫓 IDENTIDAD Y TONO

- Logo: 🫓 (arepa emoji) — siempre presente en el header
- Nombre: **AREPAPAY** en mayúsculas con letterSpacing
- Tagline: "La arepa es venezolana. 🇻🇪"
- Tono UI: venezolano, cercano, sin jerga crypto
- Usar palabras como "Tu saldo", "Enviar", "Recibir" — nunca "wallet", "token", "gas"
- Los tickets se llaman siempre 🎟️ Tickets o 🫓 Tickets

---

## 🖼️ REFERENCIAS VISUALES
- Pixel art: bordes sólidos, sombras sin blur, colores planos
- Estilo como imagen de banner ArepaPay: texto bold azul marino sobre crema
- Íconos pixel art de comida venezolana como referencia de paleta cálida
- Checkered red/white como acento decorativo (no overuse)

---

## 📋 CHECKLIST ANTES DE HACER UN COMPONENTE
- [ ] ¿Funciona en 375px de ancho? (iPhone SE)
- [ ] ¿Los números no rompen el layout?
- [ ] ¿Sombras son sólidas (sin blur)?
- [ ] ¿El texto es legible en BG_CREAM y BG_DARK?
- [ ] ¿Tiene bottom nav fijo?
- [ ] ¿El header tiene logo 🫓 + AREPAPAY?
