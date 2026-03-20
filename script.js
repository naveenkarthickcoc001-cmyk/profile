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


/* ════════════════════════════════════════════════════════════════
   11. PROJECT MODAL SYSTEM
   ════════════════════════════════════════════════════════════════ */
const projectModal = document.getElementById('projectModal');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');
const modalIcon = document.getElementById('modalIcon');
const modalClose = document.getElementById('modalClose');

const projectsInfo = {
  calculator: { title: 'Calculator App', icon: '🧮' },
  snake: { title: 'Snake Game', icon: '🐍' },
  todo: { title: 'To-Do List Manager', icon: '📋' },
  results: { title: 'Student Result System', icon: '📊' },
  weather: { title: 'Weather Dashboard', icon: '🌦️' },
};

// Cleanup references for each app
let _snakeInterval = null;
let _snakeKeyHandler = null;

function openProject(name) {
  const info = projectsInfo[name];
  if (!info) return;
  modalTitle.textContent = info.title;
  modalIcon.textContent = info.icon;
  modalBody.innerHTML = '';

  // Cleanup previous snake game
  if (_snakeInterval) { clearInterval(_snakeInterval); _snakeInterval = null; }
  if (_snakeKeyHandler) { document.removeEventListener('keydown', _snakeKeyHandler); _snakeKeyHandler = null; }

  // Build the app
  if (name === 'calculator') buildCalculator();
  else if (name === 'snake') buildSnakeGame();
  else if (name === 'todo') buildTodoApp();
  else if (name === 'results') buildResultSystem();
  else if (name === 'weather') buildWeatherDashboard();

  projectModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  projectModal.classList.remove('open');
  document.body.style.overflow = '';
  if (_snakeInterval) { clearInterval(_snakeInterval); _snakeInterval = null; }
  if (_snakeKeyHandler) { document.removeEventListener('keydown', _snakeKeyHandler); _snakeKeyHandler = null; }
}

modalClose.addEventListener('click', closeModal);
projectModal.addEventListener('click', e => { if (e.target === projectModal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && projectModal.classList.contains('open')) closeModal(); });


/* ════════════════════════════════════════════════════════════════
   12. CALCULATOR APP
   ════════════════════════════════════════════════════════════════ */
function buildCalculator() {
  modalBody.innerHTML = `
    <div class="calc-app">
      <div class="calc-display">
        <div class="calc-expr" id="calcExpr"></div>
        <div class="calc-result" id="calcResult">0</div>
      </div>
      <div class="calc-grid">
        <button class="calc-btn func" data-v="C">C</button>
        <button class="calc-btn func" data-v="±">±</button>
        <button class="calc-btn func" data-v="%">%</button>
        <button class="calc-btn op" data-v="÷">÷</button>
        <button class="calc-btn" data-v="7">7</button>
        <button class="calc-btn" data-v="8">8</button>
        <button class="calc-btn" data-v="9">9</button>
        <button class="calc-btn op" data-v="×">×</button>
        <button class="calc-btn" data-v="4">4</button>
        <button class="calc-btn" data-v="5">5</button>
        <button class="calc-btn" data-v="6">6</button>
        <button class="calc-btn op" data-v="-">−</button>
        <button class="calc-btn" data-v="1">1</button>
        <button class="calc-btn" data-v="2">2</button>
        <button class="calc-btn" data-v="3">3</button>
        <button class="calc-btn op" data-v="+">+</button>
        <button class="calc-btn zero" data-v="0">0</button>
        <button class="calc-btn" data-v=".">.</button>
        <button class="calc-btn del" data-v="⌫">⌫</button>
        <button class="calc-btn eq" data-v="=">=</button>
      </div>
    </div>`;

  const calcExpr = document.getElementById('calcExpr');
  const calcRes = document.getElementById('calcResult');
  let expr = '';
  let justEvaluated = false;

  function updateDisplay() {
    calcExpr.textContent = expr || '';
    // Try to live-evaluate
    if (expr) {
      try {
        const val = safeEval(expr);
        if (val !== null && isFinite(val)) {
          calcRes.textContent = formatNum(val);
        }
      } catch (_) { /* ignore */ }
    }
  }

  function formatNum(n) {
    if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toLocaleString();
    return parseFloat(n.toPrecision(10)).toString();
  }

  function safeEval(expression) {
    let s = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');
    // Validate: only digits, operators, dots, parens, spaces
    if (/[^0-9+\-*/().% ]/.test(s)) return null;
    // Handle percent as /100
    s = s.replace(/(\d+\.?\d*)%/g, '($1/100)');
    try { return Function('"use strict"; return (' + s + ')')(); }
    catch { return null; }
  }

  function handleInput(v) {
    if (v === 'C') {
      expr = '';
      calcRes.textContent = '0';
      calcExpr.textContent = '';
      justEvaluated = false;
      return;
    }
    if (v === '⌫') {
      expr = expr.slice(0, -1);
      if (!expr) calcRes.textContent = '0';
      updateDisplay();
      return;
    }
    if (v === '±') {
      if (expr && !isNaN(expr)) expr = String(-parseFloat(expr));
      updateDisplay();
      return;
    }
    if (v === '=') {
      const val = safeEval(expr);
      if (val !== null && isFinite(val)) {
        calcExpr.textContent = expr + ' =';
        calcRes.textContent = formatNum(val);
        expr = String(val);
        justEvaluated = true;
      } else {
        calcRes.textContent = 'Error';
      }
      return;
    }
    const ops = ['+', '−', '×', '÷', '%'];
    if (justEvaluated) {
      if (ops.includes(v)) {
        justEvaluated = false;
      } else {
        expr = '';
        justEvaluated = false;
      }
    }
    // Prevent double operators
    const lastChar = expr.slice(-1);
    if (ops.includes(v) && ops.includes(lastChar)) {
      expr = expr.slice(0, -1);
    }
    // Prevent starting with an operator (except -)
    if (!expr && ops.includes(v) && v !== '−') return;
    expr += v;
    updateDisplay();
  }

  modalBody.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => handleInput(btn.dataset.v));
  });

  // Keyboard support
  document.addEventListener('keydown', function calcKey(e) {
    if (!projectModal.classList.contains('open')) return;
    const map = {
      'Enter': '=', 'Backspace': '⌫', 'Delete': 'C', 'Escape': 'C',
      '*': '×', '/': '÷', '-': '−'
    };
    let k = map[e.key] || e.key;
    if ('0123456789+-×÷.%=⌫C±−'.includes(k)) {
      e.preventDefault();
      handleInput(k);
    }
  });
}


/* ════════════════════════════════════════════════════════════════
   13. SNAKE GAME
   ════════════════════════════════════════════════════════════════ */
function buildSnakeGame() {
  const SIZE = 20;
  const CANVAS_PX = Math.min(400, window.innerWidth - 60);
  const CELL = Math.floor(CANVAS_PX / SIZE);
  const W = CELL * SIZE;

  modalBody.innerHTML = `
    <div class="snake-app">
      <div class="snake-scores">
        <span>Score: <strong id="snakeScore">0</strong></span>
        <span>High: <strong id="snakeHigh">${localStorage.getItem('snakeHigh') || 0}</strong></span>
      </div>
      <canvas id="snakeCanvas" width="${W}" height="${W}"></canvas>
      <p class="snake-hint">Arrow keys / WASD to move. Tap sides on mobile.</p>
      <button class="btn btn-primary snake-start" id="snakeStart">▶ Start Game</button>
    </div>`;

  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('snakeScore');
  const highEl = document.getElementById('snakeHigh');
  const startBtn = document.getElementById('snakeStart');

  let snake, dir, food, score, speed, running;

  function init() {
    snake = [{ x: 10, y: 10 }];
    dir = { x: 1, y: 0 };
    score = 0;
    speed = 140;
    running = true;
    scoreEl.textContent = '0';
    placeFood();
    startBtn.textContent = '▶ Start Game';
    if (_snakeInterval) clearInterval(_snakeInterval);
    _snakeInterval = setInterval(gameLoop, speed);
  }

  function placeFood() {
    do {
      food = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  }

  function draw() {
    // Background
    ctx.fillStyle = '#0f0a1e';
    ctx.fillRect(0, 0, W, W);
    // Grid lines
    ctx.strokeStyle = 'rgba(124,58,237,0.08)';
    for (let i = 0; i <= SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, W); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(W, i * CELL); ctx.stroke();
    }
    // Food
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Snake
    snake.forEach((s, i) => {
      const grad = ctx.createLinearGradient(s.x * CELL, s.y * CELL, s.x * CELL + CELL, s.y * CELL + CELL);
      grad.addColorStop(0, i === 0 ? '#a855f7' : '#7c3aed');
      grad.addColorStop(1, i === 0 ? '#c084fc' : '#a855f7');
      ctx.fillStyle = grad;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = i === 0 ? 8 : 3;
      const pad = 1;
      ctx.fillRect(s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
    });
    ctx.shadowBlur = 0;
  }

  function gameLoop() {
    if (!running) return;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    // Wall collision
    if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE) return gameOver();
    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      placeFood();
      // Speed up
      if (speed > 60) {
        speed -= 3;
        clearInterval(_snakeInterval);
        _snakeInterval = setInterval(gameLoop, speed);
      }
    } else {
      snake.pop();
    }
    draw();
  }

  function gameOver() {
    running = false;
    clearInterval(_snakeInterval);
    _snakeInterval = null;
    const hi = parseInt(localStorage.getItem('snakeHigh') || '0');
    if (score > hi) {
      localStorage.setItem('snakeHigh', score);
      highEl.textContent = score;
    }
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, W, W);
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', W / 2, W / 2 - 10);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px Outfit, sans-serif';
    ctx.fillText(`Score: ${score}`, W / 2, W / 2 + 20);
    startBtn.textContent = '🔄 Play Again';
  }

  // Initialize starting state so first draw works
  snake = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  food = { x: 15, y: 10 };
  score = 0;
  speed = 140;
  running = false;

  // Draw initial board
  draw();

  startBtn.addEventListener('click', init);

  _snakeKeyHandler = (e) => {
    if (!projectModal.classList.contains('open')) return;
    const keyMap = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
      a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
      W: { x: 0, y: -1 }, S: { x: 0, y: 1 },
      A: { x: -1, y: 0 }, D: { x: 1, y: 0 },
    };
    const nd = keyMap[e.key];
    if (nd && running) {
      // Prevent reverse
      if (nd.x !== -dir.x || nd.y !== -dir.y) {
        dir = nd;
      }
      e.preventDefault();
    }
  };
  document.addEventListener('keydown', _snakeKeyHandler);

  // Touch controls
  let touchStartX = 0, touchStartY = 0;
  canvas.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  canvas.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && dir.x !== -1) dir = { x: 1, y: 0 };
      else if (dx < 0 && dir.x !== 1) dir = { x: -1, y: 0 };
    } else {
      if (dy > 0 && dir.y !== -1) dir = { x: 0, y: 1 };
      else if (dy < 0 && dir.y !== 1) dir = { x: 0, y: -1 };
    }
  }, { passive: true });
}


/* ════════════════════════════════════════════════════════════════
   14. TO-DO LIST MANAGER
   ════════════════════════════════════════════════════════════════ */
function buildTodoApp() {
  modalBody.innerHTML = `
    <div class="todo-app">
      <div class="todo-input-row">
        <input type="text" id="todoInput" placeholder="What needs to be done?" />
        <select id="todoPriority">
          <option value="low">🟢 Low</option>
          <option value="medium" selected>🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <button class="btn btn-primary" id="todoAdd">Add</button>
      </div>
      <div class="todo-filters">
        <button class="todo-filter active" data-f="all">All</button>
        <button class="todo-filter" data-f="active">Active</button>
        <button class="todo-filter" data-f="completed">Completed</button>
      </div>
      <ul class="todo-list" id="todoList"></ul>
      <div class="todo-stats" id="todoStats"></div>
    </div>`;

  const STORAGE_KEY = 'portfolio_todos';
  let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  let filter = 'all';

  const input = document.getElementById('todoInput');
  const priority = document.getElementById('todoPriority');
  const addBtn = document.getElementById('todoAdd');
  const listEl = document.getElementById('todoList');
  const statsEl = document.getElementById('todoStats');

  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }

  function render() {
    const filtered = todos.filter(t => {
      if (filter === 'active') return !t.done;
      if (filter === 'completed') return t.done;
      return true;
    });
    listEl.innerHTML = filtered.map((t, _i) => {
      const idx = todos.indexOf(t);
      const prioEmoji = t.priority === 'high' ? '🔴' : t.priority === 'medium' ? '🟡' : '🟢';
      return `<li class="todo-item ${t.done ? 'done' : ''}" data-idx="${idx}">
        <button class="todo-check" onclick="toggleTodo(${idx})">${t.done ? '☑' : '☐'}</button>
        <span class="todo-text">${escapeHtml(t.text)}</span>
        <span class="todo-prio">${prioEmoji}</span>
        <button class="todo-del" onclick="deleteTodo(${idx})">✕</button>
      </li>`;
    }).join('');
    const active = todos.filter(t => !t.done).length;
    statsEl.textContent = `${active} item${active !== 1 ? 's' : ''} left · ${todos.length} total`;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.toggleTodo = (i) => { todos[i].done = !todos[i].done; save(); render(); };
  window.deleteTodo = (i) => { todos.splice(i, 1); save(); render(); };

  addBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;
    todos.unshift({ text, priority: priority.value, done: false });
    input.value = '';
    save();
    render();
  });

  input.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });

  modalBody.querySelectorAll('.todo-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      modalBody.querySelectorAll('.todo-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filter = btn.dataset.f;
      render();
    });
  });

  render();
}


/* ════════════════════════════════════════════════════════════════
   15. STUDENT RESULT SYSTEM
   ════════════════════════════════════════════════════════════════ */
function buildResultSystem() {
  modalBody.innerHTML = `
    <div class="result-app">
      <div class="result-form">
        <h3>Add Student Record</h3>
        <div class="result-row">
          <input type="text" id="resName" placeholder="Student Name" />
          <input type="text" id="resRoll" placeholder="Roll Number" />
        </div>
        <div class="result-row">
          <input type="text" id="resSub" placeholder="Subject" />
          <input type="number" id="resMarks" placeholder="Marks (0-100)" min="0" max="100" />
        </div>
        <button class="btn btn-primary" id="resAdd">Add Record ✚</button>
      </div>
      <div class="result-search-row">
        <input type="text" id="resSearch" placeholder="🔍 Search by roll number..." />
      </div>
      <div class="result-stats" id="resStats"></div>
      <div class="result-table-wrap">
        <table class="result-table">
          <thead><tr><th>Name</th><th>Roll</th><th>Subject</th><th>Marks</th><th>Grade</th><th></th></tr></thead>
          <tbody id="resBody"></tbody>
        </table>
      </div>
    </div>`;

  const RKEY = 'portfolio_results';
  let records = JSON.parse(localStorage.getItem(RKEY) || '[]');

  const nameIn = document.getElementById('resName');
  const rollIn = document.getElementById('resRoll');
  const subIn = document.getElementById('resSub');
  const marksIn = document.getElementById('resMarks');
  const addBtn = document.getElementById('resAdd');
  const searchIn = document.getElementById('resSearch');
  const tbody = document.getElementById('resBody');
  const statsEl = document.getElementById('resStats');

  function save() { localStorage.setItem(RKEY, JSON.stringify(records)); }

  function grade(m) {
    if (m >= 90) return 'A';
    if (m >= 80) return 'B';
    if (m >= 70) return 'C';
    if (m >= 60) return 'D';
    return 'F';
  }

  function gradeColor(g) {
    return { A: '#4ade80', B: '#22d3ee', C: '#facc15', D: '#fb923c', F: '#f43f5e' }[g] || '#fff';
  }

  function render(query = '') {
    const q = query.toLowerCase();
    const filtered = q ? records.filter(r => r.roll.toLowerCase().includes(q)) : records;
    tbody.innerHTML = filtered.map((r, _i) => {
      const idx = records.indexOf(r);
      const g = grade(r.marks);
      return `<tr>
        <td>${escHtml(r.name)}</td><td>${escHtml(r.roll)}</td><td>${escHtml(r.subject)}</td>
        <td>${r.marks}</td><td style="color:${gradeColor(g)};font-weight:700">${g}</td>
        <td><button class="todo-del" onclick="deleteResult(${idx})">✕</button></td>
      </tr>`;
    }).join('');
    // Stats
    if (records.length) {
      const marks = records.map(r => r.marks);
      const avg = (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(1);
      const hi = Math.max(...marks);
      const lo = Math.min(...marks);
      statsEl.innerHTML = `<span>📊 ${records.length} records</span><span>Avg: <strong>${avg}</strong></span><span>Highest: <strong>${hi}</strong></span><span>Lowest: <strong>${lo}</strong></span>`;
    } else {
      statsEl.innerHTML = '<span>No records yet.</span>';
    }
  }

  function escHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  window.deleteResult = (i) => { records.splice(i, 1); save(); render(searchIn.value); };

  addBtn.addEventListener('click', () => {
    const name = nameIn.value.trim();
    const roll = rollIn.value.trim();
    const subject = subIn.value.trim();
    const marks = parseInt(marksIn.value, 10);
    if (!name || !roll || !subject || isNaN(marks) || marks < 0 || marks > 100) {
      alert('Please fill all fields correctly (marks 0-100).');
      return;
    }
    records.unshift({ name, roll, subject, marks });
    save();
    nameIn.value = ''; rollIn.value = ''; subIn.value = ''; marksIn.value = '';
    render(searchIn.value);
  });

  searchIn.addEventListener('input', () => render(searchIn.value));
  render();
}


/* ════════════════════════════════════════════════════════════════
   16. WEATHER DASHBOARD
   ════════════════════════════════════════════════════════════════ */
function buildWeatherDashboard() {
  modalBody.innerHTML = `
    <div class="weather-app">
      <div class="weather-search">
        <input type="text" id="weatherCity" placeholder="Enter city name..." />
        <button class="btn btn-primary" id="weatherSearch">Search 🔍</button>
      </div>
      <div id="weatherLoading" class="weather-loading" style="display:none;">Loading...</div>
      <div id="weatherError" class="weather-error" style="display:none;"></div>
      <div id="weatherResult" style="display:none;">
        <div class="weather-current" id="weatherCurrent"></div>
        <h3 class="forecast-title">3-Day Forecast</h3>
        <div class="weather-forecast" id="weatherForecast"></div>
      </div>
    </div>`;

  const cityIn = document.getElementById('weatherCity');
  const searchBtn = document.getElementById('weatherSearch');
  const loadingEl = document.getElementById('weatherLoading');
  const errorEl = document.getElementById('weatherError');
  const resultEl = document.getElementById('weatherResult');
  const currentEl = document.getElementById('weatherCurrent');
  const forecastEl = document.getElementById('weatherForecast');

  function wmoToEmoji(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 49) return '🌫️';
    if (code <= 59) return '🌧️';
    if (code <= 69) return '🌨️';
    if (code <= 79) return '🌨️';
    if (code <= 82) return '🌧️';
    if (code <= 86) return '❄️';
    if (code <= 99) return '⛈️';
    return '🌤️';
  }

  function wmoToText(code) {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 49) return 'Foggy';
    if (code <= 59) return 'Drizzle';
    if (code <= 69) return 'Rain';
    if (code <= 79) return 'Snow';
    if (code <= 82) return 'Rain Showers';
    if (code <= 86) return 'Snow Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  }

  async function fetchWeather(city) {
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    resultEl.style.display = 'none';

    try {
      // Geocode
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
      const geoData = await geoRes.json();
      if (!geoData.results || !geoData.results.length) throw new Error('City not found. Try another name.');

      const { latitude, longitude, name: cityName, country } = geoData.results[0];

      // Weather
      const wRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`
      );
      const wData = await wRes.json();
      const c = wData.current;

      currentEl.innerHTML = `
        <div class="weather-emoji">${wmoToEmoji(c.weather_code)}</div>
        <div class="weather-info">
          <h2>${cityName}, ${country}</h2>
          <p class="weather-temp">${Math.round(c.temperature_2m)}°C</p>
          <p class="weather-desc">${wmoToText(c.weather_code)}</p>
        </div>
        <div class="weather-details">
          <span>💧 Humidity: <strong>${c.relative_humidity_2m}%</strong></span>
          <span>💨 Wind: <strong>${c.wind_speed_10m} km/h</strong></span>
        </div>`;

      const days = wData.daily;
      forecastEl.innerHTML = days.time.map((d, i) => `
        <div class="forecast-card">
          <p class="forecast-day">${new Date(d).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <span class="forecast-emoji">${wmoToEmoji(days.weather_code[i])}</span>
          <p class="forecast-temps"><span class="hi">${Math.round(days.temperature_2m_max[i])}°</span> / <span class="lo">${Math.round(days.temperature_2m_min[i])}°</span></p>
          <p class="forecast-desc">${wmoToText(days.weather_code[i])}</p>
        </div>`).join('');

      resultEl.style.display = 'block';
    } catch (err) {
      errorEl.textContent = '⚠️ ' + err.message;
      errorEl.style.display = 'block';
    } finally {
      loadingEl.style.display = 'none';
    }
  }

  searchBtn.addEventListener('click', () => {
    const city = cityIn.value.trim();
    if (city) fetchWeather(city);
  });
  cityIn.addEventListener('keydown', e => { if (e.key === 'Enter') searchBtn.click(); });
}
