// ============ GSAP + OBSERVER — DISCRETE SCROLL TRANSITIONS ============

gsap.registerPlugin(Observer);
gsap.defaults({ ease: 'power3.out', overwrite: 'auto' });

// ============ STATE CONFIG ============
const STATES = [
    { id: 'splashState', type: 'splash' },
    { id: 'heroState',   type: 'hero', truck: 0, bg: '#0d0d0d', title: "We don't just tow,<br>we rescue!", sub: 'Unparalleled Speed, Unrivaled Service' },
    { id: 'heroState',   type: 'hero', truck: 1, bg: 'linear-gradient(135deg,#2a0000,#6b1010,#4a0000)', title: 'Driven by Speed.<br>Defined by Service.', sub: 'Excellence in Every Mile' },
    { id: 'heroState',   type: 'hero', truck: 2, bg: 'linear-gradient(135deg,#a04000,#d96a00,#c05500)', title: 'Flatbed Towing<br>Specialists', sub: 'Safe transport for luxury & exotic vehicles' },
    { id: 'heroState',   type: 'hero', truck: 3, bg: 'linear-gradient(135deg,#904050,#c06070,#b04060)', title: 'Accident Recovery<br>& Roadside Help', sub: '24/7 Emergency Response Across the GTA' },
    { id: 'heroState',   type: 'hero', truck: 4, bg: 'linear-gradient(135deg,#0d0d0d,#1a1a2a,#0d0d0d)', title: 'Heavy-Duty<br>Commercial Towing', sub: 'RVs, buses & construction equipment' }
];

let currentIndex = 0;
let transitioning = false;
let prevTruckIndex = -1;

// ============ DOM REFS ============
const allStates    = document.querySelectorAll('.state');
const heroState    = document.getElementById('heroState');
const splashState  = document.getElementById('splashState');
const trucks       = document.querySelectorAll('.truck');
const slideNum     = document.querySelector('.slide-num');
const heroTitle    = document.querySelector('.hero-title');
const heroSubtitle = document.querySelector('.hero-subtitle');
const heroDesc     = document.querySelector('.hero-desc');
const buyBtn       = document.querySelector('.hero-controls .buy-btn');
const navbar       = document.querySelector('.navbar');
const heroStats    = document.querySelectorAll('.hero-stat');
const orbit        = document.querySelector('.orbit');
const splashFill   = document.getElementById('splashFill');

// ============ INITIAL SETUP ============
gsap.set(trucks, { xPercent: 40, yPercent: -50, scale: 0.5, opacity: 0, top: '50%', left: '50%' });
gsap.set([heroTitle, heroSubtitle], { y: 40, opacity: 0 });
gsap.set([heroDesc, buyBtn], { y: 20, opacity: 0 });
gsap.set(navbar, { y: -30, opacity: 0 });
gsap.set(heroStats, { scale: 0, opacity: 0 });
gsap.set(orbit, { opacity: 0, scale: 0.8 });

// ============ SPLASH — LIQUID FILL + AUTO TRANSITION ============
const splashTl = gsap.timeline({ delay: 0.3 });

// Liquid fill from left to right
splashTl.to(splashFill, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.6,
    ease: 'power2.inOut'
});

// Hold, then auto-transition to hero
splashTl.call(() => {
    goTo(1);
}, null, '+=0.4');

// ============ TRANSITION HELPERS ============
function showState(stateEl) {
    gsap.to(stateEl, {
        opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out',
        onStart: () => { stateEl.style.pointerEvents = 'auto'; }
    });
}

function hideState(stateEl) {
    gsap.to(stateEl, {
        opacity: 0, scale: 0.97, duration: 0.5, ease: 'power2.in',
        onComplete: () => { stateEl.style.pointerEvents = 'none'; }
    });
}

// ============ HERO ENTRANCE TIMELINE ============
function heroEntrance() {
    const tl = gsap.timeline();
    tl.to(navbar, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to(heroTitle, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.2)' }, '-=0.3')
      .to(heroSubtitle, { y: 0, opacity: 0.55, duration: 0.5 }, '-=0.4')
      .to(heroStats, { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' }, '-=0.3')
      .to(orbit, { opacity: 1, scale: 1, duration: 0.6 }, '-=0.4')
      .to([heroDesc, buyBtn], { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, '-=0.3');
    return tl;
}

// ============ TRUCK TRANSITION ============
function truckTransition(newIndex, oldIndex) {
    const tl = gsap.timeline();
    const newTruck = trucks[newIndex];

    if (oldIndex >= 0 && oldIndex !== newIndex) {
        const oldTruck = trucks[oldIndex];
        tl.to(oldTruck, {
            xPercent: -65, yPercent: -50, scale: 0.4, opacity: 0,
            duration: 0.55, ease: 'power3.in'
        }, 0);
    }

    tl.fromTo(newTruck,
        { xPercent: 40, yPercent: -50, scale: 0.5, opacity: 0 },
        { xPercent: -50, yPercent: -50, scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.4)' },
        oldIndex >= 0 ? 0.1 : 0
    );

    return tl;
}

// ============ BACKGROUND MORPH ============
function morphBackground(bg) {
    gsap.to(heroState, { background: bg, duration: 0.8, ease: 'power2.inOut' });
}

// ============ SLIDE NUMBER COUNTER ============
function animateSlideNum(num) {
    gsap.to(slideNum, {
        opacity: 0, y: -10, duration: 0.15,
        onComplete: () => {
            slideNum.textContent = String(num).padStart(2, '0');
            gsap.to(slideNum, { opacity: 1, y: 0, duration: 0.2 });
        }
    });
}

// ============ GO TO STATE ============
let heroEntered = false;
const COOLDOWN = 400; // ms buffer after animation to absorb trackpad momentum

function unlock() {
    // Delay unlock so trackpad momentum doesn't trigger the next state
    setTimeout(() => { transitioning = false; }, COOLDOWN);
}

function goTo(index) {
    // Never go back to splash once hero is entered
    if (heroEntered && index < 1) return;
    if (index < 0 || index >= STATES.length) return;
    if (transitioning) return;

    transitioning = true;
    const prevIndex = currentIndex;
    currentIndex = index;
    const s = STATES[currentIndex];
    const prevState = STATES[prevIndex];

    // Hide previous state if different section
    if (prevState.id !== s.id) {
        hideState(document.getElementById(prevState.id));
    }

    // Show target state
    const targetEl = document.getElementById(s.id);
    if (prevState.id !== s.id) {
        showState(targetEl);
    }

    // Type-specific animations
    if (s.type === 'hero') {
        morphBackground(s.bg);

        // Swap title/subtitle text with fade
        if (heroEntered && (s.title || s.sub !== undefined)) {
            gsap.to(heroTitle, {
                opacity: 0, y: -10, duration: 0.2,
                onComplete: () => {
                    heroTitle.innerHTML = s.title;
                    gsap.to(heroTitle, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
                }
            });
            gsap.to(heroSubtitle, {
                opacity: 0, duration: 0.15,
                onComplete: () => {
                    heroSubtitle.textContent = s.sub;
                    gsap.to(heroSubtitle, { opacity: s.sub ? 0.55 : 0, duration: 0.25 });
                }
            });
        }

        if (!heroEntered) {
            heroEntered = true;
            heroTitle.innerHTML = s.title;
            heroSubtitle.textContent = s.sub;
            const masterTl = gsap.timeline({
                onComplete: unlock
            });
            masterTl.add(heroEntrance())
                    .add(truckTransition(s.truck, -1), '-=0.6');
        } else {
            const tl = truckTransition(s.truck, prevTruckIndex);
            tl.eventCallback('onComplete', unlock);
        }

        prevTruckIndex = s.truck;
        animateSlideNum(s.truck + 1);
        return; // timeline handles the lock
    }

    // Fallback for section transitions (splash→hero fade)
    setTimeout(unlock, 1000);
}

// ============ GSAP OBSERVER — replaces manual wheel/touch listeners ============
Observer.create({
    type: 'wheel',
    tolerance: 50,
    preventDefault: true,
    onDown: () => goTo(currentIndex + 1),   // scroll down = next
    onUp: () => goTo(currentIndex - 1)      // scroll up = previous
});

// ============ SPLASH CLICK (skip fill animation) ============
splashState.addEventListener('click', () => {
    splashTl.progress(1); // instantly finish fill
    goTo(1);
});

// ============ ARROW BUTTONS ============
document.querySelector('.nav-arrow.next').addEventListener('click', () => goTo(currentIndex + 1));
document.querySelector('.nav-arrow.prev').addEventListener('click', () => goTo(currentIndex - 1));


// ============ KEYBOARD ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(currentIndex + 1);
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goTo(currentIndex - 1);
});

// ============ INIT ============
gsap.set(splashState, { opacity: 1, scale: 1 });
splashState.style.pointerEvents = 'auto';
