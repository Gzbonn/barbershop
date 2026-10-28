/**
 * ==========================================================================
 * FADE & BLADE — Premium Barbershop & Grooming Lounge
 * Main Application Logic (js/app.js)
 * ==========================================================================
 */

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

// All Barbers Roster
const ALL_BARBERS = ['Marcus Rivera', 'Jake Thompson', 'D\'Angelo Brooks'];

// Standard Daily Slots
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

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Seed Data
  initSeedStorage();

  // 2. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 3. Real-Time Shop Open/Closed Status
  initShopStatus();

  // 4. Navbar & Mobile Drawer
  initNavigation();

  // 5. Before & After Comparison Slider
  initTransformationSlider();

  // 6. Dynamic Gallery & Lightbox
  renderDynamicGallery();
  initGalleryFilterTabs();

  // 7. Booking System & Slot Availability Engine
  initBookingSystem();

  // 8. Web Audio Ambient Soundscape
  initSoundscape();
});

/* ── 1. Storage Initialization ───────────────────────────────────────────── */
function initSeedStorage() {
  if (!localStorage.getItem('fb_gallery_items')) {
    localStorage.setItem('fb_gallery_items', JSON.stringify(DEFAULT_GALLERY));
  }
  if (!localStorage.getItem('fb_appointments')) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const seedBookings = [
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
      }
    ];
    localStorage.setItem('fb_appointments', JSON.stringify(seedBookings));
  }
}

/* ── 2. Real-Time Shop Open / Closed Calculator ─────────────────────────── */
function initShopStatus() {
  function updateShopStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTimeVal = hour + minute / 60;

    let isOpen = false;
    let closeTime = '';
    let nextOpen = '';

    if (day >= 1 && day <= 5) {
      if (currentTimeVal >= 9 && currentTimeVal < 20) {
        isOpen = true;
        closeTime = '8:00 PM';
      } else {
        nextOpen = currentTimeVal < 9 ? 'Azi la 9:00 AM' : 'Mâine la 9:00 AM';
      }
    } else if (day === 6) {
      if (currentTimeVal >= 8 && currentTimeVal < 18) {
        isOpen = true;
        closeTime = '6:00 PM';
      } else {
        nextOpen = currentTimeVal < 8 ? 'Azi la 8:00 AM' : 'Duminică la 10:00 AM';
      }
    } else if (day === 0) {
      if (currentTimeVal >= 10 && currentTimeVal < 16) {
        isOpen = true;
        closeTime = '4:00 PM';
      } else {
        nextOpen = currentTimeVal < 10 ? 'Azi la 10:00 AM' : 'Luni la 9:00 AM';
      }
    }

    const navStatusEl = document.getElementById('navLiveStatus');
    const navTextEl = document.getElementById('navLiveStatusText');
    const boxStatusPill = document.getElementById('boxStatusPill');
    const boxStatusText = document.getElementById('boxStatusText');

    if (navStatusEl && navTextEl) {
      if (isOpen) {
        navStatusEl.className = 'live-status-pill open';
        navTextEl.textContent = `DESCHIS ACUM • Închide la ${closeTime}`;
      } else {
        navStatusEl.className = 'live-status-pill closed';
        navTextEl.textContent = `ÎNCHIS • Deschide ${nextOpen}`;
      }
    }

    if (boxStatusPill && boxStatusText) {
      if (isOpen) {
        boxStatusPill.className = 'live-status-pill open';
        boxStatusText.textContent = `Deschis Acum până la ${closeTime}`;
      } else {
        boxStatusPill.className = 'live-status-pill closed';
        boxStatusText.textContent = `Deschide ${nextOpen}`;
      }
    }
  }

  updateShopStatus();
  setInterval(updateShopStatus, 60000);
}

/* ── 3. Navigation & Mobile Drawer ──────────────────────────────────────── */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  // Navbar scroll background
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
  }, { passive: true });

  // Mobile Drawer Open / Close
  function openDrawer() {
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  window.closeMobileDrawer = closeDrawer;

  // Smooth scroll links with navbar offset
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          closeDrawer();
          const offset = 80;
          const y = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

  // Reveal Animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/* ── 4. Before & After Transformation Slider ────────────────────────────── */
function initTransformationSlider() {
  const comparisonSlider = document.getElementById('comparisonSlider');
  const comparisonBefore = document.getElementById('comparisonBefore');
  const comparisonHandle = document.getElementById('comparisonHandle');

  if (!comparisonSlider || !comparisonBefore || !comparisonHandle) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = comparisonSlider.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;
    comparisonBefore.style.width = `${percent}%`;
    comparisonHandle.style.left = `${percent}%`;
  }

  comparisonSlider.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateSlider(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  comparisonSlider.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    updateSlider(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });
}

/* ── 5. Dynamic Gallery & Lightbox ───────────────────────────────────────── */
function getGalleryData() {
  try {
    return JSON.parse(localStorage.getItem('fb_gallery_items') || '[]');
  } catch(e) {
    return DEFAULT_GALLERY;
  }
}

function renderDynamicGallery() {
  const gallery = getGalleryData();
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  grid.innerHTML = gallery.map((item, idx) => {
    const isFeatured = idx === 0 || item.featured;
    return `
      <div class="gallery-item reveal ${isFeatured ? 'featured' : ''}" data-category="${item.category}" onclick="openLightbox('${item.imageUrl}', '${escapeAttr(item.title)}', '${escapeAttr(item.categoryLabel || item.category)} • ${escapeAttr(item.barber)}')">
        <img src="${item.imageUrl}" alt="${item.title}" loading="lazy" />
        <div class="gallery-zoom-badge"><i data-lucide="maximize-2"></i></div>
        <div class="gallery-overlay">
          <h4>${item.title}</h4>
          <span>${item.categoryLabel || item.category} • ${item.barber}</span>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function initGalleryFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      const galleryItems = document.querySelectorAll('.gallery-item');
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeBookingModal();
      closeMyAppointments();
    }
  });
}

function openLightbox(imgSrc, title, subtitle) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const t = document.getElementById('lightboxTitle');
  const s = document.getElementById('lightboxSubtitle');

  if (img) img.src = imgSrc;
  if (t) t.textContent = title;
  if (s) s.textContent = subtitle;
  if (modal) modal.classList.add('active');
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (modal) modal.classList.remove('active');
}

/* ── 6. Booking System with Real-Time Slot Availability ─────────────────── */
let bookingState = {
  step: 1,
  service: 'Classic Haircut',
  price: 35,
  duration: '45 min',
  barber: 'First Available Master Barber',
  date: '',
  slot: '09:00 AM',
  name: '',
  phone: '',
  email: '',
  notes: '',
  code: ''
};

function initBookingSystem() {
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Default to tomorrow
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    dateInput.value = tomorrow;
    bookingState.date = tomorrow;

    dateInput.addEventListener('change', () => {
      bookingState.date = dateInput.value;
      renderAvailableSlots();
    });
  }

  updateApptCount();

  const openApptsBtn = document.getElementById('openMyAppointmentsBtn');
  if (openApptsBtn) {
    openApptsBtn.addEventListener('click', openMyAppointments);
  }
}

/**
 * Checks if a slot on a specific date is booked for the given barber.
 * Also checks blocked hours from the Admin panel!
 */
function isSlotBooked(date, slot, barberName) {
  const appointments = getStoredAppointments();
  const blockedSlots = getStoredBlockedSlots();

  // 1. Check Admin Blocked Slots
  const isBlocked = blockedSlots.some(b => {
    if (b.date !== date || b.slot !== slot) return false;
    if (barberName === 'First Available Master Barber') return true;
    return b.barber === barberName;
  });
  if (isBlocked) return true;

  // 2. Check Existing Appointments
  if (barberName === 'First Available Master Barber') {
    // If all 3 barbers are booked at this date and slot, it's unavailable
    const bookedBarbersAtTime = appointments
      .filter(a => a.date === date && a.slot === slot && a.status !== 'cancelled')
      .map(a => a.barber);

    const allBooked = ALL_BARBERS.every(b => bookedBarbersAtTime.includes(b));
    return allBooked;
  } else {
    // Specific barber
    return appointments.some(a =>
      a.date === date &&
      a.slot === slot &&
      a.barber === barberName &&
      a.status !== 'cancelled'
    );
  }
}

function getStoredAppointments() {
  try {
    return JSON.parse(localStorage.getItem('fb_appointments') || '[]');
  } catch(e) {
    return [];
  }
}

function getStoredBlockedSlots() {
  try {
    return JSON.parse(localStorage.getItem('fb_blocked_slots') || '[]');
  } catch(e) {
    return [];
  }
}

/**
 * Dynamically renders the slots grid checking real-time availability.
 * If a slot is booked on that date for that barber, it gets the .booked class,
 * is crossed out and shows an "Ocupat" tag.
 */
function renderAvailableSlots() {
  const grid = document.getElementById('slotsGrid');
  if (!grid) return;

  const date = bookingState.date;
  const barber = bookingState.barber;

  let firstAvailableSlot = null;

  grid.innerHTML = STANDARD_SLOTS.map(slot => {
    const booked = isSlotBooked(date, slot, barber);
    const isSelected = !booked && bookingState.slot === slot;

    if (!booked && !firstAvailableSlot) {
      firstAvailableSlot = slot;
    }

    if (booked) {
      return `
        <div class="time-slot booked" title="Acest interval este deja ocupat">
          <span>${slot}</span>
          <span class="slot-badge-booked">Ocupat</span>
        </div>
      `;
    } else {
      return `
        <div class="time-slot ${isSelected ? 'selected' : ''}" onclick="selectSlot('${slot}', this)">
          <span>${slot}</span>
        </div>
      `;
    }
  }).join('');

  // If current slot became booked, auto-select the next available slot
  if (isSlotBooked(date, bookingState.slot, barber)) {
    bookingState.slot = firstAvailableSlot || '';
    if (firstAvailableSlot) {
      const availableDivs = grid.querySelectorAll('.time-slot:not(.booked)');
      if (availableDivs.length > 0) {
        availableDivs[0].classList.add('selected');
      }
    }
  }
}

function openBookingModal(preService, prePrice, preBarber) {
  if (preService) {
    bookingState.service = preService;
    bookingState.price = parseInt(prePrice, 10) || 35;
    document.querySelectorAll('.choice-card').forEach(c => {
      const h4 = c.querySelector('h4');
      if (h4 && h4.textContent.trim().toLowerCase().includes(preService.toLowerCase())) {
        c.classList.add('selected');
      } else {
        c.classList.remove('selected');
      }
    });
  }

  if (preBarber) {
    bookingState.barber = preBarber;
    document.querySelectorAll('.barber-modal-card').forEach(b => {
      const h4 = b.querySelector('h4');
      if (h4 && h4.textContent.includes(preBarber)) {
        b.classList.add('selected');
      } else {
        b.classList.remove('selected');
      }
    });
  }

  setModalStep(1);
  updateModalSummary();
  renderAvailableSlots();

  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.add('active');
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.remove('active');
}

function setModalStep(step) {
  bookingState.step = step;
  for (let i = 1; i <= 5; i++) {
    const pane = document.getElementById(`stepPane${i}`);
    const indicator = document.getElementById(`stepIndicator${i}`);
    if (pane) pane.classList.toggle('active', i === step);
    if (indicator) {
      indicator.classList.toggle('active', i === step);
      indicator.classList.toggle('completed', i < step);
    }
  }

  const prevBtn = document.getElementById('prevStepBtn');
  const nextBtn = document.getElementById('nextStepBtn');

  if (!prevBtn || !nextBtn) return;

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
  }
}

function modalNextStep() {
  if (bookingState.step === 3) {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput && dateInput.value) {
      bookingState.date = dateInput.value;
    }
    if (!bookingState.slot) {
      alert('Vă rugăm să alegeți un interval orar disponibil din listă.');
      return;
    }
    // Verify once again before proceeding
    if (isSlotBooked(bookingState.date, bookingState.slot, bookingState.barber)) {
      alert('Ora selectată tocmai a fost ocupată. Vă rugăm să alegeți o altă oră disponibilă.');
      renderAvailableSlots();
      return;
    }
  }

  if (bookingState.step === 4) {
    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const emailInput = document.getElementById('clientEmail');
    const notesInput = document.getElementById('clientNotes');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';

    if (!name) {
      alert('Vă rugăm să introduceți numele și prenumele.');
      if (nameInput) nameInput.focus();
      return;
    }

    bookingState.name = name;
    bookingState.phone = phone || '(555) 234-5678';
    bookingState.email = email || 'client@example.com';
    bookingState.notes = notesInput ? notesInput.value.trim() : '';

    finalizeBooking();
    return;
  }

  if (bookingState.step < 4) {
    setModalStep(bookingState.step + 1);
    updateModalSummary();
  }
}

function modalPrevStep() {
  if (bookingState.step > 1) {
    setModalStep(bookingState.step - 1);
    updateModalSummary();
  }
}

function selectService(name, price, dur, el) {
  bookingState.service = name;
  bookingState.price = price;
  bookingState.duration = dur;
  document.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
  if (el) el.classList.add('selected');
  updateModalSummary();
}

function selectBarber(name, role, el) {
  bookingState.barber = name;
  document.querySelectorAll('.barber-modal-card').forEach(c => c.classList.remove('selected'));
  if (el) el.classList.add('selected');
  updateModalSummary();
  renderAvailableSlots();
}

function selectSlot(slot, el) {
  bookingState.slot = slot;
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  if (el) el.classList.add('selected');
}

function updateModalSummary() {
  const textEl = document.getElementById('modalSummaryText');
  if (textEl) {
    const barberFirst = bookingState.barber.split(' ')[0];
    textEl.textContent = `$${bookingState.price} • ${bookingState.service} (${barberFirst})`;
  }
}

function finalizeBooking() {
  const code = 'FB-' + Math.floor(1000 + Math.random() * 9000);
  bookingState.code = code;

  // Resolve "First Available" to a specific free barber
  let assignedBarber = bookingState.barber;
  if (assignedBarber === 'First Available Master Barber') {
    const appointments = getStoredAppointments();
    const freeBarber = ALL_BARBERS.find(b =>
      !appointments.some(a => a.date === bookingState.date && a.slot === bookingState.slot && a.barber === b && a.status !== 'cancelled')
    );
    assignedBarber = freeBarber || ALL_BARBERS[0];
  }

  const finalRecord = {
    ...bookingState,
    barber: assignedBarber,
    id: Date.now(),
    status: 'confirmed'
  };

  // 1. Save to LocalStorage
  const list = getStoredAppointments();
  list.unshift(finalRecord);
  localStorage.setItem('fb_appointments', JSON.stringify(list));
  updateApptCount();

  // 2. Populate confirmation ticket
  const codeEl = document.getElementById('ticketCode');
  const clientEl = document.getElementById('ticketClient');
  const serviceEl = document.getElementById('ticketService');
  const barberEl = document.getElementById('ticketBarber');
  const dateTimeEl = document.getElementById('ticketDateTime');
  const priceEl = document.getElementById('ticketPrice');

  if (codeEl) codeEl.textContent = code;
  if (clientEl) clientEl.textContent = finalRecord.name;
  if (serviceEl) serviceEl.textContent = finalRecord.service;
  if (barberEl) barberEl.textContent = finalRecord.barber;
  if (dateTimeEl) dateTimeEl.textContent = `${finalRecord.date} la ${finalRecord.slot}`;
  if (priceEl) priceEl.textContent = `$${finalRecord.price}.00`;

  // 3. Google Calendar link
  const gCalBtn = document.getElementById('googleCalBtn');
  if (gCalBtn) {
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Fade & Blade: ' + finalRecord.service)}&dates=${finalRecord.date.replace(/-/g, '')}T140000Z/${finalRecord.date.replace(/-/g, '')}T150000Z&details=${encodeURIComponent('Programare cu ' + finalRecord.barber + ' la Fade & Blade Barbershop. Cod: ' + code)}&location=${encodeURIComponent('142 Main St, Downtown Arts District')}`;
    gCalBtn.href = gCalUrl;
  }

  // 4. Update the slots grid immediately
  renderAvailableSlots();

  setModalStep(5);
}

function downloadCalendarFile() {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fade and Blade Barbershop//RO',
    'BEGIN:VEVENT',
    `SUMMARY:Fade & Blade - ${bookingState.service}`,
    `DESCRIPTION:Programare cu ${bookingState.barber}. Cod Confirmare: ${bookingState.code}`,
    'LOCATION:142 Main St, Downtown Arts District',
    `DTSTART:${bookingState.date.replace(/-/g, '')}T140000Z`,
    `DTEND:${bookingState.date.replace(/-/g, '')}T150000Z`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `fade_blade_${bookingState.code}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/* ── My Appointments Modal ───────────────────────────────────────────────── */
function updateApptCount() {
  const list = getStoredAppointments();
  const countEl = document.getElementById('myApptCount');
  if (countEl) {
    const active = list.filter(a => a.status === 'confirmed');
    if (active.length > 0) {
      countEl.textContent = active.length;
      countEl.style.display = 'inline-block';
    } else {
      countEl.style.display = 'none';
    }
  }
}

function openMyAppointments() {
  const list = getStoredAppointments();
  const listEl = document.getElementById('appointmentsList');
  if (!listEl) return;

  listEl.innerHTML = '';

  if (list.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center;padding:36px 16px;color:var(--text-dim)">
        <i data-lucide="calendar" style="width:36px;height:36px;margin-bottom:12px"></i>
        <p>Nu aveți nicio programare salvată momentan.</p>
      </div>
    `;
  } else {
    list.forEach(item => {
      const isConfirmed = item.status === 'confirmed';
      const div = document.createElement('div');
      div.className = 'appointment-item';
      div.innerHTML = `
        <div>
          <div style="font-weight:700;color:#fff;font-size:0.95rem">${item.service}</div>
          <div style="font-size:0.78rem;color:var(--gold);margin-top:2px">${item.barber} • ${item.date} la ${item.slot}</div>
          <div style="font-size:0.72rem;color:var(--text-dim);margin-top:4px">
            Cod: <strong>${item.code}</strong> • $${item.price} • Status: <span style="color:${isConfirmed ? '#86efac' : '#fca5a5'}">${item.status}</span>
          </div>
        </div>
        ${isConfirmed ? `
          <button class="cancel-appt-btn" onclick="cancelAppointment(${item.id})">Anulează</button>
        ` : ''}
      `;
      listEl.appendChild(div);
    });
  }

  if (window.lucide) {
    lucide.createIcons();
  }

  const modal = document.getElementById('myAppointmentsModal');
  if (modal) modal.classList.add('active');
}

function closeMyAppointments() {
  const modal = document.getElementById('myAppointmentsModal');
  if (modal) modal.classList.remove('active');
}

function cancelAppointment(id) {
  let list = getStoredAppointments();
  list = list.map(a => a.id === id ? { ...a, status: 'cancelled' } : a);
  localStorage.setItem('fb_appointments', JSON.stringify(list));
  updateApptCount();
  renderAvailableSlots();
  openMyAppointments();
}

/* ── 7. Web Audio Shop Vibe Synthesizer ─────────────────────────────────── */
let audioCtx = null;
let isSoundscapePlaying = false;
let noiseNode = null;
let chordOscillators = [];

function initSoundscape() {
  const btn = document.getElementById('soundscapeBtn');
  if (btn) {
    btn.addEventListener('click', toggleSoundscape);
  }
}

function toggleSoundscape() {
  const btn = document.getElementById('soundscapeBtn');
  const label = document.getElementById('soundscapeLabel');

  if (!isSoundscapePlaying) {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // 1. Vinyl Crackle Synth
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      if (Math.random() < 0.002) {
        output[i] = (Math.random() * 2 - 1) * 0.4;
      } else {
        output[i] = (Math.random() * 2 - 1) * 0.015;
      }
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

    // 2. Warm Ambient Lofi Chords (D Minor 9 chord: D3, F3, A3, C4, E4)
    const freqs = [146.83, 174.61, 220.00, 261.63, 329.63];
    chordOscillators = freqs.map((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.025;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      return { osc, gain };
    });

    isSoundscapePlaying = true;
    if (btn) btn.classList.add('playing');
    if (label) label.textContent = 'Shop Vibe: Redă';
  } else {
    if (noiseNode) {
      try { noiseNode.stop(); } catch (e) {}
      noiseNode = null;
    }
    chordOscillators.forEach(({ osc }) => {
      try { osc.stop(); } catch (e) {}
    });
    chordOscillators = [];

    isSoundscapePlaying = false;
    if (btn) btn.classList.remove('playing');
    if (label) label.textContent = 'Shop Vibe: Lofi & Vinil';
  }
}

function escapeAttr(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Global window mappings for inline event calls
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
