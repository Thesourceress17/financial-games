/* ============================================
   GAME 2: CHART ANALYSIS - קורא המגמות
   ============================================ */

let chartAnalysisState = {
    level: 'easy',
    currentQuestion: 0,
    score: 0,
    correctAnswers: 0,
    questions: [],
    startTime: null
};

const LEVEL_CONFIG = {
    easy: { questionCount: 10, timeLimit: 600 },
    medium: { questionCount: 20, timeLimit: 900 },
    hard: { questionCount: 30, timeLimit: 1200 }
};

// ============================================
// INITIALIZATION
// ============================================

function initChartAnalysis(level = 'easy') {
    console.log(`🎮 מתחיל קורא המגמות - רמה: ${level}`);
    
    chartAnalysisState.level = level;
    chartAnalysisState.currentQuestion = 0;
    chartAnalysisState.score = 0;
    chartAnalysisState.correctAnswers = 0;
    chartAnalysisState.startTime = Date.now();
    
    generateQuestions(level);
    renderQuestion();
}

function generateQuestions(level) {
    const config = LEVEL_CONFIG[level];
    chartAnalysisState.questions = [];
    
    for (let i = 0; i < config.questionCount; i++) {
        chartAnalysisState.questions.push(generateRandomQuestion(i + 1));
    }
}

function generateRandomQuestion(number) {
    const types = ['trend', 'percentage', 'comparison'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    // Generate random data
    const data = Array.from({length: 6}, () => Math.floor(Math.random() * 100) + 50);
    const labels = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני'];
    
    let question, correctAnswer, options;
    
    if (type === 'trend') {
        const trend = data[data.length - 1] > data[0] ? 'עלייה' : 'ירידה';
        question = 'מה המגמה של המניה ברבעון הראשון?';
        correctAnswer = trend;
        options = ['עלייה', 'ירידה', 'יציבות', 'לא ניתן לדעת'];
    } else if (type === 'percentage') {
        const change = ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1);
        question = 'מה אחוז השינוי מתחילת התקופה לסופה?';
        correctAnswer = `${change}%`;
        options = [
            `${change}%`,
            `${(parseFloat(change) + 5).toFixed(1)}%`,
            `${(parseFloat(change) - 5).toFixed(1)}%`,
            `${(parseFloat(change) * 2).toFixed(1)}%`
        ];
    } else {
        question = 'באיזה חודש המחיר היה הגבוה ביותר?';
        const maxIndex = data.indexOf(Math.max(...data));
        correctAnswer = labels[maxIndex];
        options = labels.slice(0, 4);
    }
    
    return {
        number,
        type,
        data,
        labels,
        question,
        correctAnswer,
        options: options.sort(() => Math.random() - 0.5)
    };
}

// ============================================
// RENDER
// ============================================

function renderQuestion() {
    const gameContent = document.getElementById('game-content');
    const question = chartAnalysisState.questions[chartAnalysisState.currentQuestion];
    
    if (!question) {
        endChartAnalysis();
        return;
    }
    
    gameContent.innerHTML = `
        <div class="game-stats-bar">
            <div class="stat-box">
                <span class="stat-label">שאלה</span>
                <span class="stat-value">${chartAnalysisState.currentQuestion + 1}/${chartAnalysisState.questions.length}</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">נכונות</span>
                <span class="stat-value">${chartAnalysisState.correctAnswers}</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">ציון</span>
                <span class="stat-value">${chartAnalysisState.score}</span>
            </div>
        </div>
        
        <div class="question-container">
            <div class="question-header">
                <div class="question-number">שאלה ${question.number}</div>
                <div class="question-score">+10 נקודות</div>
            </div>
            <div class="question-body">
                <div class="question-chart">
                    <canvas id="question-chart-${question.number}"></canvas>
                </div>
                <div class="question-text">${question.question}</div>
                <div class="answer-options" id="answer-options">
                    ${question.options.map((option, index) => `
                        <button class="answer-option" data-answer="${option}">
                            ${String.fromCharCode(65 + index)}. ${option}
                        </button>
                    `).join('')}
                </div>
                <div id="explanation" style="display: none;"></div>
            </div>
        </div>
        
        <div class="game-actions">
            <button id="next-question-btn" class="btn-primary" style="display: none;">
                <span>שאלה הבאה</span>
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>
    `;
    
    // Render chart
    renderQuestionChart(question);
    
    // Add event listeners
    document.querySelectorAll('.answer-option').forEach(btn => {
        btn.addEventListener('click', (e) => handleAnswer(e, question));
    });
    
    document.getElementById('next-question-btn')?.addEventListener('click', () => {
        chartAnalysisState.currentQuestion++;
        renderQuestion();
    });
}

function renderQuestionChart(question) {
    const ctx = document.getElementById(`question-chart-${question.number}`);
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: question.labels,
            datasets: [{
                label: 'מחיר המניה',
                data: question.data,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function handleAnswer(event, question) {
    const selectedAnswer = event.target.getAttribute('data-answer');
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    // Disable all buttons
    document.querySelectorAll('.answer-option').forEach(btn => {
        btn.disabled = true;
        if (btn.getAttribute('data-answer') === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (btn === event.target && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Update score
    if (isCorrect) {
        chartAnalysisState.score += 10;
        chartAnalysisState.correctAnswers++;
    }
    
    // Show explanation
    const explanation = document.getElementById('explanation');
    explanation.style.display = 'block';
    explanation.className = `answer-explanation ${isCorrect ? '' : 'wrong'}`;
    explanation.innerHTML = `
        <strong>${isCorrect ? '✓ נכון!' : '✗ לא נכון'}</strong>
        <p>התשובה הנכונה היא: ${question.correctAnswer}</p>
    `;
    
    // Show next button
    document.getElementById('next-question-btn').style.display = 'inline-flex';
}

function endChartAnalysis() {
    const duration = Math.round((Date.now() - chartAnalysisState.startTime) / 1000);
    const percentage = (chartAnalysisState.correctAnswers / chartAnalysisState.questions.length) * 100;
    
    const gameContent = document.getElementById('game-content');
    gameContent.innerHTML = `
        <div class="completion-screen">
            <div class="completion-icon">
                <i class="fas fa-chart-bar"></i>
            </div>
            <h2 class="completion-title">כל הכבוד!</h2>
            <p class="completion-message">סיימתם את משחק ניתוח הגרפים</p>
            
            <div class="completion-stats">
                <div class="completion-stat">
                    <span class="label">תשובות נכונות</span>
                    <span class="value">${chartAnalysisState.correctAnswers}/${chartAnalysisState.questions.length}</span>
                </div>
                <div class="completion-stat">
                    <span class="label">אחוז הצלחה</span>
                    <span class="value">${percentage.toFixed(0)}%</span>
                </div>
                <div class="completion-stat">
                    <span class="label">ציון</span>
                    <span class="value">${chartAnalysisState.score}</span>
                </div>
            </div>
            
            <div class="game-actions">
                <button onclick="initChartAnalysis('${chartAnalysisState.level}')" class="btn-primary">
                    <i class="fas fa-redo"></i> שחק שוב
                </button>
                <button onclick="showScreen('dashboard-screen')" class="btn-secondary">
                    <i class="fas fa-home"></i> חזרה לדשבורד
                </button>
            </div>
        </div>
    `;
    
    // Send to sheets
    if (typeof completeGame === 'function') {
        completeGame('קורא המגמות', chartAnalysisState.level, chartAnalysisState.score, duration);
    }
}

window.initChartAnalysis = initChartAnalysis;
console.log('✅ game2-chart-analysis.js נטען בהצלחה!');
