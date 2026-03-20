// ════════════════════════════════════════════════════════════════
//  PORTFOLIO WEBSITE — Full JavaScript
// ════════════════════════════════════════════════════════════════

/* ─── 1. NAVBAR ─── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const observerNav = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observerNav.observe(s));


/* ─── 2. TYPING ANIMATION ─── */
const typingEl = document.getElementById('typing');
const words = [
  'CSE Student 💻',
  'Web Developer 🌐',
  'Problem Solver 🧩',
  'Future Engineer 🚀',
  'Tech Enthusiast ⚡',
];
let wIdx = 0, cIdx = 0, deleting = false;

function type() {
  const word = words[wIdx];
  if (!deleting) {
    typingEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typingEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      wIdx = (wIdx + 1) % words.length;
    }
  }
  setTimeout(type, deleting ? 60 : 100);
}
setTimeout(type, 600);


/* ─── 3. PARTICLES ─── */
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT = 30;

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 3 + 2;
  const hue = Math.random() > 0.5 ? '270' : '189'; // purple or cyan
  p.style.cssText = `
    left: ${Math.random() * 100}%;
    top: ${Math.random() * 100}%;
    width: ${size}px;
    height: ${size}px;
    background: hsl(${hue}, 90%, 65%);
    animation-duration: ${Math.random() * 10 + 8}s;
    animation-delay: ${Math.random() * 5}s;
  `;
  particleContainer.appendChild(p);
}

Array.from({ length: PARTICLE_COUNT }, createParticle);


/* ─── 4. COUNTER ANIMATION ─── */
function animateCounters() {
  document.querySelectorAll('.stat-n').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.3 });
heroObserver.observe(document.getElementById('home'));


/* ─── 5. SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll(
  '.skill-category, .project-card, .contact-card, .about-grid, .contact-form, .section-title, .section-tag, .contact-sub'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children in a grid
      setTimeout(() => entry.target.classList.add('visible'), 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// Stagger for grids
function staggerReveal(gridSelector, delay = 100) {
  const items = document.querySelectorAll(gridSelector);
  items.forEach(el => el.classList.add('reveal'));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => obs.observe(el));
}

staggerReveal('.skill-category', 120);
staggerReveal('.project-card', 100);
staggerReveal('.contact-card', 80);


/* ─── 6. SKILL BAR ANIMATION ─── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        const width = bar.dataset.width;
        bar.style.width = width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => barObserver.observe(cat));


/* ─── 7. SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ─── 8. BACK TO TOP ─── */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ─── 9. CONTACT FORM VALIDATION + SUBMISSION ─── */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const formSuccess = document.getElementById('formSuccess');

const fields = {
  name: { input: document.getElementById('name'), error: document.getElementById('nameErr'), validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name (min. 2 characters).' },
  email: { input: document.getElementById('email'), error: document.getElementById('emailErr'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address.' },
  subject: { input: document.getElementById('subject'), error: document.getElementById('subjectErr'), validate: v => v.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.' },
  message: { input: document.getElementById('message'), error: document.getElementById('msgErr'), validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' },
};

// Live validation
Object.values(fields).forEach(({ input, error, validate }) => {
  input.addEventListener('input', () => {
    const msg = validate(input.value);
    error.textContent = msg;
    input.style.borderColor = msg ? '#f87171' : (input.value ? '#4ade80' : '');
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  // Validate all
  Object.values(fields).forEach(({ input, error, validate }) => {
    const msg = validate(input.value);
    error.textContent = msg;
    if (msg) {
      valid = false;
      input.style.borderColor = '#f87171';
    }
  });

  if (!valid) return;

  // ── WhatsApp redirect ──
  // 🔴 REPLACE the number below with your actual WhatsApp number
  //    Format: country code + number, NO spaces, NO + sign
  //    Example India: 919876543210  (91 = India code, then 10-digit number)
  const WHATSAPP_NUMBER = '919087467473'; // ← change this!

  const name = fields.name.input.value.trim();
  const email = fields.email.input.value.trim();
  const subject = fields.subject.input.value.trim();
  const message = fields.message.input.value.trim();

  const waText = encodeURIComponent(
    `👋 Hello Naveen karthick.G!\n\n` +
    `📌 *Name:* ${name}\n` +
    `📧 *Email:* ${email}\n` +
    `📝 *Subject:* ${subject}\n\n` +
    `💬 *Message:*\n${message}`
  );

  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-block';

  await new Promise(r => setTimeout(r, 800)); // Brief loading effect

  // Open WhatsApp in new tab
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, '_blank');

  // Show success
  submitBtn.style.display = 'none';
  formSuccess.style.display = 'block';
  form.reset();
  Object.values(fields).forEach(({ input }) => input.style.borderColor = '');

  // Reset form after 5s
  setTimeout(() => {
    formSuccess.style.display = 'none';
    submitBtn.style.display = 'flex';
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }, 5000);
});


/* ─── 10. PROJECT CARD GLOW FOLLOW MOUSE ─── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.querySelector('.project-glow').style.background =
      `radial-gradient(circle at ${x}% ${y}%, rgba(124,58,237,0.22) 0%, transparent 60%)`;
  });
});

console.log('%c👋 Hey there, fellow dev! 🚀', 'color: #a855f7; font-size: 1.2rem; font-weight: bold;');
console.log('%cBuilt with ❤️ by a 2nd Year CSE Student @ Anna University', 'color: #22d3ee; font-size: 0.9rem;');
