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
function initScrollStack() {
    const scroller = document.querySelector('.scroll-stack-scroller');
    const inner = document.querySelector('.scroll-stack-inner');
    const cards = document.querySelectorAll('.scroll-stack-card');
    const endElement = document.querySelector('.scroll-stack-end');

    if (!scroller || !inner || cards.length === 0) return;

    const config = {
        itemDistance: 100,
        itemScale: 0.03,
        itemStackDistance: 30,
        stackPosition: '15%',
        scaleEndPosition: '5%',
        baseScale: 0.85,
        rotationAmount: 0,
        blurAmount: 0, // DISABLED for mobile performance
    };

    const lastTransforms = new Map();

    function parsePercentage(value, containerHeight) {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value);
    }

    function calculateProgress(scrollTop, start, end) {
        if (scrollTop < start) return 0;
        if (scrollTop > end) return 1;
        return (scrollTop - start) / (end - start);
    }

    function getElementOffset(element) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
    }

    // Cache viewport height to prevent jumps on iOS address bar resize
    let cachedViewportHeight = window.innerHeight;

    // Cache card offsets to avoid layout thrashing
    let cardOffsets = Array.from(cards).map(card => getElementOffset(card));

    function updateCardTransforms() {
        if (window.innerWidth > 768) {
            cards.forEach(card => {
                card.style.transform = '';
                card.style.filter = '';
            });
            return;
        }

        // Clamp scroll top to positive values to avoid bounce glitches
        const scrollTop = Math.max(0, window.scrollY);
        const containerHeight = cachedViewportHeight;
        const stackPositionPx = parsePercentage(config.stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(config.scaleEndPosition, containerHeight);
        const endElementTop = endElement ? getElementOffset(endElement) : 0;

        cards.forEach((card, i) => {
            const cardTop = cardOffsets[i];

            const triggerStart = cardTop - stackPositionPx - config.itemStackDistance * i;
            const triggerEnd = cardTop - scaleEndPositionPx;
            const pinStart = cardTop - stackPositionPx - config.itemStackDistance * i;
            const pinEnd = endElementTop - containerHeight / 2;

            const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
            const targetScale = config.baseScale + i * config.itemScale;
            const scale = 1 - scaleProgress * (1 - targetScale);

            let translateY = 0;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + config.itemStackDistance * i;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + config.itemStackDistance * i;
            }

            // Simplified precision for better mobile performance
            const newTransform = {
                translateY: Math.round(translateY),
                scale: Math.round(scale * 100) / 100
            };

            const lastTransform = lastTransforms.get(i);
            // Increased threshold to reduce update frequency
            const hasChanged = !lastTransform ||
                Math.abs(lastTransform.translateY - newTransform.translateY) > 0.5 ||
                Math.abs(lastTransform.scale - newTransform.scale) > 0.01;

            if (hasChanged) {
                const transformValue = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})`;

                card.style.transform = transformValue;
                card.style.filter = 'none'; // No blur for performance
                lastTransforms.set(i, newTransform);
            }
        });
    }

    // Recalculate offsets and viewport only on actual resize (debounced/throttled)
    window.addEventListener('resize', () => {
        // Only update viewport if it changes significantly (more than address bar size)
        if (Math.abs(window.innerHeight - cachedViewportHeight) > 100) {
            cachedViewportHeight = window.innerHeight;
        }

        cardOffsets = Array.from(cards).map(card => {
            const oldTransform = card.style.transform;
            card.style.transform = '';
            const offset = getElementOffset(card);
            card.style.transform = oldTransform;
            return offset;
        });
        updateCardTransforms();
    });

    // Set initial card styles
    cards.forEach((card, i) => {
        card.style.transformOrigin = 'top center';
        if (i < cards.length - 1) {
            card.style.marginBottom = config.itemDistance + 'px';
        }
    });

    // Listen to scroll with requestAnimationFrame for performance
    let ticking = false;
    function requestUpdate() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateCardTransforms();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    // Initial call
    updateCardTransforms();
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
