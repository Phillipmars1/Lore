// Tarot Card Data
const MAJOR_ARCANA = [
    "0 - The Fool", "I - The Magician", "II - The High Priestess", "III - The Empress",
    "IV - The Emperor", "V - The Hierophant", "VI - The Lovers", "VII - The Chariot",
    "VIII - Strength", "IX - The Hermit", "X - Wheel of Fortune", "XI - Justice",
    "XII - The Hanged Man", "XIII - Death", "XIV - Temperance", "XV - The Devil",
    "XVI - The Tower", "XVII - The Star", "XVIII - The Moon", "XIX - The Sun",
    "XX - Judgement", "XXI - The World"
];

const MINOR_RANKS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const SUITS = {
    wands: "Wands",
    cups: "Cups",
    swords: "Swords",
    pentacles: "Pentacles"
};

// Global State
let currentSession = [];
let allSessions = [];

// Initialize App
function initApp() {
    loadFromStorage();
    renderCards();
    updateQuickStats();
}

// Render Card Buttons
function renderCards() {
    // Major Arcana
    const majorContainer = document.getElementById('majorArcana');
    majorContainer.innerHTML = '';
    MAJOR_ARCANA.forEach(card => {
        const button = createCardButton(card, 'Major Arcana');
        majorContainer.appendChild(button);
    });

    // Minor Arcana by Suit
    Object.entries(SUITS).forEach(([suitKey, suitName]) => {
        const suitContainer = document.getElementById(suitKey);
        suitContainer.innerHTML = '';
        MINOR_RANKS.forEach(rank => {
            const cardName = `${rank} of ${suitName}`;
            const button = createCardButton(cardName, 'Minor Arcana', suitName);
            suitContainer.appendChild(button);
        });
    });
}

// Create Card Button
function createCardButton(cardName, category, suit = null) {
    const button = document.createElement('button');
    button.className = 'card-button';
    button.textContent = cardName;
    button.onclick = () => addCardToSession(cardName, category, suit);
    return button;
}

// Add Card to Current Session
function addCardToSession(cardName, category, suit) {
    const reversed = document.getElementById('reversedToggle').checked;

    const cardEntry = {
        name: cardName,
        category: category,
        suit: suit,
        reversed: reversed,
        timestamp: new Date().toISOString(),
        position: currentSession.length + 1
    };

    currentSession.push(cardEntry);
    renderCurrentSession();
    updateQuickStats();

    // Visual feedback
    const toggle = document.getElementById('reversedToggle');
    toggle.checked = false;
}

// Render Current Session
function renderCurrentSession() {
    const container = document.getElementById('sessionCards');

    if (currentSession.length === 0) {
        container.innerHTML = '<div class="empty-state">No cards drawn yet</div>';
        return;
    }

    container.innerHTML = '';
    currentSession.forEach((card, index) => {
        const item = document.createElement('div');
        item.className = `session-card-item ${card.reversed ? 'reversed' : ''}`;

        item.innerHTML = `
            <div>
                <div class="card-name">${card.name}</div>
                <div class="card-meta">${card.reversed ? 'Reversed' : 'Upright'} - Position ${card.position}</div>
            </div>
            <button class="remove-card" onclick="removeCardFromSession(${index})">Remove</button>
        `;

        container.appendChild(item);
    });
}

// Remove Card from Session
function removeCardFromSession(index) {
    currentSession.splice(index, 1);
    // Renumber positions
    currentSession.forEach((card, i) => {
        card.position = i + 1;
    });
    renderCurrentSession();
    updateQuickStats();
}

// Save Current Session
function saveSession() {
    if (currentSession.length === 0) {
        alert('No cards in current reading to save!');
        return;
    }

    const notes = document.getElementById('sessionNotes').value;

    const session = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        cards: [...currentSession],
        notes: notes,
        cardCount: currentSession.length
    };

    allSessions.push(session);
    saveToStorage();

    // Clear current session
    currentSession = [];
    document.getElementById('sessionNotes').value = '';
    renderCurrentSession();
    updateQuickStats();

    alert(`Reading saved! Total readings: ${allSessions.length}`);
}

// Clear Current Session
function clearCurrentSession() {
    if (currentSession.length === 0) {
        return;
    }

    if (confirm('Clear current reading without saving?')) {
        currentSession = [];
        document.getElementById('sessionNotes').value = '';
        renderCurrentSession();
        updateQuickStats();
    }
}

// Generate Unique ID
function generateId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// LocalStorage Functions
function saveToStorage() {
    try {
        localStorage.setItem('tarotSessions', JSON.stringify(allSessions));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
        alert('Failed to save data. Your browser storage might be full.');
    }
}

function loadFromStorage() {
    try {
        const stored = localStorage.getItem('tarotSessions');
        if (stored) {
            allSessions = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
        allSessions = [];
    }
}

// Update Quick Stats
function updateQuickStats() {
    document.getElementById('totalReadings').textContent = allSessions.length;

    const totalCards = allSessions.reduce((sum, session) => sum + session.cardCount, 0);
    document.getElementById('totalCards').textContent = totalCards;

    document.getElementById('currentCards').textContent = currentSession.length;
}

// Show Statistics Modal
function showStats() {
    const modal = document.getElementById('statsModal');
    const content = document.getElementById('statsContent');

    if (allSessions.length === 0) {
        content.innerHTML = '<p class="empty-state">No readings saved yet. Start tracking to see statistics!</p>';
        modal.classList.add('active');
        return;
    }

    const stats = calculateStatistics();
    content.innerHTML = generateStatsHTML(stats);
    modal.classList.add('active');
}

// Calculate Statistics
function calculateStatistics() {
    const cardFrequency = {};
    const reversedCount = {};
    const categoryCount = { 'Major Arcana': 0, 'Minor Arcana': 0 };
    const suitCount = { Wands: 0, Cups: 0, Swords: 0, Pentacles: 0 };

    let totalCards = 0;
    let totalReversed = 0;

    allSessions.forEach(session => {
        session.cards.forEach(card => {
            totalCards++;

            // Card frequency
            cardFrequency[card.name] = (cardFrequency[card.name] || 0) + 1;

            // Reversed tracking
            if (card.reversed) {
                totalReversed++;
                reversedCount[card.name] = (reversedCount[card.name] || 0) + 1;
            }

            // Category count
            categoryCount[card.category]++;

            // Suit count
            if (card.suit) {
                suitCount[card.suit]++;
            }
        });
    });

    // Sort cards by frequency
    const sortedCards = Object.entries(cardFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    // Recent sessions
    const recentSessions = allSessions.slice(-5).reverse();

    return {
        totalSessions: allSessions.length,
        totalCards,
        totalReversed,
        reversedPercentage: ((totalReversed / totalCards) * 100).toFixed(1),
        categoryCount,
        suitCount,
        topCards: sortedCards,
        recentSessions,
        averageCardsPerReading: (totalCards / allSessions.length).toFixed(1)
    };
}

// Generate Statistics HTML
function generateStatsHTML(stats) {
    return `
        <div class="stats-summary">
            <h3>Overall Statistics</h3>
            <div class="stat-item">
                <span class="stat-label">Total Readings:</span>
                <span class="stat-value">${stats.totalSessions}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Cards Drawn:</span>
                <span class="stat-value">${stats.totalCards}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Average Cards/Reading:</span>
                <span class="stat-value">${stats.averageCardsPerReading}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Reversed Cards:</span>
                <span class="stat-value">${stats.totalReversed} (${stats.reversedPercentage}%)</span>
            </div>
        </div>

        <div class="stats-summary">
            <h3>Category Breakdown</h3>
            <div class="stat-item">
                <span class="stat-label">Major Arcana:</span>
                <span class="stat-value">${stats.categoryCount['Major Arcana']}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Minor Arcana:</span>
                <span class="stat-value">${stats.categoryCount['Minor Arcana']}</span>
            </div>
        </div>

        <div class="stats-summary">
            <h3>Suit Distribution</h3>
            <div class="stat-item">
                <span class="stat-label">🔥 Wands:</span>
                <span class="stat-value">${stats.suitCount.Wands}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">💧 Cups:</span>
                <span class="stat-value">${stats.suitCount.Cups}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">⚔️ Swords:</span>
                <span class="stat-value">${stats.suitCount.Swords}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">💰 Pentacles:</span>
                <span class="stat-value">${stats.suitCount.Pentacles}</span>
            </div>
        </div>

        <div class="stats-summary">
            <h3>Top 10 Most Drawn Cards</h3>
            ${stats.topCards.map((([card, count], index) => `
                <div class="stat-item">
                    <span class="stat-label">${index + 1}. ${card}</span>
                    <span class="stat-value">${count}x</span>
                </div>
            `).join(''))}
        </div>

        <div class="stats-summary">
            <h3>Recent Readings</h3>
            ${stats.recentSessions.map(session => `
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 5px;">
                    <div style="font-weight: 600; margin-bottom: 5px;">
                        ${new Date(session.timestamp).toLocaleString()}
                    </div>
                    <div style="font-size: 0.9em; color: #b0b0b0;">
                        ${session.cardCount} cards${session.notes ? ': ' + session.notes : ''}
                    </div>
                    <div style="font-size: 0.85em; color: #98d8c8; margin-top: 5px;">
                        ${session.cards.map(c => c.name + (c.reversed ? ' (R)' : '')).join(', ')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Export Data
function exportData() {
    const modal = document.getElementById('exportModal');
    const textarea = document.getElementById('exportData');

    const exportObject = {
        exportDate: new Date().toISOString(),
        version: "1.0",
        totalSessions: allSessions.length,
        sessions: allSessions
    };

    textarea.value = JSON.stringify(exportObject, null, 2);
    modal.classList.add('active');
}

// Download JSON File
function downloadJSON() {
    const textarea = document.getElementById('exportData');
    const dataStr = textarea.value;
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tarot-readings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Import Data
function importData() {
    const modal = document.getElementById('importModal');
    modal.classList.add('active');
}

// Process Import
function processImport() {
    const textarea = document.getElementById('importData');
    const data = textarea.value.trim();

    if (!data) {
        alert('Please paste JSON data to import.');
        return;
    }

    try {
        const imported = JSON.parse(data);

        if (!imported.sessions || !Array.isArray(imported.sessions)) {
            throw new Error('Invalid data format: missing sessions array');
        }

        if (confirm(`Import ${imported.sessions.length} readings? This will merge with existing data.`)) {
            // Merge sessions (avoid duplicates by ID)
            const existingIds = new Set(allSessions.map(s => s.id));
            const newSessions = imported.sessions.filter(s => !existingIds.has(s.id));

            allSessions.push(...newSessions);
            saveToStorage();
            updateQuickStats();

            alert(`Successfully imported ${newSessions.length} new readings!`);
            closeModal('importModal');
            textarea.value = '';
        }
    } catch (e) {
        alert('Failed to import data. Please check the JSON format.\n\nError: ' + e.message);
    }
}

// Close Modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initApp);
