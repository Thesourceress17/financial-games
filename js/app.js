/* ============================================
   APP.JS - קובץ ראשי לניהול האתר
   ============================================ */

// Global variables
let currentStudent = '';
let completedGames = [];
let totalScore = 0;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 אתר משחקי שוק ההון נטען בהצלחה!');
    
    // Hide loading screen after 1 second
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
    }, 1000);
    
    // Load user data from localStorage
    loadUserData();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize navigation
    initializeNavigation();
    
    // Check if user has already logged in
    const savedStudent = localStorage.getItem('studentName');
    if (savedStudent) {
        currentStudent = savedStudent;
        showScreen('dashboard-screen');
        updateUserDisplay();
    } else {
        showScreen('welcome-screen');
    }
});

// ============================================
// EVENT LISTENERS
// ============================================

function initializeEventListeners() {
    // Welcome screen - Start button
    const studentNameInput = document.getElementById('student-name');
    const startBtn = document.getElementById('start-btn');
    
    if (studentNameInput) {
        studentNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                handleStart();
            }
        });
    }
    
    if (startBtn) {
        startBtn.addEventListener('click', handleStart);
    }
    
    // Navigation buttons
    const teacherBtn = document.getElementById('teacher-btn');
    const infoBtn = document.getElementById('info-btn');
    const backToDashboard = document.getElementById('back-to-dashboard');
    const backFromTeacher = document.getElementById('back-from-teacher');
    
    if (teacherBtn) {
        teacherBtn.addEventListener('click', showTeacherLogin);
    }
    
    if (infoBtn) {
        infoBtn.addEventListener('click', showInfoModal);
    }
    
    if (backToDashboard) {
        backToDashboard.addEventListener('click', () => {
            showScreen('dashboard-screen');
            updateUserDisplay();
        });
    }
    
    if (backFromTeacher) {
        backFromTeacher.addEventListener('click', () => {
            showScreen('dashboard-screen');
        });
    }
    
    // Teacher login modal
    const confirmTeacherLogin = document.getElementById('confirm-teacher-login');
    const cancelTeacherLogin = document.getElementById('cancel-teacher-login');
    
    if (confirmTeacherLogin) {
        confirmTeacherLogin.addEventListener('click', handleTeacherLogin);
    }
    
    if (cancelTeacherLogin) {
        cancelTeacherLogin.addEventListener('click', hideTeacherLogin);
    }
    
    // Info modal
    const closeInfoModal = document.getElementById('close-info-modal');
    if (closeInfoModal) {
        closeInfoModal.addEventListener('click', () => {
            document.getElementById('info-modal').classList.remove('active');
        });
    }
    
    // Game cards - Play buttons
    const playButtons = document.querySelectorAll('.btn-play');
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameName = this.getAttribute('data-game');
            startGame(gameName);
        });
    });
    
    // Level selector buttons
    const levelButtons = document.querySelectorAll('.level-btn');
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            levelButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const level = this.getAttribute('data-level');
            const gameName = getCurrentGame();
            if (gameName && window[gameName + 'Game']) {
                window[gameName + 'Game'].changeLevel(level);
            }
        });
    });
}

// ============================================
// WELCOME SCREEN FUNCTIONS
// ============================================

function handleStart() {
    const studentNameInput = document.getElementById('student-name');
    const name = studentNameInput.value.trim();
    
    if (name === '') {
        studentNameInput.classList.add('shake');
        studentNameInput.focus();
        setTimeout(() => {
            studentNameInput.classList.remove('shake');
        }, 500);
        return;
    }
    
    currentStudent = name;
    localStorage.setItem('studentName', name);
    
    // Show dashboard
    showScreen('dashboard-screen');
    updateUserDisplay();
    
    // Log event
    logEvent('student_login', { studentName: name });
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

function initializeNavigation() {
    // Set up any additional navigation logic here
}

// ============================================
// GAME MANAGEMENT
// ============================================

function startGame(gameName) {
    console.log(`🎮 מתחיל משחק: ${gameName}`);
    
    showScreen('game-screen');
    
    // Update game title
    const gameTitle = document.getElementById('current-game-title');
    const gameTitles = {
        'stock-simulator': 'סימולטור בורסה',
        'chart-analysis': 'קורא המגמות',
        'index-puzzles': 'חידות המדד',
        'portfolio-battle': 'מלחמת התיקים',
        'investor-dilemma': 'דילמות המשקיע'
    };
    
    if (gameTitle) {
        gameTitle.textContent = gameTitles[gameName] || gameName;
    }
    
    // Set active level button (default to easy)
    const levelButtons = document.querySelectorAll('.level-btn');
    levelButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-level') === 'easy') {
            btn.classList.add('active');
        }
    });
    
    // Load game content
    loadGameContent(gameName, 'easy');
    
    // Log event
    logEvent('game_start', { gameName: gameName, level: 'easy' });
}

function loadGameContent(gameName, level = 'easy') {
    const gameContent = document.getElementById('game-content');
    
    if (!gameContent) return;
    
    // Clear previous content
    gameContent.innerHTML = '<div class="loading-content"><div class="loading-spinner"></div><h3>טוען משחק...</h3></div>';
    
    // Initialize game based on name
    setTimeout(() => {
        switch(gameName) {
            case 'stock-simulator':
                if (typeof initStockSimulator === 'function') {
                    initStockSimulator(level);
                }
                break;
            case 'chart-analysis':
                if (typeof initChartAnalysis === 'function') {
                    initChartAnalysis(level);
                }
                break;
            case 'index-puzzles':
                if (typeof initIndexPuzzles === 'function') {
                    initIndexPuzzles(level);
                }
                break;
            case 'portfolio-battle':
                if (typeof initPortfolioBattle === 'function') {
                    initPortfolioBattle(level);
                }
                break;
            case 'investor-dilemma':
                if (typeof initInvestorDilemma === 'function') {
                    initInvestorDilemma(level);
                }
                break;
            default:
                gameContent.innerHTML = '<p class="text-center">המשחק בפיתוח...</p>';
        }
    }, 500);
}

function getCurrentGame() {
    const gameTitle = document.getElementById('current-game-title');
    if (!gameTitle) return null;
    
    const titleToGame = {
        'סימולטור בורסה': 'stock-simulator',
        'קורא המגמות': 'chart-analysis',
        'חידות המדד': 'index-puzzles',
        'מלחמת התיקים': 'portfolio-battle',
        'דילמות המשקיע': 'investor-dilemma'
    };
    
    return titleToGame[gameTitle.textContent] || null;
}

// ============================================
// USER DATA MANAGEMENT
// ============================================

function loadUserData() {
    const savedCompleted = localStorage.getItem('completedGames');
    const savedScore = localStorage.getItem('totalScore');
    
    if (savedCompleted) {
        try {
            completedGames = JSON.parse(savedCompleted);
        } catch (e) {
            completedGames = [];
        }
    }
    
    if (savedScore) {
        totalScore = parseInt(savedScore) || 0;
    }
}

function updateUserDisplay() {
    const userNameDisplay = document.getElementById('user-name-display');
    const completedGamesDisplay = document.getElementById('completed-games');
    const totalScoreDisplay = document.getElementById('total-score');
    
    if (userNameDisplay) {
        userNameDisplay.textContent = currentStudent;
    }
    
    if (completedGamesDisplay) {
        completedGamesDisplay.textContent = `${completedGames.length}/5`;
    }
    
    if (totalScoreDisplay) {
        totalScoreDisplay.textContent = totalScore;
    }
    
    // Update completed stars on game cards
    updateGameCards();
}

function updateGameCards() {
    completedGames.forEach(game => {
        const gameCard = document.querySelector(`.game-card[data-game="${game.name}"]`);
        if (gameCard) {
            const levelStars = gameCard.querySelectorAll('.level-star');
            levelStars.forEach((star, index) => {
                const levels = ['easy', 'medium', 'hard'];
                if (game.completedLevels && game.completedLevels.includes(levels[index])) {
                    star.classList.add('completed');
                }
            });
        }
    });
}

function saveGameProgress(gameName, level, score) {
    // Find or create game entry
    let gameEntry = completedGames.find(g => g.name === gameName);
    
    if (!gameEntry) {
        gameEntry = {
            name: gameName,
            completedLevels: [],
            scores: {}
        };
        completedGames.push(gameEntry);
    }
    
    // Update level completion
    if (!gameEntry.completedLevels.includes(level)) {
        gameEntry.completedLevels.push(level);
    }
    
    // Update score
    gameEntry.scores[level] = score;
    
    // Update total score
    totalScore += score;
    
    // Save to localStorage
    localStorage.setItem('completedGames', JSON.stringify(completedGames));
    localStorage.setItem('totalScore', totalScore.toString());
    
    // Update display
    updateUserDisplay();
    
    // Log event
    logEvent('game_complete', {
        gameName: gameName,
        level: level,
        score: score
    });
}

// ============================================
// TEACHER MODAL
// ============================================

function showTeacherLogin() {
    const modal = document.getElementById('teacher-login-modal');
    if (modal) {
        modal.classList.add('active');
        const passwordInput = document.getElementById('teacher-password');
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
}

function hideTeacherLogin() {
    const modal = document.getElementById('teacher-login-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleTeacherLogin() {
    const passwordInput = document.getElementById('teacher-password');
    const password = passwordInput.value;
    
    // Simple password check (in production, use proper authentication)
    if (password === 'teacher123') {
        hideTeacherLogin();
        showScreen('teacher-screen');
        
        // Initialize teacher dashboard
        if (typeof initTeacherDashboard === 'function') {
            initTeacherDashboard();
        }
        
        // Log event
        logEvent('teacher_login', {});
    } else {
        passwordInput.classList.add('shake');
        passwordInput.value = '';
        passwordInput.placeholder = 'סיסמה שגויה, נסו שוב...';
        setTimeout(() => {
            passwordInput.classList.remove('shake');
            passwordInput.placeholder = 'סיסמה';
        }, 1000);
    }
}

// ============================================
// INFO MODAL
// ============================================

function showInfoModal() {
    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function logEvent(eventName, data) {
    const event = {
        timestamp: new Date().toISOString(),
        studentName: currentStudent,
        event: eventName,
        ...data
    };
    
    console.log('📊 Event:', event);
    
    // Store events in localStorage
    let events = localStorage.getItem('events');
    if (!events) {
        events = [];
    } else {
        try {
            events = JSON.parse(events);
        } catch (e) {
            events = [];
        }
    }
    
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
        events = events.slice(-100);
    }
    
    localStorage.setItem('events', JSON.stringify(events));
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatPercentage(value) {
    return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
}

function formatDate(date) {
    return new Intl.DateTimeFormat('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#27AE60' : '#E74C3C'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

// Make functions available globally
window.app = {
    getCurrentStudent: () => currentStudent,
    getCompletedGames: () => completedGames,
    getTotalScore: () => totalScore,
    saveGameProgress: saveGameProgress,
    showNotification: showNotification,
    formatCurrency: formatCurrency,
    formatPercentage: formatPercentage,
    formatDate: formatDate,
    logEvent: logEvent
};

console.log('✅ app.js נטען בהצלחה!');
