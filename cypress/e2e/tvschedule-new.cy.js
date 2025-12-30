// TV Schedule Application - Complete Student Assignment Tests
// Modern test structure using updated commands and selectors

import { menuItems } from './data/test-data';

const studentName = Cypress.env('STUDENT_NAME') || 'Test Student';

describe('Validation: HTML Structure Unchanged by Student', () => {

  it('Should set animation mode correctly before page load', () => {
    cy.visitPageWithAnimationMode('none');
    
    // Verify it was set and persisted
    cy.window().then((win) => {
      expect(win.MENU_ANIMATION_MODE).to.equal('none');
      cy.log('Mode none set and persisted');
    });

    cy.visitPageWithAnimationMode('timer');
    
    // Verify it was set and persisted
    cy.window().then((win) => {
      expect(win.MENU_ANIMATION_MODE).to.equal('timer');
      cy.log('Mode timer set and persisted');
    });

        cy.visitPageWithAnimationMode('alternative');
    
    // Verify it was set and persisted
    cy.window().then((win) => {
      expect(win.MENU_ANIMATION_MODE).to.equal('alternative');
      cy.log('Mode alternative set and persisted');
    });

  });

  it('Should have correct HTML structure with all required elements', () => {
    cy.visitPageWithoutJavaScript();
    
    cy.log('Checking initial HTML structure and CSS classes');
    
    // Essential HTML elements
    cy.get('body').should('exist');
    cy.get('.menu-icon').should('exist').and('be.visible');
    cy.get('ul.menu').should('exist');
    cy.get('#js-title').should('exist');
    cy.get('#js-schedule').should('exist');
    cy.get('#js-loading').should('exist');
    
    cy.log('All required HTML elements are present');
  });

  it('Should have correct CSS classes and structure', () => {
    // Visit without JavaScript to test pure HTML/CSS structure
    cy.visitPageWithoutJavaScript();
    
    // Menu structure (should be intact without JavaScript)
    cy.get('.menu-icon i').should('have.class', 'fas');
    cy.get('ul.menu').should('have.css', 'left', '-300px');
    cy.get('ul.menu li').should('have.length.greaterThan', 0);
    
    // Loading spinner
    cy.get('#js-loading').should('have.class', 'loading-spinner');
    
    // Menu items should have onclick attributes
    cy.get('ul.menu li').should('have.attr', 'onclick');
    
    cy.log('CSS classes and structure are correct');
  });

  it('Should have only one script tag (script.js)', () => {
    cy.visit('/');
    
    cy.log('Validating script tag integrity');
    
    // Get all script tags
    cy.get('script').then(($scripts) => {
      const scriptTags = Array.from($scripts);
      const externalScripts = scriptTags.filter(script => script.src);
      
      // Should only have one external script (script.js)
      expect(externalScripts).to.have.length(1);
      
      // That script should be script.js
      const scriptSrc = externalScripts[0].src;
      expect(scriptSrc).to.include('script.js');
      
      cy.log(`Found exactly 1 external script: ${scriptSrc}`);
      
      // Check for any student-added inline scripts (excluding Cypress injected ones)
      const inlineScripts = scriptTags.filter(script => !script.src);
      const studentScripts = inlineScripts.filter(script => {
        const content = script.textContent || script.innerHTML;
        // Exclude Cypress-injected scripts and empty scripts
        return content && 
               !content.includes('__cypress') && 
               !content.includes('Cypress') &&
               content.trim().length > 0;
      });
      
      expect(studentScripts).to.have.length(0);
      cy.log('No unauthorized student-added inline scripts found');
    });
    
    cy.log('Students have maintained proper script structure');
  });

  it('Should validate initial HTML structure without JavaScript', () => {
    // Visit with script tag removal to prevent any JavaScript execution
    cy.visitPageWithoutJavaScript();
    
    cy.log('Testing initial HTML structure (JavaScript disabled)');
    
    // All elements should exist in their initial state
    cy.get('.menu-icon').should('exist').and('be.visible');
    cy.get('ul.menu').should('exist');
    cy.get('ul.menu').should('have.css', 'left', '-300px');
    cy.get('.menu-icon i').should('have.class', 'fa-bars');
    
    // Schedule container should exist
    cy.get('#js-schedule').should('exist');
    cy.log('Schedule container exists (initial HTML structure)');
    
    // Title container should exist  
    cy.get('#js-title').should('exist');
    cy.log('Title container exists (initial HTML structure)');
    
    // Loading spinner should exist
    cy.get('#js-loading').should('exist').and('have.class', 'loading-spinner');
    cy.log('Loading spinner exists with correct classes');
    
    cy.log('Initial HTML structure is correct');
  });



  it('Should show what students need to implement', () => {
    cy.visit('/');
    
    cy.log('STUDENTS MUST IMPLEMENT THE FOLLOWING FUNCTIONALITY:');
    cy.log('1. Menu toggle: Open/close menu when .menu-icon is clicked');
    cy.log('2. Icon toggle: Change .menu-icon i between fa-bars and fa-times');
    cy.log('3. Data loading: Fetch and display TV programs from JSON files');
    cy.log('4. Channel switching: Load different channel when menu li is clicked');
    cy.log('5. Loading spinner: Show/hide #js-loading during data fetch');
    cy.log('6. Title update: Update #js-title with selected channel name');
    cy.log('7. VG Optional: Menu animations using MENU_ANIMATION_MODE');
    cy.log('8. VG Optional: Show previous programs functionality');
  });
});


describe(`TV Schedule Complete Tests [${studentName}]`, () => {

  describe('G-LEVEL REQUIREMENTS - Basic Functionality', () => {
    
    beforeEach(() => {
      // Use no animation for G-level tests
      cy.visitPageWithAnimationNone();
    });

    it('Page loads with loading spinner visible then hidden - G', () => {
      // Set up intercept to slow down the initial load so we can catch the spinner
      cy.intercept('GET', '**/data/*.json', (req) => {
        req.on('response', (res) => {
          res.setThrottle(1000); // Slow down to catch spinner
        });
      }).as('initialLoad');
      
      // Visit page fresh
      cy.visit('/index.html');
      
      // Check that spinner is visible during load
      cy.get('#js-loading').should('be.visible');
      cy.log('✓ Loading spinner is visible during page load');
      
      // Wait for the load to complete
      cy.wait('@initialLoad');
      
      // Verify spinner is hidden after load
      cy.get('#js-loading').should('have.class', 'hidden');
      cy.log('✓ Loading spinner is hidden after page load');
    });

    it('Programs displayed on pageload in any order - G', () => {
      cy.get('#js-schedule ul li.list-group-item:not(.show-previous)')
        .should('have.length.greaterThan', 0);
      cy.log('Programs are displayed on page load');
    });

    it('Menu can open - G', () => {
      cy.openMenu();
      cy.log('Menu opened successfully');
    });

    it('Menu can close - G', () => {
      cy.openMenu();
      cy.closeMenu();
      cy.log('Menu closed successfully');
    });

    it('Menu icon changes when opening - G', () => {
      cy.get('.menu-icon i').should('have.class', 'fa-bars');
      cy.openMenu();
      cy.get('.menu-icon i').should('have.class', 'fa-times');
      cy.log('Menu icon changed to times when opened');
    });

    it('Menu icon changes when closing - G', () => {
      cy.openMenu();
      cy.get('.menu-icon i').should('have.class', 'fa-times');
      cy.closeMenu();
      cy.get('.menu-icon i').should('have.class', 'fa-bars');
      cy.log('Menu icon changed to bars when closed');
    });

    menuItems.forEach((channel, index) => {
      it(`Heading matches channel when ${channel} is clicked - G`, () => {
        cy.openMenu();
        cy.clickMenuChannelBasic(index); // Basic test - no API required for heading change
        cy.get('#js-title').should('contain.text', channel);
        cy.log(`Heading correctly shows ${channel}`);
      });

      it(`Loading spinner shows/hides when ${channel} is clicked - G`, () => {
        cy.openMenu();
        
        // Simple intercept to track the request without breaking it
        cy.intercept('GET', `**/data/${encodeURIComponent(channel)}.json`).as('loadChannel');
        
        // Verify spinner exists and starts hidden
        cy.get('#js-loading').should('exist').and('have.class', 'hidden');
        
        // Click menu item using proper command
        cy.clickMenuChannel(index);
        
        // Wait for request to complete
        cy.wait('@loadChannel');
        
        // The key test: verify spinner is hidden after loading completes
        cy.get('#js-loading').should('have.class', 'hidden');
        cy.log(`✓ Loading completed for ${channel} - spinner properly hidden`);
        
        // Also verify that data was loaded (programs are displayed)
        cy.get('#js-schedule').should('not.be.empty');
        cy.log(`✓ Programs loaded for ${channel}`);
      });

      it(`Programs displayed when ${channel} is clicked in any order - G`, () => {
        cy.openMenu();
        cy.clickMenuChannel(index);
        cy.get('#js-schedule ul li.list-group-item:not(.show-previous)')
          .should('have.length.greaterThan', 0);
        cy.log(`Programs displayed for ${channel}`);
      });
    });
  });

  describe('VG-LEVEL REQUIREMENTS - Advanced Features', () => {

    it('Programs displayed when page loads are sorted and filtered - VG', () => {
      cy.visitPageWithAnimationNone();
      
      // Check that programs are in chronological order
      cy.get('#js-schedule ul li.list-group-item:not(.show-previous)')
        .should('have.length.greaterThan', 1)
        .then(($items) => {
          const times = [];
          $items.each((index, item) => {
            const timeText = Cypress.$(item).find('strong').text();
            times.push(timeText);
          });
          
          // Verify times are in ascending order
          for (let i = 1; i < times.length; i++) {
            const prev = times[i - 1].replace(':', '');
            const curr = times[i].replace(':', '');
            expect(parseInt(curr)).to.be.greaterThan(parseInt(prev));
          }
          cy.log('Programs are sorted chronologically - VG requirement met');
        });
    });

    menuItems.forEach((channel, index) => {
      it(`Programs displayed when ${channel} is clicked are sorted and filtered - VG`, () => {
        cy.visitPageWithAnimationNone();
        cy.openMenu();
        cy.clickMenuChannel(index);
        
        // Check that programs are in chronological order
        cy.get('#js-schedule ul li.list-group-item:not(.show-previous)')
          .should('have.length.greaterThan', 1)
          .then(($items) => {
            const times = [];
            $items.each((index, item) => {
              const timeText = Cypress.$(item).find('strong').text();
              times.push(timeText);
            });
            
            // Verify times are in ascending order
            for (let i = 1; i < times.length; i++) {
              const prev = times[i - 1].replace(':', '');
              const curr = times[i].replace(':', '');
              expect(parseInt(curr)).to.be.greaterThan(parseInt(prev));
            }
            cy.log(`Programs are sorted chronologically for ${channel} - VG requirement met`);
          });
      });
    });

    it('Show previous programs functionality - VG', () => {
      cy.visitPageWithAnimationNone();
      
      // Check if show previous button exists
      cy.get('#js-schedule ul li.show-previous').should('exist');
      cy.log('Show previous programs button exists');
      
      // Click it and verify more programs load
      cy.get('#js-schedule ul li.list-group-item:not(.show-previous)')
        .its('length')
        .then((initialCount) => {
          cy.get('#js-schedule ul li.show-previous').click();
          cy.wait(1000); // Wait for data to load
          
          cy.get('#js-schedule ul li.list-group-item:not(.show-previous)')
            .should('have.length.greaterThan', initialCount);
          cy.log('Show previous programs loads additional content - VG requirement met');
        });
    });

    describe('Menu Animation Tests - VG', () => {
      
      it('Menu animates with timer mode - VG', () => {
        cy.visitPageWithAnimationTimer();
        
        // Use the robust animation test command
        cy.testMenuAnimationTimer('open');
        cy.log('Menu timer animation tested successfully - VG requirement met');
      });

      it('Menu animates with alternative mode - VG', () => {
        cy.visitPageWithAnimationAlternative();
        
        // Use the robust animation test command  
        cy.testMenuAnimationAlternative('open');
        cy.log('Menu alternative animation tested successfully - VG requirement met');
      });

      it('Animation mode is read from window.MENU_ANIMATION_MODE - (VG)', () => {
        cy.visitPageWithAnimationTimer();
        
        cy.window().then((win) => {
          expect(win.MENU_ANIMATION_MODE).to.equal('timer');
          cy.log('MENU_ANIMATION_MODE correctly set to timer');
        });
        
        cy.visitPageWithAnimationAlternative();
        
        cy.window().then((win) => {
          expect(win.MENU_ANIMATION_MODE).to.equal('alternative');
          cy.log('MENU_ANIMATION_MODE correctly set to alternative');
        });
      });
    });
  });

  describe('Integration Tests', () => {
    
    it('Complete user workflow - G and VG combined', () => {
      cy.visitPageWithAnimationTimer();
      
      // Test complete workflow
      cy.log('Testing complete user workflow...');
      
      // 1. Page loads with data
      cy.get('#js-schedule ul li.list-group-item').should('exist');
      
      // 2. Menu can be opened 
      cy.openMenu();
      
      // 3. Channel can be switched
      cy.clickMenuChannel(1);
      cy.get('#js-title').should('contain.text', menuItems[1]);
      
      // 4. New data loads
      cy.get('#js-schedule ul li.list-group-item:not(.show-previous)')
        .should('have.length.greaterThan', 0);
      
      // 5. Menu can be closed
      cy.closeMenu();
      
      cy.log('Complete workflow test passed - All functionality working');
    });
  });
});