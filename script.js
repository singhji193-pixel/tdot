// ============ GSAP + OBSERVER — DISCRETE SCROLL TRANSITIONS ============

gsap.registerPlugin(Observer);

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
let direction = 1; // 1 = forward, -1 = backward

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
gsap.set([heroTitle, heroSubtitle], { y: 60, opacity: 0 });
gsap.set([heroDesc, buyBtn], { y: 30, opacity: 0 });
gsap.set(navbar, { y: -40, opacity: 0 });
gsap.set(heroStats, { scale: 0, opacity: 0 });
gsap.set(orbit, { opacity: 0, scale: 0.7 });

// ============ SPLASH — LIQUID FILL + AUTO TRANSITION ============
const splashTl = gsap.timeline({ delay: 0.3 });

splashTl.to(splashFill, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.6,
    ease: 'power2.inOut'
});

splashTl.call(() => {
    goTo(1);
}, null, '+=0.4');

// ============ TRANSITION HELPERS ============
function showState(stateEl) {
    gsap.to(stateEl, {
        opacity: 1, scale: 1, duration: 1.2, ease: 'expo.out',
        onStart: () => { stateEl.style.pointerEvents = 'auto'; }
    });
}

function hideState(stateEl) {
    gsap.to(stateEl, {
        opacity: 0, scale: 0.95, duration: 0.8, ease: 'power3.inOut',
        onComplete: () => { stateEl.style.pointerEvents = 'none'; }
    });
}

// ============ HERO ENTRANCE TIMELINE ============
function heroEntrance() {
    const tl = gsap.timeline();
    tl.to(navbar, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' })
      .to(heroTitle, { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out' }, '-=0.5')
      .to(heroSubtitle, { y: 0, opacity: 0.55, duration: 0.8, ease: 'expo.out' }, '-=0.7')
      .to(heroStats, { scale: 1, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.5')
      .to(orbit, { opacity: 1, scale: 1, duration: 1.0, ease: 'expo.out' }, '-=0.6')
      .to([heroDesc, buyBtn], { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'expo.out' }, '-=0.6');
    return tl;
}

// ============ TRUCK TRANSITION ============
function truckTransition(newIndex, oldIndex, dir) {
    const tl = gsap.timeline();
    const newTruck = trucks[newIndex];

    // Exit direction based on scroll direction
    const exitX = dir > 0 ? -80 : 80;
    const enterX = dir > 0 ? 60 : -60;

    if (oldIndex >= 0 && oldIndex !== newIndex) {
        const oldTruck = trucks[oldIndex];
        tl.to(oldTruck, {
            xPercent: exitX, yPercent: -50, scale: 0.35, opacity: 0,
            rotation: dir > 0 ? -3 : 3,
            duration: 0.9, ease: 'power3.inOut'
        }, 0);
    }

    tl.fromTo(newTruck,
        { xPercent: enterX, yPercent: -50, scale: 0.45, opacity: 0, rotation: dir > 0 ? 3 : -3 },
        { xPercent: -50, yPercent: -50, scale: 1, opacity: 1, rotation: 0,
          duration: 1.3, ease: 'expo.out' },
        oldIndex >= 0 ? 0.2 : 0
    );

    return tl;
}

// ============ BACKGROUND MORPH ============
function morphBackground(bg) {
    gsap.to(heroState, { background: bg, duration: 1.4, ease: 'power3.inOut' });
}

// ============ TEXT TRANSITION ============
function swapText(dir) {
    const s = STATES[currentIndex];
    const yOut = dir > 0 ? -30 : 30;
    const yIn  = dir > 0 ? 30 : -30;

    gsap.to(heroTitle, {
        opacity: 0, y: yOut, duration: 0.35, ease: 'power2.in',
        onComplete: () => {
            heroTitle.innerHTML = s.title;
            gsap.fromTo(heroTitle,
                { opacity: 0, y: yIn },
                { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
            );
        }
    });
    gsap.to(heroSubtitle, {
        opacity: 0, y: yOut * 0.5, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
            heroSubtitle.textContent = s.sub;
            gsap.fromTo(heroSubtitle,
                { opacity: 0, y: yIn * 0.5 },
                { opacity: s.sub ? 0.55 : 0, y: 0, duration: 0.5, ease: 'expo.out', delay: 0.05 }
            );
        }
    });
}

// ============ SLIDE NUMBER COUNTER ============
function animateSlideNum(num, dir) {
    const yOut = dir > 0 ? -15 : 15;
    const yIn  = dir > 0 ? 15 : -15;
    gsap.to(slideNum, {
        opacity: 0, y: yOut, duration: 0.2, ease: 'power2.in',
        onComplete: () => {
            slideNum.textContent = String(num).padStart(2, '0');
            gsap.fromTo(slideNum,
                { opacity: 0, y: yIn },
                { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' }
            );
        }
    });
}

// ============ GO TO STATE ============
let heroEntered = false;
const COOLDOWN = 350;

function unlock() {
    setTimeout(() => { transitioning = false; }, COOLDOWN);
}

function goTo(index, dir) {
    if (heroEntered && index < 1) return;
    if (index < 0 || index >= STATES.length) return;
    if (transitioning) return;

    transitioning = true;
    direction = dir || (index > currentIndex ? 1 : -1);

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

        // Swap title/subtitle with directional fade
        if (heroEntered) {
            swapText(direction);
        }

        if (!heroEntered) {
            heroEntered = true;
            heroTitle.innerHTML = s.title;
            heroSubtitle.textContent = s.sub;
            const masterTl = gsap.timeline({ onComplete: unlock });
            masterTl.add(heroEntrance())
                    .add(truckTransition(s.truck, -1, direction), '-=0.8');
        } else {
            const tl = truckTransition(s.truck, prevTruckIndex, direction);
            tl.eventCallback('onComplete', unlock);
        }

        prevTruckIndex = s.truck;
        animateSlideNum(s.truck + 1, direction);
        return;
    }

    setTimeout(unlock, 1200);
}

// ============ GSAP OBSERVER ============
Observer.create({
    target: document.getElementById('container'),
    type: 'wheel,touch,pointer',
    tolerance: 30,
    dragMinimum: 15,
    preventDefault: true,
    onUp:   () => goTo(currentIndex + 1, 1),    // swipe up / scroll down = NEXT
    onDown: () => goTo(currentIndex - 1, -1)    // swipe down / scroll up = PREV
});

// ============ SPLASH CLICK ============
splashState.addEventListener('click', () => {
    splashTl.progress(1);
    goTo(1, 1);
});

// ============ ARROW BUTTONS ============
document.querySelector('.nav-arrow.next').addEventListener('click', () => goTo(currentIndex + 1, 1));
document.querySelector('.nav-arrow.prev').addEventListener('click', () => goTo(currentIndex - 1, -1));

// ============ KEYBOARD ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goTo(currentIndex + 1, 1);
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goTo(currentIndex - 1, -1);
});

// ============ INIT ============
gsap.set(splashState, { opacity: 1, scale: 1 });
splashState.style.pointerEvents = 'auto';
