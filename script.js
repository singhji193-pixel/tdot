// ============ GSAP + OBSERVER — DISCRETE SCROLL TRANSITIONS ============

gsap.registerPlugin(Observer);

// ============ STATE CONFIG ============
const STATES = [
    { id: 'splashState', type: 'splash' },
    { id: 'heroState', type: 'hero', truck: 0, bg: '#0d0d0d', title: "We don't just tow,<br>we rescue!", sub: 'Unparalleled Speed, Unrivaled Service' },
    { id: 'heroState', type: 'hero', truck: 1, bg: 'linear-gradient(135deg,#2a0000,#6b1010,#4a0000)', title: 'Driven by Speed.<br>Defined by Service.', sub: 'Excellence in Every Mile' },
    { id: 'heroState', type: 'hero', truck: 2, bg: 'linear-gradient(135deg,#a04000,#d96a00,#c05500)', title: 'Flatbed Towing<br>Specialists', sub: 'Safe transport for luxury & exotic vehicles' },
    { id: 'heroState', type: 'hero', truck: 3, bg: 'linear-gradient(135deg,#904050,#c06070,#b04060)', title: 'Accident Recovery<br>& Roadside Help', sub: '24/7 Emergency Response Across the GTA' },
    { id: 'heroState', type: 'hero', truck: 4, bg: 'linear-gradient(135deg,#0d0d0d,#1a1a2a,#0d0d0d)', title: 'Heavy-Duty<br>Commercial Towing', sub: 'RVs, buses & construction equipment' }
];

let currentIndex = 0;
let animating = false;
let prevTruckIndex = -1;
let heroEntered = false;

// ============ DOM REFS ============
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
const container    = document.getElementById('container');

// ============ INITIAL SETUP ============
gsap.set(trucks, { xPercent: 40, yPercent: -50, scale: 0.5, autoAlpha: 0, top: '50%', left: '50%' });
gsap.set([heroTitle, heroSubtitle], { y: 50, autoAlpha: 0 });
gsap.set([heroDesc, buyBtn], { y: 25, autoAlpha: 0 });
gsap.set(navbar, { y: -35, autoAlpha: 0 });
gsap.set(heroStats, { scale: 0, autoAlpha: 0 });
gsap.set(orbit, { autoAlpha: 0, scale: 0.75 });

// ============ SPLASH — LIQUID FILL + AUTO TRANSITION ============
const splashTl = gsap.timeline({ delay: 0.3 });

splashTl.to(splashFill, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.6,
    ease: 'power2.inOut'
});

splashTl.call(() => {
    goTo(1, 1);
}, null, '+=0.4');

// ============ TRANSITION HELPERS ============
function showState(stateEl) {
    gsap.to(stateEl, {
        autoAlpha: 1, scale: 1, duration: 1.0, ease: 'expo.out',
        onStart: () => { stateEl.style.pointerEvents = 'auto'; }
    });
}

function hideState(stateEl) {
    gsap.to(stateEl, {
        autoAlpha: 0, scale: 0.96, duration: 0.7, ease: 'power2.inOut',
        onComplete: () => { stateEl.style.pointerEvents = 'none'; }
    });
}

// ============ HERO ENTRANCE TIMELINE ============
function heroEntrance() {
    const tl = gsap.timeline();
    tl.to(navbar, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out' })
      .to(heroTitle, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' }, '-=0.4')
      .to(heroSubtitle, { y: 0, autoAlpha: 0.55, duration: 0.7, ease: 'expo.out' }, '-=0.6')
      .to(heroStats, { scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(1.4)' }, '-=0.4')
      .to(orbit, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'expo.out' }, '-=0.5')
      .to([heroDesc, buyBtn], { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: 'expo.out' }, '-=0.5');
    return tl;
}

// ============ TRUCK TRANSITION ============
function truckTransition(newIndex, oldIndex, dir) {
    const tl = gsap.timeline();
    const newTruck = trucks[newIndex];
    const exitX = dir > 0 ? -70 : 70;
    const enterX = dir > 0 ? 55 : -55;

    if (oldIndex >= 0 && oldIndex !== newIndex) {
        const oldTruck = trucks[oldIndex];
        tl.to(oldTruck, {
            xPercent: exitX, yPercent: -50, scale: 0.4, autoAlpha: 0,
            rotation: dir > 0 ? -2 : 2,
            duration: 0.8, ease: 'power2.inOut'
        }, 0);
    }

    tl.fromTo(newTruck,
        { xPercent: enterX, yPercent: -50, scale: 0.5, autoAlpha: 0, rotation: dir > 0 ? 2 : -2 },
        { xPercent: -50, yPercent: -50, scale: 1, autoAlpha: 1, rotation: 0,
          duration: 1.2, ease: 'expo.out' },
        oldIndex >= 0 ? 0.15 : 0
    );

    return tl;
}

// ============ BACKGROUND MORPH ============
function morphBackground(bg) {
    gsap.to(heroState, { background: bg, duration: 1.2, ease: 'power2.inOut' });
}

// ============ TEXT TRANSITION ============
function swapText(dir) {
    const s = STATES[currentIndex];
    const yOut = dir > 0 ? -25 : 25;
    const yIn  = dir > 0 ? 25 : -25;

    gsap.to(heroTitle, {
        autoAlpha: 0, y: yOut, duration: 0.3, ease: 'power2.in',
        onComplete: () => {
            heroTitle.innerHTML = s.title;
            gsap.fromTo(heroTitle,
                { autoAlpha: 0, y: yIn },
                { autoAlpha: 1, y: 0, duration: 0.55, ease: 'expo.out' }
            );
        }
    });
    gsap.to(heroSubtitle, {
        autoAlpha: 0, y: yOut * 0.4, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
            heroSubtitle.textContent = s.sub;
            gsap.fromTo(heroSubtitle,
                { autoAlpha: 0, y: yIn * 0.4 },
                { autoAlpha: s.sub ? 0.55 : 0, y: 0, duration: 0.45, ease: 'expo.out', delay: 0.04 }
            );
        }
    });
}

// ============ SLIDE NUMBER ============
function animateSlideNum(num, dir) {
    const yOut = dir > 0 ? -12 : 12;
    const yIn  = dir > 0 ? 12 : -12;
    gsap.to(slideNum, {
        autoAlpha: 0, y: yOut, duration: 0.18, ease: 'power2.in',
        onComplete: () => {
            slideNum.textContent = String(num).padStart(2, '0');
            gsap.fromTo(slideNum,
                { autoAlpha: 0, y: yIn },
                { autoAlpha: 1, y: 0, duration: 0.3, ease: 'expo.out' }
            );
        }
    });
}

// ============ DELAYED UNLOCK (absorb trackpad/touch momentum) ============
const unlockCall = gsap.delayedCall(0.35, () => { animating = false; }).pause();

function unlock() {
    unlockCall.restart(true);
}

// ============ GO TO STATE ============
function goTo(index, dir) {
    if (heroEntered && index < 1) return;
    if (index < 0 || index >= STATES.length) return;
    if (animating) return;

    animating = true;
    dir = dir || (index > currentIndex ? 1 : -1);

    const prevIndex = currentIndex;
    currentIndex = index;
    const s = STATES[currentIndex];
    const prevState = STATES[prevIndex];

    // Hide previous state if different section
    if (prevState.id !== s.id) {
        hideState(document.getElementById(prevState.id));
    }

    // Show target state
    if (prevState.id !== s.id) {
        showState(document.getElementById(s.id));
    }

    if (s.type === 'hero') {
        morphBackground(s.bg);

        if (heroEntered) {
            swapText(dir);
        }

        if (!heroEntered) {
            heroEntered = true;
            heroTitle.innerHTML = s.title;
            heroSubtitle.textContent = s.sub;
            const masterTl = gsap.timeline({ onComplete: unlock });
            masterTl.add(heroEntrance())
                    .add(truckTransition(s.truck, -1, dir), '-=0.7');
        } else {
            const tl = truckTransition(s.truck, prevTruckIndex, dir);
            tl.eventCallback('onComplete', unlock);
        }

        prevTruckIndex = s.truck;
        animateSlideNum(s.truck + 1, dir);
        return;
    }

    // Fallback (splash → hero)
    gsap.delayedCall(1.0, () => { animating = false; });
}

// ============ NAVIGATION HANDLER ============
function goNext() { if (!animating) goTo(currentIndex + 1, 1); }
function goPrev() { if (!animating) goTo(currentIndex - 1, -1); }

// ============ GSAP OBSERVER — TWO INSTANCES (wheel + touch separated) ============

// Wheel observer (desktop) — higher tolerance for trackpad momentum
Observer.create({
    target: container,
    type: 'wheel',
    wheelSpeed: -1,
    tolerance: 10,
    preventDefault: true,
    onDown: () => goPrev(),
    onUp:   () => goNext()
});

// Touch observer (mobile/tablet) — low tolerance for responsive feel
Observer.create({
    target: container,
    type: 'touch',
    tolerance: 3,
    dragMinimum: 4,
    preventDefault: true,
    onDown: () => goPrev(),
    onUp:   () => goNext()
});

// ============ SPLASH CLICK ============
splashState.addEventListener('click', () => {
    splashTl.progress(1);
    goTo(1, 1);
});

// ============ ARROW BUTTONS ============
document.querySelector('.nav-arrow.next').addEventListener('click', goNext);
document.querySelector('.nav-arrow.prev').addEventListener('click', goPrev);

// ============ KEYBOARD ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  goPrev();
});

// ============ INIT ============
gsap.set(splashState, { autoAlpha: 1, scale: 1 });
splashState.style.pointerEvents = 'auto';
