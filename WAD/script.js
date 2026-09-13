/**
 * Clean Reading Notes Controller
 * Handles Theme Cycling, Font Scaling, Collapsible Left Sidebar, Accordions & Mid PYQ Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeCycle();
  initFontSizeControls();
  initSidebarControls();
  initLightbox();
});

/* Theme Cycling: Paper -> White -> Dark */
function initThemeCycle() {
  const themeToggle = document.getElementById('themeToggle');
  const themes = ['mode-paper', 'mode-white', 'mode-dark'];
  
  // Load saved preference or default to paper
  const savedTheme = localStorage.getItem('notes-theme') || 'mode-paper';
  document.body.className = savedTheme;

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let currentIndex = themes.findIndex(t => document.body.classList.contains(t));
      if (currentIndex === -1) currentIndex = 0;
      
      const nextIndex = (currentIndex + 1) % themes.length;
      const newTheme = themes[nextIndex];

      document.body.className = newTheme;
      localStorage.setItem('notes-theme', newTheme);
    });
  }
}

/* Font Size Resizing (A- / A+) */
function initFontSizeControls() {
  const incBtn = document.getElementById('fontIncBtn');
  const decBtn = document.getElementById('fontDecBtn');
  let currentSize = parseFloat(localStorage.getItem('notes-fontsize')) || 16.5;

  applyFontSize(currentSize);

  if (incBtn) {
    incBtn.addEventListener('click', () => {
      if (currentSize < 24) {
        currentSize += 1;
        applyFontSize(currentSize);
      }
    });
  }

  if (decBtn) {
    decBtn.addEventListener('click', () => {
      if (currentSize > 13) {
        currentSize -= 1;
        applyFontSize(currentSize);
      }
    });
  }

  function applyFontSize(size) {
    document.documentElement.style.setProperty('--base-font-size', `${size}px`);
    localStorage.setItem('notes-fontsize', size);
  }
}

/* Collapsible Left Sidebar & Accordions */
function initSidebarControls() {
  const sidebar = document.getElementById('notesSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const toggleBtn = document.getElementById('sidebarToggle');
  const floatBtn = document.getElementById('floatingMenuBtn');
  const closeBtn = document.getElementById('sidebarCloseBtn');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = window.innerWidth <= 768 ? 'hidden' : '';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    if (sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
  if (floatBtn) floatBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      closeLightbox();
    }
  });

  // Accordion Expand/Collapse
  const accordionTriggers = document.querySelectorAll('.accordion-trigger:not([disabled])');
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parentAccordion = trigger.closest('.sidebar-accordion');
      const content = parentAccordion.querySelector('.accordion-content');
      
      const isOpen = parentAccordion.classList.contains('active');
      if (isOpen) {
        parentAccordion.classList.remove('active');
        content.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        parentAccordion.classList.add('active');
        content.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Auto-close sidebar on mobile when navigating to an anchor link
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });
}

/* Lightbox Modal for Question Papers */
function initLightbox() {
  const modal = document.getElementById('imageLightbox');
  const body = document.getElementById('lightboxBody');
  const zoomBtn = document.getElementById('lightboxZoomToggle');
  const zoomIcon = document.getElementById('lightboxZoomIcon');
  const zoomText = document.getElementById('lightboxZoomText');
  if (!modal) return;

  function updateZoomUI(isZoomed) {
    if (zoomIcon) {
      zoomIcon.className = isZoomed ? 'fa-solid fa-compress' : 'fa-solid fa-magnifying-glass-plus';
    }
    if (zoomText) {
      zoomText.textContent = isZoomed ? 'Fit Screen' : 'Zoom 100%';
    }
  }

  window.openLightbox = function(imgSrc, title) {
    const imgEl = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const newTabBtn = document.getElementById('lightboxNewTabBtn');

    if (imgEl) imgEl.src = imgSrc;
    if (titleEl) titleEl.textContent = title || 'Question Paper Viewer';
    if (newTabBtn) newTabBtn.href = imgSrc;

    // Always reset to fit-screen mode so nothing is cut off
    if (body) {
      body.classList.remove('zoomed');
      body.scrollTop = 0;
    }
    updateZoomUI(false);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.toggleLightboxZoom = function() {
    if (!body) return;
    const isNowZoomed = body.classList.toggle('zoomed');
    updateZoomUI(isNowZoomed);
  };
}
