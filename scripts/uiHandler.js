/**
 * TIME QUEST - UI HANDLER
 * The conductor that orchestrates all user interface interactions
 * Think of this as the stage manager for your interactive theater
 */

// ===================================
// UI MANAGER CLASS
// Central controller for all user interface interactions
// ===================================

class UIManager {
    constructor() {
        this.currentScreen = null;
        this.previousScreen = null;
        this.isTransitioning = false;
        this.activeModals = [];
        this.mascotSpeechTimeout = null;
        
        // FIXED: Only bind methods that actually exist
        this.handleButtonClick = this.handleButtonClick.bind(this);
        
        console.log('🎭 UI Manager initialized');
    }
    
    /**
     * Initialize the UI system
     */
    initialize() {
        this.attachGlobalEventListeners();
        this.initializeScreens();
        this.initializeMascot();
        this.setupResponsiveHandlers();
        this.loadInitialScreen();
        
        console.log('✅ UI system ready');
    }
    
    /**
     * Attach global event listeners
     */
    attachGlobalEventListeners() {
        // Navigation button handlers
        document.addEventListener('click', this.handleButtonClick);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeTopModal();
            }
        });
        
        // Window resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Prevent context menu on touch devices for better UX
        if (TimeQuestUtils && TimeQuestUtils.isTouchDevice()) {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        }
    }
    
    /**
     * Initialize all screens and their specific handlers
     */
    initializeScreens() {
        // Main menu handlers
        this.initializeMainMenu();
        
        // Tutorial mode handlers
        this.initializeTutorialMode();
        
        // Practice mode handlers
        this.initializePracticeMode();
        
        // Game mode handlers
        this.initializeGameMode();
        
        // Settings handlers
        this.initializeSettings();
    }
    
    /**
     * Initialize main menu functionality
     */
    initializeMainMenu() {
        const menuButtons = {
            'start-adventure-btn': () => this.startNewAdventure(),
            'continue-journey-btn': () => this.continueJourney(),
            'practice-mode-btn': () => this.showScreen('practice-mode'),
            'settings-btn': () => this.showScreen('settings')
        };
        
        Object.entries(menuButtons).forEach(([buttonId, handler]) => {
            const button = this.getElement(buttonId);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.animateElement(button, 'button-bounce');
                    this.playSound('button-click', 0.4);
                    handler();
                });
            }
        });
    }
    
    /**
     * Initialize tutorial mode functionality
     */
    initializeTutorialMode() {
        const tutorialButtons = {
            'back-to-menu': () => this.showScreen('main-menu'),
            'prev-lesson': () => this.previousLesson(),
            'next-lesson': () => this.nextLesson()
        };
        
        Object.entries(tutorialButtons).forEach(([buttonId, handler]) => {
            const button = this.getElement(buttonId);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }
    
    /**
     * Initialize practice mode functionality
     */
    initializePracticeMode() {
        const practiceButtons = {
            'practice-back-btn': () => this.showScreen('main-menu')
        };
        
        Object.entries(practiceButtons).forEach(([buttonId, handler]) => {
            const button = this.getElement(buttonId);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }
    
    /**
     * Initialize game mode functionality
     */
    initializeGameMode() {
        const gameButtons = {
            'game-back-btn': () => this.showScreen('main-menu')
        };
        
        Object.entries(gameButtons).forEach(([buttonId, handler]) => {
            const button = this.getElement(buttonId);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }
    
    /**
     * Initialize settings functionality
     */
    initializeSettings() {
        const settingsButtons = {
            'settings-back-btn': () => this.showScreen('main-menu'),
            'create-profile-btn': () => this.showCreateProfileModal()
        };
        
        Object.entries(settingsButtons).forEach(([buttonId, handler]) => {
            const button = this.getElement(buttonId);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
        
        // Settings toggles and selects
        this.initializeSettingsControls();
    }
    
    /**
     * Initialize settings controls (toggles, selects, etc.)
     */
    initializeSettingsControls() {
        // Sound effects toggle
        const soundToggle = this.getElement('sound-effects-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                if (window.TimeQuestStorage) {
                    TimeQuestStorage.updateSettings({ soundEffects: e.target.checked });
                }
                this.mascotSay(e.target.checked ? "Sound effects on! 🔊" : "Sound effects off 🔇");
            });
        }
        
        // Background music toggle
        const musicToggle = this.getElement('background-music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('change', (e) => {
                if (window.TimeQuestStorage) {
                    TimeQuestStorage.updateSettings({ backgroundMusic: e.target.checked });
                }
                if (window.TimeQuestAudio) {
                    if (e.target.checked) {
                        window.TimeQuestAudio.playBackgroundMusic();
                    } else {
                        window.TimeQuestAudio.stopBackgroundMusic();
                    }
                }
            });
        }
        
        // Voice narration toggle
        const voiceToggle = this.getElement('voice-narration-toggle');
        if (voiceToggle) {
            voiceToggle.addEventListener('change', (e) => {
                if (window.TimeQuestStorage) {
                    TimeQuestStorage.updateSettings({ voiceNarration: e.target.checked });
                }
            });
        }
        
        // Text size selector
        const textSizeSelect = this.getElement('text-size-select');
        if (textSizeSelect) {
            textSizeSelect.addEventListener('change', (e) => {
                if (window.TimeQuestStorage) {
                    TimeQuestStorage.updateSettings({ textSize: e.target.value });
                }
                this.applyTextSize(e.target.value);
            });
        }
        
        // Color theme selector
        const themeSelect = this.getElement('color-theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                if (window.TimeQuestStorage) {
                    TimeQuestStorage.updateSettings({ colorTheme: e.target.value });
                }
                this.applyColorTheme(e.target.value);
            });
        }
    }
    
    /**
     * Initialize mascot interactions
     */
    initializeMascot() {
        const mascot = this.getElement('time-traveler-tim');
        if (mascot) {
            mascot.addEventListener('click', () => {
                this.mascotInteraction();
            });
            
            // Random mascot comments
            this.scheduleRandomMascotComment();
        }
    }
    
    /**
     * Setup responsive behavior handlers
     */
    setupResponsiveHandlers() {
        // Adjust UI based on screen size
        this.handleResize();
        
        // Touch-specific adjustments
        if (window.TimeQuestUtils && TimeQuestUtils.isTouchDevice()) {
            document.body.classList.add('touch-device');
        }
    }
    
    /**
     * Load the initial screen based on user state
     */
    loadInitialScreen() {
        // Hide loading screen after a delay
        setTimeout(() => {
            this.hideLoadingScreen();
            
            // Show appropriate starting screen
            const currentProfile = window.TimeQuestStorage ? TimeQuestStorage.getCurrentProfile() : null;
            if (currentProfile) {
                this.showScreen('main-menu');
                this.mascotSay(`Welcome back, ${currentProfile.name}! Ready for more time adventures?`);
            } else {
                this.showScreen('main-menu');
                this.showCreateProfileModal();
            }
        }, 2000);
    }
    
    /**
     * Generic button click handler
     */
    handleButtonClick(event) {
        const button = event.target.closest('button, .clickable');
        if (!button || this.isTransitioning) return;
        
        // Add click animation to all buttons
        if (button.tagName === 'BUTTON') {
            this.animateElement(button, 'button-bounce');
        }
        
        // Play click sound
        this.playSound('button-click', 0.3);
    }
    
    /**
     * Show a specific screen with transition
     */
    showScreen(screenId, transition = 'fade') {
        if (this.isTransitioning) {
            console.warn('Screen transition already in progress');
            return;
        }
        
        const newScreen = this.getElement(screenId);
        if (!newScreen) {
            console.error(`Screen ${screenId} not found`);
            return;
        }
        
        this.isTransitioning = true;
        this.previousScreen = this.currentScreen;
        
        // Hide current screen
        if (this.currentScreen) {
            this.hideScreen(this.currentScreen, transition);
        }
        
        // Show new screen after transition
        setTimeout(() => {
            this.currentScreen = screenId;
            this.displayScreen(newScreen, transition);
            this.onScreenChange(screenId);
            this.isTransitioning = false;
        }, this.currentScreen ? 300 : 0);
        
        console.log(`📱 Transitioning to screen: ${screenId}`);
    }
    
    /**
     * Hide a screen with animation
     */
    hideScreen(screenId, transition) {
        const screen = this.getElement(screenId);
        if (!screen) return;
        
        const animationClass = transition === 'slide' ? 'screen-slide-out-left' : 'screen-fade-out';
        this.animateElement(screen, animationClass, () => {
            this.removeClass(screen, 'active');
        });
    }
    
    /**
     * Display a screen with animation
     */
    displayScreen(screen, transition) {
        this.addClass(screen, 'active');
        
        const animationClass = transition === 'slide' ? 'screen-slide-in-right' : 'screen-fade-in';
        this.animateElement(screen, animationClass);
    }
    
    /**
     * Handle screen-specific initialization when screen changes
     */
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
    
    /**
     * Hide the loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = this.getElement('loading-screen');
        if (loadingScreen) {
            this.animateElement(loadingScreen, 'screen-fade-out', () => {
                this.removeClass(loadingScreen, 'active');
            });
        }
    }
    
    /**
     * Start a new adventure
     */
    startNewAdventure() {
        const profile = window.TimeQuestStorage ? TimeQuestStorage.getCurrentProfile() : null;
        if (!profile) {
            this.showCreateProfileModal();
            return;
        }
        
        this.mascotSay("Let's start your time adventure! 🚀");
        this.showScreen('tutorial-mode');
    }
    
    /**
     * Continue an existing journey
     */
    continueJourney() {
        const profile = window.TimeQuestStorage ? TimeQuestStorage.getCurrentProfile() : null;
        if (!profile) {
            this.mascotSay("You need to create a profile first!");
            this.showCreateProfileModal();
            return;
        }
        
        if (profile.lessonsCompleted && profile.lessonsCompleted.length === 0) {
            this.mascotSay("Let's start with the first lesson!");
            this.showScreen('tutorial-mode');
        } else {
            this.showScreen('game-mode');
        }
    }
    
    /**
     * Refresh main menu display
     */
    refreshMainMenu() {
        const profile = window.TimeQuestStorage ? TimeQuestStorage.getCurrentProfile() : null;
        const continueButton = this.getElement('continue-journey-btn');
        
        if (profile && continueButton) {
            if (profile.lessonsCompleted && profile.lessonsCompleted.length > 0) {
                continueButton.style.display = 'flex';
                this.updateButtonText(continueButton, `Continue ${profile.name}'s Journey`);
            } else {
                continueButton.style.display = 'none';
            }
        }
    }
    
    /**
     * Update button text while preserving icon
     */
    updateButtonText(button, newText) {
        const textSpan = button.querySelector('.button-text');
        if (textSpan) {
            textSpan.textContent = newText;
        }
    }
    
    /**
     * Initialize tutorial session
     */
    initializeTutorialSession() {
        // Load or create tutorial manager instance
        if (window.TimeQuestTutorial) {
            window.TimeQuestTutorial.initialize();
        }
        this.mascotSay("Let's learn about telling time! 📚");
    }
    
    /**
     * Initialize practice session
     */
    initializePracticeSession() {
        // Load or create practice manager instance
        if (window.TimeQuestPractice) {
            window.TimeQuestPractice.initialize();
        }
        this.mascotSay("Time to practice your skills! 🎯");
    }
    
    /**
     * Initialize game session
     */
    initializeGameSession() {
        // Load or create game manager instance
        if (window.TimeQuestGameManager) {
            window.TimeQuestGameManager.initialize();
        }
        this.mascotSay("Let the games begin! 🎮");
    }
    
    /**
     * Refresh settings display
     */
    refreshSettings() {
        const settings = window.TimeQuestStorage ? TimeQuestStorage.getSettings() : {};
        
        // Update toggle states
        this.updateToggle('sound-effects-toggle', settings.soundEffects);
        this.updateToggle('background-music-toggle', settings.backgroundMusic);
        this.updateToggle('voice-narration-toggle', settings.voiceNarration);
        
        // Update select values
        this.updateSelect('text-size-select', settings.textSize);
        this.updateSelect('color-theme-select', settings.colorTheme);
        
        // Update profile list
        this.refreshProfileList();
    }
    
    /**
     * Update toggle switch state
     */
    updateToggle(toggleId, checked) {
        const toggle = this.getElement(toggleId);
        if (toggle) {
            toggle.checked = checked;
        }
    }
    
    /**
     * Update select element value
     */
    updateSelect(selectId, value) {
        const select = this.getElement(selectId);
        if (select) {
            select.value = value;
        }
    }
    
    /**
     * Refresh the profile list in settings
     */
    refreshProfileList() {
        const profileList = this.getElement('profile-list');
        if (!profileList || !window.TimeQuestStorage) return;
        
        const profiles = TimeQuestStorage.getAllProfiles();
        const currentProfileId = TimeQuestStorage.getCurrentProfileId();
        
        profileList.innerHTML = '';
        
        profiles.forEach(profile => {
            const isActive = profile.id === currentProfileId;
            const profileElement = this.createProfileElement(profile, isActive);
            profileList.appendChild(profileElement);
        });
    }
    
    /**
     * Create a profile element for the settings list
     */
    createProfileElement(profile, isActive) {
        const div = document.createElement('div');
        div.className = `profile-item ${isActive ? 'active' : ''}`;
        
        div.innerHTML = `
            <div class="profile-info">
                <span class="profile-avatar">${profile.avatar}</span>
                <div class="profile-details">
                    <span class="profile-name">${profile.name}</span>
                    <span class="profile-stats">Level ${profile.currentLevel || 1} • ${profile.totalStars || 0} stars</span>
                </div>
            </div>
            <div class="profile-actions">
                ${!isActive ? `<button class="profile-button" onclick="uiManager.switchToProfile('${profile.id}')">Switch</button>` : '<span class="active-badge">Active</span>'}
                <button class="profile-button delete" onclick="uiManager.deleteProfile('${profile.id}')">Delete</button>
            </div>
        `;
        
        return div;
    }
    
    /**
     * Switch to a different profile
     */
    switchToProfile(profileId) {
        if (window.TimeQuestStorage) {
            TimeQuestStorage.setCurrentProfile(profileId);
            const profile = TimeQuestStorage.getProfile(profileId);
            this.mascotSay(`Welcome, ${profile.name}!`);
            this.refreshSettings();
            this.refreshMainMenu();
        }
    }
    
    /**
     * Delete a profile with confirmation
     */
    deleteProfile(profileId) {
        if (!window.TimeQuestStorage) return;
        
        const profile = TimeQuestStorage.getProfile(profileId);
        if (!profile) return;
        
        this.showConfirmModal(
            `Delete ${profile.name}'s profile?`,
            'This will permanently delete all progress and cannot be undone.',
            () => {
                TimeQuestStorage.deleteProfile(profileId);
                this.refreshSettings();
                this.mascotSay("Profile deleted successfully.");
            }
        );
    }
    
    /**
     * Show create profile modal
     */
    showCreateProfileModal() {
        const modal = this.createModal('create-profile-modal', 'Create New Profile', `
            <div class="profile-form">
                <label>
                    <span>Name:</span>
                    <input type="text" id="profile-name-input" maxlength="20" placeholder="Enter your name">
                </label>
                <label>
                    <span>Choose an avatar:</span>
                    <div class="avatar-grid">
                        <button type="button" class="avatar-option" data-avatar="🧙‍♂️">🧙‍♂️</button>
                        <button type="button" class="avatar-option" data-avatar="👧">👧</button>
                        <button type="button" class="avatar-option" data-avatar="👦">👦</button>
                        <button type="button" class="avatar-option" data-avatar="🦸‍♀️">🦸‍♀️</button>
                        <button type="button" class="avatar-option" data-avatar="🦸‍♂️">🦸‍♂️</button>
                        <button type="button" class="avatar-option" data-avatar="🐱">🐱</button>
                        <button type="button" class="avatar-option" data-avatar="🐶">🐶</button>
                        <button type="button" class="avatar-option" data-avatar="🚀">🚀</button>
                    </div>
                </label>
            </div>
        `, [
            { text: 'Cancel', style: 'secondary', action: () => this.closeTopModal() },
            { text: 'Create Profile', style: 'primary', action: () => this.createNewProfile() }
        ]);
        
        // Handle avatar selection
        modal.querySelectorAll('.avatar-option').forEach(button => {
            button.addEventListener('click', () => {
                modal.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
                button.classList.add('selected');
            });
        });
        
        // Select first avatar by default
        modal.querySelector('.avatar-option').classList.add('selected');
        
        // Focus on name input
        setTimeout(() => {
            const nameInput = modal.querySelector('#profile-name-input');
            if (nameInput) nameInput.focus();
        }, 100);
    }
    
    /**
     * Create a new profile from modal input
     */
    createNewProfile() {
        const modal = this.getTopModal();
        const nameInput = modal.querySelector('#profile-name-input');
        const selectedAvatar = modal.querySelector('.avatar-option.selected');
        
        if (!nameInput || !selectedAvatar) return;
        
        const name = nameInput.value.trim();
        const avatar = selectedAvatar.getAttribute('data-avatar');
        
        if (!name) {
            this.showError('Please enter a name');
            return;
        }
        
        if (!window.TimeQuestStorage) {
            this.showError('Storage not available');
            return;
        }
        
        try {
            const profile = TimeQuestStorage.createProfile(name, avatar);
            TimeQuestStorage.setCurrentProfile(profile.id);
            this.closeTopModal();
            this.mascotSay(`Welcome to Time Quest, ${name}! 🎉`);
            this.refreshMainMenu();
            this.refreshSettings();
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    /**
     * Apply text size setting
     */
    applyTextSize(size) {
        const sizeClasses = {
            'small': 'text-size-small',
            'medium': 'text-size-medium',
            'large': 'text-size-large'
        };
        
        // Remove existing size classes
        Object.values(sizeClasses).forEach(className => {
            document.body.classList.remove(className);
        });
        
        // Add new size class
        if (sizeClasses[size]) {
            document.body.classList.add(sizeClasses[size]);
        }
    }
    
    /**
     * Apply color theme setting
     */
    applyColorTheme(theme) {
        const themeClasses = {
            'bright': 'theme-bright',
            'soft': 'theme-soft',
            'high-contrast': 'theme-high-contrast'
        };
        
        // Remove existing theme classes
        Object.values(themeClasses).forEach(className => {
            document.body.classList.remove(className);
        });
        
        // Add new theme class
        if (themeClasses[theme]) {
            document.body.classList.add(themeClasses[theme]);
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Adjust layout for different screen sizes
        if (window.TimeQuestUtils) {
            if (TimeQuestUtils.isMobileSize()) {
                document.body.classList.add('mobile-layout');
            } else {
                document.body.classList.remove('mobile-layout');
            }
            
            if (TimeQuestUtils.isTabletSize()) {
                document.body.classList.add('tablet-layout');
            } else {
                document.body.classList.remove('tablet-layout');
            }
        }
    }
    
    // ===================================
    // MASCOT INTERACTION METHODS
    // ===================================
    
    /**
     * Make the mascot say something
     */
    mascotSay(message, duration = 3000) {
        const speechBubble = this.getElement('mascot-speech');
        const mascot = this.getElement('time-traveler-tim');
        
        if (!speechBubble || !mascot) return;
        
        // Clear existing timeout
        if (this.mascotSpeechTimeout) {
            clearTimeout(this.mascotSpeechTimeout);
        }
        
        // Update message and show
        speechBubble.textContent = message;
        this.addClass(speechBubble, 'speech-bubble-pop');
        
        // Animate mascot
        this.animateElement(mascot, 'mascot-excited');
        
        // Hide after duration
        this.mascotSpeechTimeout = setTimeout(() => {
            this.removeClass(speechBubble, 'speech-bubble-pop');
        }, duration);
    }
    
    /**
     * Handle mascot click interaction
     */
    mascotInteraction() {
        const encouragements = [
            "You're doing great! Keep learning! 🌟",
            "Time to have some fun with time! ⏰",
            "Every minute is a chance to learn something new! 📚",
            "Let's explore the wonderful world of time! 🗺️",
            "Ready for your next time adventure? 🚀",
            "Practice makes perfect! You've got this! 💪",
            "Time flies when you're having fun learning! 🦋"
        ];
        
        const message = this.randomChoice(encouragements);
        this.mascotSay(message);
        
        const mascot = this.getElement('time-traveler-tim');
        this.animateElement(mascot, 'mascot-encouraging');
    }
    
    /**
     * Schedule random mascot comments
     */
    scheduleRandomMascotComment() {
        const delay = this.randomInt(30000, 60000); // 30-60 seconds
        
        setTimeout(() => {
            if (this.currentScreen === 'main-menu') {
                const comments = [
                    "Psst! Ready for a time adventure? 🕐",
                    "Time is ticking... let's learn! ⏱️",
                    "What time is it? Adventure time! 🎮"
                ];
                
                this.mascotSay(this.randomChoice(comments), 2000);
            }
            
            this.scheduleRandomMascotComment(); // Schedule next comment
        }, delay);
    }
    
    // ===================================
    // MODAL AND POPUP METHODS
    // ===================================
    
    /**
     * Create and show a modal dialog
     */
    createModal(id, title, content, buttons = []) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = id;
        
        overlay.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="uiManager.closeTopModal()">×</button>
                </div>
                <div class="modal-content">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttons.map(btn => 
                        `<button class="modal-button ${btn.style}" onclick="(${btn.action})()">${btn.text}</button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.activeModals.push(overlay);
        
        // Show with animation
        this.animateElement(overlay, 'zoom-in');
        
        return overlay;
    }
    
    /**
     * Show a confirmation modal
     */
    showConfirmModal(title, message, onConfirm) {
        this.createModal('confirm-modal', title, `<p>${message}</p>`, [
            { text: 'Cancel', style: 'secondary', action: () => this.closeTopModal() },
            { text: 'Confirm', style: 'primary', action: () => { onConfirm(); this.closeTopModal(); } }
        ]);
    }
    
    /**
     * Show an error message
     */
    showError(message) {
        this.createModal('error-modal', 'Oops!', `<p>${message}</p>`, [
            { text: 'OK', style: 'primary', action: () => this.closeTopModal() }
        ]);
    }
    
    /**
     * Show a success message with celebration
     */
    showSuccess(message, celebrate = true) {
        this.showNotification(message, 'success');
        
        if (celebrate) {
            this.triggerCelebration();
        }
    }
    
    /**
     * Show a notification toast
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show with animation
        this.animateElement(notification, 'slide-in-bottom');
        
        // Remove after duration
        setTimeout(() => {
            this.animateElement(notification, 'fadeOut', () => {
                document.body.removeChild(notification);
            });
        }, duration);
    }
    
    /**
     * Close the top modal
     */
    closeTopModal() {
        if (this.activeModals.length === 0) return;
        
        const modal = this.activeModals.pop();
        this.animateElement(modal, 'fadeOut', () => {
            document.body.removeChild(modal);
        });
    }
    
    /**
     * Get the current top modal
     */
    getTopModal() {
        return this.activeModals[this.activeModals.length - 1];
    }
    
    /**
     * Close all modals
     */
    closeAllModals() {
        while (this.activeModals.length > 0) {
            this.closeTopModal();
        }
    }
    
    /**
     * Trigger celebration effects
     */
    triggerCelebration() {
        // Play celebration sound
        this.playSound('success-sound', 0.7);
        
        // Mascot celebration
        const mascot = this.getElement('time-traveler-tim');
        if (mascot) {
            this.animateElement(mascot, 'mascot-excited');
        }
        
        // Create confetti effect
        this.createConfetti();
    }
    
    /**
     * Create confetti celebration effect
     */
    createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        document.body.appendChild(confettiContainer);
        
        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            document.body.removeChild(confettiContainer);
        }, 4000);
    }
    
    // ===================================
    // UTILITY METHODS (fallbacks for when TimeQuestUtils isn't loaded)
    // ===================================
    
    getElement(id) {
        return document.getElementById(id);
    }
    
    addClass(element, className) {
        if (element && element.classList) {
            element.classList.add(className);
        }
    }
    
    removeClass(element, className) {
        if (element && element.classList) {
            element.classList.remove(className);
        }
    }
    
    animateElement(element, animationClass, callback) {
        if (!element) return;
        
        // Add the animation class
        this.addClass(element, animationClass);
        
        // Listen for animation to finish
        const handleAnimationEnd = () => {
            this.removeClass(element, animationClass);
            element.removeEventListener('animationend', handleAnimationEnd);
            if (callback) callback();
        };
        
        element.addEventListener('animationend', handleAnimationEnd);
    }
    
    playSound(soundId, volume = 1.0) {
        if (window.TimeQuestUtils && TimeQuestUtils.playSound) {
            TimeQuestUtils.playSound(soundId, volume);
        }
        // Silently fail if sound system not available
    }
    
    randomChoice(array) {
        if (array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    }
    
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// ===================================
// INITIALIZE THE UI MANAGER
// ===================================

// Create global UI manager instance
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