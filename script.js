// Create snowflakes
function createSnowflakes() {
    const snowflakesContainer = document.getElementById('snowflakes');
    const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❉'];

    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem';
        snowflake.style.opacity = Math.random() * 0.6 + 0.4;
        snowflake.style.animationDuration = (Math.random() * 10 + 5) + 's';
        snowflake.style.animationDelay = (Math.random() * 10) + 's';
        snowflakesContainer.appendChild(snowflake);
    }
}

// Create confetti
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff69b4', '#00a046'];

    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confettiContainer.appendChild(confetti);

            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 30);
    }
}

// Christmas Music - Beautiful music box style with reverb
function playChristmasMusic() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create reverb effect
    const convolver = audioContext.createConvolver();
    const reverbTime = 2;
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * reverbTime;
    const impulse = audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
        }
    }
    convolver.buffer = impulse;

    // Master gain
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.3;

    // Dry/wet mix
    const dryGain = audioContext.createGain();
    const wetGain = audioContext.createGain();
    dryGain.gain.value = 0.6;
    wetGain.gain.value = 0.4;

    convolver.connect(wetGain);
    wetGain.connect(masterGain);
    dryGain.connect(masterGain);
    masterGain.connect(audioContext.destination);

    // Notes frequencies
    const notes = {
        'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
        'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
        'C3': 130.81, 'E3': 164.81, 'G3': 196.00
    };

    // Play a note with music box timbre
    function playNote(noteName, startTime, duration, velocity = 1) {
        const freq = notes[noteName];
        if (!freq) return;

        // Multiple oscillators for richer sound
        const oscillators = [];
        const gains = [];

        // Fundamental + harmonics for bell-like tone
        [1, 2, 3, 4].forEach((harmonic, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.frequency.value = freq * harmonic;
            osc.type = i === 0 ? 'sine' : 'sine';

            // Harmonic volumes decrease
            const harmonicVol = velocity * 0.15 / (harmonic * harmonic);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(harmonicVol, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(dryGain);
            gain.connect(convolver);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.1);
        });
    }

    // Jingle Bells melody with timing
    const tempo = 180; // BPM
    const beat = 60 / tempo;
    let time = audioContext.currentTime + 0.1;

    // Melody: Jingle Bells (first verse)
    const melody = [
        // "Jingle bells, jingle bells"
        ['E5', 1], ['E5', 1], ['E5', 2],
        ['E5', 1], ['E5', 1], ['E5', 2],
        // "Jingle all the way"
        ['E5', 1], ['G5', 1], ['C5', 1.5], ['D5', 0.5], ['E5', 2],
        // Rest
        [null, 1],
        // "Oh what fun"
        ['F5', 1], ['F5', 1], ['F5', 1.5], ['F5', 0.5],
        // "it is to ride"
        ['F5', 1], ['E5', 1], ['E5', 1], ['E5', 0.5], ['E5', 0.5],
        // "in a one-horse open sleigh"
        ['E5', 1], ['D5', 1], ['D5', 1], ['E5', 1], ['D5', 2], ['G5', 2],
    ];

    // Play melody
    melody.forEach(([note, beats]) => {
        if (note) {
            playNote(note, time, beat * beats * 0.9);
        }
        time += beat * beats;
    });

    // Add bass accompaniment
    time = audioContext.currentTime + 0.1;
    const bass = [
        ['C3', 4], ['C3', 4], ['C3', 4], [null, 1],
        ['F4', 4], ['C3', 4], ['G3', 4], ['C3', 4],
    ];

    bass.forEach(([note, beats]) => {
        if (note) {
            playNote(note, time, beat * beats * 0.8, 0.5);
        }
        time += beat * beats;
    });
}

// Envelope interaction
function setupEnvelope() {
    const envelope = document.getElementById('envelope');
    const celebration = document.getElementById('celebration');
    let isOpened = false;

    envelope.addEventListener('click', () => {
        if (isOpened) return;
        isOpened = true;

        // Open envelope
        envelope.classList.add('opened');

        // Play music
        playChristmasMusic();

        // Show celebration after certificates appear
        setTimeout(() => {
            celebration.classList.add('show');
            createConfetti();
        }, 1500);
    });
}

// Add sparkle effect on certificates
function addSparkles() {
    const certificates = document.querySelectorAll('.certificate');

    certificates.forEach(cert => {
        cert.addEventListener('mouseenter', () => {
            cert.style.filter = 'brightness(1.1)';
        });

        cert.addEventListener('mouseleave', () => {
            cert.style.filter = 'brightness(1)';
        });
    });
}

// Screen navigation
function goToScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

// Setup first screen - Christmas tree
function setupTreeScreen() {
    const lightTreeBtn = document.getElementById('lightTreeBtn');
    const tree = document.getElementById('tree');
    const screen1 = document.getElementById('screen1');

    if (!lightTreeBtn || !tree || !screen1) return;

    lightTreeBtn.addEventListener('click', () => {
        // Start transition animation
        screen1.classList.add('transitioning');

        // Play music
        playChristmasMusic();

        // After animation completes, switch to Photo Tree screen
        setTimeout(() => {
            goToScreen('screenPhotoTree');
        }, 1500);
    });
}

// Setup Photo Tree screen navigation
function setupPhotoTreeScreen() {
    const nextBtn = document.getElementById('nextBtn');

    if (!nextBtn) return;

    nextBtn.addEventListener('click', () => {
        goToScreen('screen2');
        createSnowflakes();
    });
}

// Setup Lightbox
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const photoFrames = document.querySelectorAll('.photo-frame');

    if (!lightbox || !lightboxImg || !lightboxClose) return;

    // Open lightbox
    photoFrames.forEach(frame => {
        frame.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling
            const img = frame.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            }
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTreeScreen();
    setupPhotoTreeScreen();
    setupEnvelope();
    addSparkles();
    setupLightbox();
});
