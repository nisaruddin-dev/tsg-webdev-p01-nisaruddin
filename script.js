/* ============================================================
   NISAR UDDIN — PORTFOLIO JAVASCRIPT
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVIGATION — SCROLL STATE
   ============================================================ */

const navHeader = document.getElementById('nav-header');

function updateNavOnScroll() {
    if (!navHeader) return;
    if (window.scrollY > 50) {
        navHeader.classList.add('scrolled');
    } else {
        navHeader.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', updateNavOnScroll, { passive: true });
updateNavOnScroll(); // Run once on load


/* ============================================================
   2. NAVIGATION — ACTIVE LINK HIGHLIGHTING
   ============================================================ */

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 150; // offset for nav height

    let currentSection = 'home';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink(); // Run once on load


/* ============================================================
   3. MOBILE MENU TOGGLE
   ============================================================ */

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navLinksContainer = document.getElementById('nav-links');

if (mobileMenuToggle && navLinksContainer) {
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = navLinksContainer.classList.toggle('open');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a nav link is clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navLinksContainer.classList.remove('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}


/* ============================================================
   4. SCROLL-TO-TOP BUTTON (show/hide on scroll)
   ============================================================ */

const scrollTopBtn = document.getElementById('scroll-top');

function updateScrollTopButton() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', updateScrollTopButton, { passive: true });

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}