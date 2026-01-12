/* ============================================
   GAME 4: PORTFOLIO BATTLE - מלחמת התיקים
   ============================================ */

let battleState = {
    level: 'easy',
    teams: [],
    currentRound: 0,
    totalRounds: 5,
    startTime: null
};

function initPortfolioBattle(level = 'easy') {
    console.log(`🎮 מתחיל מלחמת התיקים - רמה: ${level}`);
    
    const config = {
        easy: { teams: 3, budget: 50000, rounds: 5 },
        medium: { teams: 4, budget: 100000, rounds: 10 },
        hard: { teams: 5, budget: 200000, rounds: 15 }
    };
    
    const gameConfig = config[level];
    
    battleState.level = level;
    battleState.currentRound = 0;
    battleState.totalRounds = gameConfig.rounds;
    battleState.startTime = Date.now();
    battleState.teams = [];
    
    // Initialize teams
    for (let i = 0; i < gameConfig.teams; i++) {
        battleState.teams.push({
            name: `קבוצה ${i + 1}`,
            cash: gameConfig.budget,
            portfolio: gameConfig.budget,
            history: [gameConfig.budget]
        });
    }
    
    renderBattle();
}

function renderBattle() {
    const gameContent = document.getElementById('game-content');
    
    if (battleState.currentRound >= battleState.totalRounds) {
        endBattle();
        return;
    }
    
    gameContent.innerHTML = `
        <div class="game-instructions">
            <h3><i class="fas fa-trophy"></i> תחרות קבוצתית</h3>
            <p>כל קבוצה מתחילה עם אותו תקציב. בכל סיבוב תקבלו אירוע שוק וצריכים להחליט: לקנות, למכור, או להחזיק.</p>
        </div>
        
        <div class="game-stats-bar">
            <div class="stat-box">
                <span class="stat-label">סיבוב</span>
                <span class="stat-value">${battleState.currentRound + 1}/${battleState.totalRounds}</span>
            </div>
        </div>
        
        <div class="leaderboard">
            <h3>🏆 לוח התוצאות</h3>
            ${battleState.teams
                .sort((a, b) => b.portfolio - a.portfolio)
                .map((team, index) => `
                    <div class="team-row ${index === 0 ? 'rank-1' : ''}">
                        <div class="team-info">
                            <div class="team-rank">${index + 1}</div>
                            <div class="team-name">${team.name}</div>
                        </div>
                        <div class="team-score">${formatCurrency(team.portfolio)}</div>
                    </div>
                `).join('')}
        </div>
        
        <div class="market-event">
            <h4><i class="fas fa-newspaper"></i> אירוע שוק</h4>
            <p id="market-event-text"></p>
        </div>
        
        <div class="game-actions">
            <button onclick="nextRound()" class="btn-primary btn-large">
                <i class="fas fa-arrow-left"></i> סיבוב הבא
            </button>
        </div>
    `;
    
    // Generate random market event
    const events = [
        'החברות הטכנולוגיות עולות ב-5%!',
        'משבר בשוק - הכל יורד ב-3%',
        'חדשות טובות! השוק עולה ב-8%',
        'העליה נמשכת - +4%',
        'תיקון בשוק - -2%'
    ];
    
    document.getElementById('market-event-text').textContent = 
        events[Math.floor(Math.random() * events.length)];
}

function nextRound() {
    // Simulate market changes
    battleState.teams.forEach(team => {
        const change = (Math.random() - 0.4) * 0.15; // -10% to +5%
        team.portfolio = team.portfolio * (1 + change);
        team.history.push(team.portfolio);
    });
    
    battleState.currentRound++;
    renderBattle();
}

function endBattle() {
    const duration = Math.round((Date.now() - battleState.startTime) / 1000);
    const winner = battleState.teams.sort((a, b) => b.portfolio - a.portfolio)[0];
    const gameContent = document.getElementById('game-content');
    
    const score = Math.round(Math.max(0, (winner.portfolio / battleState.teams[0].history[0] - 1) * 500));
    
    gameContent.innerHTML = `
        <div class="completion-screen">
            <div class="completion-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <h2 class="completion-title">המשחק הסתיים!</h2>
            <p class="completion-message">🏆 ${winner.name} זכתה!</p>
            
            <div class="completion-stats">
                <div class="completion-stat">
                    <span class="label">תיק המנצח</span>
                    <span class="value">${formatCurrency(winner.portfolio)}</span>
                </div>
                <div class="completion-stat">
                    <span class="label">ציון</span>
                    <span class="value">${score}</span>
                </div>
            </div>
            
            <div class="game-actions">
                <button onclick="initPortfolioBattle('${battleState.level}')" class="btn-primary">
                    <i class="fas fa-redo"></i> שחק שוב
                </button>
                <button onclick="showScreen('dashboard-screen')" class="btn-secondary">
                    <i class="fas fa-home"></i> חזרה
                </button>
            </div>
        </div>
    `;
    
    if (typeof completeGame === 'function') {
        completeGame('מלחמת התיקים', battleState.level, score, duration);
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('he-IL', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0
    }).format(amount);
}

window.initPortfolioBattle = initPortfolioBattle;
window.nextRound = nextRound;

console.log('✅ game4-portfolio-battle.js נטען בהצלחה!');
