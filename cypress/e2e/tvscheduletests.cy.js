import  {
  menuItems, 
  getTvDataRawByChannelIndex, 
  getTvDataFormattedUnsorted,
  getTvDataFormattedAndSorted, 
  getMenuItemElem, 
  getInVisibleSpinner,
  getSpinner,
  getMenuItemElems,
  getHeadingElem,
  getMenuElem,
  getMenuButtonElem,
  getCorrectHeadingText,
  isHtmlListUnsortedUnfiltered,
  isHtmlListSortedFiltered,
  isHtmlListSortedUnfiltered,
  isHtmlListUnsortedFiltered,
  isHtmlProgramsAccepted,
  comparePrograms,
  assertProgram,
  getProgramItem,
  getFilteredProgramsRaw,
  getFilteredPrograms,
  formatDateToTime,
  getTimeOnly,
  createGradeSummary,
  updateGradeSummary,
  saveCIReport,
  debugRunTestGrade,
  debugRunTestChannelText,
  grades
} from './utils/helpers.js';

let gradeSummary = createGradeSummary();



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

describe(`Test all channels for VG/G [${gradeSummary.student}]`, () => {
  

  it(`Visits page and check loading-spinner shows/hides - ${gradeSummary.log.loadingSpinnerVisibleOnPageLoad.affectedGrade}/${gradeSummary.log.loadingSpinnerHiddenAfterPageLoad.affectedGrade}`, () => {
      
    let menuIndexStartPage = 0;
    let pageLoadChannelText = menuItems[menuIndexStartPage];

    //Visist page
    cy.intercept('GET', encodeURI(`*data/${pageLoadChannelText}.json`), (req) => {
      req.on('response', (res) => {
        // Throttle the response to 1 Mbps to simulate a mobile 3G connection -> probably not needed....
        res.setThrottle(10);
      });
    }).as('getTvScheduleFirstPageLoad');
    cy.visit('/index.html')
    .then(() => {  
      
      cy.get('.loading-spinner').should('be.visible');
      cy.log(`${pageLoadChannelText} - loading-spinner was visible`); 
      gradeSummary.log.loadingSpinnerVisibleOnPageLoad.checked = gradeSummary.log.loadingSpinnerVisibleOnPageLoad.checked===null ? true : gradeSummary.log.loadingSpinnerVisibleOnPageLoad.checked;

    });
    cy.wait('@getTvScheduleFirstPageLoad');

    //check loader
    cy.get('.loading-spinner').should('not.be.visible');
    cy.log(`${pageLoadChannelText} - Page loaded`);
    gradeSummary.log.loadingSpinnerHiddenAfterPageLoad.checked = gradeSummary.log.loadingSpinnerHiddenAfterPageLoad.checked===null ? true : gradeSummary.log.loadingSpinnerHiddenAfterPageLoad.checked;  
  })

  it(`Programs displayed on pageload is sorted and filtered - ${gradeSummary.log.programsDataWhenPageLoadSortedAndFiltered.affectedGrade}`, () => {       
    let menuIndexStartPage = 0;
    cy.visitPage();
    cy.checkDisplayedProgramsSortedAndFiltered(menuIndexStartPage);
    gradeSummary.log.programsDataWhenPageLoadSortedAndFiltered.checked = gradeSummary.log.programsDataWhenPageLoadSortedAndFiltered.checked===null ? true : gradeSummary.log.programsDataWhenPageLoadSortedAndFiltered.checked;
  })

  it(`Programs displayed on pageload is any order - ${gradeSummary.log.programsDataWhenPageLoadAccepted.affectedGrade}`, () => {        
    let menuIndexStartPage = 0;
    cy.visitPage();
    cy.checkDisplayedProgramsAccepted(menuIndexStartPage);
    gradeSummary.log.programsDataWhenPageLoadAccepted.checked = gradeSummary.log.programsDataWhenPageLoadAccepted.checked===null ? true : gradeSummary.log.programsDataWhenPageLoadAccepted.checked;
  })

  it(`Opens menu - ${gradeSummary.log.menuCanOpen.affectedGrade}`, () => {
    cy.visitPage();
    cy.openMenu();
    gradeSummary.log.menuCanOpen.checked = gradeSummary.log.menuCanOpen.checked===null ? true : gradeSummary.log.menuCanOpen.checked;
  });

  it(`Changes menu-btn-icon when opens menu - ${gradeSummary.log.menuOpenBtnIconChangedToTimes.affectedGrade}`, () => {    
    cy.visitPage();
    cy.openMenu().then(() => {
      //Is Btn-Icon changed to Times
      cy.get('.menu-icon > [class^=fa]').should('have.class', 'fa-times');
      cy.log(`menuBtn icon changed`);    
      gradeSummary.log.menuOpenBtnIconChangedToTimes.checked = gradeSummary.log.menuOpenBtnIconChangedToTimes.checked===null ? true : gradeSummary.log.menuOpenBtnIconChangedToTimes.checked;
    });
  });

  it(`Closes menu - G`, () => {
    cy.visitPage();
    cy.openMenu()
    cy.closeMenu();
    gradeSummary.log.menuCanClose.checked = gradeSummary.log.menuCanClose.checked==null ? true : gradeSummary.log.menuCanClose.checked;
  });
 
  it(`Changes menu-btn-icon when closes menu - ${gradeSummary.log.menuCloseBtnIconChangedToBars.affectedGrade}`, () => {  
    cy.visitPage();
    cy.openMenu()
    cy.closeMenu().then(() => {
      //Is Btn-Icon changed to Bars
      cy.get('.menu-icon > [class^=fa]').should('have.class', 'fa-bars');
      cy.log(` menuBtn icon changed`);
      gradeSummary.log.menuCloseBtnIconChangedToBars.checked = gradeSummary.log.menuCloseBtnIconChangedToBars.checked===null ? true : gradeSummary.log.menuCloseBtnIconChangedToBars.checked;
    })
  });
  
  it(`Animates menu-open [setTimeout] - ${gradeSummary.log.menuOpenIsAnimatedWithSetTimeout.affectedGrade}`, () => {
    cy.visit('/index.html', {
      onBeforeLoad: (win) => {
        win.MENU_ANIMATION_MODE = 'timer';
        // cy.log('Set MENU_ANIMATION_MODE to timer before page load');
      }
    });

    //Click Menu-show
    cy.get('.menu-icon > i.fas')
    .then(($menuBtn) => {
      $menuBtn.click();
      cy.log(`menuBtn clicked -> display menu`);

        //Is menu animated (has css property left between -300px and 0px)
        
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(10);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(10);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(30);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(30);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(30);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(30);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(10);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
       
        cy.log(`menu open was probably animated with setTimeout`);
        gradeSummary.log.menuOpenIsAnimatedWithSetTimeout.checked = gradeSummary.log.menuOpenIsAnimatedWithSetTimeout.checked===null ? true : gradeSummary.log.menuOpenIsAnimatedWithSetTimeout.checked;
      
      //Is menu open
      cy.get('.menu').should('have.css', 'left', '0px'); // or check has.class class menu--show
      cy.log(`menu is open`);
      gradeSummary.log.menuCanOpen.checked = gradeSummary.log.menuCanOpen.checked===null ? true : gradeSummary.log.menuCanOpen.checked;

    });
  });

  it(`Animates menu-close [setTimeout] - ${gradeSummary.log.menuCloseIsAnimatedWithSetTimeout.affectedGrade}`, () => {
   cy.visit('/index.html', {
      onBeforeLoad: (win) => {
        win.MENU_ANIMATION_MODE = 'timer';
        // cy.log('Set MENU_ANIMATION_MODE to timer before page load');
      }
    });
    
    cy.openMenu()
   
    
    //Click Menu-close
    cy.get('.menu-icon > i.fas')
    .then(($menuBtn) => {
      $menuBtn.click();
      cy.log(`menuBtn clicked -> hide menu`);

        //Is menu animated (has css property left between -300px and 0px)
        
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(10);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(10);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(30);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(30);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(30);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(30);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
        cy.wait(10);
        cy.get('.menu').should('have.css', 'left').and('match',/^-([1-9]|[1-9]\d|[1-2]\d\d)px$/);
       
        cy.log(`menu close was probably animated with setTimeout`);
        gradeSummary.log.menuCloseIsAnimatedWithSetTimeout.checked = gradeSummary.log.menuCloseIsAnimatedWithSetTimeout.checked===null ? true : gradeSummary.log.menuCloseIsAnimatedWithSetTimeout.checked;
      
      //Is menu open
      cy.get('.menu').should('have.css', 'left', '-300px'); // or check has.class class menu--show
      cy.log(`menu is open`);
      gradeSummary.log.menuCanClose.checked = gradeSummary.log.menuCanClose.checked===null ? true : gradeSummary.log.menuCanClose.checked;

    });
  });

  it(`Animates menu-open [transitions/CSS] - ${gradeSummary.log.menuOpenIsAnimatedWithTransitions.affectedGrade}`, () => {
    cy.visit('/index.html', {
      onBeforeLoad: (win) => {
        win.MENU_ANIMATION_MODE = 'transitions';
        // cy.log('Set MENU_ANIMATION_MODE to transitions before page load');
      }
    });
    
    cy.get('.menu').should('have.css', 'left', '-300px');
    cy.log(`menu is closed`);
    
    // Check if CSS transitions are defined
    cy.get('.menu').then(($menu) => {
      const menu = $menu[0];
      // Use cy.window() to access the page window and computed styles safely
      cy.window().then((win) => {
        const computedStyle = win.getComputedStyle(menu);
        const transition = computedStyle.getPropertyValue('transition');

        if (transition && transition !== 'none' && transition.includes('left')) {
          cy.log('CSS transition detected on left property');
          gradeSummary.log.menuOpenIsAnimatedWithTransitions.checked = true;
        }
      });
    });
    
    cy.openMenu();
    cy.get('.menu').should('have.css', 'left', '0px');
  });

  it(`Animates menu-close [transitions/CSS] - ${gradeSummary.log.menuCloseIsAnimatedWithTransitions.affectedGrade}`, () => {
    cy.visit('/index.html', {
      onBeforeLoad: (win) => {
        win.MENU_ANIMATION_MODE = 'transitions';
        // cy.log('Set MENU_ANIMATION_MODE to transitions before page load');
      }
    });
    
    cy.openMenu();
    cy.get('.menu').should('have.css', 'left', '0px');
    cy.log(`menu is open`);
    
    // Check if CSS transitions are defined
    cy.get('.menu').then(($menu) => {
      const menu = $menu[0];
      // Use cy.window() to access the page window and computed styles safely
      cy.window().then((win) => {
        const computedStyle = win.getComputedStyle(menu);
        const transition = computedStyle.getPropertyValue('transition');

        if (transition && transition !== 'none' && transition.includes('left')) {
          cy.log('CSS transition detected on left property');
          gradeSummary.log.menuCloseIsAnimatedWithTransitions.checked = true;
        }
      });
    });
    
    cy.closeMenu();
    cy.get('.menu').should('have.css', 'left', '-300px');
  });
})

  
menuItems.forEach((channelText,menuIndex) => {
  describe(`Test for ${channelText} for VG/G [${gradeSummary.student}]`, () => { 
    it(`Clicks menu-channel ${channelText} has correct heading - ${gradeSummary.log.headingMatchesChannel.affectedGrade}`, () => {
      cy.visitPage();
      cy.openMenu();
      cy.clickMenuChannelBasic(menuIndex); // Basic test - no API required for heading change
      //check heading matches menu channel
      cy.get('h1').should('have.text', channelText);
      cy.log(`${channelText} - heading matches channel`);
      gradeSummary.log.headingMatchesChannel.checked = gradeSummary.log.headingMatchesChannel.checked===null ? true : gradeSummary.log.headingMatchesChannel.checked;
    });

    it(`Channel ${channelText} displays previous programs button - ${gradeSummary.log.previousProgramsButtonIsVisible.affectedGrade}`, () => {
      cy.visitPage();
      cy.openMenu();
      cy.clickMenuChannel(menuIndex);
      cy.get('.list-group-item.show-previous').should('be.visible');
      gradeSummary.log.previousProgramsButtonIsVisible.checked = gradeSummary.log.previousProgramsButtonIsVisible.checked===null ? true : gradeSummary.log.previousProgramsButtonIsVisible.checked;
    });

    it(`Channel ${channelText} displayed programs is sorted and filtered - ${gradeSummary.log.programsDataWhenChannelClickedSortedAndFiltered.affectedGrade}`, () => {
      cy.visitPage();
      cy.openMenu();
      cy.clickMenuChannel(menuIndex);

      cy.checkDisplayedProgramsSortedAndFiltered(menuIndex);

      gradeSummary.log.programsDataWhenChannelClickedSortedAndFiltered.checked = gradeSummary.log.programsDataWhenChannelClickedSortedAndFiltered.checked===null ? true : gradeSummary.log.programsDataWhenChannelClickedSortedAndFiltered.checked;
    });

    it(`Channel ${channelText} displays programs is any order - ${gradeSummary.log.headingMatchesChannel.affectedGrade}`, () => {
      cy.visitPage();
      cy.openMenu();
      cy.clickMenuChannel(menuIndex);

      cy.checkDisplayedProgramsAccepted(menuIndex);

      gradeSummary.log.programsDataWhenChannelClickedAccepted.checked = gradeSummary.log.programsDataWhenChannelClickedAccepted.checked===null ? true : gradeSummary.log.programsDataWhenChannelClickedAccepted.checked;
    });

    it(`Channel ${channelText} click display previous programs hides button - ${gradeSummary.log.previousProgramsButtonIsHiddenWhenAllProgramsFetched.affectedGrade}`, () => {
      cy.visitPage();
      cy.openMenu();
      cy.clickMenuChannel(menuIndex);
      cy.clickShowPreviousPrograms(menuIndex);
      cy.get('#js-loading').should('not.be.visible');
      cy.get('li.list-group-item.show-previous').should('not.exist');
    
      gradeSummary.log.previousProgramsButtonIsHiddenWhenAllProgramsFetched.checked = gradeSummary.log.previousProgramsButtonIsHiddenWhenAllProgramsFetched.checked===null ? true : gradeSummary.log.previousProgramsButtonIsVisible.checked;
    });

    it(`Channel ${channelText} displayed previous programs is sorted  - ${gradeSummary.log.programsDataWhenShowPreviousClickedSortedAndUnfiltered.affectedGrade}`, () => {
      cy.visitPage();
      cy.openMenu();
      cy.clickMenuChannel(menuIndex);
      cy.clickShowPreviousPrograms(menuIndex);
  
      let expectedProgramsSortedUnfiltered = getTvDataFormattedAndSorted(menuIndex);

      let programLiItemsWhenPreviousPrograms = [];
      cy.get('#js-schedule > ul > li.list-group-item:not(.show-previous)')
      .each(($liElem, $index, liItems) => {
        let programLiItem = getProgramItem($liElem.children().first().text(),$liElem.children().last().text());
        expect(expectedProgramsSortedUnfiltered[$index].start).to.equal(programLiItem.start);
        expect(expectedProgramsSortedUnfiltered[$index].program).to.equal(programLiItem.program);

        programLiItemsWhenPreviousPrograms.push(programLiItem);
      })
      .then(($liItems) => {
        let programLiItemsTotal = programLiItemsWhenPreviousPrograms.length;

        expect(isHtmlListSortedUnfiltered(menuIndex, programLiItemsWhenPreviousPrograms)).to.equal(true,"List of unfiltered programs is correct");

        gradeSummary.log.programsDataWhenShowPreviousClickedSortedAndUnfiltered.checked = gradeSummary.log.programsDataWhenShowPreviousClickedSortedAndUnfiltered.checked===null ? true : gradeSummary.log.programsDataWhenShowPreviousClickedSortedAndUnfiltered.checked;
           
      });

    
    });
    
  });
});

describe(`Print result for [${gradeSummary.student}]`, () => {
  
  it(`Print result for ${gradeSummary.student}`, () => {

    gradeSummary.grade = getGrade(gradeSummary)

    console.log(gradeSummary);

    cy.writeFile(`cypress/students/${getStudent(gradeSummary)}.json`, gradeSummary);
  });

  function getStudent(gradeSummary){
    return `${gradeSummary.student.replaceAll(" ", "_")}`;
  }

  function getGrade(gradeSummary){
    let gMisses = false;
    let vgMisses = false;

    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.loadingSpinnerVisibleOnPageLoad,"loadingSpinnerVisibleOnPageLoad");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.loadingSpinnerVisibleOnPageLoad,"loadingSpinnerVisibleOnPageLoad");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.loadingSpinnerHiddenAfterPageLoad,"loadingSpinnerHiddenAfterPageLoad");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.menuCanOpen,"menuCanOpen");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.menuCanClose,"menuCanClose");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.menuOpenBtnIconChangedToTimes,"menuOpenBtnIconChangedToTimes");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.menuCloseBtnIconChangedToBars,"menuCloseBtnIconChangedToBars");
    // Note: Animation is VG requirement, not G
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.headingMatchesChannel,"headingMatchesChannel");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.loadingSpinnerVisibleAfterMenuClick,"loadingSpinnerVisibleAfterMenuClick");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.loadingSpinnerHiddenAfterMenuClick,"loadingSpinnerHiddenAfterMenuClick");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.previousProgramsButtonIsVisible,"previousProgramsButtonIsVisible");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.previousProgramsButtonIsHiddenWhenAllProgramsFetched,"previousProgramsButtonIsHiddenWhenAllProgramsFetched");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.programsDataWhenPageLoadSortedAndFiltered,"programsDataWhenPageLoadSortedAndFiltered");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.programsDataWhenPageLoadAccepted,"programsDataWhenPageLoadAccepted");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.programsDataWhenChannelClickedSortedAndFiltered,"programsDataWhenChannelClickedSortedAndFiltered");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.programsDataWhenChannelClickedAccepted,"programsDataWhenChannelClickedAccepted");
    gMisses = setMissedGrade(gMisses,"G", gradeSummary.log.programsDataWhenShowPreviousClickedSortedAndUnfiltered,"programsDataWhenShowPreviousClickedSortedAndUnfiltered");

    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.loadingSpinnerVisibleOnPageLoad,"loadingSpinnerVisibleOnPageLoad");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.loadingSpinnerVisibleOnPageLoad,"loadingSpinnerVisibleOnPageLoad");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.loadingSpinnerHiddenAfterPageLoad,"loadingSpinnerHiddenAfterPageLoad");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.menuCanOpen,"menuCanOpen");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.menuCanClose,"menuCanClose");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.menuOpenBtnIconChangedToTimes,"menuOpenBtnIconChangedToTimes");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.menuCloseBtnIconChangedToBars,"menuCloseBtnIconChangedToBars");
    // Check either setTimeout OR transitions animation (student can choose method)
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.menuOpenIsAnimatedWithSetTimeout,"menuOpenIsAnimatedWithSetTimeout");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.menuCloseIsAnimatedWithSetTimeout,"menuCloseIsAnimatedWithSetTimeout");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.menuOpenIsAnimatedWithTransitions,"menuOpenIsAnimatedWithTransitions");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.menuCloseIsAnimatedWithTransitions,"menuCloseIsAnimatedWithTransitions");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.headingMatchesChannel,"headingMatchesChannel");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.loadingSpinnerVisibleAfterMenuClick,"loadingSpinnerVisibleAfterMenuClick");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.loadingSpinnerHiddenAfterMenuClick,"loadingSpinnerHiddenAfterMenuClick");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.previousProgramsButtonIsVisible,"previousProgramsButtonIsVisible");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.previousProgramsButtonIsHiddenWhenAllProgramsFetched,"previousProgramsButtonIsHiddenWhenAllProgramsFetched");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.programsDataWhenPageLoadSortedAndFiltered,"programsDataWhenPageLoadSortedAndFiltered");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.programsDataWhenPageLoadAccepted,"programsDataWhenPageLoadAccepted");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.programsDataWhenChannelClickedSortedAndFiltered,"programsDataWhenChannelClickedSortedAndFiltered");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.programsDataWhenChannelClickedAccepted,"programsDataWhenChannelClickedAccepted");
    vgMisses = setMissedGrade(vgMisses,"VG", gradeSummary.log.programsDataWhenShowPreviousClickedSortedAndUnfiltered,"programsDataWhenShowPreviousClickedSortedAndUnfiltered");

    console.log("MISSED VG", vgMisses);
    console.log("MISSED G", gMisses);

    if(vgMisses !== true && gMisses !== true){
        return "VG"
    }else if(vgMisses && gMisses !== true ){
      return "G";
    }else if(vgMisses && gMisses || gMisses){
      return "IG";
    }else{
      return "Unknown";
    }
  
  }
  function setMissedGrade(existingBool ,gradeToSetMissed, logObj,logObjName){
   // console.log(`logObj for ${gradeToSetMissed} [${logObjName}]`, logObj);

    if(logObj.affectedGrade==gradeToSetMissed){
      if(logObj.checked!==true){
        //console.log(`-----> Misses grade ${gradeToSetMissed} - [${logObjName}]`, logObj);
        return true;
      }
    }
    return existingBool;
  }

  // Generate CI report after all tests complete
  after(() => {
    cy.then(() => {
      // Save final CI report for submission readiness
      const ciReport = saveCIReport(gradeSummary);
      
      // Log final results for CI output
      cy.log(`🎯 Final Grade: ${ciReport.finalGrade}`);
      cy.log(`📊 Test Summary: ${ciReport.testSummary.passed}/${ciReport.testSummary.total} passed`);
      cy.log(`✅ Ready for Submission: ${ciReport.readyForSubmission ? 'YES' : 'NO'}`);
      
      // Set environment variables for CI/CD pipeline
      Cypress.env('FINAL_GRADE', ciReport.finalGrade);
      Cypress.env('READY_FOR_SUBMISSION', ciReport.readyForSubmission);
      Cypress.env('TEST_PASS_RATE', ciReport.testSummary.passRate);
    });
  });
 
})