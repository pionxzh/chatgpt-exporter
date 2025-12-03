// Mystical Tarot Reading Experience
// Main JavaScript logic and animations

class TarotReading {
    constructor() {
        this.currentSpread = 'celtic';
        this.selectedCards = [];
        this.userQuestion = '';
        this.isReversed = () => Math.random() < 0.3; // 30% chance of reversed card

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createStarField();
        this.playAmbientSound();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('begin-button').addEventListener('click', () => {
            this.transitionToScreen('question-screen');
            this.playMysticalChime();
        });

        document.getElementById('shuffle-button').addEventListener('click', () => {
            this.startReading();
        });

        document.getElementById('new-reading-button').addEventListener('click', () => {
            this.resetReading();
        });

        document.getElementById('save-reading-button').addEventListener('click', () => {
            this.saveReading();
        });

        document.getElementById('close-detail').addEventListener('click', () => {
            this.closeCardDetail();
        });

        // Spread selection
        document.querySelectorAll('.spread-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectSpread(e.currentTarget);
            });
        });

        // Question input
        const questionInput = document.getElementById('question-input');
        questionInput.addEventListener('input', (e) => {
            this.userQuestion = e.target.value;
        });
    }

    createStarField() {
        // Create additional animated stars
        const stars = document.querySelector('.stars');
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: white;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random()};
                animation: twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
            `;
            stars.appendChild(star);
        }
    }

    transitionToScreen(screenId) {
        // Fade out current screen
        const currentScreen = document.querySelector('.screen.active');
        currentScreen.style.opacity = '0';
        currentScreen.style.transform = 'scale(0.95)';

        setTimeout(() => {
            currentScreen.classList.remove('active');
            const newScreen = document.getElementById(screenId);
            newScreen.classList.add('active');
            newScreen.style.opacity = '0';
            newScreen.style.transform = 'scale(0.95)';

            setTimeout(() => {
                newScreen.style.opacity = '1';
                newScreen.style.transform = 'scale(1)';
            }, 50);
        }, 300);
    }

    selectSpread(option) {
        document.querySelectorAll('.spread-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        this.currentSpread = option.dataset.spread;
    }

    async startReading() {
        this.transitionToScreen('reading-screen');

        // Update title based on spread
        const spreadConfig = SPREADS[this.currentSpread];
        document.getElementById('reading-title').textContent = spreadConfig.name;

        // Show deck shuffling animation
        await this.shuffleDeck();

        // Generate reading
        this.generateReading();
    }

    async shuffleDeck() {
        const deckContainer = document.getElementById('deck-container');
        const instruction = deckContainer.querySelector('.deck-instruction');

        // Rotate through mystical messages
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            instruction.textContent = MYSTICAL_MESSAGES.shuffling[messageIndex];
            messageIndex = (messageIndex + 1) % MYSTICAL_MESSAGES.shuffling.length;
        }, 2000);

        // Play card shuffle sound
        this.playCardFlip();

        // Wait for shuffle animation
        await this.delay(3000);

        clearInterval(messageInterval);
        instruction.textContent = MYSTICAL_MESSAGES.ready[Math.floor(Math.random() * MYSTICAL_MESSAGES.ready.length)];

        await this.delay(1500);

        // Hide deck
        deckContainer.style.opacity = '0';
        deckContainer.style.transform = 'scale(0.8)';
        await this.delay(500);
        deckContainer.style.display = 'none';
    }

    generateReading() {
        const spreadConfig = SPREADS[this.currentSpread];
        const cardsDisplay = document.getElementById('cards-display');
        cardsDisplay.innerHTML = '';

        // Add spread-specific class
        cardsDisplay.className = 'cards-display';
        if (this.currentSpread === 'celtic') {
            cardsDisplay.classList.add('celtic-cross');
        } else if (this.currentSpread === 'three') {
            cardsDisplay.classList.add('three-card');
        } else {
            cardsDisplay.classList.add('single-card');
        }

        // Select random cards
        this.selectedCards = this.drawCards(spreadConfig.positions.length);

        // Create card elements
        spreadConfig.positions.forEach((position, index) => {
            const card = this.selectedCards[index];
            const cardElement = this.createCardElement(card, position, index);
            cardsDisplay.appendChild(cardElement);
        });

        // Show navigation after cards appear
        setTimeout(() => {
            document.getElementById('reading-navigation').classList.remove('hidden');
        }, 1000 + (spreadConfig.positions.length * 100));
    }

    drawCards(count) {
        const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count).map(card => ({
            ...card,
            reversed: this.isReversed()
        }));
    }

    createCardElement(card, position, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'tarot-card';
        cardDiv.dataset.index = index;

        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';

        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';

        if (card.reversed) {
            cardFront.style.transform = 'rotateY(180deg) rotate(180deg)';
        }

        const cardImage = document.createElement('div');
        cardImage.className = 'card-image';
        cardImage.textContent = card.icon;

        const cardName = document.createElement('div');
        cardName.className = 'card-name';
        cardName.textContent = card.name + (card.reversed ? ' (Reversed)' : '');

        const cardPosition = document.createElement('div');
        cardPosition.className = 'card-position';
        cardPosition.textContent = position.name;

        cardFront.appendChild(cardImage);
        cardFront.appendChild(cardName);
        cardFront.appendChild(cardPosition);

        cardDiv.appendChild(cardBack);
        cardDiv.appendChild(cardFront);

        // Flip card after delay
        setTimeout(() => {
            cardDiv.classList.add('flipped');
            this.playCardFlip();
        }, 500 + (index * 300));

        // Click to view details
        cardDiv.addEventListener('click', () => {
            this.showCardDetail(card, position);
        });

        return cardDiv;
    }

    showCardDetail(card, position) {
        const detail = document.getElementById('card-detail');

        const cardImage = detail.querySelector('.detail-card-image');
        cardImage.textContent = card.icon;
        if (card.reversed) {
            cardImage.style.transform = 'rotate(180deg)';
        } else {
            cardImage.style.transform = 'rotate(0deg)';
        }

        detail.querySelector('.detail-card-name').textContent =
            card.name + (card.reversed ? ' (Reversed)' : '');

        detail.querySelector('.detail-card-position').textContent =
            position.name + ' - ' + position.description;

        const meaningDiv = detail.querySelector('.detail-card-meaning');
        meaningDiv.innerHTML = `
            <h4>Card Meaning</h4>
            <p><strong>Keywords:</strong> ${card.keywords.join(', ')}</p>
            <p>${card.reversed ? card.reversed : card.upright}</p>
        `;

        const interpretationDiv = detail.querySelector('.detail-card-interpretation');
        interpretationDiv.innerHTML = `
            <h4>Interpretation</h4>
            <p>${card.interpretation}</p>
        `;

        detail.classList.remove('hidden');
        this.playMysticalChime();
    }

    closeCardDetail() {
        document.getElementById('card-detail').classList.add('hidden');
    }

    resetReading() {
        // Reset state
        this.selectedCards = [];
        this.userQuestion = '';
        document.getElementById('question-input').value = '';

        // Hide reading navigation
        document.getElementById('reading-navigation').classList.add('hidden');

        // Reset deck
        const deckContainer = document.getElementById('deck-container');
        deckContainer.style.display = 'block';
        deckContainer.style.opacity = '1';
        deckContainer.style.transform = 'scale(1)';

        // Go back to question screen
        this.transitionToScreen('question-screen');
        this.playMysticalChime();
    }

    saveReading() {
        const spreadConfig = SPREADS[this.currentSpread];

        // Create reading text
        let readingText = `=== MYSTICAL TAROT READING ===\n\n`;
        readingText += `Date: ${new Date().toLocaleString()}\n`;
        readingText += `Spread: ${spreadConfig.name}\n`;

        if (this.userQuestion) {
            readingText += `Question: ${this.userQuestion}\n`;
        }

        readingText += `\n${'='.repeat(50)}\n\n`;

        this.selectedCards.forEach((card, index) => {
            const position = spreadConfig.positions[index];
            readingText += `${position.name.toUpperCase()}\n`;
            readingText += `${'-'.repeat(position.name.length)}\n`;
            readingText += `Card: ${card.name}${card.reversed ? ' (Reversed)' : ''}\n`;
            readingText += `Position Meaning: ${position.description}\n`;
            readingText += `Keywords: ${card.keywords.join(', ')}\n`;
            readingText += `Meaning: ${card.reversed ? card.reversed : card.upright}\n`;
            readingText += `Interpretation: ${card.interpretation}\n\n`;
        });

        // Create download
        const blob = new Blob([readingText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tarot-reading-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.playMysticalChime();

        // Show confirmation
        this.showNotification('Your reading has been saved to your downloads');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--royal-purple), var(--emerald));
            border: 2px solid var(--gold);
            border-radius: 15px;
            padding: 30px 50px;
            color: var(--ethereal-white);
            font-size: 1.2rem;
            text-align: center;
            z-index: 2000;
            box-shadow: 0 0 50px var(--mystical-glow);
            animation: fade-in 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // Sound effects
    playAmbientSound() {
        // Ambient sound would play here if we had audio files
        // For now, we'll simulate with the Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create a simple ambient drone
            const createDrone = (frequency) => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.value = frequency;
                gainNode.gain.value = 0.01; // Very quiet

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                return { oscillator, gainNode };
            };

            // Low ambient drone
            const drone = createDrone(110);
            drone.oscillator.start();

            // Store for cleanup
            this.audioContext = audioContext;
            this.ambientDrone = drone;
        } catch (e) {
            // Audio might not be supported or blocked
            console.log('Audio not available');
        }
    }

    playCardFlip() {
        try {
            if (!this.audioContext) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.frequency.value = 440;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            // Silently fail
        }
    }

    playMysticalChime() {
        try {
            if (!this.audioContext) return;

            const frequencies = [523.25, 659.25, 783.99]; // C, E, G chord

            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.frequency.value = freq;
                oscillator.type = 'sine';

                const startTime = this.audioContext.currentTime + (index * 0.1);
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1);

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.start(startTime);
                oscillator.stop(startTime + 1);
            });
        } catch (e) {
            // Silently fail
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the tarot reading experience when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tarotReading = new TarotReading();

    // Add some keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // ESC to close detail panel
        if (e.key === 'Escape') {
            const detail = document.getElementById('card-detail');
            if (!detail.classList.contains('hidden')) {
                tarotReading.closeCardDetail();
            }
        }
    });
});

// Add some mystical cursor effects
document.addEventListener('mousemove', (e) => {
    // Create sparkle effect occasionally
    if (Math.random() < 0.05) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 4px;
            height: 4px;
            background: var(--gold);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 10px var(--mystical-glow);
            animation: sparkle-fade 1s ease-out forwards;
        `;

        document.body.appendChild(sparkle);

        setTimeout(() => {
            document.body.removeChild(sparkle);
        }, 1000);
    }
});

// Add sparkle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle-fade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);
