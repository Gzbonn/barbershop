/**
 * ==========================================================================
 * THESTREETBARBERSHOP — Admin & Barber Management Portal
 * JavaScript controller (js/admin.js)
 * Depends on js/core.js loaded first.
 * ==========================================================================
 */

// Demo accounts. This is a front-end demo — real authentication requires a
// server-side backend.
const BARBERS = {
  'barber1': {
    id: '1',
    username: 'barber1',
    aliases: ['barber 1', '1'],
    password: '1',
    accountLabel: 'Barber 1',
    name: 'Marcus Rivera',
    role: 'Founder & Head Barber',
    specialty: 'Skin Fade & Geometry Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
  },
  'barber2': {
    id: '2',
    username: 'barber2',
    aliases: ['barber 2', '2'],
    password: '2',
    accountLabel: 'Barber 2',
    name: 'Jake Thompson',
    role: 'Senior Barber',
    specialty: 'Beard Sculptor & Hot Razor Expert',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80'
  },
  'barber3': {
    id: '3',
    username: 'barber3',
    aliases: ['barber 3', '3'],
    password: '3',
    accountLabel: 'Barber 3',
    name: 'D\'Angelo Brooks',
    role: 'Style Specialist',
    specialty: 'Scissor Texture & Color Artisan',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=120&q=80'
  },
  'admin': {
    id: 'admin',
    username: 'admin',
    aliases: ['administrator'],
    password: 'admin',
    accountLabel: 'Admin',
    name: 'Admin',
    role: 'Shop Manager — Control Total',
    specialty: 'All Barbers & Floor Operations',
    avatar: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=120&q=80'
  }
};

let currentSession = null;
let editingPhotoId = null;
let lastFocusedAdminElement = null;

document.addEventListener('DOMContentLoaded', () => {
  ensureSeedData();

  if (window.lucide) lucide.createIcons();

  checkAuth();

  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);

  initTabs();

  const barberFilter = document.getElementById('barberFilter');
  const dateFilter = document.getElementById('dateFilter');
  const searchInput = document.getElementById('appointmentSearch');

  if (barberFilter) barberFilter.addEventListener('change', renderAppointmentsTable);
  if (dateFilter) dateFilter.addEventListener('change', renderAppointmentsTable);
  if (searchInput) searchInput.addEventListener('input', renderAppointmentsTable);

  initDateDefaults();
  initAdminModalBehavior();
  initStorageSync();
});

/* ── Authentication ──────────────────────────────────────────────────────── */

function findBarberAccount(value) {
  const key = String(value == null ? '' : value).trim().toLowerCase();
  if (!key) return null;
  const compact = key.replace(/\s+/g, '');

  return Object.values(BARBERS).find(account => {
    const candidates = [
      account.username,
      account.id,
      account.accountLabel,
      ...(account.aliases || [])
    ].map(item => String(item || '').toLowerCase());

    return candidates.includes(key) || candidates.some(item => item.replace(/\s+/g, '') === compact);
  }) || null;
}

function toSession(barber) {
  const provided = barber || {};
  const account = findBarberAccount(provided.username) || findBarberAccount(provided.id) || provided;

  return {
    id: account.id || provided.id,
    username: account.username || provided.username || '',
    accountLabel: provided.accountLabel
      || account.accountLabel
      || (provided.id === 'admin' ? 'Admin' : provided.name),
    name: provided.name || account.name,
    role: provided.role || account.role,
    specialty: provided.specialty || account.specialty,
    avatar: provided.avatar || account.avatar
  };
}

function checkAuth() {
  const sessionStr = sessionStorage.getItem(FB_KEYS.session);
  if (sessionStr) {
    try {
      const parsed = JSON.parse(sessionStr);
      if (parsed && parsed.id && parsed.name) {
        currentSession = toSession(parsed);
        sessionStorage.setItem(FB_KEYS.session, JSON.stringify(currentSession));
        showDashboard();
        return;
      }
    } catch (error) {
      // Fall through to the login form.
    }
    sessionStorage.removeItem(FB_KEYS.session);
  }
  showLoginForm();
}

function handleLoginSubmit(event) {
  event.preventDefault();

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorBox = document.getElementById('loginError');

  const username = usernameInput ? usernameInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';
  const barber = findBarberAccount(username);

  const passwordMatches = Boolean(barber) && (
    barber.password.toLowerCase() === password.toLowerCase()
    || barber.username.toLowerCase() === password.toLowerCase()
  );

  if (barber && passwordMatches) {
    if (errorBox) errorBox.style.display = 'none';
    currentSession = toSession(barber);
    sessionStorage.setItem(FB_KEYS.session, JSON.stringify(currentSession));
    showDashboard();
  } else if (errorBox) {
    errorBox.textContent = 'Credențiale invalide. Conturi: Barber 1 (parola 1), Barber 2 (parola 2), Barber 3 (parola 3), Admin (parola admin).';
    errorBox.style.display = 'block';
  }
}

function quickLogin(userId) {
  const barber = findBarberAccount(userId) || BARBERS[userId];
  if (!barber) return;

  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  if (usernameInput) usernameInput.value = barber.username;
  if (passwordInput) passwordInput.value = barber.password;

  currentSession = toSession(barber);
  sessionStorage.setItem(FB_KEYS.session, JSON.stringify(currentSession));
  showDashboard();
}

function logout() {
  sessionStorage.removeItem(FB_KEYS.session);
  currentSession = null;
  showLoginForm();
}

function showLoginForm() {
  const loginView = document.getElementById('loginView');
  const adminView = document.getElementById('adminView');
  if (loginView) loginView.style.display = 'flex';
  if (adminView) adminView.style.display = 'none';
  syncAdminBodyLock();
}

function isAdminSession() {
  return Boolean(currentSession && currentSession.id === 'admin');
}

function getAccountLabel(session = currentSession) {
  if (!session) return '';
  if (session.accountLabel) return session.accountLabel;
  const account = findBarberAccount(session.username) || findBarberAccount(session.id);
  return account ? account.accountLabel : session.name;
}

function getOwnedServices(session = currentSession) {
  if (!session) return [];
  return getServicesForOwner(session.name);
}

function canEditServicePrice(serviceName) {
  if (!currentSession) return false;
  if (isAdminSession()) return true;
  return getServiceOwner(serviceName) === currentSession.name;
}

function getBarberAccountLabel(barberName) {
  const account = Object.values(BARBERS).find(item => item.name === barberName);
  return account ? `${account.accountLabel} · ${account.name}` : barberName;
}

function requireAdmin() {
  if (isAdminSession()) return true;
  alert('Această acțiune este disponibilă doar contului Admin. Conturile de frizer pot doar vizualiza datele și modifica prețurile serviciilor proprii.');
  return false;
}

function applyPermissions() {
  const admin = isAdminSession();
  const toggle = (id, visible) => {
    const element = document.getElementById(id);
    if (element) element.classList.toggle('is-hidden', !visible);
  };

  toggle('walkInBtn', admin);
  toggle('galleryToolbarActions', admin);
  toggle('scheduleBlockCard', admin);

  const barberFilterEl = document.getElementById('barberFilter');
  if (barberFilterEl) {
    barberFilterEl.style.display = admin ? '' : 'none';
    barberFilterEl.disabled = !admin;
  }

  const schedulePane = document.getElementById('tabSchedule');
  const scheduleSplit = schedulePane ? schedulePane.querySelector('.admin-split') : null;
  if (scheduleSplit) scheduleSplit.style.gridTemplateColumns = admin ? '' : '1fr';

  const badge = document.getElementById('adminModeBadge');
  if (badge) badge.textContent = admin ? 'Admin Portal' : 'Cont Frizer';

  const notice = document.getElementById('barberNotice');
  const noticeText = document.getElementById('barberNoticeText');
  if (notice && noticeText) {
    if (admin) {
      notice.style.display = 'none';
    } else {
      const owned = getOwnedServices().map(service => service.name).join(', ') || 'niciun serviciu';
      noticeText.textContent = `${getAccountLabel()} — vezi doar programările și serviciile tale. Poți edita serviciile tale: ${owned}.`;
      notice.style.display = 'flex';
    }
  }
}

function syncWalkInServiceOptions() {
  const select = document.getElementById('walkInService');
  if (!select) return;

  const previous = select.value ? select.value.split('|')[0] : '';
  select.innerHTML = getServiceCatalog().map(service => {
    const price = getServicePrice(service.name);
    return `<option value="${escapeAttr(`${service.name}|${price}`)}">${escapeHtml(service.name)} — ${escapeHtml(formatMoney(price))}</option>`;
  }).join('');

  if (previous) {
    const match = Array.from(select.options).find(option => option.value.split('|')[0] === previous);
    if (match) select.value = match.value;
  }
}

function showDashboard() {
  if (!currentSession) {
    showLoginForm();
    return;
  }

  const loginView = document.getElementById('loginView');
  const adminView = document.getElementById('adminView');
  if (loginView) loginView.style.display = 'none';
  if (adminView) adminView.style.display = 'flex';

  const nameEl = document.getElementById('activeBarberName');
  const roleEl = document.getElementById('activeBarberRole');
  const avatarEl = document.getElementById('activeBarberAvatar');
  const filterSelect = document.getElementById('barberFilter');

  if (nameEl) {
    nameEl.textContent = isAdminSession()
      ? 'Admin'
      : `${getAccountLabel()} · ${currentSession.name}`;
  }
  if (roleEl) roleEl.textContent = currentSession.role;
  if (avatarEl) avatarEl.src = currentSession.avatar;

  if (filterSelect) {
    if (!isAdminSession() && ALL_BARBERS.includes(currentSession.name)) {
      filterSelect.value = currentSession.name;
    } else {
      filterSelect.value = 'all';
    }
  }

  applyPermissions();
  syncWalkInServiceOptions();
  renderDashboardStats();
  renderAppointmentsTable();
  renderGalleryManager();
  renderBlockedSlots();
  renderServicesEditor();

  if (window.lucide) lucide.createIcons();
}

/* ── Tabs ────────────────────────────────────────────────────────────────── */

function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(other => other.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      if (targetId === 'tabAppointments') {
        renderDashboardStats();
        renderAppointmentsTable();
      } else if (targetId === 'tabGallery') {
        renderGalleryManager();
      } else if (targetId === 'tabSchedule') {
        renderBlockedSlots();
      } else if (targetId === 'tabServices') {
        renderServicesEditor();
      }

      if (window.lucide) lucide.createIcons();
    });
  });
}

function initDateDefaults() {
  const today = getLocalISODate();
  ['blockDate', 'walkInDate'].forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    input.min = today;
    if (!input.value) input.value = today;
  });
}

/* ── KPI stats ───────────────────────────────────────────────────────────── */

function renderDashboardStats() {
  if (!currentSession) return;

  const appointments = getStoredAppointments();
  const today = getLocalISODate();
  const relevantAppointments = currentSession.id === 'admin'
    ? appointments
    : appointments.filter(appointment => appointment.barber === currentSession.name);

  const todayAppointments = relevantAppointments.filter(appointment =>
    appointment.date === today && appointment.status !== 'cancelled'
  );
  const todayRevenue = todayAppointments.reduce((sum, appointment) => sum + (Number(appointment.price) || 0), 0);
  const activeBookings = relevantAppointments.filter(appointment =>
    appointment.status === 'confirmed' && appointment.date >= today
  ).length;

  const uniqueClients = new Set(
    relevantAppointments
      .map(appointment => (appointment.phone || appointment.name || '').trim().toLowerCase())
      .filter(Boolean)
  ).size;

  setText('statTodayCount', String(todayAppointments.length));
  setText('statTodayRevenue', `$${todayRevenue}`);
  setText('statTotalClients', String(uniqueClients));
  setText('statActiveBookings', String(activeBookings));
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

/* ── Appointments management ─────────────────────────────────────────────── */

function saveStoredAppointments(list) {
  if (!isAdminSession()) return false;
  if (!setStoredAppointments(list)) {
    alert('Programările nu au putut fi salvate în browser. Verifică spațiul disponibil.');
    return false;
  }
  renderDashboardStats();
  renderAppointmentsTable();
  return true;
}

function renderAppointmentsTable() {
  if (!currentSession) return;

  const barberFilterEl = document.getElementById('barberFilter');
  const dateFilterEl = document.getElementById('dateFilter');
  const searchInput = document.getElementById('appointmentSearch');

  const barberFilter = barberFilterEl ? barberFilterEl.value : 'all';
  const dateFilter = dateFilterEl ? dateFilterEl.value : 'all';
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const today = getLocalISODate();
  const tomorrow = shiftISODate(today, 1);

  const filtered = getStoredAppointments().filter(item => {
    if (!isAdminSession() && item.barber !== currentSession.name) return false;
    if (isAdminSession() && barberFilter !== 'all' && item.barber !== barberFilter) return false;
    if (dateFilter === 'today' && item.date !== today) return false;
    if (dateFilter === 'tomorrow' && item.date !== tomorrow) return false;

    if (query) {
      const haystack = [
        item.name,
        item.code,
        item.phone,
        item.email,
        item.service,
        item.barber
      ].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  filtered.sort((a, b) => appointmentSortKey(a).localeCompare(appointmentSortKey(b)));

  const tbody = document.getElementById('appointmentsTbody');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:48px 16px;color:#78716c">
          <i data-lucide="calendar-x" style="width:36px;height:36px;margin-bottom:12px;opacity:0.5"></i>
          <p>Nu a fost găsită nicio programare pentru filtrele selectate.</p>
        </td>
      </tr>`;
    if (window.lucide) lucide.createIcons();
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const status = item.status === 'completed'
      ? 'completed'
      : (item.status === 'cancelled' ? 'cancelled' : 'confirmed');
    const statusLabel = item.status === 'completed'
      ? 'Finalizat'
      : (item.status === 'cancelled' ? 'Anulat' : 'Confirmat');
    const itemId = Number(item.id);

    return `
      <tr>
        <td>
          <span class="appointment-code">${escapeHtml(item.code || 'FB-0000')}</span>
        </td>
        <td>
          <div class="appointment-client">${escapeHtml(item.name || '—')}</div>
          <div class="appointment-phone">${escapeHtml(item.phone || 'Fără telefon')}</div>
        </td>
        <td>
          <div class="appointment-service-name">${escapeHtml(item.service || '—')}</div>
          <div class="appointment-price">${escapeHtml(formatMoney(item.price))}</div>
        </td>
        <td>
          <div class="appointment-barber">${escapeHtml(item.barber || '—')}</div>
        </td>
        <td>
          <div class="appointment-date">${escapeHtml(formatPrettyDate(item.date))}</div>
          <div class="appointment-slot">${escapeHtml(item.slot || '—')}</div>
        </td>
        <td>
          <span class="status-badge ${status}">${statusLabel}</span>
        </td>
        <td>
          <div class="table-actions">
            ${isAdminSession() && item.status === 'confirmed' ? `
              <button class="btn-action-icon" title="Marchează Finalizat" onclick="markAppointmentCompleted(${itemId})">
                <i data-lucide="check" style="width:16px;height:16px;color:#22c55e"></i>
              </button>
              <button class="btn-action-icon danger" title="Anulează Programarea (Eliberează Ora)" onclick="cancelAppointmentAdmin(${itemId})">
                <i data-lucide="x" style="width:16px;height:16px"></i>
              </button>` : ''}
            <button class="btn-action-icon" title="Detalii / Note" onclick="showApptNotesById(${itemId})">
              <i data-lucide="file-text" style="width:16px;height:16px"></i>
            </button>
            ${isAdminSession() ? `
              <button class="btn-action-icon danger" title="Șterge Definitiv" onclick="deleteAppointmentPermanent(${itemId})">
                <i data-lucide="trash-2" style="width:16px;height:16px"></i>
              </button>` : ''}
          </div>
        </td>
      </tr>`;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function appointmentSortKey(appointment) {
  const start = parseTimeToMinutes(appointment.slot);
  return `${appointment.date || '9999-99-99'}-${String(Number.isNaN(start) ? 9999 : start).padStart(4, '0')}`;
}

function markAppointmentCompleted(id) {
  if (!requireAdmin()) return;
  const numericId = Number(id);
  const updated = getStoredAppointments().map(appointment =>
    Number(appointment.id) === numericId ? { ...appointment, status: 'completed' } : appointment
  );
  saveStoredAppointments(updated);
}

function cancelAppointmentAdmin(id) {
  if (!requireAdmin()) return;
  if (!confirm('Ești sigur că vrei să anulezi programarea? Ora va redeveni imediat disponibilă pentru clienți.')) return;

  const numericId = Number(id);
  const updated = getStoredAppointments().map(appointment =>
    Number(appointment.id) === numericId ? { ...appointment, status: 'cancelled' } : appointment
  );
  saveStoredAppointments(updated);
}

function deleteAppointmentPermanent(id) {
  if (!requireAdmin()) return;
  if (!confirm('Ștergi definitiv această înregistrare din baza de date?')) return;

  const numericId = Number(id);
  const updated = getStoredAppointments().filter(appointment => Number(appointment.id) !== numericId);
  saveStoredAppointments(updated);
}

function showApptNotesById(id) {
  const numericId = Number(id);
  const appointment = getStoredAppointments().find(item => Number(item.id) === numericId);
  if (!appointment) {
    alert('Programarea nu a fost găsită.');
    return;
  }
  if (!isAdminSession() && appointment.barber !== currentSession.name) {
    alert('Poți vedea doar programările tale.');
    return;
  }
  alert(`Note Client / Preferințe:\n\n${appointment.notes || 'Fără note speciale.'}`);
}

/* ── Manual walk-in booking ──────────────────────────────────────────────── */

function openWalkInModal() {
  if (!requireAdmin()) return;

  const modal = document.getElementById('walkInModal');
  const today = getLocalISODate();

  syncWalkInServiceOptions();

  ['walkInName', 'walkInPhone', 'walkInNotes'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.value = '';
  });

  const dateInput = document.getElementById('walkInDate');
  if (dateInput) {
    dateInput.min = today;
    dateInput.value = today;
  }

  const barberSelect = document.getElementById('walkInBarber');
  if (barberSelect && currentSession && currentSession.id !== 'admin' && ALL_BARBERS.includes(currentSession.name)) {
    barberSelect.value = currentSession.name;
  }

  openAdminModal(modal);
  const nameInput = document.getElementById('walkInName');
  if (nameInput) window.setTimeout(() => nameInput.focus(), 60);
}

function closeWalkInModal() {
  closeAdminModal(document.getElementById('walkInModal'));
}

function saveWalkInBooking() {
  if (!requireAdmin()) return;

  const name = valueOf('walkInName');
  const phone = valueOf('walkInPhone');
  const serviceValue = valueOf('walkInService');
  const barber = valueOf('walkInBarber');
  const date = valueOf('walkInDate');
  const slot = valueOf('walkInSlot');
  const notes = valueOf('walkInNotes');

  const [rawService, rawPrice] = serviceValue.split('|');
  const service = normalizeServiceName(rawService);
  const durationMinutes = getServiceDuration(service);

  if (!name) {
    alert('Introduceți numele clientului.');
    return;
  }
  if (!date) {
    alert('Selectați data programării.');
    return;
  }
  if (date < getLocalISODate()) {
    alert('Data selectată este în trecut.');
    return;
  }
  if (!barber || !ALL_BARBERS.includes(barber)) {
    alert('Selectați un frizer valid.');
    return;
  }

  const startMinutes = parseTimeToMinutes(slot);
  const hours = getShopHours(date);
  if (Number.isNaN(startMinutes) || !hours) {
    alert('Ora selectată nu este validă.');
    return;
  }
  if (startMinutes < hours.open || startMinutes + durationMinutes > hours.close) {
    alert(`Ora selectată este în afara programului (${minutesToTimeLabel(hours.open)} – ${minutesToTimeLabel(hours.close)}).`);
    return;
  }

  const conflict = getBarberConflict(date, startMinutes, durationMinutes, barber);
  if (conflict === 'blocked') {
    alert('Frizerul are o pauză / indisponibilitate blocată la acea oră. Deblochează intervalul sau alege altă oră.');
    return;
  }
  if (conflict === 'booked') {
    alert('Frizerul are deja o programare care se suprapune cu această oră. Alege alt interval.');
    return;
  }

  const list = getStoredAppointments();
  const newAppointment = {
    id: generateId(),
    code: generateBookingCode(list),
    clientId: `walkin-${Date.now()}`,
    name,
    phone,
    email: '',
    service,
    price: Number(rawPrice) || getServicePrice(service),
    duration: `${durationMinutes} min`,
    durationMinutes,
    barber,
    date,
    slot,
    status: 'confirmed',
    notes: notes || 'Walk-in programat manual din Admin Panel'
  };

  if (!setStoredAppointments([newAppointment, ...list])) {
    alert('Programarea nu a putut fi salvată în browser.');
    return;
  }

  closeWalkInModal();
  renderDashboardStats();
  renderAppointmentsTable();

  alert(`Programarea a fost salvată cu succes!\nCod: ${newAppointment.code}\nOra: ${slot} pentru ${newAppointment.barber} este acum ocupată.`);
}

function valueOf(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : '';
}

/* ── Gallery management ──────────────────────────────────────────────────── */

function saveStoredGallery(list) {
  if (!isAdminSession()) return false;
  if (!setStoredGallery(list)) {
    alert('Galeria nu a putut fi salvată în browser.');
    return false;
  }
  renderGalleryManager();
  return true;
}

function renderGalleryManager() {
  const gallery = getStoredGallery();
  const container = document.getElementById('adminGalleryGrid');
  if (!container) return;

  if (gallery.length === 0) {
    container.innerHTML = '<p class="admin-empty-state">Nu există fotografii în galerie. Adaugă prima fotografie.</p>';
    return;
  }

  container.innerHTML = gallery.map(item => {
    const categoryLabel = item.categoryLabel || GALLERY_CATEGORIES[item.category] || item.category;
    const itemId = Number(item.id);
    return `
      <div class="admin-gallery-card">
        <div class="admin-gallery-img">
          <img src="${escapeAttr(resolveAdminImageUrl(item.imageUrl))}" alt="${escapeAttr(item.title)}" loading="lazy" />
          <span class="admin-gallery-category">${escapeHtml(categoryLabel)}</span>
        </div>
        <div class="admin-gallery-info">
          <div>
            <h4>${escapeHtml(item.title)}</h4>
            <p>Autor: <strong>${escapeHtml(item.barber || '—')}</strong></p>
          </div>
          <div class="admin-gallery-actions">
            ${isAdminSession() ? `
              <button class="btn-primary" style="padding:8px;font-size:0.75rem" onclick="openEditPhotoModal(${itemId})">
                Editează
              </button>
              <button class="btn-header-action" style="padding:8px" title="Șterge" onclick="deleteGalleryPhoto(${itemId})">
                <i data-lucide="trash-2" style="width:14px;height:14px;color:#f87171"></i>
              </button>` : ''}
          </div>
        </div>
      </div>`;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function openAddPhotoModal() {
  if (!requireAdmin()) return;
  editingPhotoId = null;

  const titleEl = document.getElementById('photoModalTitle');
  if (titleEl) titleEl.textContent = 'Adaugă Fotografie Nouă în Galerie';

  const titleInput = document.getElementById('photoTitle');
  const urlInput = document.getElementById('photoUrl');
  const categorySelect = document.getElementById('photoCategory');
  const barberSelect = document.getElementById('photoBarber');
  const preview = document.getElementById('photoPreview');
  const previewWrap = document.getElementById('photoPreviewWrap');

  if (titleInput) titleInput.value = '';
  if (urlInput) urlInput.value = '';
  if (categorySelect) categorySelect.value = 'fade';
  if (barberSelect) {
    const defaultBarber = currentSession && ALL_BARBERS.includes(currentSession.name)
      ? currentSession.name
      : 'TheStreetBarbershop';
    barberSelect.value = defaultBarber;
  }
  if (preview) preview.src = '';
  if (previewWrap) previewWrap.style.display = 'none';

  openAdminModal(document.getElementById('photoModal'));
  if (titleInput) window.setTimeout(() => titleInput.focus(), 60);
}

function openEditPhotoModal(id) {
  if (!requireAdmin()) return;

  const numericId = Number(id);
  const item = getStoredGallery().find(photo => Number(photo.id) === numericId);
  if (!item) return;

  editingPhotoId = numericId;

  const titleEl = document.getElementById('photoModalTitle');
  const titleInput = document.getElementById('photoTitle');
  const urlInput = document.getElementById('photoUrl');
  const categorySelect = document.getElementById('photoCategory');
  const barberSelect = document.getElementById('photoBarber');
  const preview = document.getElementById('photoPreview');
  const previewWrap = document.getElementById('photoPreviewWrap');

  if (titleEl) titleEl.textContent = 'Editează Fotografia';
  if (titleInput) titleInput.value = item.title;
  if (urlInput) urlInput.value = item.imageUrl;

  if (categorySelect) {
    const hasCategory = Array.from(categorySelect.options).some(option => option.value === item.category);
    categorySelect.value = hasCategory ? item.category : 'fade';
  }

  if (barberSelect) {
    const hasBarber = Array.from(barberSelect.options).some(option => option.value === item.barber);
    barberSelect.value = hasBarber ? item.barber : 'TheStreetBarbershop';
  }

  if (preview) preview.src = resolveAdminImageUrl(item.imageUrl);
  if (previewWrap) previewWrap.style.display = 'block';

  openAdminModal(document.getElementById('photoModal'));
}

function closePhotoModal() {
  closeAdminModal(document.getElementById('photoModal'));
}

function previewPhotoUrl() {
  const urlInput = document.getElementById('photoUrl');
  const preview = document.getElementById('photoPreview');
  const previewWrap = document.getElementById('photoPreviewWrap');
  if (!urlInput || !preview || !previewWrap) return;

  const url = urlInput.value.trim();
  if (!url) {
    preview.src = '';
    previewWrap.style.display = 'none';
    return;
  }

  preview.src = resolveAdminImageUrl(url);
  previewWrap.style.display = 'block';
}

function savePhoto() {
  if (!requireAdmin()) return;

  const title = valueOf('photoTitle');
  const url = valueOf('photoUrl');
  const category = valueOf('photoCategory') || 'fade';
  const barber = valueOf('photoBarber') || 'TheStreetBarbershop';

  if (!title || !url) {
    alert('Introduceți titlul și URL-ul imaginii.');
    return;
  }
  if (!isValidImageUrl(url)) {
    alert('URL-ul imaginii trebuie să înceapă cu https://, http:// sau o cale locală (images/...).');
    return;
  }

  let gallery = getStoredGallery();
  const categoryLabel = GALLERY_CATEGORIES[category] || category;

  if (editingPhotoId) {
    gallery = gallery.map(item => Number(item.id) === editingPhotoId
      ? { ...item, title, imageUrl: url, category, categoryLabel, barber }
      : item);
  } else {
    gallery = [{
      id: generateId(),
      title,
      category,
      categoryLabel,
      barber,
      imageUrl: url,
      featured: false
    }, ...gallery];
  }

  if (!saveStoredGallery(gallery)) return;

  closePhotoModal();
  alert('Galeria a fost actualizată! Modificarea este vizibilă pe site.');
}

function deleteGalleryPhoto(id) {
  if (!requireAdmin()) return;
  if (!confirm('Sigur doriți să ștergeți această fotografie din galerie?')) return;

  const numericId = Number(id);
  const gallery = getStoredGallery().filter(photo => Number(photo.id) !== numericId);
  saveStoredGallery(gallery);
}

function resetDefaultGallery() {
  if (!requireAdmin()) return;
  if (!confirm('Resetezi galeria la cele 12 fotografii HD implicite?')) return;
  saveStoredGallery(cloneDefaultGallery());
  alert('Galeria a fost resetată la fotografiile inițiale.');
}

/* ── Time-off & slot blocker ─────────────────────────────────────────────── */

function saveBlockedSlots(list) {
  if (!isAdminSession()) return false;
  if (!setStoredBlockedSlots(list)) {
    alert('Intervalele blocate nu au putut fi salvate în browser.');
    return false;
  }
  renderBlockedSlots();
  return true;
}

function renderBlockedSlots() {
  const container = document.getElementById('blockedSlotsList');
  if (!container) return;

  const blocked = getStoredBlockedSlots().filter(block =>
    isAdminSession() || block.barber === currentSession.name
  );
  if (blocked.length === 0) {
    container.innerHTML = '<p style="color:#78716c;padding:16px 0">Nu există intervale blocate momentan.</p>';
    return;
  }

  container.innerHTML = blocked.map((block, index) => `
    <div class="blocked-slot-row">
      <div>
        <strong style="color:#fff">${escapeHtml(block.barber || '—')}</strong> — <span style="color:var(--gold)">${escapeHtml(block.date)} la ${escapeHtml(block.slot)}</span>
        <div style="font-size:0.75rem;color:#8c857f">Motiv: ${escapeHtml(block.reason || 'Pauză / Indisponibil')}</div>
      </div>
      ${isAdminSession() ? `
        <button class="btn-action-icon danger" onclick="unblockSlot(${index})" title="Deblochează Ora">
          <i data-lucide="unlock" style="width:15px;height:15px"></i>
        </button>` : ''}
    </div>`).join('');

  if (window.lucide) lucide.createIcons();
}

function blockNewSlot() {
  if (!requireAdmin()) return;

  const barber = valueOf('blockBarber');
  const date = valueOf('blockDate');
  const slot = valueOf('blockSlot');
  const reason = valueOf('blockReason');

  if (!date || !slot) {
    alert('Selectați data și ora.');
    return;
  }
  if (!ALL_BARBERS.includes(barber)) {
    alert('Selectați un frizer valid.');
    return;
  }
  if (date < getLocalISODate()) {
    alert('Nu poți bloca un interval dintr-o dată trecută.');
    return;
  }

  const startMinutes = parseTimeToMinutes(slot);
  const blocked = getStoredBlockedSlots();

  const duplicate = blocked.some(block =>
    block.date === date
    && block.barber === barber
    && parseTimeToMinutes(block.slot) === startMinutes
  );
  if (duplicate) {
    alert('Acest interval este deja blocat pentru frizerul selectat.');
    return;
  }

  if (hasAppointmentConflict(date, startMinutes, DEFAULT_BLOCK_DURATION, barber)) {
    alert('Există deja o programare la acea oră pentru frizerul selectat. Anuleaz-o mai întâi.');
    return;
  }

  blocked.push({
    barber,
    date,
    slot,
    durationMinutes: DEFAULT_BLOCK_DURATION,
    reason: reason || 'Pauză programată'
  });

  if (!saveBlockedSlots(blocked)) return;

  const reasonInput = document.getElementById('blockReason');
  if (reasonInput) reasonInput.value = '';

  alert(`Intervalul ${slot} din data de ${date} pentru ${barber} a fost blocat cu succes!`);
}

function unblockSlot(index) {
  if (!requireAdmin()) return;
  const blocked = getStoredBlockedSlots();
  if (index < 0 || index >= blocked.length) return;
  blocked.splice(index, 1);
  saveBlockedSlots(blocked);
}

/* ── Services & prices ───────────────────────────────────────────────────── */

function renderServicesEditor() {
  const container = document.getElementById('servicesList');
  if (!container) return;

  const catalog = getServiceCatalog({ includeInactive: true });
  const visible = isAdminSession()
    ? catalog
    : catalog.filter(service => service.owner === currentSession.name);

  if (visible.length === 0) {
    container.innerHTML = `
      <div class="admin-empty-state">
        Nu ai încă niciun serviciu. Folosește butonul „Adaugă Serviciu” pentru a crea primul serviciu.
      </div>`;
  } else {
    container.innerHTML = visible.map(service => {
      const editable = canEditServicePrice(service.name);
      const price = getServicePrice(service.name);
      const inactive = service.active === false;

      return `
        <div class="service-row ${inactive ? 'is-inactive' : ''}">
          <div class="service-row-main">
            <strong class="service-row-name">
              ${escapeHtml(service.name)}
              ${inactive ? '<span class="service-inactive-badge">Inactiv</span>' : ''}
            </strong>
            <p class="service-row-description">${escapeHtml(service.description || 'Fără descriere')} (${service.duration} min)</p>
            <p class="service-row-owner">
              <i data-lucide="${editable ? 'unlock' : 'lock'}" style="width:12px;height:12px"></i>
              ${escapeHtml(getBarberAccountLabel(service.owner))}
              ${editable ? '<span class="service-owner-badge">Poți edita</span>' : ''}
            </p>
          </div>
          <div class="service-row-actions">
            <label class="service-price-field" title="${editable ? 'Modifică prețul serviciului' : 'Prețul poate fi modificat doar de frizerul proprietar sau de Admin'}">
              <span class="service-price-currency">$</span>
              <input
                type="number"
                inputmode="decimal"
                min="0"
                step="0.01"
                value="${price}"
                data-service-price-input="${escapeAttr(service.name)}"
                aria-label="Preț pentru ${escapeAttr(service.name)}"
                ${editable ? '' : 'disabled'}
              />
            </label>
            ${editable ? `
              <button class="btn-action-icon" type="button" onclick="openServiceModal('${escapeAttr(service.id)}')" title="Editează serviciul" aria-label="Editează ${escapeAttr(service.name)}">
                <i data-lucide="pencil"></i>
              </button>
              <button class="btn-action-icon danger" type="button" onclick="deleteServiceRow('${escapeAttr(service.id)}')" title="Șterge serviciul" aria-label="Șterge ${escapeAttr(service.name)}">
                <i data-lucide="trash-2"></i>
              </button>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  container.querySelectorAll('[data-service-price-input]').forEach(input => {
    input.addEventListener('change', () => {
      updateServicePrice(input.getAttribute('data-service-price-input'), input.value);
    });
  });

  const note = document.getElementById('servicesRoleNote');
  if (note) {
    note.textContent = isAdminSession()
      ? 'Cont Admin: vezi și controlezi toate serviciile. Poți adăuga, edita sau șterge orice serviciu.'
      : `Cont ${getAccountLabel()}: vezi doar serviciile tale. Poți modifica numele, descrierea, prețul, durata sau dezactiva un serviciu.`;
  }

  if (window.lucide) lucide.createIcons();
}

function openServiceModal(id) {
  if (!currentSession) return;

  const modal = document.getElementById('serviceModal');
  if (!modal) return;

  const catalog = getServiceCatalog({ includeInactive: true });
  const service = id ? catalog.find(item => item.id === id) : null;

  if (service && !canEditServicePrice(service.name)) {
    alert('Poți edita doar serviciile care îți aparțin.');
    return;
  }

  setText('serviceModalTitle', service ? 'Editează Serviciul' : 'Adaugă Serviciu Nou');

  const idInput = document.getElementById('serviceId');
  if (idInput) idInput.value = service ? service.id : '';

  const nameInput = document.getElementById('serviceName');
  const descriptionInput = document.getElementById('serviceDescription');
  const priceInput = document.getElementById('servicePrice');
  const durationInput = document.getElementById('serviceDuration');
  const activeInput = document.getElementById('serviceActive');
  const ownerSelect = document.getElementById('serviceOwner');
  const errorEl = document.getElementById('serviceModalError');

  if (nameInput) nameInput.value = service ? service.name : '';
  if (descriptionInput) descriptionInput.value = service ? service.description : '';
  if (priceInput) priceInput.value = service ? service.price : '';
  if (durationInput) durationInput.value = service ? service.duration : 30;
  if (activeInput) activeInput.checked = service ? service.active !== false : true;
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.style.display = 'none';
  }

  if (ownerSelect) {
    ownerSelect.innerHTML = [...ALL_BARBERS, 'TheStreetBarbershop'].map(owner => `
      <option value="${escapeAttr(owner)}">${escapeHtml(getBarberAccountLabel(owner))}</option>`).join('');
    if (isAdminSession()) {
      ownerSelect.disabled = false;
      ownerSelect.value = service ? service.owner : 'TheStreetBarbershop';
    } else {
      ownerSelect.value = currentSession.name;
      ownerSelect.disabled = true;
    }
  }

  openAdminModal(modal);
  if (nameInput) window.setTimeout(() => nameInput.focus(), 60);
}

function closeServiceModal() {
  closeAdminModal(document.getElementById('serviceModal'));
}

function saveServiceModal() {
  if (!currentSession) return;

  const modal = document.getElementById('serviceModal');
  const id = String((document.getElementById('serviceId') || {}).value || '').trim();
  const catalog = getServiceCatalog({ includeInactive: true });
  const existing = id ? catalog.find(item => item.id === id) : null;

  if (existing && !canEditServicePrice(existing.name)) {
    alert('Poți edita doar serviciile care îți aparțin.');
    return;
  }

  const ownerSelect = document.getElementById('serviceOwner');
  const owner = isAdminSession()
    ? (ownerSelect ? ownerSelect.value : 'TheStreetBarbershop')
    : currentSession.name;

  const result = saveService({
    id,
    name: (document.getElementById('serviceName') || {}).value,
    description: (document.getElementById('serviceDescription') || {}).value,
    price: (document.getElementById('servicePrice') || {}).value,
    duration: (document.getElementById('serviceDuration') || {}).value,
    owner,
    active: Boolean((document.getElementById('serviceActive') || {}).checked)
  });

  const errorEl = document.getElementById('serviceModalError');
  if (!result.ok) {
    if (errorEl) {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
    } else {
      alert(result.error);
    }
    return;
  }

  closeServiceModal();
  renderServicesEditor();

  const status = document.getElementById('servicesSaveStatus');
  if (status) {
    status.textContent = existing
      ? `Serviciu actualizat: ${result.service.name}.`
      : `Serviciu adăugat: ${result.service.name}.`;
    status.style.display = 'block';
  }
}

function deleteServiceRow(id) {
  if (!currentSession) return;

  const service = getServiceCatalog({ includeInactive: true }).find(item => item.id === id);
  if (!service) return;

  if (!canEditServicePrice(service.name)) {
    alert('Poți șterge doar serviciile care îți aparțin.');
    return;
  }

  if (!confirm(`Ștergi serviciul „${service.name}”? Programările deja făcute rămân neschimbate.`)) return;

  if (!deleteServiceById(id)) {
    alert('Serviciul nu a putut fi șters.');
    return;
  }

  renderServicesEditor();
  const status = document.getElementById('servicesSaveStatus');
  if (status) {
    status.textContent = `Serviciu șters: ${service.name}.`;
    status.style.display = 'block';
  }
}

function updateServicePrice(name, value) {
  if (!currentSession) return;

  if (!canEditServicePrice(name)) {
    alert('Poți modifica doar prețurile serviciilor care îți aparțin.');
    renderServicesEditor();
    return;
  }

  const service = getService(name);
  const raw = String(value == null ? '' : value).trim();
  const amount = Number(raw);

  if (!service || !raw || !Number.isFinite(amount) || amount < 0) {
    alert('Introdu un preț valid (număr pozitiv).');
    renderServicesEditor();
    return;
  }

  if (!setServicePrice(service.name, amount)) {
    alert('Prețul nu a putut fi salvat în browser.');
    return;
  }

  const status = document.getElementById('servicesSaveStatus');
  if (status) {
    status.textContent = `Preț actualizat: ${service.name} — ${formatMoney(getServicePrice(service.name))}.`;
    status.style.display = 'block';
  }

  renderServicesEditor();
}

/* ── CSV export ──────────────────────────────────────────────────────────── */

function csvCell(value) {
  let text = String(value == null ? '' : value);
  // Prevent Excel/LibreOffice formula injection.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function exportAppointmentsCSV() {
  const list = isAdminSession()
    ? getStoredAppointments()
    : getStoredAppointments().filter(appointment => appointment.barber === currentSession.name);
  if (list.length === 0) {
    alert('Nu există programări de exportat.');
    return;
  }

  const headers = ['Cod', 'Client', 'Telefon', 'Email', 'Serviciu', 'Pret ($)', 'Frizer', 'Data', 'Ora', 'Status', 'Note'];
  const rows = list.map(appointment => [
    appointment.code,
    appointment.name,
    appointment.phone,
    appointment.email,
    appointment.service,
    appointment.price,
    appointment.barber,
    appointment.date,
    appointment.slot,
    appointment.status,
    appointment.notes
  ]);

  const csvContent = '\uFEFF' + [
    headers.map(csvCell).join(','),
    ...rows.map(row => row.map(csvCell).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `thestreetbarbershop_programari_${getLocalISODate()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

/* ── Cross-tab live sync ─────────────────────────────────────────────────── */

function initStorageSync() {
  window.addEventListener('storage', event => {
    if (!currentSession) return;
    if (event.key === FB_KEYS.appointments) {
      renderDashboardStats();
      renderAppointmentsTable();
    } else if (event.key === FB_KEYS.gallery) {
      renderGalleryManager();
    } else if (event.key === FB_KEYS.blocked) {
      renderBlockedSlots();
    } else if (event.key === FB_KEYS.prices || event.key === FB_KEYS.services) {
      renderServicesEditor();
      syncWalkInServiceOptions();
    }
  });
}

/* ── Admin modal helpers ─────────────────────────────────────────────────── */

function syncAdminBodyLock() {
  const hasOpenModal = document.querySelector('.admin-modal.active');
  document.body.classList.toggle('no-scroll', Boolean(hasOpenModal));
}

function openAdminModal(modal) {
  if (!modal) return;
  if (!modal.classList.contains('active')) {
    lastFocusedAdminElement = document.activeElement;
  }
  modal.classList.add('active');
  syncAdminBodyLock();
}

function closeAdminModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  syncAdminBodyLock();

  if (lastFocusedAdminElement && typeof lastFocusedAdminElement.focus === 'function') {
    try { lastFocusedAdminElement.focus(); } catch (error) { /* ignore */ }
  }
}

function initAdminModalBehavior() {
  document.querySelectorAll('.admin-modal').forEach(modal => {
    modal.addEventListener('click', event => {
      if (event.target !== modal) return;
      if (modal.id === 'walkInModal') closeWalkInModal();
      else if (modal.id === 'photoModal') closePhotoModal();
      else if (modal.id === 'serviceModal') closeServiceModal();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeWalkInModal();
    closePhotoModal();
    closeServiceModal();
  });
}

/* ── Global mappings for inline event handlers ───────────────────────────── */

window.quickLogin = quickLogin;
window.logout = logout;
window.markAppointmentCompleted = markAppointmentCompleted;
window.cancelAppointmentAdmin = cancelAppointmentAdmin;
window.deleteAppointmentPermanent = deleteAppointmentPermanent;
window.showApptNotesById = showApptNotesById;
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
window.updateServicePrice = updateServicePrice;
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;
window.saveServiceModal = saveServiceModal;
window.deleteServiceRow = deleteServiceRow;
window.exportAppointmentsCSV = exportAppointmentsCSV;
