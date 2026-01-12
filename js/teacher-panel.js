/* ============================================
   TEACHER-PANEL.JS - דשבורד מורה
   ============================================ */

let teacherChart1 = null;
let teacherChart2 = null;

// ============================================
// INITIALIZATION
// ============================================

function initTeacherDashboard() {
    console.log('👨‍🏫 מאתחל דשבורד מורה');
    
    loadTeacherData();
    initializeTeacherCharts();
    setupTeacherEvents();
}

function loadTeacherData() {
    const scores = getAllScoresLocal();
    
    if (!scores || scores.length === 0) {
        document.querySelector('.students-table tbody').innerHTML = `
            <tr class="no-data">
                <td colspan="6">אין נתונים להצגה</td>
            </tr>
        `;
        return;
    }
    
    // Calculate statistics
    const stats = calculateStats(scores);
    updateStatsDisplay(stats);
    
    // Update table
    updateStudentsTable(scores);
    
    // Update charts
    updateTeacherCharts(scores);
}

function calculateStats(scores) {
    const uniqueStudents = new Set(scores.map(s => s.studentName)).size;
    const totalGames = scores.length;
    const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    
    // Calculate completion rate (assuming 5 games total)
    const completionRate = (totalGames / (uniqueStudents * 5)) * 100;
    
    return {
        totalStudents: uniqueStudents,
        totalGames: totalGames,
        averageScore: Math.round(averageScore),
        completionRate: Math.min(100, Math.round(completionRate))
    };
}

function updateStatsDisplay(stats) {
    document.getElementById('total-students').textContent = stats.totalStudents;
    document.getElementById('total-games-played').textContent = stats.totalGames;
    document.getElementById('average-score').textContent = stats.averageScore;
    document.getElementById('completion-rate').textContent = `${stats.completionRate}%`;
}

function updateStudentsTable(scores) {
    const tbody = document.querySelector('.students-table tbody');
    tbody.innerHTML = '';
    
    // Sort by date (newest first)
    scores.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    scores.forEach(score => {
        const row = document.createElement('tr');
        const date = new Date(score.timestamp);
        
        row.innerHTML = `
            <td>${score.studentName}</td>
            <td>${score.gameName}</td>
            <td>${getLevelText(score.level)}</td>
            <td><strong>${score.score}</strong></td>
            <td>${date.toLocaleString('he-IL')}</td>
            <td>${score.duration ? formatDuration(score.duration) : '-'}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function getLevelText(level) {
    const levels = {
        'easy': '⭐ קל',
        'medium': '⭐⭐ בינוני',
        'hard': '⭐⭐⭐ קשה'
    };
    return levels[level] || level;
}

function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// CHARTS
// ============================================

function initializeTeacherCharts() {
    // Chart 1: Scores by Game
    const ctx1 = document.getElementById('scores-by-game-chart');
    if (ctx1 && !teacherChart1) {
        teacherChart1 = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'ציון ממוצע',
                    data: [],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Chart 2: Difficulty Distribution
    const ctx2 = document.getElementById('difficulty-distribution-chart');
    if (ctx2 && !teacherChart2) {
        teacherChart2 = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: ['קל', 'בינוני', 'קשה'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        'rgba(39, 174, 96, 0.8)',
                        'rgba(243, 156, 18, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}

function updateTeacherCharts(scores) {
    if (!scores || scores.length === 0) return;
    
    // Update Chart 1: Scores by Game
    const gameScores = {};
    scores.forEach(score => {
        if (!gameScores[score.gameName]) {
            gameScores[score.gameName] = { total: 0, count: 0 };
        }
        gameScores[score.gameName].total += score.score;
        gameScores[score.gameName].count++;
    });
    
    const gameNames = Object.keys(gameScores);
    const gameAverages = gameNames.map(name => 
        Math.round(gameScores[name].total / gameScores[name].count)
    );
    
    if (teacherChart1) {
        teacherChart1.data.labels = gameNames;
        teacherChart1.data.datasets[0].data = gameAverages;
        teacherChart1.update();
    }
    
    // Update Chart 2: Difficulty Distribution
    const levelCounts = { easy: 0, medium: 0, hard: 0 };
    scores.forEach(score => {
        if (levelCounts.hasOwnProperty(score.level)) {
            levelCounts[score.level]++;
        }
    });
    
    if (teacherChart2) {
        teacherChart2.data.datasets[0].data = [
            levelCounts.easy,
            levelCounts.medium,
            levelCounts.hard
        ];
        teacherChart2.update();
    }
}

// ============================================
// EVENTS
// ============================================

function setupTeacherEvents() {
    // Export data button
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (typeof exportScoresToCSV === 'function') {
                exportScoresToCSV();
            }
        });
    }
    
    // Open Google Sheets button
    const openSheetsBtn = document.getElementById('open-sheets-btn');
    if (openSheetsBtn) {
        openSheetsBtn.addEventListener('click', () => {
            alert('יש להגדיר את ה-URL של Google Sheets בקובץ google-sheets.js');
        });
    }
    
    // Search student
    const searchInput = document.getElementById('search-student');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterStudentsTable(e.target.value);
        });
    }
}

function filterStudentsTable(searchTerm) {
    const rows = document.querySelectorAll('.students-table tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const studentName = row.cells[0]?.textContent.toLowerCase() || '';
        if (studentName.includes(term) || term === '') {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.initTeacherDashboard = initTeacherDashboard;
window.getAllScoresLocal = getAllScoresLocal;

console.log('✅ teacher-panel.js נטען בהצלחה!');
