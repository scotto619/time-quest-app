/**
 * TIME QUEST - UI HANDLER (SIMPLIFIED)
 * Simple version with no binding issues
 */

class UIManager {
    constructor() {
        this.currentScreen = null;
        this.previousScreen = null;
        this.isTransitioning = false;
        this.activeModals = [];
        this.mascotSpeechTimeout = null;
        
        // NO BINDING - this was causing the error
        console.log('🎭 UI Manager initialized');
    }
    
    initialize() {
        console.log('🎭 Initializing UI Manager...');
        this.setupBasicEventListeners();
        this.loadInitialScreen();
        console.log('✅ UI system ready');
    }
    
    setupBasicEventListeners() {
        // Simple event delegation - no binding needed
        document.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;
            
            // Handle different button types
            const buttonId = button.id;
            
            console.log('Button clicked:', buttonId);
            
            // Play click sound if available
            if (window.TimeQuestUtils && TimeQuestUtils.playSound) {
                TimeQuestUtils.playSound('button-click', 0.3);
            }
            
            // Handle specific buttons
            switch (buttonId) {
                case 'start-adventure-btn':
                    this.startNewAdventure();
                    break;
                case 'continue-journey-btn':
                    this.continueJourney();
                    break;
                case 'practice-mode-btn':
                    this.showScreen('practice-mode');
                    break;
                case 'settings-btn':
                    this.showScreen('settings');
                    break;
                case 'back-to-menu':
                case 'practice-back-btn':
                case 'game-back-btn':
                case 'settings-back-btn':
                    this.showScreen('main-menu');
                    break;
                case 'create-profile-btn':
                    this.showCreateProfileModal();
                    break;
                default:
                    // Button animation for any button
                    if (button.tagName === 'BUTTON') {
                        button.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            button.style.transform = '';
                        }, 150);
                    }
                    break;
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
        });
    }
    
    loadInitialScreen() {
        console.log('📱 Loading initial screen...');
        
        // Hide loading screen after delay
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showScreen('main-menu');
            
            // Welcome message
            setTimeout(() => {
                this.mascotSay('Welcome to Time Quest! Ready to learn about time? ⏰');
            }, 1000);
        }, 2000);
    }
    
    hideLoadingScreen() {
        console.log('🎭 Hiding loading screen...');
        const loadingScreen = document.getElementById('loading-screen');
        const mainMenu = document.getElementById('main-menu');
        
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
        }
        
        if (mainMenu) {
            mainMenu.classList.add('active');
            this.currentScreen = 'main-menu';
            console.log('✅ Main menu displayed');
        }
    }
    
    showScreen(screenId) {
        console.log(`📱 Switching to screen: ${screenId}`);
        
        if (this.isTransitioning) {
            console.log('⚠️ Transition in progress, ignoring');
            return;
        }
        
        const newScreen = document.getElementById(screenId);
        if (!newScreen) {
            console.error(`❌ Screen not found: ${screenId}`);
            return;
        }
        
        this.isTransitioning = true;
        
        // Hide current screen
        if (this.currentScreen) {
            const currentScreen = document.getElementById(this.currentScreen);
            if (currentScreen) {
                currentScreen.classList.remove('active');
            }
        }
        
        // Show new screen
        setTimeout(() => {
            newScreen.classList.add('active');
            this.currentScreen = screenId;
            this.isTransitioning = false;
            
            // Screen-specific setup
            this.onScreenChange(screenId);
            
            console.log(`✅ Switched to ${screenId}`);
        }, 300);
    }
    
    onScreenChange(screenId) {
        switch (screenId) {
            case 'main-menu':
                this.refreshMainMenu();
                break;
            case 'tutorial-mode':
                this.initializeTutorialSession();
                break;
            case 'practice-mode':
                this.initializePracticeSession();
                break;
            case 'game-mode':
                this.initializeGameSession();
                break;
            case 'settings':
                this.refreshSettings();
                break;
        }
    }
    
    startNewAdventure() {
        console.log('🚀 Starting new adventure...');
        
        const profile = window.TimeQuestStorage ? TimeQuestStorage.getCurrentProfile() : null;
        if (!profile) {
            this.showCreateProfileModal();
            return;
        }
        
        this.mascotSay("Let's start your time adventure! 🚀");
        this.showScreen('tutorial-mode');
    }
    
    continueJourney() {
        console.log('📖 Continuing journey...');
        
        const profile = window.TimeQuestStorage ? TimeQuestStorage.getCurrentProfile() : null;
        if (!profile) {
            this.mascotSay("You need to create a profile first!");
            this.showCreateProfileModal();
            return;
        }
        
        this.showScreen('game-mode');
    }
    
    refreshMainMenu() {
        console.log('🔄 Refreshing main menu...');
        // Basic refresh - can be expanded later
    }
    
    initializeTutorialSession() {
        console.log('📚 Initializing tutorial...');
        if (window.TimeQuestTutorial) {
            TimeQuestTutorial.initialize();
        }
        this.mascotSay("Let's learn about telling time! 📚");
    }
    
    initializePracticeSession() {
        console.log('🎯 Initializing practice...');
        if (window.TimeQuestPractice) {
            TimeQuestPractice.initialize();
        }
        this.mascotSay("Time to practice your skills! 🎯");
    }
    
    initializeGameSession() {
        console.log('🎮 Initializing game...');
        if (window.TimeQuestGameManager) {
            TimeQuestGameManager.initialize();
        }
        this.mascotSay("Let the games begin! 🎮");
    }
    
    refreshSettings() {
        console.log('⚙️ Refreshing settings...');
        // Basic settings refresh - can be expanded later
    }
    
    showCreateProfileModal() {
        console.log('👤 Showing create profile modal...');
        
        // Simple modal creation
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; width: 90%;">
                <h3 style="margin-top: 0; color: #333;">Create New Profile</h3>
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 10px; color: #333;">
                        <strong>Name:</strong>
                        <input type="text" id="profile-name-input" 
                               style="width: 100%; padding: 10px; margin-top: 5px; border: 2px solid #4A90E2; border-radius: 5px;"
                               placeholder="Enter your name" maxlength="20">
                    </label>
                </div>
                
                <div style="margin: 20px 0;">
                    <strong style="color: #333;">Choose an avatar:</strong>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 10px;">
                        <button type="button" class="avatar-option" data-avatar="🧙‍♂️" style="font-size: 30px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">🧙‍♂️</button>
                        <button type="button" class="avatar-option" data-avatar="👧" style="font-size: 30px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">👧</button>
                        <button type="button" class="avatar-option" data-avatar="👦" style="font-size: 30px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">👦</button>
                        <button type="button" class="avatar-option" data-avatar="🦸‍♀️" style="font-size: 30px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">🦸‍♀️</button>
                        <button type="button" class="avatar-option" data-avatar="🦸‍♂️" style="font-size: 30px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">🦸‍♂️</button>
                        <button type="button" class="avatar-option" data-avatar="🐱" style="font-size: 30px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">🐱</button>
                        <button type="button" class="avatar-option" data-avatar="🐶" style="font-size: 30px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">🐶</button>
                        <button type="button" class="avatar-option" data-avatar="🚀" style="font-size: 30px; padding: 10px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer;">🚀</button>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <button id="cancel-profile-btn" style="background: #ccc; color: #333; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Cancel</button>
                    <button id="create-profile-btn-modal" style="background: #4A90E2; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Create Profile</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.activeModals.push(modal);
        
        // Handle avatar selection
        const avatarButtons = modal.querySelectorAll('.avatar-option');
        avatarButtons.forEach(button => {
            button.addEventListener('click', () => {
                avatarButtons.forEach(b => b.style.border = '2px solid #ddd');
                button.style.border = '3px solid #4A90E2';
                button.style.background = '#e6f3ff';
            });
        });
        
        // Select first avatar by default
        avatarButtons[0].style.border = '3px solid #4A90E2';
        avatarButtons[0].style.background = '#e6f3ff';
        
        // Handle buttons
        modal.querySelector('#cancel-profile-btn').addEventListener('click', () => {
            this.closeTopModal();
        });
        
        modal.querySelector('#create-profile-btn-modal').addEventListener('click', () => {
            this.createNewProfile(modal);
        });
        
        // Focus name input
        setTimeout(() => {
            modal.querySelector('#profile-name-input').focus();
        }, 100);
    }
    
    createNewProfile(modal) {
        const nameInput = modal.querySelector('#profile-name-input');
        const selectedAvatar = modal.querySelector('.avatar-option[style*="rgb(74, 144, 226)"]') || 
                              modal.querySelector('.avatar-option');
        
        const name = nameInput.value.trim();
        const avatar = selectedAvatar.getAttribute('data-avatar');
        
        if (!name) {
            alert('Please enter a name');
            return;
        }
        
        if (!window.TimeQuestStorage) {
            console.log('📝 Storage not available, using demo mode');
            this.closeTopModal();
            this.mascotSay(`Welcome to Time Quest, ${name}! 🎉`);
            return;
        }
        
        try {
            const profile = TimeQuestStorage.createProfile(name, avatar);
            TimeQuestStorage.setCurrentProfile(profile.id);
            this.closeTopModal();
            this.mascotSay(`Welcome to Time Quest, ${name}! 🎉`);
            console.log('✅ Profile created successfully');
        } catch (error) {
            alert(error.message);
        }
    }
    
    closeTopModal() {
        if (this.activeModals.length === 0) return;
        
        const modal = this.activeModals.pop();
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }
    
    mascotSay(message, duration = 3000) {
        console.log('🧙‍♂️ Mascot says:', message);
        
        const speechBubble = document.getElementById('mascot-speech');
        const mascot = document.getElementById('time-traveler-tim');
        
        if (!speechBubble || !mascot) {
            console.log('⚠️ Mascot elements not found');
            return;
        }
        
        // Clear existing timeout
        if (this.mascotSpeechTimeout) {
            clearTimeout(this.mascotSpeechTimeout);
        }
        
        // Update message and show
        speechBubble.textContent = message;
        speechBubble.style.opacity = '1';
        speechBubble.style.transform = 'translateY(0)';
        
        // Animate mascot
        mascot.style.transform = 'scale(1.1)';
        setTimeout(() => {
            mascot.style.transform = '';
        }, 200);
        
        // Hide after duration
        this.mascotSpeechTimeout = setTimeout(() => {
            speechBubble.style.opacity = '0';
            speechBubble.style.transform = 'translateY(10px)';
        }, duration);
    }
    
    showSuccess(message) {
        console.log('✅ Success:', message);
        this.mascotSay('Great job! ' + message);
    }
    
    showError(message) {
        console.log('❌ Error:', message);
        alert('Error: ' + message);
    }
    
    triggerCelebration() {
        console.log('🎉 Celebration triggered!');
        this.mascotSay('🎉 Fantastic! You did it! 🎉');
        
        // Simple celebration effect
        const mascot = document.getElementById('time-traveler-tim');
        if (mascot) {
            mascot.style.animation = 'none';
            setTimeout(() => {
                mascot.style.animation = 'bounce 0.5s ease 3';
            }, 10);
        }
    }
}

// ===================================
// INITIALIZE THE UI MANAGER
// ===================================

const uiManager = new UIManager();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        uiManager.initialize();
    });
} else {
    uiManager.initialize();
}

// ===================================
// EXPORT FOR OTHER FILES TO USE
// ===================================

window.TimeQuestUI = {
    manager: uiManager,
    showScreen: (screenId) => uiManager.showScreen(screenId),
    showSuccess: (message) => uiManager.showSuccess(message),
    showError: (message) => uiManager.showError(message),
    mascotSay: (message) => uiManager.mascotSay(message),
    triggerCelebration: () => uiManager.triggerCelebration()
};

console.log('✅ Time Quest UI Handler loaded successfully!');