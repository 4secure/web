/* ============================================
   FOUR SECURE - MAIN JAVASCRIPT
   ============================================ */

// ============================================
// LOADER FUNCTIONALITY
// ============================================
// Hide loader when page is fully loaded
window.addEventListener('load', function() {
  const loaderWrapper = document.querySelector('.loader-wrapper');
  if (loaderWrapper) {
    setTimeout(function() {
      loaderWrapper.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 500); // Show loader for at least 500ms
  }
});

// ============================================
// TIMELINE ZIGZAG PATTERN
// ============================================
function initTimelineZigzag() {
  const svg = document.getElementById('tlSvg');
  const dot = document.getElementById('tlDot');
  
  if (!svg || !dot) return;
  
  // Clear existing content
  svg.innerHTML = '';
  
  // Get all timeline rows
  const rows = document.querySelectorAll('.tl-row');
  if (rows.length === 0) return;
  
  // Create zigzag path
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  let pathData = '';
  
  rows.forEach((row, index) => {
    const icon = row.querySelector('.tl-icon-ring');
    if (!icon) return;
    
    const rect = icon.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    const x = rect.left + rect.width / 2 - svgRect.left;
    const y = rect.top + rect.height / 2 - svgRect.top;
    
    if (index === 0) {
      pathData += `M ${x} ${y}`;
    } else {
      // Create straight line
      pathData += ` L ${x} ${y}`;
    }
  });
  
  // Set path attributes
  path.setAttribute('d', pathData);
  path.setAttribute('stroke', 'rgba(110, 192, 251, 0.3)');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-dasharray', '5, 5');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  
  svg.appendChild(path);
  
  // Position dot at first icon
  const firstIcon = document.querySelector('.tl-icon-ring');
  if (firstIcon) {
    const firstRect = firstIcon.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    dot.style.left = (firstRect.left + firstRect.width / 2 - svgRect.left) + 'px';
    dot.style.top = (firstRect.top + firstRect.height / 2 - svgRect.top) + 'px';
  }
}

// Initialize timeline when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initTimelineZigzag();
  
  // Redraw on window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initTimelineZigzag, 250);
  });
});

// Also hide loader when DOM is ready (fallback)
document.addEventListener('DOMContentLoaded', function() {
  // If page loads very quickly, still show loader briefly
  setTimeout(function() {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    if (loaderWrapper) {
      loaderWrapper.classList.add('hidden');
      document.body.classList.add('loaded');
    }
  }, 1000);
});

// Force hide loader after 3 seconds as ultimate fallback
setTimeout(function() {
  const loaderWrapper = document.querySelector('.loader-wrapper');
  if (loaderWrapper && !loaderWrapper.classList.contains('hidden')) {
    loaderWrapper.classList.add('hidden');
    document.body.classList.add('loaded');
  }
}, 3000);

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // THEME TOGGLE
  // ============================================
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', currentTheme);
  
  // Theme toggle functionality
  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // ============================================
  // NAVBAR SCROLL EFFECT
  // ============================================
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ============================================
  // CUSTOM DROPDOWN FUNCTIONALITY
  // ============================================
  const customDropdowns = document.querySelectorAll('.custom-dropdown');
  
  customDropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');
    const selected = dropdown.querySelector('.dropdown-selected');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    const items = dropdown.querySelectorAll('.dropdown-item');
    
    // Toggle dropdown
    trigger?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Close other dropdowns
      customDropdowns.forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
          otherDropdown.querySelector('.dropdown-trigger')?.classList.remove('active');
          otherDropdown.querySelector('.dropdown-menu')?.classList.remove('show');
        }
      });
      
      // Toggle current dropdown
      trigger.classList.toggle('active');
      menu.classList.toggle('show');
    });
    
    // Handle item selection
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const value = item.getAttribute('data-value');
        const text = item.querySelector('span:last-child').textContent;
        
        // Update selected text
        selected.textContent = text;
        
        // Update hidden input
        if (hiddenInput) {
          hiddenInput.value = value;
        }
        
        // Update selected state
        items.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        
        // Close dropdown
        trigger.classList.remove('active');
        menu.classList.remove('show');
        
        // Trigger change event for form validation
        hiddenInput?.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
      customDropdowns.forEach(dropdown => {
        dropdown.querySelector('.dropdown-trigger')?.classList.remove('active');
        dropdown.querySelector('.dropdown-menu')?.classList.remove('show');
      });
    }
  });
  
  // Close dropdowns on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      customDropdowns.forEach(dropdown => {
        dropdown.querySelector('.dropdown-trigger')?.classList.remove('active');
        dropdown.querySelector('.dropdown-menu')?.classList.remove('show');
      });
    }
  });

  // ============================================
  // HAMBURGER MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav?.classList.toggle('open');
    document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
  });

  // Mobile dropdown
  document.querySelectorAll('.mobile-dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const sub = toggle.nextElementSibling;
      sub?.classList.toggle('open');
      const arrow = toggle.querySelector('.dropdown-arrow');
      if (arrow) arrow.style.transform = sub?.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (mobileNav?.classList.contains('open') && !mobileNav.contains(e.target) && !hamburger?.contains(e.target)) {
      hamburger?.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ============================================
  // HERO CANVAS ANIMATION
  // ============================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animFrame;
    let particles = [];
    let mouse = { x: null, y: null };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speed = Math.random() * 0.3 + 0.1;
        this.vx = (Math.random() - 0.5) * this.speed;
        this.vy = -(Math.random() * this.speed + 0.1);
        this.opacity = Math.random() * 0.6 + 0.1;
        this.life = 0;
        this.maxLife = Math.random() * 200 + 100;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        if (this.life > this.maxLife || this.y < 0 || this.x < 0 || this.x > canvas.width) {
          this.reset();
        }
      }
      draw() {
        const progress = this.life / this.maxLife;
        const fade = progress < 0.1 ? progress * 10 : progress > 0.8 ? (1 - progress) * 5 : 1;
        const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
        const color = isLightTheme ? `rgba(43, 77, 141, ${this.opacity * fade})` : `rgba(0, 212, 255, ${this.opacity * fade})`;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = Array.from({ length: 80 }, () => {
        const p = new Particle();
        p.life = Math.random() * p.maxLife;
        return p;
      });
    };

    const drawConnections = () => {
      const isLightTheme = document.documentElement.getAttribute('data-theme') === 'light';
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const color = isLightTheme ? `rgba(43, 77, 141, ${(1 - dist / 120) * 0.08})` : `rgba(0, 212, 255, ${(1 - dist / 120) * 0.08})`;
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animFrame = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    canvas.parentElement?.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
  }

  // ============================================
  // TYPING EFFECT
  // ============================================
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const words = ['Secure Your Digital Assets', 'Protect Your Infrastructure', 'Defend Against Threats' , 'Respond to Breaches'];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      const current = words[wordIdx];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typingEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 60 : 100;

      if (!isDeleting && charIdx === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        speed = 400;
      }

      timeout = setTimeout(type, speed);
    };

    type();
  }

  // ============================================
  // SCROLL REVEAL
  // ============================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // ANIMATED COUNTERS
  // ============================================
  const counters = document.querySelectorAll('.counter');

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);
      const current = target * eased;

      if (Number.isInteger(target)) {
        el.textContent = Math.floor(current);
      } else {
        el.textContent = current.toFixed(1);
      }

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = Number.isInteger(target) ? target : target.toFixed(1);
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ============================================
  // TESTIMONIAL SLIDER
  // ============================================
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (track) {
    let current = 0;
    const total = track.children.length;
    let autoSlide;

    const goTo = (idx) => {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

    const resetAuto = () => {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => goTo(current + 1), 5000);
    };

    goTo(0);
    resetAuto();

    // Touch/swipe
    let touchStart = 0;
    track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAuto(); }
    });
  }

  // ============================================
  // CONTACT FORM VALIDATION - DISABLED (using validate.js instead)
  // ============================================
  // Note: Form validation is now handled by validate.js to prevent conflicts
  // and ensure proper service dropdown validation
  const contactForm = document.getElementById('contact-form');
  // Form validation disabled - using validate.js instead

  // ============================================
  // BLOG SEARCH & FILTER
  // ============================================
  const searchInput = document.getElementById('blog-search');
  const blogCards = document.querySelectorAll('.blog-list-card');
  const categoryItems = document.querySelectorAll('.category-item');

  if (searchInput) {
    searchInput.addEventListener('input', filterBlogs);
  }

  if (categoryItems.length) {
    categoryItems.forEach(item => {
      item.addEventListener('click', () => {
        categoryItems.forEach(c => c.classList.remove('active'));
        item.classList.add('active');
        filterBlogs();
      });
    });
  }

  function filterBlogs() {
    const query = searchInput?.value.toLowerCase() || '';
    const activeCategory = document.querySelector('.category-item.active')?.dataset.category || 'all';

    blogCards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const text = card.querySelector('p')?.textContent.toLowerCase() || '';
      const cat = card.dataset.category || '';

      const matchesSearch = !query || title.includes(query) || text.includes(query);
      const matchesCategory = activeCategory === 'all' || cat === activeCategory;

      card.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        hamburger?.classList.remove('active');
        mobileNav?.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // ============================================
  // FAQ TOGGLE FUNCTIONALITY
  // ============================================
  window.toggleFAQ = function(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon');
    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
    
    // Close all other FAQ items with smooth animation
    document.querySelectorAll('.faq-item').forEach(item => {
      if (item !== faqItem) {
        const otherAnswer = item.querySelector('.faq-answer');
        const otherIcon = item.querySelector('.faq-icon');
        
        // Smooth closing animation
        otherAnswer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        otherAnswer.style.maxHeight = '0px';
        otherAnswer.style.padding = '0 25px 0 25px';
        otherIcon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        otherIcon.style.transform = 'rotate(0deg)';
      }
    });
    
    // Toggle current FAQ item with smooth animation
    if (isOpen) {
      // Smooth closing animation
      answer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      answer.style.maxHeight = '0px';
      answer.style.padding = '0 25px 0 25px';
      icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      icon.style.transform = 'rotate(0deg)';
    } else {
      // Temporarily remove transition to get accurate height
      const originalTransition = answer.style.transition;
      answer.style.transition = 'none';
      
      // Set padding first to get accurate scrollHeight
      answer.style.padding = '0 25px 20px 25px';
      
      // Get the actual height
      const height = answer.scrollHeight + 'px';
      
      // Apply smooth opening animation
      answer.style.transition = 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      answer.style.maxHeight = height;
      
      // Smooth icon rotation
      icon.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      icon.style.transform = 'rotate(180deg)';
      
      // Add subtle scale effect to the FAQ item
      faqItem.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      faqItem.style.transform = 'scale(1.02)';
      faqItem.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
      
      // Reset scale after animation
      setTimeout(() => {
        faqItem.style.transform = 'scale(1)';
        faqItem.style.boxShadow = '';
      }, 300);
    }
  };

});




  document.addEventListener('DOMContentLoaded', function() {
      const megaTrigger = document.getElementById('services-mega-trigger');
      const megaMenu = document.getElementById('services-mega-menu');
      const megaOverlay = document.getElementById('mega-menu-overlay');
      
      if (megaTrigger && megaMenu && megaOverlay) {
        function showMegaMenu() {
          megaMenu.classList.add('show');
          megaOverlay.classList.add('show');
        }
        
        function hideMegaMenu() {
          megaMenu.classList.remove('show');
          megaOverlay.classList.remove('show');
        }
        
        megaTrigger.addEventListener('mouseenter', showMegaMenu);
        megaMenu.addEventListener('mouseenter', showMegaMenu);
        
        megaTrigger.addEventListener('mouseleave', function(e) {
          setTimeout(function() {
            if (!megaMenu.matches(':hover') && !megaTrigger.matches(':hover')) {
              hideMegaMenu();
            }
          }, 100);
        });
        
        megaMenu.addEventListener('mouseleave', function(e) {
          setTimeout(function() {
            if (!megaTrigger.matches(':hover') && !megaMenu.matches(':hover')) {
              hideMegaMenu();
            }
          }, 100);
        });
        
        megaOverlay.addEventListener('click', hideMegaMenu);
        
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && megaMenu.classList.contains('show')) {
            hideMegaMenu();
          }
        });
      }
    });









 /* ─── Portfolio data ────────────────────────────────────────────── */
  const heroPortfolioData = [
    {
      id: 1,
      title: '24x7 Managed SOC',
      description: 'Round-the-clock threat detection, AI correlation & Tier 1-3 analysis. Continuous monitoring and rapid response.',
      image: '/assets/images/service-1.jpg',
      link: '../Services/24x7-SOC.html',
      tech: ['SOC', 'SIEM', 'Threat Detection', 'AI Analysis']
    },
    {
      id: 2,
      title: 'VAPT',
      description: 'Web, mobile, API, network pentesting and social engineering simulations. Real-world attack emulation.',
      image: '/assets/images/service-2.jpg',
      link: '../Services/vapt.html',
      tech: ['Pentesting', 'Vulnerability Assessment', 'Security Testing', 'Risk Analysis']
    },
    {
      id: 3,
      title: 'Assessments & Audits',
      description: 'Deep-dive posture evaluation, gap analysis, compliance readiness (ISO, NIST, GDPR).',
      image: '/assets/images/service-3.jpg',
      link: '../Services/assessment.html',
      tech: ['Compliance', 'ISO 27001', 'NIST', 'GDPR', 'Gap Analysis']
    },
    {
      id: 4,
      title: 'Managed Security',
      description: 'Firewall, endpoint, and continuous monitoring — fully managed by security experts.',
      image: '/assets/images/service-4.jpg',
      link: '../Services/mss.html',
      tech: ['Firewall Management', 'Endpoint Security',  'Expert Management']
    },
    {
      id: 5,
      title: 'Threat Intelligence',
      description: 'Dark web monitoring, threat feeds, and contextual analysis for proactive defense.',
      image: '/assets/images/service-5.jpg',
      link: '../Services/threat-intel.html',
      tech: ['Threat Feeds', 'Dark Web Monitoring', 'Contextual Analysis', 'Proactive Defense']
    },
    {
      id: 6,
      title: 'Incident Response',
      description: 'Emergency containment, forensics, ransomware recovery — 30-min SLA.',
      image: '/assets/images/service-6.jpg',
      link: '../Services/ir.html',
      tech: ['Emergency Response', 'Forensics', 'Ransomware Recovery', '30-min SLA']
    },
    {
      id: 7,
      title: 'Governance, Risk & Compliance',
      description: 'Integrated risk management, policy, and alignment with ISO/NIST.',
      image: '/assets/images/service-7.jpg',
      link: '../Services/grc.html',
      tech: ['Risk Management', 'Policy Development', 'ISO/NIST Alignment', 'GRC Framework']
    },
    {
      id: 8,
      title: 'Identity & Access Management',
      description: 'SSO, MFA, PAM, identity governance — secure your digital identities.',
      image: '/assets/images/service-8.jpg',
      link: '../Services/iam.html',
      tech: ['SSO', 'MFA', 'PAM', 'Identity Governance', 'Access Control']
    }
  ];

  /* ─── State ─────────────────────────────────────────────────────── */
  let heroCurrentIndex = 0;
  const heroCarousel            = document.getElementById('heroCarousel');
  const heroIndicatorsContainer = document.getElementById('heroIndicators');

  /* ─── Build one card element ────────────────────────────────────── */
  function heroCreateCarouselItem(data, index) {
    const item         = document.createElement('div');
    item.className     = 'hero-carousel-item';
    item.dataset.index = index;

    const techBadges = data.tech
      .map(t => `<span class="hero-tech-badge">${t}</span>`)
      .join('');

    const num = data.id < 10 ? '0' + data.id : String(data.id);

    item.innerHTML = `
      <a href="${data.link}" class="hero-card-link">
        <div class="hero-card">
          <div class="hero-card-number">${num}</div>
          <div class="hero-card-image">
            <img src="${data.image}" alt="${data.title}" loading="lazy">
          </div>
          <h3 class="hero-card-title">${data.title}</h3>
          <p class="hero-card-description">${data.description}</p>
          <div class="hero-card-tech">${techBadges}</div>
          <div class="hero-card-cta">Learn More</div>
        </div>
      </a>`;

    return item;
  }

  /* ─── Build the full carousel ───────────────────────────────────── */
  function heroInitCarousel() {
    heroCarousel.innerHTML            = '';
    heroIndicatorsContainer.innerHTML = '';

    heroPortfolioData.forEach((data, index) => {
      heroCarousel.appendChild(heroCreateCarouselItem(data, index));

      const dot = document.createElement('div');
      dot.className     = 'hero-indicator' + (index === 0 ? ' active' : '');
      dot.dataset.index = index;
      dot.addEventListener('click', () => heroGoToSlide(index));
      heroIndicatorsContainer.appendChild(dot);
    });

    heroUpdateCarousel();
  }

  /* ─── Read card size from CSS variables ─────────────────────────── */
  /*
    JS reads --card-w so spacing multipliers always match whatever
    size the CSS breakpoint has set. No duplicated numbers.
  */
  function getCardWidth() {
    return parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--card-w')
    ) || 360;
  }

  /* ─── Position all cards ────────────────────────────────────────── */
  function heroUpdateCarousel() {
    const items      = document.querySelectorAll('.hero-carousel-item');
    const indicators = document.querySelectorAll('.hero-indicator');
    const total      = items.length;
    const vw         = window.innerWidth;
    const isMobile   = vw <= 768;

    const cardW = getCardWidth();

    /*
      Spacing derived from card width — no hardcoded pixel values.
      Multipliers chosen so adjacent cards have a small visible gap
      and still feel like a 3-D fan.
    */
    const sp1 = Math.round(cardW * 1.15);
    const sp2 = Math.round(cardW * 1.75);
    const sp3 = Math.round(cardW * 2.15);

    items.forEach((item, index) => {
      let offset = index - heroCurrentIndex;
      if (offset >  total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      const abs  = Math.abs(offset);
      const sign = offset < 0 ? -1 : 1;

      item.style.transition = 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)';

      if (abs === 0) {
        item.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
        item.style.opacity   = '1';
        item.style.zIndex    = '10';
      } else if (abs === 1) {
        const rot = isMobile ? 20 : 25;
        const sc  = isMobile ? 0.88 : 0.85;
        item.style.transform = `translate(-50%,-50%) translateX(${sign * sp1}px) translateZ(-150px) rotateY(${-sign * rot}deg) scale(${sc})`;
        item.style.opacity   = '0.85';
        item.style.zIndex    = '5';
      } else if (abs === 2) {
        const rot = isMobile ? 30 : 35;
        const sc  = isMobile ? 0.75 : 0.72;
        item.style.transform = `translate(-50%,-50%) translateX(${sign * sp2}px) translateZ(-280px) rotateY(${-sign * rot}deg) scale(${sc})`;
        item.style.opacity   = '0.6';
        item.style.zIndex    = '3';
      } else if (abs === 3) {
        const rot = isMobile ? 38 : 42;
        const sc  = isMobile ? 0.62 : 0.58;
        item.style.transform = `translate(-50%,-50%) translateX(${sign * sp3}px) translateZ(-400px) rotateY(${-sign * rot}deg) scale(${sc})`;
        item.style.opacity   = '0.35';
        item.style.zIndex    = '2';
      } else {
        item.style.transform = 'translate(-50%,-50%) translateZ(-550px) scale(0.45)';
        item.style.opacity   = '0.15';
        item.style.zIndex    = '1';
      }
    });

    indicators.forEach((dot, i) =>
      dot.classList.toggle('active', i === heroCurrentIndex)
    );
  }

  /* ─── Navigation ────────────────────────────────────────────────── */
  function heroNextSlide() {
    heroCurrentIndex = (heroCurrentIndex + 1) % heroPortfolioData.length;
    heroUpdateCarousel();
  }

  function heroPrevSlide() {
    heroCurrentIndex = (heroCurrentIndex - 1 + heroPortfolioData.length) % heroPortfolioData.length;
    heroUpdateCarousel();
  }

  function heroGoToSlide(index) {
    heroCurrentIndex = index;
    heroUpdateCarousel();
  }

  /* ─── Controls ──────────────────────────────────────────────────── */
  document.getElementById('heroNextBtn').addEventListener('click', heroNextSlide);
  document.getElementById('heroPrevBtn').addEventListener('click', heroPrevSlide);

  /* Auto-rotate */
  let heroAutoRotate = setInterval(heroNextSlide, 2000);
  const heroSection  = document.querySelector('.hero-carousel-section');
  heroSection.addEventListener('mouseenter', () => clearInterval(heroAutoRotate));
  heroSection.addEventListener('mouseleave', () => {
    heroAutoRotate = setInterval(heroNextSlide, 2000);
  });

  /* Keyboard */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  heroPrevSlide();
    if (e.key === 'ArrowRight') heroNextSlide();
  });

  /* Swipe */
  let touchStartX = 0;
  heroSection.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  heroSection.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? heroNextSlide() : heroPrevSlide();
  }, { passive: true });

  /* Resize */
  let heroResizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(heroResizeTimeout);
    heroResizeTimeout = setTimeout(heroUpdateCarousel, 250);
  });

  /* ─── Init ──────────────────────────────────────────────────────── */
  heroInitCarousel();




// // ============================================================
// // FOUR SECURE — Contact Form Email Handler
// // Works on both index.html and contact.html automatically
// // ============================================================

// (function () {

//   const form = document.getElementById('contact-form');
//   if (!form) return;

//   form.addEventListener('submit', async function (e) {
//     e.preventDefault();

//     const successEl = form.querySelector('.form-success');
//     const submitBtn = form.querySelector('button[type="submit"]');

//     // Collect fields — handles both page layouts
//     const firstName = (form.querySelector('#first-name')?.value || '').trim();
//     const lastName  = (form.querySelector('#last-name')?.value  || '').trim();
//     const nameField = (form.querySelector('#name')?.value       || '').trim();

//     // contact.html uses first + last name; index.html uses single #name field
//     const name    = nameField || [firstName, lastName].filter(Boolean).join(' ');
//     const email   = (form.querySelector('#email')?.value   || '').trim();
//     const phone   = (form.querySelector('#phone')?.value   || '').trim();
//     const company = (form.querySelector('#company')?.value || '').trim();
//     const service = (form.querySelector('#service')?.value || '').trim();
//     const subject = (form.querySelector('#subject')?.value || '').trim();
//     const message = (form.querySelector('#message')?.value || '').trim();

//     // Consent checkbox (contact.html only)
//     const consentEl = form.querySelector('#consent');
//     if (consentEl && !consentEl.checked) {
//       alert('Please agree to the data processing consent before submitting.');
//       return;
//     }

//     // Validation
//     if (!name)    { alert('Please enter your name.'); return; }
//     if (!email)   { alert('Please enter your email address.'); return; }
//     if (!message) { alert('Please enter a message.'); return; }

//     // Build full message — appends company, service, subject for email context
//     let fullMessage = message;
//     if (company) fullMessage += `\n\nCompany: ${company}`;
//     if (service) fullMessage += `\nService Interest: ${service}`;
//     if (subject) fullMessage += `\nSubject: ${subject}`;

//     // Phone goes in subject field (matches send-email.php extraction logic)
//     const payload = {
//       name:    name,
//       email:   email,
//       subject: phone ? `Contact Form - ${phone}` : 'Contact Form Submission',
//       message: fullMessage
//     };

//     // Loading state
//     const originalBtnHTML = submitBtn.innerHTML;
//     submitBtn.disabled = true;
//     submitBtn.innerHTML = 'Sending…';

//     try {
//       const res  = await fetch('send-email.php', {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body:    JSON.stringify(payload)
//       });
//       const data = await res.json();

//       if (data.success) {
//         if (successEl) {
//           successEl.style.display = 'block';
//           successEl.style.opacity = '1';
//         }
//         form.reset();
//         // Reset custom service dropdown label
//         const dropLabel = form.querySelector('.dropdown-selected');
//         if (dropLabel) dropLabel.textContent = 'Select a service';
//         const serviceHidden = form.querySelector('#service');
//         if (serviceHidden) serviceHidden.value = '';
//       } else {
//         alert('Could not send message: ' + (data.message || 'Please try again.'));
//       }
//     } catch (err) {
//       alert('Something went wrong. Please check your connection and try again.');
//     }

//     submitBtn.disabled = false;
//     submitBtn.innerHTML = originalBtnHTML;
//   });

// })();





// Synchronized hover effect for service bricks - split image effect
    (function() {
      const mediaQuery = window.matchMedia('(max-width: 1024px)');
      let currentHoveredService = null;

      const setStaticBrickImage = (brick, brickBg) => {
        const bgUrl = brick.getAttribute('data-bg');
        if (!bgUrl || !brickBg) return;

        brickBg.style.backgroundImage = `url('${bgUrl}')`;
        brickBg.style.opacity = '1';
        brickBg.style.backgroundSize = 'cover';
        brickBg.style.backgroundRepeat = 'no-repeat';
        brickBg.style.backgroundPosition = 'center';
        brick.style.cursor = 'default';
        brick.classList.remove('peek-effect');
      };

      const applySplitImage = (bg, bgUrl, bgIndex) => {
        if (!bgUrl || !bg) return;
        bg.style.backgroundImage = `url('${bgUrl}')`;
        bg.style.opacity = '1';
        bg.style.backgroundSize = '300% 100%';
        bg.style.backgroundRepeat = 'no-repeat';
        bg.style.imageRendering = 'auto';
        bg.style.imageRendering = '-webkit-optimize-contrast';

        if (bgIndex === 0) {
          bg.style.backgroundPosition = '0% 50%';
        } else if (bgIndex === 1) {
          bg.style.backgroundPosition = '50% 50%';
        } else {
          bg.style.backgroundPosition = '100% 50%';
        }
      };

      const initServiceBrickSync = () => {
        const serviceBricks = Array.from(document.querySelectorAll('.service-brick'));
        const brickBgs = Array.from(document.querySelectorAll('.brick-bg'));

        if (!serviceBricks.length || !brickBgs.length) return;

        // Recreate cards to clear any existing listeners (safe re-init)
        serviceBricks.forEach(brick => {
          const clone = brick.cloneNode(true);
          brick.parentNode.replaceChild(clone, brick);
        });

        const bricks = Array.from(document.querySelectorAll('.service-brick'));
        const bgs = Array.from(document.querySelectorAll('.brick-bg'));

        // Apply static images for all cards first
        bricks.forEach((brick, idx) => {
          setStaticBrickImage(brick, bgs[idx]);
        });

        // If small/tablet screen, do not attach hover sync
        if (mediaQuery.matches) {
          return;
        }

        // Desktop: show first card split image by default
        const firstBgUrl = bricks[0]?.getAttribute('data-bg') || '';
        currentHoveredService = firstBgUrl;

        bgs.forEach((bg, idx) => applySplitImage(bg, firstBgUrl, idx));
        bricks[0]?.classList.add('peek-effect');

        // Attach hover events for sync effect
        bricks.forEach(brick => {
          brick.style.cursor = 'pointer';

          brick.addEventListener('mouseenter', function() {
            const bgUrl = this.getAttribute('data-bg');
            if (!bgUrl || currentHoveredService === bgUrl) return;

            currentHoveredService = bgUrl;
            bgs.forEach((bg, idx) => applySplitImage(bg, bgUrl, idx));
            bricks.forEach(b => b.classList.add('peek-effect'));
          });

          brick.addEventListener('mouseleave', function() {
            this.classList.remove('peek-effect');
          });
        });
      };

      initServiceBrickSync();

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', initServiceBrickSync);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(initServiceBrickSync);
      }
    })();



  // ============================================
  // CASE STUDIES CAROUSEL & TESTIMONIALS SCROLL
  // ============================================
  const initScrollFunctionality = () => {
    // ===== CASE STUDIES CAROUSEL =====
    const carouselTrack = document.getElementById('case-studies-carousel-track');
    const prevBtn = document.getElementById('case-study-prev');
    const nextBtn = document.getElementById('case-study-next');
    const indicatorsContainer = document.getElementById('case-study-indicators');

    if (carouselTrack && prevBtn && nextBtn) {
      const cards = document.querySelectorAll('.case-study-featured');
      let currentIndex = 0;

      // Create indicators
      cards.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
      });

      const updateCarousel = () => {
        const offset = -currentIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;

        // Update indicators
        document.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
          indicator.classList.toggle('active', index === currentIndex);
        });

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === cards.length - 1;
      };

      const goToSlide = (index) => {
        currentIndex = Math.max(0, Math.min(index, cards.length - 1));
        updateCarousel();
      };

      const nextSlide = () => {
        if (currentIndex < cards.length - 1) {
          currentIndex++;
          updateCarousel();
        }
      };

      const prevSlide = () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      };

      prevBtn.addEventListener('click', prevSlide);
      nextBtn.addEventListener('click', nextSlide);

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      });

      updateCarousel();
    }

    // ===== TESTIMONIALS SCROLL =====
    const testimonialsTrack = document.getElementById('testimonials-track');
    const testimonialsScrollLeft = document.getElementById('testimonials-scroll-left');
    const testimonialsScrollRight = document.getElementById('testimonials-scroll-right');

    if (testimonialsTrack && testimonialsScrollLeft && testimonialsScrollRight) {
      const updateTestimonialsButtons = () => {
        const isAtStart = testimonialsTrack.scrollLeft === 0;
        const isAtEnd = testimonialsTrack.scrollLeft + testimonialsTrack.clientWidth >= testimonialsTrack.scrollWidth - 10;
        
        testimonialsScrollLeft.disabled = isAtStart;
        testimonialsScrollRight.disabled = isAtEnd;
      };

      const scrollDistance = 380; // Scroll by one card

      testimonialsScrollLeft.addEventListener('click', () => {
        testimonialsTrack.scrollBy({ left: -scrollDistance, behavior: 'smooth' });
        setTimeout(updateTestimonialsButtons, 100);
      });

      testimonialsScrollRight.addEventListener('click', () => {
        testimonialsTrack.scrollBy({ left: scrollDistance, behavior: 'smooth' });
        setTimeout(updateTestimonialsButtons, 100);
      });

      testimonialsTrack.addEventListener('scroll', updateTestimonialsButtons);
      updateTestimonialsButtons();
      window.addEventListener('resize', updateTestimonialsButtons);
    }
  };

  // Initialize scroll functionality when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollFunctionality);
  } else {
    initScrollFunctionality();
  }

 











(function () {
  'use strict';

  const TOTAL        = 3;
  const SCROLL_PER_CARD = window.innerHeight * 0.8; // px of scroll per card transition

  /* ---- DOM refs ---- */
  const outer     = document.getElementById('csOuter');
  const cards     = Array.from(document.querySelectorAll('.cs-card'));
  const dotsWrap  = document.getElementById('csDots');
  const scrollHint = document.getElementById('csScrollHint');

  /* ---- Build dots ---- */
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('div');
    dot.className = 'indicator-dot' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    dotsWrap.appendChild(dot);
  }

  /* ====================================================
     CARD LAYOUT MATH
     =====================================================
     "topIndex"   = the card currently on top (fully visible)
     "progress"   = 0..1 how far the NEXT card has scrolled in

     Each card can be in one of these states:
       - WAITING  : not yet seen, off screen right (translateX 110%)
       - ENTERING : sliding in from right (progress 0→1)
       - STACKED  : sits in the deck behind the top card, scaled down
       - TOP      : fully landed on top, scale 1, translateY 0
  ==================================================== */

  /* Scale + Y offset for stacked-behind cards */
  function stackedTransform(depthBehindTop) {
    // depthBehindTop: 1 = directly under top, 2 = one further back, etc.
    const scaleStep = 0.045;
    const yStep     = 18; // px upward per level (shows like a deck)
    const maxDepth  = 3;
    const d = Math.min(depthBehindTop, maxDepth);
    return {
      scale:      1 - d * scaleStep,
      translateY: -d * yStep,
      opacity:    1 - d * 0.15,
    };
  }

  let currentTop = -1; // track to avoid redundant dot updates

  function applyCardStates(topIndex, enterProgress) {
    /*
      enterProgress: 0..1
        0  = card (topIndex+1) is off screen right
        1  = card (topIndex+1) has fully landed; topIndex advances
    */
    cards.forEach((card, i) => {

      let tx = 0, ty = 0, scale = 1, opacity = 1;

      if (i > topIndex + 1) {
        /* ---- WAITING: not yet reached ---- */
        tx = 110; ty = 0; scale = 1; opacity = 0;

      } else if (i === topIndex + 1) {
        /* ---- ENTERING: sliding in from right ---- */
        // Ease the incoming card: starts off-right, lands at 0
        const eased = easeOutCubic(enterProgress);
        tx      = 110 * (1 - eased);   // 110% → 0%
        ty      = 0;
        scale   = 0.92 + 0.08 * eased; // slight scale-up as it arrives
        opacity = eased;

      } else if (i === topIndex) {
        /* ---- TOP card: fully landed ----
           As next card comes in, push this one slightly back (scale down a bit) */
        const t = stackedTransform(1);
        // Lerp from (scale=1, ty=0) toward stacked position
        scale   = 1  + (t.scale   - 1)  * enterProgress;
        ty      = t.translateY           * enterProgress;
        tx      = 0;
        opacity = 1;

      } else {
        /* ---- STACKED: previously-seen cards in the deck ---- */
        const depthNow  = topIndex - i;          // current depth behind top
        const depthNext = depthNow + 1;          // depth when next card lands
        const now       = stackedTransform(depthNow);
        const next      = stackedTransform(depthNext);

        // Lerp between current and next stacked position
        scale   = lerp(now.scale,       next.scale,       enterProgress);
        ty      = lerp(now.translateY,  next.translateY,  enterProgress);
        opacity = lerp(now.opacity,     next.opacity,     enterProgress);
        tx      = 0;
      }

      card.style.transform = `translateX(${tx}%) translateY(${ty}px) scale(${scale})`;
      card.style.opacity   = opacity;
      card.style.zIndex    = i + 1; // stacking order: last card on top

      // Mark top card
      card.classList.toggle('is-top', i === topIndex);

      // Hide text on all cards except the active top card
      // When a card is entering (i === topIndex + 1), fade its text in with enterProgress
      // When a card is leaving (i === topIndex and enterProgress > 0), fade its text out
      // Special case: last card should always show text when it's top
      const contentEl = card.querySelector('.case-study-content');
      if (contentEl) {
        if (i === topIndex + 1) {
          // Entering card: text fades in during second half of entry
          const textProgress = Math.max(0, (enterProgress - 0.5) * 2);
          contentEl.style.opacity   = easeOutCubic(textProgress);
          contentEl.style.transform = `translateY(${16 * (1 - textProgress)}px)`;
        } else if (i === topIndex) {
          // Current top: text fades out as next card comes in
          // BUT: if this is the last card (i === TOTAL - 1), keep text visible
          if (i === TOTAL - 1) {
            contentEl.style.opacity   = '1';
            contentEl.style.transform = 'translateY(0px)';
          } else {
            const textFade = Math.max(0, 1 - enterProgress * 2);
            contentEl.style.opacity   = textFade;
            contentEl.style.transform = `translateY(${-10 * (1 - textFade)}px)`;
          }
        } else {
          // All stacked/waiting cards: text fully hidden
          contentEl.style.opacity   = '0';
          contentEl.style.transform = 'translateY(0px)';
        }
      }
    });

    /* Update dots */
    if (topIndex !== currentTop) {
      currentTop = topIndex;
      document.querySelectorAll('.indicator-dot').forEach((d, i) => {
        d.classList.toggle('active', i === topIndex);
      });
    }

    /* Hide scroll hint after first card comes in */
    if (topIndex >= 0 || enterProgress > 0.1) {
      scrollHint.style.opacity = '0';
    }
  }

  /* ---- Scroll handler ---- */
  function onScroll() {
    // Start scroll calculation from when header is visible, not from outer element
    const scrolled = Math.max(0, -outer.getBoundingClientRect().top - 200); // Start 200px earlier

    /*
      Scroll is divided into TOTAL steps of SCROLL_PER_CARD px each.
      Step 0: card 0 enters  (scrolled 0 → SCROLL_PER_CARD)
      Step 1: card 1 enters  (scrolled SCROLL_PER_CARD → 2×SCROLL_PER_CARD)
      etc.
    */

    // How many full cards have entered
    const step     = scrolled / SCROLL_PER_CARD;
    const topIndex = Math.min(Math.floor(step), TOTAL - 1);
    const enterProgress = topIndex < TOTAL - 1
      ? Math.min(step - topIndex, 1)
      : 1; // last card: freeze at fully entered

    applyCardStates(topIndex, enterProgress);
  }

  /* ---- Dot click → jump to card ---- */
  dotsWrap.addEventListener('click', function (e) {
    const dot = e.target.closest('.indicator-dot');
    if (!dot) return;
    const index = parseInt(dot.dataset.index);
    const target = outer.offsetTop + index * SCROLL_PER_CARD;
    window.scrollTo({ top: target, behavior: 'smooth' });
  });

  /* ---- Init ---- */
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    // recalc on resize
    onScroll();
  });

  /* Set initial state: card 0 starts visible, rest off-right */
  applyCardStates(0, 0);
  // Actually start with card 0 fully landed and rest waiting
  cards.forEach((card, i) => {
    const contentEl = card.querySelector('.case-study-content');
    if (i === 0) {
      card.style.transform = 'translateX(0%) translateY(0px) scale(1)';
      card.style.opacity   = '1';
      card.style.zIndex    = 1;
      card.classList.add('is-top');
      if (contentEl) { contentEl.style.opacity = '1'; contentEl.style.transform = 'translateY(0px)'; }
    } else {
      card.style.transform = 'translateX(110%) translateY(0px) scale(1)';
      card.style.opacity   = '0';
      card.style.zIndex    = i + 1;
      if (contentEl) { contentEl.style.opacity = '0'; contentEl.style.transform = 'translateY(16px)'; }
    }
  });

  /* ---- Easing helpers ---- */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  })();

// ============================================
// ONE-TIME ICON SLIDING EFFECT
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  // Get all input and textarea icons
  const inputIcons = document.querySelectorAll('.input-icon');
  const textareaIcons = document.querySelectorAll('.textarea-icon');
  
  // Add not-slid class to all icons initially (start on left)
  inputIcons.forEach(icon => icon.classList.add('not-slid'));
  textareaIcons.forEach(icon => icon.classList.add('not-slid'));
  
  // Function to handle one-time slide for input icons
  function handleInputIconSlide(icon) {
    const input = icon.previousElementSibling; // Get the input element
    let hasSlid = false;
    
    if (input) {
      // Listen for focus events
      input.addEventListener('focus', function() {
        if (!hasSlid) {
          // Remove the not-slid class to move icon to right permanently
          setTimeout(() => {
            icon.classList.remove('not-slid');
            hasSlid = true;
          }, 300); // Wait for the slide animation to complete
        }
      });
    }
  }
  
  // Function to handle one-time slide for textarea icons
  function handleTextareaIconSlide(icon) {
    const textarea = icon.previousElementSibling; // Get the textarea element
    let hasSlid = false;
    
    if (textarea) {
      // Listen for focus events
      textarea.addEventListener('focus', function() {
        if (!hasSlid) {
          // Remove the not-slid class to move icon to right permanently
          setTimeout(() => {
            icon.classList.remove('not-slid');
            hasSlid = true;
          }, 300); // Wait for the slide animation to complete
        }
      });
    }
  }
  
  // Apply to all input icons
  inputIcons.forEach(handleInputIconSlide);
  
  // Apply to all textarea icons
  textareaIcons.forEach(handleTextareaIconSlide);
});


