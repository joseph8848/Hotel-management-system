/**
 * Landing Page JavaScript - Champion Hotel
 */

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  nav: document.getElementById('main-nav'),
  navToggle: document.getElementById('nav-toggle'),
  navMenu: document.getElementById('nav-menu'),
  navLinks: document.querySelectorAll('.nav-link'),
  scrollTop: document.getElementById('scroll-top'),
  contactForm: document.getElementById('contact-form'),
  quickCheckin: document.getElementById('quick-checkin'),
  quickCheckout: document.getElementById('quick-checkout'),
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  initializeScrollEffects();
  initializeDateInputs();
  initializeContactForm();
  initializeSmoothScroll();
});

// ============================================
// NAVIGATION
// ============================================
/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
  // Mobile menu toggle
  if (elements.navToggle) {
    elements.navToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when clicking on a link
  elements.navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!elements.nav.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });

  // Update active link on scroll
  window.addEventListener('scroll', updateActiveLink);
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  elements.navMenu.classList.toggle('active');
  elements.navToggle.classList.toggle('active');
  const expanded = elements.navToggle.classList.contains('active') ? 'true' : 'false';
  elements.navToggle.setAttribute('aria-expanded', expanded);
  if (expanded === 'true') {
    document.body.classList.add('nav-open');
  } else {
    document.body.classList.remove('nav-open');
  }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  elements.navMenu.classList.remove('active');
  elements.navToggle.classList.remove('active');
  elements.navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      elements.navLinks.forEach((link) => link.classList.remove('active'));
      if (navLink) {
        navLink.classList.add('active');
      }
    }
  });
}

// ============================================
// SCROLL EFFECTS
// ============================================
/**
 * Initialize scroll-based effects
 */
function initializeScrollEffects() {
  window.addEventListener('scroll', handleScroll);
}

/**
 * Handle scroll events
 */
function handleScroll() {
  const scrollY = window.pageYOffset;

  // Add shadow to navigation on scroll
  if (scrollY > 50) {
    elements.nav.classList.add('scrolled');
  } else {
    elements.nav.classList.remove('scrolled');
  }

  // Show/hide scroll to top button
  if (scrollY > 300) {
    elements.scrollTop.classList.add('visible');
  } else {
    elements.scrollTop.classList.remove('visible');
  }
}

/**
 * Scroll to top functionality
 */
if (elements.scrollTop) {
  elements.scrollTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// ============================================
// SMOOTH SCROLL
// ============================================
/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just "#"
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed nav

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });
}

// ============================================
// DATE INPUTS
// ============================================
/**
 * Initialize date inputs with minimum dates
 */
function initializeDateInputs() {
  if (!elements.quickCheckin || !elements.quickCheckout) return;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  elements.quickCheckin.min = formatDate(today);
  elements.quickCheckout.min = formatDate(tomorrow);

  elements.quickCheckin.value = formatDate(today);
  elements.quickCheckout.value = formatDate(tomorrow);

  // Update checkout min date when checkin changes
  elements.quickCheckin.addEventListener('change', () => {
    const checkinDate = new Date(elements.quickCheckin.value);
    const minCheckout = new Date(checkinDate);
    minCheckout.setDate(minCheckout.getDate() + 1);

    elements.quickCheckout.min = formatDate(minCheckout);

    // Adjust checkout if it's before new minimum
    if (new Date(elements.quickCheckout.value) <= checkinDate) {
      elements.quickCheckout.value = formatDate(minCheckout);
    }
  });
}

/**
 * Format date for input (YYYY-MM-DD)
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================
// CONTACT FORM
// ============================================
/**
 * Initialize contact form
 */
function initializeContactForm() {
  if (!elements.contactForm) return;

  elements.contactForm.addEventListener('submit', handleContactSubmit);
}

/**
 * Handle contact form submission
 */
async function handleContactSubmit(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('contact-name').value,
    email: document.getElementById('contact-email').value,
    subject: document.getElementById('contact-subject').value,
    message: document.getElementById('contact-message').value,
  };

  // Show loading state
  const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Show success message
    showNotification("Message sent successfully! We'll get back to you soon.", 'success');

    // Reset form
    elements.contactForm.reset();
  } catch (error) {
    console.error('Error sending message:', error);
    showNotification('Failed to send message. Please try again.', 'error');
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// ============================================
// NOTIFICATIONS
// ============================================
/**
 * Show notification toast
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `alert alert-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 10000;
    min-width: 300px;
    animation: slideInRight 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ============================================
// INTERSECTION OBSERVER (Animations on scroll)
// ============================================
/**
 * Initialize intersection observer for scroll animations
 */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements
document.querySelectorAll('.room-card, .amenity-card, .stat-item').forEach((el) => {
  observer.observe(el);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================
/**
 * Debounce function for performance
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Apply throttle to scroll handler
window.addEventListener('scroll', throttle(handleScroll, 100));
