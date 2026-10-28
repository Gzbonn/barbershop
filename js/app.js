/**
 * ==========================================================================
 * FADE & BLADE — Premium Barbershop & Grooming Lounge
 * Main application logic (js/app.js)
 * Depends on js/core.js loaded first.
 * ==========================================================================
 */

let bookingState = {
  step: 1,
  service: 'Classic Haircut',
  price: 35,
  duration: '45 min',
  durationMinutes: 45,
  barber: FIRST_AVAILABLE,
  date: '',
  slot: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
  code: '',
  confirmed: null,
  finalizing: false
};

let revealObserver = null;
let galleryFilter = 'all';
let lastFocusedElement = null;

document.addEventListener('DOMContentLoaded', () => {
  ensureSeedData();

  if (window.lucide) {
    lucide.createIcons();
  }

  initShopStatus();
  initNavigation();
  initRevealAnimations();
  initTransformationSlider();
  renderDynamicGallery();
  initGalleryFilterTabs();
  initGalleryInteractions();
  initBookingSystem();
  initSoundscape();
  initStorageSync();
  initModalBehavior();
});

/* ── Shop open / closed status ───────────────────────────────────────────── */

function initShopStatus() {
  function updateShopStatus() {
    const now = new Date();
    const day = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const schedule = SHOP_SCHEDULE[day];

    let isOpen = false;
    let closeTime = '';
    let nextOpen = '';

    if (schedule && currentMinutes >= schedule.open && currentMinutes < schedule.close) {
      isOpen = true;
      closeTime = minutesToTimeLabel(schedule.close);
    } else {
      for (let offset = 0; offset < 7; offset += 1) {
        const candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
        const candidateSchedule = SHOP_SCHEDULE[candidate.getDay()];
        if (!candidateSchedule) continue;

        if (offset === 0 && currentMinutes < candidateSchedule.open) {
          nextOpen = `Azi la ${minutesToTimeLabel(candidateSchedule.open)}`;
          break;
        }
        if (offset > 0) {
          const dayLabel = offset === 1 ? 'Mâine' : candidateSchedule.label;
          nextOpen = `${dayLabel} la ${minutesToTimeLabel(candidateSchedule.open)}`;
          break;
        }
      }
    }

    const navStatusEl = document.getElementById('navLiveStatus');
    const navTextEl = document.getElementById('navLiveStatusText');
    const boxStatusPill = document.getElementById('boxStatusPill');
    const boxStatusText = document.getElementById('boxStatusText');

    if (navStatusEl && navTextEl) {
      navStatusEl.className = `live-status-pill ${isOpen ? 'open' : 'closed'}`;
      navTextEl.textContent = isOpen
        ? `DESCHIS ACUM • Închide la ${closeTime}`
        : `ÎNCHIS • Deschide ${nextOpen}`;
    }

    if (boxStatusPill && boxStatusText) {
      boxStatusPill.className = `live-status-pill ${isOpen ? 'open' : 'closed'}`;
      boxStatusText.textContent = isOpen
        ? `Deschis Acum până la ${closeTime}`
        : `Deschide ${nextOpen}`;
    }
  }

  updateShopStatus();
  window.setInterval(updateShopStatus, 60000);
}

/* ── Navigation, mobile drawer & reveal animations ───────────────────────── */

function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  function openDrawer() {
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    syncBodyScrollLock();
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    syncBodyScrollLock();
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  window.closeMobileDrawer = closeDrawer;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      closeDrawer();
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

function initRevealAnimations() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  observeRevealElements();
}

function observeRevealElements() {
  const elements = document.querySelectorAll('.reveal:not(.visible)');
  if (!elements.length) return;

  if (!revealObserver) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }
  elements.forEach(el => revealObserver.observe(el));
}

/* ── Before & after comparison slider ────────────────────────────────────── */

function initTransformationSlider() {
  const slider = document.getElementById('comparisonSlider');
  const before = document.getElementById('comparisonBefore');
  const handle = document.getElementById('comparisonHandle');
  if (!slider || !before || !handle) return;

  let percent = 50;
  let dragging = false;

  function setPercent(value) {
    percent = Math.max(0, Math.min(100, value));
    before.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    handle.style.left = `${percent}%`;
    slider.setAttribute('aria-valuenow', String(Math.round(percent)));
  }

  function updateFromClientX(clientX) {
    const rect = slider.getBoundingClientRect();
    if (!rect.width) return;
    setPercent(((clientX - rect.left) / rect.width) * 100);
  }

  slider.addEventListener('pointerdown', event => {
    dragging = true;
    if (slider.setPointerCapture) {
      try { slider.setPointerCapture(event.pointerId); } catch (error) { /* ignore */ }
    }
    updateFromClientX(event.clientX);
  });

  slider.addEventListener('pointermove', event => {
    if (dragging) updateFromClientX(event.clientX);
  });

  const stopDragging = () => { dragging = false; };
  slider.addEventListener('pointerup', stopDragging);
  slider.addEventListener('pointercancel', stopDragging);
  window.addEventListener('pointerup', stopDragging);

  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setPercent(percent - 2);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setPercent(percent + 2);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setPercent(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setPercent(100);
    }
  });

  setPercent(50);
}

/* ── Dynamic gallery & lightbox ──────────────────────────────────────────── */

function renderDynamicGallery() {
  const gallery = getStoredGallery();
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  if (gallery.length === 0) {
    grid.innerHTML = '<div class="gallery-empty"><i data-lucide="image-off"></i><p>Galerie goală. Adaugă fotografii din panoul de administrare.</p></div>';
    if (window.lucide) lucide.createIcons();
    return;
  }

  grid.innerHTML = gallery.map((item, index) => {
    const isFeatured = index === 0 || item.featured;
    const itemId = Number.isFinite(Number(item.id)) ? Number(item.id) : index;
    const categoryLabel = item.categoryLabel || GALLERY_CATEGORIES[item.category] || item.category || 'Portofoliu';

    return `
      <div class="gallery-item reveal ${isFeatured ? 'featured' : ''}"
           data-gallery-id="${itemId}"
           data-category="${escapeAttr(item.category)}"
           role="button"
           tabindex="0"
           aria-label="${escapeAttr(item.title)} — vezi imaginea">
        <img src="${escapeAttr(item.imageUrl)}" alt="${escapeAttr(item.title)}" loading="lazy" />
        <div class="gallery-zoom-badge"><i data-lucide="maximize-2"></i></div>
        <div class="gallery-overlay">
          <h4>${escapeHtml(item.title)}</h4>
          <span>${escapeHtml(categoryLabel)} • ${escapeHtml(item.barber)}</span>
        </div>
      </div>`;
  }).join('');

  applyGalleryFilter(galleryFilter);
  observeRevealElements();

  if (window.lucide) lucide.createIcons();
}

function applyGalleryFilter(filter) {
  galleryFilter = filter || 'all';
  document.querySelectorAll('.gallery-item').forEach(item => {
    const matches = galleryFilter === 'all' || item.getAttribute('data-category') === galleryFilter;
    item.style.display = matches ? '' : 'none';
  });
}

function initGalleryFilterTabs() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.setAttribute('aria-pressed', button.classList.contains('active') ? 'true' : 'false');
    button.addEventListener('click', () => {
      filterButtons.forEach(other => {
        other.classList.remove('active');
        other.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      applyGalleryFilter(button.getAttribute('data-filter'));
    });
  });
}

function initGalleryInteractions() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  function activateCard(card) {
    const id = Number(card.getAttribute('data-gallery-id'));
    const item = getStoredGallery().find(entry => Number(entry.id) === id);
    if (!item) return;
    const categoryLabel = item.categoryLabel || GALLERY_CATEGORIES[item.category] || item.category;
    openLightbox(item.imageUrl, item.title, `${categoryLabel} • ${item.barber}`);
  }

  grid.addEventListener('click', event => {
    const card = event.target.closest('.gallery-item');
    if (card) activateCard(card);
  });

  grid.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.gallery-item');
    if (!card) return;
    event.preventDefault();
    activateCard(card);
  });
}

function openLightbox(imgSrc, title, subtitle) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const subtitleEl = document.getElementById('lightboxSubtitle');

  if (img) img.src = imgSrc;
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;
  openOverlay(modal);
}

function closeLightbox() {
  closeOverlay(document.getElementById('lightboxModal'));
}

/* ── Booking system ──────────────────────────────────────────────────────── */

function initBookingSystem() {
  const dateInput = document.getElementById('bookingDate');
  const today = getLocalISODate();
  const tomorrow = shiftISODate(today, 1);

  if (dateInput) {
    dateInput.min = today;
    dateInput.max = shiftISODate(today, 120);
    if (!dateInput.value) dateInput.value = tomorrow;
    bookingState.date = dateInput.value;

    dateInput.addEventListener('change', () => {
      bookingState.date = dateInput.value;
      renderAvailableSlots();
    });
  } else {
    bookingState.date = tomorrow;
  }

  const slotsGrid = document.getElementById('slotsGrid');
  if (slotsGrid) {
    slotsGrid.addEventListener('click', event => {
      const slotEl = event.target.closest('[data-slot]');
      if (slotEl) selectSlot(slotEl.getAttribute('data-slot'), slotEl);
    });
    slotsGrid.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const slotEl = event.target.closest('[data-slot]');
      if (!slotEl) return;
      event.preventDefault();
      selectSlot(slotEl.getAttribute('data-slot'), slotEl);
    });
  }

  updateApptCount();

  const openApptsBtn = document.getElementById('openMyAppointmentsBtn');
  if (openApptsBtn) openApptsBtn.addEventListener('click', openMyAppointments);
}

function openBookingModal(preService, prePrice, preBarber) {
  if (preService) {
    const service = getService(preService) || {
      name: preService,
      price: Number(prePrice) || 35,
      duration: 60
    };
    bookingState.service = service.name;
    bookingState.price = service.price;
    bookingState.durationMinutes = service.duration;
    bookingState.duration = `${service.duration} min`;
  } else if (!getService(bookingState.service)) {
    const fallback = SERVICES[0];
    bookingState.service = fallback.name;
    bookingState.price = fallback.price;
    bookingState.durationMinutes = fallback.duration;
    bookingState.duration = `${fallback.duration} min`;
  }

  if (preBarber && (preBarber === FIRST_AVAILABLE || ALL_BARBERS.includes(preBarber))) {
    bookingState.barber = preBarber;
  }

  bookingState.confirmed = null;
  bookingState.code = '';

  const today = getLocalISODate();
  if (!bookingState.date || bookingState.date < today) {
    bookingState.date = shiftISODate(today, 1);
  }

  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    dateInput.min = today;
    dateInput.max = shiftISODate(today, 120);
    dateInput.value = bookingState.date;
  }

  syncServiceSelection();
  syncBarberSelection();
  setModalStep(1);
  updateModalSummary();
  renderAvailableSlots();
  openOverlay(document.getElementById('bookingModal'));
}

function closeBookingModal() {
  closeOverlay(document.getElementById('bookingModal'));
}

function syncServiceSelection() {
  document.querySelectorAll('.choice-card').forEach(card => {
    const name = card.getAttribute('data-service')
      || (card.querySelector('h4') ? card.querySelector('h4').textContent.trim() : '');
    const selected = name === bookingState.service;
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
}

function syncBarberSelection() {
  document.querySelectorAll('.barber-modal-card').forEach(card => {
    const name = card.getAttribute('data-barber')
      || (card.querySelector('h4') ? card.querySelector('h4').textContent.trim() : '');
    const selected = name === bookingState.barber;
    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });
}

function setModalStep(step) {
  bookingState.step = step;

  for (let index = 1; index <= 5; index += 1) {
    const pane = document.getElementById(`stepPane${index}`);
    const indicator = document.getElementById(`stepIndicator${index}`);
    if (pane) pane.classList.toggle('active', index === step);
    if (indicator) {
      indicator.classList.toggle('active', index === step);
      indicator.classList.toggle('completed', index < step);
    }
  }

  const prevBtn = document.getElementById('prevStepBtn');
  const nextBtn = document.getElementById('nextStepBtn');
  if (!prevBtn || !nextBtn) return;

  nextBtn.disabled = false;

  if (step === 1) {
    prevBtn.style.visibility = 'hidden';
    nextBtn.textContent = 'Pasul 2: Alege Frizerul →';
    nextBtn.onclick = modalNextStep;
  } else if (step === 2) {
    prevBtn.style.visibility = 'visible';
    nextBtn.textContent = 'Pasul 3: Alege Data & Ora →';
    nextBtn.onclick = modalNextStep;
  } else if (step === 3) {
    prevBtn.style.visibility = 'visible';
    nextBtn.textContent = 'Pasul 4: Date de Contact →';
    nextBtn.onclick = modalNextStep;
    renderAvailableSlots();
  } else if (step === 4) {
    prevBtn.style.visibility = 'visible';
    nextBtn.textContent = `Confirmă Programarea ($${bookingState.price})`;
    nextBtn.onclick = modalNextStep;
  } else if (step === 5) {
    prevBtn.style.visibility = 'hidden';
    nextBtn.textContent = 'Finalizează & Închide';
    nextBtn.onclick = closeBookingModal;
    const summaryEl = document.getElementById('modalSummaryText');
    if (summaryEl) {
      summaryEl.textContent = `Cod: ${(bookingState.confirmed && bookingState.confirmed.code) || bookingState.code}`;
    }
  }
}

function modalNextStep() {
  if (bookingState.step === 1) {
    if (!getService(bookingState.service)) {
      alert('Vă rugăm să alegeți un serviciu din listă.');
      return;
    }
    setModalStep(2);
    updateModalSummary();
    return;
  }

  if (bookingState.step === 2) {
    setModalStep(3);
    updateModalSummary();
    return;
  }

  if (bookingState.step === 3) {
    const dateInput = document.getElementById('bookingDate');
    const date = dateInput ? dateInput.value : bookingState.date;

    if (!date) {
      alert('Vă rugăm să alegeți data programării.');
      return;
    }
    if (date < getLocalISODate()) {
      alert('Data selectată este în trecut. Alege o dată viitoare.');
      return;
    }
    if (!bookingState.slot) {
      alert('Vă rugăm să alegeți un interval orar disponibil din listă.');
      return;
    }

    bookingState.date = date;
    const status = getSlotStatus(date, bookingState.slot, bookingState.barber, bookingState.service);

    if (status.status === 'booked') {
      alert('Ora selectată tocmai a fost ocupată. Vă rugăm să alegeți o altă oră disponibilă.');
      renderAvailableSlots();
      return;
    }
    if (status.status === 'closed') {
      alert('Ora selectată este în afara programului salonului pentru data respectivă.');
      renderAvailableSlots();
      return;
    }
    if (status.status === 'past') {
      alert('Ora selectată a trecut deja. Alege o altă oră.');
      renderAvailableSlots();
      return;
    }

    setModalStep(4);
    updateModalSummary();
    return;
  }

  if (bookingState.step === 4) {
    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const emailInput = document.getElementById('clientEmail');
    const notesInput = document.getElementById('clientNotes');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';

    if (name.length < 2) {
      alert('Vă rugăm să introduceți numele și prenumele.');
      if (nameInput) nameInput.focus();
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 6) {
      alert('Vă rugăm să introduceți un număr de telefon valid.');
      if (phoneInput) phoneInput.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Vă rugăm să introduceți o adresă de email validă.');
      if (emailInput) emailInput.focus();
      return;
    }

    bookingState.name = name;
    bookingState.phone = phone;
    bookingState.email = email;
    bookingState.notes = notesInput ? notesInput.value.trim() : '';

    finalizeBooking();
  }
}

function modalPrevStep() {
  if (bookingState.step > 1) {
    setModalStep(bookingState.step - 1);
    updateModalSummary();
  }
}

function selectService(name, price, duration) {
  const service = getService(name);
  bookingState.service = service ? service.name : name;
  bookingState.price = service ? service.price : (Number(price) || 0);
  bookingState.durationMinutes = service ? service.duration : (parseInt(duration, 10) || 60);
  bookingState.duration = `${bookingState.durationMinutes} min`;

  syncServiceSelection();
  updateModalSummary();
  renderAvailableSlots();
}

function selectBarber(name) {
  if (name !== FIRST_AVAILABLE && !ALL_BARBERS.includes(name)) return;
  bookingState.barber = name;
  syncBarberSelection();
  updateModalSummary();
  renderAvailableSlots();
}

function selectSlot(slot, element) {
  const status = getSlotStatus(bookingState.date, slot, bookingState.barber, bookingState.service);
  if (status.status !== 'available') {
    renderAvailableSlots();
    return;
  }

  bookingState.slot = slot;
  document.querySelectorAll('.time-slot.selected').forEach(el => {
    el.classList.remove('selected');
    el.setAttribute('aria-pressed', 'false');
  });
  if (element) {
    element.classList.add('selected');
    element.setAttribute('aria-pressed', 'true');
  }
}

function updateModalSummary() {
  const textEl = document.getElementById('modalSummaryText');
  if (!textEl) return;
  const barberLabel = bookingState.barber === FIRST_AVAILABLE
    ? 'Primul liber'
    : bookingState.barber.split(' ')[0];
  textEl.textContent = `$${bookingState.price} • ${bookingState.service} • ${bookingState.durationMinutes} min (${barberLabel})`;
}

function renderAvailableSlots() {
  const grid = document.getElementById('slotsGrid');
  if (!grid) return;

  if (!bookingState.date) {
    grid.innerHTML = '<div class="slots-empty">Alege mai întâi o dată pentru a vedea orele disponibile.</div>';
    return;
  }

  const currentStatus = bookingState.slot
    ? getSlotStatus(bookingState.date, bookingState.slot, bookingState.barber, bookingState.service)
    : null;
  const currentAvailable = currentStatus && currentStatus.status === 'available';

  let firstAvailable = null;
  const rows = STANDARD_SLOTS.map(slot => {
    const info = getSlotStatus(bookingState.date, slot, bookingState.barber, bookingState.service);
    const isAvailable = info.status === 'available';

    if (isAvailable && !firstAvailable) firstAvailable = slot;

    if (isAvailable) {
      const selected = bookingState.slot === slot;
      return `
        <div class="time-slot ${selected ? 'selected' : ''}"
             data-slot="${escapeAttr(slot)}"
             role="button"
             tabindex="0"
             aria-pressed="${selected ? 'true' : 'false'}"
             aria-label="${escapeAttr(slot)} — disponibil">
          <span>${escapeHtml(slot)}</span>
        </div>`;
    }

    return `
      <div class="time-slot ${info.status}" aria-disabled="true">
        <span>${escapeHtml(slot)}</span>
        <span class="slot-badge-${info.status}">${escapeHtml(info.label)}</span>
      </div>`;
  });

  if (!firstAvailable) {
    rows.push('<div class="slots-empty">Nu mai sunt ore disponibile pentru data selectată. Alege altă zi sau alt frizer.</div>');
  }

  grid.innerHTML = rows.join('');

  if (!currentAvailable) {
    bookingState.slot = firstAvailable || '';
  }

  if (bookingState.slot) {
    const selectedEl = grid.querySelector(`[data-slot="${bookingState.slot}"]`);
    if (selectedEl) {
      selectedEl.classList.add('selected');
      selectedEl.setAttribute('aria-pressed', 'true');
    }
  }
}

function finalizeBooking() {
  if (bookingState.finalizing) return;

  const date = bookingState.date;
  const status = getSlotStatus(date, bookingState.slot, bookingState.barber, bookingState.service);
  if (status.status !== 'available') {
    alert('Ora selectată nu mai este disponibilă. Alege alt interval.');
    setModalStep(3);
    renderAvailableSlots();
    return;
  }

  bookingState.finalizing = true;

  try {
    const existing = getStoredAppointments();
    let assignedBarber = bookingState.barber;

    if (assignedBarber === FIRST_AVAILABLE) {
      assignedBarber = findAvailableBarber(date, bookingState.slot, bookingState.service);
    }

    if (!assignedBarber) {
      alert('Nu mai există niciun frizer disponibil la ora selectată. Alege alt interval.');
      setModalStep(3);
      renderAvailableSlots();
      return;
    }

    const service = getService(bookingState.service);
    const durationMinutes = service ? service.duration : bookingState.durationMinutes;

    const record = {
      id: generateId(),
      code: generateBookingCode(existing),
      clientId: getClientId(),
      name: bookingState.name,
      phone: bookingState.phone,
      email: bookingState.email,
      service: bookingState.service,
      price: bookingState.price,
      duration: `${durationMinutes} min`,
      durationMinutes,
      barber: assignedBarber,
      date,
      slot: bookingState.slot,
      status: 'confirmed',
      notes: bookingState.notes,
      createdAt: new Date().toISOString()
    };

    const saved = setStoredAppointments([record, ...existing]);
    if (!saved) {
      alert('Programarea nu a putut fi salvată în acest browser. Verifică dacă ai spațiu liber în stocarea locală.');
      return;
    }

    bookingState.confirmed = record;
    bookingState.barber = assignedBarber;
    bookingState.code = record.code;
    bookingState.duration = record.duration;
    bookingState.durationMinutes = record.durationMinutes;

    updateApptCount();
    populateTicket(record);

    const gCalBtn = document.getElementById('googleCalBtn');
    if (gCalBtn) gCalBtn.href = buildGoogleCalendarUrl(record);

    renderAvailableSlots();
    setModalStep(5);
  } finally {
    bookingState.finalizing = false;
  }
}

function populateTicket(record) {
  const fields = {
    ticketCode: record.code,
    ticketClient: record.name,
    ticketService: record.service,
    ticketBarber: record.barber,
    ticketDateTime: `${formatPrettyDate(record.date)} la ${record.slot}`,
    ticketPrice: formatMoney(record.price)
  };

  Object.keys(fields).forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = fields[id];
  });
}

function buildGoogleCalendarUrl(record) {
  const start = dateFromISOAndSlot(record.date, record.slot);
  if (!start) return 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const end = new Date(start.getTime() + (Number(record.durationMinutes) || 60) * 60000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Fade & Blade: ${record.service}`,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    details: `Programare cu ${record.barber}. Cod: ${record.code}. Durată: ${record.durationMinutes} min.`,
    location: '142 Main St, Downtown Arts District'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadCalendarFile() {
  const record = (bookingState.confirmed && bookingState.confirmed.code)
    ? bookingState.confirmed
    : null;

  if (!record) {
    alert('Confirmă mai întâi programarea pentru a putea salva fișierul calendaristic.');
    return;
  }

  const start = dateFromISOAndSlot(record.date, record.slot);
  if (!start) return;
  const end = new Date(start.getTime() + (Number(record.durationMinutes) || 60) * 60000);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fade and Blade Barbershop//RO',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${icsEscape(record.code)}@fadeandblade.local`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${icsEscape(`Fade & Blade - ${record.service}`)}`,
    `DESCRIPTION:${icsEscape(`Programare cu ${record.barber}. Cod: ${record.code}. Durată: ${record.durationMinutes} min.`)}`,
    `LOCATION:${icsEscape('142 Main St, Downtown Arts District')}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `fade_blade_${record.code}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

/* ── My appointments (filtered by this browser's client id) ─────────────── */

function updateApptCount() {
  const myId = getClientId();
  const today = getLocalISODate();
  const active = getStoredAppointments().filter(appointment =>
    appointment.clientId === myId
    && appointment.status === 'confirmed'
    && appointment.date >= today
  );

  const countEl = document.getElementById('myApptCount');
  if (!countEl) return;
  if (active.length > 0) {
    countEl.textContent = String(active.length);
    countEl.style.display = 'inline-block';
  } else {
    countEl.textContent = '0';
    countEl.style.display = 'none';
  }
}

function renderMyAppointmentsList() {
  const listEl = document.getElementById('appointmentsList');
  if (!listEl) return;

  const myId = getClientId();
  const today = getLocalISODate();
  const appointments = getStoredAppointments()
    .filter(appointment => appointment.clientId === myId
      && appointment.status === 'confirmed'
      && appointment.date >= today)
    .sort((a, b) => {
      const startA = parseTimeToMinutes(a.slot);
      const startB = parseTimeToMinutes(b.slot);
      const keyA = `${a.date}-${String(Number.isNaN(startA) ? 9999 : startA).padStart(4, '0')}`;
      const keyB = `${b.date}-${String(Number.isNaN(startB) ? 9999 : startB).padStart(4, '0')}`;
      return keyA.localeCompare(keyB);
    });

  if (appointments.length === 0) {
    listEl.innerHTML = `
      <div class="appointments-empty">
        <i data-lucide="calendar"></i>
        <p>Nu ai nicio programare activă salvată în acest browser.</p>
      </div>`;
  } else {
    listEl.innerHTML = appointments.map(appointment => `
      <div class="appointment-item">
        <div>
          <div class="appointment-service">${escapeHtml(appointment.service)}</div>
          <div class="appointment-meta">${escapeHtml(appointment.barber)} • ${escapeHtml(formatPrettyDate(appointment.date))} la ${escapeHtml(appointment.slot)}</div>
          <div class="appointment-details">
            Cod: <strong>${escapeHtml(appointment.code)}</strong> • ${escapeHtml(formatMoney(appointment.price))} • Status: <span class="appointment-status">Confirmat</span>
          </div>
        </div>
        <button class="cancel-appt-btn" onclick="cancelAppointment(${Number(appointment.id)})">Anulează</button>
      </div>`).join('');
  }

  if (window.lucide) lucide.createIcons();
}

function openMyAppointments() {
  renderMyAppointmentsList();
  openOverlay(document.getElementById('myAppointmentsModal'));
}

function closeMyAppointments() {
  closeOverlay(document.getElementById('myAppointmentsModal'));
}

function cancelAppointment(id) {
  const numericId = Number(id);
  const myId = getClientId();
  const list = getStoredAppointments();
  const appointment = list.find(item => Number(item.id) === numericId);

  if (!appointment || appointment.clientId !== myId) {
    alert('Această programare nu aparține acestui browser.');
    return;
  }

  if (!confirm('Sigur vrei să anulezi această programare? Ora va redeveni disponibilă.')) return;

  const updated = list.map(item =>
    Number(item.id) === numericId ? { ...item, status: 'cancelled' } : item
  );

  if (!setStoredAppointments(updated)) {
    alert('Programarea nu a putut fi anulată. Încearcă din nou.');
    return;
  }

  updateApptCount();
  renderAvailableSlots();
  renderMyAppointmentsList();
}

/* ── Web Audio ambient soundscape ────────────────────────────────────────── */

let audioCtx = null;
let isSoundscapePlaying = false;
let noiseNode = null;
let chordOscillators = [];

function initSoundscape() {
  const btn = document.getElementById('soundscapeBtn');
  if (btn) btn.addEventListener('click', toggleSoundscape);
}

function toggleSoundscape() {
  const btn = document.getElementById('soundscapeBtn');
  const label = document.getElementById('soundscapeLabel');

  if (!isSoundscapePlaying) {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let index = 0; index < bufferSize; index += 1) {
      output[index] = Math.random() < 0.002
        ? (Math.random() * 2 - 1) * 0.4
        : (Math.random() * 2 - 1) * 0.015;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 1800;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.value = 0.35;

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noiseNode.start();

    const frequencies = [146.83, 174.61, 220.00, 261.63, 329.63];
    chordOscillators = frequencies.map(frequency => {
      const oscillator = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.025;
      oscillator.connect(gain);
      gain.connect(audioCtx.destination);
      oscillator.start();
      return { oscillator, gain };
    });

    isSoundscapePlaying = true;
    if (btn) {
      btn.classList.add('playing');
      btn.setAttribute('aria-pressed', 'true');
    }
    if (label) label.textContent = 'Shop Vibe: Oprește';
  } else {
    if (noiseNode) {
      try { noiseNode.stop(); } catch (error) { /* already stopped */ }
      noiseNode = null;
    }
    chordOscillators.forEach(({ oscillator }) => {
      try { oscillator.stop(); } catch (error) { /* already stopped */ }
    });
    chordOscillators = [];

    isSoundscapePlaying = false;
    if (btn) {
      btn.classList.remove('playing');
      btn.setAttribute('aria-pressed', 'false');
    }
    if (label) label.textContent = 'Shop Vibe: Lofi & Vinil';
  }
}

/* ── Cross-tab live sync ─────────────────────────────────────────────────── */

function initStorageSync() {
  window.addEventListener('storage', event => {
    if (event.key === FB_KEYS.gallery) {
      renderDynamicGallery();
    }
    if (event.key === FB_KEYS.appointments || event.key === FB_KEYS.blocked) {
      updateApptCount();
      renderAvailableSlots();
      const modal = document.getElementById('myAppointmentsModal');
      if (modal && modal.classList.contains('active')) renderMyAppointmentsList();
    }
  });
}

/* ── Modal overlay helpers ───────────────────────────────────────────────── */

function syncBodyScrollLock() {
  const hasOpenOverlay = document.querySelector('.modal-overlay.active, .lightbox-modal.active, .mobile-nav-drawer.active');
  document.body.classList.toggle('no-scroll', Boolean(hasOpenOverlay));
}

function openOverlay(overlay) {
  if (!overlay) return;
  if (!overlay.classList.contains('active')) {
    lastFocusedElement = document.activeElement;
  }
  overlay.classList.add('active');
  syncBodyScrollLock();

  const focusTarget = overlay.querySelector('.modal-close-btn, [data-autofocus], button, input, select, textarea, a[href]');
  if (focusTarget) {
    window.setTimeout(() => {
      try { focusTarget.focus(); } catch (error) { /* ignore */ }
    }, 60);
  }
}

function closeOverlay(overlay) {
  if (!overlay) return;
  overlay.classList.remove('active');
  syncBodyScrollLock();

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    try { lastFocusedElement.focus(); } catch (error) { /* ignore */ }
  }
}

function initModalBehavior() {
  const bookingModal = document.getElementById('bookingModal');
  const appointmentsModal = document.getElementById('myAppointmentsModal');
  const lightbox = document.getElementById('lightboxModal');

  [bookingModal, appointmentsModal, lightbox].forEach(overlay => {
    if (!overlay) return;
    overlay.addEventListener('click', event => {
      if (event.target !== overlay) return;
      if (overlay === bookingModal) closeBookingModal();
      else if (overlay === appointmentsModal) closeMyAppointments();
      else closeLightbox();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeLightbox();
    closeBookingModal();
    closeMyAppointments();
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    syncBodyScrollLock();
  });

  // Make clickable cards usable with the keyboard as well.
  document.querySelectorAll('.choice-card, .barber-modal-card, .service-card, .social-item').forEach(card => {
    if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      card.click();
    });
  });
}

/* ── Global mappings for inline event handlers ───────────────────────────── */

window.openBookingModal = openBookingModal;
window.closeBookingModal = closeBookingModal;
window.modalNextStep = modalNextStep;
window.modalPrevStep = modalPrevStep;
window.selectService = selectService;
window.selectBarber = selectBarber;
window.selectSlot = selectSlot;
window.downloadCalendarFile = downloadCalendarFile;
window.openMyAppointments = openMyAppointments;
window.closeMyAppointments = closeMyAppointments;
window.cancelAppointment = cancelAppointment;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.toggleSoundscape = toggleSoundscape;
window.renderDynamicGallery = renderDynamicGallery;
