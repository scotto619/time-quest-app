/**
 * TIME QUEST - AUDIO MANAGER
 * The sound engineer that creates an immersive audio experience
 * Think of this as your personal DJ and sound effects wizard
 */

// ===================================
// AUDIO CONFIGURATION
// Settings for different audio types and contexts
// ===================================

const AUDIO_CONFIG = {
    // Volume levels for different audio types
    volumes: {
        master: 0.8,
        music: 0.6,
        effects: 0.7,
        voice: 0.8,
        ui: 0.4,
        celebration: 0.9
    },
    
    // Audio file paths (these would be actual audio files in production)
    sounds: {
        // UI Sounds
        buttonClick: 'assets/audio/button-click.mp3',
        buttonHover: 'assets/audio/button-hover.mp3',
        screenTransition: 'assets/audio/screen-transition.mp3',
        
        // Success/Feedback Sounds  
        correct: 'assets/audio/correct.mp3',
        incorrect: 'assets/audio/incorrect.mp3',
        celebration: 'assets/audio/celebration.mp3',
        levelUp: 'assets/audio/level-up.mp3',
        achievement: 'assets/audio/achievement.mp3',
        
        // Clock Sounds
        clockTick: 'assets/audio/clock-tick.mp3',
        clockSet: 'assets/audio/clock-set.mp3',
        
        // Game Sounds
        gameStart: 'assets/audio/game-start.mp3',
        gameWin: 'assets/audio/game-win.mp3',
        gameOver: 'assets/audio/game-over.mp3',
        
        // Mascot Voice (placeholder - would be real voice recordings)
        mascotWelcome: 'assets/audio/voice/welcome.mp3',
        mascotEncouragement: 'assets/audio/voice/encouragement.mp3',
        mascotCelebration: 'assets/audio/voice/celebration.mp3'
    },
    
    // Background music tracks
    music: {
        mainMenu: 'assets/audio/music/main-theme.mp3',
        tutorial: 'assets/audio/music/learning-melody.mp3',
        practice: 'assets/audio/music/focus-ambient.mp3',
        game: 'assets/audio/music/adventure-theme.mp3',
        settings: 'assets/audio/music/gentle-background.mp3'
    },
    
    // Audio contexts for different situations
    contexts: {
        menu: { music: 'mainMenu', ambience: 'soft' },
        tutorial: { music: 'tutorial', ambience: 'calm' },
        practice: { music: 'practice', ambience: 'focused' },
        game: { music: 'game', ambience: 'energetic' },
        settings: { music: 'settings', ambience: 'peaceful' }
    }
};

// ===================================
// AUDIO MANAGER CLASS
// Central controller for all audio functionality
// ===================================

class AudioManager {
    constructor() {
        this.isInitialized = false;
        this.audioContext = null;
        this.audioElements = new Map();
        this.currentMusic = null;
        this.currentContext = null;
        this.soundPool = new Map();
        this.settings = {};
        
        // Audio state
        this.isMuted = false;
        this.musicFading = false;
        this.scheduledSounds = [];
        
        // Voice synthesis for accessibility
        this.speechSynthesis = null;
        this.currentVoice = null;
        
        console.log('🎵 Audio Manager created');
    }
    
    /**
     * Initialize the audio system
     */
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Load settings
            this.loadSettings();
            
            // Initialize Web Audio API if available
            await this.initializeWebAudio();
            
            // Initialize speech synthesis
            this.initializeSpeechSynthesis();
            
            // Preload essential audio files
            await this.preloadEssentialAudio();
            
            // Set up audio event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Audio system initialized successfully');
            
        } catch (error) {
            console.warn('⚠️ Audio initialization failed:', error);
            // Gracefully degrade - app still works without audio
            this.isInitialized = false;
        }
    }
    
    /**
     * Load audio settings from storage
     */
    loadSettings() {
        const savedSettings = TimeQuestStorage.getSettings();
        this.settings = {
            soundEffects: savedSettings.soundEffects !== false,
            backgroundMusic: savedSettings.backgroundMusic !== false,
            voiceNarration: savedSettings.voiceNarration !== false,
            masterVolume: savedSettings.masterVolume || AUDIO_CONFIG.volumes.master
        };
    }
    
    /**
     * Initialize Web Audio API
     */
    async initializeWebAudio() {
        try {
            // Modern browsers
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Resume context if suspended (required by modern browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            console.log('🎛️ Web Audio API initialized');
        } catch (error) {
            console.warn('Web Audio API not available, falling back to HTML5 audio');
            this.audioContext = null;
        }
    }
    
    /**
     * Initialize speech synthesis for voice narration
     */
    initializeSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
            
            // Wait for voices to load
            const loadVoices = () => {
                const voices = this.speechSynthesis.getVoices();
                // Prefer child-friendly voices
                this.currentVoice = voices.find(voice => 
                    voice.lang.startsWith('en') && 
                    (voice.name.includes('child') || voice.name.includes('young'))
                ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
                
                console.log(`🗣️ Speech synthesis ready with voice: ${this.currentVoice?.name}`);
            };
            
            if (this.speechSynthesis.getVoices().length > 0) {
                loadVoices();
            } else {
                this.speechSynthesis.addEventListener('voiceschanged', loadVoices);
            }
        }
    }
    
    /**
     * Preload essential audio files (with fallbacks for missing files)
     */
    async preloadEssentialAudio() {
        const essentialSounds = [
            'buttonClick', 'correct', 'incorrect', 'celebration'
        ];
        
        // Try to load audio files, but don't fail if they're missing
        const loadPromises = essentialSounds.map(async soundId => {
            try {
                await this.loadSound(soundId, AUDIO_CONFIG.sounds[soundId]);
                return { soundId, loaded: true };
            } catch (error) {
                console.warn(`Audio file for ${soundId} not found, using fallback`);
                return { soundId, loaded: false };
            }
        });
        
        try {
            const results = await Promise.allSettled(loadPromises);
            const loadedCount = results.filter(r => r.status === 'fulfilled' && r.value.loaded).length;
            console.log(`🔊 Audio preload complete: ${loadedCount}/${essentialSounds.length} files loaded`);
            
            // If no audio files loaded, we'll rely on visual feedback and speech synthesis
            if (loadedCount === 0) {
                console.log('📢 No audio files available - using speech synthesis and visual feedback only');
            }
        } catch (error) {
            console.warn('Audio preload completed with some failures:', error);
        }
    }
    
    /**
     * Load a sound file and store it (with fallback for missing files)
     */
    async loadSound(id, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            
            audio.addEventListener('canplaythrough', () => {
                this.audioElements.set(id, audio);
                resolve(audio);
            });
            
            audio.addEventListener('error', (e) => {
                console.warn(`Audio file not found: ${url} - will use fallback`);
                // Store a null placeholder so we know we tried to load this sound
                this.audioElements.set(id, null);
                resolve(null); // Resolve with null instead of rejecting
            });
            
            // Set timeout for loading
            setTimeout(() => {
                if (!this.audioElements.has(id)) {
                    console.warn(`Audio loading timeout for: ${url}`);
                    this.audioElements.set(id, null);
                    resolve(null);
                }
            }, 3000); // 3 second timeout
            
            audio.preload = 'auto';
            audio.src = url;
        });
    }
    
    /**
     * Set up global audio event listeners
     */
    setupEventListeners() {
        // Handle visibility changes (pause music when tab hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseBackgroundMusic();
            } else if (this.settings.backgroundMusic) {
                this.resumeBackgroundMusic();
            }
        });
        
        // Handle settings changes
        document.addEventListener('settingsChanged', (event) => {
            this.updateSettings(event.detail);
        });
        
        // Mobile audio unlock (required by iOS/Android)
        const unlockAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            // Play a silent sound to unlock audio
            this.playSound('buttonClick', 0);
            
            // Remove listeners after first interaction
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('click', unlockAudio);
        };
        
        document.addEventListener('touchstart', unlockAudio);
        document.addEventListener('click', unlockAudio);
    }
    
    // ===================================
    // SOUND EFFECTS METHODS
    // ===================================
    
    /**
     * Play a sound effect (with fallbacks for missing files)
     */
    playSound(soundId, volume = 1.0, delay = 0) {
        if (!this.settings.soundEffects || this.isMuted) return;
        
        const executeSound = () => {
            try {
                let audio = this.audioElements.get(soundId);
                
                // If not preloaded, try to load it now
                if (audio === undefined && AUDIO_CONFIG.sounds[soundId]) {
                    audio = new Audio(AUDIO_CONFIG.sounds[soundId]);
                    audio.addEventListener('error', () => {
                        console.warn(`Could not load ${soundId} - using fallback`);
                        this.audioElements.set(soundId, null);
                    });
                    this.audioElements.set(soundId, audio);
                }
                
                if (audio && audio !== null) {
                    audio.currentTime = 0;
                    audio.volume = this.calculateVolume('effects', volume);
                    
                    const playPromise = audio.play();
                    if (playPromise) {
                        playPromise.catch(error => {
                            console.warn(`Failed to play sound ${soundId}:`, error);
                            this.provideSoundFallback(soundId);
                        });
                    }
                } else {
                    // Audio file not available, use fallback
                    this.provideSoundFallback(soundId);
                }
            } catch (error) {
                console.warn(`Error playing sound ${soundId}:`, error);
                this.provideSoundFallback(soundId);
            }
        };
        
        if (delay > 0) {
            setTimeout(executeSound, delay);
        } else {
            executeSound();
        }
    }
    
    /**
     * Provide fallback feedback when audio files are not available
     */
    provideSoundFallback(soundId) {
        // Provide visual feedback instead of audio
        const feedbackMap = {
            'buttonClick': () => this.showVisualFeedback('click'),
            'correct': () => this.showVisualFeedback('success'),
            'incorrect': () => this.showVisualFeedback('error'),
            'celebration': () => this.showVisualFeedback('celebration'),
            'levelUp': () => this.showVisualFeedback('levelup'),
            'gameStart': () => this.showVisualFeedback('start'),
            'achievement': () => this.showVisualFeedback('achievement')
        };
        
        const fallback = feedbackMap[soundId];
        if (fallback) {
            fallback();
        }
    }
    
    /**
     * Show visual feedback when audio is not available
     */
    showVisualFeedback(type) {
        const feedback = document.createElement('div');
        feedback.className = `audio-fallback-${type}`;
        
        const feedbackConfig = {
            'click': { icon: '👆', color: '#4A90E2', message: 'Click!' },
            'success': { icon: '✅', color: '#7ED321', message: 'Correct!' },
            'error': { icon: '❌', color: '#D0021B', message: 'Try again!' },
            'celebration': { icon: '🎉', color: '#F5A623', message: 'Amazing!' },
            'levelup': { icon: '⬆️', color: '#9013FE', message: 'Level up!' },
            'start': { icon: '🚀', color: '#4A90E2', message: 'Start!' },
            'achievement': { icon: '🏆', color: '#F5A623', message: 'Achievement!' }
        };
        
        const config = feedbackConfig[type] || { icon: '🔔', color: '#666', message: 'Notification' };
        
        feedback.innerHTML = `
            <span class="feedback-icon">${config.icon}</span>
            <span class="feedback-message">${config.message}</span>
        `;
        
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${config.color};
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            animation: slideInRight 0.3s ease, fadeOut 0.5s ease 1.5s forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(feedback);
        
        // Remove after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }
    
    /**
     * Play multiple sounds in sequence
     */
    playSoundSequence(sounds, interval = 200) {
        sounds.forEach((sound, index) => {
            const delay = index * interval;
            if (typeof sound === 'string') {
                this.playSound(sound, 1.0, delay);
            } else {
                this.playSound(sound.id, sound.volume || 1.0, delay);
            }
        });
    }
    
    /**
     * Play celebration sound effects
     */
    playCelebrationSounds() {
        if (!this.settings.soundEffects) return;
        
        // Main celebration sound
        this.playSound('celebration', 1.0);
        
        // Additional sparkle effects
        setTimeout(() => this.playSound('achievement', 0.8), 500);
        setTimeout(() => this.playSound('correct', 0.6), 1000);
    }
    
    /**
     * Play UI interaction sounds
     */
    playUISound(action) {
        const uiSounds = {
            click: 'buttonClick',
            hover: 'buttonHover',
            transition: 'screenTransition',
            error: 'incorrect',
            success: 'correct'
        };
        
        if (uiSounds[action]) {
            this.playSound(uiSounds[action], AUDIO_CONFIG.volumes.ui);
        }
    }
    
    /**
     * Play clock-related sounds
     */
    playClockSound(action) {
        const clockSounds = {
            tick: 'clockTick',
            set: 'clockSet'
        };
        
        if (clockSounds[action]) {
            this.playSound(clockSounds[action], 0.3);
        }
    }
    
    // ===================================
    // BACKGROUND MUSIC METHODS
    // ===================================
    
    /**
     * Play background music for a context (with fallback for missing files)
     */
    playBackgroundMusic(context = 'menu') {
        if (!this.settings.backgroundMusic || this.isMuted) return;
        
        const musicTrack = AUDIO_CONFIG.music[context];
        if (!musicTrack) {
            console.warn(`No music defined for context: ${context}`);
            return;
        }
        
        // Don't restart the same track
        if (this.currentMusic && this.currentMusic.src.includes(musicTrack)) {
            return;
        }
        
        this.stopBackgroundMusic();
        
        try {
            this.currentMusic = new Audio(musicTrack);
            this.currentMusic.loop = true;
            this.currentMusic.volume = this.calculateVolume('music');
            
            // Handle music loading errors gracefully
            this.currentMusic.addEventListener('error', () => {
                console.warn(`Background music file not found: ${musicTrack} - continuing without music`);
                this.currentMusic = null;
                this.currentContext = null;
            });
            
            const playPromise = this.currentMusic.play();
            if (playPromise) {
                playPromise.then(() => {
                    console.log(`🎵 Background music started: ${context}`);
                }).catch(error => {
                    console.warn('Background music could not play (file may be missing):', error);
                    this.currentMusic = null;
                    this.currentContext = null;
                });
            }
            
            this.currentContext = context;
        } catch (error) {
            console.warn('Error setting up background music:', error);
            this.currentMusic = null;
            this.currentContext = null;
        }
    }
    
    /**
     * Stop background music with fade out
     */
    stopBackgroundMusic(fadeTime = 1000) {
        if (!this.currentMusic) return;
        
        if (fadeTime > 0) {
            this.fadeOutMusic(fadeTime);
        } else {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
            this.currentContext = null;
        }
    }
    
    /**
     * Pause background music
     */
    pauseBackgroundMusic() {
        if (this.currentMusic && !this.currentMusic.paused) {
            this.currentMusic.pause();
        }
    }
    
    /**
     * Resume background music
     */
    resumeBackgroundMusic() {
        if (this.currentMusic && this.currentMusic.paused) {
            const playPromise = this.currentMusic.play();
            if (playPromise) {
                playPromise.catch(error => {
                    console.warn('Failed to resume background music:', error);
                });
            }
        }
    }
    
    /**
     * Fade out music smoothly
     */
    fadeOutMusic(duration = 1000) {
        if (!this.currentMusic || this.musicFading) return;
        
        this.musicFading = true;
        const startVolume = this.currentMusic.volume;
        const fadeSteps = 20;
        const stepTime = duration / fadeSteps;
        const volumeStep = startVolume / fadeSteps;
        
        let currentStep = 0;
        
        const fadeInterval = setInterval(() => {
            currentStep++;
            const newVolume = startVolume - (volumeStep * currentStep);
            
            if (newVolume <= 0 || currentStep >= fadeSteps) {
                this.currentMusic.pause();
                this.currentMusic.currentTime = 0;
                this.currentMusic = null;
                this.currentContext = null;
                this.musicFading = false;
                clearInterval(fadeInterval);
            } else {
                this.currentMusic.volume = newVolume;
            }
        }, stepTime);
    }
    
    /**
     * Transition to new background music with crossfade
     */
    transitionToMusic(newContext, fadeTime = 1000) {
        if (this.currentContext === newContext) return;
        
        if (this.currentMusic) {
            this.fadeOutMusic(fadeTime / 2);
            setTimeout(() => {
                this.playBackgroundMusic(newContext);
            }, fadeTime / 2);
        } else {
            this.playBackgroundMusic(newContext);
        }
    }
    
    // ===================================
    // VOICE NARRATION METHODS
    // ===================================
    
    /**
     * Speak text using text-to-speech
     */
    speak(text, options = {}) {
        if (!this.settings.voiceNarration || !this.speechSynthesis || this.isMuted) {
            return;
        }
        
        // Cancel any ongoing speech
        this.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure voice settings
        utterance.voice = this.currentVoice;
        utterance.rate = options.rate || 0.9;        // Slightly slower for kids
        utterance.pitch = options.pitch || 1.1;      // Slightly higher pitch
        utterance.volume = this.calculateVolume('voice', options.volume);
        
        // Add event listeners
        utterance.onstart = () => {
            console.log(`🗣️ Speaking: "${text}"`);
        };
        
        utterance.onerror = (error) => {
            console.warn('Speech synthesis error:', error);
        };
        
        this.speechSynthesis.speak(utterance);
        return utterance;
    }
    
    /**
     * Stop any ongoing speech
     */
    stopSpeaking() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }
    }
    
    /**
     * Speak mascot message with personality
     */
    speakAsMascot(text) {
        this.speak(text, {
            rate: 1.0,
            pitch: 1.2,
            volume: 0.9
        });
    }
    
    /**
     * Speak lesson content clearly
     */
    speakLesson(text) {
        this.speak(text, {
            rate: 0.8,
            pitch: 1.0,
            volume: 1.0
        });
    }
    
    // ===================================
    // AUDIO CONTEXT METHODS
    // ===================================
    
    /**
     * Set audio context (changes music and ambience)
     */
    setAudioContext(context) {
        if (AUDIO_CONFIG.contexts[context]) {
            this.transitionToMusic(context);
            console.log(`🎭 Audio context changed to: ${context}`);
        }
    }
    
    /**
     * Get current audio context
     */
    getCurrentContext() {
        return this.currentContext;
    }
    
    // ===================================
    // VOLUME AND SETTINGS METHODS
    // ===================================
    
    /**
     * Calculate final volume based on type and settings
     */
    calculateVolume(audioType, specificVolume = 1.0) {
        const baseVolume = AUDIO_CONFIG.volumes[audioType] || 1.0;
        const masterVolume = this.settings.masterVolume || 1.0;
        return Math.min(1.0, baseVolume * masterVolume * specificVolume);
    }
    
    /**
     * Update audio settings
     */
    updateSettings(newSettings) {
        Object.assign(this.settings, newSettings);
        
        // Apply changes immediately
        if (this.currentMusic) {
            this.currentMusic.volume = this.calculateVolume('music');
        }
        
        // Start/stop music based on setting
        if (newSettings.backgroundMusic === false) {
            this.stopBackgroundMusic();
        } else if (newSettings.backgroundMusic === true && !this.currentMusic) {
            this.playBackgroundMusic(this.currentContext || 'menu');
        }
        
        console.log('🔧 Audio settings updated');
    }
    
    /**
     * Set master volume
     */
    setMasterVolume(volume) {
        this.settings.masterVolume = Math.max(0, Math.min(1, volume));
        
        // Update current music volume
        if (this.currentMusic) {
            this.currentMusic.volume = this.calculateVolume('music');
        }
        
        // Save to storage
        TimeQuestStorage.updateSettings({ masterVolume: this.settings.masterVolume });
    }
    
    /**
     * Mute/unmute all audio
     */
    setMuted(muted) {
        this.isMuted = muted;
        
        if (muted) {
            this.pauseBackgroundMusic();
            this.stopSpeaking();
        } else if (this.settings.backgroundMusic) {
            this.resumeBackgroundMusic();
        }
        
        console.log(`🔇 Audio ${muted ? 'muted' : 'unmuted'}`);
    }
    
    /**
     * Toggle mute state
     */
    toggleMute() {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }
    
    // ===================================
    // PRESET AUDIO COMBINATIONS
    // ===================================
    
    /**
     * Play audio for correct answer
     */
    playCorrectAnswer() {
        this.playSound('correct');
        this.speakAsMascot('Great job!');
    }
    
    /**
     * Play audio for incorrect answer
     */
    playIncorrectAnswer() {
        this.playSound('incorrect');
        this.speakAsMascot('Try again!');
    }
    
    /**
     * Play audio for level completion
     */
    playLevelComplete() {
        this.playSoundSequence(['levelUp', 'celebration'], 300);
        this.speakAsMascot('Level complete! Amazing work!');
    }
    
    /**
     * Play audio for achievement unlock
     */
    playAchievementUnlock(achievementName) {
        this.playSound('achievement');
        this.speakAsMascot(`Achievement unlocked: ${achievementName}!`);
    }
    
    /**
     * Play audio for game start
     */
    playGameStart() {
        this.playSound('gameStart');
        this.speakAsMascot('Let the adventure begin!');
    }
    
    /**
     * Play audio for game over
     */
    playGameOver(won = false) {
        if (won) {
            this.playSound('gameWin');
            this.speakAsMascot('Congratulations! You won!');
        } else {
            this.playSound('gameOver');
            this.speakAsMascot('Good try! Want to play again?');
        }
    }
    
    // ===================================
    // DIAGNOSTIC AND UTILITY METHODS
    // ===================================
    
    /**
     * Test audio system functionality
     */
    testAudio() {
        console.log('🧪 Testing audio system...');
        
        // Test sound effect
        this.playSound('buttonClick');
        
        // Test speech synthesis
        this.speak('Audio test successful!');
        
        // Test background music
        this.playBackgroundMusic('menu');
        
        setTimeout(() => {
            this.stopBackgroundMusic(500);
        }, 2000);
    }
    
    /**
     * Get audio system information
     */
    getAudioInfo() {
        return {
            initialized: this.isInitialized,
            webAudioSupport: !!this.audioContext,
            speechSynthesisSupport: !!this.speechSynthesis,
            currentMusic: this.currentContext,
            isMuted: this.isMuted,
            settings: this.settings,
            loadedSounds: Array.from(this.audioElements.keys())
        };
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        this.stopBackgroundMusic(0);
        this.stopSpeaking();
        
        // Clean up audio elements
        this.audioElements.forEach(audio => {
            audio.pause();
            audio.src = '';
        });
        this.audioElements.clear();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        console.log('🧹 Audio manager cleaned up');
    }
}

// ===================================
// INITIALIZE THE AUDIO MANAGER
// ===================================

// Create global audio manager instance
const audioManager = new AudioManager();

// Initialize when app starts (after user interaction)
let audioInitialized = false;
const initializeAudio = async () => {
    if (!audioInitialized) {
        await audioManager.initialize();
        audioInitialized = true;
        
        // Remove the initialization listeners
        document.removeEventListener('click', initializeAudio);
        document.removeEventListener('touchstart', initializeAudio);
    }
};

// Wait for user interaction to initialize (required by browsers)
document.addEventListener('click', initializeAudio);
document.addEventListener('touchstart', initializeAudio);

// ===================================
// EXPORT FOR OTHER FILES TO USE
// ===================================

window.TimeQuestAudio = {
    // Main manager instance
    manager: audioManager,
    
    // Quick access methods
    playSound: (soundId, volume) => audioManager.playSound(soundId, volume),
    playBackgroundMusic: (context) => audioManager.playBackgroundMusic(context),
    stopBackgroundMusic: () => audioManager.stopBackgroundMusic(),
    speak: (text, options) => audioManager.speak(text, options),
    setAudioContext: (context) => audioManager.setAudioContext(context),
    
    // Preset combinations
    playCorrectAnswer: () => audioManager.playCorrectAnswer(),
    playIncorrectAnswer: () => audioManager.playIncorrectAnswer(),
    playLevelComplete: () => audioManager.playLevelComplete(),
    playCelebrationSounds: () => audioManager.playCelebrationSounds(),
    
    // Settings
    setMasterVolume: (volume) => audioManager.setMasterVolume(volume),
    toggleMute: () => audioManager.toggleMute(),
    updateSettings: (settings) => audioManager.updateSettings(settings)
};

console.log('✅ Time Quest Audio Manager loaded successfully!');