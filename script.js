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

/** 
 * ScrollStack Component for Mobile View
 * Adapted from React Bits ScrollStack
 */
class ScrollStack {
    constructor(options = {}) {
        this.options = Object.assign({
            wrapperSelector: '.services-grid',
            cardSelector: '.service-card',
            endSelector: '.scroll-stack-end',
            itemDistance: 100, // Distance to start stacking
            itemScale: 0.05,   // Scale difference per item
            itemStackDistance: 30, // Distance between stacked items in pixels
            stackPosition: '20%', // Where the stack locks (viewport percentage)
            scaleEndPosition: '10%', // Where scaling ends
            baseScale: 0.9,
            scaleDuration: 0.5,
            rotationAmount: 0
        }, options);

        this.wrapper = document.querySelector(this.options.wrapperSelector);
        this.endElement = document.querySelector(this.options.endSelector);
        this.cards = [];
        this.isActive = false;
        this.rafId = null;

        if (this.wrapper) {
            this.cards = Array.from(this.wrapper.querySelectorAll(this.options.cardSelector));
        }

        this.update = this.update.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.init();
    }

    init() {
        if (!this.wrapper || this.cards.length === 0) return;
        this.checkDevice();
        window.addEventListener('resize', () => this.checkDevice());
    }

    checkDevice() {
        const isMobile = window.innerWidth <= 992; // Use matching breakpoint
        if (isMobile && !this.isActive) {
            this.enable();
        } else if (!isMobile && this.isActive) {
            this.disable();
        }
    }

    enable() {
        this.isActive = true;
        window.addEventListener('scroll', this.onScroll, { passive: true });
        this.rafId = requestAnimationFrame(this.update);

        // Initial setup
        this.cards.forEach(card => {
            card.style.willChange = 'transform';
        });
    }

    disable() {
        this.isActive = false;
        window.removeEventListener('scroll', this.onScroll);
        if (this.rafId) cancelAnimationFrame(this.rafId);

        // Reset styles
        this.cards.forEach(card => {
            card.style.transform = '';
            // Don't reset other styles that might be CSS driven
        });
    }

    onScroll() {
        // Trigger update if not already running (though we play continuous loop for smoothness)
    }

    getOffsetTop(element) {
        let offsetTop = 0;
        let el = element;
        while (el) {
            offsetTop += el.offsetTop;
            el = el.offsetParent;
        }
        return offsetTop;
    }

    parsePercentage(value, containerHeight) {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value);
    }

    update() {
        if (!this.isActive) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const containerHeight = window.innerHeight;

        const stackPositionPx = this.parsePercentage(this.options.stackPosition, containerHeight);
        const scaleEndPositionPx = this.parsePercentage(this.options.scaleEndPosition, containerHeight);
        const itemStackDistance = this.options.itemStackDistance;

        // Determine pin end point
        let endElementTop = 0;
        if (this.endElement) {
            // Because endElement might be transformed if inside wrapper? 
            // No, endElement is at the bottom of wrapper.
            // But if wrapper has position relative, offsetTop is relative to document if we traverse.
            endElementTop = this.getOffsetTop(this.endElement);
        } else {
            // Fallback
            const rect = this.wrapper.getBoundingClientRect();
            endElementTop = rect.bottom + scrollTop;
        }

        const pinEnd = endElementTop - containerHeight / 2;

        this.cards.forEach((card, i) => {
            // We need a stable top position.
            // Since cards are in flow (relative), their offsetTop is stable unless parents move or flow changes.
            // We do NOT change `top`, we only change `transform`.
            // `transform` does not affect `offsetTop` relative to parent.
            const cardTop = this.getOffsetTop(card);

            const triggerStart = cardTop - stackPositionPx - (itemStackDistance * i);
            const triggerEnd = cardTop - scaleEndPositionPx;

            // Calculate Scale
            let scaleProgress = 0;
            if (scrollTop < triggerStart) {
                scaleProgress = 0;
            } else if (scrollTop >= triggerStart && scrollTop <= triggerEnd) {
                scaleProgress = (scrollTop - triggerStart) / (triggerEnd - triggerStart);
            } else {
                scaleProgress = 1;
            }

            const targetScale = this.options.baseScale + (i * this.options.itemScale);
            const scale = 1 - scaleProgress * (1 - targetScale);

            // Calculate Translation
            // Sticky behavior: We want visual Y = stackPositionPx + (i * distance) relative to viewport.
            // Visual Y = (cardTop - scrollTop) + translateY
            // Target Visual Y = stackPositionPx + (itemStackDistance * i)
            // translateY = Target Y - (cardTop - scrollTop)
            // translateY = stackPositionPx + (itemStackDistance * i) - cardTop + scrollTop

            // Logic:
            // 1. Before Pin (p < 0): Normal flow (translateY = 0) ?
            //    Wait, triggerStart is when cardTop - scrollTop == stackPosition...
            //    So if scrollTop < triggerStart, card is below the stack position.
            //    We let it scroll naturally? Yes.

            let translateY = 0;
            if (scrollTop >= triggerStart && scrollTop <= pinEnd) {
                translateY = scrollTop - cardTop + stackPositionPx + (itemStackDistance * i);
            } else if (scrollTop > pinEnd) {
                // Stick at bottom
                translateY = pinEnd - cardTop + stackPositionPx + (itemStackDistance * i);
            }

            // Apply
            card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        });

        this.rafId = requestAnimationFrame(this.update);
    }
}

// Initialize ScrollStack
document.addEventListener('DOMContentLoaded', () => {
    // Check if on the page with services
    if (document.querySelector('.services-grid')) {
        new ScrollStack({
            itemStackDistance: 30,
            itemScale: 0.03,
            baseScale: 0.85,
            stackPosition: '20%'
        });
    }
});
