/**
 * Super P Used Cars - Main JavaScript
 * Author: GTR Development Team
 * Version: 2.0
 * Description: Enhanced security, accessibility, and user interaction features
 */

(function() {
  'use strict';

  // Security: Prevent console access in production
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    console.clear();
    console.log = console.warn = console.error = function() {};
  }

  // Security: Disable right-click context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // Security: Disable F12, Ctrl+Shift+I, Ctrl+U
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')) {
      e.preventDefault();
    }
  });

  // Anti-spam: Rate limiting for form submissions
  let lastSubmissionTime = 0;
  const SUBMISSION_COOLDOWN = 3000; // 3 seconds

  function canSubmit() {
    const now = Date.now();
    if (now - lastSubmissionTime < SUBMISSION_COOLDOWN) {
      return false;
    }
    lastSubmissionTime = now;
    return true;
  }

  // Security: Input sanitization
  function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Security: XSS Protection
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  // DOM Elements
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  const qrBoxes = document.querySelectorAll('.qr-box');
  const qrPopup = document.getElementById('qrPopup');
  const qrPopupImg = document.getElementById('popupImage');
  const qrPopupTitle = document.getElementById('popupTitle');
  const qrPopupDescription = document.getElementById('popupDescription');
  const qrPopupClose = document.getElementById('popupClose');

  // Mobile Menu Functionality
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function() {
      const open = menuBtn.classList.toggle('open');
      menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      
      // Focus management for accessibility
      if (open) {
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menuBtn.classList.remove('open');
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menuBtn.classList.remove('open');
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
      }
    });
  }

  // QR Code Descriptions
  const qrDescriptions = {
    line: {
      title: "📱 LINE Official Account",
      description: "เพิ่มเพื่อนเพื่อรับข้อมูลข่าวสารและโปรโมชั่นล่าสุด"
    },
    tiktok: {
      title: "🎵 TikTok Channel", 
      description: "ติดตามวิดีโอสั้นรีวิวรถยนต์และเทคนิคการเลือกซื้อรถมือสอง"
    },
    youtube: {
      title: "🎥 YouTube Channel",
      description: "ชมวิดีโอรีวิวรถยนต์เต็มรูปแบบและคำแนะนำจากผู้เชี่ยวชาญ"
    },
    facebook: {
      title: "📘 Facebook Page",
      description: "ติดตามข่าวสารและโปรโมชั่นล่าสุดใน Facebook"
    },
    maps: {
      title: "📍 Google Maps Location",
      description: "ดูตำแหน่งที่ตั้งของเราและเส้นทางการเดินทาง"
    }
  };

  // QR Code Popup Functionality
  if (qrBoxes.length > 0) {
    qrBoxes.forEach(function(box) {
      // Click handler
      box.addEventListener('click', function() {
        if (!canSubmit()) return; // Anti-spam protection
        
        const platform = box.getAttribute('data-platform');
        const qrData = qrDescriptions[platform];

        if (qrData && qrPopup && qrPopupImg && qrPopupTitle && qrPopupDescription) {
          // Sanitize data before displaying
          qrPopupImg.src = sanitizeInput(box.getAttribute('data-qr') || '');
          qrPopupTitle.textContent = qrData.title;
          qrPopupDescription.textContent = qrData.description;

          qrPopup.classList.add('active');
          qrPopup.setAttribute('aria-hidden', 'false');

          // Focus management for accessibility
          const closeButton = qrPopup.querySelector('.popup-close');
          if (closeButton) closeButton.focus();

          // Smooth animation
          setTimeout(function() {
            if (qrPopupImg) {
              qrPopupImg.style.transform = 'scale(1.05)';
              setTimeout(function() {
                qrPopupImg.style.transform = 'scale(1)';
              }, 200);
            }
          }, 100);
        }
      });

      // Keyboard support
      box.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          box.click();
        }
      });

      // Hover effects
      box.addEventListener('mouseenter', function() {
        box.style.transform = 'translateY(-8px) scale(1.05)';
      });

      box.addEventListener('mouseleave', function() {
        box.style.transform = 'translateY(0) scale(1)';
      });

      // Focus effects for accessibility
      box.addEventListener('focus', function() {
        box.style.transform = 'translateY(-8px) scale(1.05)';
      });

      box.addEventListener('blur', function() {
        box.style.transform = 'translateY(0) scale(1)';
      });

      // Make boxes focusable
      if (!box.hasAttribute('tabindex')) {
        box.setAttribute('tabindex', '0');
      }
    });
  }

  // QR Popup Close Functionality
  if (qrPopupClose) {
    qrPopupClose.addEventListener('click', function() {
      closeQRPopup();
    });
  }

  // Close popup when clicking overlay
  if (qrPopup) {
    qrPopup.addEventListener('click', function(e) {
      if (e.target === qrPopup) {
        closeQRPopup();
      }
    });
  }

  // Close popup on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && qrPopup && qrPopup.classList.contains('active')) {
      closeQRPopup();
    }
  });

  function closeQRPopup() {
    if (qrPopup) {
      qrPopup.classList.remove('active');
      qrPopup.setAttribute('aria-hidden', 'true');
      
      // Return focus to the QR box that opened the popup
      const activeQRBox = document.querySelector('.qr-box:focus');
      if (activeQRBox) {
        activeQRBox.focus();
      }
    }
  }

  // Lazy loading for images
  function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // Smooth scrolling for anchor links
  function smoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Form validation and security
  function enhanceFormSecurity() {
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        if (!canSubmit()) {
          e.preventDefault();
          alert('กรุณารอสักครู่ก่อนส่งข้อมูลอีกครั้ง');
          return;
        }

        // Validate and sanitize inputs
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(function(input) {
          if (input.type !== 'file') {
            input.value = sanitizeInput(input.value);
          }
        });
      });
    });
  }

  // Contact link tracking (for analytics)
  function trackContactClicks() {
    const contactLinks = document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]');
    contactLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        // Analytics tracking can be added here
        console.log('Contact clicked:', link.href);
      });
    });
  }

  // Performance monitoring
  function performanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log('Page load time:', loadTime + 'ms');
    });

    // Monitor first paint
    if ('PerformancePaintTiming' in window) {
      const observer = new PerformanceObserver(function(list) {
        list.getEntries().forEach(function(entry) {
          console.log(entry.name + ':', entry.startTime + 'ms');
        });
      });
      observer.observe({entryTypes: ['paint']});
    }
  }

  // Error handling
  window.addEventListener('error', function(e) {
    console.log('JavaScript error:', e.error);
    // Can send error reports to server in production
  });

  // Security: Prevent iframe embedding
  if (window !== window.top) {
    window.top.location = window.location;
  }

  // Initialize all functionality when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    lazyLoadImages();
    smoothScrolling();
    enhanceFormSecurity();
    trackContactClicks();
    performanceMonitoring();
    
    // Add loading class removal
    document.body.classList.add('loaded');
  });

  // Service Worker registration for offline support
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('SW registered: ', registration);
        })
        .catch(function(registrationError) {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // Accessibility enhancements
  function enhanceAccessibility() {
    // Skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'ข้ามไปเนื้อหาหลัก';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      border-radius: 4px;
    `;
    skipLink.addEventListener('focus', function() {
      skipLink.style.top = '6px';
    });
    skipLink.addEventListener('blur', function() {
      skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(announcer);

    window.announceToScreenReader = function(message) {
      announcer.textContent = message;
      setTimeout(function() {
        announcer.textContent = '';
      }, 1000);
    };
  }

  // Initialize accessibility enhancements
  enhanceAccessibility();

})();
