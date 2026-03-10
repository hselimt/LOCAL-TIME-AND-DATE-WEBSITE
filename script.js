// ─── GLOBAL STATE ────────────────────────
let use24h       = true;
let activeTheme  = "dark";
let expandedCity = null;
let overlayTimer = null;

const timeZones = {
  'local'   : Intl.DateTimeFormat().resolvedOptions().timeZone,
  'New-York': 'America/New_York',
  'London'  : 'Europe/London',
  'Paris'   : 'Europe/Paris',
  'Tokyo'   : 'Asia/Tokyo',
};

const cityMeta = {
  'New-York': { label: 'New York' },
  'London'  : { label: 'London'   },
  'Paris'   : { label: 'Paris'    },
  'Tokyo'   : { label: 'Tokyo'    },
  'local'   : { label: 'Local'    },
};

// ordered list for arrow-key cycling with mod (%)
const cityList = ['New-York', 'London', 'local', 'Paris', 'Tokyo'];

const months = [
  "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
  "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
];

// city name → timezone lookup for search
const citySearchMap = {
  'new york'       : 'America/New_York',
  'new york city'  : 'America/New_York',
  'nyc'            : 'America/New_York',
  'london'         : 'Europe/London',
  'paris'          : 'Europe/Paris',
  'tokyo'          : 'Asia/Tokyo',
  'istanbul'       : 'Europe/Istanbul',
  'berlin'         : 'Europe/Berlin',
  'dubai'          : 'Asia/Dubai',
  'singapore'      : 'Asia/Singapore',
  'sydney'         : 'Australia/Sydney',
  'los angeles'    : 'America/Los_Angeles',
  'la'             : 'America/Los_Angeles',
  'chicago'        : 'America/Chicago',
  'toronto'        : 'America/Toronto',
  'moscow'         : 'Europe/Moscow',
  'beijing'        : 'Asia/Shanghai',
  'shanghai'       : 'Asia/Shanghai',
  'seoul'          : 'Asia/Seoul',
  'mumbai'         : 'Asia/Kolkata',
  'delhi'          : 'Asia/Kolkata',
  'cairo'          : 'Africa/Cairo',
  'rome'           : 'Europe/Rome',
  'madrid'         : 'Europe/Madrid',
  'amsterdam'      : 'Europe/Amsterdam',
  'mexico city'    : 'America/Mexico_City',
  'sao paulo'      : 'America/Sao_Paulo',
  'buenos aires'   : 'America/Argentina/Buenos_Aires',
  'johannesburg'   : 'Africa/Johannesburg',
  'hong kong'      : 'Asia/Hong_Kong',
  'bangkok'        : 'Asia/Bangkok',
  'jakarta'        : 'Asia/Jakarta',
  'karachi'        : 'Asia/Karachi',
  'lagos'          : 'Africa/Lagos',
  'nairobi'        : 'Africa/Nairobi',
  'riyadh'         : 'Asia/Riyadh',
  'tehran'         : 'Asia/Tehran',
  'athens'         : 'Europe/Athens',
  'warsaw'         : 'Europe/Warsaw',
  'stockholm'      : 'Europe/Stockholm',
  'oslo'           : 'Europe/Oslo',
  'helsinki'       : 'Europe/Helsinki',
  'vienna'         : 'Europe/Vienna',
  'zurich'         : 'Europe/Zurich',
  'brussels'       : 'Europe/Brussels',
  'lisbon'         : 'Europe/Lisbon',
  'prague'         : 'Europe/Prague',
  'budapest'       : 'Europe/Budapest',
  'bucharest'      : 'Europe/Bucharest',
  'kyiv'           : 'Europe/Kyiv',
  'manila'         : 'Asia/Manila',
  'kuala lumpur'   : 'Asia/Kuala_Lumpur',
  'colombo'        : 'Asia/Colombo',
  'dhaka'          : 'Asia/Dhaka',
  'kathmandu'      : 'Asia/Kathmandu',
  'tashkent'       : 'Asia/Tashkent',
  'almaty'         : 'Asia/Almaty',
  'auckland'       : 'Pacific/Auckland',
  'honolulu'       : 'Pacific/Honolulu',
  'anchorage'      : 'America/Anchorage',
  'denver'         : 'America/Denver',
  'phoenix'        : 'America/Phoenix',
  'miami'          : 'America/New_York',
  'boston'         : 'America/New_York',
  'seattle'        : 'America/Los_Angeles',
  'san francisco'  : 'America/Los_Angeles',
  'sf'             : 'America/Los_Angeles',
  'vancouver'      : 'America/Vancouver',
  'montreal'       : 'America/Toronto',
  'bogota'         : 'America/Bogota',
  'lima'           : 'America/Lima',
  'santiago'       : 'America/Santiago',
  'caracas'        : 'America/Caracas',
  'casablanca'     : 'Africa/Casablanca',
  'accra'          : 'Africa/Accra',
  'addis ababa'    : 'Africa/Addis_Ababa',
  'dar es salaam'  : 'Africa/Dar_es_Salaam',
  'ankara'         : 'Europe/Istanbul',
};


// ─── THEME — switch-case, getElementById, getElementsByClassName, getElementsByTagName ───
function changeTheme(theme) {
  activeTheme = theme;

  document.getElementById("btnDark").classList.toggle("active",  theme === "dark");
  document.getElementById("btnLight").classList.toggle("active", theme === "light");

  // getElementsByClassName
  const timeEls = document.getElementsByClassName("time");
  const dateEls = document.getElementsByClassName("date");
  const cardEls = document.getElementsByClassName("date-time");

  // getElementsByTagName
  const h2Els = document.getElementsByTagName("h2");

  const topBars = document.querySelectorAll(".top-bar");
  const btns    = document.querySelectorAll(".toggle-btn");

  switch (activeTheme) {
    case "dark":
      document.body.style.background = "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)";
      document.body.style.color = "#f1f1f1";
      for (let el of timeEls) el.style.color = "#f1f1f1";
      for (let el of dateEls) el.style.color = "#bfc0c0";
      for (let el of cardEls) el.style.backgroundColor = "rgba(255,255,255,0.1)";
      for (let el of h2Els)   el.style.color = "#4cc9f0";
      // getElementById
      document.getElementById("time-local").style.color = "#f72585";
      document.getElementById("date-local").style.color = "#4cc9f0";
      for (let b of topBars) { b.style.background = "rgba(255,255,255,0.06)"; b.style.borderColor = "rgba(255,255,255,0.1)"; }
      for (let b of btns) b.style.color = "";
      document.getElementById("citySearch").style.background = "transparent";
      document.getElementById("citySearch").style.color = "#f1f1f1";
      // overlay colors
      document.querySelector(".overlay").style.background = "rgba(5, 5, 20, 0.94)";
      document.querySelector(".overlay-content") && (() => {
        document.querySelector(".overlay-city-name").style.color = "#4cc9f0";
        document.querySelector(".overlay-time-text").style.color = "#f1f1f1";
        document.querySelector(".overlay-date-text").style.color = "#bfc0c0";
      })();
      break;

    case "light":
      document.body.style.background = "linear-gradient(135deg, #dfe9f3, #e8f4f8, #f0f8ff)";
      document.body.style.color = "#1a1a2e";
      for (let el of timeEls) el.style.color = "#1a1a2e";
      for (let el of dateEls) el.style.color = "#555";
      for (let el of cardEls) el.style.backgroundColor = "rgba(255,255,255,0.75)";
      for (let el of h2Els)   el.style.color = "#0077b6";
      document.getElementById("time-local").style.color = "#e63946";
      document.getElementById("date-local").style.color = "#0077b6";
      for (let b of topBars) { b.style.background = "rgba(0,0,0,0.1)"; b.style.borderColor = "rgba(0,0,0,0.15)"; }
      for (let b of btns) b.style.color = "rgba(0,0,0,0.45)";
      for (let b of document.querySelectorAll(".toggle-btn.active")) b.style.color = "#1a1a2e";
      document.getElementById("citySearch").style.background = "transparent";
      document.getElementById("citySearch").style.color = "#1a1a2e";
      // overlay colors
      document.querySelector(".overlay").style.background = "rgba(220, 230, 240, 0.96)";
      document.querySelector(".overlay-content") && (() => {
        document.querySelector(".overlay-city-name").style.color = "#0077b6";
        document.querySelector(".overlay-time-text").style.color = "#1a1a2e";
        document.querySelector(".overlay-date-text").style.color = "#555";
      })();
      break;

    default:
      // fallback to dark
      changeTheme("dark");
      return;
  }
}


// ─── FORMAT TOGGLE — 24H/12H, flip animation on getElementsByClassName("time") ───
function changeFormat(is24h) {
  use24h = is24h;
  document.getElementById("btn24h").classList.toggle("active",  is24h);
  document.getElementById("btn12h").classList.toggle("active", !is24h);

  const timeEls = document.getElementsByClassName("time");
  for (let el of timeEls) {
    el.classList.remove("time-flip");
    void el.offsetWidth;          // reflow to restart animation
    el.classList.add("time-flip");
  }

  updateClock();
  changeTheme(activeTheme);       // re-apply theme so button colors stay correct
}

function formatTime(h, m, s) {
  const mm = m.toString().padStart(2, '0');
  const ss = s.toString().padStart(2, '0');
  if (use24h) return `${h.toString().padStart(2, '0')}:${mm}:${ss}`;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = (h % 12 || 12).toString().padStart(2, '0');
  return `${h12}:${mm}:${ss} ${period}`;
}


// ─── HAND ROTATION — prevents backward snap at 359° → 0° ───
const prevDeg = {};
function setHandRotation(id, deg) {
  const el = document.getElementById(id);
  if (!el) return;
  const prev = prevDeg[id];
  if (prev !== undefined) {
    let diff = deg - (prev % 360);
    if (diff < -180) diff += 360;
    deg = prev + diff;
  }
  prevDeg[id] = deg;
  el.style.transform = `translate(-50%,-100%) rotate(${deg}deg)`;
}


// ─── COUNTDOWN — subtraction, division, mod (%), && logical operator ───
function updateCountdown() {
  const now     = new Date();
  const elapsed = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const remaining = 86400 - elapsed;   // subtraction

  const hoursLeft   = Math.floor(remaining / 3600);          // division
  const minutesLeft = Math.floor((remaining % 3600) / 60);   // mod (%)

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getDate()} ${months[tomorrow.getMonth()].slice(0,3)}`;

  const countdownEl = document.getElementById("countdownText");
  let text;
  // && logical operator
  if (hoursLeft === 0 && minutesLeft === 0) {
    text = `🎉 Midnight!`;
  } else if (hoursLeft === 0) {
    text = `${tomorrowStr} — ${minutesLeft}m to local midnight`;
  } else {
    text = `${tomorrowStr} — ${hoursLeft}h ${minutesLeft}m to local midnight`;
  }

  countdownEl.textContent = text;
  // && — turns red in the last minute
  countdownEl.style.color = (hoursLeft === 0 && minutesLeft <= 1) ? "#e63946" : "";
}


// ─── CITY SEARCH — createElement, appendChild, shake animation on invalid input ───
function searchCity() {
  const input = document.getElementById("citySearch");
  const query = input.value.trim().toLowerCase();
  if (!query) return;

  const tz = citySearchMap[query];

  if (!tz) {
    // invalid city — shake + red border
    input.classList.remove("input-error");
    void input.offsetWidth;
    input.classList.add("input-error");
    setTimeout(() => input.classList.remove("input-error"), 900);
    return;
  }

  const label = query.replace(/\b\w/g, c => c.toUpperCase());

  const tempKey = "__search__";
  timeZones[tempKey] = tz;
  cityMeta[tempKey]  = { label };

  input.value = "";
  expandCard(tempKey);
}


// ─── OVERLAY — createElement + appendChild, if-else time of day, onclick opens ───
function expandCard(city) {
  expandedCity = city;
  document.getElementById("overlayCity").textContent =
    cityMeta[city] ? cityMeta[city].label : city;
  document.getElementById("overlay").classList.add("active");
  document.body.style.overflow = "hidden";

  // createElement + appendChild — build time-of-day badge
  const oldBadge = document.getElementById("todBadge");
  if (oldBadge) oldBadge.remove();

  const badge = document.createElement("div");
  badge.id = "todBadge";
  badge.className = "tod-badge";

  const label = document.createElement("span");
  label.id = "todLabel";
  label.className = "tod-label";
  badge.appendChild(label);

  const dateEl = document.getElementById("overlayDate");
  dateEl.after(badge);

  // hide nav hint when arrow keys won't work (search cities)
  const navHint = document.querySelector(".overlay-nav-hint");
  if (navHint) {
    navHint.style.display = cityList.includes(city) ? "" : "none";
  }

  updateOverlayClock();
  overlayTimer = setInterval(updateOverlayClock, 1000);
}

function updateOverlayClock() {
  if (!expandedCity) return;

  const tz = timeZones[expandedCity] || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const ct = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));

  const h = ct.getHours(), m = ct.getMinutes(), s = ct.getSeconds();

  document.getElementById("overlayDigital").textContent = formatTime(h, m, s);
  document.getElementById("overlayDate").textContent =
    `${ct.getDate()} ${months[ct.getMonth()]} ${ct.getFullYear()}`;

  // analog hand rotation
  const hDeg = (360/12)*(h%12) + (360/12)*(m/60);
  const mDeg = (360/60)*m;
  const sDeg = (360/60)*s;

  setHandRotation("overlayHour",   hDeg);
  setHandRotation("overlayMinute", mDeg);
  setHandRotation("overlaySecond", sDeg);

  // if-else — determine time of day
  let timeOfDay;
  if (h >= 6 && h < 12)       timeOfDay = "Morning";
  else if (h >= 12 && h < 17) timeOfDay = "Afternoon";
  else if (h >= 17 && h < 21) timeOfDay = "Evening";
  else                         timeOfDay = "Night";

  const todLabel = document.getElementById("todLabel");
  if (todLabel) todLabel.textContent = timeOfDay;
}

function closeCard() {
  clearInterval(overlayTimer);
  overlayTimer = null;
  // remove dynamically created badge
  const badge = document.getElementById("todBadge");
  if (badge) badge.remove();
  // clean up temp search city
  if (expandedCity === "__search__") {
    delete timeZones["__search__"];
    delete cityMeta["__search__"];
  }
  expandedCity = null;
  document.getElementById("overlay").classList.remove("active");
  document.body.style.overflow = "";
}


// ─── KEYDOWN — ESC closes overlay, ArrowRight/ArrowLeft cycle with mod (%) ───
document.addEventListener("keydown", function(e) {
  // ESC — close overlay
  if (e.key === "Escape" && expandedCity) {
    closeCard();
    return;
  }

  // ArrowRight / ArrowLeft — mod (%) wraps index
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    if (!expandedCity) return;

    const currentIndex = cityList.indexOf(expandedCity);
    if (currentIndex === -1) return;

    const direction = e.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + direction + cityList.length) % cityList.length;

    closeCard();
    setTimeout(() => expandCard(cityList[nextIndex]), 50);
  }
});


// ─── MOUSE EVENTS — mouseover, mouseout, click via addEventListener ───
function addMouseEvents() {
  cityList.forEach(city => {
    const card = document.getElementById(`card-${city}`);
    if (!card) return;

    // mouseover — lift card
    card.addEventListener("mouseover", function () {
      this.style.transform = "translateY(-5px)";
      this.style.cursor    = "pointer";
    });

    // mouseout — return card
    card.addEventListener("mouseout", function () {
      this.style.transform = "translateY(0)";
    });

    // click — open overlay
    card.addEventListener("click", function () {
      expandCard(city);
    });
  });
}


// ─── MAIN CLOCK — updates every second ───
function updateClock() {
  const isMobile = window.innerWidth <= 500;

  Object.keys(timeZones).forEach(city => {
    if (city === "__search__") return;
    const ct = new Date(
      new Date().toLocaleString("en-US", { timeZone: timeZones[city] })
    );
    const h = ct.getHours(), m = ct.getMinutes(), s = ct.getSeconds();
    const month = months[ct.getMonth()];

    document.getElementById(`date-${city}`).textContent =
      `${ct.getDate()} ${isMobile ? month.slice(0,3) : month} ${ct.getFullYear()}`;
    document.getElementById(`time-${city}`).textContent = formatTime(h, m, s);

    const hDeg = (360/12)*(h%12) + (360/12)*(m/60);
    const mDeg = (360/60)*m;
    const sDeg = (360/60)*s;
    setHandRotation(`hour-${city}`,   hDeg);
    setHandRotation(`minute-${city}`, mDeg);
    setHandRotation(`second-${city}`, sDeg);
  });
}

function setLocalCityName() {
  const el = document.querySelector('.local-clock h2');
  if (!el) return;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const parts = tz.split('/');
  el.textContent = parts.length > 1 ? parts[parts.length-1].replace(/_/g,' ') : 'Local';
}

// onload
window.onload = function () {
  setLocalCityName();
  addMouseEvents();
  updateCountdown();
  setInterval(updateClock,      1000);
  setInterval(updateCountdown,  1000);
  updateClock();
};
