// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links').forEach(n => n.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Check if device is mobile/touch
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Initialize Lenis for Smooth Scrolling (Only for Desktop)
let lenis;
if (!isTouchDevice) {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        if (lenis) lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offset = 80; // Fixed header offset
            if (lenis && !isTouchDevice) {
                lenis.scrollTo(targetId, { offset: -offset });
            } else {
                // Native smooth scroll for mobile
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        }
    }
});

// Read More Toggle (About)
const readMoreBtn = document.getElementById('readMoreBtn');
const aboutDescription = document.querySelector('.about-description');

if (readMoreBtn && aboutDescription) {
    readMoreBtn.addEventListener('click', () => {
        aboutDescription.classList.toggle('expanded');
        readMoreBtn.classList.toggle('active');

        const icon = readMoreBtn.querySelector('i');
        if (aboutDescription.classList.contains('expanded')) {
            readMoreBtn.childNodes[0].textContent = 'Tutup ';
            icon.className = 'fas fa-chevron-up';
        } else {
            readMoreBtn.childNodes[0].textContent = 'Baca Selengkapnya ';
            icon.className = 'fas fa-chevron-down';
        }

        // CRITICAL: Refresh ScrollTrigger because page height changed
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    });
}

// Program Info Read More Toggle
const readMoreProgramBtn = document.getElementById('readMoreProgramBtn');
const programHiddenText = document.querySelector('.program-hidden-text');

if (readMoreProgramBtn && programHiddenText) {
    readMoreProgramBtn.addEventListener('click', () => {
        programHiddenText.classList.toggle('expanded');
        readMoreProgramBtn.classList.toggle('active');

        const icon = readMoreProgramBtn.querySelector('i');
        if (programHiddenText.classList.contains('expanded')) {
            readMoreProgramBtn.childNodes[0].textContent = 'Tutup ';
            icon.className = 'fas fa-chevron-up';
        } else {
            readMoreProgramBtn.childNodes[0].textContent = 'Baca Selengkapnya ';
            icon.className = 'fas fa-chevron-down';
        }

        // CRITICAL: Refresh ScrollTrigger because page height changed
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    });
}

// GSAP Configuration
gsap.registerPlugin(ScrollTrigger);

// Update ScrollTrigger on Lenis scroll
if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCountUp();

    // Refresh everything after initial load
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});

function initCountUp() {
    const counts = document.querySelectorAll('.count-up');
    counts.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 95%',
            onEnter: () => {
                gsap.fromTo(counter,
                    { innerText: 0 },
                    {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: 1 },
                        ease: 'power2.out'
                    }
                );
            }
        });
    });
}

function initScrollReveal() {
    const targets = [
        { selector: '.program-info .info-content > p:first-of-type', options: { baseRotation: 2, blurStrength: 3 } },
        { selector: '.program-info .desktop-only-text', options: { baseRotation: 2, blurStrength: 3 } },
        { selector: '.about-description > p:first-of-type', options: { baseRotation: 2, blurStrength: 3 } },
        { selector: '.registration .section-subtitle', options: { baseRotation: 2, blurStrength: 3 } },
        { selector: '.program-info .section-title', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.about .section-tag', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.about .section-title', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.services .section-tag', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.services .section-title', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.services .section-subtitle', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.registration .section-tag', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.registration .section-title', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.stats-reveal-text', options: { baseRotation: 3, blurStrength: 4 } },
        {
            selector: '.cta-title',
            options: {
                baseRotation: 2,
                blurStrength: 4,
                start: 'top 100%',
                end: 'top 40%'
            }
        }
    ];

    targets.forEach(target => {
        const elements = document.querySelectorAll(target.selector);
        elements.forEach(el => {
            if (!el || el.classList.contains('scroll-reveal-initialized')) return;

            el.classList.add('scroll-reveal-initialized');
            const options = target.options || {};
            const baseOpacity = options.baseOpacity !== undefined ? options.baseOpacity : 0;
            const baseRotation = options.baseRotation !== undefined ? options.baseRotation : 3;
            const blurStrength = options.blurStrength !== undefined ? options.blurStrength : 4;
            const enableBlur = options.enableBlur !== undefined ? options.enableBlur : true;

            const originalText = el.textContent.trim();
            el.classList.add('scroll-reveal');
            el.innerHTML = `<span class="scroll-reveal-text"></span>`;
            const textSpan = el.querySelector('.scroll-reveal-text');

            const words = originalText.split(/(\s+)/).map(word => {
                if (word.match(/^\s+$/)) return document.createTextNode(word);
                const span = document.createElement('span');
                span.className = 'word';
                span.style.opacity = baseOpacity;
                if (enableBlur) span.style.filter = `blur(${blurStrength}px)`;
                span.textContent = word;
                return span;
            });

            words.forEach(node => textSpan.appendChild(node));
            const wordElements = el.querySelectorAll('.word');

            gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: options.start || 'top 90%',
                    end: options.end || 'top 30%',
                    scrub: true,
                }
            })
                .fromTo(el, { transformOrigin: '0% 50%', rotate: baseRotation }, { rotate: 0, ease: 'none' }, 0)
                .fromTo(wordElements,
                    { opacity: baseOpacity, filter: enableBlur ? `blur(${blurStrength}px)` : 'none' },
                    { opacity: 1, filter: 'blur(0px)', stagger: 0.1, ease: 'none' }, 0
                );
        });
    });
}
