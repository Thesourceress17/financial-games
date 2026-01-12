/* ============================================
   GOOGLE APPS SCRIPT CODE
   קוד זה צריך להיות מועתק ל-Google Apps Script
   בגיליון Google Sheets
   ============================================ */

/**
 * פונקציה שמקבלת POST requests מהאתר
 * ומוסיפה את הנתונים לגיליון
 */
function doPost(e) {
  try {
    // קבלת הגיליון הפעיל
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // ניתוח הנתונים שהתקבלו
    const data = JSON.parse(e.postData.contents);
    
    // הוספת שורה חדשה עם הנתונים
    sheet.appendRow([
      data.studentName,    // שם התלמיד
      data.gameName,       // שם המשחק
      data.level,          // רמת קושי
      data.score,          // ציון
      data.timestamp,      // תאריך ושעה
      data.duration        // זמן משחק (בשניות)
    ]);
    
    // החזרת תגובת הצלחה
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'הציון נשמר בהצלחה!'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // החזרת תגובת שגיאה
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * פונקציה לבדיקה - מחזירה את כל הנתונים
 * (אופציונלי - לשימוש עתידי)
 */
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // המרה ל-JSON
    const jsonData = data.slice(1).map(row => ({
      studentName: row[0],
      gameName: row[1],
      level: row[2],
      score: row[3],
      timestamp: row[4],
      duration: row[5]
    }));
    
    return ContentService.createTextOutput(JSON.stringify(jsonData))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * פונקציה עזר - יצירת גרף אוטומטי
 * (אופציונלי - להפעלה ידנית)
 */
function createAutomaticChart() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // יצירת גרף עמודות לציונים ממוצעים לפי משחק
  const chart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange('B:D'))
    .setPosition(1, 8, 0, 0)
    .setOption('title', 'ציונים ממוצעים לפי משחק')
    .setOption('height', 400)
    .setOption('width', 600)
    .build();
  
  sheet.insertChart(chart);
}
