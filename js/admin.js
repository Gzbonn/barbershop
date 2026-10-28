/**
 * ==========================================================================
 * FADE & BLADE — Admin & Barber Management Portal
 * JavaScript Controller (js/admin.js)
 * ==========================================================================
 */

// ── Barber Accounts Definition ──────────────────────────────────────────────
const BARBERS = {
  '1': {
    id: '1',
    username: '1',
    password: '1',
    name: 'Marcus Rivera',
    role: 'Founder & Head Barber',
    specialty: 'Skin Fade & Geometry Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  '2': {
    id: '2',
    username: '2',
    password: '2',
    name: 'Jake Thompson',
    role: 'Senior Barber',
    specialty: 'Beard Sculptor & Hot Razor Expert',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'
  },
  '3': {
    id: '3',
    username: '3',
    password: '3',
    name: 'D\'Angelo Brooks',
    role: 'Style Specialist',
    specialty: 'Scissor Texture & Color Artisan',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80'
  },
  'admin': {
    id: 'admin',
    username: 'admin',
    password: 'admin',
    name: 'Master Admin',
    role: 'Shop Manager',
    specialty: 'All Barbers & Floor Operations',
    avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=120&q=80'
  }
};

// ── Default 12 Gallery Items Seed ───────────────────────────────────────────
const DEFAULT_GALLERY = [
  {
    id: 1,
    title: 'Zero Skin Fade & Textured Crop',
    category: 'fade',
    categoryLabel: 'Skin Fades',
    barber: 'Marcus Rivera',
    imageUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80',
    featured: true
  },
  {
    id: 2,
    title: 'Precision Beard Sculpting & Razor Edge',
    category: 'beard',
    categoryLabel: 'Beard Sculpt',
    barber: 'Jake Thompson',
    imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 3,
    title: 'Traditional Hot Towel Straight Razor Shave',
    category: 'classic',
    categoryLabel: 'Classic Cuts',
    barber: 'Marcus Rivera',
    imageUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 4,
    title: 'Modern Textured Pompadour',
    category: 'classic',
    categoryLabel: 'Classic Cuts',
    barber: 'D\'Angelo Brooks',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 5,
    title: 'Downtown Lounge Heritage Interior',
    category: 'shop',
    categoryLabel: 'Shop Vibe',
    barber: 'Fade & Blade',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 6,
    title: 'High Taper with Natural Waves',
    category: 'fade',
    categoryLabel: 'Skin Fades',
    barber: 'Marcus Rivera',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 7,
    title: 'Razor Sharp Lineup & Beard Gradient',
    category: 'beard',
    categoryLabel: 'Beard Sculpt',
    barber: 'Jake Thompson',
    imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 8,
    title: 'Executive Scissor Crop & Side Part',
    category: 'classic',
    categoryLabel: 'Classic Cuts',
    barber: 'D\'Angelo Brooks',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 9,
    title: 'Geometric Hair Art & Bleached Contrast',
    category: 'modern',
    categoryLabel: 'Modern Art',
    barber: 'D\'Angelo Brooks',
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 10,
    title: 'Mid Drop Fade with Textured Top',
    category: 'fade',
    categoryLabel: 'Skin Fades',
    barber: 'Marcus Rivera',
    imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 11,
    title: 'Vintage Apothecary & Razor Station',
    category: 'shop',
    categoryLabel: 'Shop Vibe',
    barber: 'Fade & Blade',
    imageUrl: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=800&q=80',
    featured: false
  },
  {
    id: 12,
    title: 'Precision Master Barber in Action',
    category: 'shop',
    categoryLabel: 'Shop Vibe',
    barber: 'Marcus Rivera',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

// Current logged in barber state
let currentSession = null;
let editingPhotoId = null;

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  // Ensure default appointments and gallery are initialized in localStorage
  initSeedData();

  // Check existing session
  checkAuth();

  // Form submit listener
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }

  // Navigation tab switcher
  initTabs();

  // Filter change listeners
  const barberFilter = document.getElementById('barberFilter');
  const dateFilter = document.getElementById('dateFilter');
  const searchInput = document.getElementById('appointmentSearch');

  if (barberFilter) barberFilter.addEventListener('change', renderAppointmentsTable);
  if (dateFilter) dateFilter.addEventListener('change', renderAppointmentsTable);
  if (searchInput) searchInput.addEventListener('input', renderAppointmentsTable);
});

// ── Authentication System ───────────────────────────────────────────────────
function checkAuth() {
  const sessionStr = sessionStorage.getItem('fb_admin_session');
  if (sessionStr) {
    try {
      currentSession = JSON.parse(sessionStr);
      showDashboard();
      return;
    } catch(e) {
      sessionStorage.removeItem('fb_admin_session');
    }
  }
  showLoginForm();
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorBox = document.getElementById('loginError');

  const u = usernameInput.value.trim();
  const p = passwordInput.value.trim();

  const barber = BARBERS[u];
  if (barber && barber.password === p) {
    if (errorBox) errorBox.style.display = 'none';
    currentSession = barber;
    sessionStorage.setItem('fb_admin_session', JSON.stringify(barber));
    showDashboard();
  } else {
    if (errorBox) {
      errorBox.textContent = 'Credențiale invalide. Folosește user 1, 2 sau 3 cu parola corespunzătoare.';
      errorBox.style.display = 'block';
    }
  }
}

function quickLogin(userId) {
  const barber = BARBERS[userId];
  if (barber) {
    document.getElementById('username').value = barber.username;
    document.getElementById('password').value = barber.password;
    currentSession = barber;
    sessionStorage.setItem('fb_admin_session', JSON.stringify(barber));
    showDashboard();
  }
}

function logout() {
  sessionStorage.removeItem('fb_admin_session');
  currentSession = null;
  showLoginForm();
}

function showLoginForm() {
  document.getElementById('loginView').style.display = 'flex';
  document.getElementById('adminView').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('adminView').style.display = 'flex';

  // Update profile header
  const nameEl = document.getElementById('activeBarberName');
  const roleEl = document.getElementById('activeBarberRole');
  const avatarEl = document.getElementById('activeBarberAvatar');
  const filterSelect = document.getElementById('barberFilter');

  if (nameEl) nameEl.textContent = currentSession.name;
  if (roleEl) roleEl.textContent = currentSession.role;
  if (avatarEl) avatarEl.src = currentSession.avatar;

  // Auto-filter by this barber if it's one of the 3 barbers
  if (filterSelect) {
    if (currentSession.id !== 'admin') {
      filterSelect.value = currentSession.name;
    } else {
      filterSelect.value = 'all';
    }
  }

  // Refresh all dashboard views
  renderDashboardStats();
  renderAppointmentsTable();
  renderGalleryManager();
  renderBlockedSlots();
  renderServicesEditor();

  if (window.lucide) {
    lucide.createIcons();
  }
}

// ── Tab Navigation ──────────────────────────────────────────────────────────
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      if (window.lucide) {
        lucide.createIcons();
      }
    });
  });
}

// ── Seed Initial Data if empty ──────────────────────────────────────────────
function initSeedData() {
  // 1. Gallery
  if (!localStorage.getItem('fb_gallery_items')) {
    localStorage.setItem('fb_gallery_items', JSON.stringify(DEFAULT_GALLERY));
  }

  // 2. Appointments (Seed realistic bookings for testing)
  if (!localStorage.getItem('fb_appointments')) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const initialBookings = [
      {
        id: 1001,
        code: 'FB-4102',
        name: 'Victor Danilov',
        phone: '(555) 345-9821',
        email: 'victor@example.com',
        service: 'Classic Haircut',
        price: 35,
        barber: 'Marcus Rivera',
        date: today,
        slot: '10:00 AM',
        status: 'confirmed',
        notes: 'Keep hair longer on crown, mid taper'
      },
      {
        id: 1002,
        code: 'FB-8821',
        name: 'Stefan Popov',
        phone: '(555) 789-1122',
        email: 'stefan@example.com',
        service: 'Beard Sculpting',
        price: 25,
        barber: 'Jake Thompson',
        date: today,
        slot: '01:00 PM',
        status: 'confirmed',
        notes: 'Beard line-up with sharp razor edge'
      },
      {
        id: 1003,
        code: 'FB-9310',
        name: 'Mihai Cazacu',
        phone: '(555) 654-7788',
        email: 'mihai@example.com',
        service: 'Signature Skin Fade',
        price: 40,
        barber: 'Marcus Rivera',
        date: tomorrow,
        slot: '10:00 AM',
        status: 'confirmed',
        notes: 'Zero foil skin fade'
      },
      {
        id: 1004,
        code: 'FB-6502',
        name: 'Alexei Rusu',
        phone: '(555) 432-8899',
        email: 'alexei@example.com',
        service: 'The Royal Treatment',
        price: 85,
        barber: 'D\'Angelo Brooks',
        date: tomorrow,
        slot: '03:00 PM',
        status: 'confirmed',
        notes: 'Full works before photo shoot'
      }
    ];

    localStorage.setItem('fb_appointments', JSON.stringify(initialBookings));
  }

  // 3. Blocked Slots
  if (!localStorage.getItem('fb_blocked_slots')) {
    localStorage.setItem('fb_blocked_slots', JSON.stringify([]));
  }
}

// ── KPI Dashboard Stats ─────────────────────────────────────────────────────
function renderDashboardStats() {
  const appointments = getStoredAppointments();
  const today = new Date().toISOString().split('T')[0];

  // Filter based on currently logged in barber
  const relevantAppts = currentSession.id === 'admin'
    ? appointments
    : appointments.filter(a => a.barber === currentSession.name);

  const todayAppts = relevantAppts.filter(a => a.date === today && a.status !== 'cancelled');
  const todayRevenue = todayAppts.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  const totalCompleted = relevantAppts.filter(a => a.status === 'completed').length;
  const activeBookings = relevantAppts.filter(a => a.status === 'confirmed').length;

  document.getElementById('statTodayCount').textContent = todayAppts.length;
  document.getElementById('statTodayRevenue').textContent = `$${todayRevenue}`;
  document.getElementById('statTotalClients').textContent = relevantAppts.length;
  document.getElementById('statActiveBookings').textContent = activeBookings;
}

// ── Appointments Management ─────────────────────────────────────────────────
function getStoredAppointments() {
  try {
    return JSON.parse(localStorage.getItem('fb_appointments') || '[]');
  } catch(e) {
    return [];
  }
}

function saveStoredAppointments(list) {
  localStorage.setItem('fb_appointments', JSON.stringify(list));
  renderDashboardStats();
  renderAppointmentsTable();
}

function renderAppointmentsTable() {
  const appointments = getStoredAppointments();
  const barberFilter = document.getElementById('barberFilter').value;
  const dateFilter = document.getElementById('dateFilter').value;
  const query = document.getElementById('appointmentSearch').value.toLowerCase().trim();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  let filtered = appointments.filter(item => {
    // Barber Filter
    if (barberFilter !== 'all' && item.barber !== barberFilter) {
      return false;
    }

    // Date Filter
    if (dateFilter === 'today' && item.date !== today) return false;
    if (dateFilter === 'tomorrow' && item.date !== tomorrow) return false;

    // Search query
    if (query) {
      const matchName = item.name && item.name.toLowerCase().includes(query);
      const matchCode = item.code && item.code.toLowerCase().includes(query);
      const matchPhone = item.phone && item.phone.toLowerCase().includes(query);
      const matchService = item.service && item.service.toLowerCase().includes(query);
      if (!matchName && !matchCode && !matchPhone && !matchService) return false;
    }

    return true;
  });

  // Sort by date and slot
  filtered.sort((a, b) => new Date(`${a.date} ${a.slot}`) - new Date(`${b.date} ${b.slot}`));

  const tbody = document.getElementById('appointmentsTbody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:48px 16px;color:#78716c">
          <i data-lucide="calendar-x" style="width:36px;height:36px;margin-bottom:12px;opacity:0.5"></i>
          <p>Nu a fost găsită nicio programare pentru filtrele selectate.</p>
        </td>
      </tr>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const statusClass = item.status === 'completed'
      ? 'completed'
      : (item.status === 'cancelled' ? 'cancelled' : 'confirmed');

    const statusLabel = item.status === 'completed'
      ? 'Finalizat'
      : (item.status === 'cancelled' ? 'Anulat' : 'Confirmat');

    return `
      <tr>
        <td>
          <span style="font-family:monospace;font-weight:700;color:var(--gold);background:rgba(217,164,78,0.1);padding:3px 8px;border-radius:4px">
            ${item.code || 'FB-0000'}
          </span>
        </td>
        <td>
          <div style="font-weight:700;color:#fff">${item.name}</div>
          <div style="font-size:0.75rem;color:#8c857f">${item.phone || 'Fără telefon'}</div>
        </td>
        <td>
          <div style="color:#d6d3d1;font-weight:600">${item.service}</div>
          <div style="font-size:0.75rem;color:var(--gold)">$${item.price}.00</div>
        </td>
        <td>
          <div style="font-weight:600;color:#fff">${item.barber}</div>
        </td>
        <td>
          <div style="font-weight:600;color:#fff">${formatPrettyDate(item.date)}</div>
          <div style="font-size:0.78rem;color:var(--gold)">${item.slot}</div>
        </td>
        <td>
          <span class="status-badge ${statusClass}">${statusLabel}</span>
        </td>
        <td>
          <div class="table-actions">
            ${item.status === 'confirmed' ? `
              <button class="btn-action-icon" title="Marchează Finalizat" onclick="markAppointmentCompleted(${item.id})">
                <i data-lucide="check" style="width:16px;height:16px;color:#22c55e"></i>
              </button>
              <button class="btn-action-icon danger" title="Anulează Programarea (Eliberează Ora)" onclick="cancelAppointmentAdmin(${item.id})">
                <i data-lucide="x" style="width:16px;height:16px"></i>
              </button>
            ` : ''}
            <button class="btn-action-icon" title="Detalii / Note" onclick="showApptNotes('${escapeHtml(item.notes || 'Fără note speciale.')}')">
              <i data-lucide="file-text" style="width:16px;height:16px"></i>
            </button>
            <button class="btn-action-icon danger" title="Șterge Definitiv" onclick="deleteAppointmentPermanent(${item.id})">
              <i data-lucide="trash-2" style="width:16px;height:16px"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function markAppointmentCompleted(id) {
  let list = getStoredAppointments();
  list = list.map(a => a.id === id ? { ...a, status: 'completed' } : a);
  saveStoredAppointments(list);
}

function cancelAppointmentAdmin(id) {
  if (confirm('Ești sigur că vrei să anulezi programarea? Ora va redeveni imediat DISPONIBILĂ pentru clienți.')) {
    let list = getStoredAppointments();
    list = list.map(a => a.id === id ? { ...a, status: 'cancelled' } : a);
    saveStoredAppointments(list);
  }
}

function deleteAppointmentPermanent(id) {
  if (confirm('Ștergi definitiv această înregistrare din baza de date?')) {
    let list = getStoredAppointments();
    list = list.filter(a => a.id !== id);
    saveStoredAppointments(list);
  }
}

function showApptNotes(notes) {
  alert('Note Client / Preferințe:\n\n' + notes);
}

// ── Manual Walk-In Booking Modal ────────────────────────────────────────────
function openWalkInModal() {
  const modal = document.getElementById('walkInModal');
  const dateInput = document.getElementById('walkInDate');
  const barberSelect = document.getElementById('walkInBarber');

  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  if (barberSelect && currentSession && currentSession.id !== 'admin') {
    barberSelect.value = currentSession.name;
  }

  if (modal) modal.classList.add('active');
}

function closeWalkInModal() {
  const modal = document.getElementById('walkInModal');
  if (modal) modal.classList.remove('active');
}

function saveWalkInBooking() {
  const name = document.getElementById('walkInName').value.trim();
  const phone = document.getElementById('walkInPhone').value.trim();
  const serviceSelect = document.getElementById('walkInService');
  const barberSelect = document.getElementById('walkInBarber');
  const date = document.getElementById('walkInDate').value;
  const slot = document.getElementById('walkInSlot').value;
  const notes = document.getElementById('walkInNotes').value.trim();

  if (!name) {
    alert('Introduceți numele clientului.');
    return;
  }

  const [service, price] = serviceSelect.value.split('|');

  const newAppt = {
    id: Date.now(),
    code: 'FB-' + Math.floor(1000 + Math.random() * 9000),
    name: name,
    phone: phone || '(555) 000-0000',
    email: 'walkin@fadeandblade.com',
    service: service,
    price: Number(price) || 35,
    barber: barberSelect.value,
    date: date,
    slot: slot,
    status: 'confirmed',
    notes: notes || 'Walk-in programat manual din Admin Panel'
  };

  const list = getStoredAppointments();
  list.unshift(newAppt);
  saveStoredAppointments(list);

  closeWalkInModal();
  alert(`Programarea a fost salvată cu succes!\nCod: ${newAppt.code}\nOra: ${slot} pentru ${newAppt.barber} este acum OCUPATĂ.`);
}

// ── Gallery Management (Add, Edit, Delete, Reset) ───────────────────────────
function getStoredGallery() {
  try {
    return JSON.parse(localStorage.getItem('fb_gallery_items') || '[]');
  } catch(e) {
    return DEFAULT_GALLERY;
  }
}

function saveStoredGallery(list) {
  localStorage.setItem('fb_gallery_items', JSON.stringify(list));
  renderGalleryManager();
}

function renderGalleryManager() {
  const gallery = getStoredGallery();
  const container = document.getElementById('adminGalleryGrid');
  if (!container) return;

  container.innerHTML = gallery.map(item => `
    <div class="admin-gallery-card">
      <div class="admin-gallery-img">
        <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" />
        <span class="admin-gallery-category">${item.category}</span>
      </div>
      <div class="admin-gallery-info">
        <div>
          <h4>${item.title}</h4>
          <p>Autor: <strong>${item.barber}</strong></p>
        </div>
        <div class="admin-gallery-actions">
          <button class="btn-primary" style="padding:8px;font-size:0.75rem" onclick="openEditPhotoModal(${item.id})">
            Editează
          </button>
          <button class="btn-header-action" style="padding:8px" title="Șterge" onclick="deleteGalleryPhoto(${item.id})">
            <i data-lucide="trash-2" style="width:14px;height:14px;color:#f87171"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function openAddPhotoModal() {
  editingPhotoId = null;
  document.getElementById('photoModalTitle').textContent = 'Adaugă Fotografie Nouă în Galerie';
  document.getElementById('photoTitle').value = '';
  document.getElementById('photoUrl').value = '';
  document.getElementById('photoCategory').value = 'fade';
  document.getElementById('photoBarber').value = currentSession ? currentSession.name : 'Marcus Rivera';
  document.getElementById('photoPreview').src = '';
  document.getElementById('photoPreviewWrap').style.display = 'none';

  document.getElementById('photoModal').classList.add('active');
}

function openEditPhotoModal(id) {
  const gallery = getStoredGallery();
  const item = gallery.find(p => p.id === id);
  if (!item) return;

  editingPhotoId = id;
  document.getElementById('photoModalTitle').textContent = 'Editează Fotografia';
  document.getElementById('photoTitle').value = item.title;
  document.getElementById('photoUrl').value = item.imageUrl;
  document.getElementById('photoCategory').value = item.category;
  document.getElementById('photoBarber').value = item.barber;
  document.getElementById('photoPreview').src = item.imageUrl;
  document.getElementById('photoPreviewWrap').style.display = 'block';

  document.getElementById('photoModal').classList.add('active');
}

function closePhotoModal() {
  document.getElementById('photoModal').classList.remove('active');
}

function previewPhotoUrl() {
  const url = document.getElementById('photoUrl').value.trim();
  const preview = document.getElementById('photoPreview');
  const wrap = document.getElementById('photoPreviewWrap');

  if (url) {
    preview.src = url;
    wrap.style.display = 'block';
  } else {
    wrap.style.display = 'none';
  }
}

function savePhoto() {
  const title = document.getElementById('photoTitle').value.trim();
  const url = document.getElementById('photoUrl').value.trim();
  const category = document.getElementById('photoCategory').value;
  const barber = document.getElementById('photoBarber').value;

  if (!title || !url) {
    alert('Introduceți titlul și URL-ul imaginii.');
    return;
  }

  let gallery = getStoredGallery();

  if (editingPhotoId) {
    // Edit
    gallery = gallery.map(item => {
      if (item.id === editingPhotoId) {
        return { ...item, title, imageUrl: url, category, barber };
      }
      return item;
    });
  } else {
    // Add new
    const newPhoto = {
      id: Date.now(),
      title,
      category,
      categoryLabel: category.toUpperCase(),
      barber,
      imageUrl: url,
      featured: false
    };
    gallery.unshift(newPhoto);
  }

  saveStoredGallery(gallery);
  closePhotoModal();
  alert('Galeria a fost actualizată! Noul aspect este sincronizat instant pe site.');
}

function deleteGalleryPhoto(id) {
  if (confirm('Sigur doriți să ștergeți această fotografie din galerie?')) {
    let gallery = getStoredGallery();
    gallery = gallery.filter(p => p.id !== id);
    saveStoredGallery(gallery);
  }
}

function resetDefaultGallery() {
  if (confirm('Resetezi galeria la cele 12 fotografii HD implicite?')) {
    saveStoredGallery(DEFAULT_GALLERY);
  }
}

// ── Time-off & Slot Blocker ─────────────────────────────────────────────────
function getBlockedSlots() {
  try {
    return JSON.parse(localStorage.getItem('fb_blocked_slots') || '[]');
  } catch(e) {
    return [];
  }
}

function saveBlockedSlots(list) {
  localStorage.setItem('fb_blocked_slots', JSON.stringify(list));
  renderBlockedSlots();
}

function renderBlockedSlots() {
  const blocked = getBlockedSlots();
  const container = document.getElementById('blockedSlotsList');
  if (!container) return;

  if (blocked.length === 0) {
    container.innerHTML = '<p style="color:#78716c;padding:16px 0">Nu există intervale blocate momentan.</p>';
    return;
  }

  container.innerHTML = blocked.map((b, idx) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#181512;border:1px solid var(--border);border-radius:4px;margin-bottom:10px">
      <div>
        <strong style="color:#fff">${b.barber}</strong> — <span style="color:var(--gold)">${b.date} la ${b.slot}</span>
        <div style="font-size:0.75rem;color:#8c857f">Motiv: ${b.reason || 'Pauză / Indisponibil'}</div>
      </div>
      <button class="btn-action-icon danger" onclick="unblockSlot(${idx})" title="Deblochează Ora">
        <i data-lucide="unlock" style="width:15px;height:15px"></i>
      </button>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function blockNewSlot() {
  const barber = document.getElementById('blockBarber').value;
  const date = document.getElementById('blockDate').value;
  const slot = document.getElementById('blockSlot').value;
  const reason = document.getElementById('blockReason').value.trim();

  if (!date || !slot) {
    alert('Selectați data și ora.');
    return;
  }

  const blocked = getBlockedSlots();
  blocked.push({ barber, date, slot, reason: reason || 'Pauză programată' });
  saveBlockedSlots(blocked);

  alert(`Intervalul ${slot} din data de ${date} pentru ${barber} a fost blocat cu succes!`);
}

function unblockSlot(index) {
  const blocked = getBlockedSlots();
  blocked.splice(index, 1);
  saveBlockedSlots(blocked);
}

// ── Services & Price Editor ─────────────────────────────────────────────────
function renderServicesEditor() {
  // Can be expanded as needed
}

// ── Export CSV Function ─────────────────────────────────────────────────────
function exportAppointmentsCSV() {
  const list = getStoredAppointments();
  if (list.length === 0) {
    alert('Nu există programări de exportat.');
    return;
  }

  const headers = ['Cod', 'Client', 'Telefon', 'Email', 'Serviciu', 'Pret ($)', 'Frizer', 'Data', 'Ora', 'Status', 'Note'];
  const rows = list.map(a => [
    a.code,
    `"${(a.name || '').replace(/"/g, '""')}"`,
    `"${a.phone || ''}"`,
    `"${a.email || ''}"`,
    `"${(a.service || '').replace(/"/g, '""')}"`,
    a.price,
    `"${a.barber}"`,
    a.date,
    `"${a.slot}"`,
    a.status,
    `"${(a.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `fade_blade_programari_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatPrettyDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' });
}

function escapeHtml(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Global window mappings for inline event calls
window.quickLogin = quickLogin;
window.logout = logout;
window.markAppointmentCompleted = markAppointmentCompleted;
window.cancelAppointmentAdmin = cancelAppointmentAdmin;
window.deleteAppointmentPermanent = deleteAppointmentPermanent;
window.showApptNotes = showApptNotes;
window.openWalkInModal = openWalkInModal;
window.closeWalkInModal = closeWalkInModal;
window.saveWalkInBooking = saveWalkInBooking;
window.openAddPhotoModal = openAddPhotoModal;
window.openEditPhotoModal = openEditPhotoModal;
window.closePhotoModal = closePhotoModal;
window.previewPhotoUrl = previewPhotoUrl;
window.savePhoto = savePhoto;
window.deleteGalleryPhoto = deleteGalleryPhoto;
window.resetDefaultGallery = resetDefaultGallery;
window.blockNewSlot = blockNewSlot;
window.unblockSlot = unblockSlot;
window.exportAppointmentsCSV = exportAppointmentsCSV;
