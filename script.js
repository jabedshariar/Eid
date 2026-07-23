/* ============================================================
   script.js — Premium Romantic Interactive Logic
   "When Are We Meeting Again? ❤️"
   ============================================================ */

// ==================== EMAILJS INITIALIZATION ====================
(function initEmailJS() {
    emailjs.init('4MzxDcPB7ylXjSuo7');
})();

// ==================== DOM REFERENCES ====================
const DOM = {
    // Screens
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

    // Buttons
    btnBegin: document.getElementById('btnBegin'),
    btnContinue: document.getElementById('btnContinue'),
    btnYes: document.getElementById('btnYes'),
    btnNo: document.getElementById('btnNo'),
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

    // Question screen elements
    questionCard: document.getElementById('questionCard'),
    questionButtonsContainer: document.getElementById('questionButtonsContainer'),
    funnyMessage: document.getElementById('funnyMessage'),

    // Calendar
    calendarGrid: document.getElementById('calendarGrid'),
    calMonthYear: document.getElementById('calMonthYear'),
    calPrev: document.getElementById('calPrev'),
    calNext: document.getElementById('calNext'),
    selectedDateText: document.getElementById('selectedDateText'),

    // Time
    timeOptions: document.getElementById('timeOptions'),
    customTimeWrapper: document.getElementById('customTimeWrapper'),
    customTimeInput: document.getElementById('customTimeInput'),
    selectedTimeText: document.getElementById('selectedTimeText'),

    // Location
    locationOptions: document.getElementById('locationOptions'),
    customLocationWrapper: document.getElementById('customLocationWrapper'),
    customLocationInput: document.getElementById('customLocationInput'),
    selectedLocationText: document.getElementById('selectedLocationText'),

    // Want
    wantOptions: document.getElementById('wantOptions'),
    customWantWrapper: document.getElementById('customWantWrapper'),
    customWantInput: document.getElementById('customWantInput'),
    selectedWantText: document.getElementById('selectedWantText'),

    // Wear
    wearOptions: document.getElementById('wearOptions'),
    customWearWrapper: document.getElementById('customWearWrapper'),
    customWearInput: document.getElementById('customWearInput'),
    selectedWearText: document.getElementById('selectedWearText'),

    // Note
    noteTextarea: document.getElementById('noteTextarea'),
    charCount: document.getElementById('charCount'),

    // Summary
    sumDate: document.getElementById('sumDate'),
    sumTime: document.getElementById('sumTime'),
    sumLocation: document.getElementById('sumLocation'),
    sumWant: document.getElementById('sumWant'),
    sumWear: document.getElementById('sumWear'),
    sumNote: document.getElementById('sumNote'),

    // Success
    envelopeAnim: document.getElementById('envelopeAnim'),
    successContent: document.getElementById('successContent'),
    sendingIndicator: document.getElementById('sendingIndicator'),
    successCard: document.getElementById('successCard'),
    cdDays: document.getElementById('cdDays'),
    cdHours: document.getElementById('cdHours'),
    cdMinutes: document.getElementById('cdMinutes'),
    cdSeconds: document.getElementById('cdSeconds'),

    // Canvas & effects
    fireworksCanvas: document.getElementById('fireworksCanvas'),
    confettiContainer: document.getElementById('confettiContainer'),
    toastPopup: document.getElementById('toastPopup'),
    sparkleTrail: document.getElementById('sparkleTrail'),
    floatingHearts: document.getElementById('floatingHearts'),
    rosePetals: document.getElementById('rosePetals'),
};

// ==================== APP STATE ====================
const state = {
    currentScreen: 'welcome',
    meetingDate: null, // Date object
    meetingDateFormatted: '', // e.g., "Saturday, March 15, 2026"
    meetingTime: '', // e.g., "Morning (~9:00 AM)" or custom
    meetingTimeHour: null, // 0-23
    meetingTimeMinute: null, // 0-59
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
    const allScreens = document.querySelectorAll('.screen');
    const currentActive = document.querySelector('.screen.active');

    if (currentActive) {
        const currentId = currentActive.id;
        // Don't re-navigate to same screen
        if (currentId === 'screen' + screenName.charAt(0).toUpperCase() + screenName.slice(1)) return;
        currentActive.classList.add('exiting');
        currentActive.classList.remove('active');
        // Clean up after transition
        setTimeout(() => {
            currentActive.classList.remove('exiting');
        }, 400);
    }

    // Map screen name to element ID
    const screenMap = {
        welcome: DOM.screenWelcome,
        typewriter: DOM.screenTypewriter,
        question: DOM.screenQuestion,
        date: DOM.screenDate,
        time: DOM.screenTime,
        location: DOM.screenLocation,
        want: DOM.screenWant,
        wear: DOM.screenWear,
        note: DOM.screenNote,
        summary: DOM.screenSummary,
        success: DOM.screenSuccess,
    };

    const targetScreen = screenMap[screenName];
    if (!targetScreen) return;

    state.currentScreen = screenName;

    // Small delay for exit animation
    setTimeout(() => {
        targetScreen.classList.add('active');
        targetScreen.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Trigger screen-specific initialization
        handleScreenEntry(screenName);
    }, 200);
}

function handleScreenEntry(screenName) {
    switch (screenName) {
        case 'typewriter':
            if (!state.typewriterDone) startTypewriterAnimation();
            break;
        case 'question':
            setupEvasiveNoButton();
            break;
        case 'date':
            if (!state.meetingDate) initCalendar();
            updateCalendarUI();
            break;
        case 'time':
            updateTimeUI();
            break;
        case 'location':
            updateLocationUI();
            break;
        case 'want':
            updateWantUI();
            break;
        case 'wear':
            updateWearUI();
            break;
        case 'note':
            updateNoteUI();
            break;
        case 'summary':
            updateSummary();
            break;
        case 'success':
            handleSuccessEntry();
            break;
    }
}

// ==================== TYPEWRITER ANIMATION ====================
function startTypewriterAnimation() {
    const lines = document.querySelectorAll('.typewriter-line');
    const typedTexts = document.querySelectorAll('.typed-text');
    const cursors = document.querySelectorAll('.cursor-blink');
    const btnContinue = DOM.btnContinue;

    // Reset
    typedTexts.forEach(el => { el.textContent = ''; });
    cursors.forEach(el => { el.classList.remove('done'); });
    btnContinue.style.display = 'none';
    state.typewriterDone = false;

    const allTexts = Array.from(typedTexts).map(el => el.getAttribute('data-text'));
    let currentLine = 0;
    let currentChar = 0;
    let isTyping = false;

    function typeNextChar() {
        if (currentLine >= allTexts.length) {
            // All done
            cursors.forEach(el => el.classList.add('done'));
            btnContinue.style.display = 'inline-block';
            btnContinue.style.animation = 'popIn 0.5s ease forwards';
            state.typewriterDone = true;
            return;
        }

        const text = allTexts[currentLine];
        const textEl = typedTexts[currentLine];

        if (currentChar < text.length) {
            textEl.textContent += text[currentChar];
            currentChar++;
            const delay = Math.random() * 45 + 25; // natural variation
            setTimeout(typeNextChar, delay);
        } else {
            // Line complete, move to next
            // Hide cursor for this line
            const cursorEl = cursors[currentLine];
            if (cursorEl) cursorEl.classList.add('done');
            currentLine++;
            currentChar = 0;
            setTimeout(typeNextChar, 350);
        }
    }

    setTimeout(typeNextChar, 400);
}

// ==================== EVASIVE NO BUTTON ====================
function setupEvasiveNoButton() {
    const container = DOM.questionButtonsContainer;
    const btnNo = DOM.btnNo;
    const btnYes = DOM.btnYes;
    const questionCard = DOM.questionCard;

    // Reset state
    state.noAttempts = 0;
    state.yesScale = 1;
    state.evasiveNoActive = true;
    btnYes.style.transform = 'scale(1)';
    btnNo.classList.add('evasive');
    btnNo.style.position = 'absolute';
    btnNo.style.top = '';
    btnNo.style.left = '';
    DOM.funnyMessage.textContent = '';
    DOM.funnyMessage.classList.remove('show');

    // Position NO button initially next to YES
    resetNoButtonPosition();

    // Mouse proximity detection on the container
    container.addEventListener('mousemove', handleNoMouseMove);
    // Click handler on NO button
    btnNo.addEventListener('click', handleNoClick);
    // Touch handler for mobile
    btnNo.addEventListener('touchstart', handleNoTouch, { passive: false });

    // Store cleanup function
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

    // Place NO button to the right of YES
    const top = yesRect.top - containerRect.top + (yesRect.height - 50) / 2;
    const left = yesRect.right - containerRect.left + 20;

    btnNo.style.top = Math.max(5, Math.min(top, containerRect.height - 55)) + 'px';
    btnNo.style.left = Math.max(5, Math.min(left, containerRect.width - 130)) + 'px';
}

function moveNoButtonAway() {
    const btnNo = DOM.btnNo;
    const container = DOM.questionButtonsContainer;
    const containerRect = container.getBoundingClientRect();
    const btnWidth = btnNo.offsetWidth || 120;
    const btnHeight = btnNo.offsetHeight || 50;

    const maxX = containerRect.width - btnWidth - 10;
    const maxY = containerRect.height - btnHeight - 10;
    const minX = 10;
    const minY = 10;

    // Random position, ensuring it moves meaningfully
    const currentLeft = parseFloat(btnNo.style.left) || 0;
    const currentTop = parseFloat(btnNo.style.top) || 0;

    let newLeft, newTop;
    do {
        newLeft = Math.random() * (maxX - minX) + minX;
        newTop = Math.random() * (maxY - minY) + minY;
    } while (Math.abs(newLeft - currentLeft) < 40 && Math.abs(newTop - currentTop) < 40 && maxX > 60);

    btnNo.style.left = Math.max(minX, Math.min(newLeft, maxX)) + 'px';
    btnNo.style.top = Math.max(minY, Math.min(newTop, maxY)) + 'px';
}

function handleNoMouseMove(e) {
    if (!state.evasiveNoActive) return;
    const btnNo = DOM.btnNo;
    const container = DOM.questionButtonsContainer;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    // Expand the danger zone around the NO button
    const dangerZone = 90; // px
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dist = Math.sqrt((mouseX - btnCenterX) ** 2 + (mouseY - btnCenterY) ** 2);

    if (dist < dangerZone && state.evasiveNoActive) {
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
    // Shake the card
    const card = DOM.questionCard;
    card.classList.remove('shake-card');
    void card.offsetWidth;
    card.classList.add('shake-card');

    // Enlarge YES button
    state.yesScale = Math.min(1 + state.noAttempts * 0.08, 1.8);
    DOM.btnYes.style.transform = `scale(${state.yesScale})`;

    // Show funny message
    const funnyMessages = [
        "No isn't available today 😝",
        "Nice try 😂",
        "Please don't run away 🥺",
        "I'll keep asking ❤️",
        "You almost got me 🤭",
        "If you can catch me 😆",
        "Just press YES ❤️",
    ];
    const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    DOM.funnyMessage.textContent = msg;
    DOM.funnyMessage.classList.remove('show');
    void DOM.funnyMessage.offsetWidth;
    DOM.funnyMessage.classList.add('show');

    // Show toast
    showToast(msg);
}

// ==================== TOAST ====================
function showToast(message) {
    const toast = DOM.toastPopup;
    toast.innerHTML = `<div class="toast-inner">${message}</div>`;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
    // Auto hide
    clearTimeout(toast._hideTimeout);
    toast._hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ==================== CALENDAR ====================
let calendarDate = new Date(); // Tracks which month/year is displayed
let selectedCalendarDate = null;

function initCalendar() {
    calendarDate = new Date();
    calendarDate.setDate(1); // First of current month
    selectedCalendarDate = null;
    DOM.selectedDateText.textContent = '—';
    DOM.btnDateNext.disabled = true;
    renderCalendar();
}

function updateCalendarUI() {
    renderCalendar();
    if (state.meetingDate) {
        selectedCalendarDate = new Date(state.meetingDate);
        calendarDate = new Date(selectedCalendarDate);
        calendarDate.setDate(1);
        renderCalendar();
        DOM.selectedDateText.textContent = state.meetingDateFormatted;
        DOM.btnDateNext.disabled = false;
    }
}

function renderCalendar() {
    const grid = DOM.calendarGrid;
    const monthYear = DOM.calMonthYear;
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    grid.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'empty');
        grid.appendChild(emptyCell);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.textContent = day;

        const cellDate = new Date(year, month, day);
        cellDate.setHours(0, 0, 0, 0);

        // Disable past dates
        if (cellDate < today) {
            dayCell.classList.add('disabled');
        } else {
            dayCell.addEventListener('click', () => selectCalendarDate(cellDate, dayCell));
        }

        // Today indicator
        if (cellDate.getTime() === today.getTime()) {
            dayCell.classList.add('today');
        }

        // Selected date
        if (selectedCalendarDate &&
            cellDate.getFullYear() === selectedCalendarDate.getFullYear() &&
            cellDate.getMonth() === selectedCalendarDate.getMonth() &&
            cellDate.getDate() === selectedCalendarDate.getDate()) {
            dayCell.classList.add('selected');
        }

        grid.appendChild(dayCell);
    }
}

function selectCalendarDate(dateObj, dayCell) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
    dayCell.classList.add('selected');
    selectedCalendarDate = new Date(dateObj);

    // Format the date nicely
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    state.meetingDate = new Date(dateObj);
    state.meetingDateFormatted = dateObj.toLocaleDateString('en-US', options);
    DOM.selectedDateText.textContent = state.meetingDateFormatted;
    DOM.btnDateNext.disabled = false;
}

// Calendar navigation
DOM.calPrev.addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
});
DOM.calNext.addEventListener('click', () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
});

// ==================== OPTION CARD SELECTION HELPERS ====================
function setupOptionGrid(gridElement, customWrapper, customInput, selectedTextEl, stateKey, nextBtn) {
    // Clear previous selections
    const cards = gridElement.querySelectorAll('.option-card');
    cards.forEach(card => {
        card.classList.remove('selected');
        card.replaceWith(card.cloneNode(true)); // Remove old listeners
    });

    // Re-query after clone
    const freshCards = gridElement.querySelectorAll('.option-card');

    freshCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected from all
            freshCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const value = card.getAttribute('data-value');
            if (value === 'Custom') {
                customWrapper.style.display = 'block';
                customInput.value = state[stateKey] || '';
                customInput.focus();
                selectedTextEl.textContent = state[stateKey] || '—';
                if (nextBtn) nextBtn.disabled = !(state[stateKey] && state[stateKey].trim());
            } else {
                customWrapper.style.display = 'none';
                state[stateKey] = value;
                selectedTextEl.textContent = value;
                if (nextBtn) nextBtn.disabled = false;
            }
        });
    });

    // Custom input handler
    if (customInput) {
        customInput.addEventListener('input', () => {
            state[stateKey] = customInput.value;
            selectedTextEl.textContent = customInput.value || '—';
            if (nextBtn) nextBtn.disabled = !(customInput.value && customInput.value.trim());
        });
    }
}

function updateTimeUI() {
    setupOptionGrid(DOM.timeOptions, DOM.customTimeWrapper, DOM.customTimeInput,
        DOM.selectedTimeText, 'meetingTime', DOM.btnTimeNext);
    if (state.meetingTime) {
        DOM.selectedTimeText.textContent = state.meetingTime;
        DOM.btnTimeNext.disabled = false;
        // Pre-select card
        const cards = DOM.timeOptions.querySelectorAll('.option-card');
        cards.forEach(c => {
            if (c.getAttribute('data-value') === state.meetingTime || c.classList.contains('selected')) {
                // Check if it matches
            }
        });
    }
    // Handle custom time hour/minute
    DOM.customTimeInput.addEventListener('change', () => {
        if (DOM.customTimeInput.value) {
            const [h, m] = DOM.customTimeInput.value.split(':');
            state.meetingTimeHour = parseInt(h);
            state.meetingTimeMinute = parseInt(m);
            state.meetingTime = DOM.customTimeInput.value;
            DOM.selectedTimeText.textContent = state.meetingTime;
            DOM.btnTimeNext.disabled = false;
        }
    });
    // Preset time cards set hour/minute
    const timeCards = DOM.timeOptions.querySelectorAll('.option-card');
    timeCards.forEach(card => {
        card.addEventListener('click', () => {
            const h = card.getAttribute('data-hour');
            const m = card.getAttribute('data-minute');
            if (h !== null && m !== null) {
                state.meetingTimeHour = parseInt(h);
                state.meetingTimeMinute = parseInt(m);
            }
        });
    });
}

function updateLocationUI() {
    setupOptionGrid(DOM.locationOptions, DOM.customLocationWrapper, DOM.customLocationInput,
        DOM.selectedLocationText, 'meetingLocation', DOM.btnLocationNext);
    if (state.meetingLocation) {
        DOM.selectedLocationText.textContent = state.meetingLocation;
        DOM.btnLocationNext.disabled = false;
    }
}

function updateWantUI() {
    setupOptionGrid(DOM.wantOptions, DOM.customWantWrapper, DOM.customWantInput,
        DOM.selectedWantText, 'whatSheWants', DOM.btnWantNext);
    if (state.whatSheWants) {
        DOM.selectedWantText.textContent = state.whatSheWants;
        DOM.btnWantNext.disabled = false;
    }
}

function updateWearUI() {
    setupOptionGrid(DOM.wearOptions, DOM.customWearWrapper, DOM.customWearInput,
        DOM.selectedWearText, 'whatToWear', DOM.btnWearNext);
    if (state.whatToWear) {
        DOM.selectedWearText.textContent = state.whatToWear;
        DOM.btnWearNext.disabled = false;
    }
}

function updateNoteUI() {
    DOM.noteTextarea.value = state.additionalNote || '';
    DOM.charCount.textContent = `${(state.additionalNote || '').length} / 500`;
}

// ==================== NOTE TEXTAREA ====================
DOM.noteTextarea.addEventListener('input', () => {
    const val = DOM.noteTextarea.value;
    if (val.length > 500) {
        DOM.noteTextarea.value = val.slice(0, 500);
    }
    state.additionalNote = DOM.noteTextarea.value;
    DOM.charCount.textContent = `${state.additionalNote.length} / 500`;
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
    // Reset success screen
    DOM.envelopeAnim.style.display = 'flex';
    DOM.successContent.style.display = 'none';
    DOM.sendingIndicator.style.display = 'none';
    DOM.fireworksCanvas.style.display = 'none';
    DOM.confettiContainer.innerHTML = '';

    // Show sending indicator briefly, then animate
    DOM.sendingIndicator.style.display = 'block';

    try {
        await sendBothEmails();

        // Hide sending, show envelope animation
        DOM.sendingIndicator.style.display = 'none';
        DOM.envelopeAnim.style.display = 'flex';

        // After envelope + paper plane animation (~3.5s total), show success
        setTimeout(() => {
            DOM.envelopeAnim.style.display = 'none';
            DOM.successContent.style.display = 'block';
            DOM.successContent.style.animation = 'popIn 0.6s ease forwards';
            // Trigger confetti
            launchConfetti();
            // Trigger fireworks on canvas
            launchFireworks();
            // Start countdown
            startCountdown();
        }, 3600);

    } catch (error) {
        console.error('Email sending failed:', error);
        DOM.sendingIndicator.innerHTML =
            '<p style="color:#ff6b6b;">⚠️ Something went wrong. Please try again.</p>';
        // Still show success for demo purposes after delay
        setTimeout(() => {
            DOM.sendingIndicator.style.display = 'none';
            DOM.envelopeAnim.style.display = 'flex';
            setTimeout(() => {
                DOM.envelopeAnim.style.display = 'none';
                DOM.successContent.style.display = 'block';
                launchConfetti();
                launchFireworks();
                startCountdown();
            }, 3600);
        }, 2000);
    }
}

// ==================== EMAIL SENDING ====================
async function sendBothEmails() {
    // Build template parameters
    const templateParams = {
        meeting_date: state.meetingDateFormatted || 'Not specified',
        meeting_time: state.meetingTime || 'Not specified',
        meeting_location: state.meetingLocation || 'Not specified',
        what_she_wants: state.whatSheWants || 'Not specified',
        what_to_wear: state.whatToWear || 'Not specified',
        additional_note: state.additionalNote || 'None',
        browser: navigator.userAgentData?.brands?.[0]?.brand || getBrowserName(),
        os: getOSName(),
        device: getDeviceType(),
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        submission_time: new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }),
        to_email: 'shariarjabed@yahoo.com',
        message: 'Thank you for completing the form! I\'m so excited to meet you! 💖',
    };

    // Send admin notification
    const adminPromise = emailjs.send(
        'service_v6z6m5g',
        'template_b2ng8rb',
        templateParams
    );

    // Send thank you to Nusrat
    const nusratPromise = emailjs.send(
        'service_v6z6m5g',
        'template_6l5qydh',
        templateParams
    );

    await Promise.all([adminPromise, nusratPromise]);
}

function getBrowserName() {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Unknown Browser';
}

function getOSName() {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Unknown OS';
}

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/.test(ua))
        return 'Mobile';
    return 'Desktop';
}

// ==================== CONFETTI ====================
function launchConfetti() {
    const container = DOM.confettiContainer;
    const colors = ['#e83a6b', '#f78da7', '#f0c27a', '#ff6b8a', '#fff', '#ffd1dc',
        '#ff9a9e', '#fecfef', '#ffb6c1', '#ffc3a0', '#ffafbd'
    ];

    const fragment = document.createDocumentFragment();
    const pieceCount = 150;

    for (let i = 0; i < pieceCount; i++) {
        const piece = document.createElement('div');
        piece.classList.add('confetti-piece');
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = -(Math.random() * 20 + 5) + 'px';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 10 + 6) + 'px';
        piece.style.height = (Math.random() * 14 + 6) + 'px';
        piece.style.animationDuration = (Math.random() * 3 + 3) + 's';
        piece.style.animationDelay = Math.random() * 2 + 's';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
        fragment.appendChild(piece);
    }

    container.appendChild(fragment);

    // Clean up confetti after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 6000);
}

// ==================== FIREWORKS ON CANVAS ====================
function launchFireworks() {
    const canvas = DOM.fireworksCanvas;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const bursts = [];
    const colors = ['#e83a6b', '#f78da7', '#f0c27a', '#ff6b8a', '#fff', '#ffd1dc',
        '#ff9a9e', '#fecfef', '#ffb6c1', '#ffc3a0'
    ];

    class Particle {
        constructor(x, y, color, vx, vy, life) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.vx = vx;
            this.vy = vy;
            this.life = life;
            this.maxLife = life;
            this.size = Math.random() * 3 + 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.06; // gravity
            this.life--;
            this.vx *= 0.99;
        }
        draw(ctx) {
            const alpha = this.life / this.maxLife;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb',
                'rgba');
            if (this.color.startsWith('#')) {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = alpha;
            }
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        get alive() { return this.life > 0; }
    }

    function createBurst(x, y) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const count = Math.floor(Math.random() * 50 + 50);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 2;
            const life = Math.floor(Math.random() * 60 + 40);
            particles.push(new Particle(x, y, color, vx, vy, life));
        }
    }

    // Create multiple bursts at timed intervals
    const burstCount = 5;
    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            const x = Math.random() * canvas.width * 0.7 + canvas.width * 0.15;
            const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
            createBurst(x, y);
        }, i * 600);
    }

    // Animation loop
    let animId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw trail effect
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (!particles[i].alive) {
                particles.splice(i, 1);
            }
        }

        if (particles.length > 0) {
            animId = requestAnimationFrame(animate);
        } else {
            canvas.style.display = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();

    // Safety cleanup
    setTimeout(() => {
        cancelAnimationFrame(animId);
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 8000);
}

// ==================== COUNTDOWN TIMER ====================
function startCountdown() {
    // Clear any existing interval
    if (state.countdownInterval) clearInterval(state.countdownInterval);

    // Build target datetime
    let targetDate;
    if (state.meetingDate) {
        targetDate = new Date(state.meetingDate);
        const hour = state.meetingTimeHour !== null ? state.meetingTimeHour : 14;
        const minute = state.meetingTimeMinute !== null ? state.meetingTimeMinute : 0;
        targetDate.setHours(hour, minute, 0, 0);
    } else {
        // Fallback: 3 days from now
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);
        targetDate.setHours(14, 0, 0, 0);
    }

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            DOM.cdDays.textContent = '00';
            DOM.cdHours.textContent = '00';
            DOM.cdMinutes.textContent = '00';
            DOM.cdSeconds.textContent = '00';
            clearInterval(state.countdownInterval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        DOM.cdDays.textContent = String(days).padStart(2, '0');
        DOM.cdHours.textContent = String(hours).padStart(2, '0');
        DOM.cdMinutes.textContent = String(minutes).padStart(2, '0');
        DOM.cdSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    state.countdownInterval = setInterval(updateCountdown, 1000);
}

// ==================== BACKGROUND EFFECTS ====================
function createFloatingHearts() {
    const container = DOM.floatingHearts;
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '🩷', '💓', '♥️'];

    for (let i = 0; i < 18; i++) {
        const heart = document.createElement('span');
        heart.classList.add('floating-heart');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 95 + '%';
        heart.style.fontSize = (Math.random() * 1.8 + 0.8) + 'rem';
        heart.style.animationDuration = (Math.random() * 12 + 10) + 's';
        heart.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(heart);
    }
}

function createRosePetals() {
    const container = DOM.rosePetals;

    for (let i = 0; i < 25; i++) {
        const petal = document.createElement('div');
        petal.classList.add('rose-petal');
        petal.style.left = Math.random() * 95 + '%';
        petal.style.width = (Math.random() * 16 + 10) + 'px';
        petal.style.height = (Math.random() * 16 + 10) + 'px';
        petal.style.animationDuration = (Math.random() * 10 + 8) + 's';
        petal.style.animationDelay = Math.random() * 12 + 's';
        petal.style.opacity = (Math.random() * 0.3 + 0.25);
        container.appendChild(petal);
    }
}

// ==================== SPARKLE CURSOR ====================
function setupSparkleCursor() {
    const trail = DOM.sparkleTrail;
    let lastSparkle = 0;
    const throttleMs = 40;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastSparkle < throttleMs) return;
        lastSparkle = now;

        const particle = document.createElement('div');
        particle.classList.add('sparkle-particle');
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        particle.style.width = (Math.random() * 5 + 3) + 'px';
        particle.style.height = particle.style.width;
        trail.appendChild(particle);

        // Remove after animation
        setTimeout(() => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 800);
    });

    // Clean up old particles periodically
    setInterval(() => {
        const particles = trail.querySelectorAll('.sparkle-particle');
        if (particles.length > 40) {
            for (let i = 0; i < particles.length - 30; i++) {
                if (particles[i].parentNode) particles[i].parentNode.removeChild(particles[i]);
            }
        }
    }, 2000);
}

// ==================== EVENT LISTENERS ====================
// Welcome → Typewriter
DOM.btnBegin.addEventListener('click', () => navigateTo('typewriter'));

// Typewriter → Question
DOM.btnContinue.addEventListener('click', () => {
    if (state.typewriterDone) {
        navigateTo('question');
    }
});

// Question → Date (YES button)
DOM.btnYes.addEventListener('click', () => {
    // Clean up evasive listeners
    if (DOM.questionButtonsContainer._cleanupEvasive) {
        DOM.questionButtonsContainer._cleanupEvasive();
    }
    state.evasiveNoActive = false;
    navigateTo('date');
});

// Date navigation
DOM.btnDateNext.addEventListener('click', () => {
    if (state.meetingDate) navigateTo('time');
});
DOM.btnDateBack.addEventListener('click', () => navigateTo('question'));

// Time navigation
DOM.btnTimeNext.addEventListener('click', () => {
    // Ensure time data is saved
    if (!state.meetingTime) {
        // Check if custom time input has value
        if (DOM.customTimeInput.value) {
            state.meetingTime = DOM.customTimeInput.value;
            const [h, m] = DOM.customTimeInput.value.split(':');
            state.meetingTimeHour = parseInt(h);
            state.meetingTimeMinute = parseInt(m);
        }
    }
    if (state.meetingTime || DOM.customTimeInput.value) {
        if (!state.meetingTime) state.meetingTime = DOM.customTimeInput.value;
        navigateTo('location');
    }
});
DOM.btnTimeBack.addEventListener('click', () => navigateTo('date'));

// Location navigation
DOM.btnLocationNext.addEventListener('click', () => {
    if (state.meetingLocation) navigateTo('want');
});
DOM.btnLocationBack.addEventListener('click', () => navigateTo('time'));

// Want navigation
DOM.btnWantNext.addEventListener('click', () => {
    if (state.whatSheWants) navigateTo('wear');
});
DOM.btnWantBack.addEventListener('click', () => navigateTo('location'));

// Wear navigation
DOM.btnWearNext.addEventListener('click', () => {
    if (state.whatToWear) navigateTo('note');
});
DOM.btnWearBack.addEventListener('click', () => navigateTo('want'));

// Note navigation
DOM.btnNoteNext.addEventListener('click', () => {
    state.additionalNote = DOM.noteTextarea.value;
    navigateTo('summary');
});
DOM.btnNoteBack.addEventListener('click', () => {
    state.additionalNote = DOM.noteTextarea.value;
    navigateTo('wear');
});

// Summary → Edit (go back to date)
DOM.btnEdit.addEventListener('click', () => navigateTo('date'));

// Summary → Confirm → Success
DOM.btnConfirm.addEventListener('click', () => navigateTo('success'));

// ==================== INITIALIZATION ====================
function initApp() {
    createFloatingHearts();
    createRosePetals();
    setupSparkleCursor();

    // Show welcome screen
    DOM.screenWelcome.classList.add('active');
    state.currentScreen = 'welcome';

    // Handle window resize for canvas
    window.addEventListener('resize', () => {
        if (DOM.fireworksCanvas.style.display === 'block') {
            DOM.fireworksCanvas.width = window.innerWidth;
            DOM.fireworksCanvas.height = window.innerHeight;
        }
    });

    // Prevent accidental double-tap zoom on mobile
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            e.target.focus();
        }
    }, { passive: true });

    console.log('💖 When Are We Meeting Again? — Ready!');
    console.log('✨ All systems initialized. Waiting for Nusrat...');
}

// ==================== START THE APP ====================
document.addEventListener('DOMContentLoaded', initApp);
