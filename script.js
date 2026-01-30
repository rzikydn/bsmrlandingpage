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

// Scroll Stack Component Initialization
// Scroll Stack Component Initialization - High Performance Mode (Optimized for iPhone/Safari)
function initScrollStack() {
    const scroller = document.querySelector('.scroll-stack-scroller');
    const inner = document.querySelector('.scroll-stack-inner');
    const cards = Array.from(document.querySelectorAll('.scroll-stack-card'));
    const endElement = document.querySelector('.scroll-stack-end');

    if (!scroller || !inner || cards.length === 0) return;

    const config = {
        itemDistance: 100,
        itemScale: 0.04,
        itemStackDistance: 25,
        stackPosition: '10%',
        baseScale: 0.9,
    };

    const lastTransforms = new Map();
    let cardOffsets = [];
    let endOffset = 0;
    let ticking = false;

    function cacheOffsets() {
        cardOffsets = cards.map(card => {
            const rect = card.getBoundingClientRect();
            return rect.top + window.scrollY;
        });
        if (endElement) {
            const rect = endElement.getBoundingClientRect();
            endOffset = rect.top + window.scrollY;
        }
    }

    function calculateProgress(scrollTop, start, end) {
        if (scrollTop < start) return 0;
        if (scrollTop > end) return 1;
        return (scrollTop - start) / (end - start);
    }

    function updateCardTransforms() {
        if (window.innerWidth > 768) return;

        const scrollTop = window.scrollY;
        const containerHeight = window.innerHeight;
        const stackPositionPx = (parseFloat(config.stackPosition) / 100) * containerHeight;

        cards.forEach((card, i) => {
            const cardTop = cardOffsets[i];
            const triggerStart = cardTop - stackPositionPx - config.itemStackDistance * i;
            const triggerEnd = cardTop - (containerHeight * 0.05);

            const pinEnd = endOffset - containerHeight + (config.itemStackDistance * cards.length);

            // Scale calculation
            const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
            const targetScale = 1 - (config.itemScale * (cards.length - i));
            const scale = 1 - (scaleProgress * (1 - targetScale));

            // Pinning calculation
            let translateY = 0;
            if (scrollTop >= triggerStart && scrollTop <= pinEnd) {
                translateY = scrollTop - cardTop + stackPositionPx + config.itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + config.itemStackDistance * i;
            }

            // Using hardware accelerated properties without any threshold for maximum smoothness
            const transformValue = `translate3d(0, ${Math.round(translateY * 10) / 10}px, 0) scale(${Math.round(scale * 1000) / 1000})`;

            if (lastTransforms.get(i) !== transformValue) {
                card.style.transform = transformValue;
                lastTransforms.set(i, transformValue);
            }
        });

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateCardTransforms);
            ticking = true;
        }
    }

    // Force hardware layers
    cards.forEach((card, i) => {
        card.style.willChange = 'transform';
        card.style.transformOrigin = 'top center';
        card.style.zIndex = i + 1;
        if (i < cards.length - 1) {
            card.style.marginBottom = config.itemDistance + 'px';
        }
        card.style.transform = 'translate3d(0,0,0)';
    });

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', () => { cacheOffsets(); requestTick(); }, { passive: true });

    // Multi-stage offset catching to ensure layout is stable
    cacheOffsets();
    window.addEventListener('load', cacheOffsets);
    setTimeout(cacheOffsets, 500);

    requestTick();
}

// Update DOMContentLoaded to call initScrollStack
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCountUp();

    // Only init Scroll Stack on mobile devices originally intended
    if (window.innerWidth <= 768) {
        initScrollStack();
    }

    // Refresh everything after initial load
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
        if (window.innerWidth <= 768) {
            // Recalculate transforms after all assets load
            window.dispatchEvent(new Event('scroll'));
        }
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
