/* ============================================================
   script.js — Premium Romantic Interactive Logic
   "When Are We Meeting Again? ❤️"
   ============================================================ */

// ==================== EMAILJS INITIALIZATION ====================
(function initEmailJS() {
    // Ensure emailjs is loaded in HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    if (typeof emailjs !== 'undefined') {
        emailjs.init('4MzxDcPB7ylXjSuo7');
    } else {
        console.warn("EmailJS library not loaded.");
    }
})();

// ==================== DOM REFERENCES ====================
const DOM = {
    screens: document.querySelectorAll('.screen'),
    screenWelcome: document.getElementById('screenWelcome'),
    screenTypewriter: document.getElementById('screenTypewriter'),
    screenQuestion: document.getElementById('screenQuestion'),
    screenDate: document.getElementById('screenDate'),
    screenTime: document.getElementById('screenTime'),
    screenLocation: document.getElementById('screenLocation'),
    screenWant: document.getElementById('screenWant'),
    screenWear: document.getElementById('screenWear'),
    screenNote: document.getElementById('screenNote'),
    screenSummary: document.getElementById('screenSummary'),
    screenSuccess: document.getElementById('screenSuccess'),
    
    btnBegin: document.getElementById('btnBegin'),
    btnContinue: document.getElementById('btnContinue'),
    btnYes: document.getElementById('btnYes'),
    btnNo: document.getElementById('btnNo'),
    
    // Navigation Buttons
    btnDateNext: document.getElementById('btnDateNext'),
    btnDateBack: document.getElementById('btnDateBack'),
    btnTimeNext: document.getElementById('btnTimeNext'),
    btnTimeBack: document.getElementById('btnTimeBack'),
    btnLocationNext: document.getElementById('btnLocationNext'),
    btnLocationBack: document.getElementById('btnLocationBack'),
    btnWantNext: document.getElementById('btnWantNext'),
    btnWantBack: document.getElementById('btnWantBack'),
    btnWearNext: document.getElementById('btnWearNext'),
    btnWearBack: document.getElementById('btnWearBack'),
    btnNoteNext: document.getElementById('btnNoteNext'),
    btnNoteBack: document.getElementById('btnNoteBack'),
    btnEdit: document.getElementById('btnEdit'),
    btnConfirm: document.getElementById('btnConfirm'),
    
    // Question Screen Elements
    questionCard: document.getElementById('questionCard'),
    questionButtonsContainer: document.getElementById('questionButtonsContainer'),
    funnyMessage: document.getElementById('funnyMessage'),
    toastPopup: document.getElementById('toastPopup'),
    
    // Calendar Elements
    calendarGrid: document.getElementById('calendarGrid'),
    calMonthYear: document.getElementById('calMonthYear'),
    calPrev: document.getElementById('calPrev'),
    calNext: document.getElementById('calNext'),
    selectedDateText: document.getElementById('selectedDateText'),
    
    // Options & Inputs
    timeOptions: document.getElementById('timeOptions'),
    customTimeWrapper: document.getElementById('customTimeWrapper'),
    customTimeInput: document.getElementById('customTimeInput'),
    selectedTimeText: document.getElementById('selectedTimeText'),
    
    locationOptions: document.getElementById('locationOptions'),
    customLocationWrapper: document.getElementById('customLocationWrapper'),
    customLocationInput: document.getElementById('customLocationInput'),
    selectedLocationText: document.getElementById('selectedLocationText'),
    
    wantOptions: document.getElementById('wantOptions'),
    customWantWrapper: document.getElementById('customWantWrapper'),
    customWantInput: document.getElementById('customWantInput'),
    selectedWantText: document.getElementById('selectedWantText'),
    
    wearOptions: document.getElementById('wearOptions'),
    customWearWrapper: document.getElementById('customWearWrapper'),
    customWearInput: document.getElementById('customWearInput'),
    selectedWearText: document.getElementById('selectedWearText'),
    
    noteTextarea: document.getElementById('noteTextarea'),
    charCount: document.getElementById('charCount'),
    
    // Summary
    sumDate: document.getElementById('sumDate'),
    sumTime: document.getElementById('sumTime'),
    sumLocation: document.getElementById('sumLocation'),
    sumWant: document.getElementById('sumWant'),
    sumWear: document.getElementById('sumWear'),
    sumNote: document.getElementById('sumNote'),
    
    // Success & Animations
    envelopeAnim: document.getElementById('envelopeAnim'),
    successContent: document.getElementById('successContent'),
    sendingIndicator: document.getElementById('sendingIndicator'),
    successCard: document.getElementById('successCard'),
    cdDays: document.getElementById('cdDays'),
    cdHours: document.getElementById('cdHours'),
    cdMinutes: document.getElementById('cdMinutes'),
    cdSeconds: document.getElementById('cdSeconds'),
    
    // Visual Effects
    fireworksCanvas: document.getElementById('fireworksCanvas'),
    confettiContainer: document.getElementById('confettiContainer'),
    sparkleTrail: document.getElementById('sparkleTrail'),
    floatingHearts: document.getElementById('floatingHearts'),
    rosePetals: document.getElementById('rosePetals'),
};

// ==================== APP STATE ====================
const state = {
    currentScreen: 'welcome',
    meetingDate: null,
    meetingDateFormatted: '',
    meetingTime: '',
    meetingTimeHour: 12,
    meetingTimeMinute: 0,
    meetingLocation: '',
    whatSheWants: '',
    whatToWear: '',
    additionalNote: '',
    noAttempts: 0,
    yesScale: 1,
    typewriterDone: false,
    countdownInterval: null,
    evasiveNoActive: false,
};

// ==================== SCREEN NAVIGATION ====================
function navigateTo(screenName) {
    const currentActive = document.querySelector('.screen.active');
    const targetScreenId = 'screen' + screenName.charAt(0).toUpperCase() + screenName.slice(1);
    const targetScreen = document.getElementById(targetScreenId);

    if (!targetScreen || (currentActive && currentActive.id === targetScreenId)) return;

    if (currentActive) {
        currentActive.classList.add('exiting');
        currentActive.classList.remove('active');
        setTimeout(() => {
            currentActive.classList.remove('exiting');
        }, 400);
    }

    state.currentScreen = screenName;
    
    setTimeout(() => {
        targetScreen.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        handleScreenEntry(screenName);
    }, 200);
}

function handleScreenEntry(screenName) {
    switch (screenName) {
        case 'typewriter': if (!state.typewriterDone) startTypewriterAnimation(); break;
        case 'question': setupEvasiveNoButton(); break;
        case 'date': if (!state.meetingDate) initCalendar(); updateCalendarUI(); break;
        case 'time': updateTimeUI(); break;
        case 'location': updateLocationUI(); break;
        case 'want': updateWantUI(); break;
        case 'wear': updateWearUI(); break;
        case 'note': updateNoteUI(); break;
        case 'summary': updateSummary(); break;
        case 'success': handleSuccessEntry(); break;
    }
}

// ==================== TYPEWRITER ====================
function startTypewriterAnimation() {
    const typedTexts = document.querySelectorAll('.typed-text');
    const cursors = document.querySelectorAll('.cursor-blink');
    
    typedTexts.forEach(el => el.textContent = '');
    cursors.forEach(el => el.classList.remove('done'));
    DOM.btnContinue.style.display = 'none';
    state.typewriterDone = false;
    
    const allTexts = Array.from(typedTexts).map(el => el.getAttribute('data-text') || '');
    let currentLine = 0, currentChar = 0;
    
    function typeNextChar() {
        if (currentLine >= allTexts.length) {
            cursors.forEach(el => el.classList.add('done'));
            DOM.btnContinue.style.display = 'inline-block';
            DOM.btnContinue.style.animation = 'popIn 0.5s ease forwards';
            state.typewriterDone = true;
            return;
        }
        
        const text = allTexts[currentLine];
        const textEl = typedTexts[currentLine];
        
        if (currentChar < text.length) {
            textEl.textContent += text[currentChar];
            currentChar++;
            setTimeout(typeNextChar, Math.random() * 40 + 30);
        } else {
            cursors[currentLine].classList.add('done');
            currentLine++;
            currentChar = 0;
            setTimeout(typeNextChar, 400);
        }
    }
    setTimeout(typeNextChar, 500);
}

// ==================== EVASIVE NO BUTTON ====================
function setupEvasiveNoButton() {
    const container = DOM.questionButtonsContainer;
    const btnNo = DOM.btnNo;
    const btnYes = DOM.btnYes;
    
    state.noAttempts = 0; 
    state.yesScale = 1; 
    state.evasiveNoActive = true;
    
    btnYes.style.transform = 'scale(1)';
    btnNo.classList.add('evasive');
    btnNo.style.position = 'absolute';
    DOM.funnyMessage.textContent = '';
    DOM.funnyMessage.classList.remove('show');
    
    resetNoButtonPosition();
    
    container.addEventListener('mousemove', handleNoMouseMove);
    btnNo.addEventListener('click', handleNoClick);
    btnNo.addEventListener('touchstart', handleNoTouch, { passive: false });
    
    container._cleanupEvasive = () => {
        container.removeEventListener('mousemove', handleNoMouseMove);
        btnNo.removeEventListener('click', handleNoClick);
        btnNo.removeEventListener('touchstart', handleNoTouch);
        state.evasiveNoActive = false;
    };
}

function resetNoButtonPosition() {
    const btnNo = DOM.btnNo;
    const container = DOM.questionButtonsContainer;
    const containerRect = container.getBoundingClientRect();
    const btnYes = DOM.btnYes;
    const yesRect = btnYes.getBoundingClientRect();
    
    const top = yesRect.top - containerRect.top;
    const left = (yesRect.right - containerRect.left) + 20;
    
    btnNo.style.top = `${Math.max(10, Math.min(top, containerRect.height - 60))}px`;
    btnNo.style.left = `${Math.max(10, Math.min(left, containerRect.width - 120))}px`;
}

function moveNoButtonAway() {
    const btnNo = DOM.btnNo;
    const container = DOM.questionButtonsContainer;
    const rect = container.getBoundingClientRect();
    const btnWidth = btnNo.offsetWidth || 100;
    const btnHeight = btnNo.offsetHeight || 50;
    
    const maxX = rect.width - btnWidth - 20;
    const maxY = rect.height - btnHeight - 20;
    
    const curLeft = parseFloat(btnNo.style.left) || 0;
    const curTop = parseFloat(btnNo.style.top) || 0;
    
    let newLeft, newTop;
    let attempts = 0;
    do {
        newLeft = Math.random() * maxX;
        newTop = Math.random() * maxY;
        attempts++;
    } while (Math.abs(newLeft - curLeft) < 50 && Math.abs(newTop - curTop) < 50 && attempts < 10);
    
    btnNo.style.left = `${Math.max(10, newLeft)}px`;
    btnNo.style.top = `${Math.max(10, newTop)}px`;
}

function handleNoMouseMove(e) {
    if (!state.evasiveNoActive) return;
    const btnNo = DOM.btnNo;
    const btnRect = btnNo.getBoundingClientRect();
    const dist = Math.hypot(e.clientX - (btnRect.left + btnRect.width/2), e.clientY - (btnRect.top + btnRect.height/2));
    
    if (dist < 80) { 
        moveNoButtonAway(); 
        recordNoAttempt(); 
    }
}

function handleNoClick(e) {
    if (!state.evasiveNoActive) return;
    e.preventDefault(); 
    e.stopPropagation();
    moveNoButtonAway(); 
    recordNoAttempt();
}

function handleNoTouch(e) {
    if (!state.evasiveNoActive) return;
    e.preventDefault();
    moveNoButtonAway(); 
    recordNoAttempt();
}

function recordNoAttempt() {
    state.noAttempts++;
    const card = DOM.questionCard;
    
    // Trigger shake animation
    card.classList.remove('shake-card'); 
    void card.offsetWidth; 
    card.classList.add('shake-card');
    
    // Scale YES button
    state.yesScale = Math.min(1 + state.noAttempts * 0.1, 2.0);
    DOM.btnYes.style.transform = `scale(${state.yesScale})`;
    DOM.btnYes.style.transition = 'transform 0.3s ease';
    
    // Show random funny message
    const msgs = [
        "No isn't available today 😝",
        "Nice try 😂",
        "Please don't run away 🥺",
        "I'll keep asking ❤️",
        "You almost got me 🤭",
        "If you can catch me 😆",
        "Just press YES ❤️"
    ];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    
    DOM.funnyMessage.textContent = msg;
    DOM.funnyMessage.classList.remove('show'); 
    void DOM.funnyMessage.offsetWidth; 
    DOM.funnyMessage.classList.add('show');
    
    showToast(msg);
}

function showToast(message) {
    const toast = DOM.toastPopup;
    toast.innerHTML = `<div class="toast-inner">${message}</div>`;
    toast.classList.remove('show'); 
    void toast.offsetWidth; 
    toast.classList.add('show');
    
    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==================== CALENDAR ====================
let calendarDate = new Date();
let selectedCalendarDate = null;

function initCalendar() { 
    calendarDate = new Date(); 
    calendarDate.setDate(1); 
    selectedCalendarDate = null; 
    DOM.selectedDateText.textContent = '—'; 
    DOM.btnDateNext.disabled = true; 
    renderCalendar(); 
}

function updateCalendarUI() { 
    if (state.meetingDate) { 
        selectedCalendarDate = new Date(state.meetingDate); 
        calendarDate = new Date(selectedCalendarDate); 
        calendarDate.setDate(1); 
        DOM.selectedDateText.textContent = state.meetingDateFormatted; 
        DOM.btnDateNext.disabled = false; 
    } 
    renderCalendar(); 
}

function renderCalendar() {
    const grid = DOM.calendarGrid;
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    DOM.calMonthYear.textContent = `${monthNames[month]} ${year}`;
    grid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date(); 
    today.setHours(0,0,0,0);
    
    for (let i = 0; i < firstDay; i++) { 
        const empty = document.createElement('div'); 
        empty.classList.add('calendar-day','empty'); 
        grid.appendChild(empty); 
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement('div'); 
        cell.classList.add('calendar-day'); 
        cell.textContent = d;
        
        const cellDate = new Date(year, month, d); 
        cellDate.setHours(0,0,0,0);
        
        if (cellDate < today) {
            cell.classList.add('disabled');
        } else {
            cell.addEventListener('click', () => selectCalendarDate(cellDate, cell));
        }
        
        if (cellDate.getTime() === today.getTime()) cell.classList.add('today');
        if (selectedCalendarDate && cellDate.getTime() === selectedCalendarDate.getTime()) {
            cell.classList.add('selected');
        }
        
        grid.appendChild(cell);
    }
}

function selectCalendarDate(dateObj, cell) {
    document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
    cell.classList.add('selected');
    
    selectedCalendarDate = new Date(dateObj);
    state.meetingDate = new Date(dateObj);
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    state.meetingDateFormatted = dateObj.toLocaleDateString('en-US', options);
    
    DOM.selectedDateText.textContent = state.meetingDateFormatted;
    DOM.btnDateNext.disabled = false;
}

DOM.calPrev.addEventListener('click', () => { 
    calendarDate.setMonth(calendarDate.getMonth() - 1); 
    renderCalendar(); 
});
DOM.calNext.addEventListener('click', () => { 
    calendarDate.setMonth(calendarDate.getMonth() + 1); 
    renderCalendar(); 
});

// ==================== OPTION SELECTION ====================
function setupOptionGrid(grid, customWrap, customInput, displayEl, stateKey, nextBtn) {
    // Clone nodes to easily clear old event listeners
    grid.querySelectorAll('.option-card').forEach(card => card.replaceWith(card.cloneNode(true)));
    const cards = grid.querySelectorAll('.option-card');
    
    cards.forEach(card => {
        // Restore active state visually based on state
        const val = card.getAttribute('data-value');
        if (state[stateKey] === val || (val === 'Custom' && state[stateKey] && !Array.from(cards).some(c => c.getAttribute('data-value') === state[stateKey] && state[stateKey] !== 'Custom'))) {
             card.classList.add('selected');
             if(val === 'Custom') customWrap.style.display = 'block';
        }

        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            if (val === 'Custom') {
                customWrap.style.display = 'block';
                customInput.value = state[stateKey] && Array.from(cards).every(c => c.getAttribute('data-value') !== state[stateKey]) ? state[stateKey] : '';
                customInput.focus();
                displayEl.textContent = customInput.value || '—';
                if (nextBtn) nextBtn.disabled = !(customInput.value && customInput.value.trim());
            } else {
                customWrap.style.display = 'none';
                state[stateKey] = val;
                displayEl.textContent = val;
                
                // Parse specific time logic if time option
                if (stateKey === 'meetingTime') {
                    const h = card.getAttribute('data-hour');
                    const m = card.getAttribute('data-minute');
                    if (h !== null && m !== null) {
                        state.meetingTimeHour = parseInt(h);
                        state.meetingTimeMinute = parseInt(m);
                    }
                }
                
                if (nextBtn) nextBtn.disabled = false;
            }
        });
    });
    
    if (customInput) {
        customInput.addEventListener('input', () => {
            state[stateKey] = customInput.value;
            displayEl.textContent = customInput.value || '—';
            
            if (stateKey === 'meetingTime' && customInput.type === 'time' && customInput.value) {
                const [h, m] = customInput.value.split(':');
                state.meetingTimeHour = parseInt(h);
                state.meetingTimeMinute = parseInt(m);
                // Convert 24hr to 12hr for display
                const ampm = state.meetingTimeHour >= 12 ? 'PM' : 'AM';
                let displayH = state.meetingTimeHour % 12;
                displayH = displayH ? displayH : 12; 
                displayEl.textContent = `${displayH}:${m.padStart(2, '0')} ${ampm}`;
                state.meetingTime = displayEl.textContent;
            }

            if (nextBtn) nextBtn.disabled = !(customInput.value && customInput.value.trim());
        });
    }
}

function updateTimeUI() {
    setupOptionGrid(DOM.timeOptions, DOM.customTimeWrapper, DOM.customTimeInput, DOM.selectedTimeText, 'meetingTime', DOM.btnTimeNext);
    if (state.meetingTime) { 
        DOM.selectedTimeText.textContent = state.meetingTime; 
        DOM.btnTimeNext.disabled = false; 
    }
}

function updateLocationUI() { 
    setupOptionGrid(DOM.locationOptions, DOM.customLocationWrapper, DOM.customLocationInput, DOM.selectedLocationText, 'meetingLocation', DOM.btnLocationNext); 
    if(state.meetingLocation) {
        DOM.selectedLocationText.textContent = state.meetingLocation;
        DOM.btnLocationNext.disabled = false;
    } 
}

function updateWantUI() { 
    setupOptionGrid(DOM.wantOptions, DOM.customWantWrapper, DOM.customWantInput, DOM.selectedWantText, 'whatSheWants', DOM.btnWantNext); 
    if(state.whatSheWants) {
        DOM.selectedWantText.textContent = state.whatSheWants;
        DOM.btnWantNext.disabled = false;
    } 
}

function updateWearUI() { 
    setupOptionGrid(DOM.wearOptions, DOM.customWearWrapper, DOM.customWearInput, DOM.selectedWearText, 'whatToWear', DOM.btnWearNext); 
    if(state.whatToWear) {
        DOM.selectedWearText.textContent = state.whatToWear;
        DOM.btnWearNext.disabled = false;
    } 
}

function updateNoteUI() { 
    DOM.noteTextarea.value = state.additionalNote || ''; 
    DOM.charCount.textContent = `${(state.additionalNote||'').length} / 500`; 
}

// ==================== NOTE TEXTAREA ====================
DOM.noteTextarea.addEventListener('input', () => {
    let val = DOM.noteTextarea.value;
    if (val.length > 500) {
        val = val.slice(0, 500);
        DOM.noteTextarea.value = val;
    }
    state.additionalNote = val;
    DOM.charCount.textContent = `${val.length} / 500`;
});

// ==================== SUMMARY ====================
function updateSummary() {
    DOM.sumDate.textContent = state.meetingDateFormatted || '—';
    DOM.sumTime.textContent = state.meetingTime || '—';
    DOM.sumLocation.textContent = state.meetingLocation || '—';
    DOM.sumWant.textContent = state.whatSheWants || '—';
    DOM.sumWear.textContent = state.whatToWear || '—';
    DOM.sumNote.textContent = state.additionalNote || '—';
}

// ==================== SUCCESS ENTRY ====================
async function handleSuccessEntry() {
    // Reset UI states
    DOM.envelopeAnim.style.display = 'none';
    DOM.successContent.style.display = 'none';
    DOM.fireworksCanvas.style.display = 'none';
    DOM.confettiContainer.innerHTML = '';

    DOM.sendingIndicator.style.display = 'block';
    DOM.sendingIndicator.innerHTML = '<p style="color:#fff;">Preparing your surprise…</p><div class="spinner"></div>';

    const sendPromise = sendBothEmails().catch(err => {
        console.warn('📧 Email sending failed:', err);
    });

    // Ensure indicator shows for at least 2 seconds
    const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
    await Promise.all([sendPromise, minDelay]);

    DOM.sendingIndicator.style.display = 'none';
    DOM.envelopeAnim.style.display = 'flex';

    // Wait for Envelope/Paper Plane animations (css duration)
    setTimeout(() => {
        DOM.envelopeAnim.style.display = 'none';
        DOM.successContent.style.display = 'block';
        DOM.successContent.style.animation = 'popIn 0.6s ease forwards';
        
        launchConfetti();
        launchFireworks();
        startCountdown();
    }, 3600);
}

// ==================== EMAIL SENDING ====================
function getDeviceInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown', os = 'Unknown', device = 'Desktop';
    
    // Browser
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    
    // OS
    if (ua.includes('Win')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('like Mac')) os = 'iOS';
    
    // Device
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) device = 'Tablet';
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/.test(ua)) device = 'Mobile';
    
    return { browser, os, device };
}

async function sendBothEmails() {
    if (typeof emailjs === 'undefined') return Promise.resolve();

    const devInfo = getDeviceInfo();
    const templateParams = {
        meeting_date: state.meetingDateFormatted || 'Not specified',
        meeting_time: state.meetingTime || 'Not specified',
        meeting_location: state.meetingLocation || 'Not specified',
        what_she_wants: state.whatSheWants || 'Not specified',
        what_to_wear: state.whatToWear || 'Not specified',
        additional_note: state.additionalNote || 'None',
        browser: devInfo.browser,
        os: devInfo.os,
        device: devInfo.device,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        submission_time: new Date().toLocaleString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' }),
        to_email: 'jabedshariar1531@gmail.com',
    };

    try {
        const [adminRes, nusratRes] = await Promise.all([
            emailjs.send('service_v6z6m5g', 'template_b2ng8rb', templateParams),
            emailjs.send('service_v6z6m5g', 'template_6l5qydh', templateParams)
        ]);
        console.log('✅ Emails sent successfully!');
    } catch (error) {
        throw error;
    }
}

// ==================== VISUAL EFFECTS ====================
function launchConfetti() {
    const container = DOM.confettiContainer;
    const colors = ['#e83a6b', '#f78da7', '#f0c27a', '#ff6b8a', '#ffffff', '#ffd1dc'];
    const frag = document.createDocumentFragment();
    
    for (let i = 0; i < 150; i++) {
        const p = document.createElement('div'); 
        p.classList.add('confetti-piece');
        p.style.left = Math.random() * 100 + '%'; 
        p.style.top = -(Math.random() * 20 + 5) + 'px';
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.width = (Math.random() * 10 + 6) + 'px'; 
        p.style.height = (Math.random() * 14 + 6) + 'px';
        p.style.animationDuration = (Math.random() * 3 + 3) + 's'; 
        p.style.animationDelay = Math.random() * 2 + 's';
        p.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
        frag.appendChild(p);
    }
    container.appendChild(frag);
    setTimeout(() => container.innerHTML = '', 6000);
}

function launchFireworks() {
    const canvas = DOM.fireworksCanvas; 
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d'); 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#e83a6b', '#f78da7', '#f0c27a', '#ff6b8a', '#ffffff', '#ffd1dc'];
    
    class Particle {
        constructor(x, y, c, vx, vy, life) {
            this.x = x; this.y = y; this.color = c; 
            this.vx = vx; this.vy = vy; 
            this.life = life; this.maxLife = life; 
            this.size = Math.random() * 3 + 2;
        }
        update() {
            this.x += this.vx; this.y += this.vy; 
            this.vy += 0.05; // gravity
            this.life--; 
            this.vx *= 0.98; // friction
        }
        draw(ctx) {
            const a = Math.max(0, this.life / this.maxLife);
            ctx.beginPath(); 
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color; 
            ctx.globalAlpha = a; 
            ctx.fill(); 
            ctx.globalAlpha = 1;
        }
        get alive() { return this.life > 0; }
    }
    
    function burst(x, y) {
        const c = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 80; i++) {
            const ang = Math.random() * Math.PI * 2;
            const sp = Math.random() * 6 + 2;
            particles.push(new Particle(x, y, c, Math.cos(ang) * sp, Math.sin(ang) * sp - 2, 40 + Math.floor(Math.random() * 40)));
        }
    }
    
    for (let i = 0; i < 6; i++) {
        setTimeout(() => burst(
            Math.random() * canvas.width * 0.8 + canvas.width * 0.1, 
            Math.random() * canvas.height * 0.5 + canvas.height * 0.1
        ), i * 600);
    }
    
    function anim() {
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (!particles[i].alive) particles.splice(i, 1);
        }
        
        if (particles.length > 0) {
            requestAnimationFrame(anim);
        } else {
            canvas.style.display = 'none'; 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    anim(); 
}

function startCountdown() {
    if (state.countdownInterval) clearInterval(state.countdownInterval);
    
    let target = state.meetingDate ? new Date(state.meetingDate) : new Date(Date.now() + 3 * 86400000);
    target.setHours(state.meetingTimeHour ?? 12, state.meetingTimeMinute ?? 0, 0, 0);
    
    const update = () => {
        const diff = target - new Date();
        if (diff <= 0) {
            DOM.cdDays.textContent = '00';
            DOM.cdHours.textContent = '00';
            DOM.cdMinutes.textContent = '00';
            DOM.cdSeconds.textContent = '00';
            clearInterval(state.countdownInterval);
            return;
        }
        DOM.cdDays.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
        DOM.cdHours.textContent = String(Math.floor((diff / 3600000) % 24)).padStart(2, '0');
        DOM.cdMinutes.textContent = String(Math.floor((diff / 60000) % 60)).padStart(2, '0');
        DOM.cdSeconds.textContent = String(Math.floor((diff / 1000) % 60)).padStart(2, '0');
    };
    
    update(); 
    state.countdownInterval = setInterval(update, 1000);
}

// ==================== BACKGROUND EFFECTS ====================
function createFloatingHearts() {
    const c = DOM.floatingHearts;
    if (!c) return;
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];
    hearts.forEach(() => {
        const h = document.createElement('span');
        h.classList.add('floating-heart');
        h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        h.style.left = Math.random() * 95 + '%';
        h.style.fontSize = (Math.random() * 1.8 + 0.8) + 'rem';
        h.style.animationDuration = (Math.random() * 12 + 10) + 's';
        h.style.animationDelay = Math.random() * 10 + 's';
        c.appendChild(h);
    });
}

function createRosePetals() {
    const c = DOM.rosePetals;
    if (!c) return;
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.classList.add('rose-petal');
        p.style.left = Math.random() * 95 + '%';
        p.style.width = (Math.random() * 16 + 10) + 'px';
        p.style.height = (Math.random() * 16 + 10) + 'px';
        p.style.animationDuration = (Math.random() * 10 + 8) + 's';
        p.style.animationDelay = Math.random() * 12 + 's';
        c.appendChild(p);
    }
}

function setupSparkleCursor() {
    if (!DOM.sparkleTrail) return;
    let last = 0;
    document.addEventListener('mousemove', e => {
        const now = Date.now();
        if (now - last < 50) return;
        last = now;
        
        const p = document.createElement('div');
        p.classList.add('sparkle-particle');
        p.style.left = e.clientX + 'px';
        p.style.top = e.clientY + 'px';
        p.style.width = p.style.height = (Math.random() * 5 + 3) + 'px';
        DOM.sparkleTrail.appendChild(p);
        
        setTimeout(() => p.remove(), 800);
    });
}

// ==================== EVENT LISTENERS ====================
DOM.btnBegin.addEventListener('click', () => navigateTo('typewriter'));
DOM.btnContinue.addEventListener('click', () => { if (state.typewriterDone) navigateTo('question'); });

DOM.btnYes.addEventListener('click', () => {
    if (DOM.questionButtonsContainer._cleanupEvasive) DOM.questionButtonsContainer._cleanupEvasive();
    state.evasiveNoActive = false;
    navigateTo('date');
});

DOM.btnDateNext.addEventListener('click', () => { if (state.meetingDate) navigateTo('time'); });
DOM.btnDateBack.addEventListener('click', () => navigateTo('question'));

DOM.btnTimeNext.addEventListener('click', () => { if (state.meetingTime) navigateTo('location'); });
DOM.btnTimeBack.addEventListener('click', () => navigateTo('date'));

DOM.btnLocationNext.addEventListener('click', () => { if (state.meetingLocation) navigateTo('want'); });
DOM.btnLocationBack.addEventListener('click', () => navigateTo('time'));

DOM.btnWantNext.addEventListener('click', () => { if (state.whatSheWants) navigateTo('wear'); });
DOM.btnWantBack.addEventListener('click', () => navigateTo('location'));

DOM.btnWearNext.addEventListener('click', () => { if (state.whatToWear) navigateTo('note'); });
DOM.btnWearBack.addEventListener('click', () => navigateTo('want'));

DOM.btnNoteNext.addEventListener('click', () => { 
    state.additionalNote = DOM.noteTextarea.value.trim(); 
    navigateTo('summary'); 
});
DOM.btnNoteBack.addEventListener('click', () => { 
    state.additionalNote = DOM.noteTextarea.value.trim(); 
    navigateTo('wear'); 
});

DOM.btnEdit.addEventListener('click', () => navigateTo('date'));
DOM.btnConfirm.addEventListener('click', () => navigateTo('success'));

// ==================== INIT ====================
function initApp() {
    createFloatingHearts();
    createRosePetals();
    setupSparkleCursor();
    DOM.screenWelcome.classList.add('active');
    state.currentScreen = 'welcome';
}

document.addEventListener('DOMContentLoaded', initApp);
