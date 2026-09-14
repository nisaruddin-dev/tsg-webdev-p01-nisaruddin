/* ============================================================
   NISAR UDDIN — PORTFOLIO JAVASCRIPT
   GSAP-Powered Animation Engine
   ============================================================ */

'use strict';

/* ============================================================
   0. MARK JS AS LOADED
   ============================================================ */

document.documentElement.classList.add('js-loaded');


/* ============================================================
   1. NAVIGATION — SCROLL STATE
   ============================================================ */

const navHeader = document.getElementById('nav-header');

function updateNavOnScroll() {
    if (!navHeader) return;
    navHeader.classList.toggle('scrolled', window.scrollY > 50);
}

window.addEventListener('scroll', updateNavOnScroll, { passive: true });
updateNavOnScroll();


/* ============================================================
   2. NAVIGATION — ACTIVE LINK HIGHLIGHTING
   ============================================================ */

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 150;
    let currentSection = 'home';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === currentSection);
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
updateActiveNavLink();


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

    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navLinksContainer.classList.remove('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}


/* ============================================================
   4. SCROLL-TO-TOP BUTTON
   ============================================================ */

const scrollTopBtn = document.getElementById('scroll-top');

function updateScrollTopButton() {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

window.addEventListener('scroll', updateScrollTopButton, { passive: true });

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ============================================================
   5. DARK MODE TOGGLE
   ============================================================ */

const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        htmlElement.setAttribute('data-theme', saved);
    } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        htmlElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
    }
}

function toggleTheme() {
    const current = htmlElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

loadTheme();

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}


/* ============================================================
   6. GSAP SETUP + SCROLLTRIGGER
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
}


/* ============================================================
   7. HERO ENTRY ANIMATION
   ============================================================ */

function animateHero() {
    if (!hasGSAP || prefersReducedMotion) return;

    const heroEls = [
        '.hero-status',
        '.hero-kicker',
        '.hero-name',
        '.hero-tagline',
        '.hero-oneliner',
        '.hero-cta',
        '.hero-links'
    ];

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroEls.forEach((sel, i) => {
        const el = document.querySelector(sel);
        if (!el) return;
        tl.from(el, {
            y: 40,
            opacity: 0,
            duration: 0.8
        }, i * 0.12);
    });

    const heroLogo = document.querySelector('.hero-logo-wrap');
    if (heroLogo) {
        tl.from(heroLogo, {
            scale: 0.7,
            opacity: 0,
            rotate: -12,
            duration: 1.2,
            ease: 'back.out(1.4)'
        }, 0.2);
    }
}

window.addEventListener('load', () => {
    animateHero();

    // Replay hero animation when user scrolls back to top
    if (hasGSAP && !prefersReducedMotion) {
        const heroSection = document.querySelector('#home');
        if (heroSection) {
            ScrollTrigger.create({
                trigger: heroSection,
                start: 'top 30%',
                end: 'bottom top',
                onEnterBack: () => {
                    // Replay hero animation when scrolling back into hero
                                        gsap.fromTo('.hero-status, .hero-kicker, .hero-name, .hero-tagline, .hero-oneliner, .hero-cta, .hero-links',
                        { opacity: 0, y: 40 },
                        { opacity: 1, y: 0, duration: 1.4, stagger: 0.18, ease: 'power3.out', overwrite: true }
                    );
                    gsap.fromTo('.hero-logo-wrap',
                        { opacity: 0, scale: 0.7, rotate: -12 },
                        { opacity: 1, scale: 1, rotate: 0, duration: 1.8, ease: 'back.out(1.4)', overwrite: true }
                    );
                }
            });
        }
    }
});


/* ============================================================
   8. SCROLL-TRIGGERED SECTION ANIMATIONS (GSAP ScrollTrigger)
   ============================================================ */

function initScrollAnimations() {
    if (!hasGSAP || prefersReducedMotion) {
    // Fallback: make everything visible
    document.querySelectorAll(
        '.anim-fade-up, .anim-slide-left, .anim-slide-right, .anim-scale-in'
    ).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    document.querySelectorAll('.skill-bar-fill').forEach(el => {
        el.style.width = el.style.getPropertyValue('--skill-level') || '0%';
    });
    return;
}

    // ---- ABOUT section ----
    const aboutHead = document.querySelector('#about .section-head');
    if (aboutHead) {
        gsap.from(aboutHead.children, {
            scrollTrigger: {
                trigger: aboutHead,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
        });
    }

    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        gsap.from(aboutText, {
            scrollTrigger: {
                trigger: aboutText,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            x: -60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
        });
    }

    const aboutFacts = document.querySelectorAll('.fact-card');
    aboutFacts.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            },
            scale: 0.75,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'back.out(1.5)'
        });
    });

    // ---- SKILLS section ----
    const skillsHead = document.querySelector('#skills .section-head');
    if (skillsHead) {
        gsap.from(skillsHead.children, {
            scrollTrigger: {
                trigger: skillsHead,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
        });
    }

    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 0.7,
            delay: (i % 3) * 0.1,
            ease: 'power3.out'
        });
    });

    // Skill bars — fill animation
    document.querySelectorAll('.skill-bar-fill').forEach(fill => {
        const parentBar = fill.closest('.skill-bar');
        if (!parentBar) return;

        const level = parentBar.dataset.level || 0;
        const percentEl = parentBar.parentElement.querySelector('.skill-percent');

        gsap.fromTo(fill,
            { width: '0%' },
            {
                width: `${level}%`,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: parentBar,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                },
                onUpdate: function() {
                    if (percentEl && this.progress() > 0) {
                        const current = Math.round(this.progress() * level);
                        percentEl.textContent = `${current}%`;
                    }
                },
                onComplete: function() {
                    if (percentEl) percentEl.textContent = `${level}%`;
                },
                onReverseComplete: function() {
                    if (percentEl) percentEl.textContent = '0%';
                }
            }
        );
    });

    // ---- PROJECTS section ----
    const projectsHead = document.querySelector('#projects .section-head');
    if (projectsHead) {
        gsap.from(projectsHead.children, {
            scrollTrigger: {
                trigger: projectsHead,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
        });
    }

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, i) => {
        const fromLeft = i % 2 === 0;
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            x: fromLeft ? -60 : 60,
            y: 30,
            opacity: 0,
            duration: 0.9,
            delay: (i % 3) * 0.12,
            ease: 'power3.out'
        });
    });

    // ---- CONTACT section ----
    const contactHead = document.querySelector('#contact .section-head');
    if (contactHead) {
        gsap.from(contactHead.children, {
            scrollTrigger: {
                trigger: contactHead,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out'
        });
    }

    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.12,
            ease: 'power3.out'
        });
    });

    const responseNote = document.querySelector('.contact-response-note');
    if (responseNote) {
        gsap.from(responseNote, {
            scrollTrigger: {
                trigger: responseNote,
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            },
            x: -50,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out'
        });
    }

    const contactFormEl = document.querySelector('.contact-form');
    if (contactFormEl) {
        gsap.from(contactFormEl, {
            scrollTrigger: {
                trigger: contactForm,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            x: 60,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out'
        });
    }

    // ---- FOOTER ----
    const footerTop = document.querySelector('.footer-top');
    if (footerTop) {
        gsap.from(footerTop, {
            scrollTrigger: {
                trigger: footerTop,
                start: 'top 92%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }

    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
        gsap.from(footerBottom, {
            scrollTrigger: {
                trigger: footerBottom,
                start: 'top 95%',
                toggleActions: 'play none none reverse'
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: 0.15,
            ease: 'power3.out'
        });
    }

    // Refresh ScrollTrigger after everything is set up
    ScrollTrigger.refresh();

    // Hero orb parallax on scroll
const heroOrb1 = document.querySelector('.hero-orb-1');
const heroOrb2 = document.querySelector('.hero-orb-2');

if (heroOrb1 && heroOrb2 && hasGSAP) {
    gsap.to(heroOrb1, {
        scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 150,
        ease: 'none'
    });

    gsap.to(heroOrb2, {
        scrollTrigger: {
            trigger: '#home',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        ease: 'none'
    });
}
}

// Initialize after DOM + libraries are ready
window.addEventListener('load', () => {
    setTimeout(initScrollAnimations, 100);
});


/* ============================================================
   9. CONTACT FORM VALIDATION
   ============================================================ */

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(v) {
    if (!v.trim()) return 'Name is required.';
    if (v.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
}

function validateEmail(v) {
    if (!v.trim()) return 'Email is required.';
    if (!EMAIL_REGEX.test(v.trim())) return 'Please enter a valid email address.';
    return '';
}

function validateMessage(v) {
    if (!v.trim()) return 'Message is required.';
    if (v.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
}

function attachLiveValidation(input, errorEl, validator) {
    if (!input || !errorEl) return;
    const run = () => {
        const error = validator(input.value);
        errorEl.textContent = error;
        input.classList.toggle('invalid', !!error);
        input.classList.toggle('valid', !error && input.value.trim() !== '');
    };
    input.addEventListener('input', run);
    input.addEventListener('blur', run);
}

attachLiveValidation(nameInput, nameError, validateName);
attachLiveValidation(emailInput, emailError, validateEmail);
attachLiveValidation(messageInput, messageError, validateMessage);

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameErr = validateName(nameInput.value);
        const emailErr = validateEmail(emailInput.value);
        const messageErr = validateMessage(messageInput.value);

        nameError.textContent = nameErr;
        emailError.textContent = emailErr;
        messageError.textContent = messageErr;

        nameInput.classList.toggle('invalid', !!nameErr);
        emailInput.classList.toggle('invalid', !!emailErr);
        messageInput.classList.toggle('invalid', !!messageErr);

        if (nameErr || emailErr || messageErr) {
            formStatus.textContent = 'Please fix the errors above.';
            formStatus.className = 'form-status error';
            return;
        }

        submitBtn.disabled = true;
        formStatus.textContent = 'Sending...';
        formStatus.className = 'form-status';

        setTimeout(() => {
            submitBtn.disabled = false;
            formStatus.textContent = 'Message sent! I will reply within 24 hours.';
            formStatus.className = 'form-status success';
            contactForm.reset();
            [nameInput, emailInput, messageInput].forEach(i => i.classList.remove('valid', 'invalid'));
            [nameError, emailError, messageError].forEach(el => el.textContent = '');
        }, 1200);
    });
}


/* ============================================================
   10. CONSOLE WELCOME
   ============================================================ */

console.log(
    '%c👋 Nisar Uddin — Portfolio',
    'background: linear-gradient(135deg, #00E5FF, #A855F7); color: #050810; padding: 6px 16px; border-radius: 6px; font-weight: 700; font-size: 14px;'
);
console.log(
    '%cBuilt from scratch with HTML, CSS, and JavaScript.',
    'color: #94A3B8; font-family: monospace; font-size: 12px;'
);