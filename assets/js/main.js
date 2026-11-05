(() => {
  'use strict';

  // 1. Navigation Toggle for Mobile
  const toggle = document.querySelector('#navToggle');
  const nav = document.querySelector('#siteNav');

  if (toggle && nav) {
    const setOpen = (isOpen) => {
      nav.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 681px)').matches) setOpen(false);
    });
  }

  // 2. Footer Year
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  // 3. Live Philippine Time Clock (UTC+8)
  const clockEl = document.querySelector('#liveClock');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      const options = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      clockEl.textContent = `PH / ${new Intl.DateTimeFormat('en-US', options).format(now)}`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // 4. Mouse Spotlight & Tilt Effects
  const spotlight = document.querySelector('#cursorSpotlight');
  let mouseX = 0, mouseY = 0;
  let spotlightX = 0, spotlightY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const renderSpotlight = () => {
    spotlightX += (mouseX - spotlightX) * 0.1;
    spotlightY += (mouseY - spotlightY) * 0.1;
    if (spotlight) {
      spotlight.style.left = `${spotlightX}px`;
      spotlight.style.top = `${spotlightY}px`;
    }
    requestAnimationFrame(renderSpotlight);
  };
  requestAnimationFrame(renderSpotlight);

  // 3D Tilt Cards Effect
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const dx = (x - xc) / 15;
      const dy = (yc - y) / 15;
      card.style.transform = `perspective(1000px) rotateX(${dy}deg) rotateY(${dx}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // 5. Interactive Orbit Canvas Engine in Hero Art
  const canvas = document.querySelector('#orbitCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 25;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.8,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.005 + 0.002,
        distance: Math.random() * 120 + 50
      });
    }

    const animateCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw Orbit Rings
      ctx.strokeStyle = 'rgba(198, 251, 105, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 130, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 180, 0, Math.PI * 2);
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Orbiting Particles
      particles.forEach(p => {
        p.angle += p.speed;
        p.x = centerX + Math.cos(p.angle) * p.distance * 1.4;
        p.y = centerY + Math.sin(p.angle) * p.distance * 0.8;

        ctx.fillStyle = '#c6fb69';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animateCanvas);
    };
    animateCanvas();
  }

  // 6. Project Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-grid .work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 7. Toast Notification Helper
  const toast = document.querySelector('#toast');
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  };

  // 8. Command Palette (Ctrl + K)
  const cmdModal = document.querySelector('#commandModal');
  const cmdInput = document.querySelector('#commandInput');
  const cmdTrigger = document.querySelector('#commandTrigger');
  const cmdList = document.querySelector('#commandList');

  const toggleCommandModal = (open) => {
    if (!cmdModal) return;
    cmdModal.classList.toggle('open', open);
    if (open) {
      setTimeout(() => cmdInput.focus(), 50);
    } else {
      cmdInput.value = '';
    }
  };

  if (cmdTrigger) {
    cmdTrigger.addEventListener('click', () => toggleCommandModal(true));
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleCommandModal(!cmdModal.classList.contains('open'));
    }
    if (e.key === 'Escape') {
      toggleCommandModal(false);
      const projModal = document.querySelector('#projectModal');
      if (projModal) projModal.classList.remove('open');
    }
  });

  if (cmdModal) {
    cmdModal.querySelector('.command-backdrop').addEventListener('click', () => toggleCommandModal(false));
    cmdInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      cmdList.querySelectorAll('li').forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(query) ? 'flex' : 'none';
      });
    });

    cmdList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        const action = li.getAttribute('data-action');
        const target = li.getAttribute('data-target');
        toggleCommandModal(false);

        if (action === 'link' && target) {
          document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'cv') {
          window.location.href = 'assets/resume.pdf';
        } else if (action === 'email') {
          navigator.clipboard.writeText('jeromeedward16@gmail.com');
          showToast('Copied email: jeromeedward16@gmail.com');
        }
      });
    });
  }

  // 9. Project Quick View Modal
  const projectModal = document.querySelector('#projectModal');
  const modalClose = document.querySelector('#modalClose');

  document.querySelectorAll('.open-modal').forEach(item => {
    item.addEventListener('click', () => {
      const title = item.getAttribute('data-title');
      const desc = item.getAttribute('data-desc');
      const role = item.getAttribute('data-role');
      const tags = item.getAttribute('data-tags').split(', ');

      document.querySelector('#modalTitle').textContent = title;
      document.querySelector('#modalDesc').textContent = desc;
      document.querySelector('#modalRole').textContent = `ROLE: ${role}`;
      
      const tagsContainer = document.querySelector('#modalTags');
      tagsContainer.innerHTML = '';
      tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });

      projectModal.classList.add('open');
    });
  });

  if (projectModal) {
    modalClose.addEventListener('click', () => projectModal.classList.remove('open'));
    projectModal.querySelector('.modal-backdrop').addEventListener('click', () => projectModal.classList.remove('open'));
  }

  // 10. Scroll Reveal Animations via Intersection Observer
  const revealItems = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach((item) => item.classList.add('in-view'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  }
})();
