/**
 * testRaffle.js — Script de prueba de rifas multi-wallet
 * ArepaPay · Avalanche Fuji Testnet
 *
 * Requisitos: Node 18+ (ethers ya instalado en el frontend)
 *
 * USO:
 *   # Paso 1: Owner baja threshold a 4 y hace 4 pagos (abre la rifa)
 *   PRIVATE_KEY=0x... node scripts/testRaffle.js setup
 *
 *   # Paso 2: Cada wallet entra a la rifa con N tickets
 *   PRIVATE_KEY=0x<wallet1> node scripts/testRaffle.js enter 2
 *   PRIVATE_KEY=0x<wallet2> node scripts/testRaffle.js enter 1
 *   PRIVATE_KEY=0x<wallet3> node scripts/testRaffle.js enter 3
 *
 *   # Paso 3: Ver estado actual de la rifa
 *   node scripts/testRaffle.js status
 *
 *   # Paso 4: Owner sortea los 3 ganadores
 *   PRIVATE_KEY=0x<owner> node scripts/testRaffle.js draw
 *
 *   # Paso extra: Mintear USDT de prueba a una wallet
 *   PRIVATE_KEY=0x<owner> node scripts/testRaffle.js mint 0x<wallet> 100
 */

import { ethers } from "ethers";

// ── Red ───────────────────────────────────────────────────────────────────────
const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// ── Contratos en Fuji Testnet ─────────────────────────────────────────────────
const ADDR = {
  usdt:             "0xCFEfB29Bd69C0af628A1D206c366133629011820",
  paymentProcessor: "0xb10EE9c97Db6be098406618c2088eAC87e994483",
  raffle:           "0x3c25B5E7C32f258932071801Ea200BbDdd3A1CC0",
  rewardTicket:     "0x5430B7598ea098eB2E217bebda1406805f142aEf",
};

// ── Comercios verificados ─────────────────────────────────────────────────────
const MERCHANTS = [
  { name: "Panaderia El Arepazo", address: "0x9bEDc23e74204Ab4507a377ab5B59A7B7265a6c5" },
  { name: "Botellones El Mono",   address: "0xc79D59461fC9deF5C725b2272174230cd88Cd621" },
  { name: "Perros Juancho",       address: "0xeB484FaA415111198E2abcd79B286CAE7A4FfD8A" },
  { name: "La Bodega",            address: "0x07727f6710C01f2f075284Fc5FCCb05BaB3A48c2" },
];

// ── ABIs mínimos ──────────────────────────────────────────────────────────────
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount)",
];

const PAYMENT_ABI = [
  "function payMerchant(address merchant, uint256 amount) external",
];

const RAFFLE_ABI = [
  "function getRaffleState() view returns (uint256 txCount, uint256 txThreshold, uint256 currentRound, bool isOpen, uint256 totalStaked, uint256 participantCount, address[3] winners, uint256 winnersCount, bool drawn, string prize)",
  "function myStake(address user) view returns (uint256)",
  "function setThreshold(uint256 _threshold) external",
  "function enter(uint256 amount) external",
  "function draw() external",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getSigner() {
  const pk = process.env.PRIVATE_KEY;
  if (!pk) {
    console.error("❌ Falta PRIVATE_KEY. Ejecuta:\n   export PRIVATE_KEY=0xtu_clave");
    process.exit(1);
  }
  return new ethers.Wallet(pk, provider);
}

function fmt(wei, dec = 18) {
  return parseFloat(ethers.formatUnits(wei, dec)).toFixed(2);
}

async function printStatus(label = "ESTADO ACTUAL", walletAddr = null) {
  const raffle = new ethers.Contract(ADDR.raffle, RAFFLE_ABI, provider);
  const ticket = new ethers.Contract(ADDR.rewardTicket, ERC20_ABI, provider);
  const usdt   = new ethers.Contract(ADDR.usdt, ERC20_ABI, provider);

  const s = await raffle.getRaffleState();
  const [txCount, threshold, round, isOpen, totalStaked, participants, winners, winnersCount, drawn, prize] = s;

  console.log(`\n${"═".repeat(50)}`);
  console.log(`  ${label}`);
  console.log(`${"═".repeat(50)}`);
  console.log(`  Pagos acumulados : ${txCount} / ${threshold}`);
  console.log(`  Ronda actual     : ${round}`);
  console.log(`  Rifa abierta     : ${isOpen ? "✅ SÍ" : "❌ NO"}`);
  console.log(`  Premio           : ${prize || "(sin rifa activa)"}`);
  console.log(`  Participantes    : ${participants}`);
  console.log(`  Tickets en juego : ${totalStaked}`);
  console.log(`  Sorteada         : ${drawn}`);

  if (walletAddr) {
    const myTickets = await ticket.balanceOf(walletAddr);
    const myUsdt    = await usdt.balanceOf(walletAddr);
    const myStake   = await raffle.myStake(walletAddr);
    console.log(`  ── Tu wallet ─────────────────────────────`);
    console.log(`  Dirección        : ${walletAddr}`);
    console.log(`  USDT             : ${fmt(myUsdt)}`);
    console.log(`  Tickets          : ${myTickets}`);
    console.log(`  Apostados        : ${myStake}`);
    if (isOpen && totalStaked > 0n && myStake > 0n) {
      const pct = (Number(myStake) / Number(totalStaked) * 100).toFixed(1);
      console.log(`  Tu probabilidad  : ${pct}%`);
    }
  }

  if (drawn && winnersCount > 0n) {
    const medals = ["🥇", "🥈", "🥉"];
    console.log(`\n  ── Ganadores ─────────────────────────────`);
    for (let i = 0; i < Number(winnersCount); i++) {
      const addr = winners[i];
      if (addr !== ethers.ZeroAddress) {
        console.log(`  ${medals[i]} ${addr}`);
      }
    }
  }
  console.log(`${"═".repeat(50)}\n`);
}

// ── COMANDOS ──────────────────────────────────────────────────────────────────

// setup: baja threshold a 4 y hace 4 pagos para abrir la rifa
async function setup() {
  const signer = getSigner();
  console.log(`\n🚀 Setup rifa de prueba`);
  console.log(`   Wallet: ${signer.address}`);

  await printStatus("ANTES DEL SETUP", signer.address);

  const raffle  = new ethers.Contract(ADDR.raffle, RAFFLE_ABI, signer);
  const payment = new ethers.Contract(ADDR.paymentProcessor, PAYMENT_ABI, signer);
  const usdt    = new ethers.Contract(ADDR.usdt, ERC20_ABI, signer);
  const amount  = ethers.parseEther("1"); // 1 USDT por pago

  // Bajar threshold a 4
  console.log("⚙️  Bajando threshold a 4...");
  const tx0 = await raffle.setThreshold(4);
  await tx0.wait();
  console.log("✅ Threshold = 4");

  // Aprobar 10 USDT al PaymentProcessor
  console.log("🔐 Aprobando USDT al PaymentProcessor...");
  const tx1 = await usdt.approve(ADDR.paymentProcessor, ethers.parseEther("10"));
  await tx1.wait();
  console.log("✅ Aprobado");

  // 4 pagos
  for (let i = 0; i < 4; i++) {
    const merchant = MERCHANTS[i % MERCHANTS.length];
    process.stdout.write(`💸 Pago ${i + 1}/4 → ${merchant.name}... `);
    const tx = await payment.payMerchant(merchant.address, amount);
    await tx.wait();
    console.log("✅");
  }

  await printStatus("DESPUÉS DE 4 PAGOS", signer.address);
  console.log("🎰 La rifa debería estar abierta. Cada wallet puede entrar con /enter N");
}

// enter: apuesta N tickets en la rifa activa
async function enter(numTickets) {
  numTickets = parseInt(numTickets || "1");
  if (isNaN(numTickets) || numTickets < 1) {
    console.error("❌ Número de tickets inválido. Ej: node testRaffle.js enter 2");
    process.exit(1);
  }

  const signer = getSigner();
  const raffle = new ethers.Contract(ADDR.raffle, RAFFLE_ABI, signer);
  const ticket = new ethers.Contract(ADDR.rewardTicket, ERC20_ABI, signer);

  const balance = await ticket.balanceOf(signer.address);
  console.log(`\n🎟️  Wallet: ${signer.address}`);
  console.log(`   Tickets disponibles: ${balance}`);

  if (balance < BigInt(numTickets)) {
    console.error(`❌ No tienes suficientes tickets (tienes ${balance}, necesitas ${numTickets})`);
    console.log("💡 Tip: Haz pagos a comercios para ganar tickets, o pídele al owner que te los mintee.");
    process.exit(1);
  }

  console.log(`⏳ Apostando ${numTickets} ticket(s)...`);
  const tx = await raffle.enter(BigInt(numTickets));
  await tx.wait();
  console.log(`✅ ¡Entraste a la rifa con ${numTickets} ticket(s)!`);

  await printStatus("ESTADO DESPUÉS DE ENTRAR", signer.address);
}

// draw: owner sortea los ganadores
async function draw() {
  const signer = getSigner();
  const raffle = new ethers.Contract(ADDR.raffle, RAFFLE_ABI, signer);

  const s = await raffle.getRaffleState();
  const [,,,isOpen,, participants,,,drawn] = s;

  if (!isOpen) {
    console.error("❌ No hay rifa abierta. Ejecuta primero: node testRaffle.js setup");
    process.exit(1);
  }
  if (drawn) {
    console.error("❌ Esta rifa ya fue sorteada.");
    process.exit(1);
  }
  if (participants === 0n) {
    console.error("❌ No hay participantes. Que las wallets entren primero.");
    process.exit(1);
  }

  console.log(`\n🎲 Sorteando con ${participants} participante(s)...`);
  const tx = await raffle.draw();
  await tx.wait();
  console.log("✅ ¡Sorteo completado!");

  await printStatus("RESULTADO DEL SORTEO");
}

// mint: owner mintea USDT a una wallet para pruebas
async function mint(toAddr, amount) {
  if (!ethers.isAddress(toAddr)) {
    console.error("❌ Dirección inválida.");
    process.exit(1);
  }
  amount = parseFloat(amount || "100");
  const signer = getSigner();
  const usdt   = new ethers.Contract(ADDR.usdt, ERC20_ABI, signer);

  console.log(`\n💵 Minteando ${amount} USDT a ${toAddr}...`);
  const tx = await usdt.mint(toAddr, ethers.parseEther(amount.toString()));
  await tx.wait();
  const bal = await usdt.balanceOf(toAddr);
  console.log(`✅ Nuevo saldo USDT: ${fmt(bal)}`);
}

// ── Entry point ───────────────────────────────────────────────────────────────
const [,, cmd, arg1, arg2] = process.argv;

switch (cmd) {
  case "setup":  await setup();              break;
  case "enter":  await enter(arg1);          break;
  case "draw":   await draw();               break;
  case "status": await printStatus();        break;
  case "mint":   await mint(arg1, arg2);     break;
  default:
    console.log(`
🫓 ArepaPay — Script de prueba de rifas

Comandos disponibles:
  node scripts/testRaffle.js setup              # Owner: baja threshold a 4, hace 4 pagos
  node scripts/testRaffle.js enter <N>          # Wallet: apuesta N tickets
  node scripts/testRaffle.js draw               # Owner: sortea 3 ganadores
  node scripts/testRaffle.js status             # Ver estado actual de la rifa
  node scripts/testRaffle.js mint <addr> <amt>  # Owner: mintear USDT de prueba

Ejemplo completo:
  export PRIVATE_KEY=0x<owner>
  node scripts/testRaffle.js setup

  export PRIVATE_KEY=0x<wallet1>
  node scripts/testRaffle.js enter 2

  export PRIVATE_KEY=0x<wallet2>
  node scripts/testRaffle.js enter 1

  export PRIVATE_KEY=0x<owner>
  node scripts/testRaffle.js draw
    `);
}
