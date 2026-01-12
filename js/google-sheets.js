/* ============================================
   GOOGLE-SHEETS.JS - אינטגרציה עם Google Sheets
   ============================================ */

// Google Sheets Web App URL
// המורה צריכה להחליף את זה ב-URL שקיבלה מ-Google Apps Script
const GOOGLE_SHEETS_URL = 'YOUR_WEB_APP_URL_HERE';

// ============================================
// SEND SCORE TO GOOGLE SHEETS
// ============================================

async function sendScoreToSheets(studentName, gameName, level, score, duration) {
    // Check if URL is configured
    if (GOOGLE_SHEETS_URL === 'YOUR_WEB_APP_URL_HERE') {
        console.warn('⚠️ Google Sheets URL לא מוגדר');
        showLocalStorageBackup(studentName, gameName, level, score, duration);
        return;
    }
    
    try {
        const data = {
            studentName: studentName,
            gameName: gameName,
            level: level,
            score: score,
            timestamp: new Date().toLocaleString('he-IL'),
            duration: duration
        };
        
        console.log('📤 שולח נתונים ל-Google Sheets:', data);
        
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        console.log('✅ הציון נשלח בהצלחה!');
        
        // Also save locally as backup
        saveScoreLocally(studentName, gameName, level, score, duration);
        
        // Show success message
        if (typeof showNotification === 'function') {
            showNotification('הציון נשלח למורה בהצלחה! 🎉', 'success');
        } else {
            alert('הציון נשלח למורה בהצלחה! 🎉');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ שגיאה בשליחת הציון:', error);
        
        // Save locally as fallback
        saveScoreLocally(studentName, gameName, level, score, duration);
        
        if (typeof showNotification === 'function') {
            showNotification('הציון נשמר מקומית. בדקו את החיבור לאינטרנט.', 'warning');
        } else {
            alert('הציון נשמר מקומית. בדקו את החיבור לאינטרנט.');
        }
        
        return false;
    }
}

// ============================================
// LOCAL STORAGE BACKUP
// ============================================

function saveScoreLocally(studentName, gameName, level, score, duration) {
    const scoreData = {
        studentName: studentName,
        gameName: gameName,
        level: level,
        score: score,
        timestamp: new Date().toISOString(),
        duration: duration
    };
    
    // Get existing scores
    let scores = localStorage.getItem('allScores');
    if (!scores) {
        scores = [];
    } else {
        try {
            scores = JSON.parse(scores);
        } catch (e) {
            scores = [];
        }
    }
    
    // Add new score
    scores.push(scoreData);
    
    // Save back to localStorage
    localStorage.setItem('allScores', JSON.stringify(scores));
    
    console.log('💾 הציון נשמר מקומית:', scoreData);
}

function showLocalStorageBackup(studentName, gameName, level, score, duration) {
    console.log('💾 שומר ציון מקומית בלבד (Google Sheets לא מוגדר)');
    saveScoreLocally(studentName, gameName, level, score, duration);
    
    if (typeof showNotification === 'function') {
        showNotification('הציון נשמר! (Google Sheets לא מוגדר)', 'warning');
    } else {
        alert('הציון נשמר מקומית!');
    }
}

// ============================================
// GET ALL SCORES FROM LOCAL STORAGE
// ============================================

function getAllScoresLocal() {
    let scores = localStorage.getItem('allScores');
    if (!scores) {
        return [];
    }
    
    try {
        return JSON.parse(scores);
    } catch (e) {
        console.error('שגיאה בקריאת ציונים:', e);
        return [];
    }
}

// ============================================
// EXPORT SCORES TO CSV
// ============================================

function exportScoresToCSV() {
    const scores = getAllScoresLocal();
    
    if (scores.length === 0) {
        alert('אין נתונים לייצוא');
        return;
    }
    
    // Create CSV content
    let csv = 'שם תלמיד,שם משחק,רמת קושי,ציון,תאריך ושעה,זמן משחק\n';
    
    scores.forEach(score => {
        const timestamp = new Date(score.timestamp).toLocaleString('he-IL');
        csv += `${score.studentName},${score.gameName},${score.level},${score.score},${timestamp},${score.duration}\n`;
    });
    
    // Create blob and download
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ציוני_תלמידים_${new Date().toLocaleDateString('he-IL')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('📥 הקובץ הורד בהצלחה');
}

// ============================================
// CLEAR ALL LOCAL DATA
// ============================================

function clearAllLocalData() {
    if (confirm('האם אתם בטוחים שברצונכם למחוק את כל הנתונים המקומיים?')) {
        localStorage.removeItem('allScores');
        console.log('🗑️ כל הנתונים המקומיים נמחקו');
        alert('הנתונים נמחקו בהצלחה');
    }
}

// ============================================
// HELPER FUNCTION FOR GAME COMPLETION
// ============================================

function completeGame(gameName, level, score, duration) {
    const studentName = window.app ? window.app.getCurrentStudent() : localStorage.getItem('studentName') || 'אנונימי';
    
    // Save progress in app
    if (window.app && typeof window.app.saveGameProgress === 'function') {
        window.app.saveGameProgress(gameName, level, score);
    }
    
    // Send to Google Sheets
    sendScoreToSheets(studentName, gameName, level, score, duration);
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.googleSheets = {
    sendScore: sendScoreToSheets,
    getAllScores: getAllScoresLocal,
    exportToCSV: exportScoresToCSV,
    clearData: clearAllLocalData,
    completeGame: completeGame
};

console.log('✅ google-sheets.js נטען בהצלחה!');
