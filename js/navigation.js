/* ============================================
   NAVIGATION.JS - ניהול ניווט באתר
   ============================================ */

// ============================================
// INITIALIZATION
// ============================================

function initializeNavigation() {
    console.log('🧭 מאתחל מערכת ניווט');
    setupNavigationEvents();
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

function navigateTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Log navigation
        console.log(`📍 ניווט ל: ${screenId}`);
    }
}

function goBack() {
    // Simple back navigation
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen && currentScreen.id === 'game-screen') {
        navigateTo('dashboard-screen');
    } else if (currentScreen && currentScreen.id === 'teacher-screen') {
        navigateTo('dashboard-screen');
    } else {
        navigateTo('welcome-screen');
    }
}

// ============================================
// SETUP EVENTS
// ============================================

function setupNavigationEvents() {
    // Handle browser back button
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.screen) {
            navigateTo(event.state.screen);
        } else {
            goBack();
        }
    });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', (event) => {
        // ESC key to go back
        if (event.key === 'Escape') {
            const currentScreen = document.querySelector('.screen.active');
            if (currentScreen && currentScreen.id !== 'welcome-screen') {
                goBack();
            }
        }
    });
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.navigateTo = navigateTo;
window.goBack = goBack;

console.log('✅ navigation.js נטען בהצלחה!');
