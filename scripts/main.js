/**
 * TIME QUEST - MAIN APPLICATION
 * The master controller that initializes and coordinates all systems
 * This is the "brain" that starts everything up
 */

// ===================================
// APPLICATION STATE
// ===================================

let app = {
    isInitialized: false,
    isAudioEnabled: false,
    currentScreen: 'loading-screen',
    debugMode: false
};

// ===================================
// INITIALIZATION SEQUENCE
// ===================================

/**
 * Main application initialization
 * This runs when the page loads and starts everything
 */
async function initializeTimeQuest() {
    console.log('🚀 Starting Time Quest initialization...');
    
    try {
        // Step 1: Initialize core systems
        await initializeCoreystems();
        
        // Step 2: Initialize storage and load user data
        await initializeUserData();
        
        // Step 3: Initialize audio system (with fallbacks)
        await initializeAudioSystem();
        
        // Step 4: Initialize UI and screen management
        await initializeUserInterface();
        
        // Step 5: Initialize game systems
        await initializeGameSystems();
        
        // Step 6: Complete startup sequence
        await completeStartup();
        
        app.isInitialized = true;
        console.log('✅ Time Quest initialization complete!');
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        showInitializationError(error);
    }
}

/**
 * Initialize core utility systems
 */
async function initializeCoreystems() {
    console.log('🔧 Initializing core systems...');
    
    // Verify all utility functions are available
    if (!window.TimeQuestUtils) {
        throw new Error('Core utilities not loaded');
    }
    
    // Set up error handling
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    console.log('✅ Core systems ready');
}

/**
 * Initialize storage and user data
 */
async function initializeUserData() {
    console.log('💾 Initializing storage and user data...');
    
    if (window.TimeQuestStorage) {
        const storageInitialized = TimeQuestStorage.initializeStorage();
        
        if (!storageInitialized) {
            console.warn('⚠️ Storage not available - running in demo mode');
        }
        
        // Create demo profile if no profiles exist
        const profiles = TimeQuestStorage.getAllProfiles();
        if (profiles.length === 0) {
            createDemoProfile();
        }
    }
    
    console.log('✅ User data initialized');
}

/**
 * Initialize audio system with fallbacks
 */
async function initializeAudioSystem() {
    console.log('🔊 Initializing audio system...');
    
    if (window.TimeQuestAudio) {
        try {
            await TimeQuestAudio.manager.initialize();
            app.isAudioEnabled = true;
            console.log('✅ Audio system ready');
        } catch (error) {
            console.warn('⚠️ Audio initialization failed, continuing without audio:', error);
            app.isAudioEnabled = false;
        }
    } else {
        console.warn('⚠️ Audio manager not available');
    }
}

/**
 * Initialize user interface systems
 */
async function initializeUserInterface() {
    console.log('🎭 Initializing user interface...');
    
    if (window.TimeQuestUI) {
        // UI manager initializes automatically, but we can verify it's ready
        console.log('✅ UI system ready');
    } else {
        throw new Error('UI manager not loaded');
    }
}

/**
 * Initialize game systems (tutorial, practice, game, settings)
 */
async function initializeGameSystems() {
    console.log('🎮 Initializing game systems...');
    
    // Initialize tutorial system
    if (window.TimeQuestTutorial) {
        console.log('📚 Tutorial system ready');
    }
    
    // Initialize practice system  
    if (window.TimeQuestPractice) {
        console.log('🎯 Practice system ready');
    }
    
    // Initialize game system
    if (window.TimeQuestGameManager) {
        console.log('🗡️ Adventure system ready');
    }
    
    // Initialize settings system
    if (window.TimeQuestSettings) {
        console.log('⚙️ Settings system ready');
    }
    
    console.log('✅ All game systems ready');
}

/**
 * Complete the startup sequence
 */
async function completeStartup() {
    console.log('🏁 Completing startup sequence...');
    
    // Hide loading screen after a realistic delay
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    // Show welcome message
    setTimeout(() => {
        if (window.TimeQuestUI) {
            TimeQuestUI.mascotSay('Welcome to Time Quest! Ready to become a Time Master? ⏰✨');
        }
    }, 3000);
}

/**
 * Hide loading screen and show main menu
 */
function hideLoadingScreen() {
    const loadingScreen = TimeQuestUtils.getElement('loading-screen');
    const mainMenu = TimeQuestUtils.getElement('main-menu');
    
    if (loadingScreen && mainMenu) {
        // Animate loading screen out
        TimeQuestUtils.animateElement(loadingScreen, 'screen-fade-out', () => {
            TimeQuestUtils.removeClass(loadingScreen, 'active');
            TimeQuestUtils.addClass(mainMenu, 'active');
            app.currentScreen = 'main-menu';
            
            // Start background music if audio is enabled
            if (app.isAudioEnabled && window.TimeQuestAudio) {
                TimeQuestAudio.playBackgroundMusic('menu');
            }
        });
    }
}

/**
 * Create a demo profile for immediate testing
 */
function createDemoProfile() {
    try {
        if (window.TimeQuestStorage) {
            const profile = TimeQuestStorage.createProfile('Demo Student', '🧙‍♂️');
            TimeQuestStorage.setCurrentProfile(profile.id);
            console.log('👤 Created demo profile for testing');
        }
    } catch (error) {
        console.warn('Could not create demo profile:', error);
    }
}

/**
 * Handle global errors gracefully
 */
function handleGlobalError(event) {
    console.error('Global error caught:', event.error);
    
    // Show user-friendly error message
    if (window.TimeQuestUI) {
        TimeQuestUI.showError('Something went wrong, but don\'t worry! Try refreshing the page.');
    }
    
    // In debug mode, show more details
    if (app.debugMode) {
        alert('Debug Error: ' + event.error.message);
    }
}

/**
 * Handle unhandled promise rejections
 */
function handleUnhandledRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent the default browser behavior
    event.preventDefault();
    
    // Show user-friendly message
    if (window.TimeQuestUI) {
        TimeQuestUI.showError('A background process encountered an issue, but the app should still work normally.');
    }
}

/**
 * Show initialization error to user
 */
function showInitializationError(error) {
    const errorDisplay = document.createElement('div');
    errorDisplay.className = 'initialization-error';
    errorDisplay.innerHTML = `
        <div class="error-content">
            <h2>⚠️ Initialization Error</h2>
            <p>Time Quest encountered a problem during startup.</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <div class="error-actions">
                <button onclick="window.location.reload()" class="error-button">
                    🔄 Restart App
                </button>
                <button onclick="toggleDebugMode()" class="error-button">
                    🐛 Debug Mode
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(errorDisplay);
}

/**
 * Toggle debug mode for troubleshooting
 */
function toggleDebugMode() {
    app.debugMode = !app.debugMode;
    console.log(`🐛 Debug mode ${app.debugMode ? 'enabled' : 'disabled'}`);
    
    if (app.debugMode) {
        document.body.classList.add('debug-mode');
        
        // Show debug info in console
        console.log('📊 App State:', app);
        console.log('📊 Available Systems:', {
            utils: !!window.TimeQuestUtils,
            storage: !!window.TimeQuestStorage,
            audio: !!window.TimeQuestAudio,
            ui: !!window.TimeQuestUI,
            clocks: !!window.TimeQuestClocks,
            game: !!window.TimeQuestGame,
            tutorial: !!window.TimeQuestTutorial,
            practice: !!window.TimeQuestPractice,
            gameManager: !!window.TimeQuestGameManager,
            settings: !!window.TimeQuestSettings
        });
        
        // Add debug panel
        addDebugPanel();
    } else {
        document.body.classList.remove('debug-mode');
        removeDebugPanel();
    }
}

/**
 * Add debug panel for development
 */
function addDebugPanel() {
    if (document.getElementById('debug-panel')) return;
    
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.innerHTML = `
        <div class="debug-header">🐛 Debug Panel</div>
        <div class="debug-content">
            <button onclick="testAudioSystem()">🔊 Test Audio</button>
            <button onclick="testClockSystem()">⏰ Test Clocks</button>
            <button onclick="testStorageSystem()">💾 Test Storage</button>
            <button onclick="showSystemInfo()">📊 System Info</button>
            <button onclick="clearAllData()">🧹 Clear Data</button>
            <button onclick="toggleDebugMode()">❌ Close Debug</button>
        </div>
    `;
    
    document.body.appendChild(debugPanel);
}

/**
 * Remove debug panel
 */
function removeDebugPanel() {
    const debugPanel = document.getElementById('debug-panel');
    if (debugPanel) {
        document.body.removeChild(debugPanel);
    }
}

/**
 * Test audio system functionality
 */
function testAudioSystem() {
    console.log('🔊 Testing audio system...');
    
    if (window.TimeQuestAudio) {
        // Test text-to-speech
        TimeQuestAudio.speak('Audio test successful! Time Quest is working!');
        
        // Test sound effect (will be silent if files missing, but won't error)
        TimeQuestAudio.playSound('button-click', 0.5);
        
        console.log('✅ Audio test complete');
    } else {
        console.log('❌ Audio system not available');
    }
}

/**
 * Test clock system functionality
 */
function testClockSystem() {
    console.log('⏰ Testing clock system...');
    
    if (window.TimeQuestClocks) {
        // This will test if clock creation works
        console.log('Clock presets available:', Object.keys(TimeQuestClocks.presets));
        console.log('✅ Clock system test complete');
    } else {
        console.log('❌ Clock system not available');
    }
}

/**
 * Test storage system functionality
 */
function testStorageSystem() {
    console.log('💾 Testing storage system...');
    
    if (window.TimeQuestStorage) {
        const testResult = TimeQuestStorage.isStorageAvailable();
        console.log('Storage available:', testResult);
        
        const profiles = TimeQuestStorage.getAllProfiles();
        console.log('Profiles found:', profiles.length);
        
        const settings = TimeQuestStorage.getSettings();
        console.log('Settings loaded:', Object.keys(settings).length, 'keys');
        
        console.log('✅ Storage test complete');
    } else {
        console.log('❌ Storage system not available');
    }
}

/**
 * Show detailed system information
 */
function showSystemInfo() {
    const info = {
        app: app,
        browser: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        },
        screen: {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio
        },
        features: {
            localStorage: !!window.localStorage,
            speechSynthesis: !!window.speechSynthesis,
            touchSupport: 'ontouchstart' in window,
            webAudio: !!(window.AudioContext || window.webkitAudioContext)
        },
        timeQuest: {
            utils: !!window.TimeQuestUtils,
            storage: !!window.TimeQuestStorage,
            audio: !!window.TimeQuestAudio,
            ui: !!window.TimeQuestUI,
            clocks: !!window.TimeQuestClocks,
            game: !!window.TimeQuestGame,
            tutorial: !!window.TimeQuestTutorial,
            practice: !!window.TimeQuestPractice,
            gameManager: !!window.TimeQuestGameManager,
            settings: !!window.TimeQuestSettings
        }
    };
    
    console.log('📊 System Information:', info);
    
    if (window.TimeQuestUI) {
        TimeQuestUI.showSuccess('System info logged to console. Press F12 to view.');
    }
}

/**
 * Clear all stored data (for testing)
 */
function clearAllData() {
    if (confirm('⚠️ This will delete ALL data. Are you sure?')) {
        if (window.TimeQuestStorage) {
            TimeQuestStorage.clearAllData();
            console.log('🧹 All data cleared');
            
            if (window.TimeQuestUI) {
                TimeQuestUI.showSuccess('All data cleared! Refresh to start fresh.');
            }
        }
    }
}

// ===================================
// AUTO-INITIALIZATION
// ===================================

/**
 * Auto-start the application when DOM is ready
 */
function startApplication() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTimeQuest);
    } else {
        // DOM is already ready
        initializeTimeQuest();
    }
}

/**
 * Export debug functions to global scope for console access
 */
window.debugTimeQuest = {
    toggleDebug: toggleDebugMode,
    testAudio: testAudioSystem,
    testClocks: testClockSystem,
    testStorage: testStorageSystem,
    systemInfo: showSystemInfo,
    clearData: clearAllData,
    app: () => app
};

// Start the application
startApplication();

console.log('🎯 Time Quest main.js loaded - initialization will begin when DOM is ready');