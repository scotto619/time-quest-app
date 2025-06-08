/**
 * TIME QUEST - GAME MANAGER
 * The epic quest designer that transforms time-learning into thrilling adventures
 * Think of this as your personal game master and story architect
 */

// ===================================
// GAME WORLD CONFIGURATION
// The epic story, worlds, and challenges that await brave time travelers
// ===================================

const GAME_WORLDS = {
    'clocktower-village': {
        name: 'Clocktower Village',
        description: 'A peaceful village where all the clocks have stopped working',
        theme: 'medieval-fantasy',
        difficulty: 'beginner',
        levels: 5,
        story: 'The village clockmaker has disappeared! Help restore time to save the village.',
        boss: 'The Tick-Tock Troll',
        skills: ['analog-reading', 'hour-hand'],
        rewards: {
            coins: 100,
            badge: 'Village Hero',
            unlock: 'crystal-caves'
        }
    },
    
    'crystal-caves': {
        name: 'Crystal Caves of Time',
        description: 'Mysterious caves where time crystals hold ancient secrets',
        theme: 'magic-adventure',
        difficulty: 'easy',
        levels: 6,
        story: 'Ancient time crystals are scattered! Solve their riddles to unlock their power.',
        boss: 'The Crystal Guardian',
        skills: ['minute-hand', 'quarter-hours'],
        rewards: {
            coins: 200,
            badge: 'Crystal Master',
            unlock: 'sky-kingdom'
        }
    },
    
    'sky-kingdom': {
        name: 'Sky Kingdom',
        description: 'A floating kingdom where the sun and moon are controlled by clockwork',
        theme: 'steampunk-sky',
        difficulty: 'medium',
        levels: 7,
        story: 'The celestial clockwork is broken! Help the Sky King restore day and night.',
        boss: 'The Gear Emperor',
        skills: ['five-minutes', 'digital-analog'],
        rewards: {
            coins: 300,
            badge: 'Sky Warrior',
            unlock: 'time-temple'
        }
    },
    
    'time-temple': {
        name: 'The Time Temple',
        description: 'An ancient temple holding the secrets of all time',
        theme: 'ancient-mystical',
        difficulty: 'hard',
        levels: 8,
        story: 'Face the ultimate test! Prove your mastery over time itself.',
        boss: 'Chronos the Time Master',
        skills: ['elapsed-time', 'mixed-practice'],
        rewards: {
            coins: 500,
            badge: 'Time Master',
            unlock: 'legend-status'
        }
    }
};

const ADVENTURE_CHALLENGES = {
    'story-mission': {
        name: 'Story Mission',
        description: 'Advance the main quest storyline',
        type: 'narrative',
        difficulty: 'adaptive'
    },
    
    'rescue-mission': {
        name: 'Rescue Mission',
        description: 'Save villagers trapped by time magic',
        type: 'timed-challenge',
        difficulty: 'medium'
    },
    
    'puzzle-chamber': {
        name: 'Puzzle Chamber',
        description: 'Solve ancient time puzzles',
        type: 'logic-puzzle',
        difficulty: 'hard'
    },
    
    'boss-battle': {
        name: 'Boss Battle',
        description: 'Epic showdown with world guardians',
        type: 'boss-fight',
        difficulty: 'very-hard'
    },
    
    'treasure-hunt': {
        name: 'Treasure Hunt',
        description: 'Find hidden time treasures',
        type: 'exploration',
        difficulty: 'easy'
    },
    
    'speed-trial': {
        name: 'Speed Trial',
        description: 'Complete challenges against the clock',
        type: 'speed-challenge',
        difficulty: 'medium'
    }
};

// ===================================
// CHARACTER PROGRESSION SYSTEM
// Hero growth, equipment, and abilities
// ===================================

const CHARACTER_SYSTEM = {
    levels: {
        1: { title: 'Time Apprentice', xpRequired: 0, abilities: ['basic-clock'] },
        5: { title: 'Clock Novice', xpRequired: 500, abilities: ['basic-clock', 'hour-reading'] },
        10: { title: 'Time Student', xpRequired: 1200, abilities: ['basic-clock', 'hour-reading', 'minute-reading'] },
        15: { title: 'Clock Scholar', xpRequired: 2000, abilities: ['basic-clock', 'hour-reading', 'minute-reading', 'time-conversion'] },
        20: { title: 'Time Warrior', xpRequired: 3000, abilities: ['all-abilities', 'time-manipulation'] },
        25: { title: 'Clock Master', xpRequired: 4500, abilities: ['all-abilities', 'time-manipulation', 'temporal-magic'] },
        30: { title: 'Time Lord', xpRequired: 6500, abilities: ['legendary-powers'] }
    },
    
    equipment: {
        'starter-watch': { name: 'Apprentice Watch', power: 1, description: 'A simple timepiece for beginners' },
        'silver-clock': { name: 'Silver Pocket Clock', power: 2, description: 'Increases time-reading accuracy' },
        'golden-chronometer': { name: 'Golden Chronometer', power: 3, description: 'Grants time manipulation powers' },
        'crystal-timepiece': { name: 'Crystal Timepiece', power: 4, description: 'Unlocks temporal magic abilities' },
        'legendary-hourglass': { name: 'Legendary Hourglass', power: 5, description: 'Master of all time domains' }
    }
};

// ===================================
// GAME MANAGER CLASS
// Central controller for adventure mode gaming
// ===================================

class GameManager {
    constructor() {
        this.currentWorld = null;
        this.currentLevel = 1;
        this.playerCharacter = null;
        this.activeChallenge = null;
        this.worldProgress = {};
        this.storyState = {};
        this.isInGame = false;
        
        // Game UI elements
        this.gameContainer = null;
        this.storyDisplay = null;
        this.characterPanel = null;
        this.worldMap = null;
        this.challengeArea = null;
        
        console.log('🎮 Game Manager created');
    }
    
    /**
     * Initialize the game system
     */
    initialize() {
        this.setupGameUI();
        this.loadPlayerProgress();
        this.createPlayerCharacter();
        this.showWorldMap();
        
        // Set game audio context
        TimeQuestAudio.setAudioContext('game');
        
        console.log('✅ Adventure mode initialized');
    }
    
    /**
     * Set up game-specific UI
     */
    setupGameUI() {
        this.gameContainer = TimeQuestUtils.getElement('game-content');
        if (!this.gameContainer) {
            console.error('Game container not found');
            return;
        }
        
        this.gameContainer.innerHTML = `
            <div class="adventure-game">
                <div class="game-header">
                    <div class="character-panel" id="character-panel">
                        <!-- Character info will be loaded here -->
                    </div>
                    <div class="game-progress" id="game-progress">
                        <!-- Progress indicators will be loaded here -->
                    </div>
                </div>
                
                <div class="game-main" id="game-main-area">
                    <!-- Main game content (world map, story, challenges) -->
                </div>
                
                <div class="game-hud">
                    <button id="game-menu-btn" class="hud-button">📋 Menu</button>
                    <button id="game-map-btn" class="hud-button">🗺️ Map</button>
                    <button id="game-inventory-btn" class="hud-button">🎒 Items</button>
                    <button id="game-help-btn" class="hud-button">❓ Help</button>
                </div>
            </div>
        `;
        
        // Store references
        this.characterPanel = TimeQuestUtils.getElement('character-panel');
        this.gameMainArea = TimeQuestUtils.getElement('game-main-area');
        
        // Attach event listeners
        this.attachGameEventListeners();
    }
    
    /**
     * Load player progress from storage
     */
    loadPlayerProgress() {
        const profile = TimeQuestStorage.getCurrentProfile();
        if (profile) {
            this.worldProgress = profile.gameProgress || {};
            this.storyState = profile.storyState || {};
        }
    }
    
    /**
     * Create or load player character
     */
    createPlayerCharacter() {
        const profile = TimeQuestStorage.getCurrentProfile();
        if (!profile) return;
        
        this.playerCharacter = {
            name: profile.name,
            avatar: profile.avatar,
            level: this.calculateCharacterLevel(profile.totalStars),
            xp: profile.totalStars * 10, // 10 XP per star
            coins: profile.gameCoins || 0,
            equipment: profile.equipment || ['starter-watch'],
            abilities: this.getAbilitiesForLevel(this.calculateCharacterLevel(profile.totalStars)),
            health: 100,
            maxHealth: 100
        };
        
        this.updateCharacterDisplay();
    }
    
    /**
     * Calculate character level based on total stars
     */
    calculateCharacterLevel(totalStars) {
        const xp = totalStars * 10;
        
        for (let level = 30; level >= 1; level--) {
            const levelData = CHARACTER_SYSTEM.levels[level];
            if (levelData && xp >= levelData.xpRequired) {
                return level;
            }
        }
        
        return 1;
    }
    
    /**
     * Get abilities for character level
     */
    getAbilitiesForLevel(level) {
        for (let checkLevel = level; checkLevel >= 1; checkLevel--) {
            const levelData = CHARACTER_SYSTEM.levels[checkLevel];
            if (levelData) {
                return levelData.abilities;
            }
        }
        return ['basic-clock'];
    }
    
    /**
     * Update character display panel
     */
    updateCharacterDisplay() {
        if (!this.characterPanel || !this.playerCharacter) return;
        
        const levelData = CHARACTER_SYSTEM.levels[this.playerCharacter.level] || { title: 'Time Apprentice' };
        
        this.characterPanel.innerHTML = `
            <div class="character-info">
                <div class="character-avatar">${this.playerCharacter.avatar}</div>
                <div class="character-details">
                    <h3>${this.playerCharacter.name}</h3>
                    <p class="character-title">${levelData.title}</p>
                    <div class="character-stats">
                        <div class="stat">
                            <span class="stat-label">Level</span>
                            <span class="stat-value">${this.playerCharacter.level}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">XP</span>
                            <span class="stat-value">${this.playerCharacter.xp}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Coins</span>
                            <span class="stat-value">🪙 ${this.playerCharacter.coins}</span>
                        </div>
                    </div>
                    <div class="health-bar">
                        <div class="health-fill" style="width: ${(this.playerCharacter.health / this.playerCharacter.maxHealth) * 100}%"></div>
                        <span class="health-text">${this.playerCharacter.health}/${this.playerCharacter.maxHealth}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Attach game event listeners
     */
    attachGameEventListeners() {
        const menuBtn = TimeQuestUtils.getElement('game-menu-btn');
        const mapBtn = TimeQuestUtils.getElement('game-map-btn');
        const inventoryBtn = TimeQuestUtils.getElement('game-inventory-btn');
        const helpBtn = TimeQuestUtils.getElement('game-help-btn');
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.showGameMenu());
        }
        
        if (mapBtn) {
            mapBtn.addEventListener('click', () => this.showWorldMap());
        }
        
        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => this.showInventory());
        }
        
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showGameHelp());
        }
    }
    
    /**
     * Show the world map for level selection
     */
    showWorldMap() {
        if (!this.gameMainArea) return;
        
        this.gameMainArea.innerHTML = `
            <div class="world-map">
                <div class="map-header">
                    <h2>🗺️ Time Quest World Map</h2>
                    <p>Choose your next adventure!</p>
                </div>
                
                <div class="worlds-container">
                    ${this.createWorldButtons()}
                </div>
                
                <div class="map-legend">
                    <div class="legend-item">
                        <span class="world-status unlocked">🟢</span>
                        <span>Available</span>
                    </div>
                    <div class="legend-item">
                        <span class="world-status locked">🔒</span>
                        <span>Locked</span>
                    </div>
                    <div class="legend-item">
                        <span class="world-status completed">⭐</span>
                        <span>Completed</span>
                    </div>
                </div>
            </div>
        `;
        
        this.attachWorldMapListeners();
    }
    
    /**
     * Create world selection buttons
     */
    createWorldButtons() {
        let html = '';
        let previousWorldCompleted = true;
        
        Object.entries(GAME_WORLDS).forEach(([worldId, world]) => {
            const worldProgress = this.worldProgress[worldId] || { completed: false, level: 1 };
            const isUnlocked = previousWorldCompleted;
            const isCompleted = worldProgress.completed;
            
            let statusClass = 'locked';
            let statusIcon = '🔒';
            
            if (isCompleted) {
                statusClass = 'completed';
                statusIcon = '⭐';
            } else if (isUnlocked) {
                statusClass = 'unlocked';
                statusIcon = '🟢';
            }
            
            html += `
                <div class="world-button ${statusClass}" data-world="${worldId}" ${!isUnlocked ? 'disabled' : ''}>
                    <div class="world-status">${statusIcon}</div>
                    <div class="world-info">
                        <h3>${world.name}</h3>
                        <p>${world.description}</p>
                        <div class="world-details">
                            <span class="world-difficulty">${world.difficulty}</span>
                            <span class="world-progress">${worldProgress.level || 1}/${world.levels}</span>
                        </div>
                    </div>
                    <div class="world-rewards">
                        <span>🪙 ${world.rewards.coins}</span>
                        <span>🏆 ${world.rewards.badge}</span>
                    </div>
                </div>
            `;
            
            // Update for next iteration
            previousWorldCompleted = isCompleted;
        });
        
        return html;
    }
    
    /**
     * Attach world map event listeners
     */
    attachWorldMapListeners() {
        const worldButtons = document.querySelectorAll('.world-button:not([disabled])');
        worldButtons.forEach(button => {
            button.addEventListener('click', () => {
                const worldId = button.getAttribute('data-world');
                this.enterWorld(worldId);
            });
        });
    }
    
    /**
     * Enter a specific world
     */
    enterWorld(worldId) {
        const world = GAME_WORLDS[worldId];
        if (!world) return;
        
        this.currentWorld = worldId;
        this.isInGame = true;
        
        // Show world introduction
        this.showWorldIntroduction(world);
        
        // Play world music
        TimeQuestAudio.setAudioContext('game');
        
        // Mascot introduction
        TimeQuestUI.mascotSay(`Welcome to ${world.name}! ${world.story}`);
        
        console.log(`🌍 Entered world: ${world.name}`);
    }
    
    /**
     * Show world introduction and level selection
     */
    showWorldIntroduction(world) {
        if (!this.gameMainArea) return;
        
        const worldProgress = this.worldProgress[this.currentWorld] || { level: 1, completed: false };
        
        this.gameMainArea.innerHTML = `
            <div class="world-introduction">
                <div class="world-banner">
                    <h2>${world.name}</h2>
                    <p class="world-story">${world.story}</p>
                </div>
                
                <div class="world-levels">
                    <h3>Choose Your Challenge</h3>
                    <div class="levels-grid">
                        ${this.createLevelButtons(world, worldProgress)}
                    </div>
                </div>
                
                <div class="world-boss-preview" ${worldProgress.level < world.levels ? 'style="display:none;"' : ''}>
                    <div class="boss-card">
                        <h3>🐉 Boss Battle</h3>
                        <h4>${world.boss}</h4>
                        <p>Face the ultimate challenge to complete this world!</p>
                        <button id="boss-battle-btn" class="challenge-button boss-button">
                            ⚔️ Challenge ${world.boss}
                        </button>
                    </div>
                </div>
                
                <div class="world-actions">
                    <button id="back-to-map-btn" class="action-button secondary">
                        ← Back to Map
                    </button>
                </div>
            </div>
        `;
        
        this.attachWorldIntroListeners(world, worldProgress);
    }
    
    /**
     * Create level selection buttons
     */
    createLevelButtons(world, worldProgress) {
        let html = '';
        
        for (let level = 1; level <= world.levels; level++) {
            const isUnlocked = level <= worldProgress.level;
            const isCompleted = level < worldProgress.level || worldProgress.completed;
            
            let statusClass = 'locked';
            let statusIcon = '🔒';
            
            if (isCompleted) {
                statusClass = 'completed';
                statusIcon = '✅';
            } else if (isUnlocked) {
                statusClass = 'current';
                statusIcon = '▶️';
            }
            
            html += `
                <button class="level-button ${statusClass}" 
                        data-level="${level}" 
                        ${!isUnlocked ? 'disabled' : ''}>
                    <span class="level-status">${statusIcon}</span>
                    <span class="level-number">Level ${level}</span>
                    <span class="level-stars">${isCompleted ? '⭐⭐⭐' : ''}</span>
                </button>
            `;
        }
        
        return html;
    }
    
    /**
     * Attach world introduction event listeners
     */
    attachWorldIntroListeners(world, worldProgress) {
        // Level buttons
        const levelButtons = document.querySelectorAll('.level-button:not([disabled])');
        levelButtons.forEach(button => {
            button.addEventListener('click', () => {
                const level = parseInt(button.getAttribute('data-level'));
                this.startLevel(world, level);
            });
        });
        
        // Boss battle button
        const bossBtn = TimeQuestUtils.getElement('boss-battle-btn');
        if (bossBtn) {
            bossBtn.addEventListener('click', () => {
                this.startBossBattle(world);
            });
        }
        
        // Back to map button
        const backBtn = TimeQuestUtils.getElement('back-to-map-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showWorldMap();
            });
        }
    }
    
    /**
     * Start a specific level
     */
    startLevel(world, levelNumber) {
        this.currentLevel = levelNumber;
        
        // Generate level content
        const levelData = this.generateLevelContent(world, levelNumber);
        
        // Show level start screen
        this.showLevelStart(levelData);
        
        console.log(`🎯 Starting level ${levelNumber} in ${world.name}`);
    }
    
    /**
     * Generate content for a specific level
     */
    generateLevelContent(world, levelNumber) {
        const challengeTypes = ['story-mission', 'rescue-mission', 'puzzle-chamber', 'treasure-hunt'];
        const challengeType = TimeQuestUtils.randomChoice(challengeTypes);
        const challenge = ADVENTURE_CHALLENGES[challengeType];
        
        // Create story-specific missions
        const storyMissions = this.getStoryMissionsForWorld(world.name, levelNumber);
        
        return {
            world: world,
            level: levelNumber,
            challenge: challenge,
            story: storyMissions,
            skills: world.skills,
            rewards: {
                xp: levelNumber * 20,
                coins: levelNumber * 10,
                items: this.generateLevelRewards(levelNumber)
            }
        };
    }
    
    /**
     * Get story missions for specific world
     */
    getStoryMissionsForWorld(worldName, level) {
        const storyDatabase = {
            'Clocktower Village': [
                'Help the baker fix his oven timer',
                'Find the missing clock hands in the forest',
                'Solve the riddle of the sundial',
                'Repair the village bell tower',
                'Discover the clockmaker\'s secret workshop'
            ],
            'Crystal Caves of Time': [
                'Navigate the crystal maze using time clues',
                'Decode ancient time runes on cave walls',
                'Activate dormant time crystals',
                'Rescue trapped miners from time loops',
                'Unlock the chamber of eternal moments',
                'Face the crystal sphinx\'s time riddles'
            ],
            'Sky Kingdom': [
                'Repair the celestial clockwork gears',
                'Help the cloud shepherds schedule their routes',
                'Fix the sunrise/sunset mechanisms',
                'Calibrate the star navigation clocks',
                'Restore the moon phase timer',
                'Synchronize the sky islands\' time zones',
                'Prepare for the Gear Emperor\'s challenge'
            ],
            'The Time Temple': [
                'Pass the Trial of Hours',
                'Master the Chamber of Minutes',
                'Solve the Riddle of Elapsed Time',
                'Navigate the Temporal Labyrinth',
                'Face the Guardians of Past and Future',
                'Unlock the Vault of Infinite Moments',
                'Prove worthy to challenge Chronos',
                'The Final Confrontation with Time itself'
            ]
        };
        
        const missions = storyDatabase[worldName] || ['Complete the time challenge'];
        return missions[level - 1] || missions[missions.length - 1];
    }
    
    /**
     * Show level start screen
     */
    showLevelStart(levelData) {
        if (!this.gameMainArea) return;
        
        this.gameMainArea.innerHTML = `
            <div class="level-start">
                <div class="level-header">
                    <h2>${levelData.world.name}</h2>
                    <h3>Level ${levelData.level}</h3>
                </div>
                
                <div class="mission-briefing">
                    <div class="mission-icon">🎯</div>
                    <h4>Mission: ${levelData.challenge.name}</h4>
                    <p class="mission-story">${levelData.story}</p>
                    <p class="mission-objective">${levelData.challenge.description}</p>
                </div>
                
                <div class="level-info">
                    <div class="info-item">
                        <span class="info-label">Skills Needed:</span>
                        <span class="info-value">${levelData.skills.join(', ')}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Rewards:</span>
                        <span class="info-value">
                            🌟 ${levelData.rewards.xp} XP • 
                            🪙 ${levelData.rewards.coins} Coins
                        </span>
                    </div>
                </div>
                
                <div class="level-actions">
                    <button id="start-mission-btn" class="action-button primary large">
                        🚀 Start Mission
                    </button>
                    <button id="level-back-btn" class="action-button secondary">
                        ← Back to World
                    </button>
                </div>
            </div>
        `;
        
        // Attach event listeners
        const startBtn = TimeQuestUtils.getElement('start-mission-btn');
        const backBtn = TimeQuestUtils.getElement('level-back-btn');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startMission(levelData);
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showWorldIntroduction(levelData.world);
            });
        }
        
        // Mascot briefing
        TimeQuestUI.mascotSay(`Your mission: ${levelData.story}. Are you ready, time warrior?`);
    }
    
    /**
     * Start the actual mission/challenge
     */
    startMission(levelData) {
        // Create appropriate challenge based on type
        const challengeGenerators = {
            'story-mission': () => this.createStoryMission(levelData),
            'rescue-mission': () => this.createRescueMission(levelData),
            'puzzle-chamber': () => this.createPuzzleMission(levelData),
            'treasure-hunt': () => this.createTreasureHunt(levelData),
            'speed-trial': () => this.createSpeedTrial(levelData)
        };
        
        const generator = challengeGenerators[levelData.challenge.type];
        if (generator) {
            generator();
        } else {
            // Default to story mission
            this.createStoryMission(levelData);
        }
        
        // Play mission start audio
        TimeQuestAudio.playGameStart();
        TimeQuestUI.mascotSay("The adventure begins! Good luck!");
    }
    
    /**
     * Create story mission challenge
     */
    createStoryMission(levelData) {
        // Use existing game logic to create time challenges
        const gameSession = TimeQuestGame.createGameSession('adventure', levelData.world.difficulty);
        
        // Generate challenges based on world skills
        const skillType = TimeQuestUtils.randomChoice(levelData.skills);
        const challenge = gameSession.startChallenge(skillType);
        
        this.activeChallenge = {
            type: 'story-mission',
            gameSession: gameSession,
            challenge: challenge,
            levelData: levelData
        };
        
        // Show challenge interface
        this.showChallengeInterface(challenge, 'story');
    }
    
    /**
     * Create rescue mission challenge
     */
    createRescueMission(levelData) {
        // Time-based rescue challenges
        const rescueScenarios = [
            {
                story: 'A villager is trapped! Set the rescue timer to exactly 15 minutes.',
                targetTime: { hours: 12, minutes: 15 },
                instruction: 'Set the clock to 15 minutes to trigger the rescue!'
            },
            {
                story: 'The bridge will collapse in 30 minutes! Set the warning alarm.',
                targetTime: { hours: 12, minutes: 30 },
                instruction: 'Quick! Set the alarm for 30 minutes from now!'
            },
            {
                story: 'Medicine must be delivered in exactly 45 minutes.',
                targetTime: { hours: 12, minutes: 45 },
                instruction: 'Set the delivery timer to 45 minutes!'
            }
        ];
        
        const scenario = TimeQuestUtils.randomChoice(rescueScenarios);
        
        this.activeChallenge = {
            type: 'rescue-mission',
            scenario: scenario,
            levelData: levelData,
            timeLimit: 60 // 60 seconds to complete
        };
        
        this.showRescueMissionInterface(scenario);
    }
    
    /**
     * Show rescue mission interface
     */
    showRescueMissionInterface(scenario) {
        if (!this.gameMainArea) return;
        
        this.gameMainArea.innerHTML = `
            <div class="rescue-mission">
                <div class="mission-urgent-header">
                    <h2>🚨 URGENT RESCUE MISSION</h2>
                    <div class="countdown-timer" id="rescue-timer">60</div>
                </div>
                
                <div class="rescue-story">
                    <p>${scenario.story}</p>
                    <h3>${scenario.instruction}</h3>
                </div>
                
                <div class="rescue-clock-area">
                    <div id="rescue-clock"></div>
                </div>
                
                <div class="rescue-actions">
                    <button id="rescue-submit-btn" class="action-button primary large">
                        🚀 Execute Rescue!
                    </button>
                </div>
            </div>
        `;
        
        // Create rescue clock
        this.rescueClock = TimeQuestClocks.createPresetClock('rescue-clock', 'game', {
            interactive: true,
            onTimeChange: (time) => this.checkRescueTime(time, scenario),
            celebrateCorrectTime: true
        });
        
        // Start countdown timer
        this.startRescueTimer();
        
        // Urgent mascot message
        TimeQuestUI.mascotSay("Hurry! Lives depend on setting the correct time!");
    }
    
    /**
     * Start rescue mission countdown timer
     */
    startRescueTimer() {
        let timeLeft = this.activeChallenge.timeLimit;
        const timerDisplay = TimeQuestUtils.getElement('rescue-timer');
        
        const countdown = setInterval(() => {
            timeLeft--;
            if (timerDisplay) {
                timerDisplay.textContent = timeLeft;
                
                // Change color as time runs out
                if (timeLeft <= 10) {
                    timerDisplay.style.color = '#ff0000';
                    timerDisplay.style.fontSize = '2em';
                } else if (timeLeft <= 20) {
                    timerDisplay.style.color = '#ff8800';
                }
            }
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                this.rescueMissionFailed();
            }
        }, 1000);
        
        this.rescueTimer = countdown;
    }
    
    /**
     * Check if rescue time is correct
     */
    checkRescueTime(time, scenario) {
        if (TimeQuestUtils.isTimeCloseEnough(time, scenario.targetTime, 2)) {
            clearInterval(this.rescueTimer);
            this.rescueMissionSuccess();
        }
    }
    
    /**
     * Handle rescue mission success
     */
    rescueMissionSuccess() {
        TimeQuestUI.triggerCelebration();
        TimeQuestAudio.playCelebrationSounds();
        TimeQuestUI.mascotSay("Amazing! You saved everyone! You're a true hero! 🦸‍♂️");
        
        // Award extra XP for rescue missions
        this.awardMissionRewards(this.activeChallenge.levelData, 1.5);
        
        setTimeout(() => {
            this.completeMission(true);
        }, 3000);
    }
    
    /**
     * Handle rescue mission failure
     */
    rescueMissionFailed() {
        TimeQuestAudio.playIncorrectAnswer();
        TimeQuestUI.mascotSay("Oh no! Time ran out! But don't worry - heroes never give up! Try again!");
        
        // Restart the mission with encouragement
        setTimeout(() => {
            this.createRescueMission(this.activeChallenge.levelData);
        }, 2000);
    }
    
    /**
     * Show challenge interface
     */
    showChallengeInterface(challenge, challengeStyle = 'story') {
        if (!this.gameMainArea) return;
        
        this.gameMainArea.innerHTML = `
            <div class="challenge-interface ${challengeStyle}">
                <div class="challenge-header">
                    <h3>⚔️ ${challenge.instruction}</h3>
                    <div class="challenge-progress">
                        <div class="health-display">
                            <span>❤️ ${this.playerCharacter.health}/${this.playerCharacter.maxHealth}</span>
                        </div>
                    </div>
                </div>
                
                <div class="challenge-content" id="challenge-content-area">
                    <!-- Challenge-specific content -->
                </div>
                
                <div class="challenge-clock-area">
                    <div id="challenge-clock"></div>
                </div>
                
                <div class="challenge-actions">
                    <button id="challenge-hint-btn" class="action-button secondary">
                        💡 Ask Tim for Help
                    </button>
                    <button id="challenge-submit-btn" class="action-button primary">
                        ⚔️ Submit Answer
                    </button>
                </div>
            </div>
        `;
        
        // Create challenge clock
        this.challengeClock = TimeQuestClocks.createPresetClock('challenge-clock', 'game', {
            interactive: true,
            showNumbers: true,
            onTimeChange: (time) => this.handleChallengeTimeChange(time),
            celebrateCorrectTime: true
        });
        
        // Display challenge content
        this.displayChallengeContent(challenge);
        
        // Attach challenge event listeners
        this.attachChallengeListeners(challenge);
    }
    
    /**
     * Display challenge-specific content
     */
    displayChallengeContent(challenge) {
        const contentArea = TimeQuestUtils.getElement('challenge-content-area');
        if (!contentArea) return;
        
        if (challenge.answerType === 'multiple-choice') {
            let choicesHTML = '<div class="adventure-choices">';
            challenge.answers.forEach((answer, index) => {
                const answerText = typeof answer === 'string' ? answer : 
                    `${answer.hours}:${TimeQuestUtils.padNumber(answer.minutes)}`;
                choicesHTML += `
                    <button class="adventure-choice" data-answer="${index}">
                        ${answerText}
                    </button>
                `;
            });
            choicesHTML += '</div>';
            contentArea.innerHTML = choicesHTML;
        } else if (challenge.answerType === 'clock-setting') {
            contentArea.innerHTML = `
                <div class="clock-setting-instruction">
                    <p>🎯 Drag the clock hands to set the correct time!</p>
                    <p class="target-display">Target: <strong>${challenge.displayText || 'Set the time correctly'}</strong></p>
                </div>
            `;
        }
    }
    
    /**
     * Attach challenge event listeners
     */
    attachChallengeListeners(challenge) {
        const hintBtn = TimeQuestUtils.getElement('challenge-hint-btn');
        const submitBtn = TimeQuestUtils.getElement('challenge-submit-btn');
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                this.showChallengeHint(challenge);
            });
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitChallengeAnswer(challenge);
            });
        }
        
        // Choice button listeners
        const choiceButtons = document.querySelectorAll('.adventure-choice');
        choiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                choiceButtons.forEach(b => TimeQuestUtils.removeClass(b, 'selected'));
                TimeQuestUtils.addClass(button, 'selected');
                this.selectedChoice = parseInt(button.getAttribute('data-answer'));
                
                // Auto-submit after choice
                setTimeout(() => this.submitChallengeAnswer(challenge), 800);
            });
        });
    }
    
    /**
     * Handle challenge time changes
     */
    handleChallengeTimeChange(time) {
        const challenge = this.activeChallenge.challenge;
        
        // Auto-submit for clock-setting challenges
        if (challenge.answerType === 'clock-setting' && challenge.targetTime) {
            if (TimeQuestUtils.isTimeCloseEnough(time, challenge.targetTime, 2)) {
                setTimeout(() => this.submitChallengeAnswer(challenge), 500);
            }
        }
    }
    
    /**
     * Show challenge hint
     */
    showChallengeHint(challenge) {
        const hints = challenge.hints || ["Think carefully about the time shown on the clock"];
        const hint = TimeQuestUtils.randomChoice(hints);
        
        TimeQuestUI.mascotSay(`💡 Tim's Hint: ${hint}`);
        
        // Reduce health slightly for using hints (makes it more game-like)
        this.playerCharacter.health = Math.max(this.playerCharacter.health - 5, 0);
        this.updateCharacterDisplay();
    }
    
    /**
     * Submit challenge answer
     */
    submitChallengeAnswer(challenge) {
        let userAnswer;
        
        if (challenge.answerType === 'multiple-choice') {
            userAnswer = challenge.answers[this.selectedChoice];
        } else if (challenge.answerType === 'clock-setting') {
            userAnswer = this.challengeClock.getTime();
        }
        
        const isCorrect = this.validateChallengeAnswer(userAnswer, challenge);
        
        // Show result
        this.showChallengeResult(isCorrect, challenge);
        
        // Process result
        if (isCorrect) {
            this.playerCharacter.health = Math.min(this.playerCharacter.health + 10, this.playerCharacter.maxHealth);
            this.awardMissionRewards(this.activeChallenge.levelData);
            
            setTimeout(() => {
                this.completeMission(true);
            }, 2500);
        } else {
            this.playerCharacter.health = Math.max(this.playerCharacter.health - 20, 0);
            
            if (this.playerCharacter.health <= 0) {
                this.missionFailed();
            } else {
                TimeQuestUI.mascotSay("Not quite right! But you can do this! Try again!");
                // Allow retry
            }
        }
        
        this.updateCharacterDisplay();
    }
    
    /**
     * Validate challenge answer
     */
    validateChallengeAnswer(userAnswer, challenge) {
        if (challenge.answerType === 'multiple-choice') {
            if (typeof challenge.correctAnswer === 'string') {
                return userAnswer === challenge.correctAnswer;
            } else {
                return TimeQuestUtils.isTimeCloseEnough(userAnswer, challenge.correctAnswer, 2);
            }
        } else if (challenge.answerType === 'clock-setting') {
            return TimeQuestUtils.isTimeCloseEnough(userAnswer, challenge.targetTime, 2);
        }
        
        return false;
    }
    
    /**
     * Show challenge result
     */
    showChallengeResult(isCorrect, challenge) {
        const resultDisplay = document.createElement('div');
        resultDisplay.className = `challenge-result ${isCorrect ? 'success' : 'failure'}`;
        
        if (isCorrect) {
            resultDisplay.innerHTML = `
                <div class="result-content">
                    <div class="result-icon">✅</div>
                    <h3>Victory!</h3>
                    <p>Excellent work, time warrior!</p>
                </div>
            `;
            TimeQuestAudio.playCorrectAnswer();
            TimeQuestUI.mascotSay("Fantastic! You've mastered that challenge!");
        } else {
            resultDisplay.innerHTML = `
                <div class="result-content">
                    <div class="result-icon">❌</div>
                    <h3>Not Quite Right</h3>
                    <p>Keep trying! Heroes never give up!</p>
                </div>
            `;
            TimeQuestAudio.playIncorrectAnswer();
        }
        
        this.gameMainArea.appendChild(resultDisplay);
        TimeQuestUtils.animateElement(resultDisplay, 'zoom-in');
        
        // Remove after delay
        setTimeout(() => {
            if (resultDisplay.parentNode) {
                resultDisplay.parentNode.removeChild(resultDisplay);
            }
        }, 2000);
    }
    
    /**
     * Award mission rewards
     */
    awardMissionRewards(levelData, multiplier = 1.0) {
        const xpGain = Math.round(levelData.rewards.xp * multiplier);
        const coinsGain = Math.round(levelData.rewards.coins * multiplier);
        
        this.playerCharacter.xp += xpGain;
        this.playerCharacter.coins += coinsGain;
        
        // Check for level up
        const newLevel = this.calculateCharacterLevel(this.playerCharacter.xp / 10);
        if (newLevel > this.playerCharacter.level) {
            this.playerCharacter.level = newLevel;
            this.showLevelUpCelebration(newLevel);
        }
        
        // Save progress
        this.savePlayerProgress();
        
        console.log(`🎁 Awarded: ${xpGain} XP, ${coinsGain} coins`);
    }
    
    /**
     * Complete current mission
     */
    completeMission(success) {
        if (success) {
            // Update world progress
            const worldProgress = this.worldProgress[this.currentWorld] || { level: 1, completed: false };
            worldProgress.level = Math.max(worldProgress.level, this.currentLevel + 1);
            
            if (this.currentLevel >= GAME_WORLDS[this.currentWorld].levels) {
                // World completed - show boss battle option
                this.showWorldCompleted();
            } else {
                // Return to world map
                this.showWorldIntroduction(GAME_WORLDS[this.currentWorld]);
            }
            
            this.savePlayerProgress();
        }
        
        this.activeChallenge = null;
    }
    
    /**
     * Handle mission failure
     */
    missionFailed() {
        TimeQuestUI.mascotSay("Don't worry! Every hero faces setbacks. Let's try again!");
        TimeQuestAudio.playGameOver(false);
        
        // Reset health and restart level
        this.playerCharacter.health = this.playerCharacter.maxHealth;
        this.updateCharacterDisplay();
        
        setTimeout(() => {
            const world = GAME_WORLDS[this.currentWorld];
            this.startLevel(world, this.currentLevel);
        }, 2000);
    }
    
    /**
     * Show level up celebration
     */
    showLevelUpCelebration(newLevel) {
        TimeQuestUI.triggerCelebration();
        TimeQuestAudio.playLevelComplete();
        
        const levelData = CHARACTER_SYSTEM.levels[newLevel];
        TimeQuestUI.mascotSay(`🎉 LEVEL UP! You are now a ${levelData?.title || 'Time Master'}!`);
        
        // Show level up modal with new abilities
        this.showLevelUpModal(newLevel);
    }
    
    /**
     * Show level up modal
     */
    showLevelUpModal(newLevel) {
        const levelData = CHARACTER_SYSTEM.levels[newLevel] || { title: 'Time Master', abilities: [] };
        
        const modal = document.createElement('div');
        modal.className = 'level-up-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🎉 LEVEL UP!</h2>
                <div class="new-level">
                    <span class="level-number">${newLevel}</span>
                    <span class="level-title">${levelData.title}</span>
                </div>
                <div class="new-abilities">
                    <h3>New Abilities Unlocked:</h3>
                    <ul>
                        ${levelData.abilities.map(ability => `<li>✨ ${ability}</li>`).join('')}
                    </ul>
                </div>
                <button class="continue-button" onclick="this.parentElement.parentElement.remove()">
                    Continue Adventure
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        TimeQuestUtils.animateElement(modal, 'zoom-in');
    }
    
    /**
     * Save player progress to storage
     */
    savePlayerProgress() {
        const profile = TimeQuestStorage.getCurrentProfile();
        if (profile) {
            TimeQuestStorage.updateProfile(profile.id, {
                gameProgress: this.worldProgress,
                storyState: this.storyState,
                gameCoins: this.playerCharacter.coins,
                equipment: this.playerCharacter.equipment
            });
        }
    }
    
    /**
     * Start boss battle
     */
    startBossBattle(world) {
        TimeQuestUI.mascotSay(`Prepare yourself! ${world.boss} awaits! This will be your greatest challenge yet!`);
        TimeQuestAudio.playGameStart();
        
        // Create epic boss battle
        this.createBossBattle(world);
    }
    
    /**
     * Create boss battle challenge
     */
    createBossBattle(world) {
        // Boss battles are multi-stage challenges
        const bossStages = this.generateBossStages(world);
        
        this.activeChallenge = {
            type: 'boss-battle',
            world: world,
            stages: bossStages,
            currentStage: 0,
            bossHealth: 100
        };
        
        this.showBossBattleInterface(world, bossStages[0]);
    }
    
    /**
     * Generate boss battle stages
     */
    generateBossStages(world) {
        const stages = [
            {
                name: 'Opening Strike',
                challenge: TimeQuestGame.generateChallenge(world.skills[0], 'hard'),
                description: `${world.boss} tests your basic skills!`
            },
            {
                name: 'Unleashed Power',
                challenge: TimeQuestGame.generateChallenge(world.skills[1] || world.skills[0], 'hard'),
                description: `${world.boss} unleashes their full power!`
            },
            {
                name: 'Final Confrontation',
                challenge: TimeQuestGame.generateChallenge('mixed-practice', 'hard'),
                description: `The ultimate test! Show ${world.boss} your mastery!`
            }
        ];
        
        return stages;
    }
    
    /**
     * Show boss battle interface
     */
    showBossBattleInterface(world, stage) {
        if (!this.gameMainArea) return;
        
        this.gameMainArea.innerHTML = `
            <div class="boss-battle">
                <div class="boss-header">
                    <h2>⚔️ ${world.boss}</h2>
                    <div class="boss-health-bar">
                        <div class="boss-health-fill" style="width: ${this.activeChallenge.bossHealth}%"></div>
                        <span class="boss-health-text">${this.activeChallenge.bossHealth}/100</span>
                    </div>
                </div>
                
                <div class="battle-stage">
                    <h3>${stage.name}</h3>
                    <p>${stage.description}</p>
                </div>
                
                <div class="boss-challenge" id="boss-challenge-area">
                    <h4>${stage.challenge.instruction}</h4>
                    <!-- Challenge interface will be created here -->
                </div>
                
                <div class="boss-clock-area">
                    <div id="boss-clock"></div>
                </div>
                
                <div class="boss-actions">
                    <button id="boss-attack-btn" class="action-button primary large">
                        ⚔️ Attack with Time Magic!
                    </button>
                </div>
            </div>
        `;
        
        // Create boss clock
        this.bossClock = TimeQuestClocks.createPresetClock('boss-clock', 'game', {
            interactive: true,
            showNumbers: true,
            onTimeChange: (time) => this.handleBossTimeChange(time),
            celebrateCorrectTime: true
        });
        
        // Set up boss challenge
        this.setupBossChallenge(stage.challenge);
        
        // Attach boss battle listeners
        this.attachBossBattleListeners(stage);
    }
    
    /**
     * Set up boss challenge content
     */
    setupBossChallenge(challenge) {
        const challengeArea = TimeQuestUtils.getElement('boss-challenge-area');
        if (!challengeArea) return;
        
        // Similar to regular challenge setup but with boss flair
        this.displayChallengeContent(challenge);
        
        // Set boss clock initial state
        if (challenge.clockTime) {
            this.bossClock.setTime(challenge.clockTime.hours, challenge.clockTime.minutes, false);
        }
        
        if (challenge.targetTime) {
            this.bossClock.setTargetTime(challenge.targetTime.hours, challenge.targetTime.minutes);
        }
    }
    
    /**
     * Handle boss battle time changes
     */
    handleBossTimeChange(time) {
        const stage = this.activeChallenge.stages[this.activeChallenge.currentStage];
        const challenge = stage.challenge;
        
        // Auto-attack when correct time is set
        if (challenge.answerType === 'clock-setting' && challenge.targetTime) {
            if (TimeQuestUtils.isTimeCloseEnough(time, challenge.targetTime, 1)) {
                setTimeout(() => this.executeBossAttack(stage), 500);
            }
        }
    }
    
    /**
     * Attach boss battle event listeners
     */
    attachBossBattleListeners(stage) {
        const attackBtn = TimeQuestUtils.getElement('boss-attack-btn');
        
        if (attackBtn) {
            attackBtn.addEventListener('click', () => {
                this.executeBossAttack(stage);
            });
        }
    }
    
    /**
     * Execute boss attack
     */
    executeBossAttack(stage) {
        const challenge = stage.challenge;
        let userAnswer;
        
        if (challenge.answerType === 'multiple-choice') {
            userAnswer = challenge.answers[this.selectedChoice];
        } else {
            userAnswer = this.bossClock.getTime();
        }
        
        const isCorrect = this.validateChallengeAnswer(userAnswer, challenge);
        
        if (isCorrect) {
            // Successful attack!
            this.activeChallenge.bossHealth -= 35;
            TimeQuestAudio.playCorrectAnswer();
            TimeQuestUI.mascotSay("Critical hit! Amazing time magic attack!");
            
            this.updateBossHealthDisplay();
            
            if (this.activeChallenge.bossHealth <= 0) {
                this.bossDefeated();
            } else {
                // Move to next stage
                this.activeChallenge.currentStage++;
                if (this.activeChallenge.currentStage < this.activeChallenge.stages.length) {
                    setTimeout(() => {
                        const nextStage = this.activeChallenge.stages[this.activeChallenge.currentStage];
                        this.showBossBattleInterface(this.activeChallenge.world, nextStage);
                    }, 2000);
                } else {
                    // All stages complete but boss still has health
                    this.bossDefeated();
                }
            }
        } else {
            // Failed attack
            this.playerCharacter.health -= 25;
            TimeQuestAudio.playIncorrectAnswer();
            TimeQuestUI.mascotSay("The boss blocked your attack! Focus your time magic!");
            
            this.updateCharacterDisplay();
            
            if (this.playerCharacter.health <= 0) {
                this.bossBattleFailed();
            }
        }
    }
    
    /**
     * Update boss health display
     */
    updateBossHealthDisplay() {
        const healthFill = document.querySelector('.boss-health-fill');
        const healthText = document.querySelector('.boss-health-text');
        
        if (healthFill) {
            healthFill.style.width = this.activeChallenge.bossHealth + '%';
        }
        
        if (healthText) {
            healthText.textContent = `${this.activeChallenge.bossHealth}/100`;
        }
    }
    
    /**
     * Handle boss defeat
     */
    bossDefeated() {
        const world = this.activeChallenge.world;
        
        // Epic celebration
        TimeQuestUI.triggerCelebration();
        TimeQuestAudio.playGameWin();
        TimeQuestUI.mascotSay(`🎉 INCREDIBLE! You've defeated ${world.boss}! You are a true Time Master!`);
        
        // Mark world as completed
        this.worldProgress[this.currentWorld] = {
            level: world.levels + 1,
            completed: true,
            bossDefeated: true
        };
        
        // Award massive rewards
        this.awardMissionRewards({
            rewards: {
                xp: 500,
                coins: 300
            }
        }, 2.0);
        
        // Unlock next world
        this.unlockNextWorld(world);
        
        // Show victory screen
        setTimeout(() => {
            this.showWorldVictoryScreen(world);
        }, 3000);
    }
    
    /**
     * Handle boss battle failure
     */
    bossBattleFailed() {
        TimeQuestAudio.playGameOver(false);
        TimeQuestUI.mascotSay("The boss was too strong this time! But true heroes never give up! Rest and try again!");
        
        // Reset health
        this.playerCharacter.health = this.playerCharacter.maxHealth;
        this.updateCharacterDisplay();
        
        setTimeout(() => {
            this.showWorldIntroduction(this.activeChallenge.world);
        }, 2500);
    }
    
    /**
     * Show world victory screen
     */
    showWorldVictoryScreen(world) {
        if (!this.gameMainArea) return;
        
        this.gameMainArea.innerHTML = `
            <div class="world-victory">
                <div class="victory-header">
                    <h2>🏆 WORLD CONQUERED!</h2>
                    <h3>${world.name}</h3>
                </div>
                
                <div class="victory-story">
                    <p>You have successfully completed ${world.name} and defeated ${world.boss}!</p>
                    <p>The time magic is restored, and peace returns to the land.</p>
                </div>
                
                <div class="victory-rewards">
                    <h4>🎁 Victory Rewards</h4>
                    <div class="reward-item">🏆 ${world.rewards.badge}</div>
                    <div class="reward-item">🪙 ${world.rewards.coins} Bonus Coins</div>
                    <div class="reward-item">⭐ World Master Status</div>
                </div>
                
                <div class="victory-actions">
                    <button id="next-world-btn" class="action-button primary large">
                        🌟 Continue to Next World
                    </button>
                    <button id="world-map-btn" class="action-button secondary">
                        🗺️ Return to World Map
                    </button>
                </div>
            </div>
        `;
        
        // Attach victory screen listeners
        const nextWorldBtn = TimeQuestUtils.getElement('next-world-btn');
        const mapBtn = TimeQuestUtils.getElement('world-map-btn');
        
        if (nextWorldBtn) {
            nextWorldBtn.addEventListener('click', () => {
                this.showWorldMap();
            });
        }
        
        if (mapBtn) {
            mapBtn.addEventListener('click', () => {
                this.showWorldMap();
            });
        }
    }
    
    /**
     * Unlock next world
     */
    unlockNextWorld(completedWorld) {
        const worldKeys = Object.keys(GAME_WORLDS);
        const currentIndex = worldKeys.indexOf(this.currentWorld);
        
        if (currentIndex < worldKeys.length - 1) {
            const nextWorldKey = worldKeys[currentIndex + 1];
            const nextWorld = GAME_WORLDS[nextWorldKey];
            
            TimeQuestUI.mascotSay(`🌟 New world unlocked: ${nextWorld.name}! Your adventure continues!`);
        } else {
            // Final world completed!
            this.showGameComplete();
        }
    }
    
    /**
     * Show game completion screen
     */
    showGameComplete() {
        TimeQuestUI.mascotSay("🎉 LEGENDARY! You've mastered ALL worlds! You are the ultimate Time Master!");
        
        // Award legendary status
        TimeQuestStorage.awardAchievement('legendary_time_master', {
            name: 'Legendary Time Master',
            description: 'Conquered all worlds and mastered time itself!',
            icon: '👑'
        });
    }
    
    /**
     * Show game menu
     */
    showGameMenu() {
        // Implementation for pause menu
        console.log('📋 Game menu opened');
    }
    
    /**
     * Show inventory
     */
    showInventory() {
        // Implementation for character inventory
        console.log('🎒 Inventory opened');
    }
    
    /**
     * Show game help
     */
    showGameHelp() {
        TimeQuestUI.mascotSay("Welcome to Adventure Mode! Complete missions, defeat bosses, and become the ultimate Time Master!");
    }
    
    /**
     * Generate level rewards
     */
    generateLevelRewards(level) {
        const possibleRewards = ['health-potion', 'time-crystal', 'gear-upgrade'];
        return level % 3 === 0 ? [TimeQuestUtils.randomChoice(possibleRewards)] : [];
    }
}

// ===================================
// INITIALIZE THE GAME MANAGER
// ===================================

// Create global game manager instance
const gameManager = new GameManager();

// ===================================
// EXPORT FOR OTHER FILES TO USE
// ===================================

window.TimeQuestGameManager = {
    manager: gameManager,
    initialize: () => gameManager.initialize(),
    worlds: GAME_WORLDS,
    challenges: ADVENTURE_CHALLENGES
};

console.log('✅ Time Quest Game Manager loaded successfully!');