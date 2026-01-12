/* ============================================
   DASHBOARD.JS - לוגיקת דשבורד
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 מאתחל דשבורד');
});

// ============================================
// DASHBOARD FUNCTIONS
// ============================================

function updateDashboardStats() {
    const completedGames = window.app ? window.app.getCompletedGames() : [];
    const totalScore = window.app ? window.app.getTotalScore() : 0;
    
    const completedDisplay = document.getElementById('completed-games');
    const scoreDisplay = document.getElementById('total-score');
    
    if (completedDisplay) {
        completedDisplay.textContent = `${completedGames.length}/5`;
    }
    
    if (scoreDisplay) {
        scoreDisplay.textContent = totalScore;
    }
}

function highlightCompletedGames() {
    const completedGames = window.app ? window.app.getCompletedGames() : [];
    
    completedGames.forEach(game => {
        const gameCard = document.querySelector(`.game-card[data-game="${game.name}"]`);
        if (gameCard) {
            // Mark completed levels
            const levelStars = gameCard.querySelectorAll('.level-star');
            const levels = ['easy', 'medium', 'hard'];
            
            levels.forEach((level, index) => {
                if (game.completedLevels && game.completedLevels.includes(level)) {
                    levelStars[index]?.classList.add('completed');
                }
            });
        }
    });
}

console.log('✅ dashboard.js נטען בהצלחה!');
