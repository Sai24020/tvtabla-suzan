// DOM Selectors Module
// Contains flexible selectors and helper functions for DOM element selection

import { TEST_CONFIG } from './test-config';

// Helper function to try multiple selectors until one works
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

// Improved selectors with fallbacks for different student implementations
export const getMenuButtonElem = () => {
  return cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU_BUTTON) {
      if ($body.find(selector).length > 0) {
        return cy.get(selector);
      }
    }
    return cy.get(TEST_CONFIG.SELECTORS.MENU_BUTTON[0]);
  });
};

export const getMenuElem = () => {
  return cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU) {
      if ($body.find(selector).length > 0) {
        return cy.get(selector);
      }
    }
    return cy.get(TEST_CONFIG.SELECTORS.MENU[0]);
  });
};

export const getHeadingElem = () => {
  return cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.HEADING) {
      if ($body.find(selector).length > 0) {
        return cy.get(selector);
      }
    }
    return cy.get(TEST_CONFIG.SELECTORS.HEADING[0]);
  });
};

export const getMenuItemElems = () => {
  return cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU_ITEMS) {
      if ($body.find(selector).length > 0) {
        return cy.get(selector);
      }
    }
    return cy.get(TEST_CONFIG.SELECTORS.MENU_ITEMS[0]);
  });
};

export const getInVisibleSpinner = () => {
  return cy.get('body').then($body => {
    const hiddenSelectors = [
      '.loading-spinner .hidden',
      '.hidden',
      '[style*="display: none"]'
    ];
    
    for (const selector of hiddenSelectors) {
      if ($body.find(selector).length > 0) {
        return cy.get(selector, { timeout: 10000 });
      }
    }
    return cy.get(hiddenSelectors[0], { timeout: 10000 });
  });
};

export const getSpinner = () => {
  return cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.LOADING_SPINNER) {
      if ($body.find(selector).length > 0) {
        return cy.get(selector);
      }
    }
    return cy.get(TEST_CONFIG.SELECTORS.LOADING_SPINNER[0]);
  });
};

export const getMenuItemElem = (index) => {
  return getMenuItemElems().then($items => {
    return cy.wrap($items).eq(index);
  });
};

// Get program items with flexible selectors
export const getProgramItemsElem = () => {
  return cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.PROGRAM_ITEMS) {
      if ($body.find(selector).length > 0) {
        cy.log(`Using program selector: ${selector}`);
        return cy.get(selector);
      }
    }
    cy.log(`No program items found with any selector`);
    return cy.get(TEST_CONFIG.SELECTORS.PROGRAM_ITEMS[0]);
  });
};

// Get show previous button with flexible selectors
export const getShowPreviousButton = () => {
  return cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.SHOW_PREVIOUS_BUTTON) {
      if ($body.find(selector).length > 0) {
        return cy.get(selector);
      }
    }
    // Return null if not found (some implementations might not have this)
    return null;
  });
};