/* ============================================================
   GYM BRO TYCOON: HYPERTROPHY IDLE
   VireLabs — Production JavaScript (Vanilla ES6+)
   ============================================================ */

'use strict';

// ─────────────────────────────────────────────────────────────
// § CONSTANTS & DATA
// ─────────────────────────────────────────────────────────────

const SAVE_KEY   = 'gbt_save_v1';
const SAVE_EVERY = 5000; // ms

/** Character evolution stages */
const STAGES = [
  { id: 0, name: 'FLACO',           emoji: '🧍', desc: 'Apenas pisa el gym',          color: '#888888', aura: 0 },
  { id: 1, name: 'PRINCIPIANTE',    emoji: '🏃', desc: 'Empieza a ver resultados',     color: '#39FF14', aura: 1 },
  { id: 2, name: 'GYM BRO',        emoji: '💪', desc: 'Ya sabe lo que hace',          color: '#39FF14', aura: 2 },
  { id: 3, name: 'AESTHETIC',       emoji: '🏋️', desc: 'Proporcionado y definido',    color: '#00E5FF', aura: 3 },
  { id: 4, name: 'VOLUMEN GUARRO',  emoji: '🐂', desc: 'La báscula es su dios',       color: '#FFE600', aura: 4 },
  { id: 5, name: 'CLASSIC PHYSIQUE',emoji: '🥇', desc: 'Clásico como los 70s',        color: '#FFE600', aura: 5 },
  { id: 6, name: 'OPEN BODYBUILDER',emoji: '🦁', desc: 'Masa pura e imponente',       color: '#FF8C00', aura: 6 },
  { id: 7, name: 'MUTANTE IFBB',   emoji: '🧬', desc: 'Más allá de lo humano',       color: '#FF4C4C', aura: 7 },
];

/** PM thresholds to unlock each stage (in PM) */
const STAGE_THRESHOLDS = [0, 500, 5000, 50000, 500000, 5e6, 50e6, 500e6];

/** Click upgrades */
const CLICK_UPGRADES = [
  { id: 'magnesio',   name: 'Magnesio',       icon: '🧪', desc: '+0.5 PM/click por nivel', baseCost: 15,   baseProd: 0.5,  maxLevel: 50 },
  { id: 'munequeras', name: 'Muñequeras',     icon: '🩹', desc: '+1 PM/click por nivel',   baseCost: 50,   baseProd: 1,    maxLevel: 50 },
  { id: 'guantes',    name: 'Guantes',        icon: '🧤', desc: '+2 PM/click por nivel',   baseCost: 150,  baseProd: 2,    maxLevel: 50 },
  { id: 'preworkout', name: 'PreWorkout',     icon: '⚡', desc: '+5 PM/click por nivel',   baseCost: 500,  baseProd: 5,    maxLevel: 30 },
  { id: 'cinturon',   name: 'Cinturón',       icon: '🥋', desc: '+12 PM/click por nivel',  baseCost: 2000, baseProd: 12,   maxLevel: 25 },
  { id: 'tecnica',    name: 'Técnica Perfecta',icon: '🎯',desc: '+30 PM/click por nivel',  baseCost: 8000, baseProd: 30,   maxLevel: 20 },
  { id: 'coach',      name: 'Coach Personal', icon: '👨‍🏫',desc: '+80 PM/click por nivel',  baseCost: 35000,baseProd: 80,   maxLevel: 15 },
];

/** Idle upgrades */
const IDLE_UPGRADES = [
  { id: 'proteina',   name: 'Proteína',       icon: '🥛', desc: '+1 PM/s por nivel',     baseCost: 20,   baseProd: 1,     maxLevel: 999 },
  { id: 'creatina',   name: 'Creatina',       icon: '💊', desc: '+3 PM/s por nivel',     baseCost: 80,   baseProd: 3,     maxLevel: 999 },
  { id: 'polloarroz', name: 'Pollo con Arroz',icon: '🍗', desc: '+8 PM/s por nivel',     baseCost: 300,  baseProd: 8,     maxLevel: 999 },
  { id: 'mealprep',   name: 'Meal Prep',      icon: '🥡', desc: '+20 PM/s por nivel',    baseCost: 1200, baseProd: 20,    maxLevel: 500 },
  { id: 'gympropio',  name: 'Gimnasio Propio',icon: '🏛️', desc: '+60 PM/s por nivel',   baseCost: 5000, baseProd: 60,    maxLevel: 200 },
  { id: 'patrocinador',name:'Patrocinador',   icon: '💰', desc: '+200 PM/s por nivel',   baseCost: 25000,baseProd: 200,   maxLevel: 100 },
  { id: 'cocineros',  name: 'Equipo Cocineros',icon:'👨‍🍳',desc: '+750 PM/s por nivel',  baseCost: 120000,baseProd:750,   maxLevel: 75  },
  { id: 'fabrica',    name: 'Fábrica Suplementos',icon:'🏭',desc:'+3000 PM/s por nivel', baseCost:600000, baseProd:3000,  maxLevel: 50  },
];

/** Mission definitions */
const MISSIONS_DEF = [
  { id: 'm_click100',    name: '100 Repeticiones',    icon: '💪', desc: 'Haz 100 clicks',           reward: 50,    type: 'clicks',      target: 100  },
  { id: 'm_click1k',     name: '1.000 Reps',          icon: '🔥', desc: 'Haz 1.000 clicks',         reward: 200,   type: 'clicks',      target: 1000 },
  { id: 'm_click10k',    name: '10.000 Reps',         icon: '🏆', desc: 'Haz 10.000 clicks',        reward: 2000,  type: 'clicks',      target: 10000},
  { id: 'm_click100k',   name: '100K Reps',           icon: '💎', desc: 'Haz 100.000 clicks',       reward: 50000, type: 'clicks',      target: 100000},
  { id: 'm_buy10',       name: 'Comprador Serio',     icon: '🛒', desc: 'Compra 10 mejoras',        reward: 100,   type: 'totalBought', target: 10   },
  { id: 'm_buy50',       name: 'Adicto al Gear',      icon: '💸', desc: 'Compra 50 mejoras',        reward: 1000,  type: 'totalBought', target: 50   },
  { id: 'm_buy100',      name: 'Todo el Arsenal',     icon: '🎖️', desc: 'Compra 100 mejoras',      reward: 10000, type: 'totalBought', target: 100  },
  { id: 'm_pps100',      name: 'Máquina de Músculo',  icon: '⚙️', desc: 'Genera 100 PM/s',         reward: 5000,  type: 'pps',         target: 100  },
  { id: 'm_pps1k',       name: 'Fábrica de Masa',     icon: '🏭', desc: 'Genera 1.000 PM/s',       reward: 50000, type: 'pps',         target: 1000 },
  { id: 'm_pps10k',      name: 'Imperio del Hierro',  icon: '👑', desc: 'Genera 10.000 PM/s',      reward: 500000,type: 'pps',         target: 10000},
  { id: 'm_stage3',      name: 'Se Nota el Gym',      icon: '💪', desc: 'Alcanza Aesthetic',        reward: 1000,  type: 'stage',       target: 3    },
  { id: 'm_stage5',      name: 'Classic Physique',    icon: '🥇', desc: 'Alcanza Classic Physique', reward: 50000, type: 'stage',       target: 5    },
  { id: 'm_stage7',      name: 'Mutante IFBB',        icon: '🧬', desc: 'Alcanza Mutante IFBB',     reward: 5000000,type:'stage',       target: 7    },
  { id: 'm_prestige1',   name: 'Renacido',            icon: '🔄', desc: 'Haz tu primer Prestigio',  reward: 0,     type: 'prestigeCount',target: 1   },
  { id: 'm_earn1m',      name: 'Millonario Muscular', icon: '💰', desc: 'Gana 1.000.000 PM en total',reward:100000,type: 'totalEarned', target: 1e6  },
];

/** Achievement definitions */
const ACHIEVEMENTS_DEF = [
  { id: 'a_first',    name: 'Primer Rep',     icon: '🏋️', desc: 'Haz tu primer click' },
  { id: 'a_novice',   name: 'Novato',         icon: '🌱', desc: 'Alcanza Principiante' },
  { id: 'a_bro',      name: 'Bro Mode',       icon: '💪', desc: 'Alcanza Gym Bro' },
  { id: 'a_aesthetic',name: 'Aesthetic God',  icon: '✨', desc: 'Alcanza Aesthetic' },
  { id: 'a_bulk',     name: 'Volumen Sucio',  icon: '🐂', desc: 'Alcanza Volumen Guarro' },
  { id: 'a_classic',  name: 'Old School',     icon: '🏆', desc: 'Alcanza Classic Physique' },
  { id: 'a_open',     name: 'Open Class',     icon: '🦁', desc: 'Alcanza Open Bodybuilder' },
  { id: 'a_mutant',   name: '¡Mutante!',      icon: '🧬', desc: 'Alcanza Mutante IFBB' },
  { id: 'a_prestige1',name: 'Renacido',       icon: '🔄', desc: 'Realiza tu primer Prestigio' },
  { id: 'a_prestige5',name: 'Fénix',          icon: '🔥', desc: 'Realiza 5 Prestigios' },
  { id: 'a_click1k',  name: 'Mil Reps',       icon: '1️⃣', desc: '1.000 clicks totales' },
  { id: 'a_click100k',name: 'Centurión',      icon: '💯', desc: '100.000 clicks totales' },
  { id: 'a_shopmax',  name: 'Todo Comprado',  icon: '💸', desc: 'Nivel 10+ en cualquier mejora' },
  { id: 'a_overnight',name: 'Gains Nocturnos',icon: '🌙', desc: 'Regresa con 10.000+ PM offline' },
  { id: 'a_speedrun', name: 'Speedrunner',    icon: '⚡', desc: 'Alcanza Gym Bro en menos de 2 min' },
];

// Prestige threshold (PM needed to unlock prestige option)
const PRESTIGE_THRESHOLD = 1e9; // 1 Billion PM

// ─────────────────────────────────────────────────────────────
// § GAME STATE
// ─────────────────────────────────────────────────────────────

let G = newGameState();

function newGameState() {
  return {
    pm:           0,        // current Muscle Points
    totalEarned:  0,        // lifetime PM earned
    pmPerClick:   1,        // base PM per click (from click upgrades)
    pmPerSec:     0,        // base PM per second (from idle upgrades)
    genes:        0,        // prestige currency
    prestigeCount:0,
    hypertrophyLevel: 1,    // display level, goes up as PM grows
    stage:        0,        // current character stage index
    clicks:       0,        // total clicks ever
    totalBought:  0,        // total upgrades purchased count
    bestClick:    0,        // highest single click
    maxPPS:       0,        // peak PM/s ever reached
    startTime:    Date.now(),
    lastSave:     Date.now(),
    lastTick:     Date.now(),
    // { upgradeId: level }
    clickLevels:  {},
    idleLevels:   {},
    // completed missions/achievements
    missionsCompleted: {},
    achievementsUnlocked: {},
    // stats
    offlineEarned: 0,
  };
}

// ─────────────────────────────────────────────────────────────
// § UTILITY HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Format large numbers with suffixes (K, M, B, T, Qa, Qi, Sx, Sp, Oc, No, Dc)
 */
function fmt(n) {
  if (!isFinite(n) || isNaN(n)) return '0';
  n = Math.floor(n);
  const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];
  let i = 0;
  while (n >= 1000 && i < SUFFIXES.length - 1) { n /= 1000; i++; }
  if (i === 0) return String(Math.floor(n));
  return n.toFixed(2).replace(/\.?0+$/, '') + SUFFIXES[i];
}

/** Format seconds as HH:MM:SS */
function fmtTime(secs) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return [h, m, s].map(v => String(v).padStart(2,'0')).join(':');
}

/** Gene bonus multiplier from genes count */
function geneMult() {
  return 1 + G.genes * 0.05;
}

/** Effective PM/click */
function effectiveClick() {
  let base = 1;
  for (const up of CLICK_UPGRADES) {
    const lvl = G.clickLevels[up.id] || 0;
    base += up.baseProd * lvl;
  }
  return base * geneMult();
}

/** Effective PM/sec */
function effectivePPS() {
  let base = 0;
  for (const up of IDLE_UPGRADES) {
    const lvl = G.idleLevels[up.id] || 0;
    base += up.baseProd * lvl;
  }
  return base * geneMult();
}

/** Cost of next level for an upgrade */
function upgradeCost(baseCost, currentLevel) {
  return Math.ceil(baseCost * Math.pow(1.15, currentLevel));
}

/** Genes obtainable from current run */
function calcGenesToGet() {
  if (G.totalEarned < PRESTIGE_THRESHOLD) return 0;
  return Math.floor(Math.log10(G.totalEarned / PRESTIGE_THRESHOLD) + 1);
}

/** Vibrate if supported */
function vibe(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

// ─────────────────────────────────────────────────────────────
// § SAVE / LOAD
// ─────────────────────────────────────────────────────────────

function saveGame() {
  try {
    G.lastSave = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(G));
  } catch (e) { /* storage might be full */ }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    // Merge into G to handle new fields added in updates
    G = Object.assign(newGameState(), saved);
    // Offline earnings
    const offlineSecs = Math.min((Date.now() - G.lastTick) / 1000, 3600 * 12); // cap 12h
    const earned = effectivePPS() * offlineSecs;
    if (earned > 0) {
      G.pm += earned;
      G.totalEarned += earned;
      G.offlineEarned = earned;
    }
    G.lastTick = Date.now();
  } catch (e) { G = newGameState(); }
}

function exportGame() {
  const encoded = btoa(JSON.stringify(G));
  navigator.clipboard.writeText(encoded).then(() => {
    toast('✅ Partida copiada al portapapeles', 'success');
  }).catch(() => {
    toast('📋 Copia el código del área de texto', 'info');
  });
}

function importGame(code) {
  try {
    const decoded = JSON.parse(atob(code.trim()));
    G = Object.assign(newGameState(), decoded);
    G.lastTick = Date.now();
    saveGame();
    refreshAll();
    toast('✅ Partida importada con éxito', 'success');
  } catch (e) {
    toast('❌ Código de partida inválido', 'warn');
  }
}

function resetGame() {
  localStorage.removeItem(SAVE_KEY);
  G = newGameState();
  refreshAll();
  toast('🗑 Partida reiniciada', 'warn');
}

// ─────────────────────────────────────────────────────────────
// § UI HELPERS
// ─────────────────────────────────────────────────────────────

function toast(msg, type = 'info') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  DOM.toastContainer.prepend(el);
  setTimeout(() => el.remove(), 3000);
}

function showModal(icon, title, body) {
  DOM.modalIcon.textContent  = icon;
  DOM.modalTitle.textContent = title;
  DOM.modalBody.textContent  = body;
  DOM.modalOverlay.classList.remove('hidden');
}

function closeModal() {
  DOM.modalOverlay.classList.add('hidden');
}

function spawnFloatingNumber(x, y, value) {
  const el = document.createElement('div');
  el.className  = 'float-num';
  el.textContent = `+${fmt(value)}`;
  el.style.left = `${x - 30}px`;
  el.style.top  = `${y - 30}px`;
  DOM.floatContainer.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

// ─────────────────────────────────────────────────────────────
// § DOM CACHE
// ─────────────────────────────────────────────────────────────

const DOM = {};

function cacheDom() {
  const ids = [
    'splash', 'splashBar', 'app',
    'pmDisplay', 'ppsDisplay',
    'hypertrophyLevel', 'hypertrophyFill', 'prestigeReady',
    'charEmoji', 'charName', 'charDesc', 'stageAura',
    'chipLevel', 'chipGenes', 'chipBestClick',
    'mainBtn', 'tapPMLabel',
    'shopClickList', 'shopIdleList',
    'panelShop', 'panelPrestige', 'panelMissions', 'panelStats',
    'presGenesCurrent', 'presGenesToGet', 'presBonusTotal', 'prestigeCostNote',
    'btnPrestige',
    'missionsList', 'achievementsList',
    'statsGrid',
    'btnExport', 'btnImport', 'btnReset',
    'importArea', 'btnImportConfirm',
    'floatContainer', 'toastContainer',
    'modalOverlay', 'modalIcon', 'modalTitle', 'modalBody', 'modalClose',
  ];
  ids.forEach(id => { DOM[id] = document.getElementById(id); });
}

// ─────────────────────────────────────────────────────────────
// § SHOP RENDERING
// ─────────────────────────────────────────────────────────────

function buildShopItems() {
  renderShopList('click');
  renderShopList('idle');
}

function renderShopList(type) {
  const upgrades = type === 'click' ? CLICK_UPGRADES : IDLE_UPGRADES;
  const levelsMap = type === 'click' ? G.clickLevels : G.idleLevels;
  const container = type === 'click' ? DOM.shopClickList : DOM.shopIdleList;

  container.innerHTML = '';

  for (const up of upgrades) {
    const lvl   = levelsMap[up.id] || 0;
    const cost  = upgradeCost(up.baseCost, lvl);
    const canBuy= G.pm >= cost;
    const maxed = lvl >= up.maxLevel;

    const item = document.createElement('div');
    item.className = 'shop-item' + (canBuy && !maxed ? ' affordable' : '') + (maxed ? ' maxed' : '');
    item.dataset.id   = up.id;
    item.dataset.type = type;
    item.setAttribute('role', 'listitem');

    const prod = type === 'click'
      ? `+${fmt(up.baseProd * (lvl + 1) * geneMult())} PM/click`
      : `+${fmt(up.baseProd * (lvl + 1) * geneMult())} PM/s`;

    item.innerHTML = `
      <div class="shop-icon">${up.icon}</div>
      <div class="shop-info">
        <div class="shop-name">${up.name}</div>
        <div class="shop-desc">${up.desc}</div>
        <div class="shop-prod">${maxed ? '✅ MÁXIMO' : prod}</div>
      </div>
      <div class="shop-buy">
        <button class="shop-buy-btn" ${maxed ? 'disabled' : ''} aria-label="Comprar ${up.name}">
          ${maxed ? 'MAX' : '💪 ' + fmt(cost)}
        </button>
        <div class="shop-level">Nv.${lvl}</div>
      </div>
    `;

    if (!maxed) {
      item.querySelector('.shop-buy-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        purchaseUpgrade(type, up.id);
      });
    }

    container.appendChild(item);
  }
}

function updateShopAffordability() {
  // Update affordable classes without re-rendering entire list
  const allItems = document.querySelectorAll('.shop-item');
  allItems.forEach(item => {
    const id   = item.dataset.id;
    const type = item.dataset.type;
    const up   = (type === 'click' ? CLICK_UPGRADES : IDLE_UPGRADES).find(u => u.id === id);
    if (!up) return;
    const levelsMap = type === 'click' ? G.clickLevels : G.idleLevels;
    const lvl  = levelsMap[up.id] || 0;
    const cost = upgradeCost(up.baseCost, lvl);
    const maxed= lvl >= up.maxLevel;
    item.classList.toggle('affordable', G.pm >= cost && !maxed);
    const btn = item.querySelector('.shop-buy-btn');
    if (btn && !maxed) btn.textContent = '💪 ' + fmt(cost);
  });
}

// ─────────────────────────────────────────────────────────────
// § PURCHASE LOGIC
// ─────────────────────────────────────────────────────────────

function purchaseUpgrade(type, id) {
  const upgrades  = type === 'click' ? CLICK_UPGRADES : IDLE_UPGRADES;
  const levelsMap = type === 'click' ? G.clickLevels : G.idleLevels;
  const up = upgrades.find(u => u.id === id);
  if (!up) return;

  const lvl  = levelsMap[id] || 0;
  if (lvl >= up.maxLevel) return;

  const cost = upgradeCost(up.baseCost, lvl);
  if (G.pm < cost) { toast('💸 Muscle Points insuficientes', 'warn'); return; }

  G.pm -= cost;
  levelsMap[id] = lvl + 1;
  G.totalBought++;

  vibe(30);
  // rebuild that shop list
  renderShopList(type);
  // re-derive stats
  G.pmPerClick = effectiveClick();
  G.pmPerSec   = effectivePPS();
  updateTapLabel();
  checkMissions();
  checkAchievements();
  toast(`${up.icon} ${up.name} nv.${lvl + 1}`, 'success');
}

// ─────────────────────────────────────────────────────────────
// § PRESTIGE
// ─────────────────────────────────────────────────────────────

function updatePrestigePanel() {
  const genesToGet = calcGenesToGet();
  const canPrestige = G.totalEarned >= PRESTIGE_THRESHOLD;

  DOM.presGenesCurrent.textContent = G.genes;
  DOM.presGenesToGet.textContent   = '+' + genesToGet;
  DOM.presBonusTotal.textContent   = `+${((G.genes + genesToGet) * 5)}%`;
  DOM.btnPrestige.disabled         = !canPrestige;
  DOM.prestigeReady.classList.toggle('hidden', !canPrestige);
  DOM.prestigeCostNote.textContent = canPrestige
    ? `¡Obtendrás ${genesToGet} Gene${genesToGet !== 1 ? 's' : ''}!`
    : `Necesitas ${fmt(PRESTIGE_THRESHOLD)} PM para renacer`;
}

function doPrestige() {
  const genes = calcGenesToGet();
  if (genes <= 0 || G.totalEarned < PRESTIGE_THRESHOLD) return;

  G.genes += genes;
  G.prestigeCount++;

  // Reset run-specific state
  G.pm          = 0;
  G.totalEarned = 0;
  G.clickLevels = {};
  G.idleLevels  = {};
  G.stage       = 0;
  G.pmPerClick  = effectiveClick();
  G.pmPerSec    = effectivePPS();

  vibe([50, 30, 100, 30, 200]);
  toast(`🧬 ¡Renacido! +${genes} Gen${genes !== 1 ? 'es' : ''}. Bonus: +${G.genes * 5}%`, 'success');

  buildShopItems();
  updatePrestigePanel();
  checkMissions();
  checkAchievements();
  refreshAll();
}

// ─────────────────────────────────────────────────────────────
// § MISSIONS
// ─────────────────────────────────────────────────────────────

function getMissionProgress(m) {
  switch (m.type) {
    case 'clicks':        return G.clicks;
    case 'totalBought':   return G.totalBought;
    case 'pps':           return effectivePPS();
    case 'stage':         return G.stage;
    case 'prestigeCount': return G.prestigeCount;
    case 'totalEarned':   return G.totalEarned;
    default: return 0;
  }
}

function checkMissions() {
  let changed = false;
  for (const m of MISSIONS_DEF) {
    if (G.missionsCompleted[m.id]) continue;
    const prog = getMissionProgress(m);
    if (prog >= m.target) {
      G.missionsCompleted[m.id] = true;
      if (m.reward > 0) { G.pm += m.reward; G.totalEarned += m.reward; }
      showModal('🎯', '¡MISIÓN COMPLETADA!', `${m.icon} ${m.name}: ${m.desc}${m.reward > 0 ? `\n+${fmt(m.reward)} PM` : ''}`);
      changed = true;
    }
  }
  if (changed) renderMissions();
}

function renderMissions() {
  const list = DOM.missionsList;
  list.innerHTML = '';

  for (const m of MISSIONS_DEF) {
    const done = !!G.missionsCompleted[m.id];
    const prog = Math.min(getMissionProgress(m), m.target);
    const pct  = Math.min((prog / m.target) * 100, 100);

    const el = document.createElement('div');
    el.className = `mission-item${done ? ' completed' : ''}`;
    el.setAttribute('role', 'listitem');
    el.innerHTML = `
      <div class="mission-icon">${m.icon}</div>
      <div class="mission-info">
        <div class="mission-name">${m.name}</div>
        <div class="mission-desc">${m.desc}</div>
        <div class="mission-progress-wrap">
          <div class="mission-progress-fill" style="width:${pct}%"></div>
        </div>
      </div>
      ${m.reward > 0 ? `<div class="mission-reward">+${fmt(m.reward)} PM</div>` : ''}
      ${done ? '<div class="mission-check">✅</div>' : ''}
    `;
    list.appendChild(el);
  }
}

// ─────────────────────────────────────────────────────────────
// § ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────

function checkAchievements() {
  const unlocks = {
    a_first:    G.clicks >= 1,
    a_novice:   G.stage >= 1,
    a_bro:      G.stage >= 2,
    a_aesthetic:G.stage >= 3,
    a_bulk:     G.stage >= 4,
    a_classic:  G.stage >= 5,
    a_open:     G.stage >= 6,
    a_mutant:   G.stage >= 7,
    a_prestige1:G.prestigeCount >= 1,
    a_prestige5:G.prestigeCount >= 5,
    a_click1k:  G.clicks >= 1000,
    a_click100k:G.clicks >= 100000,
    a_shopmax:  Object.values({...G.clickLevels,...G.idleLevels}).some(v => v >= 10),
    a_overnight:G.offlineEarned >= 10000,
    a_speedrun: G.stage >= 2 && (Date.now() - G.startTime) < 120000,
  };

  for (const [id, cond] of Object.entries(unlocks)) {
    if (cond && !G.achievementsUnlocked[id]) {
      G.achievementsUnlocked[id] = true;
      const ach = ACHIEVEMENTS_DEF.find(a => a.id === id);
      if (ach) {
        showModal('🏆', '¡LOGRO DESBLOQUEADO!', `${ach.icon} ${ach.name}\n${ach.desc}`);
      }
    }
  }
}

function renderAchievements() {
  const list = DOM.achievementsList;
  list.innerHTML = '';

  for (const a of ACHIEVEMENTS_DEF) {
    const unlocked = !!G.achievementsUnlocked[a.id];
    const el = document.createElement('div');
    el.className = `mission-item${unlocked ? ' completed' : ''}`;
    el.setAttribute('role', 'listitem');
    el.innerHTML = `
      <div class="mission-icon" style="${unlocked ? '' : 'filter:grayscale(1);opacity:0.4'}">${a.icon}</div>
      <div class="mission-info">
        <div class="mission-name" style="${unlocked ? '' : 'color:var(--text-dim)'}">${a.name}</div>
        <div class="mission-desc">${unlocked ? a.desc : '???'}</div>
      </div>
      ${unlocked ? '<div class="mission-check">✅</div>' : ''}
    `;
    list.appendChild(el);
  }
}

// ─────────────────────────────────────────────────────────────
// § STATISTICS
// ─────────────────────────────────────────────────────────────

function renderStats() {
  DOM.statsGrid.innerHTML = '';
  const played = (Date.now() - G.startTime) / 1000;
  const stats = [
    { label: 'TIEMPO JUGADO',    val: fmtTime(played) },
    { label: 'CLICKS TOTALES',   val: fmt(G.clicks) },
    { label: 'PM OBTENIDOS',     val: fmt(G.totalEarned) },
    { label: 'PM/S ACTUAL',      val: fmt(effectivePPS()) },
    { label: 'PM/S MÁXIMO',      val: fmt(G.maxPPS) },
    { label: 'MEJOR CLICK',      val: fmt(G.bestClick) },
    { label: 'MEJORAS COMPRADAS',val: G.totalBought },
    { label: 'PRESTIGIOS',       val: G.prestigeCount },
    { label: 'GENES',            val: G.genes },
    { label: 'BONUS GENES',      val: `+${G.genes * 5}%` },
    { label: 'MISIONES',         val: `${Object.keys(G.missionsCompleted).length}/${MISSIONS_DEF.length}` },
    { label: 'LOGROS',           val: `${Object.keys(G.achievementsUnlocked).length}/${ACHIEVEMENTS_DEF.length}` },
  ];
  for (const s of stats) {
    const el = document.createElement('div');
    el.className = 'stat-card';
    el.setAttribute('role', 'listitem');
    el.innerHTML = `
      <div class="stat-card-label">${s.label}</div>
      <div class="stat-card-val">${s.val}</div>
    `;
    DOM.statsGrid.appendChild(el);
  }
}

// ─────────────────────────────────────────────────────────────
// § CHARACTER STAGE
// ─────────────────────────────────────────────────────────────

function updateCharacterStage() {
  // determine stage from totalEarned (lifetime)
  let newStage = 0;
  for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (G.totalEarned >= STAGE_THRESHOLDS[i]) { newStage = i; break; }
  }

  const prevStage = G.stage;
  G.stage = newStage;

  const s = STAGES[newStage];
  DOM.charEmoji.textContent = s.emoji;
  DOM.charName.textContent  = s.name;
  DOM.charDesc.textContent  = s.desc;
  DOM.charName.style.color  = s.color;
  DOM.charName.style.textShadow = `0 0 18px ${s.color}88`;
  DOM.charEmoji.style.filter = `drop-shadow(0 0 12px ${s.color}88)`;

  // Update aura
  DOM.stageAura.className = `stage-aura aura-${s.aura}`;

  // hypertrophy level = scaled version
  const hlvl = Math.max(1, Math.floor(Math.log10(Math.max(G.totalEarned, 1)) * 3 + 1));
  G.hypertrophyLevel = hlvl;
  DOM.hypertrophyLevel.textContent = hlvl;

  // progress bar within stage
  const curThresh  = STAGE_THRESHOLDS[newStage];
  const nextThresh = STAGE_THRESHOLDS[newStage + 1] || curThresh * 10;
  const pct = newStage >= STAGE_THRESHOLDS.length - 1
    ? 100
    : Math.min(100, ((G.totalEarned - curThresh) / (nextThresh - curThresh)) * 100);
  DOM.hypertrophyFill.style.width = pct + '%';

  DOM.chipLevel.textContent     = G.hypertrophyLevel;
  DOM.chipGenes.textContent     = G.genes;
  DOM.chipBestClick.textContent = fmt(G.bestClick);

  // stage change notification
  if (newStage > prevStage) {
    checkAchievements();
    checkMissions();
    vibe([50, 30, 150]);
    toast(`${s.emoji} ¡Has evolucionado a ${s.name}!`, 'success');
  }
}

function updateTapLabel() {
  DOM.tapPMLabel.textContent = `+${fmt(effectiveClick())} PM / click`;
}

// ─────────────────────────────────────────────────────────────
// § MAIN HUD REFRESH
// ─────────────────────────────────────────────────────────────

/** Refresh everything on the screen */
function refreshAll() {
  updateHUD();
  updateCharacterStage();
  buildShopItems();
  updatePrestigePanel();
  renderMissions();
  renderAchievements();
  renderStats();
  updateTapLabel();
}

function updateHUD() {
  DOM.pmDisplay.textContent  = fmt(G.pm);
  DOM.ppsDisplay.textContent = fmt(effectivePPS());
}

// ─────────────────────────────────────────────────────────────
// § GAME LOOP
// ─────────────────────────────────────────────────────────────

let _lastFrame  = 0;
let _frameCount = 0;
let _accTime    = 0;

function gameLoop(now) {
  const dt = Math.min((now - _lastFrame) / 1000, 1); // delta seconds, capped at 1s
  _lastFrame = now;
  _accTime += dt;
  _frameCount++;

  // Idle income every frame
  const pps = effectivePPS();
  const earned = pps * dt;
  if (earned > 0) {
    G.pm         += earned;
    G.totalEarned+= earned;
  }

  // Track max PPS
  if (pps > G.maxPPS) G.maxPPS = pps;

  // HUD update every frame
  updateHUD();

  // Heavier updates at ~4 Hz
  if (_frameCount % 15 === 0) {
    updateCharacterStage();
    updateShopAffordability();
    updatePrestigePanel();
    checkMissions();
  }

  // Auto-save every SAVE_EVERY ms
  if (now - G.lastSave > SAVE_EVERY) saveGame();

  requestAnimationFrame(gameLoop);
}

// ─────────────────────────────────────────────────────────────
// § INPUT HANDLING
// ─────────────────────────────────────────────────────────────

function onMainTap(e) {
  e.preventDefault();
  const gain = effectiveClick();
  G.pm         += gain;
  G.totalEarned+= gain;
  G.clicks++;
  if (gain > G.bestClick) G.bestClick = gain;

  // Floating number
  let x, y;
  if (e.touches && e.touches.length > 0) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    const rect = DOM.mainBtn.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top;
  }
  spawnFloatingNumber(x, y, gain);

  // Character animation
  DOM.charEmoji.classList.remove('tap-anim');
  void DOM.charEmoji.offsetWidth; // reflow to restart
  DOM.charEmoji.classList.add('tap-anim');

  // Haptic
  vibe(15);

  checkAchievements();
}

// ─────────────────────────────────────────────────────────────
// § TAB NAVIGATION
// ─────────────────────────────────────────────────────────────

const PANEL_MAP = {
  shop:     DOM,
  prestige: DOM,
  missions: DOM,
  stats:    DOM,
};

let activeTab = 'shop';

function switchTab(tab) {
  activeTab = tab;
  // Update nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
    btn.setAttribute('aria-selected', btn.dataset.tab === tab);
  });
  // Show/hide panels
  ['panelShop','panelPrestige','panelMissions','panelStats'].forEach(pid => {
    document.getElementById(pid).classList.add('hidden');
  });
  const panelId = {
    shop: 'panelShop', prestige: 'panelPrestige',
    missions: 'panelMissions', stats: 'panelStats',
  }[tab];
  document.getElementById(panelId).classList.remove('hidden');

  // Render fresh data when switching
  if (tab === 'stats')    renderStats();
  if (tab === 'prestige') updatePrestigePanel();
  if (tab === 'missions') { renderMissions(); renderAchievements(); }
}

// Shop sub-tabs
let activeShopTab = 'click';
function switchShopTab(type) {
  activeShopTab = type;
  document.querySelectorAll('[data-shop-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.shopTab === type);
  });
  DOM.shopClickList.classList.toggle('hidden', type !== 'click');
  DOM.shopIdleList.classList.toggle('hidden',  type !== 'idle');
}

// Mission sub-tabs
let activeMissionTab = 'missions';
function switchMissionTab(type) {
  activeMissionTab = type;
  document.querySelectorAll('[data-mission-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.missionTab === type);
  });
  DOM.missionsList.classList.toggle('hidden',      type !== 'missions');
  DOM.achievementsList.classList.toggle('hidden',  type !== 'achievements');
}

// ─────────────────────────────────────────────────────────────
// § EVENT LISTENERS
// ─────────────────────────────────────────────────────────────

function bindEvents() {
  // Main tap button
  DOM.mainBtn.addEventListener('touchstart', onMainTap, { passive: false });
  DOM.mainBtn.addEventListener('click', onMainTap);
  DOM.mainBtn.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') onMainTap(e);
  });

  // Nav tabs
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Header icon buttons → shortcut to tabs
  DOM.btnStats.addEventListener('click',        () => switchTab('stats'));
  DOM.btnMissions.addEventListener('click',     () => switchTab('missions'));
  DOM.btnAchievements.addEventListener('click', () => { switchTab('missions'); switchMissionTab('achievements'); });
  DOM.btnSettings.addEventListener('click',     () => switchTab('stats'));

  // Shop sub-tabs
  document.querySelectorAll('[data-shop-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchShopTab(btn.dataset.shopTab));
  });

  // Mission sub-tabs
  document.querySelectorAll('[data-mission-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchMissionTab(btn.dataset.missionTab));
  });

  // Prestige
  DOM.btnPrestige.addEventListener('click', () => {
    if (DOM.btnPrestige.disabled) return;
    const genes = calcGenesToGet();
    const confirmed = window.confirm(`¿Seguro que quieres renacer?\n\nObtarás ${genes} Gen${genes !== 1 ? 'es' : ''} (+${genes * 5}% bonus permanente).\n\nPerderás todos tus PM y mejoras.`);
    if (confirmed) doPrestige();
  });

  // Save actions
  DOM.btnExport.addEventListener('click', exportGame);
  DOM.btnReset.addEventListener('click', () => {
    const ok = window.confirm('¿Reiniciar la partida? Se perderá todo el progreso. Los backups son recomendables.');
    if (ok) resetGame();
  });
  DOM.btnImport.addEventListener('click', () => {
    DOM.importArea.classList.toggle('hidden');
    DOM.btnImportConfirm.classList.toggle('hidden');
    if (!DOM.importArea.classList.contains('hidden')) DOM.importArea.focus();
  });
  DOM.btnImportConfirm.addEventListener('click', () => {
    importGame(DOM.importArea.value);
    DOM.importArea.classList.add('hidden');
    DOM.btnImportConfirm.classList.add('hidden');
    DOM.importArea.value = '';
  });

  // Modal close
  DOM.modalClose.addEventListener('click', closeModal);
  DOM.modalOverlay.addEventListener('click', (e) => {
    if (e.target === DOM.modalOverlay) closeModal();
  });

  // Save on page visibility change and before unload
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { G.lastTick = Date.now(); saveGame(); }
    else {
      // Offline earnings on resume
      const offlineSecs = Math.min((Date.now() - G.lastTick) / 1000, 3600 * 12);
      const earned = effectivePPS() * offlineSecs;
      if (earned > 0) {
        G.pm += earned;
        G.totalEarned += earned;
        G.offlineEarned = earned;
        toast(`😴 +${fmt(earned)} PM mientras dormías`, 'info');
      }
      G.lastTick = Date.now();
    }
  });
  window.addEventListener('beforeunload', () => { G.lastTick = Date.now(); saveGame(); });
  window.addEventListener('pagehide',     () => { G.lastTick = Date.now(); saveGame(); });
}

// ─────────────────────────────────────────────────────────────
// § SPLASH SCREEN
// ─────────────────────────────────────────────────────────────

function runSplash(onDone) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        DOM.splash.style.opacity = '0';
        setTimeout(() => {
          DOM.splash.classList.add('hidden');
          DOM.app.classList.remove('hidden');
          onDone();
        }, 500);
      }, 200);
    }
    DOM.splashBar.style.width = progress + '%';
  }, 80);
}

// ─────────────────────────────────────────────────────────────
// § OFFLINE NOTIFICATION
// ─────────────────────────────────────────────────────────────

function showOfflineNotification() {
  if (G.offlineEarned >= 1) {
    setTimeout(() => {
      toast(`😴 Ganancias offline: +${fmt(G.offlineEarned)} PM`, 'info');
      if (G.offlineEarned >= 10000) checkAchievements();
      G.offlineEarned = 0;
    }, 1000);
  }
}

// ─────────────────────────────────────────────────────────────
// § PWA SERVICE WORKER REGISTRATION
// ─────────────────────────────────────────────────────────────

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* sw optional */ });
  }
}

// ─────────────────────────────────────────────────────────────
// § BOOT
// ─────────────────────────────────────────────────────────────

function boot() {
  cacheDom();
  loadGame();
  bindEvents();

  runSplash(() => {
    // Initial full render
    refreshAll();
    showOfflineNotification();

    // Start game loop
    _lastFrame = performance.now();
    requestAnimationFrame(gameLoop);

    registerSW();
  });
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
