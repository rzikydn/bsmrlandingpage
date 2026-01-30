// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const menuOverlay = document.getElementById('menu-overlay');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
        if (menuOverlay) menuOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Handle mobile dropdowns
    const dropdowns = document.querySelectorAll('.nav-item.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                e.stopPropagation();
                const parent = dropdown.parentElement;

                // Close other dropdowns
                document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                    if (item !== parent) item.classList.remove('active');
                });

                parent.classList.toggle('active');
            }
        });
    });

    // Close menu when a link (that is not a dropdown toggle) is clicked
    document.querySelectorAll('.nav-links:not(.nav-item.dropdown > a)').forEach(n => n.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }));

    // Close menu when overlay is clicked
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // Also close any open dropdowns
            document.querySelectorAll('.nav-item.dropdown').forEach(item => item.classList.remove('active'));
        });
    }
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
        { selector: '.registration .section-subtitle', options: { baseRotation: 2, blurStrength: 3, start: 'top 95%', end: 'top 60%' } },
        { selector: '.program-info .section-title', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.about .section-tag', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.about .section-title', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.services .section-tag', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.services .section-title', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.services .section-subtitle', options: { baseRotation: 3, blurStrength: 4 } },
        { selector: '.registration .section-tag', options: { baseRotation: 3, blurStrength: 4, start: 'top 95%', end: 'top 60%' } },
        { selector: '.registration .section-title', options: { baseRotation: 3, blurStrength: 4, start: 'top 95%', end: 'top 60%' } },
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

/** 
 * ScrollStack Component (Sticky Hybrid Version)
 * Uses native position: sticky for movement and JS for scaling effects.
 * Much smoother on mobile devices.
 */
class ScrollStack {
    constructor(options = {}) {
        this.options = Object.assign({
            wrapperSelector: '.services-grid',
            cardSelector: '.service-card',
            stackOffset: 20, // vh
            cardSpacing: 30, // px
            scaleSpread: 0.05, // Scale reduction per card
            baseScale: 1
        }, options);

        this.wrapper = document.querySelector(this.options.wrapperSelector);
        this.cards = [];
        this.isActive = false;

        if (this.wrapper) {
            this.cards = Array.from(this.wrapper.querySelectorAll(this.options.cardSelector));
        }

        this.onScroll = this.onScroll.bind(this);
        this.init();
    }

    init() {
        if (!this.wrapper || this.cards.length === 0) return;
        this.checkDevice();
        window.addEventListener('resize', () => this.checkDevice());
    }

    checkDevice() {
        const isMobile = window.innerWidth <= 992;
        if (isMobile && !this.isActive) {
            this.enable();
        } else if (!isMobile && this.isActive) {
            this.disable();
        }
    }

    enable() {
        this.isActive = true;

        // Setup initial sticky positions
        this.cards.forEach((card, i) => {
            // Each card sticks slightly lower than the previous to create the "stack" look
            const topOffset = `calc(${this.options.stackOffset}vh + ${i * this.options.cardSpacing}px)`;
            card.style.top = topOffset;
        });

        window.addEventListener('scroll', this.onScroll, { passive: true });
        this.onScroll(); // Initial calculate
    }

    disable() {
        this.isActive = false;
        window.removeEventListener('scroll', this.onScroll);

        this.cards.forEach(card => {
            card.style.top = '';
            card.style.transform = '';
            card.style.opacity = '';
            card.style.filter = '';
        });
    }

    onScroll() {
        if (!this.isActive) return;

        // Optimization: Use requestAnimationFrame only if needed, 
        // but for scroll-linked effects, raw listener is often fine if logic is cheap.
        // We will use a simple flag to throttle if needed, but here we keep it direct for responsiveness.

        this.cards.forEach((card, i) => {
            // We only scale cards that are effectively "covered" by the next card.
            // Or rather, as a card moves up to its sticky position, it stays at scale 1.
            // As the Next Card (i+1) comes up and covers it, the current card (i) scales down.

            const nextCard = this.cards[i + 1];
            if (!nextCard) return;

            const cardRect = card.getBoundingClientRect();
            const nextRect = nextCard.getBoundingClientRect();

            // Calculate how much the next card has covered the current card
            // We know current card is sticky at 'top'.
            // nextCard comes from bottom.
            // Distance between them:
            const distance = nextRect.top - cardRect.top;

            // Define a range where scaling happens. 
            // e.g., when distance is large (next card far away), scale is 1.
            // when distance is small (next card overlapping), scale reduces.

            const windowHeight = window.innerHeight;
            const triggerDistance = windowHeight * 0.5; // Start scaling when next card is close

            let progress = 1 - (distance / triggerDistance);
            progress = Math.max(0, Math.min(1, progress)); // Clamp 0-1

            // progress 0 = next card far away
            // progress 1 = next card fully on top (or close enough)

            if (progress > 0) {
                const targetScale = this.options.baseScale - (this.options.scaleSpread * (this.cards.length - i));
                // Actually simpler: just scale down a bit.
                // Let's say max scale down is 0.9.
                const scale = 1 - (progress * 0.05); // Scale down by 5% max per overlap

                // blur?
                const blur = progress * 2; // 0 to 2px blur

                card.style.transform = `scale(${scale})`;
                card.style.filter = `blur(${blur}px)`;
                // opacity?
                // card.style.opacity = 1 - (progress * 0.2); 
            } else {
                card.style.transform = 'scale(1)';
                card.style.filter = 'none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.services-grid')) {
        new ScrollStack();
    }
});
