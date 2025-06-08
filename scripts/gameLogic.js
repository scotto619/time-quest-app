/**
 * TIME QUEST - GAME LOGIC
 * The game master that creates challenges, manages scoring, and progression
 * Think of this as the dungeon master for your time-learning adventure
 */

// ===================================
// GAME CONFIGURATION
// Settings for different game types and difficulty levels
// ===================================

const GAME_CONFIG = {
    scoring: {
        basePoints: 100,
        timeBonus: 50,
        streakMultiplier: 1.2,
        perfectBonus: 200
    },
    
    difficulty: {
        beginner: {
            timeLimit: 60,
            tolerance: 5, // minutes tolerance
            snapMinutes: 30, // only half hours
            livesStart: 5
        },
        easy: {
            timeLimit: 45,
            tolerance: 3,
            snapMinutes: 15, // quarter hours
            livesStart: 4
        },
        medium: {
            timeLimit: 30,
            tolerance: 2,
            snapMinutes: 5, // 5-minute intervals
            livesStart: 3
        },
        hard: {
            timeLimit: 20,
            tolerance: 1,
            snapMinutes: 1, // any minute
            livesStart: 2
        }
    },
    
    gameTypes: {
        'analog-reading': 'Read the analog clock',
        'digital-setting': 'Set the digital time',
        'time-matching': 'Match analog and digital times',
        'elapsed-time': 'Calculate elapsed time',
        'word-problems': 'Solve time word problems',
        'beat-the-clock': 'Complete before time runs out',
        'sequence-time': 'Put events in time order',
        'time-conversion': 'Convert between formats'
    }
};

// ===================================
// CHALLENGE GENERATOR
// Creates different types of time challenges
// ===================================

class ChallengeGenerator {
    constructor(difficulty = 'easy') {
        this.difficulty = difficulty;
        this.config = GAME_CONFIG.difficulty[difficulty];
        this.usedChallenges = new Set();
    }
    
    /**
     * Generate a random challenge based on type and difficulty
     */
    generateChallenge(challengeType) {
        const generators = {
            'analog-reading': () => this.generateAnalogReading(),
            'digital-setting': () => this.generateDigitalSetting(),
            'time-matching': () => this.generateTimeMatching(),
            'elapsed-time': () => this.generateElapsedTime(),
            'word-problems': () => this.generateWordProblem(),
            'beat-the-clock': () => this.generateBeatTheClock(),
            'sequence-time': () => this.generateSequenceTime(),
            'time-conversion': () => this.generateTimeConversion()
        };
        
        const generator = generators[challengeType];
        if (!generator) {
            console.error(`Unknown challenge type: ${challengeType}`);
            return null;
        }
        
        const challenge = generator();
        challenge.id = this.generateChallengeId();
        challenge.type = challengeType;
        challenge.difficulty = this.difficulty;
        challenge.timeLimit = this.config.timeLimit;
        challenge.tolerance = this.config.tolerance;
        
        return challenge;
    }
    
    /**
     * Generate analog clock reading challenge
     */
    generateAnalogReading() {
        const time = this.generateRandomTime();
        const wrongAnswers = this.generateWrongTimeAnswers(time, 3);
        const allAnswers = TimeQuestUtils.shuffleArray([time, ...wrongAnswers]);
        
        return {
            instruction: "What time does this clock show?",
            clockTime: time,
            answerType: 'multiple-choice',
            answers: allAnswers,
            correctAnswer: time,
            hints: [
                "Look at where the hour hand points",
                "Check where the minute hand points",
                "Remember the hour hand moves slowly"
            ]
        };
    }
    
    /**
     * Generate digital time setting challenge
     */
    generateDigitalSetting() {
        const time = this.generateRandomTime();
        const timeText = this.formatTimeAsText(time);
        
        return {
            instruction: `Set the clock to show ${timeText}`,
            targetTime: time,
            answerType: 'clock-setting',
            displayText: timeText,
            hints: [
                "Drag the clock hands to set the time",
                "The short hand shows hours",
                "The long hand shows minutes"
            ]
        };
    }
    
    /**
     * Generate time matching challenge
     */
    generateTimeMatching() {
        const times = [];
        for (let i = 0; i < 4; i++) {
            times.push(this.generateRandomTime());
        }
        
        // Create pairs of analog and digital representations
        const analogTimes = TimeQuestUtils.shuffleArray([...times]);
        const digitalTimes = TimeQuestUtils.shuffleArray([...times]);
        
        return {
            instruction: "Match the analog clocks with their digital times",
            answerType: 'matching',
            analogTimes: analogTimes,
            digitalTimes: digitalTimes,
            hints: [
                "Look carefully at the hour and minute hands",
                "Convert each analog time to digital format",
                "Double-check your matches"
            ]
        };
    }
    
    /**
     * Generate elapsed time challenge
     */
    generateElapsedTime() {
        const startTime = this.generateRandomTime();
        const duration = TimeQuestUtils.randomChoice([15, 30, 45, 60, 90, 120]); // minutes
        const endTime = this.addMinutesToTime(startTime, duration);
        
        const questionTypes = [
            `If it's ${this.formatTimeAsText(startTime)} now, what time will it be in ${duration} minutes?`,
            `How many minutes are there between ${this.formatTimeAsText(startTime)} and ${this.formatTimeAsText(endTime)}?`,
            `If something starts at ${this.formatTimeAsText(startTime)} and lasts ${duration} minutes, when does it end?`
        ];
        
        const question = TimeQuestUtils.randomChoice(questionTypes);
        let correctAnswer, answerType;
        
        if (question.includes('what time will it be') || question.includes('when does it end')) {
            correctAnswer = endTime;
            answerType = 'time-answer';
        } else {
            correctAnswer = duration;
            answerType = 'number-answer';
        }
        
        return {
            instruction: question,
            startTime: startTime,
            endTime: endTime,
            duration: duration,
            correctAnswer: correctAnswer,
            answerType: answerType,
            hints: [
                "Count carefully from the starting time",
                "Remember there are 60 minutes in an hour",
                "Use the clock to help you visualize"
            ]
        };
    }
    
    /**
     * Generate word problem challenge
     */
    generateWordProblem() {
        const scenarios = [
            {
                template: "Sarah's piano lesson starts at {startTime} and lasts {duration} minutes. What time does it end?",
                type: 'duration-end'
            },
            {
                template: "The movie starts at {startTime} and ends at {endTime}. How long is the movie?",
                type: 'start-end-duration'
            },
            {
                template: "Tom needs to be at school by {endTime}. If it takes him {duration} minutes to get there, what time should he leave?",
                type: 'work-backwards'
            },
            {
                template: "The library opens at {startTime} and closes at {endTime}. How many hours is it open?",
                type: 'hours-duration'
            }
        ];
        
        const scenario = TimeQuestUtils.randomChoice(scenarios);
        const startTime = this.generateRandomTime();
        const duration = TimeQuestUtils.randomChoice([30, 45, 60, 90, 120]);
        const endTime = this.addMinutesToTime(startTime, duration);
        
        let instruction = scenario.template
            .replace('{startTime}', this.formatTimeAsText(startTime))
            .replace('{endTime}', this.formatTimeAsText(endTime))
            .replace('{duration}', duration);
        
        let correctAnswer, answerType;
        
        switch (scenario.type) {
            case 'duration-end':
                correctAnswer = endTime;
                answerType = 'time-answer';
                break;
            case 'start-end-duration':
                correctAnswer = duration;
                answerType = 'number-answer';
                break;
            case 'work-backwards':
                correctAnswer = this.subtractMinutesFromTime(endTime, duration);
                answerType = 'time-answer';
                break;
            case 'hours-duration':
                correctAnswer = Math.round(duration / 60 * 10) / 10; // Round to 1 decimal
                answerType = 'number-answer';
                break;
        }
        
        return {
            instruction: instruction,
            scenario: scenario.type,
            startTime: startTime,
            endTime: endTime,
            duration: duration,
            correctAnswer: correctAnswer,
            answerType: answerType,
            hints: [
                "Read the problem carefully",
                "Identify what you know and what you need to find",
                "Use the clock to help visualize the problem"
            ]
        };
    }
    
    /**
     * Generate beat the clock challenge
     */
    generateBeatTheClock() {
        const numberOfQuestions = 5;
        const questions = [];
        
        for (let i = 0; i < numberOfQuestions; i++) {
            const time = this.generateRandomTime();
            questions.push({
                clockTime: time,
                question: `What time is this?`,
                correctAnswer: time
            });
        }
        
        return {
            instruction: `Quick! Answer ${numberOfQuestions} time questions before time runs out!`,
            answerType: 'speed-round',
            questions: questions,
            timeLimit: numberOfQuestions * 8, // 8 seconds per question
            hints: [
                "Answer as quickly as you can",
                "Don't worry about being perfect",
                "Keep your eyes on the countdown timer"
            ]
        };
    }
    
    /**
     * Generate sequence time challenge
     */
    generateSequenceTime() {
        const baseTime = this.generateRandomTime();
        const events = [
            { name: "Wake up", time: baseTime },
            { name: "Eat breakfast", time: this.addMinutesToTime(baseTime, 30) },
            { name: "Go to school", time: this.addMinutesToTime(baseTime, 90) },
            { name: "Lunch time", time: this.addMinutesToTime(baseTime, 240) },
            { name: "Come home", time: this.addMinutesToTime(baseTime, 480) }
        ];
        
        const shuffledEvents = TimeQuestUtils.shuffleArray([...events]);
        
        return {
            instruction: "Put these daily events in the correct time order",
            answerType: 'sequence',
            events: shuffledEvents,
            correctOrder: events,
            hints: [
                "Think about when these things happen in a normal day",
                "Look at the times carefully",
                "Start with the earliest time"
            ]
        };
    }
    
    /**
     * Generate time conversion challenge
     */
    generateTimeConversion() {
        const time24 = {
            hours: TimeQuestUtils.randomInt(0, 23),
            minutes: TimeQuestUtils.randomInt(0, 59)
        };
        
        const time12 = TimeQuestUtils.convertTo12Hour(time24.hours, time24.minutes);
        
        const conversionTypes = [
            {
                from: '24-hour',
                to: '12-hour',
                given: `${TimeQuestUtils.padNumber(time24.hours)}:${TimeQuestUtils.padNumber(time24.minutes)}`,
                answer: `${time12.hours}:${TimeQuestUtils.padNumber(time12.minutes)} ${time12.period}`
            },
            {
                from: '12-hour',
                to: '24-hour',
                given: `${time12.hours}:${TimeQuestUtils.padNumber(time12.minutes)} ${time12.period}`,
                answer: `${TimeQuestUtils.padNumber(time24.hours)}:${TimeQuestUtils.padNumber(time24.minutes)}`
            }
        ];
        
        const conversion = TimeQuestUtils.randomChoice(conversionTypes);
        
        return {
            instruction: `Convert this ${conversion.from} time to ${conversion.to} format: ${conversion.given}`,
            answerType: 'text-input',
            givenTime: conversion.given,
            correctAnswer: conversion.answer,
            conversionType: `${conversion.from}-to-${conversion.to}`,
            hints: [
                "Remember: AM is morning, PM is afternoon/evening",
                "12 AM is midnight, 12 PM is noon",
                "Add 12 to PM hours (except 12 PM stays 12)"
            ]
        };
    }
    
    // Helper methods
    generateRandomTime() {
        return TimeQuestUtils.generateRandomTime(this.difficulty === 'beginner');
    }
    
    generateWrongTimeAnswers(correctTime, count) {
        const wrongAnswers = [];
        const variations = [
            { hours: 1, minutes: 0 },   // Hour off
            { hours: 0, minutes: 15 },  // 15 minutes off
            { hours: 0, minutes: 30 },  // 30 minutes off
            { hours: -1, minutes: 0 },  // Hour back
            { hours: 0, minutes: -15 }, // 15 minutes back
            { hours: 0, minutes: 5 },   // 5 minutes off
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
    
    formatTimeAsText(time) {
        const time12 = TimeQuestUtils.convertTo12Hour(time.hours, time.minutes);
        return `${time12.hours}:${TimeQuestUtils.padNumber(time12.minutes)} ${time12.period}`;
    }
    
    addMinutesToTime(time, minutes) {
        let newHours = time.hours;
        let newMinutes = time.minutes + minutes;
        
        while (newMinutes >= 60) {
            newMinutes -= 60;
            newHours += 1;
        }
        
        if (newHours > 12) newHours -= 12;
        
        return { hours: newHours, minutes: newMinutes };
    }
    
    subtractMinutesFromTime(time, minutes) {
        let newHours = time.hours;
        let newMinutes = time.minutes - minutes;
        
        while (newMinutes < 0) {
            newMinutes += 60;
            newHours -= 1;
        }
        
        if (newHours < 1) newHours += 12;
        
        return { hours: newHours, minutes: newMinutes };
    }
    
    generateChallengeId() {
        return `challenge_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}

// ===================================
// GAME SESSION MANAGER
// Manages active game sessions with scoring and progression
// ===================================

class GameSession {
    constructor(gameMode, difficulty = 'easy') {
        this.gameMode = gameMode;
        this.difficulty = difficulty;
        this.config = GAME_CONFIG.difficulty[difficulty];
        
        // Session state
        this.score = 0;
        this.lives = this.config.livesStart;
        this.streak = 0;
        this.currentLevel = 1;
        this.challengesCompleted = 0;
        this.timeSpent = 0;
        this.startTime = Date.now();
        
        // Challenge management
        this.generator = new ChallengeGenerator(difficulty);
        this.currentChallenge = null;
        this.challengeHistory = [];
        
        // Callbacks for UI updates
        this.onScoreChange = null;
        this.onLivesChange = null;
        this.onLevelUp = null;
        this.onGameOver = null;
        this.onChallengeComplete = null;
        
        console.log(`🎮 Started ${gameMode} session at ${difficulty} difficulty`);
    }
    
    /**
     * Start a new challenge
     */
    startChallenge(challengeType) {
        if (this.currentChallenge) {
            console.warn('Challenge already in progress');
            return false;
        }
        
        this.currentChallenge = this.generator.generateChallenge(challengeType);
        this.currentChallenge.startTime = Date.now();
        
        console.log(`🎯 Started challenge: ${this.currentChallenge.type}`);
        return this.currentChallenge;
    }
    
    /**
     * Submit an answer to the current challenge
     */
    submitAnswer(answer) {
        if (!this.currentChallenge) {
            console.error('No active challenge to answer');
            return null;
        }
        
        const challenge = this.currentChallenge;
        const timeSpent = (Date.now() - challenge.startTime) / 1000;
        const isCorrect = this.validateAnswer(answer, challenge);
        
        // Calculate score
        const points = this.calculatePoints(isCorrect, timeSpent, challenge);
        
        // Create result object
        const result = {
            challenge: challenge,
            answer: answer,
            isCorrect: isCorrect,
            timeSpent: timeSpent,
            points: points,
            explanation: this.generateExplanation(challenge, answer, isCorrect)
        };
        
        // Update session state
        this.processResult(result);
        
        // Store in history
        this.challengeHistory.push(result);
        this.currentChallenge = null;
        
        // Trigger callback
        if (this.onChallengeComplete) {
            this.onChallengeComplete(result);
        }
        
        console.log(`📝 Challenge completed: ${isCorrect ? 'CORRECT' : 'INCORRECT'} (+${points} points)`);
        return result;
    }
    
    /**
     * Validate if an answer is correct
     */
    validateAnswer(answer, challenge) {
        switch (challenge.answerType) {
            case 'multiple-choice':
                return this.compareTimeAnswers(answer, challenge.correctAnswer);
                
            case 'clock-setting':
                return TimeQuestUtils.isTimeCloseEnough(
                    answer, 
                    challenge.targetTime, 
                    challenge.tolerance
                );
                
            case 'time-answer':
                return this.compareTimeAnswers(answer, challenge.correctAnswer);
                
            case 'number-answer':
                return Math.abs(answer - challenge.correctAnswer) <= 1;
                
            case 'text-input':
                return answer.toLowerCase().trim() === challenge.correctAnswer.toLowerCase().trim();
                
            case 'sequence':
                return this.validateSequence(answer, challenge.correctOrder);
                
            case 'matching':
                return this.validateMatching(answer, challenge);
                
            case 'speed-round':
                // For speed rounds, check how many they got right
                const correctCount = answer.filter((ans, index) => 
                    this.compareTimeAnswers(ans, challenge.questions[index].correctAnswer)
                ).length;
                return correctCount >= challenge.questions.length * 0.7; // 70% correct
                
            default:
                console.error(`Unknown answer type: ${challenge.answerType}`);
                return false;
        }
    }
    
    /**
     * Compare two time objects for equality (with tolerance)
     */
    compareTimeAnswers(answer, correct) {
        if (!answer || !correct) return false;
        
        return TimeQuestUtils.isTimeCloseEnough(
            answer, 
            correct, 
            this.config.tolerance
        );
    }
    
    /**
     * Validate sequence answer
     */
    validateSequence(answer, correctOrder) {
        if (answer.length !== correctOrder.length) return false;
        
        for (let i = 0; i < answer.length; i++) {
            if (answer[i].name !== correctOrder[i].name) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Validate matching answer
     */
    validateMatching(answer, challenge) {
        // Answer should be an array of {analog: index, digital: index} pairs
        const correctMatches = challenge.analogTimes.length;
        let correctCount = 0;
        
        answer.forEach(match => {
            const analogTime = challenge.analogTimes[match.analog];
            const digitalTime = challenge.digitalTimes[match.digital];
            
            if (this.compareTimeAnswers(analogTime, digitalTime)) {
                correctCount++;
            }
        });
        
        return correctCount === correctMatches;
    }
    
    /**
     * Calculate points for a challenge result
     */
    calculatePoints(isCorrect, timeSpent, challenge) {
        if (!isCorrect) return 0;
        
        let points = GAME_CONFIG.scoring.basePoints;
        
        // Time bonus (faster = more points)
        if (timeSpent < challenge.timeLimit * 0.5) {
            points += GAME_CONFIG.scoring.timeBonus;
        }
        
        // Streak multiplier
        if (this.streak > 0) {
            points *= Math.pow(GAME_CONFIG.scoring.streakMultiplier, this.streak);
        }
        
        // Perfect accuracy bonus
        if (timeSpent < challenge.timeLimit * 0.3) {
            points += GAME_CONFIG.scoring.perfectBonus;
        }
        
        return Math.round(points);
    }
    
    /**
     * Process the result and update session state
     */
    processResult(result) {
        const wasCorrect = result.isCorrect;
        
        // Update score
        this.score += result.points;
        if (this.onScoreChange) {
            this.onScoreChange(this.score, result.points);
        }
        
        // Update streak
        if (wasCorrect) {
            this.streak++;
        } else {
            this.streak = 0;
            this.lives--;
            
            if (this.onLivesChange) {
                this.onLivesChange(this.lives);
            }
        }
        
        // Update challenges completed
        this.challengesCompleted++;
        
        // Check for level up (every 5 challenges)
        if (this.challengesCompleted % 5 === 0) {
            this.levelUp();
        }
        
        // Check for game over
        if (this.lives <= 0) {
            this.endSession();
        }
        
        // Update total time
        this.timeSpent = (Date.now() - this.startTime) / 1000;
    }
    
    /**
     * Level up the session
     */
    levelUp() {
        this.currentLevel++;
        this.lives = Math.min(this.lives + 1, this.config.livesStart); // Restore a life
        
        if (this.onLevelUp) {
            this.onLevelUp(this.currentLevel);
        }
        
        console.log(`🆙 Level up! Now at level ${this.currentLevel}`);
    }
    
    /**
     * End the game session
     */
    endSession() {
        const finalStats = this.getSessionStats();
        
        // Save to storage
        const profile = TimeQuestStorage.getCurrentProfile();
        if (profile) {
            TimeQuestStorage.updateGameProgress(this.gameMode, this.currentLevel, {
                finalScore: this.score,
                challengesCompleted: this.challengesCompleted,
                timeSpent: this.timeSpent,
                difficulty: this.difficulty
            });
            
            // Check for achievements
            this.checkAchievements(finalStats);
        }
        
        if (this.onGameOver) {
            this.onGameOver(finalStats);
        }
        
        console.log(`🏁 Game session ended. Final score: ${this.score}`);
        return finalStats;
    }
    
    /**
     * Get current session statistics
     */
    getSessionStats() {
        const correctAnswers = this.challengeHistory.filter(r => r.isCorrect).length;
        const totalAnswers = this.challengeHistory.length;
        
        return {
            score: this.score,
            level: this.currentLevel,
            challengesCompleted: this.challengesCompleted,
            correctAnswers: correctAnswers,
            totalAnswers: totalAnswers,
            accuracy: totalAnswers > 0 ? correctAnswers / totalAnswers : 0,
            timeSpent: this.timeSpent,
            averageTimePerChallenge: totalAnswers > 0 ? this.timeSpent / totalAnswers : 0,
            maxStreak: Math.max(...this.challengeHistory.map(r => r.points)),
            difficulty: this.difficulty,
            gameMode: this.gameMode
        };
    }
    
    /**
     * Generate explanation for a challenge result
     */
    generateExplanation(challenge, answer, isCorrect) {
        if (isCorrect) {
            return {
                message: "Excellent work! You got it right!",
                type: 'success',
                details: this.getSuccessDetails(challenge)
            };
        } else {
            return {
                message: "Not quite right. Let's learn from this!",
                type: 'learning',
                details: this.getErrorExplanation(challenge, answer)
            };
        }
    }
    
    /**
     * Get success details for correct answers
     */
    getSuccessDetails(challenge) {
        const tips = [
            "Great job reading the clock hands!",
            "You're getting really good at telling time!",
            "Perfect! Keep up the excellent work!",
            "Fantastic! Your time-telling skills are improving!"
        ];
        
        return TimeQuestUtils.randomChoice(tips);
    }
    
    /**
     * Get explanation for incorrect answers
     */
    getErrorExplanation(challenge, answer) {
        switch (challenge.type) {
            case 'analog-reading':
                return "Remember: the short hand shows hours, the long hand shows minutes. The hour hand moves slowly between numbers.";
                
            case 'digital-setting':
                return "Try dragging the clock hands more carefully. The hour hand is short, the minute hand is long.";
                
            case 'elapsed-time':
                return "When calculating elapsed time, count forward from the starting time to the ending time.";
                
            default:
                return "Take your time and read the question carefully. You can do this!";
        }
    }
    
    /**
     * Check for achievements based on session performance
     */
    checkAchievements(stats) {
        // Perfect game achievement
        if (stats.accuracy === 1.0 && stats.totalAnswers >= 10) {
            TimeQuestStorage.awardAchievement('perfect_game', {
                name: 'Perfect Game',
                description: 'Got 100% accuracy in a game!',
                icon: '💯'
            });
        }
        
        // Speed demon achievement
        if (stats.averageTimePerChallenge < 10 && stats.totalAnswers >= 5) {
            TimeQuestStorage.awardAchievement('speed_demon', {
                name: 'Speed Demon',
                description: 'Answered questions super quickly!',
                icon: '⚡'
            });
        }
        
        // Level milestones
        if (stats.level >= 10) {
            TimeQuestStorage.awardAchievement('level_10', {
                name: 'Level Master',
                description: 'Reached level 10!',
                icon: '🔟'
            });
        }
    }
}

// ===================================
// GAME MODES
// Different types of game experiences
// ===================================

const GameModes = {
    adventure: {
        name: 'Time Adventure',
        description: 'Journey through time with various challenges',
        challengeTypes: ['analog-reading', 'digital-setting', 'time-matching', 'elapsed-time'],
        progression: 'linear'
    },
    
    practice: {
        name: 'Practice Mode',
        description: 'Focus on specific time-telling skills',
        challengeTypes: ['analog-reading', 'digital-setting'],
        progression: 'repeat'
    },
    
    speedRun: {
        name: 'Speed Challenge',
        description: 'Answer as many questions as possible quickly',
        challengeTypes: ['beat-the-clock'],
        progression: 'timed'
    },
    
    wordProblems: {
        name: 'Story Problems',
        description: 'Solve real-world time problems',
        challengeTypes: ['word-problems', 'elapsed-time'],
        progression: 'story'
    }
};

// ===================================
// EXPORT FOR OTHER FILES TO USE
// ===================================

window.TimeQuestGame = {
    // Main classes
    ChallengeGenerator,
    GameSession,
    
    // Configuration
    config: GAME_CONFIG,
    modes: GameModes,
    
    // Utility functions
    createGameSession: (mode, difficulty) => new GameSession(mode, difficulty),
    generateChallenge: (type, difficulty) => {
        const generator = new ChallengeGenerator(difficulty);
        return generator.generateChallenge(type);
    }
};

console.log('✅ Time Quest Game Logic loaded successfully!');