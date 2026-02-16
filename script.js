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

// Force scroll to top on refresh/load
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

const scrollToTop = () => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

// Immediate reset
scrollToTop();

// Reset on beforeunload
window.addEventListener('beforeunload', () => {
    scrollToTop();
});

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Priority 1: Welcome Popup initialization
    try {
        initWelcomePopup();
    } catch (e) {
        console.error("Popup Error:", e);
    }

    scrollToTop();
    initScrollReveal();
    initCountUp();
    initScheduleFilter();

    // Refresh everything after initial load
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
        scrollToTop();
        setTimeout(scrollToTop, 10);
        setTimeout(scrollToTop, 100);
    });
});

function initWelcomePopup() {
    const welcomeModal = document.getElementById('welcome-modal');
    const closeBtn = document.getElementById('close-modal-btn');

    if (welcomeModal) {
        // Show every time on refresh - removed localStorage check
        setTimeout(() => {
            welcomeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 1500);

        const closeModal = () => {
            welcomeModal.classList.remove('active');
            document.body.style.overflow = '';
            // localStorage save removed to allow showing on next refresh
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        // Close on overlay click
        welcomeModal.addEventListener('click', (e) => {
            if (e.target === welcomeModal) closeModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && welcomeModal.classList.contains('active')) {
                closeModal();
            }
        });
    }
}

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
        { selector: '.about-description > p:first-of-type', options: { baseRotation: 2, blurStrength: 3, start: 'top 95%', end: 'top 40%' } },
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
            stackPosition: 0.12, // 12% from top (matches CSS top: 12vh)
            itemScale: 0.05,     // Scale reduction per card
            itemStackDistance: 30, // px between stacked cards
            baseScale: 0.9       // Minimum scale for bottom cards
        }, options);

        this.wrapper = document.querySelector(this.options.wrapperSelector);
        this.cards = [];
        this.isActive = false;
        this.lastTransforms = new Map();

        if (this.wrapper) {
            this.cards = Array.from(this.wrapper.querySelectorAll(this.options.cardSelector));
        }

        this.update = this.update.bind(this);
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
        this.cards.forEach((card, i) => {
            card.style.willChange = 'transform, filter';
            card.style.transformOrigin = 'top center';

            // Increment top offset for each card to create the stack look
            const topOffset = (window.innerHeight * this.options.stackPosition) + (i * this.options.itemStackDistance);
            card.style.top = `${topOffset}px`;
        });

        // Use the global Lenis for updates if available
        if (typeof lenis !== 'undefined') {
            lenis.on('scroll', this.update);
        } else {
            window.addEventListener('scroll', this.update);
        }

        this.update();
    }

    disable() {
        this.isActive = false;
        if (typeof lenis !== 'undefined') {
            lenis.off('scroll', this.update);
        } else {
            window.removeEventListener('scroll', this.update);
        }

        this.cards.forEach(card => {
            card.style.transform = '';
            card.style.filter = '';
            card.style.top = '';
        });
        this.lastTransforms.clear();
    }

    update() {
        if (!this.isActive) return;

        const scrollTop = window.scrollY;
        const containerHeight = window.innerHeight;
        const stackPositionPx = containerHeight * this.options.stackPosition;

        this.cards.forEach((card, i) => {
            const cardRect = card.getBoundingClientRect();
            // We use the card's position relative to the viewport to calculate overlap
            // Specifically, when a card's top reaches its sticky position

            const cardTop = card.offsetTop;
            const triggerStart = cardTop - stackPositionPx - (this.options.itemStackDistance * i);

            // Progress is how much the card has been "scrolled past" its sticky trigger
            // But for a stack, we want to know how many cards are ABOVE it.
            // Actually, the simpler "Hybrid" logic is more robust for vanilla JS:
            // Scale the card based on how much the NEXT card has covered it.

            const nextCard = this.cards[i + 1];
            if (!nextCard) return;

            const nextRect = nextCard.getBoundingClientRect();
            const currentRect = card.getBoundingClientRect();

            // Distance between the top of this card and the top of the next card
            const distance = nextRect.top - currentRect.top;
            const triggerDistance = 400; // Distance at which scaling starts

            let progress = 1 - (distance / triggerDistance);
            progress = Math.max(0, Math.min(1, progress));

            if (progress > 0) {
                const scale = 1 - (progress * 0.05); // Scale down by 5%
                const blur = progress * 2; // Subtle blur

                const transform = `scale(${scale})`;
                const filter = `blur(${blur}px)`;

                if (this.lastTransforms.get(i) !== transform) {
                    card.style.transform = transform;
                    card.style.filter = filter;
                    card.style.opacity = 1 - (progress * 0.1); // Slight fade
                    this.lastTransforms.set(i, transform);
                }
            } else {
                if (this.lastTransforms.get(i) !== 'scale(1)') {
                    card.style.transform = 'scale(1)';
                    card.style.filter = 'none';
                    card.style.opacity = '1';
                    this.lastTransforms.set(i, 'scale(1)');
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.services-grid')) {
        new ScrollStack();
    }
});

/**
 * Fast Track Toggle Function
 * Handles the switch between Regular and Fast Track modes on service cards.
 */
function toggleFastTrack(element) {
    // Prevent the click from bubbling if it's inside a clickable card area
    if (event) event.stopPropagation();

    element.classList.toggle('active');
    const card = element.closest('.service-card');

    if (card) {
        card.classList.toggle('fast-track-mode');

        // Update Knob Text
        const knob = element.querySelector('.ft-knob');
        if (knob) {
            if (element.classList.contains('active')) {
                knob.textContent = 'FAST TRACK';
            } else {
                knob.textContent = 'REGULAR';
            }
        }
    }
}

/**
 * Schedule Filtering Function
 * Filters table rows based on the selected month.
 */
function initScheduleFilter() {
    const monthFilter = document.getElementById('monthFilter');
    const scheduleRows = document.querySelectorAll('.schedule-table tbody tr');

    if (monthFilter && scheduleRows.length > 0) {
        monthFilter.addEventListener('change', function () {
            const selectedMonth = this.value;

            scheduleRows.forEach(row => {
                const rowMonth = row.getAttribute('data-month');

                if (selectedMonth === "" || rowMonth === selectedMonth) {
                    row.style.display = "";
                    // Optional: Add a small fade-in effect
                    row.style.opacity = "0";
                    setTimeout(() => {
                        row.style.transition = "opacity 0.3s ease";
                        row.style.opacity = "1";
                    }, 50);
                } else {
                    row.style.display = "none";
                }
            });
        });
    }
}
