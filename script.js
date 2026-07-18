const App = {
    state: {
        popupIndex: 0,
        yesBtnScale: 1,
        funnyMessages: [
            "No isn't available today 😝", "Please don't run away 🥺", 
            "Just hear me out ❤️", "I'm trying my best 😭", 
            "Only Continue works 😅", "Come on Nusrat 🥹", 
            "You almost clicked YES 😂", "Give me one chance ❤️"
        ],
        memories: [
            "Your smile is my favorite view. 🌸",
            "Our talks are my safest place. ❤️",
            "Every coffee date is a treasure. ☕",
            "I'll cherish our story forever. 🌹"
        ]
    },

    elements: {
        welcome: document.getElementById('welcomeScreen'),
        popup: document.getElementById('popupSection'),
        popupTitle: document.getElementById('popupTitle'),
        popupText: document.getElementById('popupText'),
        yesBtn: document.getElementById('yesBtn'),
        noBtn: document.getElementById('noBtn'),
        macWindow: document.querySelector('.mac-window'),
        broken: document.getElementById('brokenHeartSection'),
        repair: document.getElementById('repairSection'),
        loading: document.getElementById('loadingSection'),
        progressBar: document.getElementById('progressBar'),
        progressText: document.getElementById('progressText'),
        envelope: document.getElementById('envelopeSection'),
        letterText: document.getElementById('letterText'),
        promise: document.getElementById('promiseSection'),
        memory: document.getElementById('memorySection'),
        final: document.getElementById('finalQuestion'),
        ending: document.getElementById('endingSection'),
        rain: document.getElementById('rain'),
        hearts: document.getElementById('hearts'),
        petals: document.getElementById('petals'),
        sparkles: document.getElementById('sparkles')
    },

    init() {
        this.setupBackgroundEffects();
        this.bindEvents();
    },

    show(el) {
        document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
        el.classList.remove('hidden');
    },

    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.show(this.elements.popup));
        
        this.elements.yesBtn.addEventListener('click', () => this.handlePopupYes());
        this.elements.noBtn.addEventListener('click', () => this.handlePopupNo());

        document.querySelector('.envelope').addEventListener('click', (e) => {
            if (!e.currentTarget.classList.contains('open')) {
                e.currentTarget.classList.add('open');
                this.startTypewriter();
            }
        });

        document.querySelectorAll('.memory').forEach((btn, i) => {
            btn.addEventListener('click', () => alert(this.state.memories[i]));
        });

        document.getElementById('forgiveBtn').addEventListener('click', () => this.showFinal());
        document.getElementById('thinkBtn').addEventListener('mouseover', (e) => this.moveButton(e.target));
        document.getElementById('replayBtn').addEventListener('click', () => location.reload());
    },

    handlePopupYes() {
        if (this.state.popupIndex < 4) {
            this.state.popupIndex++;
            this.updatePopup();
        } else {
            this.show(this.elements.broken);
            setTimeout(() => this.show(this.elements.repair), 2500);
            setTimeout(() => this.show(this.elements.loading) || this.startLoading(), 5000);
        }
    },

    updatePopup() {
        const data = [
            {t: "Hey Nusrat ❤️", txt: "Can I borrow just two minutes of your time?"},
            {t: "Please 🥺", txt: "Promise you won't close this before reading everything?"},
            {t: "One Small Request ❤️", txt: "Will you hear me out until the end?"},
            {t: "From My Heart...", txt: "Can I tell you how sorry I really am?"},
            {t: "Almost There...", txt: "Will you stay with me for just one more minute?"}
        ];
        this.elements.popupTitle.innerText = data[this.state.popupIndex].t;
        this.elements.popupText.innerText = data[this.state.popupIndex].txt;
    },

    handlePopupNo() {
        this.elements.macWindow.classList.add('shake');
        setTimeout(() => this.elements.macWindow.classList.remove('shake'), 500);
        this.elements.popupTitle.innerText = this.state.funnyMessages[Math.floor(Math.random() * this.state.funnyMessages.length)];
        this.state.yesBtnScale += 0.1;
        this.elements.yesBtn.style.transform = `scale(${this.state.yesBtnScale})`;
    },

    moveButton(btn) {
        btn.style.position = 'fixed';
        btn.style.top = Math.random() * 80 + 'vh';
        btn.style.left = Math.random() * 80 + 'vw';
    },

    startLoading() {
        const msgs = ["Collecting courage...", "Fixing broken memories...", "Holding my breath...", "Writing every apology...", "Packing endless love...", "Almost ready..."];
        let p = 0;
        const interval = setInterval(() => {
            p += 1;
            this.elements.progressBar.style.width = p + '%';
            this.elements.progressText.innerText = p + '%';
            if (p % 17 === 0) document.querySelector('#loadingSection h2').innerText = msgs[Math.floor(p/17)];
            if (p >= 100) {
                clearInterval(interval);
                this.show(this.elements.envelope);
            }
        }, 50);
    },

    startTypewriter() {
        const txt = "Dear Nusrat,\n\nI know I made mistakes.\nMaybe I hurt you more than I ever wanted.\n\nIf I could go back, I would change every moment that caused you pain.\n\nI cannot change the past.\nBut I can promise to become a better person.\n\nThank you for every smile, every memory, every little moment.\n\nYou are truly special to me.\nI'm sincerely sorry.\n\n❤️";
        this.elements.letterText.innerHTML = `<p class="typewriter">${txt.replace(/\n/g, '<br>')}</p>`;
        setTimeout(() => {
            this.show(this.elements.promise);
            setTimeout(() => this.show(this.elements.memory), 6000);
            setTimeout(() => this.show(this.elements.final), 14000);
        }, 7000);
    },

    showFinal() {
        this.show(this.elements.ending);
        document.body.classList.add('sunrise');
    },

    setupBackgroundEffects() {
        setInterval(() => {
            const r = document.createElement('div');
            r.className = 'raindrop';
            r.style.left = Math.random() * 100 + 'vw';
            r.style.animationDuration = Math.random() * 1 + 0.5 + 's';
            this.elements.rain.appendChild(r);
            setTimeout(() => r.remove(), 1000);
        }, 100);

        document.addEventListener('mousemove', (e) => {
            const s = document.createElement('div');
            s.className = 'spark';
            s.style.left = e.pageX + 'px';
            s.style.top = e.pageY + 'px';
            this.elements.sparkles.appendChild(s);
            setTimeout(() => s.remove(), 800);
        });
    }
};

App.init();
