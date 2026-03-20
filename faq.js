// ============ FAQ PAGE — GSAP ScrollTrigger Animations ============

gsap.registerPlugin(ScrollTrigger);

// ============ NAVBAR ENTRANCE ============
gsap.from('.faq-nav', {
    y: -40, opacity: 0, duration: 0.6, ease: 'power2.out'
});

// ============ HERO ============
gsap.from('.faq-hero-content', {
    y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2
});

// Truck: slide from top → blurred → clear & colorful
const faqTruck = document.querySelector('.faq-hero-img');
const faqTruckTl = gsap.timeline({ delay: 0.2 });
faqTruckTl.to(faqTruck, {
    y: 0, opacity: 0.3, filter: 'blur(6px)', duration: 0.2, ease: 'power2.out'
}).to(faqTruck, {
    opacity: 0.7, filter: 'blur(0px)', duration: 0.25, ease: 'power2.out'
});

// ============ FAQ INTRO ============
gsap.from('.faq-intro', {
    scrollTrigger: { trigger: '.faq-section', start: 'top 85%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'power2.out'
});

// ============ FAQ ITEMS ============
gsap.from('.faq-item', {
    scrollTrigger: { trigger: '.faq-list', start: 'top 85%' },
    y: 40, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.2)'
});

// ============ CTA ============
gsap.from('.faq-cta-title', {
    scrollTrigger: { trigger: '.faq-cta', start: 'top 80%' },
    y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
});

gsap.from('.faq-cta-sub', {
    scrollTrigger: { trigger: '.faq-cta', start: 'top 80%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.15
});

gsap.from('.faq-cta-btn', {
    scrollTrigger: { trigger: '.faq-cta', start: 'top 75%' },
    y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.5)', delay: 0.3
});

// ============ FOOTER ============
gsap.from('.faq-footer > div', {
    scrollTrigger: { trigger: '.faq-footer', start: 'top 90%' },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out'
});

// ============ REFRESH ON LOAD ============
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
