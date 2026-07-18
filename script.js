// ============================================================
//   COMPLETE script.js
//   Works with provided index.html and style.css
//   No modifications to HTML/CSS
// ============================================================

(function() {
    'use strict';

    // ============================================================
    //   APP STATE
    // ============================================================

    const App = {
        // Screens
        screens: {},
        // Popup state
        popupIndex: 0,
        maxPopupIndex: 4, // 0 to 4 (5 questions)
        // Timers
        timers: [],
        // Effect intervals
        effectIntervals: [],
        // NO button scale factor
        noClicks: 0,
        // Memory button click count (just for tracking)
        memoryClicked: false,
        // Think button runaway
        thinkRunaway: null,
        // Flag to prevent multiple transitions
        isTransitioning: false,
    };

    // ============================================================
    //   POPUP DATA
    // ============================================================

    const popupQuestions = [
        {
            title: "Hey Nusrat ❤️",
            text: "Can I borrow just two minutes of your time?"
        },
        {
            title: "Please 🥺",
            text: "Promise you won't close this before reading everything?"
        },
        {
            title: "One Small Request ❤️",
            text: "Will you hear me out until the end?"
        },
        {
            title: "From My Heart...",
            text: "Can I tell you how sorry I really am?"
        },
        {
            title: "Almost There...",
            text: "Will you stay with me for just one more minute?"
        }
    ];

    const funnyMessages = [
        "No isn't available today 😝",
        "Please don't run away 🥺",
        "Just hear me out ❤️",
        "I'm trying my best 😭",
        "Only Continue works 😅",
        "Come on Nusrat 🥹",
        "You almost clicked YES 😂",
        "Give me one chance ❤️"
    ];

    const loadingMessages = [
        "Collecting courage...",
        "Fixing broken memories...",
        "Holding my breath...",
        "Writing every apology...",
        "Packing endless love...",
        "Almost ready..."
    ];

    const letterText = `Dear Nusrat,

I know I made mistakes.
Maybe I hurt you more than I ever wanted.
If I could go back,
I would change every moment that caused you pain.

I cannot change the past.
But I can promise to become a better person.

Thank you for every smile,
every memory,
every little moment.

You are truly special to me.

I'm sincerely sorry.

❤️`;

    const memoryMessages = [
        "That first smile of yours still makes my heart skip a beat. 🌸",
        "I remember every word we shared that night. It felt like magic. ❤️",
        "That moment we laughed until we cried – I'll never forget it. ☕",
        "You are giving me another chance, and I promise to make it count. 🌹"
    ];

    // ============================================================
    //   DOM REFS
    // ============================================================

    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {};

    function cacheDom() {
        dom.screens = {
            welcome: $('#welcomeScreen'),
            popup: $('#popupSection'),
            broken: $('#brokenHeartSection'),
            repair: $('#repairSection'),
            loading: $('#loadingSection'),
            envelope: $('#envelopeSection'),
            promise: $('#promiseSection'),
            memory: $('#memorySection'),
            final: $('#finalQuestion'),
            ending: $('#endingSection')
        };

        dom.popupTitle = $('#popupTitle');
        dom.popupText = $('#popupText');
        dom.yesBtn = $('#yesBtn');
        dom.noBtn = $('#noBtn');
        dom.startBtn = $('#startBtn');
        dom.forgiveBtn = $('#forgiveBtn');
        dom.thinkBtn = $('#thinkBtn');
        dom.replayBtn = $('#replayBtn');
        dom.memoryBtns = $$('.memory');
        dom.progressBar = $('#progressBar');
        dom.progressText = $('#progressText');
        dom.letterText = $('#letterText');
        dom.envelope = $('.envelope');
        dom.heartBroken = document.querySelector('#brokenHeartSection .heart');
        dom.heartRepair = document.querySelector('#repairSection .heart');
        dom.rainContainer = $('#rain');
        dom.heartsContainer = $('#hearts');
        dom.petalsContainer = $('#petals');
        dom.sparklesContainer = $('#sparkles');
        dom.confettiContainer = null; // will create later
        dom.body = document.body;
    }

    // ============================================================
    //   SCREEN MANAGEMENT
    // ============================================================

    function hideAllScreens() {
        Object.values(dom.screens).forEach(s => {
            if (s) {
                s.classList.add('hidden');
                s.classList.remove('active');
            }
        });
    }

    function showScreen(id) {
        // Clear any pending timers that might interfere
        clearAllTimers();

        hideAllScreens();
        const screen = dom.screens[id];
        if (screen) {
            screen.classList.remove('hidden');
            // Force reflow for transition
            void screen.offsetWidth;
            screen.classList.add('active');
        }
        App.isTransitioning = false;
    }

    function clearAllTimers() {
        App.timers.forEach(t => clearTimeout(t));
        App.timers = [];
    }

    function setTimer(fn, delay) {
        const id = setTimeout(() => {
            fn();
            // remove from array after execution
            const idx = App.timers.indexOf(id);
            if (idx > -1) App.timers.splice(idx, 1);
        }, delay);
        App.timers.push(id);
        return id;
    }

    // ============================================================
    //   EFFECTS: RAIN, HEARTS, PETALS, SPARKLES
    // ============================================================

    function createRain() {
        const container = dom.rainContainer;
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 0.8 + Math.random() * 1.2;
        drop.style.left = left + '%';
        drop.style.animationDelay = delay + 's';
        drop.style.animationDuration = duration + 's';
        container.appendChild(drop);
        drop.addEventListener('animationend', () => {
            if (drop.parentNode) drop.remove();
        });
    }

    function createHeart() {
        const container = dom.heartsContainer;
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = ['❤️', '💕', '💖', '💗', '💘'][Math.floor(Math.random() * 5)];
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = 5 + Math.random() * 4;
        heart.style.left = left + '%';
        heart.style.animationDelay = delay + 's';
        heart.style.animationDuration = duration + 's';
        container.appendChild(heart);
        heart.addEventListener('animationend', () => {
            if (heart.parentNode) heart.remove();
        });
    }

    function createPetal() {
        const container = dom.petalsContainer;
        const petal = document.createElement('div');
        petal.className = 'petal';
        const petals = ['🌸', '🌺', '🌷', '🌹', '💮'];
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = 6 + Math.random() * 5;
        const sway = 80 + Math.random() * 100;
        petal.style.left = left + '%';
        petal.style.animationDelay = delay + 's';
        petal.style.animationDuration = duration + 's';
        // Add custom sway via style? Not needed, keyframe handles.
        container.appendChild(petal);
        petal.addEventListener('animationend', () => {
            if (petal.parentNode) petal.remove();
        });
    }

    function createSparkle(x, y) {
        const container = dom.sparklesContainer;
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = (x - 4) + 'px';
        spark.style.top = (y - 4) + 'px';
        const size = 4 + Math.random() * 8;
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';
        spark.style.background = `hsl(${Math.random() * 60 + 300}, 100%, 70%)`;
        container.appendChild(spark);
        spark.addEventListener('animationend', () => {
            if (spark.parentNode) spark.remove();
        });
    }

    // Start effects with intervals
    function startEffects() {
        // Rain every 150ms
        const rainInterval = setInterval(createRain, 150);
        // Hearts every 600ms
        const heartInterval = setInterval(createHeart, 600);
        // Petals every 800ms
        const petalInterval = setInterval(createPetal, 800);
        // Sparkle cursor: handled by mousemove, not interval
        App.effectIntervals = [rainInterval, heartInterval, petalInterval];
    }

    function stopEffects() {
        App.effectIntervals.forEach(id => clearInterval(id));
        App.effectIntervals = [];
        // Also remove existing elements? Not necessary, they'll animate out.
    }

    // ============================================================
    //   CONFETTI & FIREWORKS (for ending)
    // ============================================================

    function createConfettiPiece() {
        const container = dom.confettiContainer || document.body;
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const colors = ['#ff4f95', '#ffb3d1', '#ffd6e5', '#ff7eb3', '#ff2d7a', '#ffa0c0'];
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '-10px';
        piece.style.width = (6 + Math.random() * 8) + 'px';
        piece.style.height = (12 + Math.random() * 12) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (3 + Math.random() * 3) + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(piece);
        piece.addEventListener('animationend', () => {
            if (piece.parentNode) piece.remove();
        });
    }

    function createFirework(x, y) {
        const container = dom.confettiContainer || document.body;
        const numParticles = 30 + Math.floor(Math.random() * 30);
        const colors = ['#ff4f95', '#ffb3d1', '#ffd6e5', '#ff7eb3', '#ff2d7a', '#ffa0c0', '#fff'];
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework';
            const angle = Math.random() * 2 * Math.PI;
            const distance = 50 + Math.random() * 150;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.borderRadius = '50%';
            // We'll use keyframe explode, but need to set transform end position? Keyframe handles scale, but not translation.
            // Modify animation to include translation? We can use custom keyframe via style? Easiest: use anime-like with JS? But we want CSS.
            // Actually, we can set custom animation with translate using inline style? But keyframes are predefined.
            // Instead, we can set a custom animation name with @keyframes? But we can't add dynamic keyframes easily.
            // Alternative: Use JS to animate with requestAnimationFrame? Simpler: use the existing explode animation which scales up, not moves.
            // But we want explosion effect. Since we have .firework with explode animation (scale), we can just use that for a star burst.
            // So particle will scale up and fade. That's okay.
            particle.style.animationDuration = (1 + Math.random() * 0.5) + 's';
            particle.style.animationDelay = (Math.random() * 0.3) + 's';
            particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
            container.appendChild(particle);
            particle.addEventListener('animationend', () => {
                if (particle.parentNode) particle.remove();
            });
        }
    }

    function startConfetti() {
        // create confetti container if not exists
        if (!dom.confettiContainer) {
            const div = document.createElement('div');
            div.id = 'confetti';
            document.body.appendChild(div);
            dom.confettiContainer = div;
        }
        // Generate many pieces
        for (let i = 0; i < 60; i++) {
            setTimeout(createConfettiPiece, i * 40);
        }
        // Also create fireworks periodically
        let fireworkCount = 0;
        const maxFireworks = 8;
        const fwInterval = setInterval(() => {
            if (fireworkCount >= maxFireworks) {
                clearInterval(fwInterval);
                return;
            }
            const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
            const y = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.1;
            createFirework(x, y);
            fireworkCount++;
        }, 800);
        // Also create more confetti during fireworks
        setTimeout(() => {
            const extra = setInterval(createConfettiPiece, 200);
            setTimeout(() => clearInterval(extra), 5000);
        }, 1000);
    }

    // ============================================================
    //   TYPEWRITER EFFECT
    // ============================================================

    function typewriter(element, text, speed = 40, callback) {
        let index = 0;
        element.textContent = '';
        element.style.whiteSpace = 'pre-wrap'; // keep newlines
        element.style.borderRight = '2px solid #ff4f95';
        function type() {
            if (index < text.length) {
                const char = text.charAt(index);
                if (char === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.textContent += char;
                }
                index++;
                setTimeout(type, speed);
            } else {
                element.style.borderRight = 'none';
                if (callback) callback();
            }
        }
        type();
    }

    // ============================================================
    //   POPUP FUNCTIONS
    // ============================================================

    function updatePopup(index) {
        const q = popupQuestions[index];
        if (!q) return;
        dom.popupTitle.textContent = q.title;
        dom.popupText.textContent = q.text;
        // Reset NO button size and position? We keep it.
        // Reset YES button size? We keep it enlarged if no clicks.
        // But we don't reset. We'll handle size increment in noClick.
    }

    function showPopup() {
        App.popupIndex = 0;
        updatePopup(0);
        // Reset NO button to original size and position
        dom.noBtn.style.transform = 'translate(0, 0) scale(1)';
        dom.noBtn.style.position = 'relative'; // reset to relative
        dom.noBtn.style.left = 'auto';
        dom.noBtn.style.top = 'auto';
        dom.yesBtn.style.transform = 'scale(1)';
        App.noClicks = 0;
        showScreen('popup');
    }

    function nextPopup() {
        if (App.popupIndex < App.maxPopupIndex) {
            App.popupIndex++;
            updatePopup(App.popupIndex);
            // Reset NO button position? Keep its size? But we want it to reset to default each new question?
            // Typically, the NO button moves away, but for each question we might want it back to normal.
            // However, the requirement doesn't specify resetting. To be safe, we reset it to default position and scale.
            dom.noBtn.style.transform = 'translate(0, 0) scale(1)';
            dom.noBtn.style.position = 'relative';
            dom.noBtn.style.left = 'auto';
            dom.noBtn.style.top = 'auto';
            // YES button size stays? It may have grown; we keep it.
        } else {
            // Last question, go to broken heart
            showBrokenHeart();
        }
    }

    // ============================================================
    //   NO BUTTON BEHAVIOR
    // ============================================================

    function handleNoClick() {
        // Increment no clicks
        App.noClicks++;
        // Make YES button larger
        const scale = 1 + App.noClicks * 0.1;
        dom.yesBtn.style.transform = `scale(${scale})`;

        // Move NO button randomly
        const btn = dom.noBtn;
        // Get parent dimensions
        const parent = btn.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const maxX = parentRect.width - btnRect.width;
        const maxY = parentRect.height - btnRect.height;
        const randX = Math.random() * maxX;
        const randY = Math.random() * maxY;
        btn.style.position = 'absolute';
        btn.style.left = randX + 'px';
        btn.style.top = randY + 'px';
        btn.style.transform = 'translate(0,0) scale(1)'; // keep scale normal

        // Shake popup
        const popup = dom.screens.popup.querySelector('.mac-window');
        if (popup) {
            popup.classList.add('shake');
            setTimeout(() => popup.classList.remove('shake'), 500);
        }

        // Change title to random funny message
        const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        dom.popupTitle.textContent = msg;
    }

    // ============================================================
    //   SCREEN TRANSITIONS (AUTO)
    // ============================================================

    function showBrokenHeart() {
        showScreen('broken');
        // Animate heart break
        const heart = dom.heartBroken;
        if (heart) {
            heart.classList.add('heart-break');
            // Remove after animation? not needed.
        }
        // Wait 2.5s then go to repair
        setTimer(() => {
            showRepairHeart();
        }, 2500);
    }

    function showRepairHeart() {
        showScreen('repair');
        const heart = dom.heartRepair;
        if (heart) {
            heart.classList.add('heart-repair');
        }
        setTimer(() => {
            showLoading();
        }, 2500);
    }

    function showLoading() {
        showScreen('loading');
        // Reset progress
        dom.progressBar.style.width = '0%';
        dom.progressText.textContent = '0%';
        let progress = 0;
        const totalSteps = 100;
        const stepTime = 40; // ms per 1%
        const msgInterval = Math.floor(totalSteps / loadingMessages.length);
        let msgIndex = 0;
        const interval = setInterval(() => {
            progress++;
            dom.progressBar.style.width = progress + '%';
            dom.progressText.textContent = progress + '%';
            // Update message every few steps
            const idx = Math.floor(progress / msgInterval);
            if (idx < loadingMessages.length && idx !== msgIndex) {
                msgIndex = idx;
                dom.progressText.textContent = loadingMessages[idx] + ' ' + progress + '%';
            }
            if (progress >= 100) {
                clearInterval(interval);
                dom.progressText.textContent = 'Almost ready... 100%';
                setTimer(() => {
                    showEnvelope();
                }, 600);
            }
        }, stepTime);
        // Store interval to clear if needed? We'll rely on completion.
    }

    function showEnvelope() {
        showScreen('envelope');
        const envelope = dom.envelope;
        // Open envelope after a moment
        setTimer(() => {
            envelope.classList.add('open');
        }, 500);
        // Typewriter effect on letter
        const letterEl = dom.letterText;
        typewriter(letterEl, letterText, 30, () => {
            // After typing done, wait 3 seconds then go to promise
            setTimer(() => {
                showPromise();
            }, 3000);
        });
    }

    function showPromise() {
        showScreen('promise');
        // Wait 6 seconds then go to memory
        setTimer(() => {
            showMemory();
        }, 6000);
    }

    function showMemory() {
        showScreen('memory');
        // Reset memory clicked flag
        App.memoryClicked = false;
        // Set timer to go to final after 8 seconds
        setTimer(() => {
            // If user hasn't clicked any memory, still go
            showFinalQuestion();
        }, 8000);
    }

    function showFinalQuestion() {
        showScreen('final');
        // Reset think button position
        dom.thinkBtn.style.position = 'relative';
        dom.thinkBtn.style.left = 'auto';
        dom.thinkBtn.style.top = 'auto';
        dom.thinkBtn.style.transform = 'translate(0,0)';
        // Remove runaway listener if any
        if (App.thinkRunaway) {
            document.removeEventListener('mousemove', App.thinkRunaway);
            App.thinkRunaway = null;
        }
        // Add runaway behavior
        const thinkBtn = dom.thinkBtn;
        function runaway(e) {
            const btnRect = thinkBtn.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const centerX = btnRect.left + btnRect.width / 2;
            const centerY = btnRect.top + btnRect.height / 2;
            const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
            if (dist < 150) {
                // Move away
                const angle = Math.atan2(centerY - mouseY, centerX - mouseX);
                const moveX = Math.cos(angle) * 100;
                const moveY = Math.sin(angle) * 100;
                // Ensure button stays within viewport
                const parentRect = thinkBtn.parentElement.getBoundingClientRect();
                const newLeft = Math.max(0, Math.min(parentRect.width - btnRect.width, btnRect.left - parentRect.left + moveX));
                const newTop = Math.max(0, Math.min(parentRect.height - btnRect.height, btnRect.top - parentRect.top + moveY));
                thinkBtn.style.position = 'absolute';
                thinkBtn.style.left = newLeft + 'px';
                thinkBtn.style.top = newTop + 'px';
                thinkBtn.style.transform = 'translate(0,0)';
            }
        }
        document.addEventListener('mousemove', runaway);
        App.thinkRunaway = runaway;
        // Also handle touch for mobile (simplified: random move on touch)
        thinkBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const parentRect = thinkBtn.parentElement.getBoundingClientRect();
            const btnRect = thinkBtn.getBoundingClientRect();
            const maxX = parentRect.width - btnRect.width;
            const maxY = parentRect.height - btnRect.height;
            const randX = Math.random() * maxX;
            const randY = Math.random() * maxY;
            thinkBtn.style.position = 'absolute';
            thinkBtn.style.left = randX + 'px';
            thinkBtn.style.top = randY + 'px';
        });
    }

    function showEnding() {
        showScreen('ending');
        // Start confetti and fireworks
        startConfetti();
        // Background transition to sunrise (optional)
        dom.body.classList.add('sunrise');
    }

    // ============================================================
    //   EVENT BINDING
    // ============================================================

    function bindEvents() {
        // Start button
        dom.startBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showPopup();
        });

        // YES button in popup
        dom.yesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextPopup();
        });

        // NO button in popup
        dom.noBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleNoClick();
        });

        // Forgive button (Yes in final)
        dom.forgiveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showEnding();
        });

        // Think button (No in final) - it runs away via mousemove, but click also does nothing except maybe show a message? The requirement says "runs away from cursor." and no other action. So we can just prevent default.
        dom.thinkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Optionally show a playful message? Not required.
        });

        // Replay button
        dom.replayBtn.addEventListener('click', function(e) {
            e.preventDefault();
            location.reload();
        });

        // Memory buttons
        dom.memoryBtns.forEach((btn, idx) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (idx < memoryMessages.length) {
                    alert(memoryMessages[idx]);
                }
                // Mark that memory was clicked (optional)
                App.memoryClicked = true;
            });
        });

        // Sparkle cursor
        document.addEventListener('mousemove', function(e) {
            createSparkle(e.clientX, e.clientY);
        });
        // For mobile, we can add touchmove sparkles? Not necessary.
    }

    // ============================================================
    //   INIT
    // ============================================================

    function init() {
        cacheDom();
        hideAllScreens();
        // Show welcome screen initially
        const welcome = dom.screens.welcome;
        if (welcome) {
            welcome.classList.remove('hidden');
            void welcome.offsetWidth;
            welcome.classList.add('active');
        }
        // Start effects
        startEffects();
        // Bind events
        bindEvents();
        // Set initial popup text? already done in showPopup.
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
