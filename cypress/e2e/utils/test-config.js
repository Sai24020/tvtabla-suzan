// Test configuration for flexible student solution testing

export const TEST_CONFIG = {
  // Timing tolerances
  ANIMATION_TIMEOUT: 5000,
  LOAD_TIMEOUT: 10000, 
  THROTTLE_DELAY: 1000,
  
  // Tolerances for data validation
  LENGTH_TOLERANCE: 2, // Allow ±2 programs difference
  MATCH_RATIO_THRESHOLD: 0.8, // Accept if 80% of programs match
  TIME_FORMAT_THRESHOLD: 0.9, // Accept if 90% have valid time format
  
  // Selector fallbacks - ordered by preference
  SELECTORS: {
    MENU_BUTTON: [
      '.menu-icon > i.fas',
      '.menu-icon > i.fa', 
      '.menu-icon > i',
      '.menu-icon',
      '[class*="menu"] button',
      '[class*="menu"] i',
      'button[class*="menu"]',
      '.fas',
      '.fa'
    ],
    
    MENU: [
      '.menu',
      'nav.menu',
      '[class*="menu"]:not(.menu-icon)',
      'nav',
      '.navigation'
    ],
    
    HEADING: [
      'h1',
      '#js-title', 
      '[class*="title"]',
      '[class*="heading"]',
      'h2',
      'h3'
    ],
    
    LOADING_SPINNER: [
      '.loading-spinner',
      '#js-loading',
      '[class*="loading"]',
      '[class*="spinner"]',
      '[class*="load"]'
    ],
    
    MENU_ITEMS: [
      '.menu li',
      'nav li',
      '[class*="menu"] li',
      'li'
    ],
    
    PROGRAM_ITEMS: [
      '#js-schedule > ul > li.list-group-item:not(.show-previous)',
      '#js-schedule li:not(.show-previous)',
      '[class*="schedule"] li:not(.show-previous)',
      '[class*="schedule"] li',
      'ul li:not(.show-previous)',
      'ul li',
      'li:not(.show-previous)'
    ],
    
    SHOW_PREVIOUS_BUTTON: [
      'li.list-group-item.show-previous',
      '.show-previous',
      '[class*="previous"]',
      'button[class*="previous"]',
      'li[onclick*="previous"]'
    ]
  },
  
  // Animation detection methods
  ANIMATION_DETECTION: {
    POSITION_BASED: true,    // Check for changing left/transform positions
    CSS_TRANSITION: true,    // Check for CSS transition property
    CSS_CLASSES: true,       // Check for animation-related classes
    DURATION_MS: 200        // How long to watch for animations
  },
  
  // Data format flexibility
  DATA_PARSING: {
    TIME_FORMATS: [
      /^(\d{1,2}):(\d{2})$/,        // HH:MM or H:MM
      /^(\d{1,2})\.(\d{2})$/,       // HH.MM or H.MM  
      /^(\d{1,2})-(\d{2})$/,        // HH-MM or H-MM
      /(\d{1,2}):(\d{2})/,          // HH:MM anywhere in text
      /(\d{1,2})\.(\d{2})/,         // HH.MM anywhere in text
      /(\d{1,2})\s*:\s*(\d{2})/     // HH : MM with possible spaces
    ],
    
    // CSS classes that might indicate animation
    ANIMATION_CLASSES: [
      'animate', 'animation', 'animated',
      'transition', 'transitioning',
      'move', 'moving', 'slide', 'sliding',
      'show', 'hide', 'open', 'close'
    ]
  }
};

// Normalize time strings to handle different formats and ensure HH:MM format
export const normalizeTime = (timeStr) => {
  if (!timeStr) return '';
  
  // Remove extra whitespace
  const cleaned = timeStr.trim();
  
  // Try to extract time using regex patterns
  for (const pattern of TEST_CONFIG.DATA_PARSING.TIME_FORMATS) {
    const match = cleaned.match(pattern);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      
      // Validate time values
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      }
    }
  }
  
  // If no valid time pattern found, return empty string
  return '';
};

// Normalize program names to handle different text formatting
export const normalizeProgram = (programStr) => {
  if (!programStr) return '';
  // Remove extra whitespace and normalize
  return programStr.trim().replace(/\s+/g, ' ');
};

// Helper to parse program data flexibly but ensure HH:MM time format
export const parseProgramItem = ($element) => {
  const fullText = $element.text().trim();
  
  // Try different parsing methods
  if ($element.children().length >= 2) {
    // Method 1: Separate elements for time and program
    const timeText = $element.children().first().text().trim();
    const programText = $element.children().last().text().trim();
    return {
      start: normalizeTime(timeText),
      program: normalizeProgram(programText)
    };
  }
  
  if ($element.find('strong').length > 0) {
    // Method 2: Strong tag for time
    const timeText = $element.find('strong').text().trim();
    const programText = fullText.replace(timeText, '').trim();
    return { 
      start: normalizeTime(timeText), 
      program: normalizeProgram(programText)
    };
  }
  
  // Method 3: Parse from full text using regex
  for (const timeFormat of TEST_CONFIG.DATA_PARSING.TIME_FORMATS) {
    const match = fullText.match(timeFormat);
    if (match) {
      const timeText = match[0];
      const programText = fullText.replace(match[0], '').trim();
      return { 
        start: normalizeTime(timeText), 
        program: normalizeProgram(programText)
      };
    }
  }
  
  // Fallback: no time found
  return { start: '', program: normalizeProgram(fullText) };
};

// Helper to try multiple selectors until one works
export const trySelectors = (selectors, options = {}) => {
  return cy.get('body').then($body => {
    for (const selector of selectors) {
      const $elements = $body.find(selector);
      if ($elements.length > 0) {
        cy.log(`Using selector: ${selector}`);
        return cy.get(selector, options);
      }
    }
    // If no selector works, use the first one and let it fail with a clear message
    cy.log(`No elements found with any selector from: ${selectors.join(', ')}`);
    return cy.get(selectors[0], options);
  });
};

// Helper to detect animations using multiple methods
export const detectAnimation = ($element, elementName = 'element') => {
  let animationDetected = false;
  const positions = [];
  
  // Method 1: Position-based detection
  if (TEST_CONFIG.ANIMATION_DETECTION.POSITION_BASED) {
    const initialPosition = $element.css('left') || $element.css('transform');
    positions.push(initialPosition);
    
    // Check positions over time
    for (let i = 0; i < 10; i++) {
      cy.wait(20);
      cy.get($element.selector || $element).then($el => {
        const currentPosition = $el.css('left') || $el.css('transform');
        positions.push(currentPosition);
      });
    }
    
    cy.then(() => {
      const uniquePositions = [...new Set(positions)];
      if (uniquePositions.length > 1) {
        animationDetected = true;
        cy.log(`${elementName} animation detected via position changes`);
      }
    });
  }
  
  // Method 2: CSS transition detection
  if (TEST_CONFIG.ANIMATION_DETECTION.CSS_TRANSITION) {
    const transition = $element.css('transition');
    const animation = $element.css('animation');
    
    if ((transition && transition !== 'none') || (animation && animation !== 'none')) {
      animationDetected = true;
      cy.log(`${elementName} animation detected via CSS properties`);
    }
  }
  
  // Method 3: CSS class detection
  if (TEST_CONFIG.ANIMATION_DETECTION.CSS_CLASSES) {
    const classes = $element.attr('class') || '';
    const hasAnimationClass = TEST_CONFIG.DATA_PARSING.ANIMATION_CLASSES.some(
      animClass => classes.toLowerCase().includes(animClass)
    );
    
    if (hasAnimationClass) {
      animationDetected = true;
      cy.log(`${elementName} animation detected via CSS classes: ${classes}`);
    }
  }
  
  return animationDetected;
};