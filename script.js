/* ================================================
   VELVET BREW CAFÉ — Main JavaScript
   ================================================ */

'use strict';

/* ---- Utility: debounce ---- */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ================================================
   1. PRELOADER
   ================================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.style.overflow = '';
    }, 500);
  });

  // Ensure body doesn't scroll while loading
  document.body.style.overflow = 'hidden';
})();

/* ================================================
   2. STICKY NAVIGATION & ACTIVE LINK
   ================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  // Scroll handler — add .scrolled class
  const handleScroll = debounce(() => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  }, 10);

  // Highlight nav link based on scroll position
  function highlightActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on init
})();

/* ================================================
   3. MOBILE NAVIGATION
   ================================================ */
(function initMobileNav() {
  const hamburger   = document.getElementById('hamburger-btn');
  const mobileNav   = document.getElementById('mobile-nav');
  const closeBtn    = document.getElementById('mobile-nav-close');
  const backdrop    = document.getElementById('mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !mobileNav) return;

  function openNav() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('visible');
    backdrop.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('visible');
    backdrop.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', openNav);
  closeBtn.addEventListener('click', closeNav);
  backdrop.addEventListener('click', closeNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Escape key closes mobile nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeNav();
    }
  });
})();

/* ================================================
   4. HERO PARALLAX
   ================================================ */
(function initParallax() {
  const heroBg = document.getElementById('hero-parallax');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
    }
  }, { passive: true });
})();

/* ================================================
   5. ANIMATED COUNTER (Stats)
   ================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ================================================
   6. SCROLL-BASED AOS ANIMATIONS
   ================================================ */
(function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ================================================
   7. MENU CATEGORY FILTER
   ================================================ */
(function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards  = document.querySelectorAll('.menu-card');

  if (!filterBtns.length || !menuCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards with animation
      menuCards.forEach((card, i) => {
        const category = card.dataset.category;
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.classList.remove('hidden');
          card.style.animationDelay = `${i * 0.05}s`;
          card.style.animation = 'none';
          // Trigger reflow for restart animation
          void card.offsetWidth;
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ================================================
   8. GALLERY LIGHTBOX
   ================================================ */
(function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const caption     = document.getElementById('lightbox-caption');
  const closeBtn    = document.getElementById('lightbox-close');
  const backdrop    = document.getElementById('lightbox-backdrop');
  const prevBtn     = document.getElementById('lightbox-prev');
  const nextBtn     = document.getElementById('lightbox-next');
  const zoomBtns    = document.querySelectorAll('.gallery-zoom');

  if (!lightbox || !zoomBtns.length) return;

  let images = [];
  let currentIndex = 0;

  // Gather all images
  zoomBtns.forEach((btn, i) => {
    images.push({ src: btn.dataset.src, caption: btn.dataset.caption });

    btn.addEventListener('click', () => {
      openLightbox(i);
    });
  });

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    const img = images[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.caption;
    caption.textContent = img.caption;
  }

  function goNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  function goPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
  });

  // Touch/swipe support
  let startX = 0;
  lightbox.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goNext();
      else goPrev();
    }
  }, { passive: true });
})();

/* ================================================
   9. TESTIMONIAL SLIDER
   ================================================ */
(function initTestimonialSlider() {
  const track    = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('testimonial-dots');
  const prevBtn  = document.getElementById('testimonial-prev');
  const nextBtn  = document.getElementById('testimonial-next');

  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let current = 0;
  let autoplayTimer;

  // Create dots
  const dots = [];
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goNext() { goTo(current + 1); }
  function goPrev() { goTo(current - 1); }

  prevBtn && prevBtn.addEventListener('click', () => { goPrev(); resetAutoplay(); });
  nextBtn && nextBtn.addEventListener('click', () => { goNext(); resetAutoplay(); });

  // Autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(goNext, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  startAutoplay();

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  track.addEventListener('mouseleave', startAutoplay);

  // Touch support
  let startX = 0;
  track.addEventListener('touchstart', e => {
    startX = e.changedTouches[0].clientX;
    clearInterval(autoplayTimer);
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goNext();
      else goPrev();
    }
    startAutoplay();
  }, { passive: true });
})();

/* ================================================
   10. LIVE CLOCK & HOURS STATUS
   ================================================ */
(function initClock() {
  const hourHand    = document.getElementById('clock-hour');
  const minuteHand  = document.getElementById('clock-minute');
  const secondHand  = document.getElementById('clock-second');
  const timeDisplay = document.getElementById('current-time-display');
  const statusBadge = document.getElementById('hours-status-badge');

  if (!hourHand) return;

  // Opening hours schedule — World Travel Cafe, Kadi
  // Open 9:00 AM to 12:00 AM (midnight) every day
  const schedule = {
    0: { open: 9,  close: 24 }, // Sunday
    1: { open: 9,  close: 24 }, // Monday
    2: { open: 9,  close: 24 }, // Tuesday
    3: { open: 9,  close: 24 }, // Wednesday
    4: { open: 9,  close: 24 }, // Thursday
    5: { open: 9,  close: 24 }, // Friday
    6: { open: 9,  close: 24 }, // Saturday
  };

  function updateClock() {
    const now     = new Date();
    const h       = now.getHours();
    const m       = now.getMinutes();
    const s       = now.getSeconds();
    const day     = now.getDay();

    const hourDeg   = (h % 12) * 30 + m * 0.5;
    const minuteDeg = m * 6 + s * 0.1;
    const secondDeg = s * 6;

    hourHand.style.transform   = `rotate(${hourDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    secondHand.style.transform = `rotate(${secondDeg}deg)`;

    // Time display
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    if (timeDisplay) timeDisplay.textContent = timeStr;

    // Open/closed status
    if (statusBadge) {
      const todaySchedule = schedule[day];
      const isOpen = h >= todaySchedule.open && h < todaySchedule.close;
      statusBadge.textContent = isOpen ? '✓ We Are Open Now' : '✗ Currently Closed';
      statusBadge.className = 'hours-status-badge ' + (isOpen ? 'open-now' : 'closed-now');
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
})();

/* ================================================
   11. RESERVATION FORM WITH VALIDATION
   ================================================ */
(function initReservationForm() {
  const form      = document.getElementById('reservation-form');
  const success   = document.getElementById('reservation-success');
  const newResBtn = document.getElementById('reservation-new-btn');

  if (!form) return;

  // Set minimum date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  function showError(fieldId, message) {
    const errEl = document.getElementById(`${fieldId}-error`);
    const input = document.getElementById(fieldId);
    if (errEl) errEl.textContent = message;
    if (input) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
    }
  }

  function clearError(fieldId) {
    const errEl = document.getElementById(`${fieldId}-error`);
    const input = document.getElementById(fieldId);
    if (errEl) errEl.textContent = '';
    if (input) {
      input.classList.remove('error');
      input.removeAttribute('aria-invalid');
    }
  }

  function validateForm() {
    let isValid = true;

    // Name
    const name = document.getElementById('res-name');
    if (!name.value.trim() || name.value.trim().length < 2) {
      showError('res-name', 'Please enter your full name (at least 2 characters).');
      isValid = false;
    } else { clearError('res-name'); }

    // Email
    const email = document.getElementById('res-email');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      showError('res-email', 'Please enter a valid email address.');
      isValid = false;
    } else { clearError('res-email'); }

    // Guests
    const guests = document.getElementById('res-guests');
    if (!guests.value) {
      showError('res-guests', 'Please select the number of guests.');
      isValid = false;
    } else { clearError('res-guests'); }

    // Date
    const date = document.getElementById('res-date');
    if (!date.value) {
      showError('res-date', 'Please select a date for your reservation.');
      isValid = false;
    } else { clearError('res-date'); }

    // Time
    const time = document.getElementById('res-time');
    if (!time.value) {
      showError('res-time', 'Please select your preferred time.');
      isValid = false;
    } else { clearError('res-time'); }

    return isValid;
  }

  // Real-time validation on blur
  ['res-name', 'res-email', 'res-guests', 'res-date', 'res-time'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => {
        validateForm();
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = document.getElementById('reservation-submit-btn');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Processing…';

    // Simulate API call
    setTimeout(() => {
      form.setAttribute('aria-hidden', 'true');
      form.style.display = 'none';
      success.setAttribute('aria-hidden', 'false');
      success.style.display = 'flex';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });

  newResBtn && newResBtn.addEventListener('click', () => {
    const submitBtn = document.getElementById('reservation-submit-btn');
    form.reset();
    form.setAttribute('aria-hidden', 'false');
    form.style.display = '';
    success.setAttribute('aria-hidden', 'true');
    success.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = 'Confirm Reservation';
    // Clear all errors
    ['res-name', 'res-email', 'res-guests', 'res-date', 'res-time'].forEach(id => clearError(id));
  });
})();

/* ================================================
   12. NEWSLETTER FORM
   ================================================ */
(function initNewsletter() {
  const form    = document.getElementById('newsletter-form');
  const msgEl   = document.getElementById('newsletter-msg');
  const emailEl = document.getElementById('newsletter-email');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailEl.value.trim();

    if (!email || !emailPattern.test(email)) {
      msgEl.textContent = 'Please enter a valid email address.';
      msgEl.style.color = '#f87171';
      emailEl.focus();
      return;
    }

    const btn = document.getElementById('newsletter-submit-btn');
    btn.disabled = true;
    msgEl.textContent = '';

    // Simulate subscription
    setTimeout(() => {
      msgEl.textContent = '🎉 You\'re subscribed! Welcome to the Velvet Brew family.';
      msgEl.style.color = '#22c55e';
      emailEl.value = '';
      btn.disabled = false;
    }, 800);
  });
})();

/* ================================================
   13. BACK TO TOP BUTTON
   ================================================ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, 50), { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ================================================
   14. SMOOTH SCROLL FOR ANCHOR LINKS
   ================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ================================================
   15. FOOTER COPYRIGHT YEAR
   ================================================ */
(function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ================================================
   16. "ADD" BUTTON INTERACTION
   ================================================ */
(function initAddButtons() {
  const addBtns = document.querySelectorAll('.btn-add');

  addBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const originalText = this.textContent;
      this.textContent = '✓ Added!';
      this.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      this.disabled = true;

      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = '';
        this.disabled = false;
      }, 2000);
    });
  });
})();

/* ================================================
   17. MENU CARD HOVER — image tilt effect
   ================================================ */
(function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.menu-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width - 0.5;
      const y     = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ================================================
   18. ANNOUNCEMENT BANNER MARQUEE
   ================================================ */
(function initBannerMarquee() {
  const inner = document.querySelector('.announcement-inner');
  if (!inner || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Subtle entry animation
  inner.style.opacity = '0';
  inner.style.transform = 'translateY(-10px)';

  setTimeout(() => {
    inner.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    inner.style.opacity = '1';
    inner.style.transform = 'translateY(0)';
  }, 600);
})();

/* ================================================
   19. SECTION LABEL REVEAL (decorative lines)
   ================================================ */
(function initSectionLabels() {
  const labels = document.querySelectorAll('.section-label');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'sectionLabelReveal 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Inject keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sectionLabelReveal {
      from { opacity: 0; letter-spacing: 0.3em; }
      to   { opacity: 1; letter-spacing: 0.2em; }
    }
  `;
  document.head.appendChild(style);

  labels.forEach(label => {
    label.style.opacity = '0';
    observer.observe(label);
  });
})();

/* ================================================
   20. KEYBOARD NAVIGATION TRAP FOR MODALS
   ================================================ */
(function initFocusTrap() {
  function trapFocus(element) {
    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'input:not([disabled])',
      'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const focusables = Array.from(element.querySelectorAll(focusableSelectors));
    if (!focusables.length) return;

    const first = focusables[0];
    const last  = focusables[focusables.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // Apply to lightbox when open
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const observer = new MutationObserver(() => {
      if (lightbox.classList.contains('open')) {
        trapFocus(lightbox);
      }
    });
    observer.observe(lightbox, { attributes: true, attributeFilter: ['class'] });
  }
})();

/* ================================================
   21. WHY CARDS — staggered entrance
   ================================================ */
(function initWhyCards() {
  const cards = document.querySelectorAll('.why-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
})();

/* ================================================
   INIT LOG
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  console.log('%c✈️ World Travel Cafe, Kadi', 'font-size: 20px; font-weight: bold; color: #e8922a;');
  console.log('%cKadi\'s Favourite Travel-Themed Café · Hanumant Plaza, Balapir · 382715', 'font-size: 12px; color: #1e6070;');
});
