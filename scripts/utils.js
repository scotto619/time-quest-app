/**
 * TIME QUEST - UTILITIES
 * Helper functions and tools used throughout the app
 * Think of this as the "toolbox" that other files reach into
 */

// ===================================
// DOM MANIPULATION HELPERS
// Tools for finding and changing HTML elements
// ===================================

/**
 * Find an element by its ID (like finding a specific room in your house)
 * @param {string} id - The ID of the element to find
 * @returns {Element|null} The found element or null if not found
 */
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID "${id}" not found`);
    }
    return element;
}

/**
 * Find multiple elements by their class (like finding all bedrooms in your house)
 * @param {string} className - The class name to search for
 * @returns {NodeList} List of found elements
 */
function getElements(className) {
    return document.querySelectorAll(`.${className}`);
}

/**
 * Add a CSS class to an element (like putting a sticker on something)
 * @param {Element} element - The element to modify
 * @param {string} className - The class name to add
 */
function addClass(element, className) {
    if (element && element.classList) {
        element.classList.add(className);
    }
}

/**
 * Remove a CSS class from an element (like taking a sticker off)
 * @param {Element} element - The element to modify
 * @param {string} className - The class name to remove
 */
function removeClass(element, className) {
    if (element && element.classList) {
        element.classList.remove(className);
    }
}

/**
 * Check if an element has a specific class (like checking if something has a sticker)
 * @param {Element} element - The element to check
 * @param {string} className - The class name to look for
 * @returns {boolean} True if the element has the class
 */
function hasClass(element, className) {
    return element && element.classList && element.classList.contains(className);
}

/**
 * Show an element (make it visible)
 * @param {Element} element - The element to show
 */
function showElement(element) {
    if (element) {
        element.style.display = 'block';
        removeClass(element, 'hidden');
        addClass(element, 'visible');
    }
}

/**
 * Hide an element (make it invisible)
 * @param {Element} element - The element to hide
 */
function hideElement(element) {
    if (element) {
        element.style.display = 'none';
        removeClass(element, 'visible');
        addClass(element, 'hidden');
    }
}

// ===================================
// TIME AND MATH HELPERS
// Tools for working with time and numbers
// ===================================

/**
 * Convert 24-hour time to 12-hour format (like 14:30 becomes 2:30 PM)
 * @param {number} hours - Hours in 24-hour format (0-23)
 * @param {number} minutes - Minutes (0-59)
 * @returns {Object} Object with hours, minutes, and period (AM/PM)
 */
function convertTo12Hour(hours, minutes) {
    let period = 'AM';
    let displayHours = hours;
    
    if (hours === 0) {
        displayHours = 12; // Midnight becomes 12 AM
    } else if (hours === 12) {
        period = 'PM'; // Noon stays 12 PM
    } else if (hours > 12) {
        displayHours = hours - 12; // Afternoon/evening
        period = 'PM';
    }
    
    return {
        hours: displayHours,
        minutes: minutes,
        period: period
    };
}

/**
 * Convert 12-hour time to 24-hour format (like 2:30 PM becomes 14:30)
 * @param {number} hours - Hours in 12-hour format (1-12)
 * @param {number} minutes - Minutes (0-59)
 * @param {string} period - 'AM' or 'PM'
 * @returns {Object} Object with hours and minutes in 24-hour format
 */
function convertTo24Hour(hours, minutes, period) {
    let displayHours = hours;
    
    if (period === 'AM' && hours === 12) {
        displayHours = 0; // 12 AM becomes 0 (midnight)
    } else if (period === 'PM' && hours !== 12) {
        displayHours = hours + 12; // PM hours (except 12) add 12
    }
    
    return {
        hours: displayHours,
        minutes: minutes
    };
}

/**
 * Format time numbers to always show two digits (like 5 becomes 05)
 * @param {number} num - The number to format
 * @returns {string} Two-digit string
 */
function padNumber(num) {
    return num.toString().padStart(2, '0');
}

/**
 * Calculate the angle for clock hands based on time
 * @param {number} hours - Current hour (0-23)
 * @param {number} minutes - Current minutes (0-59)
 * @returns {Object} Angles for hour and minute hands
 */
function calculateClockAngles(hours, minutes) {
    // Each minute = 6 degrees (360° ÷ 60 minutes)
    const minuteAngle = minutes * 6;
    
    // Each hour = 30 degrees (360° ÷ 12 hours)
    // Plus extra movement based on minutes (0.5° per minute)
    const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);
    
    return {
        hourAngle: hourAngle,
        minuteAngle: minuteAngle
    };
}

/**
 * Calculate time from clock hand angles (reverse of above)
 * @param {number} hourAngle - Angle of hour hand in degrees
 * @param {number} minuteAngle - Angle of minute hand in degrees
 * @returns {Object} Time with hours and minutes
 */
function calculateTimeFromAngles(hourAngle, minuteAngle) {
    // Convert minute angle to minutes (divide by 6)
    const minutes = Math.round(minuteAngle / 6) % 60;
    
    // Convert hour angle to hours (more complex due to minute influence)
    let hours = Math.round((hourAngle - (minutes * 0.5)) / 30) % 12;
    if (hours < 0) hours += 12;
    
    return {
        hours: hours,
        minutes: minutes
    };
}

// ===================================
// RANDOM HELPERS
// Tools for creating random things (useful for games)
// ===================================

/**
 * Generate a random whole number between min and max (including both)
 * @param {number} min - Smallest possible number
 * @param {number} max - Largest possible number
 * @returns {number} Random integer
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick a random item from an array (like picking a card from a deck)
 * @param {Array} array - Array to pick from
 * @returns {*} Random item from the array
 */
function randomChoice(array) {
    if (array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle an array (like mixing up a deck of cards)
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array]; // Make a copy
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
    }
    return shuffled;
}

/**
 * Generate a random time (useful for creating practice questions)
 * @param {boolean} onlySimpleTimes - If true, only use easy times (on the hour, half hour, etc.)
 * @returns {Object} Random time with hours and minutes
 */
function generateRandomTime(onlySimpleTimes = false) {
    let minutes;
    
    if (onlySimpleTimes) {
        // Only use 0, 15, 30, 45 minutes for easier learning
        const simpleMinutes = [0, 15, 30, 45];
        minutes = randomChoice(simpleMinutes);
    } else {
        // Any 5-minute interval (0, 5, 10, 15, etc.)
        minutes = randomInt(0, 11) * 5;
    }
    
    const hours = randomInt(1, 12); // 1-12 for 12-hour format
    
    return {
        hours: hours,
        minutes: minutes
    };
}

// ===================================
// VALIDATION HELPERS
// Tools for checking if things are correct
// ===================================

/**
 * Check if a time answer is close enough to be considered correct
 * (Gives kids some wiggle room for small mistakes)
 * @param {Object} userTime - The time the user entered
 * @param {Object} correctTime - The correct answer
 * @param {number} tolerance - How many minutes off is still OK (default 2)
 * @returns {boolean} True if the answer is close enough
 */
function isTimeCloseEnough(userTime, correctTime, tolerance = 2) {
    const userMinutes = (userTime.hours * 60) + userTime.minutes;
    const correctMinutes = (correctTime.hours * 60) + correctTime.minutes;
    
    const difference = Math.abs(userMinutes - correctMinutes);
    
    // Handle day boundary (like 11:59 PM vs 12:01 AM)
    const dayDifference = Math.abs(difference - (24 * 60));
    
    return Math.min(difference, dayDifference) <= tolerance;
}

/**
 * Check if a number is within a range
 * @param {number} num - Number to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if number is in range
 */
function isInRange(num, min, max) {
    return num >= min && num <= max;
}

// ===================================
// ANIMATION HELPERS
// Tools for creating smooth animations
// ===================================

/**
 * Add an animation class to an element and remove it when done
 * @param {Element} element - Element to animate
 * @param {string} animationClass - CSS class with animation
 * @param {Function} callback - Function to call when animation is done (optional)
 */
function animateElement(element, animationClass, callback) {
    if (!element) return;
    
    // Add the animation class
    addClass(element, animationClass);
    
    // Listen for animation to finish
    const handleAnimationEnd = () => {
        removeClass(element, animationClass);
        element.removeEventListener('animationend', handleAnimationEnd);
        if (callback) callback();
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
}

/**
 * Wait for a specific amount of time (useful for delays)
 * @param {number} milliseconds - How long to wait
 * @returns {Promise} Promise that resolves after the delay
 */
function delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// ===================================
// AUDIO HELPERS
// Tools for playing sounds
// ===================================

/**
 * Play a sound effect (with error handling)
 * @param {string} soundId - ID of the audio element
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
function playSound(soundId, volume = 1.0) {
    try {
        const audio = getElement(soundId);
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, volume)); // Ensure valid volume
            audio.currentTime = 0; // Start from beginning
            audio.play().catch(error => {
                console.warn(`Could not play sound ${soundId}:`, error);
            });
        }
    } catch (error) {
        console.warn(`Error playing sound ${soundId}:`, error);
    }
}

// ===================================
// DEVICE DETECTION
// Tools for figuring out what device the app is running on
// ===================================

/**
 * Check if the device supports touch (like tablets and phones)
 * @returns {boolean} True if touch is supported
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Check if the screen is small (mobile phone size)
 * @returns {boolean} True if screen is mobile-sized
 */
function isMobileSize() {
    return window.innerWidth <= 480;
}

/**
 * Check if the screen is tablet-sized
 * @returns {boolean} True if screen is tablet-sized
 */
function isTabletSize() {
    const width = window.innerWidth;
    return width > 480 && width <= 768;
}

// ===================================
// ERROR HANDLING
// Tools for dealing with problems gracefully
// ===================================

/**
 * Safely try to do something, with a backup plan if it fails
 * @param {Function} tryFunction - Function to attempt
 * @param {Function} catchFunction - Function to run if first one fails
 * @param {string} errorMessage - Custom error message
 */
function safeExecute(tryFunction, catchFunction, errorMessage = 'An error occurred') {
    try {
        return tryFunction();
    } catch (error) {
        console.warn(errorMessage, error);
        if (catchFunction) {
            return catchFunction();
        }
    }
}

// ===================================
// EXPORT FOR OTHER FILES TO USE
// Make these functions available to other JavaScript files
// ===================================

// Create a global object to hold all our utilities
window.TimeQuestUtils = {
    // DOM helpers
    getElement,
    getElements,
    addClass,
    removeClass,
    hasClass,
    showElement,
    hideElement,
    
    // Time helpers
    convertTo12Hour,
    convertTo24Hour,
    padNumber,
    calculateClockAngles,
    calculateTimeFromAngles,
    
    // Random helpers
    randomInt,
    randomChoice,
    shuffleArray,
    generateRandomTime,
    
    // Validation helpers
    isTimeCloseEnough,
    isInRange,
    
    // Animation helpers
    animateElement,
    delay,
    
    // Audio helpers
    playSound,
    
    // Device detection
    isTouchDevice,
    isMobileSize,
    isTabletSize,
    
    // Error handling
    safeExecute
};

// Also create shorter aliases for common functions
window.$ = getElement; // Now you can use $('#my-id') instead of getElement('my-id')
window.$$ = getElements; // And $$('.my-class') instead of getElements('my-class')

console.log('✅ Time Quest Utils loaded successfully!');