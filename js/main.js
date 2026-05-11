// ── DARK MODE ──
(function () {
    const dark = localStorage.getItem('zomato-dark') === '1';
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
})();

function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const btn = document.getElementById('darkToggle');
    if (btn) btn.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

document.addEventListener('DOMContentLoaded', () => {
    let dark = localStorage.getItem('zomato-dark') === '1';
    applyTheme(dark);

    const darkToggle = document.getElementById('darkToggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            dark = !dark;
            localStorage.setItem('zomato-dark', dark ? '1' : '0');
            applyTheme(dark);
        });
    }

    // ── NAVBAR SCROLL ──
    const navbar = document.getElementById('navbar');
    if (navbar && !navbar.classList.contains('solid')) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 80);
        });
    }

    // ── MOBILE NAV ──
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', closeMobileNav);

    // ── FADE IN OBSERVER ──
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

    // ── NAV ACTIVE LINK ──
    const sections = [...document.querySelectorAll('section[id]')];
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    window.addEventListener('scroll', () => {
        let cur = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    });
});

// ── MOBILE NAV ──
function openMobileNav() {
    document.getElementById('mobileNav')?.classList.add('open');
    document.getElementById('overlay')?.classList.add('open');
}
function closeMobileNav() {
    document.getElementById('mobileNav')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('open');
}

// ── TOAST ──
function showToast(msg, duration = 2800) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
}

// ── COUNTER ──
function animCounter(id, target, suffix = '') {
    const el = document.getElementById(id);
    if (!el) return;
    let cur = 0;
    const step = target / 60;
    const timer = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = Math.floor(cur).toLocaleString() + suffix;
    }, 18);
}
