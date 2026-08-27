// src/scripts/interactions.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Envelope Interaction ---
    const btnOpenEnvelope = document.getElementById('btn-open-envelope');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');
    const flap = document.querySelector('.flap');
    const letter = document.querySelector('.letter-peek');
    const seal = document.querySelector('.heart-seal');
    let isEnvelopeOpened = false;



    // Mouse Parallax Effect for Envelope
    document.addEventListener('mousemove', (e) => {
        if (isEnvelopeOpened || !envelopeWrapper || typeof gsap === 'undefined' || currentSceneIndex !== 0) return;
        
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        // Base rotation from CSS is rotateX(15deg) rotateY(-10deg)
        gsap.to(envelopeWrapper, {
            rotationY: -10 - xAxis,
            rotationX: 15 + yAxis,
            duration: 0.5,
            ease: "power1.out"
        });
    });

    // Reset when mouse leaves window
    document.addEventListener('mouseleave', () => {
        if (isEnvelopeOpened || !envelopeWrapper || typeof gsap === 'undefined' || currentSceneIndex !== 0) return;
        gsap.to(envelopeWrapper, {
            rotationY: -10,
            rotationX: 15,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    btnOpenEnvelope?.addEventListener('click', (e) => {
        if (!envelopeWrapper || typeof gsap === 'undefined') return;
        
        // Trigger Pop-Up Burst of Balloons & Love Hearts!
        if (typeof window.triggerBalloonAndLoveBurst === 'function') {
            const rect = btnOpenEnvelope.getBoundingClientRect();
            const clickX = e.clientX || (rect.left + rect.width / 2);
            const clickY = e.clientY || rect.top;
            window.triggerBalloonAndLoveBurst(clickX, clickY);
        }

        isEnvelopeOpened = true;
        btnOpenEnvelope.style.display = 'none';
        
        // Helper function for typing animation
        function startTypingEffect(element, textToType, speed = 90) {
            if (!element) return;
            element.innerHTML = '<span class="typing-cursor">|</span>';
            let i = 0;
            const timer = setInterval(() => {
                if (i < textToType.length) {
                    element.innerHTML = textToType.substring(0, i + 1) + '<span class="typing-cursor">|</span>';
                    i++;
                } else {
                    clearInterval(timer);
                    element.innerHTML = textToType;
                }
            }, speed);
        }

        // GSAP Timeline for Envelope
        const tl = gsap.timeline({
            onComplete: () => {
                // Wait briefly then go to next scene
                setTimeout(() => goToScene(1), 600);
            }
        });
        
        // 1. Envelope stands up
        tl.to(envelopeWrapper, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.6,
            ease: "power2.inOut"
        }, 0)
        // 2. Seal fades out
        .to(seal, {
            opacity: 0,
            duration: 0.3
        }, 0.2)
        // 3. Flap opens backward & start typing text
        .to(flap, {
            rotationX: 180,
            z: 3,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: function() {
                const prog = this.progress();
                flap.style.filter = `drop-shadow(0 ${5 - (10 * prog)}px 8px rgba(0,0,0,0.1))`;
            }
        }, 0.2)
        .add(() => {
            const letterTextEl = document.getElementById('letter-peek-text');
            startTypingEffect(letterTextEl, 'For Jihan ✨', 85);
        }, 0.4)
        // 4. Letter slides up and pops forward
        .to(letter, {
            y: -70,
            z: 5,
            rotationX: -5,
            boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
            duration: 1,
            ease: "back.out(1.2)"
        }, 0.6);
    });


    // --- 2. Candle Blow Interaction ---
    const cake = document.querySelector('.cake');
    const btnEnableMic = document.getElementById('btn-enable-mic');
    let audioContext;
    let microphone;
    let analyser;

    function extinguishCandle() {
        const flames = document.querySelectorAll('.flame');
        if (flames.length === 0) return;
        
        // Check if already extinguished using custom attribute
        if (cake.dataset.extinguished === 'true') return;
        cake.dataset.extinguished = 'true';
        
        if (typeof gsap !== 'undefined') {
            // GSAP Blow out animation
            gsap.to(flames, {
                scale: 0,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: "back.in(2)",
                onComplete: () => {
                    // Wait a bit, then move to Scene 3
                    setTimeout(() => {
                        goToScene(2);
                    }, 800);
                }
            });
        } else {
            // Fallback
            flames.forEach(f => f.classList.add('extinguished'));
            setTimeout(() => goToScene(2), 1200);
        }
        
        // Stop listening to mic if active
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close();
        }
    }

    // Tap to extinguish
    cake?.addEventListener('click', extinguishCandle);

    // Mic to extinguish (Stretch Goal)
    btnEnableMic?.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            
            microphone.connect(analyser);
            analyser.fftSize = 256;
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            
            btnEnableMic.innerText = '🎤 Mendengarkan... Tiup!';
            btnEnableMic.disabled = true;

            function checkBlow() {
                if (cake.dataset.extinguished === 'true') return;
                
                analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for(let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;

                // Threshold for blowing (may vary per device, 100 is generally ok for blowing close to mic)
                if (average > 100) {
                    extinguishCandle();
                } else {
                    requestAnimationFrame(checkBlow);
                }
            }
            
            checkBlow();
        } catch (err) {
            console.error('Mic access denied or error:', err);
            btnEnableMic.innerText = 'Gagal akses Mic (Tap kue saja)';
        }
    });


    // --- 3. Music Player ---
    const bgMusic = document.getElementById('bgMusic');
    const btnTogglePlay = document.getElementById('btn-toggle-play');
    const vinyl = document.getElementById('vinyl-record');
    const soundWave = document.getElementById('sound-wave');
    const btnNextMusic = document.getElementById('btn-next-music');

    let vinylTween;
    if (typeof gsap !== 'undefined' && vinyl) {
        vinylTween = gsap.to(vinyl, {
            rotation: 360,
            duration: 4,
            repeat: -1,
            ease: "none",
            paused: true
        });
    }

    function syncVinylState() {
        if (bgMusic.paused) {
            vinyl?.classList.remove('playing');
            soundWave?.classList.remove('playing');
            if (vinylTween) vinylTween.pause();
            if (btnTogglePlay) btnTogglePlay.innerText = '▶️ Play';
        } else {
            vinyl?.classList.add('playing');
            soundWave?.classList.add('playing');
            if (vinylTween) vinylTween.play();
            if (btnTogglePlay) btnTogglePlay.innerText = '⏸️ Pause';
        }
    }

    // Music should start playing when arriving at music scene (or when user clicks next from birthday scene)
    document.getElementById('btn-next-birthday')?.addEventListener('click', () => {
        if (bgMusic) {
            bgMusic.play().then(() => {
                syncVinylState();
            }).catch(e => {
                console.log('Autoplay prevented, user must click play manually');
                syncVinylState();
            });
        }
    });

    btnTogglePlay?.addEventListener('click', () => {
        if (!bgMusic) return;
        
        if (bgMusic.paused) {
            bgMusic.play();
        } else {
            bgMusic.pause();
        }
        syncVinylState();
    });


    // --- 4. Gallery Lightbox ---
    const polaroids = document.querySelectorAll('.polaroid');
    const lightbox = document.getElementById('lightbox');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    polaroids.forEach(p => {
        p.addEventListener('click', () => {
            // Just display the lightbox placeholder for now
            if (lightbox) {
                lightbox.classList.remove('hidden');
                
                // Get caption from polaroid
                const captionEl = p.querySelector('.polaroid-caption');
                const lbCaption = document.getElementById('lightbox-caption');
                if (captionEl && lbCaption) {
                    lbCaption.innerText = captionEl.innerText;
                }

                // If user added img tags later, we can sync the src here
                const imgEl = p.querySelector('img');
                const lbImgPlaceholder = document.getElementById('lightbox-img');
                if (imgEl && lbImgPlaceholder) {
                    lbImgPlaceholder.innerHTML = `<img src="${imgEl.src}" class="lightbox-img">`;
                } else {
                    // Fallback to placeholder text
                    lbImgPlaceholder.innerText = p.querySelector('.polaroid-img-placeholder')?.innerText || 'Foto';
                }
            }
        });
    });

    closeLightbox?.addEventListener('click', () => {
        if (lightbox) {
            lightbox.classList.add('hidden');
        }
    });
    
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
        }
    });

    // --- 5. Automatic Custom Cursor Auto-Resizer ---
    function setupAutoCustomCursor() {
        const candidatePaths = [
            './assets/images/cursor.svg.png',
            './assets/images/cursor.png',
            './assets/images/cursor.svg'
        ];
        
        function tryLoad(index) {
            if (index >= candidatePaths.length) return;
            const img = new Image();
            img.onload = () => {
                const c = document.createElement('canvas');
                c.width = 64;
                c.height = 64;
                const ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0, 64, 64);
                const dataUrl = c.toDataURL('image/png');
                
                const style = document.createElement('style');
                style.innerHTML = `
                    body, html { cursor: url("${dataUrl}") 32 32, auto !important; }
                    button, a, .polaroid, .cake, .envelope-wrapper, .btn-primary, .btn-secondary, .btn-icon, .close-lightbox {
                        cursor: url("${dataUrl}") 32 32, pointer !important;
                    }
                `;
                document.head.appendChild(style);
            };
            img.onerror = () => tryLoad(index + 1);
            img.src = candidatePaths[index];
        }
        
        tryLoad(0);
    }
    
    setupAutoCustomCursor();

});
