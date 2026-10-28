/**
 * ==========================================================================
 * FADE & BLADE — Shared core
 * Constants, storage helpers, date/time utilities and availability engine.
 * Loaded before js/app.js and js/admin.js on both pages.
 * ==========================================================================
 */

const FB_KEYS = {
  gallery: 'fb_gallery_items',
  appointments: 'fb_appointments',
  blocked: 'fb_blocked_slots',
  session: 'fb_admin_session',
  client: 'fb_client_id'
};

const FIRST_AVAILABLE = 'First Available Master Barber';

const ALL_BARBERS = ['Marcus Rivera', 'Jake Thompson', 'D\'Angelo Brooks'];

const GALLERY_CATEGORIES = {
  fade: 'Skin Fades',
  beard: 'Beard Sculpting',
  classic: 'Classic Cuts',
  modern: 'Modern Art & Color',
  shop: 'Shop Vibe'
};

const STANDARD_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM'
];

const SERVICES = [
  {
    name: 'Classic Haircut',
    price: 35,
    duration: 45,
    description: 'Spălat, tuns foarfecă & mașină, styling'
  },
  {
    name: 'Signature Skin Fade',
    price: 40,
    duration: 50,
    description: 'Pierdut la piele cu shaver foil & contur brici'
  },
  {
    name: 'Royal Hot Towel Shave',
    price: 30,
    duration: 30,
    description: 'Brici clasic & prosoape fierbinți cu eucalipt'
  },
  {
    name: 'Beard Sculpting',
    price: 25,
    duration: 25,
    description: 'Arhitectură barbă & tratament cu uleiuri hidratante'
  },
  {
    name: 'The Royal Treatment',
    price: 85,
    duration: 90,
    description: 'Tuns + bărbierit + barbă + mască de argilă'
  },
  {
    name: 'Freestyle Hair Art & Color',
    price: 55,
    duration: 60,
    description: 'Desene geometrice rase & nuanțare / decolorare'
  }
];

const SERVICE_ALIASES = {
  'Beard Sculpting & Trim': 'Beard Sculpting'
};

// Minutes from midnight. Every day has a schedule; keep in sync with the
// programme displayed on the website.
const SHOP_SCHEDULE = {
  0: { open: 10 * 60, close: 16 * 60, label: 'Duminică' },
  1: { open: 9 * 60, close: 20 * 60, label: 'Luni' },
  2: { open: 9 * 60, close: 20 * 60, label: 'Marți' },
  3: { open: 9 * 60, close: 20 * 60, label: 'Miercuri' },
  4: { open: 9 * 60, close: 20 * 60, label: 'Joi' },
  5: { open: 9 * 60, close: 20 * 60, label: 'Vineri' },
  6: { open: 8 * 60, close: 18 * 60, label: 'Sâmbătă' }
};

const SLOT_LEAD_MINUTES = 30;
const DEFAULT_BLOCK_DURATION = 60;

const DEFAULT_GALLERY = [
  {
    id: 1,
    title: 'Mid Drop Fade cu Vârf Texturat',
    category: 'fade',
    barber: 'Marcus Rivera',
    imageUrl: 'images/galerie-mid-drop-fade.jpg',
    featured: true
  },
  {
    id: 2,
    title: 'Precision Beard Sculpting & Razor Edge',
    category: 'beard',
    barber: 'Jake Thompson',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 3,
    title: 'Traditional Hot Towel Straight Razor Shave',
    category: 'classic',
    barber: 'Marcus Rivera',
    imageUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 4,
    title: 'Modern Textured Pompadour',
    category: 'classic',
    barber: 'D\'Angelo Brooks',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 5,
    title: 'Downtown Lounge Heritage Interior',
    category: 'shop',
    barber: 'Fade & Blade',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 6,
    title: 'High Taper with Natural Waves',
    category: 'fade',
    barber: 'Marcus Rivera',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 7,
    title: 'Razor Sharp Lineup & Beard Gradient',
    category: 'beard',
    barber: 'Jake Thompson',
    imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 8,
    title: 'Executive Scissor Crop & Side Part',
    category: 'classic',
    barber: 'D\'Angelo Brooks',
    imageUrl: 'images/galerie-clasic-foarfeca.jpg',
    featured: false
  },
  {
    id: 9,
    title: 'Geometric Hair Art & Bleached Contrast',
    category: 'modern',
    barber: 'D\'Angelo Brooks',
    imageUrl: 'images/galerie-hair-art.jpg',
    featured: false
  },
  {
    id: 10,
    title: 'Zero Skin Fade & Textured Crop',
    category: 'fade',
    barber: 'Marcus Rivera',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 11,
    title: 'Vintage Apothecary & Razor Station',
    category: 'shop',
    barber: 'Fade & Blade',
    imageUrl: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 12,
    title: 'Precision Master Barber in Action',
    category: 'shop',
    barber: 'Marcus Rivera',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    featured: false
  }
].map(item => ({
  ...item,
  categoryLabel: GALLERY_CATEGORIES[item.category] || item.category
}));

/* ── Service helpers ─────────────────────────────────────────────────────── */

function normalizeServiceName(name) {
  return SERVICE_ALIASES[name] || name;
}

function getService(name) {
  const normalized = normalizeServiceName(name);
  return SERVICES.find(service => service.name === normalized) || null;
}

function getServiceDuration(name) {
  const service = getService(name);
  return service ? service.duration : 60;
}

function getServicePrice(name) {
  const service = getService(name);
  return service ? service.price : 0;
}

/* ── Formatting helpers ──────────────────────────────────────────────────── */

function pad2(value) {
  return String(value).padStart(2, '0');
}

function formatMoney(value) {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

function parseTimeToMinutes(label) {
  if (!label) return NaN;
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(label).trim());
  if (!match) return NaN;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(match[2]);
}

function minutesToTimeLabel(minutes) {
  const total = ((Number(minutes) % 1440) + 1440) % 1440;
  const hours24 = Math.floor(total / 60);
  const mins = total % 60;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  return `${pad2(hours12)}:${pad2(mins)} ${suffix}`;
}

function getLocalISODate(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function shiftISODate(isoDate, days) {
  const parts = String(isoDate).split('-').map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  date.setDate(date.getDate() + Number(days || 0));
  return getLocalISODate(date);
}

function getShopHours(isoDate) {
  if (!isoDate) return null;
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return SHOP_SCHEDULE[date.getDay()] || null;
}

function isPastSlot(isoDate, startMinutes) {
  const today = getLocalISODate();
  if (isoDate < today) return true;
  if (isoDate > today) return false;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return startMinutes <= nowMinutes + SLOT_LEAD_MINUTES;
}

function dateFromISOAndSlot(isoDate, slot) {
  const parts = String(isoDate).split('-').map(Number);
  const minutes = parseTimeToMinutes(slot);
  if (parts.length !== 3 || Number.isNaN(minutes)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2], Math.floor(minutes / 60), minutes % 60, 0, 0);
}

function toUtcStamp(date) {
  return `${date.getUTCFullYear()}${pad2(date.getUTCMonth() + 1)}${pad2(date.getUTCDate())}T${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}${pad2(date.getUTCSeconds())}Z`;
}

function formatPrettyDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('ro-RO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"'`]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function icsEscape(value) {
  return String(value == null ? '' : value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function isValidImageUrl(url) {
  return /^(https?:\/\/|\.{1,2}\/|\/|images\/)/i.test(String(url || '').trim());
}

// The admin panel lives in /admin/, so root-relative image paths stored for
// the public gallery must be prefixed with ../ when previewed there.
function resolveAdminImageUrl(url) {
  const value = String(url || '').trim();
  if (/^images\//i.test(value)) return `../${value}`;
  return value;
}

/* ── Safe storage helpers ────────────────────────────────────────────────── */

function safeGetJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch (error) {
    console.warn(`[Fade & Blade] Nu am putut citi "${key}" din localStorage.`, error);
    return fallback;
  }
}

function safeSetJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[Fade & Blade] Nu am putut salva "${key}" în localStorage.`, error);
    return false;
  }
}

function getStoredAppointments() {
  const list = safeGetJSON(FB_KEYS.appointments, []);
  return Array.isArray(list) ? list : [];
}

function setStoredAppointments(list) {
  return safeSetJSON(FB_KEYS.appointments, Array.isArray(list) ? list : []);
}

function getStoredBlockedSlots() {
  const list = safeGetJSON(FB_KEYS.blocked, []);
  return Array.isArray(list) ? list : [];
}

function setStoredBlockedSlots(list) {
  return safeSetJSON(FB_KEYS.blocked, Array.isArray(list) ? list : []);
}

function getStoredGallery() {
  const list = safeGetJSON(FB_KEYS.gallery, []);
  return Array.isArray(list) ? list : [];
}

function setStoredGallery(list) {
  return safeSetJSON(FB_KEYS.gallery, Array.isArray(list) ? list : []);
}

let cachedClientId = null;

function getClientId() {
  if (cachedClientId) return cachedClientId;
  try {
    let id = window.localStorage.getItem(FB_KEYS.client);
    if (!id) {
      const randomPart = (window.crypto && typeof window.crypto.randomUUID === 'function')
        ? window.crypto.randomUUID()
        : `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
      id = `client-${randomPart}`;
      window.localStorage.setItem(FB_KEYS.client, id);
    }
    cachedClientId = id;
    return id;
  } catch (error) {
    cachedClientId = `client-session-${Math.random().toString(36).slice(2)}`;
    return cachedClientId;
  }
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function generateBookingCode(existingAppointments = []) {
  const used = new Set((existingAppointments || []).map(item => item.code));
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const code = `FB-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!used.has(code)) return code;
  }
  return `FB-${Date.now().toString().slice(-6)}`;
}

/* ── Seed data (same in public site and admin panel) ─────────────────────── */

function cloneDefaultGallery() {
  return DEFAULT_GALLERY.map(item => ({ ...item }));
}

function getSeedAppointments() {
  const today = getLocalISODate();
  const tomorrow = shiftISODate(today, 1);
  const classic = getService('Classic Haircut');
  const beard = getService('Beard Sculpting');
  const fade = getService('Signature Skin Fade');
  const royal = getService('The Royal Treatment');

  return [
    {
      id: 1001,
      code: 'FB-4102',
      clientId: 'seed-client',
      isSeed: true,
      name: 'Victor Danilov',
      phone: '(555) 345-9821',
      email: 'victor@example.com',
      service: classic.name,
      price: classic.price,
      duration: `${classic.duration} min`,
      durationMinutes: classic.duration,
      barber: 'Marcus Rivera',
      date: today,
      slot: '10:00 AM',
      status: 'confirmed',
      notes: 'Keep hair longer on crown, mid taper'
    },
    {
      id: 1002,
      code: 'FB-8821',
      clientId: 'seed-client',
      isSeed: true,
      name: 'Stefan Popov',
      phone: '(555) 789-1122',
      email: 'stefan@example.com',
      service: beard.name,
      price: beard.price,
      duration: `${beard.duration} min`,
      durationMinutes: beard.duration,
      barber: 'Jake Thompson',
      date: today,
      slot: '01:00 PM',
      status: 'confirmed',
      notes: 'Beard line-up with sharp razor edge'
    },
    {
      id: 1003,
      code: 'FB-9310',
      clientId: 'seed-client',
      isSeed: true,
      name: 'Mihai Cazacu',
      phone: '(555) 654-7788',
      email: 'mihai@example.com',
      service: fade.name,
      price: fade.price,
      duration: `${fade.duration} min`,
      durationMinutes: fade.duration,
      barber: 'Marcus Rivera',
      date: tomorrow,
      slot: '10:00 AM',
      status: 'confirmed',
      notes: 'Zero foil skin fade'
    },
    {
      id: 1004,
      code: 'FB-6502',
      clientId: 'seed-client',
      isSeed: true,
      name: 'Alexei Rusu',
      phone: '(555) 432-8899',
      email: 'alexei@example.com',
      service: royal.name,
      price: royal.price,
      duration: `${royal.duration} min`,
      durationMinutes: royal.duration,
      barber: 'D\'Angelo Brooks',
      date: tomorrow,
      slot: '03:00 PM',
      status: 'confirmed',
      notes: 'Full works before photo shoot'
    }
  ];
}

function ensureSeedData() {
  // 1. Gallery
  const storedGallery = safeGetJSON(FB_KEYS.gallery, null);
  if (!Array.isArray(storedGallery)) {
    safeSetJSON(FB_KEYS.gallery, cloneDefaultGallery());
  } else {
    const normalized = storedGallery.map(item => ({
      ...item,
      categoryLabel: GALLERY_CATEGORIES[item.category] || item.categoryLabel || item.category || 'Portofoliu'
    }));
    if (JSON.stringify(normalized) !== JSON.stringify(storedGallery)) {
      safeSetJSON(FB_KEYS.gallery, normalized);
    }
  }

  // 2. Appointments — migrate records created by older versions and make sure
  // every record has a client id + duration, so availability stays correct.
  const storedAppointments = safeGetJSON(FB_KEYS.appointments, null);
  if (!Array.isArray(storedAppointments)) {
    safeSetJSON(FB_KEYS.appointments, getSeedAppointments());
  } else {
    const myClientId = getClientId();
    let changed = false;
    const normalized = storedAppointments.map(appointment => {
      const next = { ...appointment };
      if (!next.clientId) {
        const numericId = Number(next.id);
        if (next.isSeed || (numericId >= 1001 && numericId <= 1004)) {
          next.isSeed = true;
          next.clientId = 'seed-client';
        } else {
          next.clientId = myClientId;
        }
        changed = true;
      }
      if (!next.durationMinutes) {
        next.durationMinutes = getServiceDuration(next.service);
        next.duration = `${next.durationMinutes} min`;
        changed = true;
      }
      return next;
    });
    if (changed) safeSetJSON(FB_KEYS.appointments, normalized);
  }

  // 3. Blocked slots
  if (!Array.isArray(safeGetJSON(FB_KEYS.blocked, null))) {
    safeSetJSON(FB_KEYS.blocked, []);
  }
}

/* ── Availability engine ─────────────────────────────────────────────────── */

function getAppointmentStartMinutes(appointment) {
  return parseTimeToMinutes(appointment && appointment.slot);
}

function getAppointmentDuration(appointment) {
  if (!appointment) return 60;
  return Number(appointment.durationMinutes) || getServiceDuration(appointment.service);
}

function timeRangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function isBarberBlocked(date, startMinutes, durationMinutes, barberName) {
  const start = Number(startMinutes);
  const duration = Number(durationMinutes) || 60;
  return getStoredBlockedSlots().some(block => {
    if (block.date !== date) return false;
    if (barberName !== FIRST_AVAILABLE && block.barber !== barberName) return false;
    const blockStart = parseTimeToMinutes(block.slot);
    if (Number.isNaN(blockStart)) return false;
    const blockDuration = Number(block.durationMinutes) || DEFAULT_BLOCK_DURATION;
    return timeRangesOverlap(start, start + duration, blockStart, blockStart + blockDuration);
  });
}

function hasAppointmentConflict(date, startMinutes, durationMinutes, barberName) {
  const start = Number(startMinutes);
  const duration = Number(durationMinutes) || 60;
  return getStoredAppointments().some(appointment => {
    if (appointment.date !== date) return false;
    if (appointment.status === 'cancelled') return false;
    if (appointment.barber !== barberName) return false;
    const appointmentStart = getAppointmentStartMinutes(appointment);
    if (Number.isNaN(appointmentStart)) return false;
    return timeRangesOverlap(
      start,
      start + duration,
      appointmentStart,
      appointmentStart + getAppointmentDuration(appointment)
    );
  });
}

function getBarberConflict(date, startMinutes, durationMinutes, barberName) {
  if (isBarberBlocked(date, startMinutes, durationMinutes, barberName)) return 'blocked';
  if (hasAppointmentConflict(date, startMinutes, durationMinutes, barberName)) return 'booked';
  return null;
}

function isBarberAvailable(date, startMinutes, durationMinutes, barberName) {
  if (barberName === FIRST_AVAILABLE) {
    return ALL_BARBERS.some(barber => isBarberAvailable(date, startMinutes, durationMinutes, barber));
  }
  return getBarberConflict(date, startMinutes, durationMinutes, barberName) === null;
}

function getSlotStatus(date, slot, barberName, serviceName) {
  const startMinutes = parseTimeToMinutes(slot);
  const durationMinutes = getServiceDuration(serviceName);
  const hours = getShopHours(date);

  if (Number.isNaN(startMinutes) || !hours) {
    return { status: 'closed', label: 'Închis', startMinutes, durationMinutes };
  }
  if (startMinutes < hours.open || startMinutes + durationMinutes > hours.close) {
    return { status: 'closed', label: 'Închis', startMinutes, durationMinutes };
  }
  if (isPastSlot(date, startMinutes)) {
    return { status: 'past', label: 'Trecut', startMinutes, durationMinutes };
  }
  if (!isBarberAvailable(date, startMinutes, durationMinutes, barberName)) {
    return { status: 'booked', label: 'Ocupat', startMinutes, durationMinutes };
  }
  return { status: 'available', label: '', startMinutes, durationMinutes };
}

function findAvailableBarber(date, slot, serviceName) {
  const startMinutes = parseTimeToMinutes(slot);
  const durationMinutes = getServiceDuration(serviceName);
  if (Number.isNaN(startMinutes)) return null;
  return ALL_BARBERS.find(barber => isBarberAvailable(date, startMinutes, durationMinutes, barber)) || null;
}
