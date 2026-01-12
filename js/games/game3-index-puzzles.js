/* ============================================
   GAME 3: INDEX PUZZLES - חידות המדד
   ============================================ */

let puzzleState = {
    level: 'easy',
    currentPuzzle: 0,
    score: 0,
    puzzles: [],
    startTime: null
};

const PUZZLES = {
    easy: [
        { text: 'מדד תל אביב 35 עמד על 2,000 נקודות. עלה ב-10%. מה הערך הסופי?', answer: 2200 },
        { text: 'קנית מניה ב-100 ₪. עלתה ב-20%. מה המחיר הנוכחי?', answer: 120 },
        { text: 'מניה ירדה מ-80 ₪ ל-60 ₪. מה אחוז הירידה?', answer: 25 },
        { text: 'השקעת 1000 ₪ בריבית פשוטה 5% לשנה. כמה תרוויח אחרי שנה?', answer: 50 },
        { text: 'מניה עלתה מ-50 ₪ ל-75 ₪. מה אחוז העלייה?', answer: 50 },
        { text: 'השקעת 5000 ₪ והרווחת 500 ₪. מה התשואה באחוזים?', answer: 10 },
        { text: 'מדד עלה מ-1000 ל-1100. מה אחוז העלייה?', answer: 10 },
        { text: 'קנית 10 מניות ב-20 ₪ כל אחת. כמה שילמת?', answer: 200 },
        { text: 'מניה ב-150 ₪ ירדה ב-10%. מה המחיר החדש?', answer: 135 },
        { text: 'השקעת 2000 ₪ והפסדת 200 ₪. מה ההפסד באחוזים?', answer: 10 }
    ],
    medium: [
        { text: 'מדד עלה ב-8% ביום ראשון וירד ב-5% ביום שני. מה השינוי הכולל? (עגלו למספר שלם)', answer: 3 },
        { text: 'השקעת 10,000 ₪ בריבית דריבית 5% לשנתיים. כמה יהיה לך? (עגלו למספר שלם)', answer: 11025 },
        { text: 'מניה עלתה ב-20% ואז ירדה ב-20%. מה המחיר אם התחלת מ-100?', answer: 96 },
        { text: 'קנית מניה ב-80 ₪ ומכרת ב-100 ₪. מה הרווח באחוזים?', answer: 25 }
    ],
    hard: [
        { text: 'השקעת 20,000 ₪ בריבית דריבית 6% ל-3 שנים. כמה יהיה לך? (עגלו למספר שלם)', answer: 23820 },
        { text: 'מניה עלתה ב-15%, ירדה ב-10%, ועלתה שוב ב-5%. מחיר התחלתי 200 ₪. מה המחיר הסופי? (עגלו למספר שלם)', answer: 217 }
    ]
};

// ============================================
// INITIALIZATION
// ============================================

function initIndexPuzzles(level = 'easy') {
    console.log(`🎮 מתחיל חידות המדד - רמה: ${level}`);
    
    puzzleState.level = level;
    puzzleState.currentPuzzle = 0;
    puzzleState.score = 0;
    puzzleState.puzzles = [...PUZZLES[level]];
    puzzleState.startTime = Date.now();
    
    renderPuzzle();
}

function renderPuzzle() {
    const gameContent = document.getElementById('game-content');
    const puzzle = puzzleState.puzzles[puzzleState.currentPuzzle];
    
    if (!puzzle) {
        endPuzzleGame();
        return;
    }
    
    gameContent.innerHTML = `
        <div class="game-stats-bar">
            <div class="stat-box">
                <span class="stat-label">חידה</span>
                <span class="stat-value">${puzzleState.currentPuzzle + 1}/${puzzleState.puzzles.length}</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">ציון</span>
                <span class="stat-value">${puzzleState.score}</span>
            </div>
        </div>
        
        <div class="puzzle-card">
            <div class="puzzle-number">חידה ${puzzleState.currentPuzzle + 1}</div>
            <div class="puzzle-text">${puzzle.text}</div>
            
            <div class="puzzle-calculator">
                <div class="calculator-display" id="calc-display">0</div>
                <div class="calculator-buttons">
                    ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','C','+'].map(btn => 
                        `<button class="calc-btn ${['+','-','*','/'].includes(btn) ? 'operator' : ''}" onclick="calcButton('${btn}')">${btn}</button>`
                    ).join('')}
                    <button class="calc-btn equals" onclick="calcEquals()">=</button>
                </div>
            </div>
            
            <div class="puzzle-answer-input">
                <input type="number" id="puzzle-answer" placeholder="הזינו את התשובה" />
                <button class="btn-primary" onclick="checkPuzzleAnswer()">
                    <i class="fas fa-check"></i> בדוק
                </button>
            </div>
            
            <div id="puzzle-feedback"></div>
        </div>
    `;
}

let calcValue = '0';
let calcMemory = 0;
let calcOperator = null;

function calcButton(btn) {
    const display = document.getElementById('calc-display');
    
    if (btn === 'C') {
        calcValue = '0';
        calcMemory = 0;
        calcOperator = null;
    } else if (['+','-','*','/'].includes(btn)) {
        calcMemory = parseFloat(calcValue);
        calcOperator = btn;
        calcValue = '0';
    } else {
        calcValue = calcValue === '0' ? btn : calcValue + btn;
    }
    
    display.textContent = calcValue;
}

function calcEquals() {
    const display = document.getElementById('calc-display');
    
    if (calcOperator) {
        const current = parseFloat(calcValue);
        let result = 0;
        
        switch(calcOperator) {
            case '+': result = calcMemory + current; break;
            case '-': result = calcMemory - current; break;
            case '*': result = calcMemory * current; break;
            case '/': result = calcMemory / current; break;
        }
        
        calcValue = result.toString();
        display.textContent = calcValue;
        calcOperator = null;
    }
}

function checkPuzzleAnswer() {
    const input = document.getElementById('puzzle-answer');
    const userAnswer = parseFloat(input.value);
    const correctAnswer = puzzleState.puzzles[puzzleState.currentPuzzle].answer;
    
    const feedback = document.getElementById('puzzle-feedback');
    
    if (Math.abs(userAnswer - correctAnswer) < 0.01) {
        puzzleState.score += 10;
        feedback.innerHTML = '<div class="answer-explanation"><strong>✓ נכון מצוין!</strong></div>';
        
        setTimeout(() => {
            puzzleState.currentPuzzle++;
            renderPuzzle();
        }, 1500);
    } else {
        feedback.innerHTML = `<div class="answer-explanation wrong"><strong>✗ לא נכון</strong><p>התשובה הנכונה: ${correctAnswer}</p></div>`;
        
        setTimeout(() => {
            puzzleState.currentPuzzle++;
            renderPuzzle();
        }, 2500);
    }
}

function endPuzzleGame() {
    const duration = Math.round((Date.now() - puzzleState.startTime) / 1000);
    const gameContent = document.getElementById('game-content');
    
    gameContent.innerHTML = `
        <div class="completion-screen">
            <div class="completion-icon">
                <i class="fas fa-puzzle-piece"></i>
            </div>
            <h2 class="completion-title">מעולה!</h2>
            <p class="completion-message">סיימתם את חידות המדד</p>
            
            <div class="completion-stats">
                <div class="completion-stat">
                    <span class="label">ציון סופי</span>
                    <span class="value">${puzzleState.score}</span>
                </div>
                <div class="completion-stat">
                    <span class="label">זמן</span>
                    <span class="value">${Math.floor(duration/60)}:${(duration%60).toString().padStart(2,'0')}</span>
                </div>
            </div>
            
            <div class="game-actions">
                <button onclick="initIndexPuzzles('${puzzleState.level}')" class="btn-primary">
                    <i class="fas fa-redo"></i> שחק שוב
                </button>
                <button onclick="showScreen('dashboard-screen')" class="btn-secondary">
                    <i class="fas fa-home"></i> חזרה
                </button>
            </div>
        </div>
    `;
    
    if (typeof completeGame === 'function') {
        completeGame('חידות המדד', puzzleState.level, puzzleState.score, duration);
    }
}

window.initIndexPuzzles = initIndexPuzzles;
window.calcButton = calcButton;
window.calcEquals = calcEquals;
window.checkPuzzleAnswer = checkPuzzleAnswer;

console.log('✅ game3-index-puzzles.js נטען בהצלחה!');
