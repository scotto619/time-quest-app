/**
 * TIME QUEST - CLOCK ENGINE
 * The heart of the app - creates and manages interactive analog clocks
 * Think of this as the clockmaker that builds and operates all the clocks
 */

// ===================================
// CLOCK CLASS DEFINITION
// The blueprint for creating interactive clocks
// ===================================

class InteractiveClock {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = TimeQuestUtils.getElement(containerId);
        
        if (!this.container) {
            console.error(`Clock container ${containerId} not found`);
            return;
        }
        
        // Clock configuration options
        this.options = {
            size: options.size || 250,
            interactive: options.interactive !== false, // Default to true
            showNumbers: options.showNumbers !== false,
            showMinuteMarkers: options.showMinuteMarkers !== false,
            digitalDisplay: options.digitalDisplay !== false,
            onTimeChange: options.onTimeChange || null,
            onHandDrag: options.onHandDrag || null,
            animationSpeed: options.animationSpeed || 300,
            snapToMinutes: options.snapToMinutes || 5, // Snap to 5-minute intervals
            ...options
        };
        
        // Current time state
        this.currentTime = {
            hours: options.initialHours || 12,
            minutes: options.initialMinutes || 0
        };
        
        // Interaction state
        this.isDragging = false;
        this.dragTarget = null;
        this.lastAngle = 0;
        
        // Create the clock
        this.createClock();
        this.attachEventListeners();
        this.updateDisplay();
        
        console.log(`⏰ Created interactive clock: ${containerId}`);
    }
    
    /**
     * Create the clock HTML structure
     */
    createClock() {
        this.container.innerHTML = `
            <div class="interactive-clock-wrapper" style="width: ${this.options.size}px; height: ${this.options.size}px;">
                <div class="analog-clock" data-clock-id="${this.containerId}">
                    <div class="clock-face" style="width: ${this.options.size}px; height: ${this.options.size}px;">
                        ${this.createHourMarkers()}
                        ${this.createMinuteMarkers()}
                        <div class="clock-hands">
                            <div class="hour-hand" data-hand="hour"></div>
                            <div class="minute-hand" data-hand="minute"></div>
                            <div class="clock-center"></div>
                        </div>
                    </div>
                </div>
                ${this.options.digitalDisplay ? this.createDigitalDisplay() : ''}
            </div>
        `;
        
        // Store references to important elements
        this.clockFace = this.container.querySelector('.clock-face');
        this.hourHand = this.container.querySelector('.hour-hand');
        this.minuteHand = this.container.querySelector('.minute-hand');
        this.digitalClock = this.container.querySelector('.digital-clock');
        
        // Add interactive class if enabled
        if (this.options.interactive) {
            TimeQuestUtils.addClass(this.container.querySelector('.clock-hands'), 'interactive');
        }
    }
    
    /**
     * Create hour number markers around the clock
     */
    createHourMarkers() {
        if (!this.options.showNumbers) return '';
        
        let markersHtml = '<div class="hour-markers">';
        for (let hour = 1; hour <= 12; hour++) {
            markersHtml += `<div class="marker hour-${hour}" data-hour="${hour}">${hour}</div>`;
        }
        markersHtml += '</div>';
        return markersHtml;
    }
    
    /**
     * Create minute markers (small dots) around the clock
     */
    createMinuteMarkers() {
        if (!this.options.showMinuteMarkers) return '';
        
        let markersHtml = '<div class="minute-markers">';
        for (let minute = 0; minute < 60; minute += 5) {
            const angle = minute * 6; // 6 degrees per 5-minute mark
            const isQuarter = minute % 15 === 0;
            const size = isQuarter ? 4 : 2;
            const distance = this.options.size / 2 - 20;
            
            const x = Math.sin(angle * Math.PI / 180) * distance + this.options.size / 2;
            const y = -Math.cos(angle * Math.PI / 180) * distance + this.options.size / 2;
            
            markersHtml += `
                <div class="minute-marker" 
                     style="
                         position: absolute; 
                         left: ${x - size/2}px; 
                         top: ${y - size/2}px; 
                         width: ${size}px; 
                         height: ${size}px;
                         background: var(--primary-blue);
                         border-radius: 50%;
                     "
                     data-minute="${minute}">
                </div>
            `;
        }
        markersHtml += '</div>';
        return markersHtml;
    }
    
    /**
     * Create digital time display
     */
    createDigitalDisplay() {
        return `
            <div class="digital-clock">
                <span class="time-display">12:00</span>
                <span class="am-pm">PM</span>
            </div>
        `;
    }
    
    /**
     * Attach event listeners for interaction
     */
    attachEventListeners() {
        if (!this.options.interactive) return;
        
        // Mouse events
        this.hourHand.addEventListener('mousedown', (e) => this.startDrag(e, 'hour'));
        this.minuteHand.addEventListener('mousedown', (e) => this.startDrag(e, 'minute'));
        
        // Touch events for tablets/phones
        this.hourHand.addEventListener('touchstart', (e) => this.startDrag(e, 'hour'), {passive: false});
        this.minuteHand.addEventListener('touchstart', (e) => this.startDrag(e, 'minute'), {passive: false});
        
        // Global events for dragging
        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        document.addEventListener('touchmove', (e) => this.handleDrag(e), {passive: false});
        document.addEventListener('touchend', () => this.stopDrag());
        
        // Click on clock face to set time
        this.clockFace.addEventListener('click', (e) => this.handleClockClick(e));
        
        // Hour marker clicks
        const hourMarkers = this.container.querySelectorAll('.marker[data-hour]');
        hourMarkers.forEach(marker => {
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                const hour = parseInt(marker.getAttribute('data-hour'));
                this.setTime(hour, this.currentTime.minutes);
                TimeQuestUtils.animateElement(marker, 'marker-highlight');
            });
        });
    }
    
    /**
     * Start dragging a clock hand
     */
    startDrag(event, handType) {
        event.preventDefault();
        this.isDragging = true;
        this.dragTarget = handType;
        
        // Visual feedback
        const hand = handType === 'hour' ? this.hourHand : this.minuteHand;
        TimeQuestUtils.addClass(hand, 'dragging');
        
        // Calculate initial angle
        this.lastAngle = this.getAngleFromEvent(event);
        
        // Trigger callback
        if (this.options.onHandDrag) {
            this.options.onHandDrag(handType, 'start', this.currentTime);
        }
        
        console.log(`🖱️ Started dragging ${handType} hand`);
    }
    
    /**
     * Handle dragging motion
     */
    handleDrag(event) {
        if (!this.isDragging || !this.dragTarget) return;
        
        event.preventDefault();
        
        const currentAngle = this.getAngleFromEvent(event);
        const angleDiff = currentAngle - this.lastAngle;
        
        // Convert angle to time change
        if (this.dragTarget === 'minute') {
            // Each degree = 1/6 minute (360° = 60 minutes)
            const minuteChange = angleDiff / 6;
            let newMinutes = this.currentTime.minutes + minuteChange;
            
            // Snap to intervals
            newMinutes = this.snapToInterval(newMinutes, this.options.snapToMinutes);
            
            // Handle overflow/underflow
            let newHours = this.currentTime.hours;
            if (newMinutes >= 60) {
                newMinutes -= 60;
                newHours = (newHours % 12) + 1;
            } else if (newMinutes < 0) {
                newMinutes += 60;
                newHours = newHours - 1;
                if (newHours <= 0) newHours = 12;
            }
            
            this.setTime(newHours, newMinutes);
            
        } else if (this.dragTarget === 'hour') {
            // Each degree = 1/30 hour (360° = 12 hours)
            const hourChange = angleDiff / 30;
            let newHours = this.currentTime.hours + hourChange;
            
            // Normalize to 1-12 range
            while (newHours > 12) newHours -= 12;
            while (newHours < 1) newHours += 12;
            
            this.setTime(Math.round(newHours), this.currentTime.minutes);
        }
        
        this.lastAngle = currentAngle;
        
        // Trigger callback
        if (this.options.onHandDrag) {
            this.options.onHandDrag(this.dragTarget, 'drag', this.currentTime);
        }
    }
    
    /**
     * Stop dragging
     */
    stopDrag() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        // Remove visual feedback
        TimeQuestUtils.removeClass(this.hourHand, 'dragging');
        TimeQuestUtils.removeClass(this.minuteHand, 'dragging');
        
        // Trigger callback
        if (this.options.onHandDrag) {
            this.options.onHandDrag(this.dragTarget, 'end', this.currentTime);
        }
        
        this.dragTarget = null;
        
        console.log(`🖱️ Stopped dragging at ${this.currentTime.hours}:${TimeQuestUtils.padNumber(this.currentTime.minutes)}`);
    }
    
    /**
     * Handle clicks on the clock face
     */
    handleClockClick(event) {
        if (this.isDragging) return;
        
        const angle = this.getAngleFromEvent(event);
        
        // Determine if click is closer to hour or minute hand position
        const minuteAngle = this.currentTime.minutes * 6;
        const hourAngle = ((this.currentTime.hours % 12) * 30) + (this.currentTime.minutes * 0.5);
        
        const minuteDiff = Math.abs(this.normalizeAngle(angle - minuteAngle));
        const hourDiff = Math.abs(this.normalizeAngle(angle - hourAngle));
        
        if (minuteDiff < hourDiff) {
            // Set minutes
            const newMinutes = this.snapToInterval(angle / 6, this.options.snapToMinutes);
            this.setTime(this.currentTime.hours, newMinutes);
        } else {
            // Set hours
            const newHours = Math.round(angle / 30);
            this.setTime(newHours === 0 ? 12 : newHours, this.currentTime.minutes);
        }
    }
    
    /**
     * Get angle from mouse/touch event relative to clock center
     */
    getAngleFromEvent(event) {
        const rect = this.clockFace.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let clientX, clientY;
        if (event.type.startsWith('touch')) {
            const touch = event.touches[0] || event.changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = event.clientX;
            clientY = event.clientY;
        }
        
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        
        // Calculate angle in degrees (0° = 12 o'clock)
        let angle = Math.atan2(deltaX, -deltaY) * 180 / Math.PI;
        return this.normalizeAngle(angle);
    }
    
    /**
     * Normalize angle to 0-360 degrees
     */
    normalizeAngle(angle) {
        while (angle < 0) angle += 360;
        while (angle >= 360) angle -= 360;
        return angle;
    }
    
    /**
     * Snap value to specified interval
     */
    snapToInterval(value, interval) {
        return Math.round(value / interval) * interval;
    }
    
    /**
     * Set the time and update the display
     */
    setTime(hours, minutes, animate = true) {
        // Validate and normalize inputs
        hours = Math.max(1, Math.min(12, Math.round(hours)));
        minutes = Math.max(0, Math.min(59, Math.round(minutes)));
        
        // Store the time
        const oldTime = { ...this.currentTime };
        this.currentTime.hours = hours;
        this.currentTime.minutes = minutes;
        
        // Update the display
        this.updateDisplay(animate);
        
        // Trigger change callback if time actually changed
        if (this.options.onTimeChange && 
            (oldTime.hours !== hours || oldTime.minutes !== minutes)) {
            this.options.onTimeChange(this.currentTime, oldTime);
        }
        
        // Add celebration effect for correct times (if specified)
        if (this.options.celebrateCorrectTime && this.isCorrectTime()) {
            this.celebrate();
        }
    }
    
    /**
     * Update the visual display of the clock
     */
    updateDisplay(animate = true) {
        const angles = TimeQuestUtils.calculateClockAngles(
            this.currentTime.hours, 
            this.currentTime.minutes
        );
        
        // Update hand positions
        const transition = animate ? `transform ${this.options.animationSpeed}ms ease` : 'none';
        
        this.hourHand.style.transition = transition;
        this.hourHand.style.transform = `rotate(${angles.hourAngle}deg)`;
        
        this.minuteHand.style.transition = transition;
        this.minuteHand.style.transform = `rotate(${angles.minuteAngle}deg)`;
        
        // Update digital display if present
        if (this.digitalClock) {
            const time12 = TimeQuestUtils.convertTo12Hour(
                this.currentTime.hours, 
                this.currentTime.minutes
            );
            
            const timeDisplay = this.digitalClock.querySelector('.time-display');
            const amPmDisplay = this.digitalClock.querySelector('.am-pm');
            
            if (timeDisplay) {
                timeDisplay.textContent = `${time12.hours}:${TimeQuestUtils.padNumber(time12.minutes)}`;
            }
            if (amPmDisplay) {
                amPmDisplay.textContent = time12.period;
            }
        }
        
        // Add tick animation to clock face
        if (animate) {
            TimeQuestUtils.animateElement(this.clockFace, 'clock-tick');
        }
    }
    
    /**
     * Get the current time
     */
    getTime() {
        return { ...this.currentTime };
    }
    
    /**
     * Set a target time for validation
     */
    setTargetTime(hours, minutes) {
        this.targetTime = { hours, minutes };
    }
    
    /**
     * Check if current time matches target time
     */
    isCorrectTime() {
        if (!this.targetTime) return false;
        
        return TimeQuestUtils.isTimeCloseEnough(
            this.currentTime, 
            this.targetTime, 
            this.options.tolerance || 2
        );
    }
    
    /**
     * Play celebration animation
     */
    celebrate() {
        TimeQuestUtils.animateElement(this.clockFace, 'clock-celebration');
        
        // Animate hands
        TimeQuestUtils.animateElement(this.hourHand, 'hand-highlight');
        TimeQuestUtils.animateElement(this.minuteHand, 'hand-highlight');
        
        // Play sound if available
        TimeQuestUtils.playSound('success-sound', 0.6);
        
        console.log('🎉 Clock celebration!');
    }
    
    /**
     * Enable or disable interactivity
     */
    setInteractive(interactive) {
        this.options.interactive = interactive;
        const handsContainer = this.container.querySelector('.clock-hands');
        
        if (interactive) {
            TimeQuestUtils.addClass(handsContainer, 'interactive');
        } else {
            TimeQuestUtils.removeClass(handsContainer, 'interactive');
        }
    }
    
    /**
     * Reset clock to 12:00
     */
    reset() {
        this.setTime(12, 0);
    }
    
    /**
     * Destroy the clock and clean up event listeners
     */
    destroy() {
        // Remove event listeners
        // (In a full implementation, we'd store references and remove them)
        this.container.innerHTML = '';
        console.log(`🗑️ Destroyed clock: ${this.containerId}`);
    }
}

// ===================================
// CLOCK MANAGER
// Manages multiple clocks in the app
// ===================================

class ClockManager {
    constructor() {
        this.clocks = new Map();
        this.activeClock = null;
    }
    
    /**
     * Create a new clock
     */
    createClock(id, options = {}) {
        if (this.clocks.has(id)) {
            console.warn(`Clock ${id} already exists`);
            return this.clocks.get(id);
        }
        
        const clock = new InteractiveClock(id, options);
        if (clock.container) {
            this.clocks.set(id, clock);
            console.log(`📝 Registered clock: ${id}`);
        }
        return clock;
    }
    
    /**
     * Get an existing clock
     */
    getClock(id) {
        return this.clocks.get(id);
    }
    
    /**
     * Remove a clock
     */
    removeClock(id) {
        const clock = this.clocks.get(id);
        if (clock) {
            clock.destroy();
            this.clocks.delete(id);
            if (this.activeClock === clock) {
                this.activeClock = null;
            }
        }
    }
    
    /**
     * Set the active clock for global operations
     */
    setActiveClock(id) {
        const clock = this.clocks.get(id);
        if (clock) {
            this.activeClock = clock;
            return true;
        }
        return false;
    }
    
    /**
     * Get all clocks
     */
    getAllClocks() {
        return Array.from(this.clocks.values());
    }
    
    /**
     * Sync all clocks to the same time
     */
    syncAllClocks(hours, minutes) {
        this.clocks.forEach(clock => {
            clock.setTime(hours, minutes);
        });
    }
    
    /**
     * Reset all clocks
     */
    resetAllClocks() {
        this.clocks.forEach(clock => {
            clock.reset();
        });
    }
}

// ===================================
// CLOCK PRESETS
// Common clock configurations for different activities
// ===================================

const ClockPresets = {
    tutorial: {
        interactive: true,
        showNumbers: true,
        showMinuteMarkers: true,
        digitalDisplay: true,
        snapToMinutes: 15, // Snap to quarter hours
        animationSpeed: 500
    },
    
    practice: {
        interactive: true,
        showNumbers: true,
        showMinuteMarkers: true,
        digitalDisplay: false,
        snapToMinutes: 5,
        animationSpeed: 300
    },
    
    game: {
        interactive: true,
        showNumbers: true,
        showMinuteMarkers: false,
        digitalDisplay: false,
        snapToMinutes: 5,
        animationSpeed: 200
    },
    
    display: {
        interactive: false,
        showNumbers: true,
        showMinuteMarkers: true,
        digitalDisplay: true,
        animationSpeed: 1000
    },
    
    simple: {
        interactive: true,
        showNumbers: true,
        showMinuteMarkers: false,
        digitalDisplay: true,
        snapToMinutes: 30, // Only half hours
        animationSpeed: 400
    }
};

// ===================================
// UTILITY FUNCTIONS
// Helper functions for clock operations
// ===================================

/**
 * Create a clock with preset configuration
 */
function createPresetClock(containerId, presetName, customOptions = {}) {
    const preset = ClockPresets[presetName] || ClockPresets.tutorial;
    const options = { ...preset, ...customOptions };
    return clockManager.createClock(containerId, options);
}

/**
 * Create a practice question with random time
 */
function createTimeQuestion(difficulty = 'easy') {
    const timeOptions = {
        easy: { onlySimpleTimes: true },
        medium: { onlySimpleTimes: false },
        hard: { onlySimpleTimes: false }
    };
    
    const time = TimeQuestUtils.generateRandomTime(
        timeOptions[difficulty].onlySimpleTimes
    );
    
    return {
        time: time,
        question: `What time is shown on the clock?`,
        answers: generateTimeAnswers(time),
        difficulty: difficulty
    };
}

/**
 * Generate multiple choice answers for a time question
 */
function generateTimeAnswers(correctTime) {
    const answers = [correctTime];
    
    // Generate 3 incorrect answers
    while (answers.length < 4) {
        const wrongTime = TimeQuestUtils.generateRandomTime();
        
        // Make sure it's different from correct answer and other wrong answers
        const isDuplicate = answers.some(existing => 
            existing.hours === wrongTime.hours && existing.minutes === wrongTime.minutes
        );
        
        if (!isDuplicate) {
            answers.push(wrongTime);
        }
    }
    
    // Shuffle the answers
    return TimeQuestUtils.shuffleArray(answers);
}

// ===================================
// INITIALIZATION
// Create the global clock manager
// ===================================

const clockManager = new ClockManager();

// ===================================
// EXPORT FOR OTHER FILES TO USE
// ===================================

window.TimeQuestClocks = {
    // Main classes
    InteractiveClock,
    ClockManager,
    
    // Global manager instance
    manager: clockManager,
    
    // Presets
    presets: ClockPresets,
    
    // Utility functions
    createPresetClock,
    createTimeQuestion,
    generateTimeAnswers
};

console.log('✅ Time Quest Clock Engine loaded successfully!');