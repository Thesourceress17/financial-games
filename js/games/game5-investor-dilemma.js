/* ============================================
   GAME 5: INVESTOR DILEMMA - דילמות המשקיע
   ============================================ */

let dilemmaState = {
    level: 'easy',
    currentDilemma: 0,
    score: 0,
    choices: [],
    startTime: null
};

const DILEMMAS = {
    easy: [
        {
            text: 'יש לכם 50,000 ₪ להשקעה. מה תעשו?',
            options: [
                { text: '100% במניות הייטק (סיכון גבוה, תשואה פוטנציאלית גבוהה)', risk: 'high', score: 5 },
                { text: '50% מניות, 50% אג"ח (מאוזן)', risk: 'medium', score: 10 },
                { text: '100% בפיקדון בנק (בטוח, תשואה נמוכה)', risk: 'low', score: 7 }
            ]
        },
        {
            text: 'מניה שלכם ירדה ב-30% תוך שבוע. מה תעשו?',
            options: [
                { text: 'מוכר מיד למנוע הפסדים נוספים', risk: 'low', score: 6 },
                { text: 'מחכה לראות אם המחיר יעלה', risk: 'medium', score: 10 },
                { text: 'קונה עוד במחיר הזול ("ממוצע")', risk: 'high', score: 8 }
            ]
        },
        {
            text: 'קיבלתם טיפ על מניה "חמה". מה תעשו?',
            options: [
                { text: 'משקיע מיד לפני שכולם יודעים', risk: 'high', score: 3 },
                { text: 'חוקר לפני והחלטה מושכלת', risk: 'medium', score: 10 },
                { text: 'מתעלם - לא סומך על טיפים', risk: 'low', score: 7 }
            ]
        }
    ],
    medium: [
        {
            text: 'יש לכם השקעה שהרוויחה 50% בחצי שנה. מה תעשו?',
            options: [
                { text: 'מוכר ולוקח רווח', risk: 'low', score: 8 },
                { text: 'שומר חצי, מוכר חצי', risk: 'medium', score: 10 },
                { text: 'שומר הכל - יכול להמשיך לעלות', risk: 'high', score: 6 }
            ]
        },
        {
            text: 'התחיל משבר כלכלי. כל השוק יורד. מה תעשו?',
            options: [
                { text: 'מוכר הכל ועובר למזומן', risk: 'low', score: 5 },
                { text: 'שומר והמתין שהשוק יתאושש', risk: 'medium', score: 10 },
                { text: 'קונה עוד - זו הזדמנות!', risk: 'high', score: 8 }
            ]
        }
    ],
    hard: [
        {
            text: 'אתם צריכים כסף בעוד שנה לקניית דירה. איפה תשקיעו?',
            options: [
                { text: 'מניות - אולי ארוויח הרבה', risk: 'high', score: 4 },
                { text: 'אג"ח קצרות טווח', risk: 'medium', score: 10 },
                { text: 'פיקדון - בטוח לחלוטין', risk: 'low', score: 8 }
            ]
        },
        {
            text: 'חברה גדולה הודיעה על רכישה. המניה קפצה 20%. מה תעשו?',
            options: [
                { text: 'מוכר מיד את הרווח', risk: 'low', score: 7 },
                { text: 'בודק אם הרכישה טובה לטווח ארוך', risk: 'medium', score: 10 },
                { text: 'קונה עוד - זה רק ההתחלה', risk: 'high', score: 5 }
            ]
        }
    ]
};

function initInvestorDilemma(level = 'easy') {
    console.log(`🎮 מתחיל דילמות המשקיע - רמה: ${level}`);
    
    dilemmaState = {
        level,
        currentDilemma: 0,
        score: 0,
        choices: [],
        startTime: Date.now()
    };
    
    renderDilemma();
}

function renderDilemma() {
    const dilemmas = DILEMMAS[dilemmaState.level];
    const dilemma = dilemmas[dilemmaState.currentDilemma];
    
    if (!dilemma) {
        endDilemmaGame();
        return;
    }
    
    const gameContent = document.getElementById('game-content');
    
    gameContent.innerHTML = `
        <div class="game-stats-bar">
            <div class="stat-box">
                <span class="stat-label">דילמה</span>
                <span class="stat-value">${dilemmaState.currentDilemma + 1}/${dilemmas.length}</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">ציון</span>
                <span class="stat-value">${dilemmaState.score}</span>
            </div>
        </div>
        
        <div class="dilemma-scenario">
            <h4>דילמה ${dilemmaState.currentDilemma + 1}</h4>
            <div class="dilemma-text">${dilemma.text}</div>
        </div>
        
        <div class="choice-options">
            ${dilemma.options.map((option, index) => `
                <div class="choice-option" onclick="selectChoice(${index})">
                    <div class="choice-header">
                        <div class="choice-letter">${String.fromCharCode(65 + index)}</div>
                        <div class="choice-risk ${option.risk}">${getRiskText(option.risk)}</div>
                    </div>
                    <div class="choice-description">${option.text}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function getRiskText(risk) {
    return { low: 'סיכון נמוך', medium: 'סיכון בינוני', high: 'סיכון גבוה' }[risk];
}

function selectChoice(index) {
    const dilemmas = DILEMMAS[dilemmaState.level];
    const dilemma = dilemmas[dilemmaState.currentDilemma];
    const choice = dilemma.options[index];
    
    dilemmaState.score += choice.score;
    dilemmaState.choices.push({ dilemma: dilemmaState.currentDilemma, choice: index, risk: choice.risk });
    
    // Show feedback
    const feedback = choice.score >= 8 ? 'בחירה מצוינת!' : choice.score >= 6 ? 'בחירה סבירה' : 'יש לשקול שוב';
    
    if (window.app && typeof window.app.showNotification === 'function') {
        window.app.showNotification(`${feedback} (+${choice.score} נקודות)`, 'success');
    }
    
    setTimeout(() => {
        dilemmaState.currentDilemma++;
        renderDilemma();
    }, 1000);
}

function endDilemmaGame() {
    const duration = Math.round((Date.now() - dilemmaState.startTime) / 1000);
    const gameContent = document.getElementById('game-content');
    
    // Calculate investor profile
    const riskProfile = calculateRiskProfile();
    
    gameContent.innerHTML = `
        <div class="completion-screen">
            <div class="completion-icon">
                <i class="fas fa-user-tie"></i>
            </div>
            <h2 class="completion-title">סיימתם!</h2>
            <p class="completion-message">פרופיל המשקיע שלכם: <strong>${riskProfile}</strong></p>
            
            <div class="completion-stats">
                <div class="completion-stat">
                    <span class="label">ציון סופי</span>
                    <span class="value">${dilemmaState.score}</span>
                </div>
                <div class="completion-stat">
                    <span class="label">החלטות</span>
                    <span class="value">${dilemmaState.choices.length}</span>
                </div>
            </div>
            
            <div class="game-actions">
                <button onclick="initInvestorDilemma('${dilemmaState.level}')" class="btn-primary">
                    <i class="fas fa-redo"></i> שחק שוב
                </button>
                <button onclick="showScreen('dashboard-screen')" class="btn-secondary">
                    <i class="fas fa-home"></i> חזרה
                </button>
            </div>
        </div>
    `;
    
    if (typeof completeGame === 'function') {
        completeGame('דילמות המשקיע', dilemmaState.level, dilemmaState.score, duration);
    }
}

function calculateRiskProfile() {
    const risks = dilemmaState.choices.map(c => c.risk);
    const highCount = risks.filter(r => r === 'high').length;
    const lowCount = risks.filter(r => r === 'low').length;
    
    if (highCount > lowCount) return '🔥 משקיע אגרסיבי';
    if (lowCount > highCount) return '🛡️ משקיע שמרן';
    return '⚖️ משקיע מאוזן';
}

window.initInvestorDilemma = initInvestorDilemma;
window.selectChoice = selectChoice;

console.log('✅ game5-investor-dilemma.js נטען בהצלחה!');
