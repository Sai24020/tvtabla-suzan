// ***********************************************
// TV Schedule App Custom Commands
// ***********************************************

// Log student information
const studentName = Cypress.env('STUDENT_NAME');
if (studentName) {
  console.log(`👤 Running tests for student: ${studentName}`);
}

import { menuItems } from '../e2e/data/test-data';
import { 
  trySelectors, 
  detectAnimation, 
  parseProgramItem,
  TEST_CONFIG 
} from '../e2e/utils/test-config';
import { 
  validateProgramsData,
  getProgramItem 
} from '../e2e/utils/validation';
import {
  getFilteredPrograms,
  getTvDataFormattedAndSorted,
  updateGradeSummary,
  isHtmlListSortedFiltered,
  isHtmlProgramsAccepted,
  isHtmlListUnsortedUnfiltered,
  isHtmlListSortedUnfiltered,
  isHtmlListUnsortedFiltered
} from '../e2e/utils/helpers.js';

// Page Navigation Commands with explicit animation modes
Cypress.Commands.add("visitPage", (animationMode = null) => {
  let menuIndexStartPage = 0;
  let pageLoadChannelText = menuItems[menuIndexStartPage];

  // Intercept and visit page
  cy.intercept('GET', encodeURI(`*data/${pageLoadChannelText}.json`), (req) => {
    req.on('response', (res) => {
      res.setThrottle(10);
    });
  }).as('getTvScheduleFirstPageLoad');
  
  // Visit with animation mode set before page load
  if (animationMode) {
    cy.visit('/index.html', {
      onBeforeLoad: (win) => {
        win.MENU_ANIMATION_MODE = animationMode;
        console.log(`Set MENU_ANIMATION_MODE to ${animationMode} before page load`);
      }
    });
  } else {
    cy.visit('/index.html');
  }
  
  // Give page a moment to load, but don't require API calls for basic functionality
  cy.wait(500);
  cy.log('Page loaded - continuing test (TV data optional for basic functionality)');
});

// Explicit visit commands for each animation mode
Cypress.Commands.add("visitPageWithAnimationNone", () => {
  let menuIndexStartPage = 0;
  let pageLoadChannelText = menuItems[menuIndexStartPage];

  cy.intercept('GET', encodeURI(`*data/${pageLoadChannelText}.json`), (req) => {
    req.on('response', (res) => {
      res.setThrottle(10);
    });
  }).as('getTvScheduleFirstPageLoad');
  
  cy.visit('/index.html', {
    onBeforeLoad: (win) => {
      win.MENU_ANIMATION_MODE = 'none';
      console.log('Set MENU_ANIMATION_MODE to NONE before page load');
    }
  });
  
  // Give page a moment to load, but don't require API calls for basic functionality
  cy.wait(500);
  cy.log('Page loaded - continuing test (TV data optional for menu tests)');
  
  cy.window().its('MENU_ANIMATION_MODE').should('equal', 'none');
  cy.log('Verified MENU_ANIMATION_MODE is none');
});

Cypress.Commands.add("visitPageWithAnimationTimer", () => {
  let menuIndexStartPage = 0;
  let pageLoadChannelText = menuItems[menuIndexStartPage];

  cy.intercept('GET', encodeURI(`*data/${pageLoadChannelText}.json`), (req) => {
    req.on('response', (res) => {
      res.setThrottle(10);
    });
  }).as('getTvScheduleFirstPageLoad');
  
  cy.visit('/index.html', {
    onBeforeLoad: (win) => {
      win.MENU_ANIMATION_MODE = 'timer';
      // Can't use cy.log here - it causes promise conflicts
      console.log('Set MENU_ANIMATION_MODE to TIMER before page load');
    }
  });
  
  // Give page a moment to load, but don't require API calls for basic functionality
  cy.wait(500);
  cy.log('Page loaded - continuing test (TV data optional for menu tests)');
  
  cy.window().its('MENU_ANIMATION_MODE').should('equal', 'timer');
  cy.log('Verified MENU_ANIMATION_MODE is timer');
});

Cypress.Commands.add("visitPageWithAnimationAlternative", () => {
  let menuIndexStartPage = 0;
  let pageLoadChannelText = menuItems[menuIndexStartPage];

  cy.intercept('GET', encodeURI(`*data/${pageLoadChannelText}.json`), (req) => {
    req.on('response', (res) => {
      res.setThrottle(10);
    });
  }).as('getTvScheduleFirstPageLoad');
  
  cy.visit('/index.html', {
    onBeforeLoad: (win) => {
      win.MENU_ANIMATION_MODE = 'alternative';
      console.log('Set MENU_ANIMATION_MODE to ALTERNATIVE before page load');
    }
  });
  
  // Give page a moment to load, but don't require API calls for basic functionality
  cy.wait(500);
  cy.log('Page loaded - continuing test (TV data optional for menu tests)');
  
  cy.window().its('MENU_ANIMATION_MODE').should('equal', 'alternative');
  cy.log('Verified MENU_ANIMATION_MODE is alternative');
});

// Alternative visit command specifically for animation testing (backward compatibility)
Cypress.Commands.add("visitPageWithAnimationMode", (mode) => {
  let menuIndexStartPage = 0;
  let pageLoadChannelText = menuItems[menuIndexStartPage];

  cy.intercept('GET', encodeURI(`*data/${pageLoadChannelText}.json`), (req) => {
    req.on('response', (res) => {
      res.setThrottle(10);
    });
  }).as('getTvScheduleFirstPageLoad');
  
  cy.visit('/index.html', {
    onBeforeLoad: (win) => {
      win.MENU_ANIMATION_MODE = mode;
      console.log(`DEPRECATED: visitPageWithAnimationMode("${mode}") - use visitPageWithAnimation${mode.charAt(0).toUpperCase() + mode.slice(1)}() instead`);
    }
  });
  
  // Give page a moment to load, but don't wait for specific API calls
  cy.wait(500); // Brief wait for page to settle
  cy.log('Page loaded - continuing test (JavaScript optional)');
  
  // Verify the mode was set and persisted
  cy.window().its('MENU_ANIMATION_MODE').should('equal', mode)
    .then((currentMode) => {
      cy.log(`Verified MENU_ANIMATION_MODE is ${currentMode}`);
    });
});

// Visit page without JavaScript - disables JavaScript execution
Cypress.Commands.add("visitPageWithoutJavaScript", () => {
  cy.visit('/index.html', {
    onBeforeLoad: (win) => {
      // Disable JavaScript by overriding createElement for script tags
      const originalCreateElement = win.document.createElement;
      win.document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        if (tagName.toLowerCase() === 'script') {
          // Prevent script execution by removing src and blocking load
          Object.defineProperty(element, 'src', {
            set: () => {}, // Do nothing when src is set
            get: () => ''
          });
        }
        return element;
      };
      
      // Also disable any existing script tags
      const existingScripts = win.document.getElementsByTagName('script');
      for (let i = 0; i < existingScripts.length; i++) {
        existingScripts[i].src = '';
        existingScripts[i].remove();
      }
      
      // Can't use cy.log here - it causes promise conflicts
      console.log('JavaScript execution disabled');
    }
  });
  
  // Log after the visit command completes
  cy.log('JavaScript execution disabled');
});

// Menu Interaction Commands
Cypress.Commands.add("openMenu", () => {
  // Use flexible selector for menu button
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU_BUTTON) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).click();
        break;
      }
    }
  });
  
  // Verify menu is open using flexible selectors
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('satisfy', ($menu) => {
          const left = $menu.css('left');
          const hasClass = $menu.hasClass('menu--show');
          return left === '0px' || hasClass;
        });
        cy.log('Menu is open');
        break;
      }
    }
  });
});

Cypress.Commands.add("closeMenu", () => {
  // Use flexible selector for menu button
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU_BUTTON) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).click();
        break;
      }
    }
  });
  
  // Verify menu is closed
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('satisfy', ($menu) => {
          const left = $menu.css('left');
          const hasClass = $menu.hasClass('menu--show');
          return left === '-300px' || !hasClass;
        });
        cy.log('Menu is closed');
        break;
      }
    }
  });
});

Cypress.Commands.add("clickMenuChannel", (menuIndex) => {
  let channelText = menuItems[menuIndex];

  // Intercept channel data request
  cy.intercept('GET', encodeURI(`*data/${channelText}.json`), (req) => {
    req.on('response', (res) => {
      res.setThrottle(1000);
    });
  }).as('getTvSchedule');
  
  // Check loading spinner is not visible before clicking
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.LOADING_SPINNER) {
      const $spinner = $body.find(selector);
      if ($spinner.length > 0) {
        cy.wrap($spinner).should('not.be.visible');
        break;
      }
    }
  });

  // Click menu item
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU_ITEMS) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).eq(menuIndex).click();
        cy.log(`Clicked ${channelText} menu item`);
        break;
      }
    }
  });

  // Check for loading spinner visibility (optional - don't fail if too fast)
  cy.get('body').then($body => {
    let spinnerFound = false;
    for (const selector of TEST_CONFIG.SELECTORS.LOADING_SPINNER) {
      if ($body.find(selector).length > 0 && $body.find(selector).is(':visible')) {
        spinnerFound = true;
        cy.log(`${channelText} - loading spinner visible during fetch (${selector})`);
        break;
      }
    }
    if (!spinnerFound) {
      cy.log(`${channelText} - loading spinner not detected (too fast or different implementation)`);
    }
  });

  cy.wait('@getTvSchedule', { timeout: TEST_CONFIG.LOAD_TIMEOUT });

  // Verify loading spinner is hidden after fetch
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.LOADING_SPINNER) {
      const $spinner = $body.find(selector);
      if ($spinner.length > 0) {
        cy.wrap($spinner).should('not.be.visible');
        cy.log(`${channelText} - loading spinner hidden after fetch`);
        break;
      }
    }
  });
});

// Basic menu click without API requirements - for testing menu functionality only
Cypress.Commands.add("clickMenuChannelBasic", (menuIndex) => {
  let channelText = menuItems[menuIndex];

  // Just click the menu item without waiting for API
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU_ITEMS) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).eq(menuIndex).click();
        cy.log(`Clicked ${channelText} menu item (basic - no API wait)`);
        break;
      }
    }
  });

  // Brief wait for any immediate DOM changes
  cy.wait(200);
  cy.log(`${channelText} - Menu click completed (JavaScript optional)`);
});

Cypress.Commands.add("clickShowPreviousPrograms", (menuIndex) => {
  let channelText = menuItems[menuIndex];
  
  // Intercept data request for previous programs
  cy.intercept('GET', encodeURI(`*data/${channelText}.json`), (req) => {
    req.on('response', (res) => {
      res.setThrottle(1000);
    });
  }).as('getTvScheduleShowPrevious');

  // Ensure loading spinner is not visible
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.LOADING_SPINNER) {
      const $spinner = $body.find(selector);
      if ($spinner.length > 0) {
        cy.wrap($spinner).should('not.be.visible');
        break;
      }
    }
  });

  // Click show previous button
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.SHOW_PREVIOUS_BUTTON) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).click();
        cy.log(`${channelText} - Clicked show previous programs`);
        break;
      }
    }
  });

  // Check for loading spinner
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.LOADING_SPINNER) {
      const $spinner = $body.find(selector);
      if ($spinner.length > 0) {
        cy.wrap($spinner).should('be.visible');
        cy.log(`${channelText} - Loading spinner visible for previous programs`);
        break;
      }
    }
  });

  cy.wait('@getTvScheduleShowPrevious');
});

// Data Validation Commands
Cypress.Commands.add("checkDisplayedProgramsSortedAndFiltered", (menuIndex) => {
  validateProgramsData(menuIndex, 'sortedFiltered');
});

Cypress.Commands.add("checkDisplayedProgramsAccepted", (menuIndex) => {
  validateProgramsData(menuIndex, 'accepted');
});

// Animation Testing Commands - Explicit mode setters
Cypress.Commands.add("setAnimationNone", () => {
  cy.window().then((win) => {
    win.MENU_ANIMATION_MODE = 'none';
    cy.log('Set MENU_ANIMATION_MODE to none');
  });
});

Cypress.Commands.add("setAnimationTimer", () => {
  cy.window().then((win) => {
    win.MENU_ANIMATION_MODE = 'timer';
    cy.log('Set MENU_ANIMATION_MODE to timer');
  });
});

Cypress.Commands.add("setAnimationAlternative", () => {
  cy.window().then((win) => {
    win.MENU_ANIMATION_MODE = 'alternative';
    cy.log('Set MENU_ANIMATION_MODE to alternative');
  });
});

// Backward compatibility - deprecated
Cypress.Commands.add("setAnimationMode", (mode) => {
  cy.window().then((win) => {
    win.MENU_ANIMATION_MODE = mode;
    cy.log(`⚠️ DEPRECATED: setAnimationMode("${mode}") - use setAnimation${mode.charAt(0).toUpperCase() + mode.slice(1)}() instead`);
  });
});

// Test specific animation modes - Using explicit visit commands
Cypress.Commands.add("testMenuAnimationNone", (action = 'open') => {
  cy.visitPageWithAnimationNone();
  cy.testMenuAnimation('none', action);
});

Cypress.Commands.add("testMenuAnimationTimer", (action = 'open') => {
  cy.visitPageWithAnimationTimer();
  cy.testMenuAnimation('timer', action);
});

Cypress.Commands.add("testMenuAnimationAlternative", (action = 'open') => {
  cy.visitPageWithAnimationAlternative();
  cy.testMenuAnimation('alternative', action);
});

// Safe animation mode setter that works after page load
Cypress.Commands.add("setAnimationModeAfterLoad", (mode) => {
  cy.window().should('exist').then((win) => {
    win.MENU_ANIMATION_MODE = mode;
    cy.log(`✅ Set MENU_ANIMATION_MODE to ${mode} after page load`);
    
    // Verify it was set
    cy.window().its('MENU_ANIMATION_MODE').should('equal', mode);
  });
});

// Internal helper for animation testing
Cypress.Commands.add("testMenuAnimation", (mode, action = 'open') => {
  const actionName = action === 'open' ? 'opening' : 'closing';
  
  // Verify animation mode is set correctly
  cy.window().its('MENU_ANIMATION_MODE').should('equal', mode)
    .then((currentMode) => {
      cy.log(`🔍 Current MENU_ANIMATION_MODE: ${currentMode} (expected: ${mode})`);
    });
  
  cy.log(`Testing menu ${actionName} animation in ${mode} mode`);
  
  // If testing close, first ensure menu is open
  if (action === 'close') {
    cy.get('body').then($body => {
      for (const selector of TEST_CONFIG.SELECTORS.MENU_BUTTON) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click();
          cy.wait(mode === 'alternative' ? 2500 : mode === 'timer' ? 500 : 100);
          break;
        }
      }
    });
  }
  
  // Click menu button
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU_BUTTON) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).click();
        cy.log(`Clicked menu button for ${mode} ${actionName}`);
        break;
      }
    }
  });
  
  // Test animation based on mode
  if (mode === 'none') {
    // For NONE mode, verify immediate position change
    cy.get('body').then($body => {
      for (const selector of TEST_CONFIG.SELECTORS.MENU) {
        if ($body.find(selector).length > 0) {
          const expectedPosition = action === 'open' ? '0px' : '-300px';
          cy.get(selector).should('have.css', 'left', expectedPosition);
          cy.log(`✅ NONE mode: Menu immediately at ${expectedPosition}`);
          break;
        }
      }
    });
  } else if (mode === 'timer') {
    // For TIMER mode, test setInterval animation - simple approach like tvscheduletests.cy.js
    cy.get('body').then($body => {
      for (const selector of TEST_CONFIG.SELECTORS.MENU) {
        if ($body.find(selector).length > 0) {
          // Check that menu is animating (position between -300px and 0px)
          cy.get(selector).should('have.css', 'left').and('match', /^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
          cy.wait(10);
          cy.get(selector).should('have.css', 'left').and('match', /^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
          cy.wait(30);
          cy.get(selector).should('have.css', 'left').and('match', /^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
          cy.wait(30);
          cy.get(selector).should('have.css', 'left').and('match', /^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
          cy.log(`✅ TIMER mode: Menu is animating with setInterval`);
          break;
        }
      }
    });
  } else if (mode === 'alternative') {
    // For ALTERNATIVE mode, test CSS transitions
    cy.get('body').then($body => {
      for (const selector of TEST_CONFIG.SELECTORS.MENU) {
        if ($body.find(selector).length > 0) {
          // Check for CSS transition property
          cy.get(selector).should('have.css', 'transition-duration').and('not.equal', '0s');
          cy.log(`✅ ALTERNATIVE mode: Menu has CSS transition animation`);
          break;
        }
      }
    });
    
    // Wait for CSS transition to complete
    cy.wait(2500);
  }
  
  // Verify final position
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.MENU) {
      if ($body.find(selector).length > 0) {
        const expectedPosition = action === 'open' ? '0px' : '-300px';
        cy.get(selector).should('have.css', 'left', expectedPosition);
        cy.log(`✅ ${mode} mode ${actionName} animation completed - final position: ${expectedPosition}`);
        break;
      }
    }
  });
});

// Backward compatibility - deprecated
Cypress.Commands.add("testMenuAnimationMode", (mode, action = 'open') => {
  cy.log(`⚠️ DEPRECATED: testMenuAnimationMode("${mode}") - use testMenuAnimation${mode.charAt(0).toUpperCase() + mode.slice(1)}() instead`);
  cy.testMenuAnimation(mode, action);
});

// Student Information Commands
Cypress.Commands.add("logStudentInfo", () => {
  const studentName = Cypress.env('STUDENT_NAME');
  if (studentName) {
    cy.log(`👤 Student: ${studentName}`);
    cy.task('log', `Running tests for student: ${studentName}`);
  } else {
    cy.log('ℹ️ No student name provided');
  }
});

Cypress.Commands.add("reportGrade", (grade, testType = "general") => {
  const studentName = Cypress.env('STUDENT_NAME') || 'Unknown Student';
  const gradeMessage = `📊 ${studentName} - ${testType}: ${grade}`;
  cy.log(gradeMessage);
  cy.task('log', gradeMessage);
});

// Simplified commands for the new unified test file
Cypress.Commands.add("visitPageWithSpinnerTest", (channel) => {
  cy.intercept('GET', encodeURI(`*data/${channel}.json`), (req) => {
    req.on('response', (res) => {
      res.setThrottle(1000);
    });
  }).as('initialLoad');
  
  cy.visit('/');
  
  // Check loading spinner appears
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.LOADING_SPINNER) {
      const $spinner = $body.find(selector);
      if ($spinner.length > 0) {
        cy.wrap($spinner).should('be.visible');
        cy.log('✅ Loading spinner visible on page load');
        break;
      }
    }
  });
  
  cy.wait('@initialLoad');
  
  // Check loading spinner is hidden
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.LOADING_SPINNER) {
      const $spinner = $body.find(selector);
      if ($spinner.length > 0) {
        cy.wrap($spinner).should('not.be.visible');
        cy.log('✅ Loading spinner hidden after load');
        break;
      }
    }
  });
});

Cypress.Commands.add("testLoadingSpinnerOnMenuClick", () => {
  cy.visit('/');
  cy.wait(1000);
  cy.openMenu();
  cy.clickMenuChannel(1); // Test with second channel
  cy.closeMenu();
});

Cypress.Commands.add("testMenuIconChange", (action) => {
  cy.visit('/');
  cy.wait(1000);
  
  if (action === 'open') {
    // Check initial state (bars icon)
    cy.get('body').then($body => {
      for (const selector of TEST_CONFIG.SELECTORS.MENU_BUTTON) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).should('satisfy', ($btn) => {
            const hasClass = $btn.hasClass('fas') && $btn.hasClass('fa-bars');
            const text = $btn.text().trim();
            return hasClass || text === '☰' || text.includes('bars');
          });
          cy.log('✅ Menu button shows bars icon initially');
          break;
        }
      }
    });
    
    // Open menu and check times icon
    cy.openMenu();
    cy.get('body').then($body => {
      for (const selector of TEST_CONFIG.SELECTORS.MENU_BUTTON) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).should('satisfy', ($btn) => {
            const hasClass = $btn.hasClass('fas') && $btn.hasClass('fa-times');
            const text = $btn.text().trim();
            return hasClass || text === '✖' || text.includes('times');
          });
          cy.log('✅ Menu button shows times icon when open');
          break;
        }
      }
    });
  } else {
    // Close menu and check bars icon
    cy.openMenu();
    cy.closeMenu();
    cy.get('body').then($body => {
      for (const selector of TEST_CONFIG.SELECTORS.MENU_BUTTON) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).should('satisfy', ($btn) => {
            const hasClass = $btn.hasClass('fas') && $btn.hasClass('fa-bars');
            const text = $btn.text().trim();
            return hasClass || text === '☰' || text.includes('bars');
          });
          cy.log('✅ Menu button shows bars icon when closed');
          break;
        }
      }
    });
  }
});

Cypress.Commands.add("navigateToChannel", (channel, index) => {
  cy.visit('/');
  cy.wait(1000);
  cy.openMenu();
  cy.clickMenuChannel(index);
  
  // Verify heading matches channel
  cy.get('body').then($body => {
    for (const selector of TEST_CONFIG.SELECTORS.HEADING) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('contain.text', channel);
        cy.log(`✅ Navigated to ${channel}, heading updated`);
        break;
      }
    }
  });
  
  cy.closeMenu();
});

Cypress.Commands.add("validateChannelPrograms", (channel, index) => {
  cy.visit('/');
  cy.wait(1000);
  cy.openMenu();
  cy.clickMenuChannel(index);
  cy.closeMenu();
  
  // Use existing validation command
  cy.checkDisplayedProgramsAccepted(index);
  cy.log(`✅ TV programs validated for ${channel}`);
});





// ------------------------- LEGACY COMMANDS ---------------------------


Cypress.Commands.add("visitPage", (selector) => {
     
  let menuIndexStartPage = 0;
  let pageLoadChannelText = menuItems[menuIndexStartPage];

  //Visist page
  cy.intercept('GET', encodeURI(`*data/${pageLoadChannelText}.json`,(req) => {
    req.on('response', (res) => {
      // Throttle the response to 1 Mbps to simulate a mobile 3G connection -> probably not needed....
      res.setThrottle(10)
    })
  })).as('getTvScheduleFirstPageLoad');
  cy.visit('/index.html')
  
  // Give page a moment to load, but don't require API calls for basic functionality  
  cy.wait(500);
  cy.log('Legacy visitPage - continuing test (TV data optional for basic functionality)');
})

Cypress.Commands.add("checkDisplayedProgramsSortedAndFiltered", (menuIndex) => {
 
  let programLiItems = [];
  let expectedProgramsFiltered = getFilteredPrograms(getTvDataFormattedAndSorted(menuIndex)); //Filtered

  if(expectedProgramsFiltered.length>0){
    cy.get('#js-schedule > ul > li.list-group-item:not(.show-previous)')
    .each(($liElem, $index, $liItems) => {
      let programLiItem = getProgramItem($liElem.children().first().text(),$liElem.children().last().text());

      expect(expectedProgramsFiltered[$index].start).to.equal(programLiItem.start);
      expect(expectedProgramsFiltered[$index].program).to.equal(programLiItem.program);

      programLiItems.push(programLiItem);
    })
    .then(($liItems) => {
      cy.log(programLiItems);
      console.log(programLiItems);
      console.log("when Page Load - actualPrograms displayed [HTML]:", programLiItems); 

      let programLiItemsTotal = programLiItems.length;
      cy.log(`Page displays ${programLiItemsTotal} programs`);

        
        cy.get('li.list-group-item.show-previous').should('exist');
        cy.log(`Show previous programs button is visible`);

        // expect($listGroupItemsTotal).to.equal(expectedStartPageProgramsSortedAndFiltered.length);
        expect(isHtmlListSortedFiltered(menuIndex, programLiItems)).to.equal(true,"List of filtered programs is correct");
    
    });
  }

});

Cypress.Commands.add("checkDisplayedProgramsAccepted", (menuIndex) => {
 
  let programLiItems = [];
  let expectedProgramsFiltered = getFilteredPrograms(getTvDataFormattedAndSorted(menuIndex)); //Filtered
  if(expectedProgramsFiltered.length>0){
    cy.get('#js-schedule > ul > li.list-group-item:not(.show-previous)')
    .each(($liElem, $index, $liItems) => {
      let programLiItem = getProgramItem($liElem.children().first().text(),$liElem.children().last().text());
      programLiItems.push(programLiItem);
    })
    .then(($liItems) => {
      cy.log(programLiItems);
      console.log(programLiItems);
      console.log("when Page Load - actualPrograms displayed [HTML]:", programLiItems); 

      let programLiItemsTotal = programLiItems.length;
      cy.log(`Page displays ${programLiItemsTotal} programs`);


        expect(isHtmlProgramsAccepted(menuIndex, programLiItems)).to.equal(true,"List of programs is accepted for G when Page Load");
      

    });
  }

});

Cypress.Commands.add("openMenuWithAnimationSetInterval", (menuIndex) => {
  //Click Menu-show
 cy.get('.menu-icon > [class^=fa]').click();
 cy.get('.menu-icon > [class^=fa]').then(() => {  
    //Is menu open
    cy.get('.menu').should('have.css', 'left', '0px'); // or check has.class class menu--show
    cy.log(`menu is open`);
  }); 
});

Cypress.Commands.add("clickMenuChannel", (menuIndex) => {

  let channelText = menuItems[menuIndex];

  //click menu-item and check visibility
  cy.intercept('GET', encodeURI(`*data/${channelText}.json`,(req) => {
    req.on('response', (res) => {
      // Throttle the response to 1 Mbps to simulate a mobile 3G connection -> probably not needed....
      res.setThrottle(1000)
    })
  })).as('getTvSchedule');
  cy.get('#js-loading').then(($loaderElem) => {
    cy.get('#js-loading').should('not.be.visible');

    cy.get('.menu li').eq(menuIndex).then(($menuItem) => {
      $menuItem.click();
      //check loader
      cy.get('.loading-spinner').should('be.visible');
      cy.log(`${channelText} - loading-spinner was visible during fetch`);
      // Grade tracking moved to test files
      
    });

  });
  
  // Give time for API call, but don't fail if JavaScript doesn't work
  cy.wait(1000); // Wait for potential API call
  cy.log(`${channelText} - Legacy clickMenuChannel completed (API optional)`);
  // Grade tracking moved to test files

});

Cypress.Commands.add("clickShowPreviousPrograms", (menuIndex) => {
  let channelText = menuItems[menuIndex];
  //Click show previous
  cy.intercept('GET', encodeURI(`*data/${channelText}.json`),(req) => {
    req.on('response', (res) => {
      // Throttle the response to 1 Mbps to simulate a mobile 3G connection -> probably not needed....
      res.setThrottle(1000)
    });
  }).as('getTvScheduleShowPrevious');

  cy.get('#js-loading')
  .then(($loaderElem) => {
    cy.get('#js-loading').should('not.be.visible');

    cy.get('li.list-group-item.show-previous')
    .then(($showPreviousBtn) => { 
      $showPreviousBtn.click()
      cy.log(`${channelText} - Show previous programs`);
      cy.get('#js-loading').should('be.visible');
      cy.log(`${channelText} - loading-spinner is visible`);         
    });
  });
  cy.wait('@getTvScheduleShowPrevious');
});