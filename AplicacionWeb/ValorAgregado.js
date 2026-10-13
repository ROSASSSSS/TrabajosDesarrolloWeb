
(() => {
  'use strict';


  const $  = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

 
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch      = window.matchMedia('(hover: none)').matches;

  
  const onFrame = (fn) => {
    let ticking = false;
    return (...args) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
    };
  };

  
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  
  const header       = $('#header');
  const menuToggle   = $('#menuToggle');
  const nav          = $('#nav');
  const progressBar  = $('#scrollProgress');
  const cursorGlow   = $('#cursorGlow');


  
  const setMenu = (open) => {
    if (!menuToggle || !nav) return;
    menuToggle.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      setMenu(!nav.classList.contains('open'));
    });

    
    $$('a', nav).forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

   
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenu(false);
    });

    
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
    });

    
    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) setMenu(false);
    });
  }


  
  const handleScroll = onFrame(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    
    if (header) header.classList.toggle('scrolled', scrollTop > 40);

    
    if (progressBar) {
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  
  if (cursorGlow && !isTouch && !reduceMotion) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    }, { passive: true });

    const animateGlow = () => {
      
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      cursorGlow.style.setProperty('--mx', `${currentX}px`);
      cursorGlow.style.setProperty('--my', `${currentY}px`);

      requestAnimationFrame(animateGlow);
    };
    animateGlow();

    
    document.addEventListener('mouseleave', () => (cursorGlow.style.opacity = '0'));
    document.addEventListener('mouseenter', () => (cursorGlow.style.opacity = '1'));
  }


  
  const revealItems = $$('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach((el) => {
      
      if (el.classList.contains('skill') || el.classList.contains('row')) {
        const group = $$(`.${el.classList.contains('skill') ? 'skill' : 'row'}`);
        const index = group.indexOf(el);
        el.style.transitionDelay = `${(index % 4) * 0.12}s`;
      }
      revealObserver.observe(el);
    });
  } else {
    
    revealItems.forEach((el) => el.classList.add('visible'));
  }


  
  const codeBlock = $('#code');

  if (codeBlock) {
    const codeLines = $$('.l', codeBlock);

    const showLines = () => {
      codeLines.forEach((line, i) => {
        setTimeout(() => line.classList.add('show'), reduceMotion ? 0 : i * 90);
      });
    };

    if ('IntersectionObserver' in window) {
      const codeObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          showLines();
          codeObserver.disconnect();
        }
      }, { threshold: 0.2 });
      codeObserver.observe(codeBlock);
    } else {
      showLines();
    }
  }


  
  const counters = $$('[data-count]');

  const runCounter = (el) => {
    const target   = parseFloat(el.dataset.count) || 0;
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * easeOutExpo(progress));
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach((el) => counterObserver.observe(el));
    } else {
      counters.forEach(runCounter);
    }
  }


  
  const sections = $$('main section[id]');
  const navLinks = $$('.nav a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);
          if (isActive) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));
  }


  
  const heroPhoto = $('.hero-photo');
  const photoFrame = $('.photo-frame');

  
  if (heroPhoto && photoFrame && !isTouch && !reduceMotion) {
    const maxTilt = 8; // grados

    heroPhoto.addEventListener('mouseenter', () => {
      photoFrame.style.transition = 'transform 0.15s ease-out';
    });

    heroPhoto.addEventListener('mousemove', (e) => {
      const rect = photoFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 a 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;

      photoFrame.style.transform =
        `perspective(900px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale(1.02)`;
    });

    heroPhoto.addEventListener('mouseleave', () => {
      photoFrame.style.transition = '';   // vuelve a la transición del CSS
      photoFrame.style.transform = '';
    });
  }

  
  if (heroPhoto && !reduceMotion && window.innerWidth > 960) {
    const parallax = onFrame(() => {
      const offset = Math.min(window.scrollY, 700) * 0.06;
      heroPhoto.style.transform = `translateY(${offset}px)`;
    });
    window.addEventListener('scroll', parallax, { passive: true });
  }


  
  if (!isTouch && !reduceMotion) {
    $$('.btn-primary, .btn-ghost, .btn-outline').forEach((btn) => {
      const strength = 0.25;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top  - rect.height / 2) * strength;
        btn.style.transform = `translate(${x}px, ${y - 3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }


  

  
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  
  const originalTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden
      ? '👋 ¡Vuelve pronto! | ING_ROSAS'
      : originalTitle;
  });

  
  console.log(
    '%c👨‍💻 Hola, soy Juan Sebastian',
    'color:#d9693a;font-size:18px;font-weight:bold;'
  );
  console.log(
    '%cSi estás viendo esto, nos va a gustar trabajar juntos. Escríbeme desde la sección de contacto.',
    'color:#8d8981;font-size:12px;'
  );

})();