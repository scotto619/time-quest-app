/**
 * TIME QUEST - TUTORIAL MANAGER
 * The expert teacher that guides kids through learning time step-by-step
 * Think of this as your personal educational consultant and Tim's lesson planner
 */

// ===================================
// TUTORIAL CURRICULUM
// Structured learning progression from basics to mastery
// ===================================

const TUTORIAL_CURRICULUM = {
    lessons: [
        {
            id: 'clock-basics',
            title: 'Meet the Clock',
            description: 'Learn about clock parts and numbers',
            difficulty: 'beginner',
            estimatedTime: 5,
            objectives: [
                'Identify clock face and hands',
                'Recognize numbers 1-12 on clock',
                'Understand hour vs minute hand'
            ],
            prerequisites: []
        },
        {
            id: 'hour-hand',
            title: 'The Hour Hand',
            description: 'Learn how the short hand shows hours',
            difficulty: 'beginner', 
            estimatedTime: 7,
            objectives: [
                'Identify the hour hand',
                'Read times on the hour (1:00, 2:00, etc.)',
                'Practice setting hour hand'
            ],
            prerequisites: ['clock-basics']
        },
        {
            id: 'minute-hand',
            title: 'The Minute Hand',
            description: 'Learn how the long hand shows minutes',
            difficulty: 'easy',
            estimatedTime: 8,
            objectives: [
                'Identify the minute hand',
                'Understand 5-minute intervals',
                'Read half-hour times (30 minutes)'
            ],
            prerequisites: ['hour-hand']
        },
        {
            id: 'quarter-hours',
            title: 'Quarter Hours',
            description: 'Master 15, 30, and 45 minute times',
            difficulty: 'easy',
            estimatedTime: 10,
            objectives: [
                'Read quarter past (15 minutes)',
                'Read half past (30 minutes)', 
                'Read quarter to (45 minutes)'
            ],
            prerequisites: ['minute-hand']
        },
        {
            id: 'five-minutes',
            title: 'Five-Minute Times',
            description: 'Read time to the nearest 5 minutes',
            difficulty: 'medium',
            estimatedTime: 12,
            objectives: [
                'Count by 5s around the clock',
                'Read any 5-minute interval',
                'Practice with mixed times'
            ],
            prerequisites: ['quarter-hours']
        },
        {
            id: 'digital-analog',
            title: 'Digital and Analog',
            description: 'Connect digital and analog time',
            difficulty: 'medium',
            estimatedTime: 10,
            objectives: [
                'Match analog clocks to digital times',
                'Convert between formats',
                'Understand AM and PM'
            ],
            prerequisites: ['five-minutes']
        },
        {
            id: 'elapsed-time',
            title: 'Time Passing',
            description: 'Learn about elapsed time and duration',
            difficulty: 'hard',
            estimatedTime: 15,
            objectives: [
                'Calculate time differences',
                'Add time to find end times',
                'Solve basic word problems'
            ],
            prerequisites: ['digital-analog']
        },
        {
            id: 'mastery-review',
            title: 'Time Master Review',
            description: 'Review and practice all skills',
            difficulty: 'hard',
            estimatedTime: 20,
            objectives: [
                'Demonstrate all time-telling skills',
                'Complete complex challenges',
                'Earn Time Master certificate'
            ],
            prerequisites: ['elapsed-time']
        }
    ],
    
    // Learning activities for each lesson type
    activities: {
        introduction: 'Interactive demonstration with Tim',
        exploration: 'Guided hands-on practice', 
        practice: 'Independent skill building',
        assessment: 'Knowledge check with feedback',
        celebration: 'Success recognition and motivation'
    }
};

// ===================================
// TUTORIAL MANAGER CLASS
// Central controller for guided learning experiences
// ===================================

class TutorialManager {
    constructor() {
        this.currentLesson = null;
        this.currentActivity = null;
        this.lessonProgress = {};
        this.tutorialClock = null;
        this.isActive = false;
        this.hints = [];
        this.attempts = 0;
        this.maxAttempts = 3;
        
        // Tutorial UI elements
        this.lessonDisplay = null;
        this.progressIndicator = null;
        this.hintButton = null;
        this.nextButton = null;
        this.prevButton = null;
        
        console.log('👩‍🏫 Tutorial Manager created');
    }
    
    /**
     * Initialize the tutorial system
     */
    initialize() {
        this.setupTutorialUI();
        this.loadProgress();
        this.createTutorialClock();
        this.attachEventListeners();
        this.startFirstAvailableLesson();
        
        console.log('✅ Tutorial system ready');
    }
    
    /**
     * Set up tutorial-specific UI elements
     */
    setupTutorialUI() {
        this.lessonDisplay = TimeQuestUtils.getElement('lesson-display');
        this.progressIndicator = TimeQuestUtils.getElement('lesson-progress');
        this.nextButton = TimeQuestUtils.getElement('next-lesson');
        this.prevButton = TimeQuestUtils.getElement('prev-lesson');
        
        if (!this.lessonDisplay) {
            console.error('Tutorial UI elements not found');
            return;
        }
        
        // Create hint button if it doesn't exist
        this.createHintButton();
    }
    
    /**
     * Create the interactive tutorial clock
     */
    createTutorialClock() {
        this.tutorialClock = TimeQuestClocks.createPresetClock(
            'tutorial-clock',
            'tutorial',
            {
                onTimeChange: (newTime, oldTime) => this.handleClockChange(newTime, oldTime),
                onHandDrag: (hand, phase, time) => this.handleHandDrag(hand, phase, time),
                celebrateCorrectTime: true,
                tolerance: 3
            }
        );
        
        if (this.tutorialClock) {
            console.log('⏰ Tutorial clock created');
        }
    }
    
    /**
     * Load learning progress from storage
     */
    loadProgress() {
        const profile = TimeQuestStorage.getCurrentProfile();
        if (profile) {
            this.lessonProgress = profile.lessonResults || {};
        }
    }
    
    /**
     * Save progress to storage
     */
    saveProgress() {
        const profile = TimeQuestStorage.getCurrentProfile();
        if (profile && this.currentLesson) {
            TimeQuestStorage.completeLesson(this.currentLesson.id, {
                completedActivities: this.getCompletedActivities(),
                attempts: this.attempts,
                timeSpent: this.getTimeSpent(),
                score: this.calculateLessonScore()
            });
        }
    }
    
    /**
     * Attach event listeners for tutorial interactions
     */
    attachEventListeners() {
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextStep());
        }
        
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.previousStep());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextStep();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousStep();
            } else if (e.key === 'h' || e.key === 'H') {
                e.preventDefault();
                this.showHint();
            }
        });
    }
    
    /**
     * Start the first available lesson
     */
    startFirstAvailableLesson() {
        const profile = TimeQuestStorage.getCurrentProfile();
        if (!profile) return;
        
        // Find the first incomplete lesson
        const completedLessons = profile.lessonsCompleted || [];
        const nextLesson = TUTORIAL_CURRICULUM.lessons.find(lesson => 
            !completedLessons.includes(lesson.id)
        );
        
        if (nextLesson) {
            this.startLesson(nextLesson.id);
        } else {
            // All lessons complete - show mastery celebration
            this.showMasteryComplete();
        }
    }
    
    /**
     * Start a specific lesson
     */
    startLesson(lessonId) {
        const lesson = TUTORIAL_CURRICULUM.lessons.find(l => l.id === lessonId);
        if (!lesson) {
            console.error(`Lesson ${lessonId} not found`);
            return;
        }
        
        // Check prerequisites
        if (!this.checkPrerequisites(lesson)) {
            TimeQuestUI.showError('Please complete previous lessons first');
            return;
        }
        
        this.currentLesson = lesson;
        this.currentActivity = 'introduction';
        this.attempts = 0;
        this.isActive = true;
        
        // Set up lesson
        this.setupLessonEnvironment(lesson);
        this.updateProgressDisplay();
        this.startActivity('introduction');
        
        // Audio and mascot
        TimeQuestAudio.setAudioContext('tutorial');
        TimeQuestUI.mascotSay(`Let's learn about ${lesson.title}! 📚`);
        
        console.log(`📖 Started lesson: ${lesson.title}`);
    }
    
    /**
     * Check if lesson prerequisites are met
     */
    checkPrerequisites(lesson) {
        const profile = TimeQuestStorage.getCurrentProfile();
        if (!profile || !lesson.prerequisites) return true;
        
        const completedLessons = profile.lessonsCompleted || [];
        return lesson.prerequisites.every(prereq => 
            completedLessons.includes(prereq)
        );
    }
    
    /**
     * Set up the learning environment for a lesson
     */
    setupLessonEnvironment(lesson) {
        // Configure clock for lesson difficulty
        if (this.tutorialClock) {
            const clockConfig = this.getClockConfigForLesson(lesson);
            Object.assign(this.tutorialClock.options, clockConfig);
        }
        
        // Prepare lesson-specific hints
        this.hints = this.generateHintsForLesson(lesson);
    }
    
    /**
     * Get clock configuration for specific lesson
     */
    getClockConfigForLesson(lesson) {
        const configs = {
            'clock-basics': {
                interactive: false,
                showNumbers: true,
                showMinuteMarkers: false,
                snapToMinutes: 60
            },
            'hour-hand': {
                interactive: true,
                showNumbers: true,
                showMinuteMarkers: false,
                snapToMinutes: 60
            },
            'minute-hand': {
                interactive: true,
                showNumbers: true,
                showMinuteMarkers: true,
                snapToMinutes: 30
            },
            'quarter-hours': {
                interactive: true,
                showNumbers: true,
                showMinuteMarkers: true,
                snapToMinutes: 15
            },
            'five-minutes': {
                interactive: true,
                showNumbers: true,
                showMinuteMarkers: true,
                snapToMinutes: 5
            }
        };
        
        return configs[lesson.id] || configs['five-minutes'];
    }
    
    /**
     * Generate contextual hints for a lesson
     */
    generateHintsForLesson(lesson) {
        const hintDatabase = {
            'clock-basics': [
                "The clock face is like a circle with numbers around it",
                "There are two hands on the clock - one short, one long",
                "The numbers go from 1 to 12 around the clock"
            ],
            'hour-hand': [
                "The hour hand is the SHORT hand",
                "It points to the number of the hour",
                "At 3 o'clock, it points straight to the 3"
            ],
            'minute-hand': [
                "The minute hand is the LONG hand",
                "When it points to 12, it means 0 minutes",
                "When it points to 6, it means 30 minutes"
            ],
            'quarter-hours': [
                "Quarter past means 15 minutes after the hour",
                "Half past means 30 minutes after the hour", 
                "Quarter to means 15 minutes before the next hour"
            ],
            'five-minutes': [
                "Count by 5s as you go around the clock",
                "Each number represents 5 more minutes",
                "Start at 12 and count: 5, 10, 15, 20..."
            ]
        };
        
        return hintDatabase[lesson.id] || ["Take your time and think carefully"];
    }
    
    // ===================================
    // ACTIVITY MANAGEMENT
    // ===================================
    
    /**
     * Start a specific activity within the lesson
     */
    startActivity(activityType) {
        this.currentActivity = activityType;
        
        const activities = {
            introduction: () => this.runIntroduction(),
            exploration: () => this.runExploration(),
            practice: () => this.runPractice(),
            assessment: () => this.runAssessment(),
            celebration: () => this.runCelebration()
        };
        
        const activity = activities[activityType];
        if (activity) {
            activity();
        } else {
            console.error(`Unknown activity type: ${activityType}`);
        }
    }
    
    /**
     * Run introduction activity
     */
    runIntroduction() {
        const content = this.generateIntroductionContent();
        this.displayLessonContent(content);
        
        // Make clock non-interactive for demonstration
        if (this.tutorialClock) {
            this.tutorialClock.setInteractive(false);
        }
        
        // Tim explains the concept
        this.mascotTeach(content.mascotMessage);
        
        // Enable next button
        this.enableNextButton("Let's try it!");
    }
    
    /**
     * Run exploration activity  
     */
    runExploration() {
        const content = this.generateExplorationContent();
        this.displayLessonContent(content);
        
        // Make clock interactive
        if (this.tutorialClock) {
            this.tutorialClock.setInteractive(true);
        }
        
        // Tim encourages interaction
        this.mascotTeach(content.mascotMessage);
        
        // Set up guided interaction
        this.setupGuidedInteraction();
    }
    
    /**
     * Run practice activity
     */
    runPractice() {
        const content = this.generatePracticeContent();
        this.displayLessonContent(content);
        
        // Create practice challenges
        this.startPracticeChallenge();
    }
    
    /**
     * Run assessment activity
     */
    runAssessment() {
        const content = this.generateAssessmentContent();
        this.displayLessonContent(content);
        
        // Create assessment challenge
        this.startAssessmentChallenge();
    }
    
    /**
     * Run celebration activity
     */
    runCelebration() {
        this.displayLessonComplete();
        this.saveProgress();
        
        // Unlock next lesson
        this.unlockNextLesson();
        
        // Celebration effects
        TimeQuestUI.triggerCelebration();
        TimeQuestAudio.playLevelComplete();
        
        this.mascotTeach("Fantastic! You've mastered this lesson! 🎉");
    }
    
    // ===================================
    // CONTENT GENERATION
    // ===================================
    
    /**
     * Generate introduction content for current lesson
     */
    generateIntroductionContent() {
        const introductions = {
            'clock-basics': {
                title: 'Welcome to Clock World!',
                content: `
                    <h3>🕐 Let's Meet the Clock!</h3>
                    <p>A clock is a special circle that helps us tell time. Look at this clock:</p>
                    <ul>
                        <li>🔢 It has numbers from 1 to 12 around the edge</li>
                        <li>👐 It has two hands - one short, one long</li>
                        <li>⭕ The hands move around the center point</li>
                    </ul>
                    <p>Let's explore each part together!</p>
                `,
                mascotMessage: "Hi there! I'm Tim the Time Traveler! Let's learn about this magical clock together!"
            },
            
            'hour-hand': {
                title: 'The Hour Hand',
                content: `
                    <h3>👈 The Short Hand Shows Hours</h3>
                    <p>The hour hand is the <strong>short, thick hand</strong> on the clock.</p>
                    <div class="learning-points">
                        <p>✨ <strong>It moves very slowly</strong></p>
                        <p>✨ <strong>It points to the hour number</strong></p>
                        <p>✨ <strong>At 3 o'clock, it points to 3</strong></p>
                    </div>
                    <p>Watch how I move the hour hand to different numbers!</p>
                `,
                mascotMessage: "The hour hand is like a slow turtle - it takes a whole hour to move from one number to the next!"
            },
            
            'minute-hand': {
                title: 'The Minute Hand',
                content: `
                    <h3>👉 The Long Hand Shows Minutes</h3>
                    <p>The minute hand is the <strong>long, thin hand</strong> on the clock.</p>
                    <div class="learning-points">
                        <p>⚡ <strong>It moves faster than the hour hand</strong></p>
                        <p>⚡ <strong>When it points to 12, it means 0 minutes</strong></p>
                        <p>⚡ <strong>When it points to 6, it means 30 minutes</strong></p>
                    </div>
                    <p>Let's see the minute hand in action!</p>
                `,
                mascotMessage: "The minute hand is like a speedy rabbit - it moves all the way around in just 60 minutes!"
            }
        };
        
        return introductions[this.currentLesson.id] || {
            title: this.currentLesson.title,
            content: `<p>Let's learn about ${this.currentLesson.title}!</p>`,
            mascotMessage: `Ready to learn about ${this.currentLesson.title}?`
        };
    }
    
    /**
     * Generate exploration content
     */
    generateExplorationContent() {
        const explorations = {
            'hour-hand': {
                title: 'Try Moving the Hour Hand',
                content: `
                    <h3>🖱️ Your Turn to Explore!</h3>
                    <p>Now you try! Click and drag the <strong>short hour hand</strong> to different numbers.</p>
                    <div class="tutorial-task">
                        <p>🎯 <strong>Try this:</strong> Drag the hour hand to point to the number 6</p>
                        <p>💡 <strong>Tip:</strong> The hour hand is thick and short</p>
                    </div>
                `,
                mascotMessage: "Go ahead, give it a try! Drag the short hand to the number 6. I believe in you!"
            },
            
            'minute-hand': {
                title: 'Try Moving the Minute Hand',
                content: `
                    <h3>🖱️ Practice with the Minute Hand</h3>
                    <p>Now drag the <strong>long minute hand</strong> around the clock.</p>
                    <div class="tutorial-task">
                        <p>🎯 <strong>Try this:</strong> Move the minute hand to point to 6 (30 minutes)</p>
                        <p>💡 <strong>Tip:</strong> The minute hand is long and thin</p>
                    </div>
                `,
                mascotMessage: "Excellent! Now try moving the long hand. Make it point to the 6 for 30 minutes!"
            }
        };
        
        return explorations[this.currentLesson.id] || {
            title: 'Explore and Practice',
            content: '<p>Try interacting with the clock!</p>',
            mascotMessage: 'Go ahead and explore!'
        };
    }
    
    /**
     * Display lesson content in the UI
     */
    displayLessonContent(content) {
        if (!this.lessonDisplay) return;
        
        this.lessonDisplay.innerHTML = `
            <div class="lesson-content">
                <div class="lesson-header">
                    <h2>${content.title}</h2>
                </div>
                <div class="lesson-body">
                    ${content.content}
                </div>
                <div class="lesson-actions">
                    <button id="tutorial-hint-btn" class="hint-button">💡 Hint</button>
                </div>
            </div>
        `;
        
        // Reattach hint button
        const hintBtn = TimeQuestUtils.getElement('tutorial-hint-btn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
    }
    
    // ===================================
    // INTERACTIVE TEACHING
    // ===================================
    
    /**
     * Handle clock changes during tutorial
     */
    handleClockChange(newTime, oldTime) {
        if (!this.isActive) return;
        
        // Check if the interaction matches current lesson goals
        this.checkLessonGoal(newTime);
        
        // Provide contextual feedback
        this.provideFeedback(newTime);
    }
    
    /**
     * Handle hand dragging during tutorial
     */
    handleHandDrag(hand, phase, time) {
        if (phase === 'start') {
            // Encourage the user
            this.mascotTeach(`Good! You're moving the ${hand} hand!`);
        } else if (phase === 'end') {
            // Check if they completed the goal
            this.checkLessonGoal(time);
        }
    }
    
    /**
     * Check if current time meets lesson goal
     */
    checkLessonGoal(time) {
        const goals = this.getCurrentLessonGoals();
        
        for (const goal of goals) {
            if (this.timeMatchesGoal(time, goal)) {
                this.achieveGoal(goal);
                return;
            }
        }
    }
    
    /**
     * Get current lesson goals
     */
    getCurrentLessonGoals() {
        const goalDatabase = {
            'hour-hand': [
                { type: 'hour-position', target: 6, description: 'hour hand points to 6' }
            ],
            'minute-hand': [
                { type: 'minute-position', target: 30, description: 'minute hand points to 6 (30 minutes)' }
            ],
            'quarter-hours': [
                { type: 'exact-time', target: { hours: 3, minutes: 15 }, description: '3:15 (quarter past 3)' }
            ]
        };
        
        return goalDatabase[this.currentLesson.id] || [];
    }
    
    /**
     * Check if time matches a specific goal
     */
    timeMatchesGoal(time, goal) {
        switch (goal.type) {
            case 'hour-position':
                return time.hours === goal.target;
            case 'minute-position':
                return time.minutes === goal.target;
            case 'exact-time':
                return TimeQuestUtils.isTimeCloseEnough(time, goal.target, 2);
            default:
                return false;
        }
    }
    
    /**
     * Handle goal achievement
     */
    achieveGoal(goal) {
        // Celebration
        TimeQuestAudio.playCorrectAnswer();
        TimeQuestUI.mascotSay(`Perfect! You got it right! 🎉`);
        
        // Enable next step
        this.enableNextButton("Great job! Continue →");
        
        // Mark goal as achieved
        this.markGoalAchieved(goal);
    }
    
    /**
     * Provide contextual feedback
     */
    provideFeedback(time) {
        const feedback = this.generateContextualFeedback(time);
        if (feedback) {
            this.mascotTeach(feedback);
        }
    }
    
    /**
     * Generate contextual feedback based on current time
     */
    generateContextualFeedback(time) {
        if (this.currentLesson.id === 'hour-hand') {
            return `I see the hour hand is pointing to ${time.hours}. ${time.hours} o'clock!`;
        } else if (this.currentLesson.id === 'minute-hand') {
            if (time.minutes === 0) {
                return "The minute hand points to 12 - that means 0 minutes!";
            } else if (time.minutes === 30) {
                return "The minute hand points to 6 - that means 30 minutes!";
            }
        }
        
        return null;
    }
    
    // ===================================
    // NAVIGATION AND PROGRESS
    // ===================================
    
    /**
     * Move to next step/activity
     */
    nextStep() {
        const activitySequence = ['introduction', 'exploration', 'practice', 'assessment', 'celebration'];
        const currentIndex = activitySequence.indexOf(this.currentActivity);
        
        if (currentIndex < activitySequence.length - 1) {
            const nextActivity = activitySequence[currentIndex + 1];
            this.startActivity(nextActivity);
        } else {
            // Lesson complete, move to next lesson
            this.completeLesson();
        }
    }
    
    /**
     * Move to previous step/activity
     */
    previousStep() {
        const activitySequence = ['introduction', 'exploration', 'practice', 'assessment', 'celebration'];
        const currentIndex = activitySequence.indexOf(this.currentActivity);
        
        if (currentIndex > 0) {
            const prevActivity = activitySequence[currentIndex - 1];
            this.startActivity(prevActivity);
        }
    }
    
    /**
     * Complete current lesson
     */
    completeLesson() {
        if (!this.currentLesson) return;
        
        // Save completion
        const profile = TimeQuestStorage.getCurrentProfile();
        if (profile) {
            TimeQuestStorage.completeLesson(this.currentLesson.id, {
                score: this.calculateLessonScore(),
                timeSpent: Date.now() - this.lessonStartTime,
                attemptsRequired: this.attempts
            });
        }
        
        // Check for achievements
        this.checkLessonAchievements();
        
        // Show completion celebration
        this.showLessonComplete();
    }
    
    /**
     * Update progress display
     */
    updateProgressDisplay() {
        if (!this.progressIndicator || !this.currentLesson) return;
        
        const lessonIndex = TUTORIAL_CURRICULUM.lessons.findIndex(l => l.id === this.currentLesson.id);
        const totalLessons = TUTORIAL_CURRICULUM.lessons.length;
        const activitySequence = ['introduction', 'exploration', 'practice', 'assessment', 'celebration'];
        const activityIndex = activitySequence.indexOf(this.currentActivity);
        
        this.progressIndicator.textContent = `Lesson ${lessonIndex + 1} of ${totalLessons} • ${this.currentActivity}`;
    }
    
    /**
     * Enable next button with custom text
     */
    enableNextButton(text = "Next →") {
        if (this.nextButton) {
            this.nextButton.disabled = false;
            this.nextButton.textContent = text;
            TimeQuestUtils.removeClass(this.nextButton, 'disabled');
        }
    }
    
    /**
     * Disable next button
     */
    disableNextButton() {
        if (this.nextButton) {
            this.nextButton.disabled = true;
            TimeQuestUtils.addClass(this.nextButton, 'disabled');
        }
    }
    
    // ===================================
    // HELP AND HINTS
    // ===================================
    
    /**
     * Show a contextual hint
     */
    showHint() {
        if (this.hints.length === 0) return;
        
        const hint = this.hints[this.attempts % this.hints.length];
        this.mascotTeach(hint);
        
        // Visual hint display
        this.displayHint(hint);
        
        this.attempts++;
    }
    
    /**
     * Display hint in the UI
     */
    displayHint(hint) {
        // Create hint bubble
        const hintBubble = document.createElement('div');
        hintBubble.className = 'hint-bubble';
        hintBubble.innerHTML = `
            <div class="hint-content">
                <span class="hint-icon">💡</span>
                <span class="hint-text">${hint}</span>
            </div>
        `;
        
        document.body.appendChild(hintBubble);
        
        // Position near the clock
        if (this.tutorialClock) {
            const clockElement = this.tutorialClock.container;
            const rect = clockElement.getBoundingClientRect();
            hintBubble.style.position = 'fixed';
            hintBubble.style.top = rect.bottom + 20 + 'px';
            hintBubble.style.left = rect.left + 'px';
        }
        
        // Show with animation
        TimeQuestUtils.animateElement(hintBubble, 'zoom-in');
        
        // Remove after delay
        setTimeout(() => {
            TimeQuestUtils.animateElement(hintBubble, 'fadeOut', () => {
                document.body.removeChild(hintBubble);
            });
        }, 4000);
    }
    
    /**
     * Create hint button
     */
    createHintButton() {
        const hintBtn = document.createElement('button');
        hintBtn.id = 'tutorial-hint-btn';
        hintBtn.className = 'hint-button';
        hintBtn.innerHTML = '💡 Need Help?';
        
        hintBtn.addEventListener('click', () => this.showHint());
        
        this.hintButton = hintBtn;
    }
    
    // ===================================
    // MASCOT INTEGRATION
    // ===================================
    
    /**
     * Make Tim teach something
     */
    mascotTeach(message, duration = 4000) {
        TimeQuestUI.mascotSay(message, duration);
        
        // Also speak it if voice is enabled
        const settings = TimeQuestStorage.getSettings();
        if (settings.voiceNarration) {
            TimeQuestAudio.speak(message, { rate: 0.9, pitch: 1.1 });
        }
    }
    
    // ===================================
    // UTILITY METHODS
    // ===================================
    
    /**
     * Calculate lesson score based on performance
     */
    calculateLessonScore() {
        const baseScore = 100;
        const attemptPenalty = Math.max(0, (this.attempts - 1) * 10);
        return Math.max(50, baseScore - attemptPenalty);
    }
    
    /**
     * Get time spent in current lesson
     */
    getTimeSpent() {
        return this.lessonStartTime ? Date.now() - this.lessonStartTime : 0;
    }
    
    /**
     * Check for lesson-specific achievements
     */
    checkLessonAchievements() {
        const score = this.calculateLessonScore();
        
        if (score >= 100) {
            TimeQuestStorage.awardAchievement('perfect_lesson', {
                name: 'Perfect Student',
                description: 'Completed a lesson with a perfect score!',
                icon: '🌟'
            });
        }
        
        if (this.attempts === 1) {
            TimeQuestStorage.awardAchievement('first_try', {
                name: 'First Try Success',
                description: 'Got it right on the first try!',
                icon: '🎯'
            });
        }
    }
    
    /**
     * Show lesson completion screen
     */
    showLessonComplete() {
        const score = this.calculateLessonScore();
        const stars = this.calculateStars(score);
        
        this.displayLessonContent({
            title: '🎉 Lesson Complete!',
            content: `
                <div class="lesson-complete">
                    <h3>Fantastic work!</h3>
                    <div class="score-display">
                        <div class="stars">${'⭐'.repeat(stars)}</div>
                        <div class="score">Score: ${score}/100</div>
                    </div>
                    <p>You've mastered <strong>${this.currentLesson.title}</strong>!</p>
                    <p>Ready for the next adventure?</p>
                </div>
            `
        });
        
        this.enableNextButton("Next Lesson →");
    }
    
    /**
     * Calculate stars based on score
     */
    calculateStars(score) {
        if (score >= 95) return 3;
        if (score >= 80) return 2;
        if (score >= 60) return 1;
        return 0;
    }
    
    /**
     * Clean up tutorial session
     */
    cleanup() {
        this.isActive = false;
        this.currentLesson = null;
        this.currentActivity = null;
        
        if (this.tutorialClock) {
            this.tutorialClock.setInteractive(false);
        }
    }
}

// ===================================
// INITIALIZE THE TUTORIAL MANAGER
// ===================================

// Create global tutorial manager instance
const tutorialManager = new TutorialManager();

// ===================================
// EXPORT FOR OTHER FILES TO USE
// ===================================

window.TimeQuestTutorial = {
    manager: tutorialManager,
    initialize: () => tutorialManager.initialize(),
    startLesson: (lessonId) => tutorialManager.startLesson(lessonId),
    curriculum: TUTORIAL_CURRICULUM
};

console.log('✅ Time Quest Tutorial Manager loaded successfully!');