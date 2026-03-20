// ============ SERVICES PAGE — GSAP ScrollTrigger Animations ============

gsap.registerPlugin(ScrollTrigger);

// ============ NAVBAR ENTRANCE ============
gsap.from('.services-nav', {
    y: -40, opacity: 0, duration: 0.6, ease: 'power2.out'
});

// ============ HERO ============
gsap.from('.services-hero-content', {
    y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2
});

// Truck: slide from top → blurred → clear & colorful
const servicesTruck = document.querySelector('.services-hero-img');
const servicesTruckTl = gsap.timeline({ delay: 0.2 });
servicesTruckTl.to(servicesTruck, {
    y: 0, opacity: 0.3, filter: 'blur(6px)', duration: 0.2, ease: 'power2.out'
}).to(servicesTruck, {
    opacity: 0.7, filter: 'blur(0px)', duration: 0.25, ease: 'power2.out'
});

// ============ GRID INTRO ============
gsap.from('.services-grid-intro', {
    scrollTrigger: { trigger: '.services-grid-section', start: 'top 85%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'power2.out'
});

// ============ SERVICE CARDS ============
document.querySelectorAll('.service-card').forEach((card) => {
    gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 85%' },
        y: 60, opacity: 0, duration: 0.7, ease: 'back.out(1.2)'
    });

    // Light-up effect on scroll into view (works on mobile without tap)
    ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => card.classList.add('in-view'),
        onLeave: () => card.classList.remove('in-view'),
        onEnterBack: () => card.classList.add('in-view'),
        onLeaveBack: () => card.classList.remove('in-view')
    });
});

// ============ CTA ============
gsap.from('.services-cta-title', {
    scrollTrigger: { trigger: '.services-cta', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
});

gsap.from('.services-cta-sub', {
    scrollTrigger: { trigger: '.services-cta', start: 'top 80%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.15
});

gsap.from('.services-cta-btn', {
    scrollTrigger: { trigger: '.services-cta', start: 'top 75%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)', delay: 0.3
});

// ============ FOOTER ============
gsap.from('.services-footer > div', {
    scrollTrigger: { trigger: '.services-footer', start: 'top 90%' },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
});

// ============ REFRESH ON LOAD ============
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
