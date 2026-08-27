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
    
    // GSAP Reveal text with bounce
    if (textEl && typeof gsap !== 'undefined') {
        gsap.fromTo(textEl, 
            { autoAlpha: 0, scale: 0.5 }, 
            { autoAlpha: 1, scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }
        );
    }
    
    // Fire confetti using canvas-confetti
    if (typeof confetti === 'function') {
        const duration = 3000;
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
    
    // Show next button after delay
    setTimeout(() => {
        const btnNext = document.getElementById('btn-next-birthday');
        if (btnNext) {
            btnNext.classList.add('visible');
        }
    }, 2000);
}

// Helper to attach burst on button click before next scene
function attachBurstAndNext(btnId) {
    const btn = document.getElementById(btnId);
    btn?.addEventListener('click', (e) => {
        if (typeof window.triggerBalloonAndLoveBurst === 'function') {
            window.triggerBalloonAndLoveBurst(e.clientX, e.clientY);
        }
        nextScene();
    });
}

attachBurstAndNext('btn-next-birthday');
attachBurstAndNext('btn-next-music');
attachBurstAndNext('btn-next-letter');
