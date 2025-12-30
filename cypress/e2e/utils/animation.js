// Animation Testing Module
// Contains functions for detecting and validating different types of animations

import { TEST_CONFIG } from './test-config';

// Main animation detection function
export const detectAnimation = ($element, elementName = 'element') => {
  let animationDetected = false;
  const positions = [];
  
  cy.log(`Detecting animation for ${elementName}`);
  
  // Method 1: Position-based detection
  if (TEST_CONFIG.ANIMATION_DETECTION.POSITION_BASED) {
    animationDetected = detectPositionBasedAnimation($element, elementName, positions) || animationDetected;
  }
  
  // Method 2: CSS transition detection
  if (TEST_CONFIG.ANIMATION_DETECTION.CSS_TRANSITION) {
    animationDetected = detectCSSAnimation($element, elementName) || animationDetected;
  }
  
  // Method 3: CSS class detection
  if (TEST_CONFIG.ANIMATION_DETECTION.CSS_CLASSES) {
    animationDetected = detectClassBasedAnimation($element, elementName) || animationDetected;
  }
  
  if (animationDetected) {
    cy.log(`${elementName} animation detected successfully`);
  } else {
    cy.log(`${elementName} animation not detected - may be too fast or use different method`);
  }
  
  return animationDetected;
};

// Detect position-based animations (setInterval, requestAnimationFrame)
const detectPositionBasedAnimation = ($element, elementName, positions) => {
  const initialPosition = $element.css('left') || $element.css('transform') || '0px';
  positions.push(initialPosition);
  
  // Check positions over time
  const checks = 8;
  const interval = TEST_CONFIG.ANIMATION_DETECTION.DURATION_MS / checks;
  
  for (let i = 0; i < checks; i++) {
    cy.wait(interval);
    cy.get($element.selector || $element).then($el => {
      const currentPosition = $el.css('left') || $el.css('transform') || '0px';
      positions.push(currentPosition);
    });
  }
  
  return cy.then(() => {
    const uniquePositions = [...new Set(positions)];
    const hasPositionChanges = uniquePositions.length > 1;
    
    // Check for intermediate positions (not just start and end)
    const hasIntermediatePositions = positions.some(pos => {
      if (pos.includes('px')) {
        const pixelValue = parseInt(pos);
        return pixelValue > -300 && pixelValue < 0 && pixelValue !== 0 && pixelValue !== -300;
      }
      return false;
    });

    if (hasPositionChanges || hasIntermediatePositions) {
      cy.log(`${elementName} animation detected via position changes`);
      cy.log(`Positions detected: ${uniquePositions.join(', ')}`);
      return true;
    }
    
    return false;
  });
};

// Detect CSS-based animations (transitions, keyframes)
const detectCSSAnimation = ($element, elementName) => {
  const transition = $element.css('transition');
  const animation = $element.css('animation');
  const transform = $element.css('transform');
  
  if (transition && transition !== 'none' && transition !== '') {
    cy.log(`${elementName} animation detected via CSS transition: ${transition}`);
    return true;
  }
  
  if (animation && animation !== 'none' && animation !== '') {
    cy.log(`${elementName} animation detected via CSS animation: ${animation}`);
    return true;
  }
  
  if (transform && transform !== 'none' && transform !== '') {
    cy.log(`${elementName} transform detected: ${transform}`);
    // Transform alone doesn't guarantee animation, but it's a good indicator
  }
  
  return false;
};

// Detect class-based animations
const detectClassBasedAnimation = ($element, elementName) => {
  const classes = $element.attr('class') || '';
  const hasAnimationClass = TEST_CONFIG.DATA_PARSING.ANIMATION_CLASSES.some(
    animClass => classes.toLowerCase().includes(animClass.toLowerCase())
  );
  
  if (hasAnimationClass) {
    cy.log(`${elementName} animation detected via CSS classes: ${classes}`);
    return true;
  }
  
  return false;
};

// Enhanced menu animation testing with multiple detection methods
export const testMenuAnimation = (action = 'open') => {
  const actionName = action === 'open' ? 'opening' : 'closing';
  
  cy.get('body').then($body => {
    // Find menu element using flexible selectors
    let $menu = null;
    for (const selector of TEST_CONFIG.SELECTORS.MENU) {
      const $menuElement = $body.find(selector);
      if ($menuElement.length > 0) {
        $menu = $menuElement;
        break;
      }
    }
    
    if (!$menu) {
      cy.log(`Menu element not found for ${actionName} animation test`);
      return false;
    }
    
    cy.log(`Testing menu ${actionName} animation`);
    
    // Record initial state
    const initialLeft = $menu.css('left');
    const initialClasses = $menu.attr('class') || '';
    
    cy.log(`Initial menu state - Left: ${initialLeft}, Classes: ${initialClasses}`);
    
    // Detect animation using multiple methods
    return detectAnimation($menu, `menu ${actionName}`);
  });
};

// Test for specific setInterval animation patterns (enhanced)
export const testSetIntervalAnimation = ($element, elementName) => {
  const positions = [];
  const expectedDirection = elementName.includes('open') ? 'increasing' : 'decreasing';
  const startPosition = elementName.includes('open') ? -300 : 0;
  const endPosition = elementName.includes('open') ? 0 : -300;
  
  cy.log(`Testing setInterval animation for ${elementName}`);
  cy.log(`Expected direction: ${expectedDirection} (${startPosition}px → ${endPosition}px)`);
  
  // Sample positions more frequently and for longer duration for setInterval detection
  const sampleCount = 20;
  const sampleInterval = 15; // ms between samples
  
  for (let i = 0; i < sampleCount; i++) {
    cy.wait(sampleInterval);
    cy.get($element.selector || $element).then($el => {
      const left = $el.css('left');
      if (left && left.includes('px')) {
        const pixelValue = parseInt(left);
        positions.push(pixelValue);
        if (i % 5 === 0) { // Log every 5th position
          cy.log(`Position sample ${i}: ${pixelValue}px`);
        }
      }
    });
  }
  
  return cy.then(() => {
    if (positions.length < 3) {
      cy.log('Not enough position samples collected');
      return false;
    }
    
    // Analyze position changes
    let increasingCount = 0;
    let decreasingCount = 0;
    let intermediatePositions = 0;
    
    for (let i = 1; i < positions.length; i++) {
      if (positions[i] > positions[i-1]) increasingCount++;
      if (positions[i] < positions[i-1]) decreasingCount++;
      
      // Count positions between start and end (indicating animation in progress)
      const pos = positions[i];
      if (pos > Math.min(startPosition, endPosition) && pos < Math.max(startPosition, endPosition)) {
        intermediatePositions++;
      }
    }
    
    const totalChanges = increasingCount + decreasingCount;
    const hasMovement = totalChanges > 0;
    const correctDirection = expectedDirection === 'increasing' ? 
      increasingCount > decreasingCount : 
      decreasingCount > increasingCount;
    
    const hasIntermediatePositions = intermediatePositions > 0;
    const smoothAnimation = totalChanges > positions.length * 0.3; // At least 30% of samples show movement
    
    cy.log(`Animation analysis for ${elementName}:`);
    cy.log(`- Total position changes: ${totalChanges}/${positions.length}`);
    cy.log(`- Increasing: ${increasingCount}, Decreasing: ${decreasingCount}`);
    cy.log(`- Intermediate positions: ${intermediatePositions}`);
    cy.log(`- Position range: ${Math.min(...positions)}px to ${Math.max(...positions)}px`);
    cy.log(`- Expected range: ${startPosition}px to ${endPosition}px`);
    
    if (hasMovement && correctDirection && (hasIntermediatePositions || smoothAnimation)) {
      cy.log(`✅ ${elementName} setInterval animation detected successfully`);
      cy.log(`Sample positions: [${positions.slice(0, 8).join(', ')}${positions.length > 8 ? '...' : ''}]`);
      return true;
    } else {
      cy.log(`❌ ${elementName} setInterval animation not detected`);
      cy.log(`hasMovement: ${hasMovement}, correctDirection: ${correctDirection}`);
      cy.log(`hasIntermediatePositions: ${hasIntermediatePositions}, smoothAnimation: ${smoothAnimation}`);
      return false;
    }
  });
};

// Test CSS transition animation (enhanced)
export const testCSSTransitionAnimation = ($element, elementName) => {
  cy.log(`Testing CSS transition animation for ${elementName}`);
  
  const transition = $element.css('transition');
  const transitionDuration = $element.css('transition-duration');
  const transitionProperty = $element.css('transition-property');
  const transitionTimingFunction = $element.css('transition-timing-function');
  
  cy.log(`CSS Properties for ${elementName}:`);
  cy.log(`- transition: ${transition}`);
  cy.log(`- transition-duration: ${transitionDuration}`);
  cy.log(`- transition-property: ${transitionProperty}`);
  cy.log(`- transition-timing-function: ${transitionTimingFunction}`);
  
  const hasTransition = transition && transition !== 'none' && transition !== '';
  const hasDuration = transitionDuration && transitionDuration !== '0s' && transitionDuration !== '';
  const hasRelevantProperty = transitionProperty && (
    transitionProperty.includes('left') || 
    transitionProperty.includes('all') ||
    transitionProperty.includes('transform')
  );
  
  // Additional check for shorthand transition property
  const hasShorthandTransition = transition && (
    transition.includes('left') || 
    transition.includes('all') ||
    transition.includes('ease') ||
    transition.includes('linear') ||
    /\d+s/.test(transition) // Contains duration in seconds
  );
  
  const transitionDetected = hasTransition && (hasDuration || hasRelevantProperty || hasShorthandTransition);
  
  if (transitionDetected) {
    cy.log(`✅ ${elementName} CSS transition animation detected:`);
    cy.log(`- Has transition: ${hasTransition}`);
    cy.log(`- Has duration: ${hasDuration} (${transitionDuration})`);
    cy.log(`- Has relevant property: ${hasRelevantProperty} (${transitionProperty})`);
    cy.log(`- Has shorthand transition: ${hasShorthandTransition}`);
    return true;
  } else {
    cy.log(`❌ ${elementName} CSS transition animation not detected`);
    cy.log(`- Has transition: ${hasTransition}`);
    cy.log(`- Has duration: ${hasDuration}`);
    cy.log(`- Has relevant property: ${hasRelevantProperty}`);
    return false;
  }
};