// ============ GSAP + OBSERVER — SMOOTH DRAG-BASED TRANSITIONS ============

gsap.registerPlugin(Observer);

// ============ STATE CONFIG ============
const STATES = [
    { id: 'splashState', type: 'splash' },
    { id: 'heroState', type: 'hero', truck: 0, bg: '#0d0d0d', title: "We don't just tow,<br>we rescue!", sub: 'Unparalleled Speed, Unrivaled Service' },
    { id: 'heroState', type: 'hero', truck: 1, bg: 'linear-gradient(135deg,#2a0000,#6b1010,#4a0000)', title: 'Driven by Speed.<br>Defined by Service.', sub: 'Excellence in Every Mile' },
    { id: 'heroState', type: 'hero', truck: 2, bg: 'linear-gradient(135deg,#a04000,#d96a00,#c05500)', title: 'Flatbed Towing<br>Specialists', sub: 'Safe transport for luxury & exotic vehicles' },
    { id: 'heroState', type: 'hero', truck: 3, bg: 'linear-gradient(135deg,#904050,#c06070,#b04060)', title: 'Accident Recovery<br>& Roadside Help', sub: '24/7 Emergency Response Across the GTA' },
    { id: 'heroState', type: 'hero', truck: 4, bg: 'linear-gradient(135deg,#0d0d0d,#1a1a2a,#0d0d0d)', title: 'Heavy-Duty<br>Commercial Towing', sub: 'RVs, buses & construction equipment' },
    { id: 'connectState', type: 'connect' }
];

let currentIndex = 0;
let animating = false;
let prevTruckIndex = -1;
let heroEntered = false;

// Drag state
let dragAccum = 0;
const DRAG_MAX = 40;        // max visual shift in px
const SNAP_THRESHOLD = 50;  // px of drag before committing to transition

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
const truckArea    = document.querySelector('.truck-area');
const heroBody     = document.querySelector('.hero-body');

// ============ INITIAL SETUP ============
gsap.set(trucks, { xPercent: 40, yPercent: -50, scale: 0.5, autoAlpha: 0, top: '50%', left: '50%', force3d: true });
gsap.set([heroTitle, heroSubtitle], { y: 50, autoAlpha: 0, force3d: true });
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
        autoAlpha: 1, scale: 1, duration: 0.8, ease: 'expo.out',
        onStart: () => { stateEl.style.pointerEvents = 'auto'; }
    });
}

function hideState(stateEl) {
    gsap.to(stateEl, {
        autoAlpha: 0, scale: 0.96, duration: 0.5, ease: 'power2.inOut',
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
    const exitX = dir > 0 ? -55 : 55;
    const enterX = dir > 0 ? 45 : -45;

    if (oldIndex >= 0 && oldIndex !== newIndex) {
        const oldTruck = trucks[oldIndex];
        oldTruck.classList.remove('show-shadow');
        tl.to(oldTruck, {
            xPercent: exitX, yPercent: -50, scale: 0.5, autoAlpha: 0,
            duration: 0.55, ease: 'power3.in'        }, 0);
    }

    newTruck.classList.remove('show-shadow');
    tl.fromTo(newTruck,
        { xPercent: enterX, yPercent: -50, scale: 0.6, autoAlpha: 0 },
        { xPercent: -50, yPercent: -50, scale: 1, autoAlpha: 1,
          duration: 0.75, ease: 'expo.out', force3d: true,
          onComplete: () => { newTruck.classList.add('show-shadow'); }
        },
        oldIndex >= 0 ? 0.1 : 0
    );

    return tl;
}

// ============ BACKGROUND MORPH ============
function morphBackground(bg) {
    gsap.to(heroState, { background: bg, duration: 1.0, ease: 'power2.inOut' });
}

// ============ TEXT TRANSITION ============
function swapText(dir) {
    const s = STATES[currentIndex];
    const yOut = dir > 0 ? -18 : 18;
    const yIn  = dir > 0 ? 18 : -18;

    gsap.to(heroTitle, {
        autoAlpha: 0, y: yOut, duration: 0.2, ease: 'power2.in', force3d: true,
        onComplete: () => {
            heroTitle.innerHTML = s.title;
            gsap.fromTo(heroTitle,
                { autoAlpha: 0, y: yIn },
                { autoAlpha: 1, y: 0, duration: 0.4, ease: 'expo.out', force3d: true }
            );
        }
    });
    gsap.to(heroSubtitle, {
        autoAlpha: 0, y: yOut * 0.4, duration: 0.15, ease: 'power2.in',
        onComplete: () => {
            heroSubtitle.textContent = s.sub;
            gsap.fromTo(heroSubtitle,
                { autoAlpha: 0, y: yIn * 0.4 },
                { autoAlpha: s.sub ? 0.55 : 0, y: 0, duration: 0.35, ease: 'expo.out', delay: 0.02 }
            );
        }
    });
}

// ============ SLIDE NUMBER ============
function animateSlideNum(num, dir) {
    const yOut = dir > 0 ? -10 : 10;
    const yIn  = dir > 0 ? 10 : -10;
    gsap.to(slideNum, {
        autoAlpha: 0, y: yOut, duration: 0.12, ease: 'power2.in',
        onComplete: () => {
            slideNum.textContent = String(num).padStart(2, '0');
            gsap.fromTo(slideNum,
                { autoAlpha: 0, y: yIn },
                { autoAlpha: 1, y: 0, duration: 0.2, ease: 'expo.out' }
            );
        }
    });
}

// ============ DRAG VISUAL FEEDBACK ============
function applyDragShift(deltaY) {
    if (animating || !heroEntered) return;
    dragAccum = gsap.utils.clamp(-DRAG_MAX, DRAG_MAX, dragAccum + deltaY * 0.15);

    // Shift the truck area and hero body slightly — gives "connected to finger" feel
    if (truckArea) {
        gsap.set(truckArea, { y: dragAccum * 0.6, force3d: true });
    }
    if (heroBody) {
        gsap.set(heroBody, { y: dragAccum * 0.3, force3d: true });
    }
}

function resetDragShift() {
    dragAccum = 0;
    if (truckArea) {
        gsap.to(truckArea, { y: 0, duration: 0.4, ease: 'expo.out', force3d: true });
    }
    if (heroBody) {
        gsap.to(heroBody, { y: 0, duration: 0.4, ease: 'expo.out', force3d: true });
    }
}

// ============ GO TO STATE ============
function goTo(index, dir) {
    if (heroEntered && index < 1) return;
    if (index < 0 || index >= STATES.length) return;
    if (animating) return;

    animating = true;
    dir = dir || (index > currentIndex ? 1 : -1);

    // Reset any drag visual offset
    resetDragShift();

    const prevIndex = currentIndex;
    currentIndex = index;
    const s = STATES[currentIndex];
    const prevState = STATES[prevIndex];

    if (prevState.id !== s.id) {
        hideState(document.getElementById(prevState.id));
    }

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
            const masterTl = gsap.timeline({
                onComplete: () => { animating = false; }
            });
            masterTl.add(heroEntrance())
                    .add(truckTransition(s.truck, -1, dir), '-=0.7');
        } else {
            const tl = truckTransition(s.truck, prevTruckIndex, dir);
            tl.eventCallback('onComplete', () => { animating = false; });
        }

        prevTruckIndex = s.truck;
        animateSlideNum(s.truck + 1, dir);
        return;
    }

    // Connect state entrance animation
    if (s.type === 'connect') {
        const connectInner = document.querySelector('.connect-inner');
        const connectBack = document.querySelector('.connect-back');
        gsap.fromTo(connectInner,
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', delay: 0.3 }
        );
        gsap.fromTo(connectBack,
            { x: -20, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', delay: 0.5 }
        );
    }

    gsap.delayedCall(0.8, () => { animating = false; });
}

// ============ NAVIGATION HANDLER ============
function goNext() { if (!animating) goTo(currentIndex + 1, 1); }
function goPrev() { if (!animating) goTo(currentIndex - 1, -1); }

// ============ GSAP OBSERVER — WHEEL (desktop/trackpad) ============
Observer.create({
    target: container,
    type: 'wheel',
    wheelSpeed: -1,
    tolerance: 10,
    preventDefault: true,
    onDown: () => goPrev(),
    onUp:   () => goNext()
});

// ============ GSAP OBSERVER — TOUCH (drag-based with visual feedback) ============
let touchDragTotal = 0;
let touchTriggered = false;

Observer.create({
    target: container,
    type: 'touch',
    preventDefault: true,
    dragMinimum: 2,
    onPress: () => {
        touchDragTotal = 0;
        touchTriggered = false;
        dragAccum = 0;
    },
    onDrag: (self) => {
        if (animating || touchTriggered) return;
        touchDragTotal += self.deltaY;

        // Visual feedback — content follows finger
        applyDragShift(self.deltaY);

        // Check if we've crossed the snap threshold
        if (Math.abs(touchDragTotal) > SNAP_THRESHOLD) {
            touchTriggered = true;
            if (touchDragTotal < 0) {
                goNext();  // swiped up → next
            } else {
                goPrev();  // swiped down → prev
            }
        }
    },
    onDragEnd: () => {
        if (!touchTriggered) {
            // Didn't cross threshold — bounce back
            resetDragShift();
        }
        touchDragTotal = 0;
        touchTriggered = false;
    }
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
