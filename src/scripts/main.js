// src/scripts/main.js
// State Machine & Scene Controller

let currentSceneIndex = 0;
const scenes = [
    'scene-envelope',  // 0
    'scene-cake',      // 1
    'scene-birthday',  // 2
    'scene-music',     // 3
    'scene-letter',    // 4
    'scene-gallery'    // 5
];

function goToScene(index) {
    if (index < 0 || index >= scenes.length || typeof gsap === 'undefined') return;
    
    const currentScene = document.getElementById(scenes[currentSceneIndex]);
    const targetScene = document.getElementById(scenes[index]);
    
    currentSceneIndex = index;

    // GSAP Crossfade
    const tl = gsap.timeline();
    
    if (currentScene && currentScene !== targetScene) {
        tl.to(currentScene, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" });
    }
    
    if (targetScene) {
        tl.to(targetScene, { autoAlpha: 1, duration: 0.6, ease: "power2.inOut" }, "-=0.2")
          .call(() => {
              // Trigger scene-specific actions after fade in
              if (scenes[index] === 'scene-birthday') {
                  triggerBirthdayAnimation();
              }
              if (scenes[index] === 'scene-music') {
                  if (typeof window.switchToRemajaSong === 'function') {
                      window.switchToRemajaSong();
                  }
              }
              // Add gallery stagger if entering gallery
              if (scenes[index] === 'scene-gallery') {
                  gsap.fromTo('.polaroid', 
                      { y: 50, autoAlpha: 0 }, 
                      { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.5)" }
                  );
              }
              // Add letter pop up if entering letter
              if (scenes[index] === 'scene-letter') {
                  gsap.fromTo('.letter-card',
                      { scale: 0.8, autoAlpha: 0, y: 30 },
                      { scale: 1, autoAlpha: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }
                  );
              }
          });
    }
}

function nextScene() {
    goToScene(currentSceneIndex + 1);
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') return;
    
    // Hide all scenes except first using GSAP autoAlpha (handles opacity and visibility)
    scenes.forEach((sceneId, idx) => {
        const sceneEl = document.getElementById(sceneId);
        if (sceneEl) {
            if (idx === 0) {
                gsap.set(sceneEl, { autoAlpha: 1 });
            } else {
                gsap.set(sceneEl, { autoAlpha: 0 });
            }
        }
    });
});

// Scene 3 logic: Happy Birthday Animation
function triggerBirthdayAnimation() {
    const textEl = document.getElementById('hb-text');
    const photoLeft = document.querySelector('#scene-birthday .photo-left');
    const photoRight = document.querySelector('#scene-birthday .photo-right');
    
    // Reset initial photo positions & visibility
    if (photoLeft && photoRight && typeof gsap !== 'undefined') {
        gsap.set(photoLeft, { autoAlpha: 0, x: -300, scale: 0.7, rotation: -20 });
        gsap.set(photoRight, { autoAlpha: 0, x: 300, scale: 0.7, rotation: 20 });
        gsap.set('.tape', { scale: 0, opacity: 0 });
    }

    // Trigger Scrapbook Photos animation after confetti starts (~0.8s delay)
    if (photoLeft && photoRight && typeof gsap !== 'undefined') {
        const isMobile = window.innerWidth <= 991;
        const leftRot = isMobile ? -5 : -7;
        const rightRot = isMobile ? 5 : 7;

        setTimeout(() => {
            const photoTl = gsap.timeline();
            
            // Photo 4 from Left
            photoTl.to(photoLeft, {
                autoAlpha: 1,
                x: 0,
                scale: 1,
                rotation: leftRot,
                duration: 1.1,
                ease: "back.out(1.5)"
            }, 0)
            // Photo 3 from Right
            .to(photoRight, {
                autoAlpha: 1,
                x: 0,
                scale: 1,
                rotation: rightRot,
                duration: 1.1,
                ease: "back.out(1.5)"
            }, 0.25)
            // Tape sticker pop animation
            .to('.tape', {
                scale: 1,
                opacity: 0.9,
                duration: 0.6,
                stagger: 0.15,
                ease: "elastic.out(1.2, 0.5)"
            }, 0.6);
        }, 800);
    }

    // GSAP Reveal text with elastic bounce
    if (textEl && typeof gsap !== 'undefined') {
        gsap.fromTo(textEl, 
            { autoAlpha: 0, scale: 0.5, y: -20 }, 
            { autoAlpha: 1, scale: 1, y: 0, duration: 1.5, ease: "elastic.out(1, 0.5)" }
        );
    }
    
    // Fire confetti using canvas-confetti
    if (typeof confetti === 'function') {
        const duration = 3500;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#EF7DA0', '#F8C9D4', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#EF7DA0', '#F8C9D4', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
    
    // Show next button after animation
    setTimeout(() => {
        const btnNext = document.getElementById('btn-next-birthday');
        if (btnNext) {
            btnNext.classList.add('visible');
        }
    }, 1800);
}

// Event Listeners for Navigation
document.getElementById('btn-next-birthday')?.addEventListener('click', nextScene);
document.getElementById('btn-next-music')?.addEventListener('click', nextScene);
document.getElementById('btn-next-letter')?.addEventListener('click', nextScene);
