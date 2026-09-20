'use strict';
(() => {
const $ = (id) => document.getElementById(id);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (array) => array[Math.floor(Math.random() * array.length)];
const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
const formatTime = (time) =>
  `${Math.floor(time / 60).toString().padStart(2, '0')}:${Math.floor(
    time % 60,
  )
    .toString()
    .padStart(2, '0')}`;
const COLLEGES = {
  as: 'Arts & Sciences',
  en: 'Engineering',
  mg: 'Management',
};
const EFFECTS = {
 power:{glyph:'↗',name:'Power',desc:'+14% attack damage.'},
 haste:{glyph:'»',name:'Tempo',desc:'Fire 12% faster; excess speed becomes damage.'},
 pierce:{glyph:'↠',name:'Piercing',desc:'Bolts pierce one more robot; +5% damage.'},
 spread:{glyph:'⋔',name:'Multishot',desc:'Add a side bolt, up to 5 total; +5% damage.'},
 poison:{glyph:'⌬',name:'Corrosion',desc:'Hits corrode robots for +4 damage/sec over 3 seconds.'},
 pulse:{glyph:'◎',name:'Resonance',desc:'Unlock a 7-second shockwave, or add 18 pulse damage.'},
 stun:{glyph:'∴',name:'Disruption',desc:'Your 7-second pulse stuns robots for +0.5 seconds.'},
 slow:{glyph:'❄',name:'Interference',desc:'Hits slow robots by 25%; upgrades extend the effect.'},
 regen:{glyph:'✚',name:'Recovery',desc:'Regenerate +0.5 health/sec; restore 10 health now.'},
 armor:{glyph:'⬡',name:'Resilience',desc:'Improve damage resistance; restore 10 health now.'},
 vitality:{glyph:'♥',name:'Vitality',desc:'+18 maximum health; restore 28 health now.'},
 crit:{glyph:'⌖',name:'Precision',desc:'+8 percentage points critical chance; stronger criticals.'},
 magnet:{glyph:'⊕',name:'Discovery',desc:'+25 pickup radius and +8% EXP from collected loot.'},
 swift:{glyph:'↯',name:'Momentum',desc:'+5% move speed; dash recharges 10% faster.'},
 shield:{glyph:'◇',name:'Protection',desc:'Block one hit every 12 seconds; upgrades shorten recharge.'},
 orbit:{glyph:'◌',name:'Orbit',desc:'Add an orbiting knowledge shard, up to 5; +5 shard damage.'}
};

const ROSTER_DATA = `animal-behavior|Animal Behavior|as|slow|Pack Instinct
anthropology|Anthropology|as|armor|Human Resilience
applied-mathematics|Applied Mathematics|as|pierce|Perfect Trajectory
arabic-arab-world|Arabic & Arab World Studies|as|spread|Resounding Voices
art-design|Art & Design|as|spread|Creative Direction
art-history|Art History|as|shield|Lasting Legacy
biology|Biology|as|regen|Regeneration
biophysics|Biophysics|as|orbit|Living Systems
cell-biology-biochemistry|Cell Biology/Biochemistry|as|poison|Cellular Cascade
chemistry|Chemistry|as|poison|Corrosion
chinese|Chinese|as|pulse|Resonant Expression
classics|Classics & Ancient Mediterranean Studies|as|armor|Ancient Resolve
comparative-digital-humanities|Comparative & Digital Humanities|as|spread|Connected Ideas
computer-science|Computer Science|as|crit|Debug
critical-black-studies|Critical Black Studies|as|power|Transformative Thought
data-science|Data Science|as|crit|Pattern Recognition
early-childhood-education|Early Childhood Education|as|vitality|Foundations of Growth
east-asian-studies|East Asian Studies|as|orbit|Intersecting Worlds
economics|Economics|as|magnet|Knowledge Economy
education|Education|as|magnet|Lifelong Learning
english-creative-writing|English — Creative Writing|as|spread|Plot Twist
english-film-media|English — Film/Media Studies|as|haste|Frame by Frame
english-literary-studies|English — Literary Studies|as|pierce|Close Reading
environmental-geosciences|Environmental Geosciences|as|armor|Earthwork
environmental-science|Environmental Science|as|regen|Ecological Renewal
environmental-studies|Environmental Studies|as|shield|Stewardship
french-francophone|French & Francophone Studies|as|haste|Fluent Expression
geography|Geography|as|swift|Find Your Way
geology|Geology|as|armor|Bedrock
german-studies|German Studies|as|pierce|Critical Inquiry
history|History|as|shield|Lessons Remembered
interdepartmental|Interdepartmental|as|orbit|Shared Knowledge
international-relations|International Relations|as|stun|Diplomatic Pause
italian-studies|Italian Studies|as|regen|Renaissance
japanese|Japanese|as|swift|Flowing Script
latin-american-studies|Latin American Studies|as|power|Collective Voice
liberal-studies|Liberal Studies|as|vitality|An Open Mind
linguistics|Linguistics|as|pulse|Sound Structure
mathematical-economics|Mathematical Economics|as|magnet|Compounding Knowledge
mathematics|Mathematics|as|pierce|Infinite Proof
music-ba|Music — Bachelor of Arts|as|pulse|Resonance
music-bm|Music — Bachelor of Music|as|haste|Allegro
neuroscience|Neuroscience|as|swift|Fast Reflexes
philosophy|Philosophy|as|stun|Socratic Shock
physics|Physics|as|pierce|Momentum Transfer
political-science|Political Science|as|stun|Checks & Balances
psychology|Psychology|as|slow|Cognitive Dissonance
religious-studies|Religious Studies|as|shield|Sanctuary
russian-studies|Russian Studies|as|vitality|Literary Endurance
sociology|Sociology|as|orbit|Strength in Community
spanish|Spanish|as|spread|Many Voices
statistics|Statistics|as|crit|Significant Impact
theatre|Theatre|as|stun|Command the Stage
womens-gender-studies|Women's & Gender Studies|as|power|Challenge the System
accounting|Accounting|mg|magnet|Every Credit Counts
business-analytics|Business Analytics|mg|crit|Weak-Point Analysis
finance|Finance|mg|haste|Compound Returns
management-organizations|Management & Organizations|mg|orbit|Coordinated Effort
markets-innovation-design|Markets, Innovation & Design|mg|spread|Disruptive Ideas
biomedical-engineering|Biomedical Engineering|en|vitality|Second Wind
chemical-engineering|Chemical Engineering|en|poison|Chain Reaction
civil-engineering|Civil Engineering|en|armor|Structural Integrity
computer-engineering|Computer Engineering|en|orbit|Hardware Assist
computer-science-engineering|Computer Science & Engineering|en|haste|Overclock
electrical-engineering|Electrical Engineering|en|pulse|High Voltage
environmental-engineering|Environmental Engineering|en|regen|Restoration Cycle
mechanical-engineering|Mechanical Engineering|en|power|Force Multiplier`;
const MAJORS = ROSTER_DATA.split('\n').map((line) => {
  const [id, name, college, effect, ability] = line.split('|');
  return { id, name, college, effect, ability };
});
function effectIcon(effect) {
 const shapes = {
  power:'<path d="M5 19 19 5M7 5h12v12"/>',haste:'<path d="m5 5 7 7-7 7m7-14 7 7-7 7"/>',pierce:'<path d="M2 12h20m-5-5 5 5-5 5M7 5v14m5-14v14"/>',spread:'<path d="M12 21V4m-4 4 4-4 4 4M12 16 3 7m0 5V7h5m4 9 9-9m-5 0h5v5"/>',
  poison:'<path d="m12 2 9 5v10l-9 5-9-5V7zM8 15l8-6"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="16" r="1"/>',pulse:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M2 6a12 12 0 0 0 0 12M22 6a12 12 0 0 1 0 12"/>',stun:'<path d="m14 2-9 12h6l-1 8 9-13h-6z"/>',slow:'<path d="M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3"/>',
  regen:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M7 12h10"/>',armor:'<path d="m12 2 8 4v7c0 5-8 9-8 9s-8-4-8-9V6zM8 11l3 3 5-5"/>',vitality:'<path d="M12 21S2 15 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 13-10 13z"/>',crit:'<circle cx="12" cy="12" r="7"/><path d="M12 1v7m0 8v7M1 12h7m8 0h7"/><circle cx="12" cy="12" r="1"/>',
  magnet:'<path d="M4 4v10a8 8 0 0 0 16 0V4h-5v10a3 3 0 0 1-6 0V4zM4 9h5m6 0h5"/>',swift:'<path d="m12 3 8 9-8 9m8-9H4M2 6h7M2 18h7"/>',shield:'<path d="m12 2 8 4v7c0 5-8 9-8 9s-8-4-8-9V6zM12 7v10M7 12h10"/>',orbit:'<ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-35 12 12)"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="6" r="2"/>'
 };
 return `<svg viewBox="0 0 24 24" aria-hidden="true">${shapes[effect] || shapes.power}</svg>`;
}
const MAJOR_BY_ID = new Map(MAJORS.map((major) => [major.id, major]));
const SAVE_KEY = 'bucky-spirit-of-academia-v1';
const GAME_ID = 'bucky-spirit-of-academia';
const freshProgress = () => ({
  game: GAME_ID,
  version: 1,
  rosterVersion: '2026-09-18',
  discovered: [],
  mastery: {},
  bestTime: 0,
  bestKills: 0,
  totalKills: 0,
  runs: 0,
  completed: false,
  settings: {
    muted: false,
    music: true,
    sidebarHidden: matchMedia('(max-width:760px)').matches,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  },
});
const MASTERY_NAMES = ['Undiscovered', 'Declared', 'Practiced', 'Mastered'];
const masteryLevel = (id) =>
  progress.mastery[id] || (progress.discovered.includes(id) ? 1 : 0);
const masteryComplete = () =>
  MAJORS.every((major) => masteryLevel(major.id) === 3);
function masteryPips(level) {
  return `<span class="mastery-pips" aria-hidden="true">${[1, 2, 3]
    .map((number) => `<i class="${number <= level ? 'earned' : ''}"></i>`)
    .join('')}</span>`;
}
let progress = freshProgress();
let storageAvailable = true, storageWarning = '', toastTimer = 0;
let state = 'menu', run = null, offered = [], choiceAfter = 0, collectionReturn = 'menu', filterCollege = 'all', pendingImport = null;
const keys = new Set();
let touchVector = {x:0,y:0}, touchPointer = null;
const W = 1200, H = 760, TAU = Math.PI*2;
const WAVE_SECONDS = 20;
const canvas = $('game-canvas'), ctx = canvas.getContext('2d');
const preview = $('preview-canvas'), pctx = preview.getContext('2d');
let view = {w:1200,h:760,scale:1,ox:0,oy:0,dpr:1}, frame = 0, lastFrame = 0, uiClock = 0;

function toast(message, error = false) {
  clearTimeout(toastTimer);
  $('toast').textContent = message;
  $('toast').classList.toggle('error', error);
  $('toast').hidden = false;
  toastTimer = setTimeout(() => ($('toast').hidden = true), 5000);
}
function validateSave(data) {
  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data) ||
    data.game !== GAME_ID ||
    data.version !== 1 ||
    data.rosterVersion !== '2026-09-18'
  ) {
    throw new Error('This is not a compatible Bucky progress file.');
  }
  if (
    !Array.isArray(data.discovered) ||
    data.discovered.length > MAJORS.length ||
    data.discovered.some(
      (id) => typeof id !== 'string' || !MAJOR_BY_ID.has(id),
    ) ||
    new Set(data.discovered).size !== data.discovered.length
  ) {
    throw new Error('The save contains an invalid or duplicate major.');
  }
  for (const [key, max] of Object.entries({
    bestTime: 86400,
    bestKills: 10000000,
    totalKills: 1000000000,
    runs: 10000000,
  })) {
    if (
      !Number.isSafeInteger(data[key]) ||
      data[key] < 0 ||
      data[key] > max
    ) {
      throw new Error('The save contains invalid records.');
    }
  }
  if (data.bestKills > data.totalKills || typeof data.completed !== 'boolean') {
    throw new Error('The save contains inconsistent progress.');
  }
  if (
    !data.settings ||
    typeof data.settings.muted !== 'boolean' ||
    typeof data.settings.reducedMotion !== 'boolean'
  ) {
    throw new Error('The save contains invalid settings.');
  }
  for (const key of ['music', 'sidebarHidden']) {
    if (
      data.settings[key] !== undefined &&
      typeof data.settings[key] !== 'boolean'
    ) {
      throw new Error('The save contains invalid settings.');
    }
  }
  const mastery = {};
  if (data.mastery !== undefined) {
    if (
      !data.mastery ||
      typeof data.mastery !== 'object' ||
      Array.isArray(data.mastery)
    ) {
      throw new Error('The save contains invalid mastery levels.');
    }
    for (const [id, level] of Object.entries(data.mastery)) {
      if (
        !data.discovered.includes(id) ||
        !Number.isInteger(level) ||
        level < 1 ||
        level > 3
      ) {
        throw new Error('The save contains an invalid major mastery level.');
      }
    }
    if (
      data.discovered.some((id) => !Object.hasOwn(data.mastery, id))
    ) {
      throw new Error('The save is missing mastery levels for collected majors.');
    }
  }

  for (const id of data.discovered) {
    mastery[id] = data.mastery?.[id] ?? 1;
  }
  const completed = MAJORS.every((major) => mastery[major.id] === 3);
  return {
    game: GAME_ID,
    version: 1,
    rosterVersion: '2026-09-18',
    discovered: [...data.discovered],
    mastery,
    bestTime: data.bestTime,
    bestKills: data.bestKills,
    totalKills: data.totalKills,
    runs: data.runs,
    completed,
    settings: {
      muted: data.settings.muted,
      music: data.settings.music ?? true,
      sidebarHidden:
        data.settings.sidebarHidden ?? matchMedia('(max-width:760px)').matches,
      reducedMotion: data.settings.reducedMotion,
    },
  };
}
function loadProgress() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) progress = validateSave(JSON.parse(saved));
  } catch {
    storageAvailable = false;
    storageWarning = 'BROWSER SAVE UNAVAILABLE · PLEASE EXPORT';
  }
}
function recordRun() {
  if (!run) return;
  progress.bestTime = Math.max(progress.bestTime, Math.floor(run.time));
  progress.bestKills = Math.max(progress.bestKills, run.kills);
}
function saveProgress() {
  recordRun();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
    storageAvailable = true;
    storageWarning = '';
  } catch {
    storageAvailable = false;
    storageWarning = 'BROWSER SAVE UNAVAILABLE · PLEASE EXPORT';
  }
  $('save-status').textContent = storageWarning || '';
}
function exportProgress() {
  saveProgress();
  const blob = new Blob(
    [JSON.stringify({ ...progress, exportedAt: new Date().toISOString() }, null, 2)],
    { type: 'application/json' },
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bucky-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
  toast('Progress exported. Your collection and records are saved; the active battle is not.');
}
async function importFile(file) {
  if (state !== 'menu' || !file) return;
  try {
    if (file.size > 256000) {
      throw new Error('This file is too large to be a Bucky save.');
    }
    const data = validateSave(JSON.parse(await file.text()));
    if (state !== 'menu') return;
    pendingImport = data;
    $('import-summary').textContent = `${data.discovered.length} / ${MAJORS.length} majors restored · ${Object.values(data.mastery).filter((n) => n === 3).length} mastered · ${data.totalKills.toLocaleString()} total kills · best ${formatTime(data.bestTime)}`;
    const missing = progress.discovered.filter(
      (id) => !data.discovered.includes(id),
    ).length;
    const lowerMastery = progress.discovered.filter(
      (id) => data.discovered.includes(id) && data.mastery[id] < masteryLevel(id),
    ).length;
    $('import-comparison').textContent = missing
      ? `${missing} of your current discoveries are not in this file. Export your current progress first if you want a backup.`
      : `Your current archive has ${progress.discovered.length} restored majors. The selected save is ready to load.`;
    if (lowerMastery) {
      $('import-comparison').textContent += ` ${lowerMastery} collected majors have lower mastery in this file. Export a backup to keep your current mastery.`;
    }
    showDialog('import-dialog');
  } catch (error) {
    pendingImport = null;
    toast(
      error instanceof SyntaxError
        ? 'That file is not valid JSON. Your progress was not changed.'
        : error.message,
      true,
    );
  }
}
function confirmImport() {
  if (!pendingImport || state !== 'menu') return;
  progress = pendingImport;
  pendingImport = null;
  saveProgress();
  applySettings();
  refreshProgress();
  $('import-dialog').close();
  toast('Archive restored. Your next run begins with a fresh combat build.');
}
function openReset() {
  if (state !== 'menu') return;
  $('reset-summary').textContent = `${progress.discovered.length} majors · ${progress.discovered.filter((id) => masteryLevel(id) === 3).length} mastered · ${progress.totalKills.toLocaleString()} total kills · ${progress.runs} runs`;
  showDialog('reset-dialog');
  $('cancel-reset').focus({ preventScroll: true });
}
function resetProgress() {
  if (state !== 'menu' || !$('reset-dialog').open) return;
  const settings = { ...progress.settings };
  run = null;
  offered = [];
  pendingImport = null;
  clearInput();
  closeDialogs();
  Music.stop();
  stopCelebration();
  clearTimeout(toastTimer);
  progress = freshProgress();
  progress.settings = settings;
  saveProgress();
  applySettings();
  refreshProgress();
  $('start-button').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
  toast(
    storageAvailable
      ? 'Progress reset. Your next run starts a new collection.'
      : 'Progress reset for this session. Browser storage is unavailable; the reset may not survive a reload.',
    !storageAvailable,
  );
}
function refreshProgress() {
  const count = progress.discovered.length;
  const total = MAJORS.length;
  const percentage = (count / total) * 100;
  const levels = progress.discovered.map(masteryLevel);
  const masteryCounts = [1, 2, 3].map((level) =>
    levels.filter((currentLevel) => currentLevel === level).length,
  );

  $('home-mastery-count').textContent = `MASTERY ${levels.reduce((sum, level) => sum + level, 0)} / ${total * 3} · ${masteryCounts[2]} MASTERED`;
  masteryCounts.forEach((masteryCount, index) => {
    $('mastery-count-' + (index + 1)).textContent = masteryCount;
  });
  for (const id of ['home-collection-count', 'run-collection-count']) {
    $(id).textContent = `${count} / ${total}`;
  }
  for (const id of [
    'home-collection-bar',
    'run-collection-bar',
    'collection-progress',
  ]) {
    $(id).style.width = `${percentage}%`;
  }
  $('collection-summary').textContent = `${count} of ${total} disciplines restored`;
  $('collection-percent').textContent = `${Math.floor(percentage)}%`;
  $('award-button').hidden = !progress.completed;
  $('victory-count').textContent = progress.completed
    ? `${total} / ${total} DISCIPLINES MASTERED`
    : `${count} / ${total} DISCIPLINES RESTORED`;
  document.querySelectorAll('.roster-total').forEach((element) => {
    element.textContent = total;
  });
  $('save-status').textContent = storageWarning || '';
}
function applySettings() {
  document.body.classList.toggle(
    'reduce-motion',
    progress.settings.reducedMotion,
  );
  if (progress.settings.reducedMotion) stopCelebration();
  $('motion-setting').checked = progress.settings.reducedMotion;
  $('sound-label').textContent = progress.settings.muted
    ? 'SOUND OFF'
    : 'SOUND ON';
  $('sound-button').setAttribute(
    'aria-pressed',
    String(progress.settings.muted),
  );
  $('sound-button').setAttribute(
    'aria-label',
    progress.settings.muted ? 'Enable all sound' : 'Mute all sound',
  );
  $('sound-button').title = progress.settings.muted
    ? 'Enable all sound (M)'
    : 'Mute all sound (M)';
  $('music-label').textContent = progress.settings.music
    ? 'MUSIC ON'
    : 'MUSIC OFF';
  $('music-button').setAttribute(
    'aria-pressed',
    String(progress.settings.music),
  );
  $('music-button').setAttribute(
    'aria-label',
    progress.settings.music
      ? 'Turn background music off'
      : 'Turn background music on',
  );
  $('music-button').title = `Background music: ${progress.settings.music ? 'on' : 'off'}${progress.settings.muted ? ' (all sound muted)' : ''}`;
  $('music-setting').checked = progress.settings.music;
  const sidebarHidden = progress.settings.sidebarHidden;
  $('game-layout').classList.toggle('sidebar-hidden', sidebarHidden);
  $('sidebar-toggle').setAttribute(
    'aria-expanded',
    String(!sidebarHidden),
  );
  $('sidebar-toggle').setAttribute(
    'aria-label',
    sidebarHidden ? 'Show combat sidebar' : 'Hide combat sidebar',
  );
  $('sidebar-toggle').title = sidebarHidden
    ? 'Show sidebar (H)'
    : 'Hide sidebar (H)';
  $('sidebar-label').textContent = sidebarHidden ? 'SHOW PANEL' : 'HIDE PANEL';
  Sound.setMute(progress.settings.muted);
  Music.sync();
  resizeCanvas();
}
const Sound = {
  context: null,
  master: null,
  lastShot: 0,
  unlock() {
    try {
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.gain.value = progress.settings.muted ? 0 : 0.19;
        this.master.connect(this.context.destination);
      }
      if (this.context.state === 'suspended') {
        this.context.resume().catch(() => {});
      }
    } catch {}
  },
  setMute(muted) {
    if (this.master) {
      this.master.gain.setTargetAtTime(
        muted ? 0 : 0.19,
        this.context.currentTime,
        0.02,
      );
    }
  },
  tone(freq, duration = 0.1, type = 'sine', volume = 0.3, slide = 1, delay = 0) {
    if (
      !this.context ||
      this.context.state !== 'running' ||
      progress.settings.muted
    ) {
      return;
    }
    const time = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, time);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(20, freq * slide),
      time + duration,
    );
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  },
  play(name) {
    if (progress.settings.muted) return;
    if (name === 'shot') {
      const now = performance.now();
      if (now - this.lastShot < 100) return;
      this.lastShot = now;
      this.tone(430, 0.07, 'triangle', 0.16, 0.35);
    } else if (name === 'pickup') {
      this.tone(900 + Math.random() * 350, 0.045, 'sine', 0.12, 1.25);
    } else if (name === 'kill') {
      this.tone(160, 0.1, 'triangle', 0.2, 0.22);
    } else if (name === 'hit') {
      this.tone(105, 0.2, 'sawtooth', 0.3, 0.35);
      this.tone(65, 0.15, 'triangle', 0.4, 0.7);
    } else if (name === 'dash') {
      this.tone(140, 0.18, 'sawtooth', 0.13, 3.5);
    } else if (name === 'shield') {
      this.tone(700, 0.18, 'sine', 0.25, 1.5);
    } else if (name === 'pulse') {
      this.tone(110, 0.3, 'triangle', 0.3, 2.4);
    } else if (name === 'level') {
      [440, 554, 659, 880].forEach((frequency, index) =>
        this.tone(frequency, 0.25, 'triangle', 0.35, 1, index * 0.09),
      );
    } else if (name === 'select') {
      this.tone(660, 0.15, 'sine', 0.3, 1);
      this.tone(990, 0.2, 'triangle', 0.25, 1, 0.07);
    } else if (name === 'start') {
      [220, 330, 440].forEach((frequency, index) =>
        this.tone(frequency, 0.2, 'triangle', 0.25, 1, index * 0.09),
      );
    } else if (name === 'over') {
      [330, 261, 196].forEach((frequency, index) =>
        this.tone(frequency, 0.4, 'triangle', 0.3, 0.85, index * 0.18),
      );
    } else if (name === 'victory') {
      [392, 494, 587, 784, 659, 784, 988].forEach((frequency, index) =>
        this.tone(frequency, 0.45, 'triangle', 0.35, 1, index * 0.16),
      );
    }
  },
};

const Music = {
  timer: null,
  bus: null,
  noise: null,
  step: 0,
  next: 0,
  sources: new Set(),
  wanted() {
    return (
      state === 'playing' &&
      progress.settings.music &&
      !progress.settings.muted &&
      !document.hidden &&
      Sound.context?.state === 'running'
    );
  },
  sync() {
    if (!this.wanted()) {
      this.stop();
      return;
    }
    if (this.timer !== null) return;
    const audioContext = Sound.context;
    if (!this.noise) {
      this.noise = audioContext.createBuffer(
        1,
        audioContext.sampleRate * 0.25,
        audioContext.sampleRate,
      );
      const data = this.noise.getChannelData(0);
      for (let index = 0; index < data.length; index++) {
        data[index] = Math.random() * 2 - 1;
      }
    }
    this.bus = audioContext.createGain();
    this.bus.gain.setValueAtTime(0, audioContext.currentTime);
    this.bus.gain.linearRampToValueAtTime(
      0.58,
      audioContext.currentTime + 0.15,
    );
    this.bus.connect(Sound.master);
    this.next = audioContext.currentTime + 0.04;
    this.schedule();
    this.timer = setInterval(() => {
      if (this.wanted()) this.schedule();
      else this.stop();
    }, 25);
  },
  stop() {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    if (!this.bus) return;
    const bus = this.bus;
    const time = Sound.context.currentTime;
    bus.gain.cancelScheduledValues(time);
    bus.gain.setTargetAtTime(0, time, 0.012);
    for (const source of this.sources) {
      try {
        source.stop(time + 0.045);
      } catch {}
    }
    this.sources.clear();
    this.bus = null;
    setTimeout(() => bus.disconnect(), 80);
  },
  voice(freq, time, duration, type, volume, endFreq) {
    const audioContext = Sound.context;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(freq, time);
    if (endFreq) {
      oscillator.frequency.exponentialRampToValueAtTime(
        endFreq,
        time + duration,
      );
    }
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(volume, time + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(gain);
    gain.connect(this.bus);
    this.sources.add(oscillator);
    oscillator.onended = () => {
      this.sources.delete(oscillator);
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(time);
    oscillator.stop(time + duration + 0.01);
  },
  drum(time, duration, volume, frequency) {
    const audioContext = Sound.context;
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    source.buffer = this.noise;
    filter.type = 'highpass';
    filter.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.bus);
    this.sources.add(source);
    source.onended = () => {
      this.sources.delete(source);
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
    source.start(time);
    source.stop(time + duration + 0.01);
  },
  schedule() {
    const now = Sound.context.currentTime;
    const beat = 60 / 128;
    const stepLength = beat / 4;
    if (this.next < now - 0.1) this.next = now + 0.025;
    while (this.next < now + 0.12) {
      const step = this.step % 64;
      const bar = Math.floor(step / 16);
      const subdivision = step % 16;
      const time = this.next;
      const roots = [40, 36, 43, 38];
      const chords = [
        [0, 3, 7, 10],
        [0, 4, 7, 11],
        [0, 4, 7, 12],
        [0, 4, 7, 9],
      ];
      const root = roots[bar];
      const notes = chords[bar];
      const toFrequency = (midiNote) => 440 * 2 ** ((midiNote - 69) / 12);

      if (subdivision % 4 === 0) {
        this.voice(135, time, 0.19, 'sine', 0.9, 42);
      }
      if (subdivision === 4 || subdivision === 12) {
        this.drum(time, 0.13, 0.3, 1400);
        this.voice(185, time, 0.1, 'triangle', 0.16, 75);
      }
      if (subdivision % 2 === 0) {
        this.drum(
          time,
          subdivision % 4 === 2 ? 0.07 : 0.035,
          subdivision % 4 === 2 ? 0.13 : 0.065,
          7500,
        );
      }
      if (subdivision % 2 === 0) {
        this.voice(
          toFrequency(root + (subdivision === 14 ? 7 : 0)),
          time,
          stepLength * 1.5,
          'triangle',
          0.38,
        );
      }
      if (subdivision % 2 === 1) {
        const note =
          root +
          24 +
          notes[[0, 2, 1, 3, 2, 1, 3, 2][Math.floor(subdivision / 2)]];
        this.voice(toFrequency(note), time, 0.15, 'triangle', 0.21);
        this.voice(
          toFrequency(note),
          time + beat * 0.75,
          0.12,
          'sine',
          0.065,
        );
      }
      if (subdivision === 0) {
        for (const interval of notes.slice(0, 3)) {
          this.voice(
            toFrequency(root + 12 + interval),
            time,
            beat * 2.8,
            'sine',
            0.075,
          );
        }
      }
      this.step = (this.step + 1) % 64;
      this.next += stepLength;
    }
  },
};
function showDialog(id) {
  const dialog = $(id);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}
function closeDialogs() {
  document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
}
function clearInput() {
  keys.clear();
  touchVector = { x: 0, y: 0 };
  touchPointer = null;
  $('touch-knob').style.transform = '';
}
function createRun() {
  return {
    time: 0,
    wave: 1,
    bossKills: 0,
    level: 1,
    xp: 0,
    nextXP: 8,
    kills: 0,
    newMajors: [],
    ranks: {},
    effects: {},
    enemies: [],
    bullets: [],
    hostile: [],
    loot: [],
    particles: [],
    rings: [],
    texts: [],
    nextId: 1,
    spawnClock: 0.5,
    shotClock: 0.2,
    pulseClock: 3,
    saveClock: 0,
    shieldClock: 0,
    shieldReady: false,
    shake: 0,
    player: {
      x: W / 2,
      y: H / 2 + 75,
      r: 15,
      hp: 100,
      maxHp: 100,
      dx: 0,
      dy: -1,
      angle: -Math.PI / 2,
      dash: 0,
      dashCD: 0,
      invuln: 1,
    },
    stats: null,
  };
}
function computeStats(runState) {
  const effects = runState.effects;
  const count = (key) => effects[key] || 0;
  return {
    damage:
      18 *
      (1 +
        0.14 * count('power') +
        0.05 * count('pierce') +
        0.05 * count('spread') +
        Math.max(0, count('haste') - 9) * 0.08),
    interval: Math.max(0.13, 0.4 / (1 + 0.12 * count('haste'))),
    speed: 190 * Math.min(1.65, 1 + 0.05 * count('swift')),
    dashCooldown: Math.max(0.85, 2.6 / (1 + 0.1 * count('swift'))),
    maxHp: 100 + 18 * count('vitality'),
    pierce: Math.min(5, count('pierce')),
    shots: Math.min(5, 1 + count('spread')),
    poison: 4 * count('poison'),
    pulse: count('pulse') ? 18 + 18 * count('pulse') : 0,
    pulseRadius: Math.min(245, 125 + 8 * (count('pulse') + count('stun'))),
    stun: Math.min(3, 0.5 * count('stun')),
    slow: count('slow') ? 1.6 + 0.6 * count('slow') : 0,
    regen: 0.5 * count('regen'),
    armor: 1 / (1 + 0.16 * count('armor')),
    crit: Math.min(0.8, 0.06 + 0.08 * count('crit')),
    critPower: 1.8 + 0.08 * count('crit'),
    magnet: Math.min(380, 200 + 25 * count('magnet')),
    xpBonus: 1 + 0.08 * count('magnet'),
    shieldCooldown: Math.max(
      3,
      12 / (1 + 0.25 * Math.max(0, count('shield') - 1)),
    ),
    orbitCount: Math.min(5, count('orbit')),
    orbitRadius: 170,
    orbitDamage: 10 + 5 * count('orbit'),
  };
}
function startRun() {
  clearTimeout(toastTimer);
  $('toast').hidden = true;
  Sound.unlock();
  Music.stop();
  Music.step = 0;
  closeDialogs();
  clearInput();
  run = createRun();
  run.stats = computeStats(run);
  progress.runs++;
  state = 'playing';
  offered = [];
  $('title-page').hidden = true;
  $('footer').hidden = true;
  $('game-view').hidden = false;
  $('top-pause').hidden = false;
  $('sidebar-toggle').hidden = false;
  document.body.classList.add('game-active');
  applySettings();
  refreshProgress();
  refreshLoadout();
  updateHUD();
  resizeCanvas();
  canvas.focus({ preventScroll: true });
  saveProgress();
  Sound.play('start');
  if (!storageAvailable) {
    toast('Browser autosave is unavailable. Export your progress from the pause menu.', true);
  }
}
function pauseGame() {
  if (state !== 'playing') return;
  state = 'paused';
  Music.sync();
  clearInput();
  saveProgress();
  showDialog('pause-dialog');
}
function resumeGame() {
  if (state !== 'paused') return;
  $('pause-dialog').close();
  clearInput();
  state = 'playing';
  canvas.focus({ preventScroll: true });
}
function goHome() {
  recordRun();
  saveProgress();
  closeDialogs();
  clearInput();
  state = 'menu';
  Music.sync();
  run = null;
  offered = [];
  $('title-page').hidden = false;
  $('footer').hidden = false;
  $('game-view').hidden = true;
  $('top-pause').hidden = true;
  $('sidebar-toggle').hidden = true;
  document.body.classList.remove('game-active');
  refreshProgress();
  $('start-button').focus({ preventScroll: true });
}
function endRun(abandoned = false) {
  if (!run || state === 'over' || state === 'victory') return;
  state = 'over';
  clearInput();
  closeDialogs();
  saveProgress();
  Sound.play('over');
  $('result-time').textContent = formatTime(run.time);
  $('result-kills').textContent = run.kills;
  $('result-new').textContent = run.newMajors.length;
  $('result-copy').textContent = abandoned
    ? 'You left the quad. Everything you discovered is safe in the archive.'
    : 'The machines won this round. They can’t take what you’ve learned.';
  $('result-majors').replaceChildren();
  if (!run.newMajors.length) {
    const message = document.createElement('p');
    message.className = 'collection-note';
    message.textContent =
      'No new majors this time. Collect EXP diamonds to discover your next discipline.';
    $('result-majors').append(message);
  } else {
    for (const id of run.newMajors) {
      const tag = document.createElement('span');
      tag.className = 'tag found';
      tag.textContent = MAJOR_BY_ID.get(id).name;
      $('result-majors').append(tag);
    }
  }
  $('result-records').textContent = `PERSONAL BEST ${formatTime(progress.bestTime)} · ${progress.bestKills} KILLS · ${progress.discovered.length}/${MAJORS.length} MAJORS RESTORED · ${Object.values(progress.mastery).filter((level) => level === 3).length}/${MAJORS.length} MASTERED`;
  refreshProgress();
  showDialog('result-dialog');
}
let celebrationTimer = 0;
function stopCelebration() {
  clearTimeout(celebrationTimer);
  $('celebration').replaceChildren();
  $('celebration').classList.remove('active');
}
function startCelebration() {
  stopCelebration();
  const layer = $('celebration');
  if (progress.settings.reducedMotion) return;
  const colors = ['#ff8b49', '#83b6ff', '#f5dca6'];
  for (let index = 0; index < 120; index++) {
    const piece = document.createElement('i');
    piece.className = 'celebration-piece';
    piece.style.setProperty('--start', `${rand(4, 96)}%`);
    piece.style.setProperty('--width', `${rand(3, 6)}px`);
    piece.style.setProperty('--height', `${rand(6, 10)}px`);
    piece.style.setProperty('--piece-color', colors[index % 3]);
    piece.style.setProperty('--drift', `${rand(-35, 35)}px`);
    piece.style.setProperty('--spin', `${rand(-280, 280)}deg`);
    piece.style.setProperty('--duration', `${rand(5.5, 8.5)}s`);
    piece.style.setProperty('--delay', `${rand(0, 2.5)}s`);
    layer.append(piece);
  }
  layer.classList.add('active');
  celebrationTimer = setTimeout(stopCelebration, 11000);
}
function showVictory() {
  state = 'victory';
  Music.sync();
  clearInput();
  closeDialogs();
  saveProgress();
  refreshProgress();
  window.scrollTo({ top: 0, behavior: 'instant' });
  showDialog('victory-dialog');
  $('victory-title').focus({ preventScroll: true });
  $('victory-dialog').scrollTop = 0;
  startCelebration();
  Sound.play('victory');
}
function generateOffers() {
  const missing = MAJORS.filter(
    (major) => !progress.discovered.includes(major.id),
  );
  const cards = [];
  if (missing.length) cards.push(pick(missing));
  while (cards.length < 3) {
    let pool = MAJORS.filter((major) => !cards.includes(major));
    const familiar = pool.filter((major) => run.ranks[major.id]);
    if (familiar.length && Math.random() < 0.55) pool = familiar;
    cards.push(pick(pool));
  }
  for (let index = cards.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
  }
  return cards;
}
function openLevelUp(){
 if(!run||run.xp+1e-8<run.nextXP)return;
 run.xp=Math.max(0,run.xp-run.nextXP);run.level++;run.nextXP=Math.round(8+3*(run.level-1)+Math.pow(run.level-1,1.15));
 state='level';clearInput();offered=generateOffers();choiceAfter=performance.now()+180;
 $('upgrade-level').textContent=run.level;$('upgrade-grid').replaceChildren();
 offered.forEach((m,i)=>{
  const effect=EFFECTS[m.effect],isNew=!progress.discovered.includes(m.id),rank=run.ranks[m.id]||0,b=document.createElement('button');b.className='upgrade-card';b.dataset.major=m.id;
  const mastery=masteryLevel(m.id),next=Math.min(3,mastery+1);
  b.innerHTML=`<div class="upgrade-card-top"><span class="ability-glyph" aria-hidden="true">${effectIcon(m.effect)}</span><span class="tag ${isNew?'new':'found'}">${isNew?'NEW':rank?'RUN +'+(rank+1):'RESTORED'}</span></div><span class="college-label">${COLLEGES[m.college]}</span><h3></h3><span class="ability-name"></span><p></p><div class="mastery-note">${masteryPips(next)}${mastery===3?'MASTERED 3/3':`MASTERY ${mastery} → ${next}/3`}<br>${mastery===3?'Combat upgrade only':MASTERY_NAMES[next]+' · saved across runs'}</div><span class="choose-label">${rank?'STRENGTHEN':'ACQUIRE'} <span><kbd>${i+1}</kbd> ↗</span></span>`;
  b.querySelector('h3').textContent=m.name;b.querySelector('.ability-name').textContent=m.ability;b.querySelector('p').textContent=effect.desc;b.onclick=()=>chooseMajor(m.id);$('upgrade-grid').append(b);
 });
 updateHUD();showDialog('level-dialog');Sound.play('level');
}
function chooseMajor(id) {
  if (state !== 'level' || !offered.some((major) => major.id === id)) return;
  const major = MAJOR_BY_ID.get(id);
  const firstDiscovery = !progress.discovered.includes(id);
  progress.mastery[id] = Math.min(3, masteryLevel(id) + 1);
  run.ranks[id] = (run.ranks[id] || 0) + 1;
  run.effects[major.effect] = (run.effects[major.effect] || 0) + 1;
  run.stats = computeStats(run);
  run.player.maxHp = run.stats.maxHp;
  if (major.effect === 'vitality') {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 28);
  }
  if (major.effect === 'regen' || major.effect === 'armor') {
    run.player.hp = Math.min(run.player.maxHp, run.player.hp + 10);
  }
  if (major.effect === 'shield') {
    run.shieldReady = true;
    run.shieldClock = 0;
  }
  if (firstDiscovery) {
    progress.discovered.push(id);
    run.newMajors.push(id);
  }
  offered = [];
  $('level-dialog').close();
  refreshLoadout();
  refreshProgress();
  Sound.play('select');
  const won = !progress.completed && masteryComplete();
  if (won) progress.completed = true;
  saveProgress();
  if (won) {
    showVictory();
    return;
  }
  if (run.xp >= run.nextXP) {
    openLevelUp();
    return;
  }
  clearInput();
  state = 'playing';
  updateHUD();
  canvas.focus({ preventScroll: true });
}
function refreshLoadout(){
  $('loadout').replaceChildren();
  const entries = run ? Object.entries(run.ranks) : [];
  $('loadout-count').textContent = `/ ${entries.length.toString().padStart(2, '0')}`;
  if (!entries.length) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-loadout';
    emptyState.innerHTML =
      '<strong>Your story starts here.</strong>Defeat robots and collect EXP to declare your first major.';
    $('loadout').append(emptyState);
    return;
  }
  entries.reverse().forEach(([id, rank]) => {
    const major = MAJOR_BY_ID.get(id);
    const element = document.createElement('div');
    const mastery = masteryLevel(id);
    element.className = 'loadout-item';
    element.title = `${major.ability}: ${EFFECTS[major.effect].desc}. ${rank} combat upgrades this run. Mastery ${mastery}/3: ${MASTERY_NAMES[mastery]}.`;
    element.innerHTML = `<span class="ability-glyph" aria-hidden="true">${effectIcon(major.effect)}</span><div><strong></strong><small></small><small class="mint">Mastery ${mastery}/3 · ${MASTERY_NAMES[mastery]}</small></div><span class="rank" aria-label="${rank} combat upgrades this run">×${rank}</span>`;
    element.querySelector('strong').textContent = major.name;
    element.querySelector('small').textContent = major.ability;
    $('loadout').append(element);
  });
}
function openCollection(){
  if (!['menu', 'playing', 'paused'].includes(state)) return;
  collectionReturn = state;
  state = 'collection';
  clearInput();
  if ($('pause-dialog').open) $('pause-dialog').close();
  saveProgress();
  refreshProgress();
  renderCollection();
  showDialog('collection-dialog');
}
function closeCollection(){
  if (state !== 'collection') return;
  $('collection-dialog').close();
  state = collectionReturn;
  clearInput();
  if (state === 'paused') showDialog('pause-dialog');
  else if (state === 'playing') canvas.focus({ preventScroll: true });
}
function renderCollection(){
  const query = $('collection-search').value.trim().toLocaleLowerCase();
  const status = $('collection-status').value;
  const rows = MAJORS.filter((major) => {
    const matchesCollege =
      filterCollege === 'all' || major.college === filterCollege;
    const matchesStatus =
      status === 'all' ||
      (status.startsWith('rank')
        ? masteryLevel(major.id) === Number(status.at(-1))
        : progress.discovered.includes(major.id) === (status === 'found'));
    const searchText = `${major.name} ${major.ability} ${EFFECTS[major.effect].desc}`;
    return (
      matchesCollege &&
      matchesStatus &&
      searchText.toLocaleLowerCase().includes(query)
    );
  });
  $('collection-list').replaceChildren();
  rows.forEach((major) => {
    const found = progress.discovered.includes(major.id);
    const level = masteryLevel(major.id);
    const card = document.createElement('article');
    card.className =
      'collection-card' +
      (found ? ' discovered' : '') +
      (level === 3 ? ' mastered' : '');
    card.innerHTML = `<div class="card-status"><span>${COLLEGES[major.college].toUpperCase()}</span><span>${found ? 'RESTORED' : 'UNDISCOVERED'}</span></div><h3></h3><div class="ability-name"></div><p></p><div class="mastery-note">${masteryPips(level)}${MASTERY_NAMES[level]} · ${level}/3</div>`;
    card.querySelector('h3').textContent = major.name;
    card.querySelector('.ability-name').textContent = major.ability;
    card.querySelector('p').textContent = EFFECTS[major.effect].desc;
    $('collection-list').append(card);
  });
  if (!rows.length) {
    const emptyState = document.createElement('p');
    emptyState.className = 'no-results';
    emptyState.textContent = 'No majors match these filters.';
    $('collection-list').append(emptyState);
  }
}
function updateHUD(){
  if (!run) return;
  const player = run.player;
  const healthPercentage = Math.max(0, (player.hp / player.maxHp) * 100);
  $('health-fill').style.width = `${healthPercentage}%`;
  $('health-fill').style.background =
    player.hp / player.maxHp < 0.3 ? 'var(--red)' : 'var(--mint)';
  $('health-text').textContent = `${Math.ceil(player.hp)} / ${player.maxHp}`;
  $('health-meter').setAttribute('aria-valuenow', Math.ceil(player.hp));
  $('health-meter').setAttribute('aria-valuemax', player.maxHp);
  $('timer').textContent = formatTime(run.time);
  $('kill-count').textContent = run.kills;
  $('new-count').textContent = run.newMajors.length;
  $('mobile-kills').textContent = `${run.kills} ROBOTS DOWN`;
  $('level-label').textContent = `LEVEL ${run.level.toString().padStart(2, '0')}`;
  $('xp-label').textContent = `${Math.floor(run.xp)} / ${run.nextXP} EXP`;
  $('xp-fill').style.width = `${Math.min(100, (run.xp / run.nextXP) * 100)}%`;
  $('xp-meter').setAttribute(
    'aria-valuenow',
    Math.min(run.nextXP, Math.floor(run.xp)),
  );
  $('xp-meter').setAttribute('aria-valuemax', run.nextXP);
  $('threat-label').textContent = `WAVE ${run.wave}${run.wave % 10 === 0 ? ' / BOSS WAVE' : ''}`;
  $('wave-countdown').textContent = `NEXT IN ${Math.ceil(WAVE_SECONDS - (run.time % WAVE_SECONDS))}s · BOSS AT ${Math.floor(run.wave / 10 + 1) * 10}`;
  $('compact-discoveries').textContent = `${run.newMajors.length} NEW MAJORS`;
  $('compact-archive').textContent = `APR ${progress.discovered.length} / ${MAJORS.length}`;
  const bosses = run.enemies.filter(
    (enemy) => enemy.type === 'boss' && !enemy.dead,
  );
  const boss = bosses[0];
  $('boss-hud').hidden = !boss;
  if (boss) {
    const health = Math.max(0, Math.ceil((boss.hp / boss.maxHp) * 100));
    $('boss-name').textContent = `THE STANDARDIZER${bosses.length > 1 ? ' ×' + bosses.length : ''}`;
    $('boss-health-text').textContent = `${health}%`;
    $('boss-fill').style.width = `${health}%`;
    $('boss-meter').setAttribute('aria-valuenow', health);
  }
  $('dash-status').classList.toggle('ready', player.dashCD <= 0);
  $('dash-label').textContent = player.dashCD <= 0
    ? 'DASH READY'
    : `RECHARGING ${player.dashCD.toFixed(1)}s`;
  $('dash-fill').style.width = `${clamp(1 - player.dashCD / run.stats.dashCooldown, 0, 1) * 100}%`;
  $('game-tip').hidden = run.time > 8;
}

const ENEMY_TYPES = {
  scout: { r: 12, hp: 23, speed: 69, damage: 12, xp: 1, color: '#f89a68' },
  enforcer: { r: 19, hp: 58, speed: 49, damage: 18, xp: 3, color: '#ec747c' },
  bulwark: { r: 29, hp: 160, speed: 30, damage: 29, xp: 8, color: '#c2a2ed' },
  artillery: { r: 16, hp: 46, speed: 41, damage: 17, xp: 5, color: '#e2c26e' },
  interceptor: { r: 22, hp: 105, speed: 56, damage: 23, xp: 6, color: '#83b6ff' },
  boss: { r: 48, hp: 1400, speed: 28, damage: 34, xp: 80, color: '#fa83b1' },
};
function spawnEnemy(type) {
  if (!run || (type !== 'boss' && run.enemies.length >= 90)) return;
  const time = run.time;
  if (!type) {
    const roll = Math.random();
    type =
      run.wave >= 3 && roll > 0.82
        ? 'interceptor'
        : time > 45 && roll > 0.68
          ? 'artillery'
          : time > 28 && roll > 0.53
            ? 'bulwark'
            : time > 10 && roll > 0.3
              ? 'enforcer'
              : 'scout';
  }
  const definition = ENEMY_TYPES[type];
  const tier = 1 + Math.floor(time / 80);
  let x;
  let y;
  const side = Math.floor(Math.random() * 4);
  if (side === 0) {
    x = rand(42, W - 42);
    y = 48;
  } else if (side === 1) {
    x = W - 38;
    y = rand(80, H - 90);
  } else if (side === 2) {
    x = rand(42, W - 42);
    y = H - 45;
  } else {
    x = 38;
    y = rand(80, H - 90);
  }
  if ((x - run.player.x) ** 2 + (y - run.player.y) ** 2 < 230 ** 2) {
    x = W - x;
    y = H - y;
  }
  const maxHp = definition.hp * (1 + 0.2 * (tier - 1));
  const spawnDuration = type === 'boss' ? 1.8 : 0.75;
  const enemy = {
    id: run.nextId++,
    type,
    x,
    y,
    r: definition.r,
    hp: maxHp,
    maxHp,
    speed: definition.speed * (1 + Math.min(0.65, time / 350)),
    damage: definition.damage * (1 + 0.12 * (tier - 1)),
    xp: definition.xp * tier,
    color: definition.color,
    tier,
    wave: run.wave,
    spawn: spawnDuration,
    spawnDuration,
    stun: 0,
    slow: 0,
    poison: 0,
    poisonDmg: 0,
    hit: 0,
    orbitHit: 0,
    shot: rand(1.8, 3),
    windup: 0,
    aimX: 0,
    aimY: 0,
    charge: 0,
    chargeX: 0,
    chargeY: 0,
    volleyAngle: 0,
    dead: false,
  };
  enemy.x = clamp(enemy.x, definition.r + 8, W - definition.r - 8);
  enemy.y = clamp(enemy.y, definition.r + 20, H - definition.r - 20);
  run.enemies.push(enemy);
  return enemy;
}
function advanceWave(){
 const target=1+Math.floor(run.time/WAVE_SECONDS);
 while(run.wave<target){
  run.wave++;
  if(run.wave%10===0){spawnEnemy('boss');toast(`WAVE ${run.wave}: The Standardizer has arrived. Dodge its marked burst!`);Sound.play('hit');}
  else if(run.wave===3)toast('Interceptors incoming: step away from their blue charge paths.');
 }
}
function burst(x,y,color,count=8,force=90){
 if(!run)return;const total=progress.settings.reducedMotion?Math.min(3,count):count;
 for(let i=0;i<total&&run.particles.length<260;i++){const a=rand(0,TAU),v=rand(force*.3,force);run.particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rand(.2,.55),max:.55,color,size:rand(1.5,3.5)});}
}
function floating(x,y,text,color){if(run.texts.length<35)run.texts.push({x,y,text,color,life:.8});}
function addLoot(x,y,value){
 if(run.loot.length>=160){let nearest=run.loot[0],distance=Infinity;for(const gem of run.loot){const d=(gem.x-x)**2+(gem.y-y)**2;if(d<distance){distance=d;nearest=gem;}}nearest.value+=value;return;}
 run.loot.push({x,y,value,phase:rand(0,TAU)});
}
function hitEnemy(e,damage,critical=false){
 if(e.dead||e.spawn>0)return;
 e.hp-=damage;e.hit=.1;
 if(critical)floating(e.x,e.y-e.r-7,`${Math.round(damage)}!`,'#ffd4a1');
 if(e.hp<=0){
  e.dead=true;run.kills++;progress.totalKills++;
  if(e.type==='boss'){
   run.bossKills++;run.player.hp=Math.min(run.player.maxHp,run.player.hp+25);
   for(let i=0;i<8;i++)addLoot(clamp(e.x+Math.cos(i*TAU/8)*32,12,W-12),clamp(e.y+Math.sin(i*TAU/8)*32,12,H-12),e.xp/8);
   toast(`Standardizer defeated! +25 health. Collect its EXP cache.`);Sound.play('level');
  }else addLoot(e.x,e.y,e.xp);
  burst(e.x,e.y,e.color,e.r>20?15:8);Sound.play('kill');
 }
}
function damagePlayer(amount,x,y){
 const p=run.player;if(p.invuln>0)return;
 if(run.shieldReady){run.shieldReady=false;run.shieldClock=run.stats.shieldCooldown;p.invuln=.5;burst(p.x,p.y,'#a7cdfd',12);Sound.play('shield');return;}
 const damage=Math.max(3,amount*run.stats.armor);p.hp=Math.max(0,p.hp-damage);p.invuln=.85;run.shake=progress.settings.reducedMotion?0:5;
 let dx=p.x-x,dy=p.y-y,d=Math.hypot(dx,dy)||1;p.x=clamp(p.x+dx/d*15,25,W-25);p.y=clamp(p.y+dy/d*15,50,H-40);
 burst(p.x,p.y,'#fa8279',9);floating(p.x,p.y-22,`−${Math.round(damage)}`,'#ff8c84');Sound.play('hit');
 if(p.hp<=0){updateHUD();endRun();}
}
function dash(){
 if(state!=='playing'||!run||run.player.dashCD>0)return;
 const p=run.player;
 const dx=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0)+touchVector.x;
 const dy=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0)+touchVector.y;
 const length=Math.hypot(dx,dy);if(length>.1){p.dx=dx/length;p.dy=dy/length;}
 p.dash=.19;p.dashCD=run.stats.dashCooldown;p.invuln=Math.max(p.invuln,.29);Sound.play('dash');burst(p.x,p.y,'#ffad6b',8,60);
}
function fire(){
 const p=run.player,s=run.stats;let target=null,distance=480**2;
 for(const e of run.enemies){if(e.dead||e.spawn>0)continue;const d=dist2(p,e);if(d<distance){distance=d;target=e;}}
 if(!target)return false;
 const angle=Math.atan2(target.y-p.y,target.x-p.x);p.angle=angle;
 for(let i=0;i<s.shots;i++){const offset=i===0?0:Math.ceil(i/2)*.15*(i%2?1:-1),a=angle+offset,critical=Math.random()<s.crit;
  run.bullets.push({x:p.x+Math.cos(a)*19,y:p.y+Math.sin(a)*19,vx:Math.cos(a)*640,vy:Math.sin(a)*640,r:4,life:.84,damage:s.damage*(critical?s.critPower:1),pierce:s.pierce,critical,hit:new Set(),dead:false});
 }
 Sound.play('shot');return true;
}
function orbitPositions(){
 const s=run.stats,p=run.player,positions=[];
 for(let i=0;i<s.orbitCount;i++){const a=run.time*2.2+i/s.orbitCount*TAU;positions.push({x:p.x+Math.cos(a)*s.orbitRadius,y:p.y+Math.sin(a)*s.orbitRadius});}return positions;
}
function update(dt){
 if (state !== 'playing' || !run) return;
 const r = run;
 const p = r.player;
 const s = r.stats;
 r.time += dt;
 r.saveClock += dt;
 p.invuln = Math.max(0, p.invuln - dt);
 p.dashCD = Math.max(0, p.dashCD - dt);
 r.shake = Math.max(0, r.shake - dt * 24);
 advanceWave();
 let mx =
   (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) -
   (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) +
   touchVector.x;
 let my =
   (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) -
   (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) +
   touchVector.y;
 const magnitude = Math.hypot(mx, my);
 if (magnitude > 1) {
   mx /= magnitude;
   my /= magnitude;
 }
 if (p.dash > 0) {
   p.x += p.dx * 680 * dt;
   p.y += p.dy * 680 * dt;
   p.dash = Math.max(0, p.dash - dt);
   if (!progress.settings.reducedMotion) burst(p.x, p.y, '#ffb46e', 1, 8);
 } else {
   p.x += mx * s.speed * dt;
   p.y += my * s.speed * dt;
   if (magnitude > 0.1) {
     const length = Math.hypot(mx, my);
     p.dx = mx / length;
     p.dy = my / length;
   }
 }
 p.x = clamp(p.x, 25, W - 25);
 p.y = clamp(p.y, 65, H - 46);
 p.hp = Math.min(p.maxHp, p.hp + s.regen * dt);
 if (r.effects.shield && !r.shieldReady) {
   r.shieldClock -= dt;
   if (r.shieldClock <= 0) r.shieldReady = true;
 }
 r.spawnClock -= dt;
 if (r.spawnClock <= 0) {
   const count = 1 + Math.floor(Math.min(3, r.time / 65));
   for (let index = 0; index < count; index++) spawnEnemy();
   r.spawnClock = Math.max(0.35, 1.1 - r.time * 0.0028);
 }
 r.shotClock -= dt;
 if (r.shotClock <= 0) r.shotClock = fire() ? s.interval : 0.08;
 if (s.pulse || s.stun) {
   r.pulseClock -= dt;
   if (r.pulseClock <= 0) {
     r.pulseClock = 7;
     r.rings.push({
       x: p.x,
       y: p.y,
       radius: s.pulseRadius,
       life: 0.5,
       max: 0.5,
       color: s.stun ? '#b5abe8' : '#8de6cf',
     });
     for (const enemy of r.enemies) {
       if (
         !enemy.dead &&
         enemy.spawn <= 0 &&
         dist2(enemy, p) < (s.pulseRadius + enemy.r) ** 2
       ) {
         if (s.pulse) hitEnemy(enemy, s.pulse);
         enemy.stun = Math.max(enemy.stun, s.stun);
       }
     }
     Sound.play('pulse');
   }
 }
 const orbits = orbitPositions();
 for (const enemy of r.enemies) {
   if (enemy.dead) continue;
   enemy.hit = Math.max(0, enemy.hit - dt);
   enemy.orbitHit = Math.max(0, enemy.orbitHit - dt);
   if (enemy.spawn > 0) {
     enemy.spawn -= dt;
     continue;
   }
   enemy.stun = Math.max(0, enemy.stun - dt);
   enemy.slow = Math.max(0, enemy.slow - dt);
   if (enemy.poison > 0) {
     const activeTime = Math.min(dt, enemy.poison);
     enemy.poison -= dt;
     hitEnemy(enemy, enemy.poisonDmg * activeTime);
     if (enemy.dead) continue;
   }
   if (
     enemy.orbitHit <= 0 &&
     orbits.some((orbit) => dist2(orbit, enemy) < (enemy.r + 9) ** 2)
   ) {
     hitEnemy(enemy, s.orbitDamage);
     enemy.orbitHit = 0.6;
     if (enemy.dead) continue;
   }
   const dx = p.x - enemy.x;
   const dy = p.y - enemy.y;
   const distance = Math.hypot(dx, dy) || 1;
   if (enemy.stun <= 0) {
     let movement =
       enemy.type === 'artillery'
         ? distance > 310
           ? 1
           : distance < 225
             ? -0.55
             : 0
         : 1;
     if (enemy.windup > 0 || enemy.charge > 0) movement = 0;
     const slowMultiplier = enemy.slow > 0 ? 0.75 : 1;
     enemy.x += (dx / distance) * enemy.speed * movement * slowMultiplier * dt;
     enemy.y += (dy / distance) * enemy.speed * movement * slowMultiplier * dt;
     if (enemy.type === 'artillery') {
       if (enemy.windup > 0) {
         enemy.windup -= dt;
         if (enemy.windup <= 0) {
           const angle = Math.atan2(enemy.aimY - enemy.y, enemy.aimX - enemy.x);
           if (r.hostile.length < 70) {
             r.hostile.push({
               x: enemy.x,
               y: enemy.y,
               vx: Math.cos(angle) * 205,
               vy: Math.sin(angle) * 205,
               r: 5,
               life: 5,
               damage: enemy.damage,
             });
           }
           enemy.shot = 3.2;
         }
       } else {
         enemy.shot -= dt;
         if (enemy.shot <= 0) {
           enemy.windup = 0.8;
           enemy.aimX = p.x;
           enemy.aimY = p.y;
         }
       }
     }
     if (enemy.type === 'interceptor') {
       if (enemy.charge > 0) {
         const travel = Math.min(dt, enemy.charge) * 260 * slowMultiplier;
         enemy.x = clamp(enemy.x + enemy.chargeX * travel, enemy.r + 8, W - enemy.r - 8);
         enemy.y = clamp(enemy.y + enemy.chargeY * travel, enemy.r + 20, H - enemy.r - 20);
         enemy.charge = Math.max(0, enemy.charge - dt);
       } else if (enemy.windup > 0) {
         enemy.windup -= dt;
         if (enemy.windup <= 0) {
           const length = Math.hypot(enemy.aimX - enemy.x, enemy.aimY - enemy.y) || 1;
           enemy.chargeX = (enemy.aimX - enemy.x) / length;
           enemy.chargeY = (enemy.aimY - enemy.y) / length;
           enemy.charge = 0.7;
           enemy.shot = 3.8;
         }
       } else {
         enemy.shot -= dt;
         if (enemy.shot <= 0) {
           enemy.windup = 0.8;
           enemy.aimX = p.x;
           enemy.aimY = p.y;
         }
       }
     }
     if (enemy.type === 'boss') {
       if (enemy.windup > 0) {
         enemy.windup -= dt;
         if (enemy.windup <= 0) {
           for (let index = 0; index < 10 && r.hostile.length < 70; index++) {
             const angle = enemy.volleyAngle + (index * TAU) / 10;
             r.hostile.push({
               x: enemy.x + Math.cos(angle) * (enemy.r + 5),
               y: enemy.y + Math.sin(angle) * (enemy.r + 5),
               vx: Math.cos(angle) * 165,
               vy: Math.sin(angle) * 165,
               r: 7,
               life: 6,
               damage: enemy.damage * 0.75,
               boss: true,
             });
           }
           enemy.shot = enemy.hp < enemy.maxHp * 0.5 ? 2.7 : 3.6;
         }
       } else {
         enemy.shot -= dt;
         if (enemy.shot <= 0) {
           enemy.windup = 1.15;
           enemy.volleyAngle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
         }
       }
     }
   }
   if (dist2(enemy, p) < (enemy.r + p.r) ** 2) {
     damagePlayer(enemy.damage, enemy.x, enemy.y);
   }
   if (state !== 'playing') return;
 }
 for (let index = 0; index < r.enemies.length; index++) {
   const first = r.enemies[index];
   if (first.dead || first.spawn > 0) continue;
   for (let otherIndex = index + 1; otherIndex < r.enemies.length; otherIndex++) {
     const second = r.enemies[otherIndex];
     if (second.dead || second.spawn > 0) continue;
     const dx = second.x - first.x;
     const dy = second.y - first.y;
     const distanceSquared = dx * dx + dy * dy;
     const minimumDistance = (first.r + second.r) * 0.85;
     if (distanceSquared > 0 && distanceSquared < minimumDistance ** 2) {
       const distance = Math.sqrt(distanceSquared);
       const force = (minimumDistance - distance) * Math.min(0.4, dt * 4);
       first.x -= (dx / distance) * force;
       first.y -= (dy / distance) * force;
       second.x += (dx / distance) * force;
       second.y += (dy / distance) * force;
     }
   }
 }
 for (const bullet of r.bullets) {
   bullet.x += bullet.vx * dt;
   bullet.y += bullet.vy * dt;
   bullet.life -= dt;
   for (const enemy of r.enemies) {
     if (bullet.dead) break;
     if (enemy.dead || enemy.spawn > 0 || bullet.hit.has(enemy.id)) continue;
     if (dist2(bullet, enemy) < (bullet.r + enemy.r) ** 2) {
       bullet.hit.add(enemy.id);
       hitEnemy(enemy, bullet.damage, bullet.critical);
       if (!enemy.dead) {
         if (s.poison) {
           enemy.poison = 3;
           enemy.poisonDmg = s.poison;
         }
         if (s.slow) enemy.slow = s.slow;
       }
       if (bullet.pierce > 0) bullet.pierce--;
       else bullet.dead = true;
     }
   }
 }
 for (const projectile of r.hostile) {
   projectile.x += projectile.vx * dt;
   projectile.y += projectile.vy * dt;
   projectile.life -= dt;
   if (dist2(projectile, p) < (projectile.r + p.r) ** 2) {
     damagePlayer(projectile.damage, projectile.x, projectile.y);
     projectile.life = 0;
   }
   if (state !== 'playing') return;
 }
 let pickedUp = false;
 for (const gem of r.loot) {
   const dx = p.x - gem.x;
   const dy = p.y - gem.y;
   const distance = Math.hypot(dx, dy);
   if (distance < s.magnet) {
     const travel = Math.min(distance, dt * (240 + (s.magnet - distance) * 4));
     if (distance > 0) {
       gem.x += (dx / distance) * travel;
       gem.y += (dy / distance) * travel;
     }
   }
   if (dist2(gem, p) < (p.r + 11) ** 2) {
     r.xp += gem.value * s.xpBonus;
     gem.collected = true;
     pickedUp = true;
   }
 }
 if (pickedUp) Sound.play('pickup');
 r.enemies = r.enemies.filter((enemy) => !enemy.dead);
 r.bullets = r.bullets.filter(
   (bullet) =>
     !bullet.dead &&
     bullet.life > 0 &&
     bullet.x > -20 &&
     bullet.x < W + 20 &&
     bullet.y > -20 &&
     bullet.y < H + 20,
 );
 r.hostile = r.hostile.filter(
   (projectile) =>
     projectile.life > 0 &&
     projectile.x > -20 &&
     projectile.x < W + 20 &&
     projectile.y > -20 &&
     projectile.y < H + 20,
 );
 r.loot = r.loot.filter((gem) => !gem.collected);
 for (const particle of r.particles) {
   particle.life -= dt;
   particle.x += particle.vx * dt;
   particle.y += particle.vy * dt;
   particle.vx *= 1 - dt * 3;
   particle.vy *= 1 - dt * 3;
 }
 r.particles = r.particles.filter((particle) => particle.life > 0);
 for (const ring of r.rings) ring.life -= dt;
 r.rings = r.rings.filter((ring) => ring.life > 0);
 for (const text of r.texts) {
   text.life -= dt;
   text.y -= dt * 26;
 }
 r.texts = r.texts.filter((text) => text.life > 0);
 if (r.saveClock >= 8) {
   r.saveClock = 0;
   saveProgress();
 }
 if (r.xp >= r.nextXP) openLevelUp();
}

function roundRect(context, x, y, width, height, radius, fill, stroke) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.strokeStyle = stroke;
    context.stroke();
  }
}
function circle(context, x, y, radius, fill, stroke) {
  context.beginPath();
  context.arc(x, y, radius, 0, TAU);
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.strokeStyle = stroke;
    context.stroke();
  }
}
function line(context, x1, y1, x2, y2, color, width = 1) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
}
function polygon(context, points, fill, stroke) {
  context.beginPath();
  points.forEach(([x, y], index) => {
    if (index) context.lineTo(x, y);
    else context.moveTo(x, y);
  });
  context.closePath();
  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }
  if (stroke) {
    context.strokeStyle = stroke;
    context.stroke();
  }
}
function bisonMark(context, x, y, scale, color) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  polygon(
    context,
    [
      [-22, -12],
      [-28, -29],
      [-12, -19],
      [-8, -25],
      [0, -27],
      [8, -25],
      [12, -19],
      [28, -29],
      [22, -12],
      [18, -6],
      [15, 11],
      [8, 22],
      [-8, 22],
      [-15, 11],
      [-18, -6],
    ],
    color,
  );
  polygon(context, [[-13, -8], [-3, -5], [-8, 0], [-13, -3]], '#152731');
  polygon(context, [[13, -8], [3, -5], [8, 0], [13, -3]], '#152731');
  polygon(context, [[-6, 9], [6, 9], [4, 15], [-4, 15]], '#152731');
  context.restore();
}
const ground = document.createElement('canvas');
ground.width = W;
ground.height = H;
function makeGround() {
  const context = ground.getContext('2d');
  context.fillStyle = '#10232e';
  context.fillRect(0, 0, W, H);
  const gradient = context.createRadialGradient(
    W * 0.5,
    H * 0.45,
    20,
    W * 0.5,
    H * 0.45,
    W * 0.65,
  );
  gradient.addColorStop(0, '#1c3440');
  gradient.addColorStop(1, '#0c1b26');
  context.fillStyle = gradient;
  context.fillRect(0, 0, W, H);
  context.lineWidth = 1;
  for (let x = 0; x < W; x += 40) line(context, x, 0, x, H, '#6a96a00b');
  for (let y = 0; y < H; y += 40) line(context, 0, y, W, y, '#6a96a00b');
  context.fillStyle = '#50626a19';
  context.fillRect(565, 120, 70, H - 200);
  context.fillRect(85, 357, W - 170, 64);
  line(context, 560, 130, 560, H - 60, '#79969220');
  line(context, 640, 130, 640, H - 60, '#79969220');
  line(context, 85, 351, W - 85, 351, '#79969220');
  line(context, 85, 427, W - 85, 427, '#79969220');
  for (let x = 90; x < W - 80; x += 33) {
    line(context, x, 355, x, 420, '#8298930b');
  }
  for (let y = 140; y < H - 50; y += 33) {
    line(context, 566, y, 635, y, '#8298930d');
  }
  context.setLineDash([4, 13]);
  context.strokeStyle = '#778c7330';
  context.strokeRect(34, 64, W - 68, H - 115);
  context.setLineDash([]);
  const bx = 425;
  const by = 51;
  const bw = 350;
  roundRect(context, bx - 12, by + 20, bw + 24, 97, 2, '#06121a60');
  roundRect(context, bx, by + 8, bw, 87, 1, '#25323a', '#53605d');
  polygon(
    context,
    [
      [bx - 17, by + 14],
      [bx + 23, by - 13],
      [bx + bw - 23, by - 13],
      [bx + bw + 17, by + 14],
    ],
    '#484c40',
    '#7c776044',
  );
  roundRect(context, bx + 135, by - 24, 80, 38, 1, '#394238', '#6b6d5b');
  polygon(
    context,
    [
      [bx + 122, by - 24],
      [bx + 175, by - 44],
      [bx + 228, by - 24],
    ],
    '#55574a',
    '#9d8a5b55',
  );
  context.fillStyle = '#111f27';
  context.fillRect(bx + 164, by - 22, 22, 24);
  circle(context, bx + 175, by - 10, 8, '#c1ae7940', '#b5b19270');
  line(context, bx + 175, by - 10, bx + 175, by - 15, '#c8c4a5');
  line(context, bx + 175, by - 10, bx + 180, by - 8, '#c8c4a5');
 for(let i=0;i<11;i++){const x=bx+17+i*30;context.fillStyle=i%3===0?'#d8ac6655':'#c6c39620';context.fillRect(x,by+29,12,16);context.fillRect(x,by+58,12,16);line(context,x+6,by+29,x+6,by+45,'#1b303a');line(context,x,by+37,x+12,by+37,'#1b303a');}
 context.fillStyle='#46534e';for(let i=0;i<6;i++)context.fillRect(bx+101+i*27,by+24,8,70);
 context.fillStyle='#637067';context.fillRect(bx+91,by+19,167,6);context.fillStyle='#1a2830';context.fillRect(bx+156,by+62,38,33);
 for(let i=0;i<3;i++){context.fillStyle=`rgba(118,126,111,${.32-i*.05})`;context.fillRect(bx+80-i*7,by+96+i*5,190+i*14,4);}
 context.textAlign='center';context.font='9px Consolas,monospace';context.fillStyle='#abb5a17a';context.fillText('B E R T R A N D   L I B R A R Y',W/2,by+133);
 for(const [x,y,w,h,label] of [[58,105,108,142,'ENGINEERING'],[1035,102,110,142,'FREEMAN'],[69,532,98,114,'ARTS & SCIENCES'],[1030,523,110,126,'HUMANITIES']]){
  roundRect(context,x+8,y+9,w,h,1,'#05131c80');roundRect(context,x,y,w,h,1,'#1b303a','#415358');roundRect(context,x-5,y-6,w+10,16,1,'#3b493e','#64716145');
  for(let xx=x+12;xx<x+w-8;xx+=25)for(let yy=y+23;yy<y+h-10;yy+=29){context.fillStyle=(xx+yy)%3<1?'#eebc6638':'#769a9330';context.fillRect(xx,yy,11,15);}
  context.font='7px Consolas,monospace';context.fillStyle='#73929880';context.fillText(label,x+w/2,y+h+18);
 }
 const tree=(x,y,r)=>{circle(context,x+4,y+6,r,'#03131966');circle(context,x,y,r,'#1e3739','#39514870');circle(context,x-5,y-4,r*.66,'#2e4945');circle(context,x+6,y-2,r*.52,'#28453f');line(context,x,y+4,x,y+r+5,'#6b684548',2);};
 for(let i=0;i<7;i++){tree(222,111+i*80,18+(i%3)*3);tree(978,111+i*80,18+((i+1)%3)*3);}
 for(let i=0;i<5;i++){tree(307+i*147,680,17+(i%2)*3);}
 for(const [x,y] of [[295,191],[910,190],[294,576],[906,576]]){circle(context,x,y,31,'#e7b56b05');circle(context,x,y,15,'#e7b56b06');line(context,x,y,x,y-19,'#748989',2);circle(context,x,y-21,3,'#d2c9a6');}
 for(const [x,y] of [[340,305],[825,305],[340,469],[825,469]]){roundRect(context,x,y,34,10,2,'#6c675645','#8d927955');line(context,x+4,y+12,x+4,y+16,'#253945',2);line(context,x+30,y+12,x+30,y+16,'#253945',2);}
 context.lineWidth=1;circle(context,600,391,128,'#152b3433','#8da39617');circle(context,600,391,114,null,'#96a89425');circle(context,600,391,83,'#142a3480','#99ad9930');circle(context,600,391,77,null,'#8a998a15');
 bisonMark(context,600,385,1.3,'#a5b29922');context.font='8px Consolas,monospace';context.fillStyle='#94ae984d';context.fillText('B U C K N E L L',600,453);context.font='7px Consolas,monospace';context.fillText('1 8 4 6',600,338);
 context.strokeStyle='#78a7a118';context.beginPath();context.moveTo(265,240);context.lineTo(319,240);context.lineTo(348,270);context.lineTo(426,270);context.moveTo(936,502);context.lineTo(868,502);context.lineTo(834,538);context.lineTo(756,538);context.stroke();
 for(const [x,y] of [[426,270],[756,538]])circle(context,x,y,3,'#75928f35');
 context.font='8px Consolas,monospace';context.fillStyle='#64849260';context.textAlign='left';context.fillText('Q-01',40,H-26);context.textAlign='right';context.fillText('BUCKNELL / THE QUAD',W-40,H-26);
}
function drawPlayer(context, player, time, showState = true) {
  context.save();
  context.translate(player.x, player.y);
  const invulnerable = showState && player.invuln > 0;
  if (invulnerable) {
    circle(
      context,
      0,
      0,
      24,
      null,
      player.dash > 0 ? '#ffac75aa' : '#dbeee55c',
    );
  }
  if (
    invulnerable &&
    player.dash <= 0 &&
    !progress.settings.reducedMotion &&
    Math.floor(time * 18) % 2 === 0
  ) {
    context.globalAlpha = 0.6;
  }
  context.fillStyle = '#02090d66';
  context.beginPath();
  context.ellipse(0, 15, 19, 7, 0, 0, TAU);
  context.fill();
  const bob = progress.settings.reducedMotion ? 0 : Math.sin(time * 8) * 0.7;
  context.translate(0, bob);
  roundRect(context, -12, 7, 9, 12, 3, '#07141e', '#517484');
  roundRect(context, 3, 7, 9, 12, 3, '#07141e', '#517484');
  polygon(context, [[-15, -6], [-19, 10], [-11, 13], [-8, -4]], '#e88242', '#ffc18488');
  polygon(context, [[15, -6], [19, 10], [11, 13], [8, -4]], '#e88242', '#ffc18488');
  roundRect(context, -12, -9, 24, 25, 7, '#e98d50', '#ffb570');
  roundRect(context, -7, -3, 14, 15, 3, '#c77437');
  bisonMark(context, 0, 5, 0.14, '#f4d4a4');
  roundRect(context, -11, -24, 22, 23, 8, '#182b36', '#9caeb3');
  roundRect(context, -8, -15, 16, 9, 3, '#a0d4d1');
  line(context, -7, -10, 7, -10, '#d6fae5', 1);
  roundRect(context, -12, -24, 24, 9, 4, '#de8a4c', '#ffb879');
  context.save();
  context.rotate(player.angle || 0);
  roundRect(context, 9, -2, 21, 7, 2, '#243d4b', '#8daeb9');
  roundRect(context, 26, -1, 6, 5, 1, '#d3dbc7');
  context.restore();
  if (showState && run?.shieldReady) {
    context.lineWidth = 1.5;
    circle(context, 0, 0, 29, null, '#93b8ff88');
    context.setLineDash([4, 8]);
    circle(context, 0, 0, 33, null, '#93b8ff38');
    context.setLineDash([]);
  }
  context.restore();
}
function drawRobot(c,e,time,player){
 c.save();c.translate(e.x,e.y);const r=e.r,angle=Math.atan2(player.y-e.y,player.x-e.x);
 if(e.spawn>0){c.globalAlpha=.3;c.setLineDash([5,6]);circle(c,0,0,r+12,null,e.color);c.setLineDash([]);c.globalAlpha=.25+(1-e.spawn/(e.spawnDuration||.75))*.5;}
 c.fillStyle='#020b1260';c.beginPath();c.ellipse(0,r*.85,r*1.12,r*.42,0,0,TAU);c.fill();
 const color=e.stun>0?'#d0c5ff':e.poison>0?'#a7d985':e.color;
 c.lineWidth=1.5;
 if(e.type==='scout'){
  c.rotate(angle+Math.PI/2);polygon(c,[[0,-r*1.25],[r*.9,-r*.1],[r*.62,r*.7],[0,r*.35],[-r*.62,r*.7],[-r*.9,-r*.1]],'#293c48',color);
  line(c,-r*.8,r*.2,-r*1.3,r*.8,'#617b87',3);line(c,r*.8,r*.2,r*1.3,r*.8,'#617b87',3);
  roundRect(c,-5,-6,10,5,1,color);line(c,0,r*.35,0,r*.8,'#e7a06677',2);
 }else if(e.type==='interceptor'){
  c.rotate((e.charge>0?Math.atan2(e.chargeY,e.chargeX):angle)+Math.PI/2);
  polygon(c,[[0,-r*1.2],[r*.85,-r*.3],[r*.7,r*.85],[0,r*.45],[-r*.7,r*.85],[-r*.85,-r*.3]],'#223a55',color);
  polygon(c,[[-r*.9,-r*.3],[-r*1.25,r*.75],[-r*.75,r*.5]],'#41618a',color);
  polygon(c,[[r*.9,-r*.3],[r*1.25,r*.75],[r*.75,r*.5]],'#41618a',color);
  roundRect(c,-8,-10,16,5,1,e.windup>0?'#f5fbff':color);circle(c,0,5,5,'#142b44',color);
  if(e.charge>0){line(c,-10,r*.7,-10,r*1.6,'#a9d9ff',4);line(c,10,r*.7,10,r*1.6,'#a9d9ff',4);}
 }else if(e.type==='boss'){
  for(let i=0;i<6;i++){const a=i*TAU/6+Math.PI/6;line(c,Math.cos(a)*r*.6,Math.sin(a)*r*.6,Math.cos(a)*r*1.2,Math.sin(a)*r*1.2,'#776286',9);circle(c,Math.cos(a)*r*1.2,Math.sin(a)*r*1.2,6,'#34243e',color);}
  polygon(c,Array.from({length:8},(_,i)=>[Math.cos(i*TAU/8+Math.PI/8)*r,Math.sin(i*TAU/8+Math.PI/8)*r]),'#35283f',color);
  circle(c,0,0,r*.65,'#111f30','#966486');c.save();if(!progress.settings.reducedMotion)c.rotate(time*.7);c.setLineDash([12,8]);circle(c,0,0,r*.52,null,color);c.restore();
  polygon(c,[[0,-19],[18,0],[0,19],[-18,0]],e.windup>0?'#ffe5f3':color);circle(c,0,0,7,'#172238');
  line(c,-r*.55,-r*.65,r*.55,-r*.65,'#f6b0d2',3);
 }else if(e.type==='bulwark'){
  roundRect(c,-r-5,-r*.5,14,r*1.3,3,'#2c3d49',color);roundRect(c,r-9,-r*.5,14,r*1.3,3,'#2c3d49',color);
  roundRect(c,-r*.7,r*.35,13,r*.8,2,'#1d303d','#566b80');roundRect(c,r*.7-13,r*.35,13,r*.8,2,'#1d303d','#566b80');
  polygon(c,[[-r*.82,-r*.63],[-r*.4,-r],[r*.4,-r],[r*.82,-r*.63],[r*.9,r*.4],[r*.55,r*.77],[-r*.55,r*.77],[-r*.9,r*.4]],'#354153',color);
  roundRect(c,-r*.5,-r*.55,r,r*.45,3,'#152432',color);roundRect(c,-r*.34,-r*.4,r*.68,4,1,color);
  circle(c,0,r*.28,8,'#172a39',color);circle(c,0,r*.28,3,color);line(c,-r*.6,r*.6,r*.6,r*.6,'#5c6e80',2);
 }else if(e.type==='artillery'){
  for(let i=0;i<4;i++){const a=TAU*i/4+Math.PI/4;line(c,Math.cos(a)*r*.5,Math.sin(a)*r*.5,Math.cos(a)*r*1.3,Math.sin(a)*r*1.3,'#657e82',3);}
  polygon(c,[[0,-r],[-r*.8,-r*.5],[-r*.8,r*.5],[0,r],[r*.8,r*.5],[r*.8,-r*.5]],'#33434b',color);
  c.save();c.rotate(angle);roundRect(c,-5,-6,r+12,12,3,'#1f303e',color);roundRect(c,r+2,-3,7,6,1,color);c.restore();circle(c,0,0,4,color);
 }else{
  const walk=progress.settings.reducedMotion||e.spawn>0?0:Math.sin(time*7+e.id)*2;
  roundRect(c,-r*.7,r*.2,9,r*.8+walk,2,'#1d303b','#63808a');roundRect(c,r*.7-9,r*.2,9,r*.8-walk,2,'#1d303b','#63808a');
  roundRect(c,-r-4,-r*.35,8,r*.9,2,'#334751',color);roundRect(c,r-4,-r*.35,8,r*.9,2,'#334751',color);
  roundRect(c,-r*.72,-r*.75,r*1.44,r*1.25,3,'#30424e',color);roundRect(c,-r*.65,-r*.97,r*1.3,r*.56,3,'#20313d',color);
  roundRect(c,-r*.45,-r*.8,r*.9,4,1,color);polygon(c,[[-5,0],[0,-5],[5,0],[0,5]],color);
 }
 if(e.hit>0){c.globalAlpha=.3;circle(c,0,0,r,'#fff6d6');c.globalAlpha=1;}
 c.restore();
 if(e.hp<e.maxHp&&e.spawn<=0){c.fillStyle='#06111d';c.fillRect(e.x-r,e.y-r-10,r*2,3);c.fillStyle=color;c.fillRect(e.x-r,e.y-r-10,Math.max(0,e.hp/e.maxHp)*r*2,3);}
 if(e.tier>1&&e.spawn<=0){c.save();c.font='7px Consolas,monospace';c.textAlign='center';c.fillStyle=e.color;c.fillText(`T${e.tier}`,e.x,e.y+r+14);c.restore();}
}
function drawGem(context, gem, time) {
  const large = gem.value >= 5;
  const size = large ? 6 : 4.5;
  const bob = progress.settings.reducedMotion
    ? 0
    : Math.sin(time * 3 + gem.phase) * 1.5;
  context.save();
  context.translate(gem.x, gem.y + bob);
  context.rotate(Math.PI / 4);
  context.fillStyle = '#92efc513';
  context.fillRect(-size - 4, -size - 4, (size + 4) * 2, (size + 4) * 2);
  context.fillStyle = large ? '#b9f9d4' : '#7bcbb0';
  context.fillRect(-size, -size, size * 2, size * 2);
  context.strokeStyle = '#ddffe699';
  context.strokeRect(-size, -size, size * 2, size * 2);
  context.fillStyle = '#f4ffec';
  context.fillRect(-size, -size, size, 1.5);
  context.restore();
}
function resizeCanvas() {
  if ($('game-view').hidden) return;
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  view.w = rect.width;
  view.h = rect.height;
  view.dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * view.dpr);
  canvas.height = Math.round(rect.height * view.dpr);
  view.scale =
    rect.width / rect.height < 0.85
      ? Math.max(rect.width / W, rect.height / H)
      : Math.min(rect.width / W, rect.height / H);
  view.ox = (rect.width - W * view.scale) / 2;
  view.oy = (rect.height - H * view.scale) / 2;
}
function renderGame() {
  if (!run) return;
  const r = run;
  const p = r.player;
  camerafollow();
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.fillStyle = '#0c1c26';
  ctx.fillRect(0, 0, view.w, view.h);
  ctx.save();
  const shake = progress.settings.reducedMotion ? 0 : r.shake;
  ctx.translate(
    view.ox + (Math.random() - 0.5) * shake,
    view.oy + (Math.random() - 0.5) * shake,
  );
  ctx.scale(view.scale, view.scale);
  ctx.drawImage(ground, 0, 0);
  for (const gem of r.loot) drawGem(ctx, gem, r.time);
  for (const enemy of r.enemies) {
    if (enemy.windup <= 0 || enemy.spawn > 0) continue;
    ctx.save();
    ctx.setLineDash([6, 8]);
    if (enemy.type === 'boss') {
      circle(ctx, enemy.x, enemy.y, enemy.r + 18, null, '#fa83b188');
      for (let index = 0; index < 10; index++) {
        const angle = enemy.volleyAngle + (index * TAU) / 10;
        line(
          ctx,
          enemy.x + Math.cos(angle) * enemy.r,
          enemy.y + Math.sin(angle) * enemy.r,
          enemy.x + Math.cos(angle) * 230,
          enemy.y + Math.sin(angle) * 230,
          '#fa83b16b',
          2,
        );
      }
    } else if (enemy.type === 'interceptor') {
      const angle = Math.atan2(enemy.aimY - enemy.y, enemy.aimX - enemy.x);
      const x = enemy.x + Math.cos(angle) * 182;
      const y = enemy.y + Math.sin(angle) * 182;
      ctx.setLineDash([]);
      line(ctx, enemy.x, enemy.y, x, y, '#83b6ff22', enemy.r * 2);
      ctx.setLineDash([6, 8]);
      line(ctx, enemy.x, enemy.y, x, y, '#b0d8ffaa', 2);
      circle(ctx, x, y, 9, null, '#83b6ffaa');
    } else {
      line(
        ctx,
        enemy.x,
        enemy.y,
        enemy.aimX,
        enemy.aimY,
        `rgba(234,190,109,${0.25 + (0.8 - enemy.windup) * 0.7})`,
        1,
      );
      circle(ctx, enemy.aimX, enemy.aimY, 12, null, '#e8b86a88');
    }
    ctx.restore();
  }
  if (r.stats.orbitCount) {
    ctx.save();
    ctx.setLineDash([3, 10]);
    circle(ctx, p.x, p.y, r.stats.orbitRadius, null, '#8fc7e426');
    ctx.restore();
  }
  const actors = [
    ...r.enemies.filter((enemy) => !enemy.dead).map((enemy) => ({ y: enemy.y, enemy })),
    { y: p.y, player: true },
  ].sort((first, second) => first.y - second.y);
  for (const actor of actors) {
    if (actor.player) drawPlayer(ctx, p, r.time);
    else drawRobot(ctx, actor.enemy, r.time, p);
  }
  for (const orbit of orbitPositions()) {
    ctx.save();
    ctx.translate(orbit.x, orbit.y);
    ctx.rotate(r.time);
    roundRect(ctx, -7, -9, 14, 18, 2, '#284452', '#8fc7e4');
    line(ctx, -3, -5, 4, -5, '#b8dff4');
    line(ctx, -3, 0, 4, 0, '#b8dff4');
    ctx.restore();
  }
  for (const bullet of r.bullets) {
    line(
      ctx,
      bullet.x - bullet.vx * 0.013,
      bullet.y - bullet.vy * 0.013,
      bullet.x,
      bullet.y,
      bullet.critical ? '#fff6cc' : '#f5be7b',
      bullet.critical ? 4 : 3,
    );
    circle(ctx, bullet.x, bullet.y, 2.2, '#fff2ca');
  }
  for (const projectile of r.hostile) {
    circle(ctx, projectile.x, projectile.y, projectile.boss ? 13 : 9, projectile.boss ? '#fa83b125' : '#f5bb6820');
    circle(ctx, projectile.x, projectile.y, projectile.boss ? 6 : 4, projectile.boss ? '#fa83b1' : '#efbd76', projectile.boss ? '#ffe5f3' : '#fff0c6');
  }
  for (const particle of r.particles) {
    ctx.globalAlpha = clamp(particle.life / particle.max, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.fillRect(
      particle.x - particle.size / 2,
      particle.y - particle.size / 2,
      particle.size,
      particle.size,
    );
  }
  ctx.globalAlpha = 1;
  for (const ring of r.rings) {
    ctx.globalAlpha = ring.life / ring.max;
    ctx.lineWidth = 3;
    circle(ctx, ring.x, ring.y, ring.radius * (1 - ring.life / ring.max), null, ring.color);
    ctx.globalAlpha = 0.03;
    circle(ctx, ring.x, ring.y, ring.radius, '#afebdc');
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'center';
  ctx.font = 'bold 13px Consolas,monospace';
  for (const text of r.texts) {
    ctx.globalAlpha = Math.min(1, text.life * 2);
    ctx.fillStyle = text.color;
    ctx.fillText(text.text, text.x, text.y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
  if (p.hp / p.maxHp < 0.25) {
    const vignette = ctx.createRadialGradient(
      view.w / 2,
      view.h / 2,
      view.h * 0.25,
      view.w / 2,
      view.h / 2,
      view.w * 0.65,
    );
    vignette.addColorStop(0, '#8d302500');
    vignette.addColorStop(1, '#a3433b22');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, view.w, view.h);
  }
}
function camerafollow() {
  view.ox =
    W * view.scale > view.w
      ? clamp(
          view.w / 2 - run.player.x * view.scale,
          view.w - W * view.scale,
          0,
        )
      : (view.w - W * view.scale) / 2;
  view.oy =
    H * view.scale > view.h
      ? clamp(
          view.h / 2 - run.player.y * view.scale,
          view.h - H * view.scale,
          0,
        )
      : (view.h - H * view.scale) / 2;
}
function renderPreview(time) {
  const context = pctx;
  const previewTime = progress.settings.reducedMotion ? 0 : time;
  context.setTransform(
    preview.width / 660,
    0,
    0,
    preview.height / 595,
    0,
    0,
  );
  context.clearRect(0, 0, 660, 595);
  context.fillStyle = '#12242e';
  context.fillRect(0, 0, 660, 595);
  context.save();
  context.translate(-149, -5);
  context.scale(0.8, 0.8);
  context.drawImage(ground, 0, 0);
  context.lineWidth = 1;
  circle(context, 600, 391, 195, null, '#86bab725');
  context.setLineDash([3, 12]);
  circle(context, 600, 391, 226, null, '#85b4a81a');
  context.setLineDash([]);
  if (!progress.settings.reducedMotion) {
    context.save();
    context.translate(600, 391);
    context.rotate(previewTime * 0.13);
    line(context, 0, 0, 195, 0, '#9bd1bc18', 1);
    context.restore();
  }
  const ghost = { x: 608, y: 444, angle: -1.05 };
  const actors = [
    ['scout', 412, 328],
    ['enforcer', 777, 328],
    ['bulwark', 776, 570],
    ['scout', 372, 544],
    ['artillery', 834, 440],
    ['scout', 529, 242],
  ];
  for (let index = 0; index < actors.length; index++) {
    const [type, x, y] = actors[index];
    const definition = ENEMY_TYPES[type];
    drawRobot(
      context,
      {
        ...definition,
        type,
        x: x + Math.sin(previewTime * 0.5 + index) * 3,
        y: y + Math.cos(previewTime * 0.5 + index) * 3,
        id: index,
        spawn: 0,
        stun: 0,
        poison: 0,
        hit: 0,
        hp: definition.hp,
        maxHp: definition.hp,
        tier: 1,
      },
      previewTime,
      ghost,
    );
  }
  const gems = [
    [507, 439, 1],
    [553, 504, 3],
    [663, 481, 8],
    [653, 327, 1],
    [710, 502, 3],
    [468, 472, 1],
    [575, 361, 3],
  ];
  for (let index = 0; index < gems.length; index++) {
    drawGem(
      context,
      { x: gems[index][0], y: gems[index][1], value: gems[index][2], phase: index },
      previewTime,
    );
  }
  line(context, 633, 426, 657, 410, '#ffd099', 3);
  line(context, 690, 386, 714, 370, '#ffd099', 3);
  line(context, 747, 348, 752, 345, '#fff3bb', 4);
  circle(context, 608, 444, 39, null, '#ffb56c35');
  drawPlayer(context, ghost, previewTime, false);
  context.font = '8px Consolas,monospace';
  context.fillStyle = '#e1d7bf';
  context.textAlign = 'center';
  context.fillText('YOU', 608, 486);
  for (let index = 0; index < 17; index++) {
    const x = 300 + (index * 97) % 610;
    const y = 210 + (index * 79) % 420;
    context.globalAlpha = 0.15 + Math.sin(previewTime + index) * 0.08;
    context.fillStyle = '#bad9c5';
    context.fillRect(x, y, 2, 2);
  }
  context.globalAlpha = 1;
  context.restore();
  const vignette = context.createRadialGradient(330, 285, 90, 330, 285, 460);
  vignette.addColorStop(0, '#07142100');
  vignette.addColorStop(1, '#05111c90');
  context.fillStyle = vignette;
  context.fillRect(0, 0, 660, 595);
}
function loop(now) {
  const dt = Math.min(0.034, Math.max(0, (now - lastFrame) / 1000) || 1 / 60);
  lastFrame = now;
  frame++;
  if (state === 'playing') update(dt);
  Music.sync();
  if (!$('game-view').hidden) {
    renderGame();
    uiClock += dt;
    if (uiClock > 0.08) {
      uiClock = 0;
      updateHUD();
    }
  } else if (frame % 2 === 0 || progress.settings.reducedMotion) {
    renderPreview(now / 1000);
  }
  requestAnimationFrame(loop);
}

function toggleSound() {
  Sound.unlock();
  progress.settings.muted = !progress.settings.muted;
  applySettings();
  saveProgress();
  if (!progress.settings.muted) Sound.play('select');
}
function toggleMusic() {
  progress.settings.music = !progress.settings.music;
  if (progress.settings.music) Sound.unlock();
  applySettings();
  saveProgress();
}
function toggleSidebar() {
  if (!run) return;
  progress.settings.sidebarHidden = !progress.settings.sidebarHidden;
  applySettings();
  saveProgress();
  if (state === 'playing') canvas.focus({ preventScroll: true });
}
$('music-button').onclick = toggleMusic;
$('music-setting').onchange = toggleMusic;
$('sidebar-toggle').onclick = toggleSidebar;
$('start-button').onclick = startRun;
$('brief-start').onclick = startRun;
$('restart-button').onclick = startRun;
$('sound-button').onclick = toggleSound;
$('archive-button').onclick = openCollection;
$('run-archive').onclick = openCollection;
$('pause-archive').onclick = openCollection;
$('close-collection').onclick = closeCollection;
$('pause-button').onclick = pauseGame;
$('top-pause').onclick = pauseGame;
$('resume-button').onclick = resumeGame;
$('how-button').onclick = () => showDialog('brief-dialog');
$('result-home').onclick = goHome;
$('victory-home').onclick = goHome;
$('brand-button').onclick = () => {
  if (state === 'playing') pauseGame();
  else if (state === 'menu') {
    window.scrollTo({
      top: 0,
      behavior: progress.settings.reducedMotion ? 'instant' : 'smooth',
    });
  }
};
$('end-run-button').onclick = () => endRun(true);
$('award-button').onclick = () => {
  Sound.unlock();
  showVictory();
};
for (const id of ['export-home', 'export-pause', 'victory-export']) {
  $(id).onclick = exportProgress;
}
$('import-button').onclick = () => {
  if (state === 'menu') $('import-file').click();
};
$('import-file').onchange = (event) => {
  const file = event.target.files[0];
  event.target.value = '';
  importFile(file);
};
$('confirm-import').onclick = confirmImport;
$('cancel-import').onclick = () => {
  pendingImport = null;
  $('import-dialog').close();
};
$('reset-progress').onclick = openReset;
$('cancel-reset').onclick = () => $('reset-dialog').close();
$('confirm-reset').onclick = resetProgress;
$('reset-export').onclick = exportProgress;
$('victory-dialog').addEventListener('close', () => {
  if (!$('victory-dialog').open) stopCelebration();
});
$('motion-setting').onchange = () => {
  progress.settings.reducedMotion = $('motion-setting').checked;
  applySettings();
  saveProgress();
};
$('collection-search').oninput = renderCollection;
$('collection-status').onchange = renderCollection;
$('college-tabs').onclick = (event) => {
  const button = event.target.closest('[data-college]');
  if (!button) return;
  filterCollege = button.dataset.college;
  document.querySelectorAll('[data-college]').forEach((element) => {
    element.setAttribute('aria-pressed', String(element === button));
  });
  renderCollection();
};
document.querySelectorAll('[data-close]').forEach((button) => {
  button.onclick = () => $(button.dataset.close).close();
});
document.querySelectorAll('dialog').forEach((dialog) =>
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    if (dialog.id === 'level-dialog') return;
    if (dialog.id === 'collection-dialog') closeCollection();
    else if (dialog.id === 'pause-dialog') resumeGame();
    else if (dialog.id === 'result-dialog' || dialog.id === 'victory-dialog') {
      goHome();
    } else {
      if (dialog.id === 'import-dialog') pendingImport = null;
      dialog.close();
    }
  }),
);
window.addEventListener('keydown',event=>{
 if(event.target instanceof HTMLElement&&['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName))return;
 const code=event.code;
 if(code==='Escape'||code==='KeyP'){
  if(event.repeat)return;
  if(state==='playing'){event.preventDefault();pauseGame();}else if(state==='paused'){event.preventDefault();resumeGame();}else if(state==='collection'){event.preventDefault();closeCollection();}
  else if(state==='level')event.preventDefault();
  return;
 }
 if(code==='KeyM'&&!event.repeat){event.preventDefault();toggleSound();return;}
 if(code==='KeyH'&&!event.repeat&&state==='playing'){event.preventDefault();toggleSidebar();return;}
 if(state==='level'&&['Digit1','Digit2','Digit3','Numpad1','Numpad2','Numpad3'].includes(code)&&!event.repeat&&performance.now()>choiceAfter){event.preventDefault();const index=Number(code.at(-1))-1;if(offered[index])chooseMajor(offered[index].id);return;}
 if(state!=='playing')return;
 if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(code)){event.preventDefault();keys.add(code);}
 if(code==='Space'){event.preventDefault();if(!event.repeat)dash();}
});
window.addEventListener('keyup', (event) => keys.delete(event.code));
window.addEventListener('blur', () => {
  clearInput();
  if (state === 'playing') pauseGame();
  else if (state === 'collection' && collectionReturn === 'playing') {
    collectionReturn = 'paused';
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInput();
    if (state === 'playing') pauseGame();
    saveProgress();
  }
});
window.addEventListener('pagehide', saveProgress);
window.addEventListener('resize', resizeCanvas);
const pad=$('touch-pad');
function moveTouch(event) {
  if (event.pointerId !== touchPointer) return;
  const rect = pad.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  const distance = Math.hypot(x, y);
  const scale = distance > 36 ? 36 / distance : 1;
  touchVector = { x: (x * scale) / 36, y: (y * scale) / 36 };
  $('touch-knob').style.transform = `translate(${x * scale}px, ${y * scale}px)`;
}
pad.addEventListener('pointerdown', (event) => {
  if (state !== 'playing') return;
  event.preventDefault();
  touchPointer = event.pointerId;
  pad.setPointerCapture(event.pointerId);
  moveTouch(event);
});
pad.addEventListener('pointermove', moveTouch);
for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  pad.addEventListener(name, (event) => {
    if (event.pointerId !== touchPointer) return;
    touchPointer = null;
    touchVector = { x: 0, y: 0 };
    $('touch-knob').style.transform = '';
  });
}
$('touch-dash').addEventListener('pointerdown', (event) => {
  event.preventDefault();
  dash();
});

loadProgress();applySettings();refreshProgress();makeGround();
preview.width=1320;preview.height=1190;renderPreview(0);
requestAnimationFrame(loop);
})();
