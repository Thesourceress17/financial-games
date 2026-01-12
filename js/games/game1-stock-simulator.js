/* ============================================
   GAME 1: STOCK SIMULATOR - סימולטור בורסה
   ============================================ */

let stockSimulatorState = {
    level: 'easy',
    budget: 100000,
    portfolio: {},
    cash: 100000,
    stocks: [],
    gameTime: 0,
    gameRunning: false,
    intervalId: null,
    startTime: null,
    transactions: []
};

const LEVEL_CONFIG = {
    easy: {
        stockCount: 5,
        duration: 300, // 5 minutes in seconds
        priceChangeInterval: 10000, // 10 seconds
        maxChange: 0.05 // ±5%
    },
    medium: {
        stockCount: 15,
        duration: 600, // 10 minutes
        priceChangeInterval: 8000, // 8 seconds
        maxChange: 0.08 // ±8%
    },
    hard: {
        stockCount: 30,
        duration: 900, // 15 minutes
        priceChangeInterval: 5000, // 5 seconds
        maxChange: 0.12 // ±12%
    }
};

const STOCK_NAMES = {
    easy: [
        { symbol: 'TECH', name: 'טכנולוגיה בע"מ', sector: 'הייטק', basePrice: 150 },
        { symbol: 'BANK', name: 'בנק לאומי', sector: 'בנקאות', basePrice: 80 },
        { symbol: 'FOOD', name: 'תנובה', sector: 'מזון', basePrice: 120 },
        { symbol: 'ENRG', name: 'חברת חשמל', sector: 'אנרגיה', basePrice: 200 },
        { symbol: 'REAL', name: 'נדל"ן', sector: 'נדל"ן', basePrice: 300 }
    ],
    medium: [
        { symbol: 'TEVA', name: 'טבע', sector: 'פארמה', basePrice: 45 },
        { symbol: 'CHCK', name: 'צ\'ק פוינט', sector: 'הייטק', basePrice: 180 },
        { symbol: 'NICE', name: 'נייס', sector: 'הייטק', basePrice: 220 },
        { symbol: 'DSCT', name: 'דיסקונט', sector: 'בנקאות', basePrice: 60 },
        { symbol: 'MIZR', name: 'מזרחי', sector: 'בנקאות', basePrice: 70 },
        { symbol: 'ELAL', name: 'אל על', sector: 'תחבורה', basePrice: 90 },
        { symbol: 'AZRG', name: 'אזורים', sector: 'קמעונאות', basePrice: 150 },
        { symbol: 'ELEC', name: 'אלביט', sector: 'תעשייה', basePrice: 240 },
        { symbol: 'PRTL', name: 'פרטנר', sector: 'תקשורת', basePrice: 85 },
        { symbol: 'CELL', name: 'סלקום', sector: 'תקשורת', basePrice: 110 },
        { symbol: 'DELEK', name: 'דלק', sector: 'אנרגיה', basePrice: 350 },
        { symbol: 'ILCO', name: 'ישראכרט', sector: 'פיננסים', basePrice: 95 },
        { symbol: 'PHON', name: 'פלאפון', sector: 'תקשורת', basePrice: 100 },
        { symbol: 'SHOF', name: 'שופרסל', sector: 'מזון', basePrice: 130 },
        { symbol: 'AMDX', name: 'אמדוקס', sector: 'הייטק', basePrice: 310 }
    ],
    hard: [] // Will be extended with more stocks
};

// Extend hard level with all stocks plus additional ones
STOCK_NAMES.hard = [
    ...STOCK_NAMES.medium,
    { symbol: 'MELX', name: 'מלאנוקס', sector: 'הייטק', basePrice: 420 },
    { symbol: 'STRX', name: 'סטורנקס', sector: 'ביוטק', basePrice: 180 },
    { symbol: 'RADA', name: 'ראדה', sector: 'תעשייה', basePrice: 65 },
    { symbol: 'KAMX', name: 'קמטק', sector: 'הייטק', basePrice: 290 },
    { symbol: 'OPTI', name: 'אופטי בייס', sector: 'תקשורת', basePrice: 140 },
    { symbol: 'NVET', name: 'נובוטק', sector: 'ביוטק', basePrice: 95 },
    { symbol: 'CERX', name: 'סלבריטי', sector: 'קמעונאות', basePrice: 210 },
    { symbol: 'MEGX', name: 'מגה אור', sector: 'קמעונאות', basePrice: 175 },
    { symbol: 'SHTX', name: 'שטראוס', sector: 'מזון', basePrice: 160 },
    { symbol: 'OSEM', name: 'אסם', sector: 'מזון', basePrice: 145 },
    { symbol: 'HAPO', name: 'הפועלים', sector: 'בנקאות', basePrice: 75 },
    { symbol: 'LEVX', name: 'לב פארמה', sector: 'פארמה', basePrice: 125 },
    { symbol: 'GMLX', name: 'גמל', sector: 'כימיקלים', basePrice: 190 },
    { symbol: 'ELRON', name: 'אלרון', sector: 'הולדינג', basePrice: 220 },
    { symbol: 'ICTX', name: 'ICL', sector: 'כימיקלים', basePrice: 480 }
];

// ============================================
// INITIALIZATION
// ============================================

function initStockSimulator(level = 'easy') {
    console.log(`🎮 מתחיל סימולטור בורסה - רמה: ${level}`);
    
    stockSimulatorState.level = level;
    resetGame(level);
    renderGame();
}

function resetGame(level) {
    const config = LEVEL_CONFIG[level];
    
    // Stop any running intervals
    if (stockSimulatorState.intervalId) {
        clearInterval(stockSimulatorState.intervalId);
    }
    
    // Reset state
    stockSimulatorState = {
        level: level,
        budget: 100000,
        cash: 100000,
        portfolio: {},
        stocks: initializeStocks(level, config.stockCount),
        gameTime: config.duration,
        gameRunning: false,
        intervalId: null,
        startTime: null,
        transactions: []
    };
}

function initializeStocks(level, count) {
    const stockPool = STOCK_NAMES[level];
    const stocks = [];
    
    for (let i = 0; i < Math.min(count, stockPool.length); i++) {
        const stockData = stockPool[i];
        stocks.push({
            symbol: stockData.symbol,
            name: stockData.name,
            sector: stockData.sector,
            price: stockData.basePrice,
            previousPrice: stockData.basePrice,
            change: 0,
            history: [stockData.basePrice]
        });
    }
    
    return stocks;
}

// ============================================
// RENDER GAME
// ============================================

function renderGame() {
    const gameContent = document.getElementById('game-content');
    
    if (!gameContent) return;
    
    const config = LEVEL_CONFIG[stockSimulatorState.level];
    
    gameContent.innerHTML = `
        <!-- Instructions -->
        <div class="game-instructions">
            <h3><i class="fas fa-info-circle"></i> הוראות המשחק</h3>
            <p>קיבלתם תקציב של ${formatCurrency(stockSimulatorState.budget)} לבניית תיק השקעות. קנו ומכרו מניות בזמן אמת והשיגו את הרווח הגבוה ביותר!</p>
            <ul>
                <li>משך המשחק: ${config.duration / 60} דקות</li>
                <li>מספר מניות זמינות: ${config.stockCount}</li>
                <li>מחירים משתנים כל ${config.priceChangeInterval / 1000} שניות</li>
            </ul>
        </div>
        
        <!-- Stats Bar -->
        <div class="game-stats-bar">
            <div class="stat-box">
                <span class="stat-label">מזומן זמין</span>
                <span class="stat-value" id="available-cash">${formatCurrency(stockSimulatorState.cash)}</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">שווי תיק</span>
                <span class="stat-value" id="portfolio-value">${formatCurrency(0)}</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">סה"כ נכסים</span>
                <span class="stat-value" id="total-assets">${formatCurrency(stockSimulatorState.cash)}</span>
            </div>
            <div class="stat-box" id="profit-stat">
                <span class="stat-label">רווח/הפסד</span>
                <span class="stat-value" id="profit-loss">0%</span>
            </div>
            <div class="stat-box">
                <span class="stat-label">זמן נותר</span>
                <span class="stat-value timer" id="game-timer">${formatTime(stockSimulatorState.gameTime)}</span>
            </div>
        </div>
        
        <!-- Chart -->
        <div class="chart-container">
            <h3>גרף ביצועי התיק</h3>
            <canvas id="portfolio-chart"></canvas>
        </div>
        
        <!-- Stocks Table -->
        <div class="stocks-table-container">
            <table class="stocks-table" id="stocks-table">
                <thead>
                    <tr>
                        <th>סמל</th>
                        <th>שם החברה</th>
                        <th>מחיר נוכחי</th>
                        <th>שינוי</th>
                        <th>בתיק</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody id="stocks-tbody">
                </tbody>
            </table>
        </div>
        
        <!-- Actions -->
        <div class="game-actions">
            <button id="start-game-btn" class="btn-primary btn-large">
                <i class="fas fa-play"></i>
                <span>התחל משחק!</span>
            </button>
            <button id="reset-game-btn" class="btn-secondary" style="display: none;">
                <i class="fas fa-redo"></i>
                <span>התחל מחדש</span>
            </button>
        </div>
    `;
    
    // Render stocks table
    renderStocksTable();
    
    // Initialize chart
    initializeChart();
    
    // Event listeners
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    
    const resetBtn = document.getElementById('reset-game-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetGame(stockSimulatorState.level);
            renderGame();
        });
    }
}

function renderStocksTable() {
    const tbody = document.getElementById('stocks-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    stockSimulatorState.stocks.forEach(stock => {
        const row = document.createElement('tr');
        const portfolioQty = stockSimulatorState.portfolio[stock.symbol] || 0;
        const changeClass = stock.change >= 0 ? 'positive' : 'negative';
        
        row.innerHTML = `
            <td><strong>${stock.symbol}</strong></td>
            <td>${stock.name} <small>(${stock.sector})</small></td>
            <td><strong>${formatCurrency(stock.price)}</strong></td>
            <td class="stock-change ${changeClass}">${formatPercentage(stock.change)}</td>
            <td>${portfolioQty} מניות</td>
            <td class="stock-actions">
                <button class="btn-secondary" onclick="buyStock('${stock.symbol}')">
                    <i class="fas fa-plus"></i> קנה
                </button>
                <button class="btn-secondary" onclick="sellStock('${stock.symbol}')" ${portfolioQty === 0 ? 'disabled' : ''}>
                    <i class="fas fa-minus"></i> מכור
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// ============================================
// GAME LOGIC
// ============================================

function startGame() {
    if (stockSimulatorState.gameRunning) return;
    
    stockSimulatorState.gameRunning = true;
    stockSimulatorState.startTime = Date.now();
    
    // Update UI
    document.getElementById('start-game-btn').style.display = 'none';
    document.getElementById('reset-game-btn').style.display = 'inline-flex';
    
    const config = LEVEL_CONFIG[stockSimulatorState.level];
    
    // Start price changes
    stockSimulatorState.intervalId = setInterval(() => {
        updateStockPrices();
        renderStocksTable();
        updateStats();
    }, config.priceChangeInterval);
    
    // Start timer
    const timerInterval = setInterval(() => {
        stockSimulatorState.gameTime--;
        document.getElementById('game-timer').textContent = formatTime(stockSimulatorState.gameTime);
        
        if (stockSimulatorState.gameTime <= 30) {
            document.getElementById('game-timer').classList.add('warning');
        }
        
        if (stockSimulatorState.gameTime <= 0) {
            clearInterval(timerInterval);
            clearInterval(stockSimulatorState.intervalId);
            endGame();
        }
    }, 1000);
    
    console.log('🎮 המשחק התחיל!');
}

function updateStockPrices() {
    const config = LEVEL_CONFIG[stockSimulatorState.level];
    
    stockSimulatorState.stocks.forEach(stock => {
        stock.previousPrice = stock.price;
        
        // Random price change
        const changePercent = (Math.random() - 0.5) * 2 * config.maxChange;
        const newPrice = stock.price * (1 + changePercent);
        
        stock.price = Math.max(10, Math.round(newPrice * 100) / 100);
        stock.change = ((stock.price - stock.previousPrice) / stock.previousPrice) * 100;
        stock.history.push(stock.price);
        
        // Keep history limited
        if (stock.history.length > 50) {
            stock.history.shift();
        }
    });
}

function buyStock(symbol) {
    const stock = stockSimulatorState.stocks.find(s => s.symbol === symbol);
    if (!stock) return;
    
    if (stockSimulatorState.cash < stock.price) {
        alert('אין מספיק מזומן!');
        return;
    }
    
    // Buy one share
    stockSimulatorState.cash -= stock.price;
    stockSimulatorState.portfolio[symbol] = (stockSimulatorState.portfolio[symbol] || 0) + 1;
    
    // Record transaction
    stockSimulatorState.transactions.push({
        type: 'buy',
        symbol: symbol,
        price: stock.price,
        time: Date.now()
    });
    
    renderStocksTable();
    updateStats();
    
    console.log(`✅ קנית מניית ${symbol} במחיר ${stock.price}`);
}

function sellStock(symbol) {
    const stock = stockSimulatorState.stocks.find(s => s.symbol === symbol);
    if (!stock) return;
    
    const portfolioQty = stockSimulatorState.portfolio[symbol] || 0;
    if (portfolioQty === 0) {
        alert('אין מניות מסוג זה בתיק!');
        return;
    }
    
    // Sell one share
    stockSimulatorState.cash += stock.price;
    stockSimulatorState.portfolio[symbol]--;
    
    if (stockSimulatorState.portfolio[symbol] === 0) {
        delete stockSimulatorState.portfolio[symbol];
    }
    
    // Record transaction
    stockSimulatorState.transactions.push({
        type: 'sell',
        symbol: symbol,
        price: stock.price,
        time: Date.now()
    });
    
    renderStocksTable();
    updateStats();
    
    console.log(`✅ מכרת מניית ${symbol} במחיר ${stock.price}`);
}

function updateStats() {
    // Calculate portfolio value
    let portfolioValue = 0;
    Object.keys(stockSimulatorState.portfolio).forEach(symbol => {
        const stock = stockSimulatorState.stocks.find(s => s.symbol === symbol);
        if (stock) {
            portfolioValue += stock.price * stockSimulatorState.portfolio[symbol];
        }
    });
    
    const totalAssets = stockSimulatorState.cash + portfolioValue;
    const profitLoss = ((totalAssets - stockSimulatorState.budget) / stockSimulatorState.budget) * 100;
    
    // Update UI
    document.getElementById('available-cash').textContent = formatCurrency(stockSimulatorState.cash);
    document.getElementById('portfolio-value').textContent = formatCurrency(portfolioValue);
    document.getElementById('total-assets').textContent = formatCurrency(totalAssets);
    
    const profitLossElement = document.getElementById('profit-loss');
    profitLossElement.textContent = formatPercentage(profitLoss);
    
    const profitStat = document.getElementById('profit-stat');
    if (profitLoss >= 0) {
        profitStat.classList.add('success');
        profitStat.classList.remove('danger');
    } else {
        profitStat.classList.add('danger');
        profitStat.classList.remove('success');
    }
    
    // Update chart
    updateChart();
}

function endGame() {
    stockSimulatorState.gameRunning = false;
    
    // Calculate final stats
    let portfolioValue = 0;
    Object.keys(stockSimulatorState.portfolio).forEach(symbol => {
        const stock = stockSimulatorState.stocks.find(s => s.symbol === symbol);
        if (stock) {
            portfolioValue += stock.price * stockSimulatorState.portfolio[symbol];
        }
    });
    
    const totalAssets = stockSimulatorState.cash + portfolioValue;
    const profitLoss = ((totalAssets - stockSimulatorState.budget) / stockSimulatorState.budget) * 100;
    const score = Math.max(0, Math.round((profitLoss + 20) * 5));
    
    const duration = Math.round((Date.now() - stockSimulatorState.startTime) / 1000);
    
    // Show completion screen
    showCompletionScreen(totalAssets, profitLoss, score, duration);
    
    // Send to Google Sheets
    if (typeof completeGame === 'function') {
        completeGame('סימולטור בורסה', stockSimulatorState.level, score, duration);
    }
}

function showCompletionScreen(totalAssets, profitLoss, score, duration) {
    const gameContent = document.getElementById('game-content');
    
    const isSuccess = profitLoss >= 10;
    const icon = isSuccess ? 'fa-trophy' : 'fa-chart-line';
    const message = isSuccess ? 'כל הכבוד! השגתם תשואה מעולה!' : 'לא רע! נסו שוב להשיג תשואה גבוהה יותר.';
    
    gameContent.innerHTML = `
        <div class="completion-screen">
            <div class="completion-icon">
                <i class="fas ${icon}"></i>
            </div>
            <h2 class="completion-title">המשחק הסתיים!</h2>
            <p class="completion-message">${message}</p>
            
            <div class="completion-stats">
                <div class="completion-stat">
                    <span class="label">סה"כ נכסים סופיים</span>
                    <span class="value">${formatCurrency(totalAssets)}</span>
                </div>
                <div class="completion-stat">
                    <span class="label">רווח/הפסד</span>
                    <span class="value" style="color: ${profitLoss >= 0 ? '#27AE60' : '#E74C3C'}">${formatPercentage(profitLoss)}</span>
                </div>
                <div class="completion-stat">
                    <span class="label">ציון סופי</span>
                    <span class="value">${score}</span>
                </div>
                <div class="completion-stat">
                    <span class="label">זמן משחק</span>
                    <span class="value">${formatTime(duration)}</span>
                </div>
            </div>
            
            <div class="game-actions">
                <button onclick="initStockSimulator('${stockSimulatorState.level}')" class="btn-primary">
                    <i class="fas fa-redo"></i>
                    <span>שחק שוב</span>
                </button>
                <button onclick="showScreen('dashboard-screen')" class="btn-secondary">
                    <i class="fas fa-home"></i>
                    <span>חזרה לדשבורד</span>
                </button>
            </div>
        </div>
    `;
}

// ============================================
// CHART
// ============================================

let portfolioChart = null;

function initializeChart() {
    const ctx = document.getElementById('portfolio-chart');
    if (!ctx) return;
    
    if (portfolioChart) {
        portfolioChart.destroy();
    }
    
    portfolioChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'שווי התיק',
                data: [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function updateChart() {
    if (!portfolioChart) return;
    
    let portfolioValue = 0;
    Object.keys(stockSimulatorState.portfolio).forEach(symbol => {
        const stock = stockSimulatorState.stocks.find(s => s.symbol === symbol);
        if (stock) {
            portfolioValue += stock.price * stockSimulatorState.portfolio[symbol];
        }
    });
    
    const totalAssets = stockSimulatorState.cash + portfolioValue;
    
    portfolioChart.data.labels.push('');
    portfolioChart.data.datasets[0].data.push(totalAssets);
    
    // Keep only last 20 points
    if (portfolioChart.data.labels.length > 20) {
        portfolioChart.data.labels.shift();
        portfolioChart.data.datasets[0].data.shift();
    }
    
    portfolioChart.update();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

// Make functions globally available
window.buyStock = buyStock;
window.sellStock = sellStock;
window.initStockSimulator = initStockSimulator;

console.log('✅ game1-stock-simulator.js נטען בהצלחה!');
