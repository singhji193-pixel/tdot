// ============ CONTACT PAGE — GSAP ScrollTrigger Animations ============

gsap.registerPlugin(ScrollTrigger);

// ============ NAVBAR ENTRANCE ============
gsap.from('.contact-nav', {
    y: -40, opacity: 0, duration: 0.6, ease: 'power2.out'
});

// ============ HERO ============
gsap.from('.contact-hero-content', {
    y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2
});

// Truck: slide from top → blurred → clear & subtle
const contactTruck = document.querySelector('.contact-hero-img');
const contactTruckTl = gsap.timeline({ delay: 0.2 });
contactTruckTl.to(contactTruck, {
    y: 0, opacity: 0.1, filter: 'blur(6px)', duration: 0.2, ease: 'power2.out'
}).to(contactTruck, {
    opacity: 0.15, filter: 'blur(0px)', duration: 0.25, ease: 'power2.out'
});

// ============ CONTACT CARDS ============
gsap.from('.contact-card', {
    scrollTrigger: { trigger: '.contact-cards', start: 'top 85%' },
    y: 40, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)'
});

// ============ FORM SECTION ============
gsap.from('.contact-form-left', {
    scrollTrigger: { trigger: '.contact-form-section', start: 'top 80%' },
    x: -40, opacity: 0, duration: 0.6, ease: 'power3.out'
});

gsap.from('.contact-form-right', {
    scrollTrigger: { trigger: '.contact-form-section', start: 'top 80%' },
    x: 40, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.15
});

// ============ EMERGENCY CTA ============
gsap.from('.emergency-badge', {
    scrollTrigger: { trigger: '.contact-emergency', start: 'top 80%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'power2.out'
});

gsap.from('.emergency-title', {
    scrollTrigger: { trigger: '.contact-emergency', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.1
});

gsap.from('.emergency-sub', {
    scrollTrigger: { trigger: '.contact-emergency', start: 'top 80%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.2
});

gsap.from('.emergency-btn', {
    scrollTrigger: { trigger: '.contact-emergency', start: 'top 75%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)', delay: 0.3
});

// ============ FOOTER ============
gsap.from('.contact-footer > div', {
    scrollTrigger: { trigger: '.contact-footer', start: 'top 90%' },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
});

// ============ REFRESH ON LOAD ============
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
