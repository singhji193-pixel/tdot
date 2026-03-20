// ============ ABOUT PAGE — GSAP ScrollTrigger Animations ============

gsap.registerPlugin(ScrollTrigger);

// ============ NAVBAR ENTRANCE ============
gsap.from('.about-nav', {
    y: -40, opacity: 0, duration: 0.6, ease: 'power2.out'
});

// ============ HERO ============
gsap.from('.about-hero-content', {
    scrollTrigger: { trigger: '.about-hero', start: 'top 80%' },
    y: 50, opacity: 0, duration: 0.8, ease: 'power3.out'
});

// Truck: slide from top → blurred → clear & colorful
const aboutTruck = document.querySelector('.about-hero-img');
const aboutTruckTl = gsap.timeline({ delay: 0.2 });
aboutTruckTl.to(aboutTruck, {
    y: 0, opacity: 0.3, filter: 'blur(6px)', duration: 0.2, ease: 'power2.out'
}).to(aboutTruck, {
    opacity: 0.7, filter: 'blur(0px)', duration: 0.25, ease: 'power2.out'
});

// ============ STATS ============
gsap.from('.about-stat-card', {
    scrollTrigger: { trigger: '.about-stats', start: 'top 85%' },
    y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(1.4)'
});

// ============ ABOUT TEXT ============
gsap.from('.about-text-left', {
    scrollTrigger: { trigger: '.about-text-section', start: 'top 80%' },
    x: -50, opacity: 0, duration: 0.7, ease: 'power3.out'
});

gsap.from('.about-text-right .about-paragraph', {
    scrollTrigger: { trigger: '.about-text-section', start: 'top 75%' },
    y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out'
});

// ============ TIMELINE ============
gsap.from('.about-timeline-header', {
    scrollTrigger: { trigger: '.about-timeline-section', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
});

gsap.from('.timeline-item', {
    scrollTrigger: { trigger: '.about-timeline', start: 'top 85%' },
    x: -30, opacity: 0, duration: 0.6, stagger: 0.18, ease: 'power2.out'
});

// ============ MISSION ============
gsap.from('.about-mission-inner', {
    scrollTrigger: { trigger: '.about-mission', start: 'top 80%' },
    scale: 0.9, opacity: 0, duration: 0.8, ease: 'power3.out'
});

// ============ WHY CHOOSE US ============
gsap.from('.about-why .about-section-title', {
    scrollTrigger: { trigger: '.about-why', start: 'top 80%' },
    y: 30, opacity: 0, duration: 0.6, ease: 'power3.out'
});

gsap.from('.why-card', {
    scrollTrigger: { trigger: '.about-why-grid', start: 'top 85%' },
    y: 50, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.2)'
});

// ============ CTA ============
gsap.from('.about-cta-title', {
    scrollTrigger: { trigger: '.about-cta', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
});

gsap.from('.about-cta-btn', {
    scrollTrigger: { trigger: '.about-cta', start: 'top 75%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)', delay: 0.2
});

// ============ FOOTER ============
gsap.from('.about-footer > div', {
    scrollTrigger: { trigger: '.about-footer', start: 'top 90%' },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
});

// ============ REFRESH ON LOAD ============
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
