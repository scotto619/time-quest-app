/**
 * TIME QUEST - STORAGE MANAGER
 * Handles saving and loading all student data, progress, and settings
 * Think of this as a smart filing cabinet that remembers everything
 */

// ===================================
// STORAGE KEYS AND DEFAULTS
// The "labels" for our filing cabinet drawers
// ===================================

const STORAGE_KEYS = {
    PROFILES: 'timequest_profiles',
    CURRENT_PROFILE: 'timequest_current_profile',
    SETTINGS: 'timequest_settings',
    GAME_DATA: 'timequest_game_data',
    ACHIEVEMENTS: 'timequest_achievements',
    VERSION: 'timequest_version'
};

const CURRENT_VERSION = '1.0.0';

// Default settings when app first runs
const DEFAULT_SETTINGS = {
    soundEffects: true,
    backgroundMusic: true,
    voiceNarration: true,
    textSize: 'medium',
    colorTheme: 'bright',
    masterVolume: 0.8,
    language: 'en'
};

// Template for a new player profile
const DEFAULT_PROFILE = {
    name: '',
    avatar: '🧙‍♂️',
    createdDate: null,
    lastPlayDate: null,
    totalPlayTime: 0,
    currentLevel: 1,
    totalStars: 0,
    lessonsCompleted: [],
    practiceScores: {},
    gameProgress: {},
    achievements: [],
    preferences: {
        favoriteMode: 'tutorial',
        difficulty: 'normal'
    }
};

// ===================================
// STORAGE UTILITIES
// Basic tools for saving and loading data
// ===================================

/**
 * Check if localStorage is available (some browsers block it)
 * @returns {boolean} True if we can save data
 */
function isStorageAvailable() {
    try {
        const test = 'storage_test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        console.warn('localStorage is not available:', error);
        return false;
    }
}

/**
 * Safely save data to localStorage with error handling
 * @param {string} key - The storage key (like a file name)
 * @param {*} data - The data to save
 * @returns {boolean} True if save was successful
 */
function saveToStorage(key, data) {
    if (!isStorageAvailable()) {
        console.warn('Cannot save data - storage not available');
        return false;
    }
    
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
        console.log(`✅ Saved data to ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to save data to ${key}:`, error);
        return false;
    }
}

/**
 * Safely load data from localStorage with error handling
 * @param {string} key - The storage key to load
 * @param {*} defaultValue - What to return if nothing is found
 * @returns {*} The loaded data or the default value
 */
function loadFromStorage(key, defaultValue = null) {
    if (!isStorageAvailable()) {
        console.warn('Cannot load data - storage not available');
        return defaultValue;
    }
    
    try {
        const jsonData = localStorage.getItem(key);
        if (jsonData === null) {
            return defaultValue;
        }
        
        const data = JSON.parse(jsonData);
        console.log(`✅ Loaded data from ${key}`);
        return data;
    } catch (error) {
        console.error(`❌ Failed to load data from ${key}:`, error);
        return defaultValue;
    }
}

/**
 * Remove data from storage
 * @param {string} key - The storage key to remove
 */
function removeFromStorage(key) {
    if (isStorageAvailable()) {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed data from ${key}`);
    }
}

// ===================================
// PROFILE MANAGEMENT
// Tools for managing different students/players
// ===================================

/**
 * Get all player profiles
 * @returns {Array} Array of profile objects
 */
function getAllProfiles() {
    return loadFromStorage(STORAGE_KEYS.PROFILES, []);
}

/**
 * Create a new player profile
 * @param {string} name - The player's name
 * @param {string} avatar - Emoji avatar for the player
 * @returns {Object} The created profile
 */
function createProfile(name, avatar = '🧙‍♂️') {
    const profiles = getAllProfiles();
    
    // Check if name already exists
    if (profiles.some(profile => profile.name === name)) {
        throw new Error(`Profile with name "${name}" already exists`);
    }
    
    const newProfile = {
        ...DEFAULT_PROFILE,
        name: name,
        avatar: avatar,
        id: generateProfileId(),
        createdDate: new Date().toISOString(),
        lastPlayDate: new Date().toISOString()
    };
    
    profiles.push(newProfile);
    saveToStorage(STORAGE_KEYS.PROFILES, profiles);
    
    console.log(`👤 Created new profile for ${name}`);
    return newProfile;
}

/**
 * Generate a unique ID for a profile
 * @returns {string} Unique profile ID
 */
function generateProfileId() {
    return 'profile_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Get a specific profile by ID
 * @param {string} profileId - The profile ID to find
 * @returns {Object|null} The profile or null if not found
 */
function getProfile(profileId) {
    const profiles = getAllProfiles();
    return profiles.find(profile => profile.id === profileId) || null;
}

/**
 * Update a profile with new data
 * @param {string} profileId - The profile ID to update
 * @param {Object} updates - Object with fields to update
 * @returns {boolean} True if update was successful
 */
function updateProfile(profileId, updates) {
    const profiles = getAllProfiles();
    const profileIndex = profiles.findIndex(profile => profile.id === profileId);
    
    if (profileIndex === -1) {
        console.error(`Profile ${profileId} not found`);
        return false;
    }
    
    // Merge updates with existing profile
    profiles[profileIndex] = {
        ...profiles[profileIndex],
        ...updates,
        lastPlayDate: new Date().toISOString()
    };
    
    const success = saveToStorage(STORAGE_KEYS.PROFILES, profiles);
    if (success) {
        console.log(`👤 Updated profile ${profileId}`);
    }
    return success;
}

/**
 * Delete a profile
 * @param {string} profileId - The profile ID to delete
 * @returns {boolean} True if deletion was successful
 */
function deleteProfile(profileId) {
    const profiles = getAllProfiles();
    const filteredProfiles = profiles.filter(profile => profile.id !== profileId);
    
    if (filteredProfiles.length === profiles.length) {
        console.error(`Profile ${profileId} not found for deletion`);
        return false;
    }
    
    const success = saveToStorage(STORAGE_KEYS.PROFILES, filteredProfiles);
    if (success) {
        console.log(`🗑️ Deleted profile ${profileId}`);
        
        // If this was the current profile, clear it
        const currentProfileId = getCurrentProfileId();
        if (currentProfileId === profileId) {
            setCurrentProfile(null);
        }
    }
    return success;
}

/**
 * Get the currently active profile ID
 * @returns {string|null} Current profile ID or null
 */
function getCurrentProfileId() {
    return loadFromStorage(STORAGE_KEYS.CURRENT_PROFILE, null);
}

/**
 * Set the currently active profile
 * @param {string|null} profileId - Profile ID to make current, or null to clear
 * @returns {boolean} True if successful
 */
function setCurrentProfile(profileId) {
    if (profileId === null) {
        removeFromStorage(STORAGE_KEYS.CURRENT_PROFILE);
        return true;
    }
    
    // Verify the profile exists
    const profile = getProfile(profileId);
    if (!profile) {
        console.error(`Cannot set current profile - profile ${profileId} not found`);
        return false;
    }
    
    const success = saveToStorage(STORAGE_KEYS.CURRENT_PROFILE, profileId);
    if (success) {
        console.log(`👤 Set current profile to ${profile.name}`);
    }
    return success;
}

/**
 * Get the currently active profile data
 * @returns {Object|null} Current profile or null
 */
function getCurrentProfile() {
    const profileId = getCurrentProfileId();
    return profileId ? getProfile(profileId) : null;
}

// ===================================
// PROGRESS TRACKING
// Tools for tracking learning progress
// ===================================

/**
 * Mark a lesson as completed for the current profile
 * @param {string} lessonId - The lesson identifier
 * @param {Object} results - Lesson completion data (score, time, etc.)
 * @returns {boolean} True if successful
 */
function completeLesson(lessonId, results = {}) {
    const profileId = getCurrentProfileId();
    if (!profileId) {
        console.error('No current profile to update lesson progress');
        return false;
    }
    
    const profile = getProfile(profileId);
    if (!profile) return false;
    
    // Add lesson to completed list if not already there
    if (!profile.lessonsCompleted.includes(lessonId)) {
        profile.lessonsCompleted.push(lessonId);
    }
    
    // Update lesson results
    if (!profile.lessonResults) {
        profile.lessonResults = {};
    }
    
    profile.lessonResults[lessonId] = {
        ...profile.lessonResults[lessonId],
        ...results,
        completedDate: new Date().toISOString()
    };
    
    // Award stars based on performance
    const starsEarned = calculateStarsEarned(results);
    profile.totalStars += starsEarned;
    
    return updateProfile(profileId, profile);
}

/**
 * Update practice mode scores
 * @param {string} practiceType - Type of practice (e.g., 'analog_reading', 'digital_setting')
 * @param {number} score - Score achieved
 * @param {number} timeSpent - Time spent in seconds
 * @returns {boolean} True if successful
 */
function updatePracticeScore(practiceType, score, timeSpent = 0) {
    const profileId = getCurrentProfileId();
    if (!profileId) return false;
    
    const profile = getProfile(profileId);
    if (!profile) return false;
    
    if (!profile.practiceScores[practiceType]) {
        profile.practiceScores[practiceType] = {
            bestScore: 0,
            totalAttempts: 0,
            totalTimeSpent: 0,
            averageScore: 0
        };
    }
    
    const practiceData = profile.practiceScores[practiceType];
    practiceData.totalAttempts += 1;
    practiceData.totalTimeSpent += timeSpent;
    practiceData.bestScore = Math.max(practiceData.bestScore, score);
    
    // Calculate running average
    practiceData.averageScore = (
        (practiceData.averageScore * (practiceData.totalAttempts - 1) + score) / 
        practiceData.totalAttempts
    );
    
    return updateProfile(profileId, profile);
}

/**
 * Update game progress
 * @param {string} gameMode - Game mode identifier
 * @param {number} level - Level reached
 * @param {Object} gameData - Additional game data
 * @returns {boolean} True if successful
 */
function updateGameProgress(gameMode, level, gameData = {}) {
    const profileId = getCurrentProfileId();
    if (!profileId) return false;
    
    const profile = getProfile(profileId);
    if (!profile) return false;
    
    if (!profile.gameProgress[gameMode]) {
        profile.gameProgress[gameMode] = {
            highestLevel: 0,
            totalStars: 0,
            achievements: []
        };
    }
    
    const gameProgress = profile.gameProgress[gameMode];
    gameProgress.highestLevel = Math.max(gameProgress.highestLevel, level);
    
    // Merge additional game data
    Object.assign(gameProgress, gameData);
    
    // Update overall current level
    profile.currentLevel = Math.max(profile.currentLevel, level);
    
    return updateProfile(profileId, profile);
}

/**
 * Calculate stars earned based on performance
 * @param {Object} results - Performance data
 * @returns {number} Number of stars earned (0-3)
 */
function calculateStarsEarned(results) {
    const { score = 0, accuracy = 0, timeBonus = false } = results;
    
    let stars = 0;
    
    // Base star for completion
    if (score > 0) stars += 1;
    
    // Second star for good performance
    if (accuracy >= 0.8 || score >= 80) stars += 1;
    
    // Third star for excellent performance or time bonus
    if ((accuracy >= 0.95 || score >= 95) || timeBonus) stars += 1;
    
    return stars;
}

// ===================================
// ACHIEVEMENTS SYSTEM
// Tools for tracking accomplishments
// ===================================

/**
 * Award an achievement to the current profile
 * @param {string} achievementId - Achievement identifier
 * @param {Object} achievementData - Achievement details
 * @returns {boolean} True if successful
 */
function awardAchievement(achievementId, achievementData = {}) {
    const profileId = getCurrentProfileId();
    if (!profileId) return false;
    
    const profile = getProfile(profileId);
    if (!profile) return false;
    
    // Check if achievement already earned
    if (profile.achievements.includes(achievementId)) {
        return true; // Already has it
    }
    
    profile.achievements.push(achievementId);
    
    // Store achievement details
    const allAchievements = loadFromStorage(STORAGE_KEYS.ACHIEVEMENTS, {});
    allAchievements[achievementId] = {
        ...achievementData,
        earnedDate: new Date().toISOString(),
        profileId: profileId
    };
    saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, allAchievements);
    
    console.log(`🏆 Achievement earned: ${achievementId}`);
    return updateProfile(profileId, profile);
}

/**
 * Check for and award automatic achievements based on progress
 * @param {Object} profile - Profile to check achievements for
 */
function checkAutomaticAchievements(profile) {
    // First Lesson Complete
    if (profile.lessonsCompleted.length === 1 && !profile.achievements.includes('first_lesson')) {
        awardAchievement('first_lesson', {
            name: 'First Steps',
            description: 'Completed your first lesson!',
            icon: '🎉'
        });
    }
    
    // All Lessons Complete
    if (profile.lessonsCompleted.length >= 8 && !profile.achievements.includes('all_lessons')) {
        awardAchievement('all_lessons', {
            name: 'Master Student',
            description: 'Completed all lessons!',
            icon: '🎓'
        });
    }
    
    // Star Collector achievements
    if (profile.totalStars >= 10 && !profile.achievements.includes('star_collector_10')) {
        awardAchievement('star_collector_10', {
            name: 'Star Collector',
            description: 'Earned 10 stars!',
            icon: '⭐'
        });
    }
    
    if (profile.totalStars >= 50 && !profile.achievements.includes('star_collector_50')) {
        awardAchievement('star_collector_50', {
            name: 'Star Master',
            description: 'Earned 50 stars!',
            icon: '🌟'
        });
    }
}

// ===================================
// SETTINGS MANAGEMENT
// Tools for app preferences
// ===================================

/**
 * Get all app settings
 * @returns {Object} Settings object
 */
function getSettings() {
    return loadFromStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

/**
 * Update app settings
 * @param {Object} newSettings - Settings to update
 * @returns {boolean} True if successful
 */
function updateSettings(newSettings) {
    const currentSettings = getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    const success = saveToStorage(STORAGE_KEYS.SETTINGS, updatedSettings);
    if (success) {
        console.log('⚙️ Settings updated');
    }
    return success;
}

/**
 * Reset settings to defaults
 * @returns {boolean} True if successful
 */
function resetSettings() {
    const success = saveToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    if (success) {
        console.log('⚙️ Settings reset to defaults');
    }
    return success;
}

// ===================================
// DATA EXPORT/IMPORT
// Tools for teachers to backup/restore data
// ===================================

/**
 * Export all data for backup
 * @returns {Object} All app data
 */
function exportAllData() {
    return {
        version: CURRENT_VERSION,
        profiles: getAllProfiles(),
        settings: getSettings(),
        achievements: loadFromStorage(STORAGE_KEYS.ACHIEVEMENTS, {}),
        exportDate: new Date().toISOString()
    };
}

/**
 * Import data from backup
 * @param {Object} data - Data to import
 * @returns {boolean} True if successful
 */
function importAllData(data) {
    try {
        if (data.version && data.profiles) {
            saveToStorage(STORAGE_KEYS.PROFILES, data.profiles);
            if (data.settings) {
                saveToStorage(STORAGE_KEYS.SETTINGS, data.settings);
            }
            if (data.achievements) {
                saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, data.achievements);
            }
            console.log('📥 Data imported successfully');
            return true;
        } else {
            console.error('Invalid data format for import');
            return false;
        }
    } catch (error) {
        console.error('Failed to import data:', error);
        return false;
    }
}

/**
 * Clear all stored data (nuclear option)
 * @returns {boolean} True if successful
 */
function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        removeFromStorage(key);
    });
    console.log('🧹 All data cleared');
    return true;
}

// ===================================
// INITIALIZATION
// Set up storage system when app starts
// ===================================

/**
 * Initialize the storage system
 * @returns {boolean} True if initialization successful
 */
function initializeStorage() {
    console.log('🗄️ Initializing storage system...');
    
    if (!isStorageAvailable()) {
        console.warn('Storage not available - data will not be saved');
        return false;
    }
    
    // Check version and migrate if needed
    const savedVersion = loadFromStorage(STORAGE_KEYS.VERSION, '0.0.0');
    if (savedVersion !== CURRENT_VERSION) {
        console.log(`Migrating data from version ${savedVersion} to ${CURRENT_VERSION}`);
        migrateData(savedVersion, CURRENT_VERSION);
        saveToStorage(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    }
    
    // Initialize default settings if they don't exist
    if (!loadFromStorage(STORAGE_KEYS.SETTINGS)) {
        saveToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }
    
    console.log('✅ Storage system initialized');
    return true;
}

/**
 * Migrate data between versions
 * @param {string} oldVersion - Previous version
 * @param {string} newVersion - New version
 */
function migrateData(oldVersion, newVersion) {
    console.log(`Migrating data from ${oldVersion} to ${newVersion}`);
    // Future: Add version-specific migration logic here
}

// ===================================
// EXPORT FOR OTHER FILES TO USE
// Make these functions available to other JavaScript files
// ===================================

window.TimeQuestStorage = {
    // Initialization
    initializeStorage,
    
    // Profile management
    getAllProfiles,
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
    getCurrentProfile,
    getCurrentProfileId,
    setCurrentProfile,
    
    // Progress tracking
    completeLesson,
    updatePracticeScore,
    updateGameProgress,
    
    // Achievements
    awardAchievement,
    checkAutomaticAchievements,
    
    // Settings
    getSettings,
    updateSettings,
    resetSettings,
    
    // Data management
    exportAllData,
    importAllData,
    clearAllData,
    
    // Utilities
    isStorageAvailable
};

console.log('✅ Time Quest Storage loaded successfully!');