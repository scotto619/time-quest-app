/**
 * TIME QUEST - SETTINGS MANAGER
 * The ultimate control center for customizing every aspect of the learning experience
 * Think of this as your mission control and customization headquarters
 */

// ===================================
// SETTINGS CONFIGURATION
// All possible settings and their options
// ===================================

const SETTINGS_CONFIG = {
    categories: {
        audio: {
            name: '🔊 Audio & Sound',
            description: 'Control music, sound effects, and voice narration',
            icon: '🔊',
            priority: 1
        },
        visual: {
            name: '👁️ Visual & Display',
            description: 'Customize appearance and accessibility',
            icon: '👁️',
            priority: 2
        },
        gameplay: {
            name: '🎮 Gameplay & Difficulty',
            description: 'Adjust learning pace and challenge levels',
            icon: '🎮',
            priority: 3
        },
        profiles: {
            name: '👤 User Profiles',
            description: 'Manage student accounts and progress',
            icon: '👤',
            priority: 4
        },
        data: {
            name: '💾 Data & Privacy',
            description: 'Backup, restore, and privacy controls',
            icon: '💾',
            priority: 5
        },
        advanced: {
            name: '⚙️ Advanced Options',
            description: 'Developer and administrative settings',
            icon: '⚙️',
            priority: 6
        }
    },
    
    settings: {
        // Audio Settings
        soundEffects: {
            category: 'audio',
            name: 'Sound Effects',
            description: 'Button clicks, success sounds, and feedback audio',
            type: 'toggle',
            default: true,
            requiresRestart: false
        },
        backgroundMusic: {
            category: 'audio',
            name: 'Background Music',
            description: 'Ambient music during learning activities',
            type: 'toggle',
            default: true,
            requiresRestart: false
        },
        voiceNarration: {
            category: 'audio',
            name: 'Voice Narration',
            description: 'Text-to-speech for instructions and feedback',
            type: 'toggle',
            default: true,
            requiresRestart: false
        },
        masterVolume: {
            category: 'audio',
            name: 'Master Volume',
            description: 'Overall audio level control',
            type: 'slider',
            min: 0,
            max: 100,
            default: 80,
            unit: '%',
            requiresRestart: false
        },
        voiceSpeed: {
            category: 'audio',
            name: 'Narration Speed',
            description: 'How fast the voice speaks',
            type: 'select',
            options: [
                { value: 0.7, label: 'Slow' },
                { value: 0.9, label: 'Normal' },
                { value: 1.1, label: 'Fast' }
            ],
            default: 0.9,
            requiresRestart: false
        },
        
        // Visual Settings
        textSize: {
            category: 'visual',
            name: 'Text Size',
            description: 'Size of all text throughout the app',
            type: 'select',
            options: [
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
                { value: 'extra-large', label: 'Extra Large' }
            ],
            default: 'medium',
            requiresRestart: false
        },
        colorTheme: {
            category: 'visual',
            name: 'Color Theme',
            description: 'Visual appearance and contrast level',
            type: 'select',
            options: [
                { value: 'bright', label: 'Bright & Colorful' },
                { value: 'soft', label: 'Soft & Gentle' },
                { value: 'high-contrast', label: 'High Contrast' },
                { value: 'dark', label: 'Dark Mode' }
            ],
            default: 'bright',
            requiresRestart: false
        },
        animations: {
            category: 'visual',
            name: 'Animations',
            description: 'Movement and transition effects',
            type: 'select',
            options: [
                { value: 'full', label: 'Full Animations' },
                { value: 'reduced', label: 'Reduced Motion' },
                { value: 'minimal', label: 'Minimal' },
                { value: 'none', label: 'None (Static)' }
            ],
            default: 'full',
            requiresRestart: false
        },
        clockStyle: {
            category: 'visual',
            name: 'Clock Design',
            description: 'Appearance of interactive clocks',
            type: 'select',
            options: [
                { value: 'classic', label: 'Classic' },
                { value: 'modern', label: 'Modern' },
                { value: 'colorful', label: 'Colorful' },
                { value: 'simple', label: 'Simple' }
            ],
            default: 'classic',
            requiresRestart: false
        },
        
        // Gameplay Settings
        defaultDifficulty: {
            category: 'gameplay',
            name: 'Starting Difficulty',
            description: 'Default challenge level for new activities',
            type: 'select',
            options: [
                { value: 'beginner', label: 'Beginner' },
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' }
            ],
            default: 'easy',
            requiresRestart: false
        },
        adaptiveDifficulty: {
            category: 'gameplay',
            name: 'Adaptive Difficulty',
            description: 'Automatically adjust challenge based on performance',
            type: 'toggle',
            default: true,
            requiresRestart: false
        },
        hintsEnabled: {
            category: 'gameplay',
            name: 'Hints Available',
            description: 'Allow students to request help during challenges',
            type: 'toggle',
            default: true,
            requiresRestart: false
        },
        timeToleranceMinutes: {
            category: 'gameplay',
            name: 'Time Tolerance',
            description: 'How precise time answers need to be',
            type: 'select',
            options: [
                { value: 1, label: 'Precise (1 minute)' },
                { value: 2, label: 'Standard (2 minutes)' },
                { value: 3, label: 'Forgiving (3 minutes)' },
                { value: 5, label: 'Very Forgiving (5 minutes)' }
            ],
            default: 2,
            requiresRestart: false
        },
        celebrationLevel: {
            category: 'gameplay',
            name: 'Celebration Intensity',
            description: 'How elaborate success celebrations are',
            type: 'select',
            options: [
                { value: 'minimal', label: 'Minimal' },
                { value: 'standard', label: 'Standard' },
                { value: 'enthusiastic', label: 'Enthusiastic' },
                { value: 'epic', label: 'Epic' }
            ],
            default: 'standard',
            requiresRestart: false
        },
        
        // Profile Settings
        allowMultipleProfiles: {
            category: 'profiles',
            name: 'Multiple Profiles',
            description: 'Allow multiple student accounts',
            type: 'toggle',
            default: true,
            requiresRestart: false
        },
        profileSwitchingEnabled: {
            category: 'profiles',
            name: 'Profile Switching',
            description: 'Allow students to switch between profiles',
            type: 'toggle',
            default: true,
            requiresRestart: false
        },
        parentalControls: {
            category: 'profiles',
            name: 'Parental Controls',
            description: 'Require permission for certain actions',
            type: 'toggle',
            default: false,
            requiresRestart: false
        },
        
        // Data Settings
        autoSaveProgress: {
            category: 'data',
            name: 'Auto-Save Progress',
            description: 'Automatically save student progress',
            type: 'toggle',
            default: true,
            requiresRestart: false
        },
        dataRetentionDays: {
            category: 'data',
            name: 'Data Retention',
            description: 'How long to keep student data',
            type: 'select',
            options: [
                { value: 30, label: '30 Days' },
                { value: 90, label: '90 Days' },
                { value: 365, label: '1 Year' },
                { value: -1, label: 'Forever' }
            ],
            default: 365,
            requiresRestart: false
        },
        analyticsEnabled: {
            category: 'data',
            name: 'Learning Analytics',
            description: 'Track detailed learning progress and patterns',
            type: 'toggle',
            default: true,
            requiresRestart: false
        },
        
        // Advanced Settings
        developerMode: {
            category: 'advanced',
            name: 'Developer Mode',
            description: 'Enable advanced debugging and testing features',
            type: 'toggle',
            default: false,
            requiresRestart: true
        },
        performanceMode: {
            category: 'advanced',
            name: 'Performance Mode',
            description: 'Optimize for slower devices',
            type: 'toggle',
            default: false,
            requiresRestart: true
        },
        language: {
            category: 'advanced',
            name: 'Language',
            description: 'Interface and narration language',
            type: 'select',
            options: [
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' }
            ],
            default: 'en',
            requiresRestart: true
        }
    }
};

// ===================================
// SETTINGS MANAGER CLASS
// Central controller for all app configuration
// ===================================

class SettingsManager {
    constructor() {
        this.currentSettings = {};
        this.originalSettings = {};
        this.unsavedChanges = false;
        this.activeCategory = 'audio';
        this.isInitialized = false;
        
        // UI elements
        this.settingsContainer = null;
        this.categoryNavigation = null;
        this.settingsContent = null;
        this.saveButton = null;
        this.resetButton = null;
        
        console.log('⚙️ Settings Manager created');
    }
    
    /**
     * Initialize the settings system
     */
    initialize() {
        this.loadCurrentSettings();
        this.setupSettingsUI();
        this.attachEventListeners();
        this.displayCategory(this.activeCategory);
        this.updateProfileSection();
        
        this.isInitialized = true;
        console.log('✅ Settings system initialized');
    }
    
    /**
     * Load current settings from storage
     */
    loadCurrentSettings() {
        this.currentSettings = TimeQuestStorage.getSettings();
        this.originalSettings = { ...this.currentSettings };
        
        // Ensure all settings have values
        Object.entries(SETTINGS_CONFIG.settings).forEach(([key, config]) => {
            if (this.currentSettings[key] === undefined) {
                this.currentSettings[key] = config.default;
            }
        });
    }
    
    /**
     * Set up settings UI structure
     */
    setupSettingsUI() {
        this.settingsContainer = TimeQuestUtils.getElement('settings-content');
        if (!this.settingsContainer) {
            console.error('Settings container not found');
            return;
        }
        
        this.settingsContainer.innerHTML = `
            <div class="settings-manager">
                <div class="settings-header">
                    <h2>⚙️ Time Quest Settings</h2>
                    <p>Customize your learning experience</p>
                    <div class="settings-actions">
                        <button id="export-settings-btn" class="settings-action-btn">
                            📤 Export Settings
                        </button>
                        <button id="import-settings-btn" class="settings-action-btn">
                            📥 Import Settings
                        </button>
                        <button id="reset-all-btn" class="settings-action-btn danger">
                            🔄 Reset All
                        </button>
                    </div>
                </div>
                
                <div class="settings-body">
                    <nav class="settings-navigation" id="settings-nav">
                        ${this.createCategoryNavigation()}
                    </nav>
                    
                    <main class="settings-content" id="settings-main-content">
                        <!-- Settings content will be loaded here -->
                    </main>
                </div>
                
                <div class="settings-footer">
                    <div class="unsaved-changes" id="unsaved-indicator" style="display: none;">
                        ⚠️ You have unsaved changes
                    </div>
                    <div class="settings-footer-actions">
                        <button id="discard-changes-btn" class="footer-btn secondary">
                            Cancel Changes
                        </button>
                        <button id="save-settings-btn" class="footer-btn primary">
                            💾 Save Settings
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Store references
        this.categoryNavigation = TimeQuestUtils.getElement('settings-nav');
        this.settingsContent = TimeQuestUtils.getElement('settings-main-content');
        this.saveButton = TimeQuestUtils.getElement('save-settings-btn');
        this.unsavedIndicator = TimeQuestUtils.getElement('unsaved-indicator');
    }
    
    /**
     * Create category navigation
     */
    createCategoryNavigation() {
        const sortedCategories = Object.entries(SETTINGS_CONFIG.categories)
            .sort(([,a], [,b]) => a.priority - b.priority);
        
        let html = '<ul class="category-list">';
        
        sortedCategories.forEach(([categoryId, category]) => {
            html += `
                <li class="category-item ${categoryId === this.activeCategory ? 'active' : ''}" 
                    data-category="${categoryId}">
                    <span class="category-icon">${category.icon}</span>
                    <div class="category-info">
                        <span class="category-name">${category.name}</span>
                        <span class="category-description">${category.description}</span>
                    </div>
                </li>
            `;
        });
        
        html += '</ul>';
        return html;
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Category navigation
        if (this.categoryNavigation) {
            this.categoryNavigation.addEventListener('click', (e) => {
                const categoryItem = e.target.closest('.category-item');
                if (categoryItem) {
                    const categoryId = categoryItem.getAttribute('data-category');
                    this.switchCategory(categoryId);
                }
            });
        }
        
        // Save button
        if (this.saveButton) {
            this.saveButton.addEventListener('click', () => {
                this.saveAllSettings();
            });
        }
        
        // Discard changes button
        const discardBtn = TimeQuestUtils.getElement('discard-changes-btn');
        if (discardBtn) {
            discardBtn.addEventListener('click', () => {
                this.discardChanges();
            });
        }
        
        // Header action buttons
        const exportBtn = TimeQuestUtils.getElement('export-settings-btn');
        const importBtn = TimeQuestUtils.getElement('import-settings-btn');
        const resetBtn = TimeQuestUtils.getElement('reset-all-btn');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportSettings());
        }
        
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importSettings());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetAllSettings());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                    e.preventDefault();
                    this.saveAllSettings();
                }
            }
        });
    }
    
    /**
     * Switch to a different settings category
     */
    switchCategory(categoryId) {
        if (categoryId === this.activeCategory) return;
        
        // Update navigation
        const categoryItems = this.categoryNavigation.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            if (item.getAttribute('data-category') === categoryId) {
                TimeQuestUtils.addClass(item, 'active');
            } else {
                TimeQuestUtils.removeClass(item, 'active');
            }
        });
        
        this.activeCategory = categoryId;
        this.displayCategory(categoryId);
        
        // Smooth scroll to top of content
        if (this.settingsContent) {
            this.settingsContent.scrollTop = 0;
        }
    }
    
    /**
     * Display settings for a specific category
     */
    displayCategory(categoryId) {
        if (!this.settingsContent) return;
        
        const category = SETTINGS_CONFIG.categories[categoryId];
        if (!category) return;
        
        // Get settings for this category
        const categorySettings = Object.entries(SETTINGS_CONFIG.settings)
            .filter(([,setting]) => setting.category === categoryId);
        
        let html = `
            <div class="category-content">
                <div class="category-header">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                </div>
                <div class="settings-list">
        `;
        
        // Special handling for profiles category
        if (categoryId === 'profiles') {
            html += this.createProfileManagementSection();
        }
        
        // Regular settings for this category
        categorySettings.forEach(([settingId, setting]) => {
            html += this.createSettingControl(settingId, setting);
        });
        
        html += `
                </div>
            </div>
        `;
        
        this.settingsContent.innerHTML = html;
        
        // Attach setting-specific event listeners
        this.attachSettingListeners();
        
        // Update profile section if needed
        if (categoryId === 'profiles') {
            this.updateProfileSection();
        }
    }
    
    /**
     * Create profile management section
     */
    createProfileManagementSection() {
        return `
            <div class="profile-management-section">
                <h4>👤 Student Profiles</h4>
                <div class="profile-actions">
                    <button id="create-new-profile-btn" class="profile-action-btn primary">
                        ➕ Create New Profile
                    </button>
                    <button id="bulk-profile-import-btn" class="profile-action-btn secondary">
                        📥 Import Class List
                    </button>
                </div>
                <div class="profiles-list" id="profiles-display">
                    <!-- Profiles will be loaded here -->
                </div>
            </div>
        `;
    }
    
    /**
     * Create control for a specific setting
     */
    createSettingControl(settingId, setting) {
        const currentValue = this.currentSettings[settingId];
        
        let controlHTML = '';
        
        switch (setting.type) {
            case 'toggle':
                controlHTML = `
                    <label class="toggle-control">
                        <input type="checkbox" 
                               id="setting-${settingId}" 
                               ${currentValue ? 'checked' : ''}
                               data-setting="${settingId}">
                        <span class="toggle-slider"></span>
                    </label>
                `;
                break;
                
            case 'select':
                controlHTML = `
                    <select id="setting-${settingId}" 
                            class="setting-select" 
                            data-setting="${settingId}">
                        ${setting.options.map(option => 
                            `<option value="${option.value}" ${option.value === currentValue ? 'selected' : ''}>
                                ${option.label}
                            </option>`
                        ).join('')}
                    </select>
                `;
                break;
                
            case 'slider':
                controlHTML = `
                    <div class="slider-control">
                        <input type="range" 
                               id="setting-${settingId}" 
                               min="${setting.min}" 
                               max="${setting.max}" 
                               value="${currentValue}" 
                               data-setting="${settingId}"
                               class="setting-slider">
                        <span class="slider-value">${currentValue}${setting.unit || ''}</span>
                    </div>
                `;
                break;
                
            case 'text':
                controlHTML = `
                    <input type="text" 
                           id="setting-${settingId}" 
                           value="${currentValue}" 
                           data-setting="${settingId}"
                           class="setting-input">
                `;
                break;
        }
        
        return `
            <div class="setting-item ${setting.requiresRestart ? 'requires-restart' : ''}">
                <div class="setting-info">
                    <label for="setting-${settingId}" class="setting-label">
                        ${setting.name}
                    </label>
                    <p class="setting-description">${setting.description}</p>
                    ${setting.requiresRestart ? '<span class="restart-notice">⚠️ Requires restart</span>' : ''}
                </div>
                <div class="setting-control">
                    ${controlHTML}
                </div>
            </div>
        `;
    }
    
    /**
     * Attach event listeners to setting controls
     */
    attachSettingListeners() {
        // Toggle controls
        const toggles = this.settingsContent.querySelectorAll('input[type="checkbox"][data-setting]');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.updateSetting(e.target.getAttribute('data-setting'), e.target.checked);
            });
        });
        
        // Select controls
        const selects = this.settingsContent.querySelectorAll('select[data-setting]');
        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.updateSetting(e.target.getAttribute('data-setting'), e.target.value);
            });
        });
        
        // Slider controls
        const sliders = this.settingsContent.querySelectorAll('input[type="range"][data-setting]');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.updateSetting(e.target.getAttribute('data-setting'), parseInt(e.target.value));
                
                // Update display value
                const valueDisplay = slider.parentNode.querySelector('.slider-value');
                if (valueDisplay) {
                    const setting = SETTINGS_CONFIG.settings[e.target.getAttribute('data-setting')];
                    valueDisplay.textContent = e.target.value + (setting.unit || '');
                }
            });
        });
        
        // Text inputs
        const textInputs = this.settingsContent.querySelectorAll('input[type="text"][data-setting]');
        textInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateSetting(e.target.getAttribute('data-setting'), e.target.value);
            });
        });
        
        // Profile management buttons
        const createProfileBtn = TimeQuestUtils.getElement('create-new-profile-btn');
        const importClassBtn = TimeQuestUtils.getElement('bulk-profile-import-btn');
        
        if (createProfileBtn) {
            createProfileBtn.addEventListener('click', () => {
                this.showCreateProfileDialog();
            });
        }
        
        if (importClassBtn) {
            importClassBtn.addEventListener('click', () => {
                this.showBulkImportDialog();
            });
        }
    }
    
    /**
     * Update a specific setting value
     */
    updateSetting(settingId, value) {
        const setting = SETTINGS_CONFIG.settings[settingId];
        if (!setting) return;
        
        // Validate value
        const validatedValue = this.validateSettingValue(settingId, value, setting);
        
        // Update current settings
        this.currentSettings[settingId] = validatedValue;
        
        // Apply setting immediately if possible
        this.applySetting(settingId, validatedValue, setting);
        
        // Mark as having unsaved changes
        this.markUnsavedChanges();
        
        // Provide feedback
        this.showSettingFeedback(settingId, setting);
    }
    
    /**
     * Validate setting value
     */
    validateSettingValue(settingId, value, setting) {
        switch (setting.type) {
            case 'toggle':
                return Boolean(value);
            case 'slider':
                const numValue = parseInt(value);
                return Math.max(setting.min, Math.min(setting.max, numValue));
            case 'select':
                const validOption = setting.options.find(opt => opt.value == value);
                return validOption ? validOption.value : setting.default;
            default:
                return value;
        }
    }
    
    /**
     * Apply setting immediately if possible
     */
    applySetting(settingId, value, setting) {
        if (setting.requiresRestart) {
            return; // Will be applied on next restart
        }
        
        switch (settingId) {
            case 'masterVolume':
                if (window.TimeQuestAudio) {
                    window.TimeQuestAudio.setMasterVolume(value / 100);
                }
                break;
                
            case 'soundEffects':
            case 'backgroundMusic':
            case 'voiceNarration':
                if (window.TimeQuestAudio) {
                    window.TimeQuestAudio.updateSettings({ [settingId]: value });
                }
                break;
                
            case 'textSize':
                this.applyTextSize(value);
                break;
                
            case 'colorTheme':
                this.applyColorTheme(value);
                break;
                
            case 'animations':
                this.applyAnimationLevel(value);
                break;
        }
    }
    
    /**
     * Apply text size setting
     */
    applyTextSize(size) {
        const sizeClasses = ['text-size-small', 'text-size-medium', 'text-size-large', 'text-size-extra-large'];
        
        // Remove existing size classes
        sizeClasses.forEach(className => {
            document.body.classList.remove(className);
        });
        
        // Add new size class
        if (size !== 'medium') { // medium is default, no class needed
            document.body.classList.add(`text-size-${size}`);
        }
    }
    
    /**
     * Apply color theme setting
     */
    applyColorTheme(theme) {
        const themeClasses = ['theme-bright', 'theme-soft', 'theme-high-contrast', 'theme-dark'];
        
        // Remove existing theme classes
        themeClasses.forEach(className => {
            document.body.classList.remove(className);
        });
        
        // Add new theme class
        if (theme !== 'bright') { // bright is default
            document.body.classList.add(`theme-${theme}`);
        }
    }
    
    /**
     * Apply animation level setting
     */
    applyAnimationLevel(level) {
        const animationClasses = ['animations-reduced', 'animations-minimal', 'animations-none'];
        
        // Remove existing animation classes
        animationClasses.forEach(className => {
            document.body.classList.remove(className);
        });
        
        // Add new animation class
        if (level !== 'full') { // full is default
            document.body.classList.add(`animations-${level}`);
        }
        
        // Set CSS media query preference
        if (level === 'none' || level === 'minimal') {
            document.documentElement.style.setProperty('--prefers-reduced-motion', 'reduce');
        } else {
            document.documentElement.style.removeProperty('--prefers-reduced-motion');
        }
    }
    
    /**
     * Show feedback for setting change
     */
    showSettingFeedback(settingId, setting) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = 'setting-feedback';
        feedback.textContent = `${setting.name} updated`;
        
        // Position it near the setting control
        const settingElement = TimeQuestUtils.getElement(`setting-${settingId}`);
        if (settingElement) {
            const rect = settingElement.getBoundingClientRect();
            feedback.style.position = 'fixed';
            feedback.style.top = rect.bottom + 5 + 'px';
            feedback.style.left = rect.left + 'px';
            feedback.style.zIndex = '1000';
        }
        
        document.body.appendChild(feedback);
        
        // Animate in
        TimeQuestUtils.animateElement(feedback, 'slide-in-bottom');
        
        // Remove after delay
        setTimeout(() => {
            TimeQuestUtils.animateElement(feedback, 'fadeOut', () => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            });
        }, 2000);
    }
    
    /**
     * Mark that there are unsaved changes
     */
    markUnsavedChanges() {
        this.unsavedChanges = true;
        
        if (this.unsavedIndicator) {
            this.unsavedIndicator.style.display = 'block';
        }
        
        if (this.saveButton) {
            this.saveButton.classList.add('highlighted');
        }
    }
    
    /**
     * Clear unsaved changes indicator
     */
    clearUnsavedChanges() {
        this.unsavedChanges = false;
        
        if (this.unsavedIndicator) {
            this.unsavedIndicator.style.display = 'none';
        }
        
        if (this.saveButton) {
            this.saveButton.classList.remove('highlighted');
        }
    }
    
    /**
     * Save all settings to storage
     */
    saveAllSettings() {
        try {
            const success = TimeQuestStorage.updateSettings(this.currentSettings);
            
            if (success) {
                this.originalSettings = { ...this.currentSettings };
                this.clearUnsavedChanges();
                
                // Show success message
                TimeQuestUI.showSuccess('Settings saved successfully! 💾');
                TimeQuestUI.mascotSay('Settings saved! Your preferences are now active!');
                
                // Check if restart is needed
                const needsRestart = this.checkIfRestartRequired();
                if (needsRestart) {
                    this.showRestartDialog();
                }
                
            } else {
                TimeQuestUI.showError('Failed to save settings. Please try again.');
            }
            
        } catch (error) {
            console.error('Error saving settings:', error);
            TimeQuestUI.showError('An error occurred while saving settings.');
        }
    }
    
    /**
     * Check if any changed settings require restart
     */
    checkIfRestartRequired() {
        return Object.entries(this.currentSettings).some(([key, value]) => {
            const setting = SETTINGS_CONFIG.settings[key];
            return setting && 
                   setting.requiresRestart && 
                   value !== this.originalSettings[key];
        });
    }
    
    /**
     * Show restart dialog
     */
    showRestartDialog() {
        const modal = document.createElement('div');
        modal.className = 'restart-dialog-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>⚠️ Restart Required</h3>
                <p>Some settings you changed require restarting the app to take effect.</p>
                <div class="restart-actions">
                    <button id="restart-now-btn" class="restart-btn primary">
                        🔄 Restart Now
                    </button>
                    <button id="restart-later-btn" class="restart-btn secondary">
                        ⏰ Restart Later
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Attach restart dialog listeners
        const restartNowBtn = modal.querySelector('#restart-now-btn');
        const restartLaterBtn = modal.querySelector('#restart-later-btn');
        
        restartNowBtn.addEventListener('click', () => {
            window.location.reload();
        });
        
        restartLaterBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        TimeQuestUtils.animateElement(modal, 'zoom-in');
    }
    
    /**
     * Discard unsaved changes
     */
    discardChanges() {
        this.currentSettings = { ...this.originalSettings };
        this.clearUnsavedChanges();
        
        // Refresh the current category display
        this.displayCategory(this.activeCategory);
        
        // Re-apply original settings
        Object.entries(this.originalSettings).forEach(([key, value]) => {
            const setting = SETTINGS_CONFIG.settings[key];
            if (setting) {
                this.applySetting(key, value, setting);
            }
        });
        
        TimeQuestUI.mascotSay('Changes discarded. Settings restored to previous values.');
    }
    
    /**
     * Export settings to file
     */
    exportSettings() {
        try {
            const exportData = {
                settings: this.currentSettings,
                profiles: TimeQuestStorage.getAllProfiles(),
                exportDate: new Date().toISOString(),
                appVersion: '1.0.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `time-quest-settings-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            TimeQuestUI.showSuccess('Settings exported successfully! 📤');
            
        } catch (error) {
            console.error('Export error:', error);
            TimeQuestUI.showError('Failed to export settings.');
        }
    }
    
    /**
     * Import settings from file
     */
    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    this.processImportedSettings(importData);
                } catch (error) {
                    console.error('Import error:', error);
                    TimeQuestUI.showError('Invalid settings file format.');
                }
            };
            
            reader.readAsText(file);
        });
        
        input.click();
    }
    
    /**
     * Process imported settings data
     */
    processImportedSettings(importData) {
        if (!importData.settings) {
            TimeQuestUI.showError('Invalid settings file - no settings data found.');
            return;
        }
        
        // Validate imported settings
        const validSettings = {};
        Object.entries(importData.settings).forEach(([key, value]) => {
            if (SETTINGS_CONFIG.settings[key]) {
                validSettings[key] = this.validateSettingValue(key, value, SETTINGS_CONFIG.settings[key]);
            }
        });
        
        // Apply imported settings
        this.currentSettings = { ...this.currentSettings, ...validSettings };
        this.markUnsavedChanges();
        
        // Refresh display
        this.displayCategory(this.activeCategory);
        
        // Show confirmation
        const settingsCount = Object.keys(validSettings).length;
        TimeQuestUI.showSuccess(`Imported ${settingsCount} settings successfully! 📥`);
        TimeQuestUI.mascotSay('Settings imported! Don\'t forget to save them.');
        
        // Offer to import profiles too
        if (importData.profiles && importData.profiles.length > 0) {
            this.offerProfileImport(importData.profiles);
        }
    }
    
    /**
     * Offer to import profiles from settings file
     */
    offerProfileImport(profiles) {
        const modal = document.createElement('div');
        modal.className = 'profile-import-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>📥 Import Profiles</h3>
                <p>This file also contains ${profiles.length} student profiles. Would you like to import them?</p>
                <div class="profile-preview">
                    ${profiles.slice(0, 3).map(profile => 
                        `<div class="profile-preview-item">
                            ${profile.avatar} ${profile.name}
                        </div>`
                    ).join('')}
                    ${profiles.length > 3 ? `<div class="profile-preview-more">... and ${profiles.length - 3} more</div>` : ''}
                </div>
                <div class="import-actions">
                    <button id="import-profiles-btn" class="import-btn primary">
                        ✅ Import Profiles
                    </button>
                    <button id="skip-profiles-btn" class="import-btn secondary">
                        ❌ Skip Profiles
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const importBtn = modal.querySelector('#import-profiles-btn');
        const skipBtn = modal.querySelector('#skip-profiles-btn');
        
        importBtn.addEventListener('click', () => {
            this.importProfiles(profiles);
            document.body.removeChild(modal);
        });
        
        skipBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        TimeQuestUtils.animateElement(modal, 'zoom-in');
    }
    
    /**
     * Import profiles from data
     */
    importProfiles(profiles) {
        let importedCount = 0;
        
        profiles.forEach(profileData => {
            try {
                // Check if profile name already exists
                const existingProfiles = TimeQuestStorage.getAllProfiles();
                const nameExists = existingProfiles.some(p => p.name === profileData.name);
                
                if (!nameExists) {
                    TimeQuestStorage.createProfile(profileData.name, profileData.avatar);
                    importedCount++;
                }
            } catch (error) {
                console.warn(`Failed to import profile ${profileData.name}:`, error);
            }
        });
        
        TimeQuestUI.showSuccess(`Imported ${importedCount} profiles successfully!`);
        this.updateProfileSection();
    }
    
    /**
     * Reset all settings to defaults
     */
    resetAllSettings() {
        const modal = document.createElement('div');
        modal.className = 'reset-confirmation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>⚠️ Reset All Settings</h3>
                <p>This will reset ALL settings to their default values. This action cannot be undone.</p>
                <p>Are you absolutely sure you want to continue?</p>
                <div class="reset-actions">
                    <button id="confirm-reset-btn" class="reset-btn danger">
                        🔄 Yes, Reset Everything
                    </button>
                    <button id="cancel-reset-btn" class="reset-btn secondary">
                        ❌ Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const confirmBtn = modal.querySelector('#confirm-reset-btn');
        const cancelBtn = modal.querySelector('#cancel-reset-btn');
        
        confirmBtn.addEventListener('click', () => {
            this.performSettingsReset();
            document.body.removeChild(modal);
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        TimeQuestUtils.animateElement(modal, 'zoom-in');
    }
    
    /**
     * Perform the actual settings reset
     */
    performSettingsReset() {
        // Reset to default values
        Object.entries(SETTINGS_CONFIG.settings).forEach(([key, setting]) => {
            this.currentSettings[key] = setting.default;
        });
        
        // Save reset settings
        TimeQuestStorage.updateSettings(this.currentSettings);
        this.originalSettings = { ...this.currentSettings };
        this.clearUnsavedChanges();
        
        // Refresh display
        this.displayCategory(this.activeCategory);
        
        // Apply all settings
        Object.entries(this.currentSettings).forEach(([key, value]) => {
            const setting = SETTINGS_CONFIG.settings[key];
            if (setting) {
                this.applySetting(key, value, setting);
            }
        });
        
        TimeQuestUI.showSuccess('All settings have been reset to defaults! 🔄');
        TimeQuestUI.mascotSay('Everything is back to default settings! Fresh start!');
    }
    
    /**
     * Update profile section display
     */
    updateProfileSection() {
        const profilesDisplay = TimeQuestUtils.getElement('profiles-display');
        if (!profilesDisplay) return;
        
        const profiles = TimeQuestStorage.getAllProfiles();
        const currentProfileId = TimeQuestStorage.getCurrentProfileId();
        
        if (profiles.length === 0) {
            profilesDisplay.innerHTML = `
                <div class="no-profiles">
                    <p>No student profiles created yet.</p>
                    <p>Create a profile to get started!</p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="profiles-grid">';
        
        profiles.forEach(profile => {
            const isActive = profile.id === currentProfileId;
            html += `
                <div class="profile-card ${isActive ? 'active' : ''}">
                    <div class="profile-header">
                        <span class="profile-avatar">${profile.avatar}</span>
                        <div class="profile-info">
                            <h4>${profile.name}</h4>
                            ${isActive ? '<span class="active-badge">Active</span>' : ''}
                        </div>
                    </div>
                    <div class="profile-stats">
                        <span>Level ${profile.currentLevel || 1}</span>
                        <span>⭐ ${profile.totalStars || 0}</span>
                        <span>Lessons: ${(profile.lessonsCompleted || []).length}</span>
                    </div>
                    <div class="profile-actions">
                        ${!isActive ? `<button class="profile-btn" onclick="settingsManager.switchProfile('${profile.id}')">Switch To</button>` : ''}
                        <button class="profile-btn" onclick="settingsManager.editProfile('${profile.id}')">Edit</button>
                        <button class="profile-btn danger" onclick="settingsManager.deleteProfile('${profile.id}')">Delete</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        profilesDisplay.innerHTML = html;
    }
    
    /**
     * Show create profile dialog
     */
    showCreateProfileDialog() {
        // Delegate to UI handler's existing modal
        if (window.TimeQuestUI && window.TimeQuestUI.manager) {
            window.TimeQuestUI.manager.showCreateProfileModal();
        }
    }
    
    /**
     * Show bulk import dialog for class lists
     */
    showBulkImportDialog() {
        const modal = document.createElement('div');
        modal.className = 'bulk-import-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>📥 Import Class List</h3>
                <p>Upload a CSV file with student names to create multiple profiles at once.</p>
                <div class="import-format">
                    <h4>Expected format:</h4>
                    <pre>Name,Avatar
John Smith,👦
Jane Doe,👧
Alex Johnson,🧑</pre>
                </div>
                <div class="file-input-area">
                    <input type="file" id="class-list-file" accept=".csv" style="display: none;">
                    <button id="select-file-btn" class="file-btn">
                        📁 Select CSV File
                    </button>
                    <span id="file-name-display">No file selected</span>
                </div>
                <div class="import-actions">
                    <button id="import-class-btn" class="import-btn primary" disabled>
                        📥 Import Class
                    </button>
                    <button id="cancel-import-btn" class="import-btn secondary">
                        ❌ Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const fileInput = modal.querySelector('#class-list-file');
        const selectBtn = modal.querySelector('#select-file-btn');
        const fileDisplay = modal.querySelector('#file-name-display');
        const importBtn = modal.querySelector('#import-class-btn');
        const cancelBtn = modal.querySelector('#cancel-import-btn');
        
        selectBtn.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                fileDisplay.textContent = file.name;
                importBtn.disabled = false;
            }
        });
        
        importBtn.addEventListener('click', () => {
            this.processBulkImport(fileInput.files[0]);
            document.body.removeChild(modal);
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        TimeQuestUtils.animateElement(modal, 'zoom-in');
    }
    
    /**
     * Process bulk import of student profiles
     */
    processBulkImport(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvData = e.target.result;
                const lines = csvData.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                
                let importedCount = 0;
                let errorCount = 0;
                
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const values = line.split(',').map(v => v.trim());
                    const name = values[0];
                    const avatar = values[1] || '👤';
                    
                    if (name) {
                        try {
                            TimeQuestStorage.createProfile(name, avatar);
                            importedCount++;
                        } catch (error) {
                            console.warn(`Failed to create profile for ${name}:`, error);
                            errorCount++;
                        }
                    }
                }
                
                TimeQuestUI.showSuccess(`Imported ${importedCount} profiles successfully!`);
                if (errorCount > 0) {
                    TimeQuestUI.showError(`${errorCount} profiles could not be imported (likely duplicate names).`);
                }
                
                this.updateProfileSection();
                
            } catch (error) {
                console.error('Bulk import error:', error);
                TimeQuestUI.showError('Failed to process CSV file. Please check the format.');
            }
        };
        
        reader.readAsText(file);
    }
    
    /**
     * Switch to a different profile
     */
    switchProfile(profileId) {
        TimeQuestStorage.setCurrentProfile(profileId);
        const profile = TimeQuestStorage.getProfile(profileId);
        TimeQuestUI.mascotSay(`Welcome back, ${profile.name}!`);
        this.updateProfileSection();
    }
    
    /**
     * Edit profile (placeholder - could open profile editor)
     */
    editProfile(profileId) {
        TimeQuestUI.mascotSay('Profile editing coming soon!');
    }
    
    /**
     * Delete profile with confirmation
     */
    deleteProfile(profileId) {
        const profile = TimeQuestStorage.getProfile(profileId);
        if (!profile) return;
        
        const modal = document.createElement('div');
        modal.className = 'delete-profile-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>⚠️ Delete Profile</h3>
                <p>Are you sure you want to delete <strong>${profile.name}'s</strong> profile?</p>
                <p>This will permanently delete all progress and cannot be undone.</p>
                <div class="delete-actions">
                    <button id="confirm-delete-btn" class="delete-btn danger">
                        🗑️ Yes, Delete Profile
                    </button>
                    <button id="cancel-delete-btn" class="delete-btn secondary">
                        ❌ Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const confirmBtn = modal.querySelector('#confirm-delete-btn');
        const cancelBtn = modal.querySelector('#cancel-delete-btn');
        
        confirmBtn.addEventListener('click', () => {
            TimeQuestStorage.deleteProfile(profileId);
            this.updateProfileSection();
            TimeQuestUI.showSuccess(`${profile.name}'s profile has been deleted.`);
            document.body.removeChild(modal);
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        TimeQuestUtils.animateElement(modal, 'zoom-in');
    }
}

// ===================================
// INITIALIZE THE SETTINGS MANAGER
// ===================================

// Create global settings manager instance
const settingsManager = new SettingsManager();

// ===================================
// EXPORT FOR OTHER FILES TO USE
// ===================================

window.TimeQuestSettings = {
    manager: settingsManager,
    initialize: () => settingsManager.initialize(),
    config: SETTINGS_CONFIG
};

console.log('✅ Time Quest Settings Manager loaded successfully!');