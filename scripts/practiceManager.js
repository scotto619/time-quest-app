/**
 * TIME QUEST - PRACTICE MANAGER
 * The dedicated coach that helps kids master specific time-telling skills
 * Think of this as your personal skills trainer and drill sergeant (but friendly!)
 */

// ===================================
// PRACTICE CONFIGURATION
// Different types of practice sessions and skill focuses
// ===================================

const PRACTICE_CONFIG = {
    skillTypes: {
        'analog-reading': {
            name: 'Reading Analog Clocks',
            description: 'Practice reading time from analog clock faces',
            icon: '🕐',
            difficulty: 'easy',
            focusArea: 'recognition'
        },
        'digital-setting': {
            name: 'Setting Digital Time',
            description: 'Practice setting clocks to match digital times',
            icon: '⏰',
            difficulty: 'medium',
            focusArea: 'manipulation'
        },
        'time-matching': {
            name: 'Matching Times',
            description: 'Match analog and digital time representations',
            icon: '🔄',
            difficulty: 'medium',
            focusArea: 'conversion'
        },
        'quick-recall': {
            name: 'Quick Time Recall',
            description: 'Rapid-fire time recognition practice',
            icon: '⚡',
            difficulty: 'medium',
            focusArea: 'speed'
        },
        'hour-practice': {
            name: 'Hour Hand Focus',
            description: 'Focused practice on hour hand positions',
            icon: '👈',
            difficulty: 'easy',
            focusArea: 'hours'
        },
        'minute-practice': {
            name: 'Minute Hand Focus',
            description: 'Focused practice on minute hand positions',
            icon: '👉',
            difficulty: 'medium',
            focusArea: 'minutes'
        },
        'mixed-practice': {
            name: 'Mixed Skills',
            description: 'Combination of all time-telling skills',
            icon: '🎯',
            difficulty: 'hard',
            focusArea: 'comprehensive'
        }
    },
    
    sessionTypes: {
        'quick': { duration: 2, questions: 5, name: 'Quick Practice' },
        'standard': { duration: 5, questions: 10, name: 'Standard Session' },
        'extended': { duration: 10, questions: 20, name: 'Extended Practice' },
        'marathon': { duration: 15, questions: 30, name: 'Practice Marathon' }
    },
    
    difficultyLevels: {
        'beginner': {
            timeFormats: ['hour', 'half-hour'],
            timeRange: { start: 1, end: 12 },
            snapMinutes: 30,
            tolerance: 5,
            hints: 3
        },
        'easy': {
            timeFormats: ['hour', 'half-hour', 'quarter-hour'],
            timeRange: { start: 1, end: 12 },
            snapMinutes: 15,
            tolerance: 3,
            hints: 2
        },
        'medium': {
            timeFormats: ['hour', 'half-hour', 'quarter-hour', 'five-minute'],
            timeRange: { start: 1, end: 12 },
            snapMinutes: 5,
            tolerance: 2,
            hints: 1
        },
        'hard': {
            timeFormats: ['any-minute'],
            timeRange: { start: 1, end: 12 },
            snapMinutes: 1,
            tolerance: 1,
            hints: 0
        }
    }
};

// ===================================
// PRACTICE SESSION CLASS
// Manages individual practice sessions
// ===================================

class PracticeSession {
    constructor(skillType, sessionType, difficulty) {
        this.skillType = skillType;
        this.sessionType = sessionType;
        this.difficulty = difficulty;
        this.config = PRACTICE_CONFIG.skillTypes[skillType];
        this.sessionConfig = PRACTICE_CONFIG.sessionTypes[sessionType];
        this.difficultyConfig = PRACTICE_CONFIG.difficultyLevels[difficulty];
        
        // Session state
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.startTime = Date.now();
        this.questionStartTime = Date.now();
        this.responses = [];
        this.hintsUsed = 0;
        
        // UI elements
        this.practiceContainer = null;
        this.questionDisplay = null;
        this.feedbackDisplay = null;
        this.progressBar = null;
        this.scoreDisplay = null;
        
        console.log(`🏃‍♂️ Practice session created: ${skillType} (${difficulty})`);
    }
    
    /**
     * Initialize the practice session
     */
    async initialize() {
        this.setupPracticeUI();
        this.generateQuestions();
        this.showSessionStart();
        
        // Set appropriate audio context
        TimeQuestAudio.setAudioContext('practice');
        
        console.log('✅ Practice session initialized');
    }
    
    /**
     * Set up practice-specific UI
     */
    setupPracticeUI() {
        this.practiceContainer = TimeQuestUtils.getElement('practice-content');
        if (!this.practiceContainer) {
            console.error('Practice container not found');
            return;
        }
        
        this.practiceContainer.innerHTML = `
            <div class="practice-session">
                <div class="practice-header">
                    <div class="session-info">
                        <h3>${this.config.name}</h3>
                        <p>${this.config.description}</p>
                    </div>
                    <div class="session-stats">
                        <div class="stat-item">
                            <span class="stat-label">Score</span>
                            <span class="stat-value" id="practice-score">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Streak</span>
                            <span class="stat-value" id="practice-streak">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Progress</span>
                            <span class="stat-value" id="practice-progress">0/${this.sessionConfig.questions}</span>
                        </div>
                    </div>
                </div>
                
                <div class="practice-question" id="practice-question-area">
                    <!-- Question content will be loaded here -->
                </div>
                
                <div class="practice-clock-area" id="practice-clock-container">
                    <!-- Interactive clock will be created here -->
                </div>
                
                <div class="practice-controls">
                    <button id="practice-hint-btn" class="practice-button hint-button">
                        💡 Hint (${this.difficultyConfig.hints} left)
                    </button>
                    <button id="practice-submit-btn" class="practice-button primary-button">
                        ✓ Submit Answer
                    </button>
                    <button id="practice-skip-btn" class="practice-button secondary-button">
                        ⏭️ Skip Question
                    </button>
                </div>
                
                <div class="practice-feedback" id="practice-feedback">
                    <!-- Feedback messages appear here -->
                </div>
                
                <div class="practice-progress">
                    <div class="progress-bar" id="practice-progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Store references
        this.questionDisplay = TimeQuestUtils.getElement('practice-question-area');
        this.feedbackDisplay = TimeQuestUtils.getElement('practice-feedback');
        this.progressBar = TimeQuestUtils.getElement('practice-progress-bar');
        this.scoreDisplay = TimeQuestUtils.getElement('practice-score');
        
        // Attach event listeners
        this.attachEventListeners();
    }
    
    /**
     * Attach event listeners for practice controls
     */
    attachEventListeners() {
        const hintBtn = TimeQuestUtils.getElement('practice-hint-btn');
        const submitBtn = TimeQuestUtils.getElement('practice-submit-btn');
        const skipBtn = TimeQuestUtils.getElement('practice-skip-btn');
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitAnswer());
        }
        
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skipQuestion());
        }
    }
    
    /**
     * Generate questions for the practice session
     */
    generateQuestions() {
        this.questions = [];
        
        for (let i = 0; i < this.sessionConfig.questions; i++) {
            const question = this.generateQuestion();
            this.questions.push(question);
        }
        
        console.log(`📝 Generated ${this.questions.length} practice questions`);
    }
    
    /**
     * Generate a single practice question
     */
    generateQuestion() {
        const generators = {
            'analog-reading': () => this.generateAnalogReadingQuestion(),
            'digital-setting': () => this.generateDigitalSettingQuestion(),
            'time-matching': () => this.generateTimeMatchingQuestion(),
            'quick-recall': () => this.generateQuickRecallQuestion(),
            'hour-practice': () => this.generateHourPracticeQuestion(),
            'minute-practice': () => this.generateMinutePracticeQuestion(),
            'mixed-practice': () => this.generateMixedPracticeQuestion()
        };
        
        const generator = generators[this.skillType];
        if (!generator) {
            console.error(`No question generator for skill type: ${this.skillType}`);
            return null;
        }
        
        return generator();
    }
    
    /**
     * Generate analog reading question
     */
    generateAnalogReadingQuestion() {
        const time = this.generateTimeForDifficulty();
        const wrongAnswers = this.generateWrongAnswers(time, 3);
        const allAnswers = TimeQuestUtils.shuffleArray([time, ...wrongAnswers]);
        
        return {
            type: 'analog-reading',
            instruction: 'What time does this clock show?',
            clockTime: time,
            answerType: 'multiple-choice',
            answers: allAnswers,
            correctAnswer: time,
            hints: [
                'Look at where the hour hand points',
                'Check where the minute hand points', 
                'Remember: short hand = hours, long hand = minutes'
            ]
        };
    }
    
    /**
     * Generate digital setting question
     */
    generateDigitalSettingQuestion() {
        const time = this.generateTimeForDifficulty();
        const timeText = this.formatTimeAsText(time);
        
        return {
            type: 'digital-setting',
            instruction: `Set the clock to show: ${timeText}`,
            targetTime: time,
            answerType: 'clock-setting',
            clockTime: { hours: 12, minutes: 0 }, // Start at 12:00
            hints: [
                'Drag the hour hand to the correct hour',
                'Drag the minute hand to the correct minutes',
                'The short hand shows hours, long hand shows minutes'
            ]
        };
    }
    
    /**
     * Generate time matching question
     */
    generateTimeMatchingQuestion() {
        const correctTime = this.generateTimeForDifficulty();
        const wrongTimes = this.generateWrongAnswers(correctTime, 3);
        const digitalTimes = TimeQuestUtils.shuffleArray([correctTime, ...wrongTimes]);
        
        return {
            type: 'time-matching',
            instruction: 'Which digital time matches this analog clock?',
            clockTime: correctTime,
            answerType: 'multiple-choice',
            answers: digitalTimes.map(time => this.formatTimeAsText(time)),
            correctAnswer: this.formatTimeAsText(correctTime),
            hints: [
                'Read the analog clock first',
                'Convert to digital format',
                'Check your answer carefully'
            ]
        };
    }
    
    /**
     * Generate quick recall question
     */
    generateQuickRecallQuestion() {
        const time = this.generateTimeForDifficulty();
        
        return {
            type: 'quick-recall',
            instruction: 'Quick! What time is this?',
            clockTime: time,
            answerType: 'speed-recognition',
            timeLimit: 5, // 5 seconds
            correctAnswer: time,
            hints: [
                'Trust your first instinct',
                'Look at both hands quickly',
                'Don\'t overthink it'
            ]
        };
    }
    
    /**
     * Generate hour practice question
     */
    generateHourPracticeQuestion() {
        const hour = TimeQuestUtils.randomInt(1, 12);
        const time = { hours: hour, minutes: 0 }; // Always on the hour
        
        return {
            type: 'hour-practice',
            instruction: `Move the hour hand to point to ${hour}`,
            targetTime: time,
            answerType: 'hour-setting',
            clockTime: { hours: 12, minutes: 0 },
            hints: [
                'Focus only on the hour hand (short hand)',
                `The hour hand should point to ${hour}`,
                'Ignore the minute hand for now'
            ]
        };
    }
    
    /**
     * Generate minute practice question
     */
    generateMinutePracticeQuestion() {
        const minutes = this.generateMinutesForDifficulty();
        const time = { hours: 12, minutes: minutes };
        
        return {
            type: 'minute-practice',
            instruction: `Set the minute hand to ${minutes} minutes`,
            targetTime: time,
            answerType: 'minute-setting',
            clockTime: { hours: 12, minutes: 0 },
            hints: [
                'Focus only on the minute hand (long hand)',
                `The minute hand should point to ${this.getMinuteMarker(minutes)}`,
                'Count by 5s around the clock'
            ]
        };
    }
    
    /**
     * Generate mixed practice question
     */
    generateMixedPracticeQuestion() {
        const questionTypes = ['analog-reading', 'digital-setting', 'time-matching'];
        const randomType = TimeQuestUtils.randomChoice(questionTypes);
        
        // Recursively call the appropriate generator
        this.skillType = randomType; // Temporarily change skill type
        const question = this.generateQuestion();
        this.skillType = 'mixed-practice'; // Reset
        
        return question;
    }
    
    /**
     * Generate time appropriate for current difficulty
     */
    generateTimeForDifficulty() {
        const formats = this.difficultyConfig.timeFormats;
        const format = TimeQuestUtils.randomChoice(formats);
        
        const hour = TimeQuestUtils.randomInt(1, 12);
        let minutes;
        
        switch (format) {
            case 'hour':
                minutes = 0;
                break;
            case 'half-hour':
                minutes = TimeQuestUtils.randomChoice([0, 30]);
                break;
            case 'quarter-hour':
                minutes = TimeQuestUtils.randomChoice([0, 15, 30, 45]);
                break;
            case 'five-minute':
                minutes = TimeQuestUtils.randomInt(0, 11) * 5;
                break;
            case 'any-minute':
                minutes = TimeQuestUtils.randomInt(0, 59);
                break;
            default:
                minutes = 0;
        }
        
        return { hours: hour, minutes: minutes };
    }
    
    /**
     * Generate minutes appropriate for difficulty
     */
    generateMinutesForDifficulty() {
        const formats = this.difficultyConfig.timeFormats;
        
        if (formats.includes('any-minute')) {
            return TimeQuestUtils.randomInt(0, 59);
        } else if (formats.includes('five-minute')) {
            return TimeQuestUtils.randomInt(0, 11) * 5;
        } else if (formats.includes('quarter-hour')) {
            return TimeQuestUtils.randomChoice([0, 15, 30, 45]);
        } else {
            return TimeQuestUtils.randomChoice([0, 30]);
        }
    }
    
    /**
     * Show session start screen
     */
    showSessionStart() {
        if (!this.questionDisplay) return;
        
        this.questionDisplay.innerHTML = `
            <div class="session-start">
                <div class="session-icon">${this.config.icon}</div>
                <h2>${this.config.name}</h2>
                <p>${this.config.description}</p>
                <div class="session-details">
                    <p><strong>Questions:</strong> ${this.sessionConfig.questions}</p>
                    <p><strong>Difficulty:</strong> ${this.difficulty}</p>
                    <p><strong>Hints Available:</strong> ${this.difficultyConfig.hints}</p>
                </div>
                <button id="start-practice-btn" class="practice-button primary-button large">
                    🚀 Start Practice
                </button>
            </div>
        `;
        
        const startBtn = TimeQuestUtils.getElement('start-practice-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startPractice();
            });
        }
    }
    
    /**
     * Start the practice session
     */
    startPractice() {
        this.createPracticeClock();
        this.showQuestion(0);
        
        // Mascot encouragement
        TimeQuestUI.mascotSay(`Let's practice ${this.config.name}! You've got this! 💪`);
        
        // Play start sound
        TimeQuestAudio.playSound('gameStart', 0.6);
    }
    
    /**
     * Create the practice clock
     */
    createPracticeClock() {
        const clockContainer = TimeQuestUtils.getElement('practice-clock-container');
        if (!clockContainer) return;
        
        // Clear existing clock
        clockContainer.innerHTML = '<div id="practice-clock"></div>';
        
        // Create new practice clock
        this.practiceClock = TimeQuestClocks.createPresetClock(
            'practice-clock',
            'practice',
            {
                snapToMinutes: this.difficultyConfig.snapMinutes,
                tolerance: this.difficultyConfig.tolerance,
                onTimeChange: (newTime) => this.handleClockChange(newTime),
                onHandDrag: (hand, phase) => this.handleHandDrag(hand, phase)
            }
        );
    }
    
    /**
     * Show a specific question
     */
    showQuestion(questionIndex) {
        if (questionIndex >= this.questions.length) {
            this.completeSession();
            return;
        }
        
        this.currentQuestion = questionIndex;
        this.questionStartTime = Date.now();
        const question = this.questions[questionIndex];
        
        // Update progress
        this.updateProgress();
        
        // Display question
        this.displayQuestion(question);
        
        // Set up clock for question
        this.setupClockForQuestion(question);
        
        // Clear previous feedback
        this.clearFeedback();
        
        console.log(`❓ Showing question ${questionIndex + 1}/${this.questions.length}`);
    }
    
    /**
     * Display question content
     */
    displayQuestion(question) {
        if (!this.questionDisplay) return;
        
        let questionHTML = `
            <div class="question-header">
                <h3>Question ${this.currentQuestion + 1} of ${this.questions.length}</h3>
                <p class="question-instruction">${question.instruction}</p>
            </div>
        `;
        
        // Add question-specific content
        if (question.answerType === 'multiple-choice') {
            questionHTML += this.createMultipleChoiceContent(question);
        } else if (question.answerType === 'clock-setting') {
            questionHTML += '<p class="interaction-hint">👆 Drag the clock hands to set the time</p>';
        } else if (question.answerType === 'speed-recognition') {
            questionHTML += `
                <div class="speed-challenge">
                    <div class="timer-display" id="speed-timer">${question.timeLimit}</div>
                    <p>Answer quickly!</p>
                </div>
            `;
        }
        
        this.questionDisplay.innerHTML = questionHTML;
        
        // Handle speed questions
        if (question.answerType === 'speed-recognition') {
            this.startSpeedTimer(question.timeLimit);
        }
    }
    
    /**
     * Create multiple choice content
     */
    createMultipleChoiceContent(question) {
        let content = '<div class="multiple-choice-answers">';
        
        question.answers.forEach((answer, index) => {
            const answerText = typeof answer === 'string' ? answer : this.formatTimeAsText(answer);
            content += `
                <button class="choice-button" data-answer-index="${index}">
                    ${answerText}
                </button>
            `;
        });
        
        content += '</div>';
        
        // Add event listeners for choice buttons
        setTimeout(() => {
            const choiceButtons = document.querySelectorAll('.choice-button');
            choiceButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    this.selectChoice(parseInt(e.target.getAttribute('data-answer-index')));
                });
            });
        }, 100);
        
        return content;
    }
    
    /**
     * Set up clock for current question
     */
    setupClockForQuestion(question) {
        if (!this.practiceClock) return;
        
        // Set initial clock time
        const initialTime = question.clockTime || { hours: 12, minutes: 0 };
        this.practiceClock.setTime(initialTime.hours, initialTime.minutes, false);
        
        // Configure interactivity
        const interactive = ['clock-setting', 'hour-setting', 'minute-setting'].includes(question.answerType);
        this.practiceClock.setInteractive(interactive);
        
        // Set target time for validation
        if (question.targetTime) {
            this.practiceClock.setTargetTime(question.targetTime.hours, question.targetTime.minutes);
        }
    }
    
    /**
     * Handle clock time changes
     */
    handleClockChange(newTime) {
        const question = this.questions[this.currentQuestion];
        
        // Auto-submit for certain question types
        if (question.answerType === 'clock-setting' && question.targetTime) {
            if (TimeQuestUtils.isTimeCloseEnough(newTime, question.targetTime, this.difficultyConfig.tolerance)) {
                setTimeout(() => this.submitAnswer(), 500); // Brief delay for user to see success
            }
        }
    }
    
    /**
     * Handle hand dragging feedback
     */
    handleHandDrag(hand, phase) {
        if (phase === 'start') {
            TimeQuestAudio.playClockSound('tick');
        }
    }
    
    /**
     * Select a multiple choice answer
     */
    selectChoice(answerIndex) {
        // Visual feedback
        const choiceButtons = document.querySelectorAll('.choice-button');
        choiceButtons.forEach((button, index) => {
            if (index === answerIndex) {
                TimeQuestUtils.addClass(button, 'selected');
            } else {
                TimeQuestUtils.removeClass(button, 'selected');
            }
        });
        
        this.selectedChoice = answerIndex;
        
        // Auto-submit after selection
        setTimeout(() => this.submitAnswer(), 800);
    }
    
    /**
     * Submit the current answer
     */
    submitAnswer() {
        const question = this.questions[this.currentQuestion];
        const userAnswer = this.getUserAnswer(question);
        const isCorrect = this.validateAnswer(userAnswer, question);
        const responseTime = Date.now() - this.questionStartTime;
        
        // Record response
        this.responses.push({
            questionIndex: this.currentQuestion,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
            responseTime: responseTime,
            hintsUsed: this.hintsUsed
        });
        
        // Update session stats
        this.updateSessionStats(isCorrect);
        
        // Show feedback
        this.showFeedback(isCorrect, question);
        
        // Prepare for next question
        setTimeout(() => {
            this.nextQuestion();
        }, 2500);
    }
    
    /**
     * Get user's answer based on question type
     */
    getUserAnswer(question) {
        switch (question.answerType) {
            case 'multiple-choice':
                return question.answers[this.selectedChoice];
            case 'clock-setting':
            case 'hour-setting':
            case 'minute-setting':
            case 'speed-recognition':
                return this.practiceClock.getTime();
            default:
                return null;
        }
    }
    
    /**
     * Validate user's answer
     */
    validateAnswer(userAnswer, question) {
        switch (question.answerType) {
            case 'multiple-choice':
                if (typeof question.correctAnswer === 'string') {
                    return userAnswer === question.correctAnswer;
                } else {
                    return TimeQuestUtils.isTimeCloseEnough(
                        userAnswer, 
                        question.correctAnswer, 
                        this.difficultyConfig.tolerance
                    );
                }
            case 'clock-setting':
            case 'hour-setting':
            case 'minute-setting':
            case 'speed-recognition':
                return TimeQuestUtils.isTimeCloseEnough(
                    userAnswer,
                    question.correctAnswer || question.targetTime,
                    this.difficultyConfig.tolerance
                );
            default:
                return false;
        }
    }
    
    /**
     * Update session statistics
     */
    updateSessionStats(isCorrect) {
        if (isCorrect) {
            this.score++;
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
        } else {
            this.streak = 0;
        }
        
        // Update UI
        this.updateStatsDisplay();
    }
    
    /**
     * Update statistics display
     */
    updateStatsDisplay() {
        const scoreElement = TimeQuestUtils.getElement('practice-score');
        const streakElement = TimeQuestUtils.getElement('practice-streak');
        const progressElement = TimeQuestUtils.getElement('practice-progress');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (streakElement) streakElement.textContent = this.streak;
        if (progressElement) {
            progressElement.textContent = `${this.currentQuestion + 1}/${this.questions.length}`;
        }
    }
    
    /**
     * Show feedback for answer
     */
    showFeedback(isCorrect, question) {
        if (!this.feedbackDisplay) return;
        
        const feedbackClass = isCorrect ? 'correct' : 'incorrect';
        const feedbackIcon = isCorrect ? '✅' : '❌';
        const feedbackMessage = isCorrect ? 
            this.getPositiveFeedback() : 
            this.getCorrectiveFeedback(question);
        
        this.feedbackDisplay.innerHTML = `
            <div class="feedback-message ${feedbackClass}">
                <span class="feedback-icon">${feedbackIcon}</span>
                <span class="feedback-text">${feedbackMessage}</span>
            </div>
        `;
        
        TimeQuestUtils.removeClass(this.feedbackDisplay, 'hidden');
        TimeQuestUtils.animateElement(this.feedbackDisplay, 'slide-in-bottom');
        
        // Audio feedback
        if (isCorrect) {
            TimeQuestAudio.playCorrectAnswer();
        } else {
            TimeQuestAudio.playIncorrectAnswer();
        }
        
        // Mascot feedback
        this.giveMascotFeedback(isCorrect, question);
    }
    
    /**
     * Get positive feedback message
     */
    getPositiveFeedback() {
        const messages = [
            "Excellent work! 🌟",
            "Perfect! You're getting good at this! 🎯",
            "Great job! Keep it up! 💪",
            "Awesome! You nailed it! 🚀",
            "Fantastic! Your skills are improving! ⭐",
            "Well done! You're a time-telling star! 🌟"
        ];
        
        return TimeQuestUtils.randomChoice(messages);
    }
    
    /**
     * Get corrective feedback message
     */
    getCorrectiveFeedback(question) {
        const correctAnswer = question.correctAnswer || question.targetTime;
        const correctText = typeof correctAnswer === 'string' ? 
            correctAnswer : 
            this.formatTimeAsText(correctAnswer);
        
        return `Not quite right. The correct answer is ${correctText}. Keep practicing! 🎯`;
    }
    
    /**
     * Give mascot feedback
     */
    giveMascotFeedback(isCorrect, question) {
        if (isCorrect) {
            if (this.streak >= 3) {
                TimeQuestUI.mascotSay(`Wow! ${this.streak} in a row! You're on fire! 🔥`);
            } else {
                TimeQuestUI.mascotSay("Great job! Keep going!");
            }
        } else {
            const hints = question.hints || [];
            if (hints.length > 0) {
                const hint = TimeQuestUtils.randomChoice(hints);
                TimeQuestUI.mascotSay(`Try again! Remember: ${hint}`);
            } else {
                TimeQuestUI.mascotSay("That's okay! Practice makes perfect!");
            }
        }
    }
    
    /**
     * Clear feedback display
     */
    clearFeedback() {
        if (this.feedbackDisplay) {
            TimeQuestUtils.addClass(this.feedbackDisplay, 'hidden');
        }
    }
    
    /**
     * Show hint for current question
     */
    showHint() {
        if (this.difficultyConfig.hints <= 0) {
            TimeQuestUI.mascotSay("No hints available at this difficulty level! You can do it!");
            return;
        }
        
        const question = this.questions[this.currentQuestion];
        const hints = question.hints || ["Take your time and think carefully"];
        
        const hint = hints[this.hintsUsed % hints.length];
        TimeQuestUI.mascotSay(`💡 Hint: ${hint}`);
        
        this.hintsUsed++;
        this.difficultyConfig.hints--;
        
        // Update hint button
        const hintBtn = TimeQuestUtils.getElement('practice-hint-btn');
        if (hintBtn) {
            hintBtn.textContent = `💡 Hint (${this.difficultyConfig.hints} left)`;
            if (this.difficultyConfig.hints <= 0) {
                hintBtn.disabled = true;
            }
        }
    }
    
    /**
     * Skip current question
     */
    skipQuestion() {
        // Mark as incorrect
        this.responses.push({
            questionIndex: this.currentQuestion,
            userAnswer: null,
            correctAnswer: this.questions[this.currentQuestion].correctAnswer,
            isCorrect: false,
            responseTime: Date.now() - this.questionStartTime,
            hintsUsed: this.hintsUsed,
            skipped: true
        });
        
        this.streak = 0;
        this.updateStatsDisplay();
        
        TimeQuestUI.mascotSay("That's okay! Sometimes it's good to skip and come back later.");
        
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }
    
    /**
     * Move to next question
     */
    nextQuestion() {
        this.clearFeedback();
        this.hintsUsed = 0;
        this.selectedChoice = null;
        
        this.showQuestion(this.currentQuestion + 1);
    }
    
    /**
     * Update progress bar
     */
    updateProgress() {
        if (!this.progressBar) return;
        
        const progressPercent = ((this.currentQuestion + 1) / this.questions.length) * 100;
        const progressFill = this.progressBar.querySelector('.progress-fill');
        
        if (progressFill) {
            progressFill.style.width = progressPercent + '%';
        }
    }
    
    /**
     * Start speed timer for quick recall questions
     */
    startSpeedTimer(seconds) {
        let timeLeft = seconds;
        const timerDisplay = TimeQuestUtils.getElement('speed-timer');
        
        const countdown = setInterval(() => {
            timeLeft--;
            if (timerDisplay) {
                timerDisplay.textContent = timeLeft;
            }
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                this.submitAnswer(); // Auto-submit when time runs out
            }
        }, 1000);
    }
    
    /**
     * Complete practice session
     */
    completeSession() {
        const sessionStats = this.calculateSessionStats();
        this.saveSessionProgress(sessionStats);
        this.showSessionComplete(sessionStats);
        
        console.log('🏁 Practice session completed');
    }
    
    /**
     * Calculate session statistics
     */
    calculateSessionStats() {
        const totalQuestions = this.questions.length;
        const correctAnswers = this.responses.filter(r => r.isCorrect).length;
        const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
        const totalTime = Date.now() - this.startTime;
        const averageTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;
        
        return {
            skillType: this.skillType,
            difficulty: this.difficulty,
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswers,
            accuracy: accuracy,
            totalTime: totalTime,
            averageTime: averageTime,
            maxStreak: this.maxStreak,
            hintsUsed: this.responses.reduce((sum, r) => sum + (r.hintsUsed || 0), 0),
            score: Math.round(accuracy * 100)
        };
    }
    
    /**
     * Save session progress
     */
    saveSessionProgress(stats) {
        TimeQuestStorage.updatePracticeScore(
            this.skillType,
            stats.score,
            stats.totalTime / 1000
        );
    }
    
    /**
     * Show session completion screen
     */
    showSessionComplete(stats) {
        if (!this.questionDisplay) return;
        
        const grade = this.getGrade(stats.accuracy);
        const encouragement = this.getEncouragement(stats.accuracy);
        
        this.questionDisplay.innerHTML = `
            <div class="session-complete">
                <div class="completion-header">
                    <h2>🎉 Practice Complete!</h2>
                    <div class="grade-display ${grade.toLowerCase()}">
                        <span class="grade-letter">${grade}</span>
                        <span class="grade-percentage">${Math.round(stats.accuracy * 100)}%</span>
                    </div>
                </div>
                
                <div class="session-results">
                    <div class="result-item">
                        <span class="result-label">Correct Answers</span>
                        <span class="result-value">${stats.correctAnswers}/${stats.totalQuestions}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Best Streak</span>
                        <span class="result-value">${stats.maxStreak}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Average Time</span>
                        <span class="result-value">${Math.round(stats.averageTime / 1000)}s</span>
                    </div>
                </div>
                
                <div class="encouragement">
                    <p>${encouragement}</p>
                </div>
                
                <div class="completion-actions">
                    <button id="practice-again-btn" class="practice-button primary-button">
                        🔄 Practice Again
                    </button>
                    <button id="different-skill-btn" class="practice-button secondary-button">
                        🎯 Try Different Skill
                    </button>
                    <button id="back-to-menu-btn" class="practice-button secondary-button">
                        🏠 Back to Menu
                    </button>
                </div>
            </div>
        `;
        
        // Attach completion action listeners
        this.attachCompletionActions();
        
        // Celebration
        if (stats.accuracy >= 0.8) {
            TimeQuestUI.triggerCelebration();
            TimeQuestAudio.playLevelComplete();
        }
        
        // Mascot feedback
        TimeQuestUI.mascotSay(encouragement);
    }
    
    /**
     * Get letter grade for accuracy
     */
    getGrade(accuracy) {
        if (accuracy >= 0.9) return 'A';
        if (accuracy >= 0.8) return 'B';
        if (accuracy >= 0.7) return 'C';
        if (accuracy >= 0.6) return 'D';
        return 'F';
    }
    
    /**
     * Get encouragement message based on performance
     */
    getEncouragement(accuracy) {
        if (accuracy >= 0.9) {
            return "Outstanding! You're a time-telling master! 🌟";
        } else if (accuracy >= 0.8) {
            return "Excellent work! You're really getting the hang of this! 🎯";
        } else if (accuracy >= 0.7) {
            return "Good job! Keep practicing and you'll be even better! 💪";
        } else if (accuracy >= 0.5) {
            return "Nice effort! Practice makes perfect - try again! 🚀";
        } else {
            return "That's okay! Learning takes time. Keep practicing! 💕";
        }
    }
    
    /**
     * Attach completion action listeners
     */
    attachCompletionActions() {
        const practiceAgainBtn = TimeQuestUtils.getElement('practice-again-btn');
        const differentSkillBtn = TimeQuestUtils.getElement('different-skill-btn');
        const backToMenuBtn = TimeQuestUtils.getElement('back-to-menu-btn');
        
        if (practiceAgainBtn) {
            practiceAgainBtn.addEventListener('click', () => {
                window.location.reload(); // Simple restart
            });
        }
        
        if (differentSkillBtn) {
            differentSkillBtn.addEventListener('click', () => {
                // Return to skill selection
                practiceManager.showSkillSelection();
            });
        }
        
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => {
                TimeQuestUI.showScreen('main-menu');
            });
        }
    }
    
    // ===================================
    // UTILITY METHODS
    // ===================================
    
    /**
     * Format time as readable text
     */
    formatTimeAsText(time) {
        const time12 = TimeQuestUtils.convertTo12Hour(time.hours, time.minutes);
        return `${time12.hours}:${TimeQuestUtils.padNumber(time12.minutes)} ${time12.period}`;
    }
    
    /**
     * Generate wrong answers for multiple choice
     */
    generateWrongAnswers(correctTime, count) {
        const wrongAnswers = [];
        const variations = [
            { hours: 1, minutes: 0 },   // Hour off
            { hours: 0, minutes: 15 },  // 15 minutes off
            { hours: 0, minutes: 30 },  // 30 minutes off
            { hours: -1, minutes: 0 },  // Hour back
            { hours: 0, minutes: -15 }, // 15 minutes back
        ];
        
        for (let i = 0; i < count && i < variations.length; i++) {
            const variation = variations[i];
            let wrongHours = correctTime.hours + variation.hours;
            let wrongMinutes = correctTime.minutes + variation.minutes;
            
            // Normalize the time
            if (wrongMinutes >= 60) {
                wrongMinutes -= 60;
                wrongHours += 1;
            } else if (wrongMinutes < 0) {
                wrongMinutes += 60;
                wrongHours -= 1;
            }
            
            if (wrongHours > 12) wrongHours -= 12;
            if (wrongHours < 1) wrongHours += 12;
            
            wrongAnswers.push({ hours: wrongHours, minutes: wrongMinutes });
        }
        
        return wrongAnswers;
    }
    
    /**
     * Get minute marker number for minutes
     */
    getMinuteMarker(minutes) {
        return minutes === 0 ? 12 : Math.ceil(minutes / 5);
    }
}

// ===================================
// PRACTICE MANAGER CLASS
// Main controller for practice system
// ===================================

class PracticeManager {
    constructor() {
        this.currentSession = null;
        this.isActive = false;
        
        console.log('🏋️‍♂️ Practice Manager created');
    }
    
    /**
     * Initialize practice system
     */
    initialize() {
        this.showSkillSelection();
        console.log('✅ Practice system initialized');
    }
    
    /**
     * Show skill selection screen
     */
    showSkillSelection() {
        const practiceContent = TimeQuestUtils.getElement('practice-content');
        if (!practiceContent) return;
        
        practiceContent.innerHTML = `
            <div class="skill-selection">
                <div class="selection-header">
                    <h2>Choose Your Practice Focus</h2>
                    <p>Select the skill you'd like to practice</p>
                </div>
                
                <div class="skills-grid">
                    ${this.createSkillOptions()}
                </div>
                
                <div class="session-options">
                    <h3>Session Length</h3>
                    <div class="session-buttons">
                        ${this.createSessionOptions()}
                    </div>
                </div>
                
                <div class="difficulty-options">
                    <h3>Difficulty Level</h3>
                    <div class="difficulty-buttons">
                        ${this.createDifficultyOptions()}
                    </div>
                </div>
                
                <div class="start-section">
                    <button id="start-selected-practice" class="practice-button primary-button large" disabled>
                        🚀 Start Practice Session
                    </button>
                </div>
            </div>
        `;
        
        this.attachSelectionListeners();
    }
    
    /**
     * Create skill option HTML
     */
    createSkillOptions() {
        let html = '';
        
        Object.entries(PRACTICE_CONFIG.skillTypes).forEach(([skillId, skill]) => {
            html += `
                <div class="skill-option" data-skill="${skillId}">
                    <div class="skill-icon">${skill.icon}</div>
                    <div class="skill-info">
                        <h4>${skill.name}</h4>
                        <p>${skill.description}</p>
                        <span class="skill-difficulty">${skill.difficulty}</span>
                    </div>
                </div>
            `;
        });
        
        return html;
    }
    
    /**
     * Create session option HTML
     */
    createSessionOptions() {
        let html = '';
        
        Object.entries(PRACTICE_CONFIG.sessionTypes).forEach(([sessionId, session]) => {
            html += `
                <button class="session-option" data-session="${sessionId}">
                    <span class="session-name">${session.name}</span>
                    <span class="session-details">${session.questions} questions • ${session.duration} min</span>
                </button>
            `;
        });
        
        return html;
    }
    
    /**
     * Create difficulty option HTML
     */
    createDifficultyOptions() {
        const difficulties = ['beginner', 'easy', 'medium', 'hard'];
        let html = '';
        
        difficulties.forEach(difficulty => {
            const config = PRACTICE_CONFIG.difficultyLevels[difficulty];
            html += `
                <button class="difficulty-option" data-difficulty="${difficulty}">
                    <span class="difficulty-name">${difficulty}</span>
                    <span class="difficulty-details">${config.hints} hints • ±${config.tolerance}min tolerance</span>
                </button>
            `;
        });
        
        return html;
    }
    
    /**
     * Attach selection event listeners
     */
    attachSelectionListeners() {
        let selectedSkill = null;
        let selectedSession = 'standard';
        let selectedDifficulty = 'easy';
        
        // Skill selection
        const skillOptions = document.querySelectorAll('.skill-option');
        skillOptions.forEach(option => {
            option.addEventListener('click', () => {
                skillOptions.forEach(o => TimeQuestUtils.removeClass(o, 'selected'));
                TimeQuestUtils.addClass(option, 'selected');
                selectedSkill = option.getAttribute('data-skill');
                this.updateStartButton(selectedSkill, selectedSession, selectedDifficulty);
            });
        });
        
        // Session selection
        const sessionOptions = document.querySelectorAll('.session-option');
        sessionOptions.forEach(option => {
            option.addEventListener('click', () => {
                sessionOptions.forEach(o => TimeQuestUtils.removeClass(o, 'selected'));
                TimeQuestUtils.addClass(option, 'selected');
                selectedSession = option.getAttribute('data-session');
                this.updateStartButton(selectedSkill, selectedSession, selectedDifficulty);
            });
        });
        
        // Select standard session by default
        if (sessionOptions.length > 1) {
            TimeQuestUtils.addClass(sessionOptions[1], 'selected'); // Standard is index 1
        }
        
        // Difficulty selection
        const difficultyOptions = document.querySelectorAll('.difficulty-option');
        difficultyOptions.forEach(option => {
            option.addEventListener('click', () => {
                difficultyOptions.forEach(o => TimeQuestUtils.removeClass(o, 'selected'));
                TimeQuestUtils.addClass(option, 'selected');
                selectedDifficulty = option.getAttribute('data-difficulty');
                this.updateStartButton(selectedSkill, selectedSession, selectedDifficulty);
            });
        });
        
        // Select easy difficulty by default
        if (difficultyOptions.length > 1) {
            TimeQuestUtils.addClass(difficultyOptions[1], 'selected'); // Easy is index 1
        }
        
        // Start button
        const startButton = TimeQuestUtils.getElement('start-selected-practice');
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (selectedSkill) {
                    this.startPracticeSession(selectedSkill, selectedSession, selectedDifficulty);
                }
            });
        }
    }
    
    /**
     * Update start button state
     */
    updateStartButton(skill, session, difficulty) {
        const startButton = TimeQuestUtils.getElement('start-selected-practice');
        if (startButton) {
            startButton.disabled = !skill;
            if (skill) {
                const skillName = PRACTICE_CONFIG.skillTypes[skill].name;
                startButton.textContent = `🚀 Start ${skillName}`;
            }
        }
    }
    
    /**
     * Start a practice session
     */
    async startPracticeSession(skillType, sessionType, difficulty) {
        this.currentSession = new PracticeSession(skillType, sessionType, difficulty);
        this.isActive = true;
        
        await this.currentSession.initialize();
        
        console.log(`🏃‍♂️ Practice session started: ${skillType}`);
    }
    
    /**
     * End current practice session
     */
    endCurrentSession() {
        if (this.currentSession) {
            this.currentSession = null;
        }
        this.isActive = false;
    }
}

// ===================================
// INITIALIZE THE PRACTICE MANAGER
// ===================================

// Create global practice manager instance
const practiceManager = new PracticeManager();

// ===================================
// EXPORT FOR OTHER FILES TO USE
// ===================================

window.TimeQuestPractice = {
    manager: practiceManager,
    initialize: () => practiceManager.initialize(),
    config: PRACTICE_CONFIG
};

console.log('✅ Time Quest Practice Manager loaded successfully!');