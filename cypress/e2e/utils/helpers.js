import {svt1Data, svt2Data, svtBarnData, kunskapsKanalenData, svt24Data} from '../data/tvdataformatted';
import {svt1DataSorted, svt2DataSorted, svtBarnDataSorted, kunskapsKanalenDataSorted, svt24DataSorted} from '../data/tvdatasortedformatted';
import {svt1DataRaw, svt2DataRaw, svtBarnDataRaw, kunskapsKanalenDataRaw, svt24DataRaw} from '../data/tvdataraw';
import { TEST_CONFIG, trySelectors, detectAnimation, parseProgramItem } from './test-config';


// Improved selectors with fallbacks for different student implementations
const getMenuButtonElem = () => trySelectors(TEST_CONFIG.SELECTORS.MENU_BUTTON);
const getMenuElem = () => trySelectors(TEST_CONFIG.SELECTORS.MENU);
const getHeadingElem = () => trySelectors(TEST_CONFIG.SELECTORS.HEADING);
const getMenuItemElems = () => trySelectors(TEST_CONFIG.SELECTORS.MENU_ITEMS);

const getInVisibleSpinner = () => {
  return trySelectors(TEST_CONFIG.SELECTORS.LOADING_SPINNER, { timeout: TEST_CONFIG.LOAD_TIMEOUT })
    .should('not.be.visible');
};

const getSpinner = () => trySelectors(TEST_CONFIG.SELECTORS.LOADING_SPINNER);

const getMenuItemElem = (index) => {
  return getMenuItemElems().then($items => {
    return cy.wrap($items).eq(index);
  });
};

const menuItems = ["SVT 1","SVT 2","SVT Barn","Kunskapskanalen","SVT 24"];

const getCorrectHeadingText = (index) => menuItems[index];

const channels = {
  Svt1: menuItems[0],
  Svt2: menuItems[1],
  SvtBarn: menuItems[2],
  Kunskapskanalen: menuItems[3],
  Svt24: menuItems[4]
};


const getTvDataRawByChannelIndex = (index) => {
  switch (index){
    case 0:
      return svt1DataRaw;
    case 1:
      return svt2DataRaw;
    case 2:
      return svtBarnDataRaw;
    case 3:
      return kunskapsKanalenDataRaw;
    case 4:
      return svt24DataRaw;
    default:
      return null;
  }
}
const getTvDataFormattedUnsorted = (index) => {
  switch (index){
    case 0:
      return svt1Data;
    case 1:
      return svt2Data;
    case 2:
      return svtBarnData;
    case 3:
      return kunskapsKanalenData;
    case 4:
      return svt24Data;
    default:
      return null;
  }
}
const getTvDataFormattedAndSorted = (index) => {
  switch (index){
    case 0:
      return svt1DataSorted;
    case 1:
      return svt2DataSorted;
    case 2:
      return svtBarnDataSorted;
    case 3:
      return kunskapsKanalenDataSorted;
    case 4:
      return svt24DataSorted;
    default:
      return null;
  }
}
const isHtmlListUnsortedUnfiltered = (menuIndex,programsLiItems) => {
  let expectedPrograms = getTvDataFormattedUnsorted(menuIndex); //All unsorted unfiltered
  if (!expectedPrograms) return false;
  return comparePrograms(expectedPrograms,programsLiItems,"UnsortedUnfiltered");
}

const isHtmlListSortedFiltered = (menuIndex,programsLiItems) => {
  let sortedData = getTvDataFormattedAndSorted(menuIndex);
  if (!sortedData) return false;
  let expectedProgramsFiltered = getFilteredPrograms(sortedData); //Filtered
  return comparePrograms(expectedProgramsFiltered,programsLiItems,"SortedFiltered");
}

const isHtmlListSortedUnfiltered = (menuIndex,programsLiItems) => {
  let expectedProgramsSorted = getTvDataFormattedAndSorted(menuIndex); //Filtered
  if (!expectedProgramsSorted) return false;
  return comparePrograms(expectedProgramsSorted,programsLiItems,"SortedUnfiltered");
}

const isHtmlListUnsortedFiltered = (menuIndex,programsLiItems) => {
  let expectedPrograms = getTvDataFormattedUnsorted(menuIndex); //All unsorted unfiltered
  if (!expectedPrograms) return false;
  let expectedProgramsUnsortedButFiltered = getFilteredPrograms(expectedPrograms); //Sorted
  return comparePrograms(expectedProgramsUnsortedButFiltered,programsLiItems,"UnsortedFiltered");
}

const isHtmlProgramsAccepted = (menuIndex,programsLiItems) =>
{
  let isUnsortedFiltered = isHtmlListUnsortedFiltered(menuIndex,programsLiItems);
  let isSortedUnfiltered = isHtmlListSortedUnfiltered(menuIndex,programsLiItems);
  let isUnsortedUnfiltered = isHtmlListUnsortedUnfiltered(menuIndex,programsLiItems);
  let isSortedFiltered = isHtmlListSortedFiltered(menuIndex,programsLiItems);
  
  // Additional checks for partial correctness
  let hasCorrectPrograms = checkProgramsExist(menuIndex, programsLiItems);
  let hasReasonableCount = checkReasonableProgramCount(menuIndex, programsLiItems);
  let hasValidTimeFormat = checkTimeFormat(programsLiItems);
  
  console.log('Data validation results:', {
    isUnsortedFiltered,
    isSortedUnfiltered, 
    isUnsortedUnfiltered,
    isSortedFiltered,
    hasCorrectPrograms,
    hasReasonableCount,
    hasValidTimeFormat
  });
  
  // Accept if any of the main patterns match, or if basic requirements are met
  return isUnsortedFiltered || isSortedUnfiltered || isUnsortedUnfiltered || isSortedFiltered || 
         (hasCorrectPrograms && hasReasonableCount && hasValidTimeFormat);
}

// Check if the programs displayed exist in the expected data (allows for different filtering/sorting)
const checkProgramsExist = (menuIndex, programsLiItems) => {
  const allExpectedPrograms = getTvDataFormattedUnsorted(menuIndex);
  if (!allExpectedPrograms || programsLiItems.length === 0) return false;
  
  // Check if at least 80% of displayed programs exist in the expected data
  let matchCount = 0;
  for (const displayedProgram of programsLiItems) {
    const exists = allExpectedPrograms.some(expected => 
      expected.program === displayedProgram.program || 
      expected.start === displayedProgram.start
    );
    if (exists) matchCount++;
  }
  
  return (matchCount / programsLiItems.length) >= 0.8;
};

// Check if the number of programs is reasonable (not too few, not too many)
const checkReasonableProgramCount = (menuIndex, programsLiItems) => {
  const allExpectedPrograms = getTvDataFormattedUnsorted(menuIndex);
  const filteredExpected = getFilteredPrograms(getTvDataFormattedAndSorted(menuIndex));
  
  if (!allExpectedPrograms) return false;
  
  const displayedCount = programsLiItems.length;
  const minExpected = Math.min(filteredExpected.length, 3); // At least 3 programs or filtered count
  const maxExpected = allExpectedPrograms.length;
  
  return displayedCount >= minExpected && displayedCount <= maxExpected;
};

// Check if time format is valid (HH:MM format)
const checkTimeFormat = (programsLiItems) => {
  if (programsLiItems.length === 0) return false;
  
  // Strict HH:MM format validation
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  let validTimeCount = 0;
  
  for (const program of programsLiItems) {
    const normalizedTime = normalizeTime(program.start);
    if (normalizedTime && timeRegex.test(normalizedTime)) {
      validTimeCount++;
      // Update the program item with normalized time
      program.start = normalizedTime;
    }
  }
  
  // At least 90% should have valid HH:MM time format
  return (validTimeCount / programsLiItems.length) >= 0.9;
};

const comparePrograms = (expectedProgramsData, actualProgramsLiItems, expectedProgramsTestType) => {
  console.log(`------------comparePrograms: TestType: ${expectedProgramsTestType}`);
  console.log(`Length is expected: ${expectedProgramsData.length} Actual: ${actualProgramsLiItems.length}`);
  console.log(`Expected: `, expectedProgramsData);
  console.log(`Actual: `, actualProgramsLiItems);
  
  // Allow for slight length differences (±2 programs) to account for different implementations
  const lengthTolerance = 2;
  const lengthDiff = Math.abs(expectedProgramsData.length - actualProgramsLiItems.length);
  
  if (lengthDiff > lengthTolerance) {
    console.log(`Length difference too large: ${lengthDiff} > ${lengthTolerance}`);
    return false;
  }

  if (actualProgramsLiItems.length === 0) {
    return expectedProgramsData.length === 0;
  }

  // For exact match, both arrays should be same length
  if (lengthDiff === 0) {
    return compareExactPrograms(expectedProgramsData, actualProgramsLiItems, expectedProgramsTestType);
  }

  // For length differences within tolerance, check content overlap
  return compareProgramsWithTolerance(expectedProgramsData, actualProgramsLiItems, expectedProgramsTestType);
};

const compareExactPrograms = (expectedProgramsData, actualProgramsLiItems, expectedProgramsTestType) => {
  let isEqual = true;
  
  for(let i = 0; i < actualProgramsLiItems.length; i++){
    if(isEqual){
      // Normalize both times to HH:MM format for comparison
      const expectedTime = normalizeTime(expectedProgramsData[i].start);
      const actualTime = normalizeTime(actualProgramsLiItems[i].start);
      
      const timeMatch = expectedTime === actualTime;
      const programMatch = normalizeProgram(expectedProgramsData[i].program) === normalizeProgram(actualProgramsLiItems[i].program);
      
      isEqual = timeMatch && programMatch;
      
      if (!isEqual) {
        console.log(`Mismatch at index ${i}:`);
        console.log(`Expected time: ${expectedTime}, Actual: ${actualTime}, Match: ${timeMatch}`);
        console.log(`Expected program: ${expectedProgramsData[i].program}, Actual: ${actualProgramsLiItems[i].program}, Match: ${programMatch}`);
      }
    } else {
      console.log(`Program-index: ${i}\nExpected-start: ${expectedProgramsData[i].start}, Actual-start ${actualProgramsLiItems[i].start}\nExpected-program: ${expectedProgramsData[i].program}, Actual-program: ${actualProgramsLiItems[i].program}`);
      return false;
    }
  }
  return isEqual;
};

const compareProgramsWithTolerance = (expectedProgramsData, actualProgramsLiItems, expectedProgramsTestType) => {
  // Check if most programs match (allowing for small differences in implementation)
  let matchCount = 0;
  const minLength = Math.min(expectedProgramsData.length, actualProgramsLiItems.length);
  
  for(let i = 0; i < minLength; i++){
    // Normalize both times to HH:MM format for comparison
    const expectedTime = normalizeTime(expectedProgramsData[i].start);
    const actualTime = normalizeTime(actualProgramsLiItems[i].start);
    
    const timeMatch = expectedTime === actualTime;
    const programMatch = normalizeProgram(expectedProgramsData[i].program) === normalizeProgram(actualProgramsLiItems[i].program);
    
    if (timeMatch && programMatch) {
      matchCount++;
    }
  }
  
  // Accept if at least 80% of programs match
  const matchRatio = matchCount / minLength;
  console.log(`Match ratio: ${matchRatio} (${matchCount}/${minLength})`);
  return matchRatio >= 0.8;
};

// Normalize time strings to handle different formats and ensure HH:MM format
const normalizeTime = (timeStr) => {
  if (!timeStr) return '';
  
  // Remove extra whitespace
  const cleaned = timeStr.trim();
  
  // Try to extract time using regex patterns
  const timePatterns = [
    /(\d{1,2}):(\d{2})/,     // H:MM or HH:MM
    /(\d{1,2})\.(\d{2})/,    // H.MM or HH.MM
    /(\d{1,2})-(\d{2})/,     // H-MM or HH-MM
    /(\d{1,2})\s*:\s*(\d{2})/ // H : MM or HH : MM (with spaces)
  ];
  
  for (const pattern of timePatterns) {
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
const normalizeProgram = (programStr) => {
  if (!programStr) return '';
  // Remove extra whitespace and normalize
  return programStr.trim().replace(/\s+/g, ' ');
};




// assertProgram(expectedProgramsFiltered, x, programLiItem);
const assertProgram = (expectedPrograms,expectedIndex, programLiItem) => {
  for(let x = 0; x < expectedPrograms.count;x++){
    expect(expectedPrograms[x].start,` ${expectedIndex}: Expected ${expectedPrograms[expectedIndex].start} (${expectedPrograms[expectedIndex].program}), Actual: ${programLiItem.start}`).to.equal(programLiItem.start);

    expect(expectedPrograms[x].program,` ${expectedIndex}: Expected ${expectedPrograms[expectedIndex].start} (${expectedPrograms[expectedIndex].program}), Actual: ${programLiItem.program}`).to.equal(programLiItem.program);
  }
}

const getProgramItem = (programstart, programTitle) => {
  return {start: programstart, program: programTitle};
}

const getFilteredProgramsRaw = (scheduleRaw) => {
  return scheduleRaw.filter(
    (s) => getTimeOnly(new Date(s.start)) > getTimeOnly(new Date())
  );
}

const getFilteredPrograms = (svt2DataSorted) => {
  if (!svt2DataSorted) {
    return [];
  }
  return svt2DataSorted.filter(
    (s) => getTimeOnly(new Date("2023-01-01 "+s.start+":00")) > getTimeOnly(new Date())
  );
}

function formatDateToTime(date) {
  date = new Date(date);
  return date.toTimeString().substr(0, 5);

  //return `${date.getHours()}:${date.getMinutes()}`;
}

function getTimeOnly(date) {
  let timeOnly = new Date(0);
  timeOnly = new Date(timeOnly.setHours(date.getHours()));
  timeOnly = new Date(timeOnly.setMinutes(date.getMinutes()));
  return timeOnly;
}


export {menuItems, 
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
  checkProgramsExist,
  checkReasonableProgramCount,
  checkTimeFormat,
  normalizeTime,
  normalizeProgram,
  TEST_CONFIG,
  trySelectors,
  detectAnimation,
  parseProgramItem
};

// Grade Summary Object - Shared across all test files
const createGradeSummary = () => ({
  student: Cypress.env('STUDENT_NAME') || Cypress.env('student') || "Student",
  grade: null,
  log: {
    loadingSpinnerVisibleOnPageLoad: { checked: null, affectedGrade: "G" },
    loadingSpinnerHiddenAfterPageLoad: { checked: null, affectedGrade: "G" },
    menuCanOpen: { checked: null, affectedGrade: "G" },
    menuCanClose: { checked: null, affectedGrade: "G" },
    menuOpenBtnIconChangedToTimes: { checked: null, affectedGrade: "G" },
    menuCloseBtnIconChangedToBars: { checked: null, affectedGrade: "G" },
    menuOpenIsAnimatedWithSetTimeout: { checked: null, affectedGrade: "VG" },
    menuCloseIsAnimatedWithSetTimeout: { checked: null, affectedGrade: "VG" },
  menuOpenIsAnimatedWithTransitions: { checked: null, affectedGrade: "VG" },
  menuCloseIsAnimatedWithTransitions: { checked: null, affectedGrade: "VG" },
    headingMatchesChannel: { checked: null, affectedGrade: "G" },
  loadingSpinnerVisibleAfterMenuClick: { checked: null, affectedGrade: "G" },
  loadingSpinnerHiddenAfterMenuClick: { checked: null, affectedGrade: "G" },
    previousProgramsButtonIsVisible: { checked: null, affectedGrade: "VG" },
    previousProgramsButtonIsHiddenWhenAllProgramsFetched: { checked: null, affectedGrade: "VG" },
    programsDataWhenPageLoadSortedAndFiltered: { checked: null, affectedGrade: "VG" },
    programsDataWhenPageLoadAccepted: { checked: null, affectedGrade: "G" },
    programsDataWhenChannelClickedSortedAndFiltered: { checked: null, affectedGrade: "VG" },
    programsDataWhenChannelClickedAccepted: { checked: null, affectedGrade: "G" },
    programsDataWhenShowPreviousClickedSortedAndUnfiltered: { checked: null, affectedGrade: "VG" },
  }
});

// Grade tracking helper functions
const updateGradeSummary = (gradeSummary, logKey, value = true) => {
  if (gradeSummary.log[logKey]) {
    gradeSummary.log[logKey].checked = gradeSummary.log[logKey].checked === null ? value : gradeSummary.log[logKey].checked;
  }
};

const debugRunTestGrade = ""; // "" | "VG" | "G"
const debugRunTestChannelText = ""; // "" | "SVT 1" | "SVT 2" | "SVT Barn" | "Kunskapskanalen" | "SVT 24"
const grades = ["VG","G"];

// CI/CD Report Functions
const calculateFinalGrade = (gradeSummary) => {
  const log = gradeSummary.log;
  
  // Count requirements for each grade level
  let gRequirementsMet = 0;
  let gRequirementsTotal = 0;
  let vgRequirementsMet = 0;
  let vgRequirementsTotal = 0;
  
  Object.values(log).forEach(requirement => {
    if (requirement.affectedGrade === 'G') {
      gRequirementsTotal++;
      if (requirement.checked === true) {
        gRequirementsMet++;
      }
    } else if (requirement.affectedGrade === 'VG') {
      vgRequirementsTotal++;
      if (requirement.checked === true) {
        vgRequirementsMet++;
      }
    }
  });
  
  // Grade calculation logic
  const gPassPercentage = gRequirementsTotal > 0 ? (gRequirementsMet / gRequirementsTotal) : 0;
  const vgPassPercentage = vgRequirementsTotal > 0 ? (vgRequirementsMet / vgRequirementsTotal) : 0;
  
  // Need 75% of G requirements for G grade, 75% of both G and VG for VG grade
  const gThreshold = 0.75;
  const vgThreshold = 0.75;
  
  if (gPassPercentage >= gThreshold && vgPassPercentage >= vgThreshold) {
    return 'VG';
  } else if (gPassPercentage >= gThreshold) {
    return 'G';
  } else {
    return 'IG';
  }
};

const isReadyForSubmission = (gradeSummary) => {
  const finalGrade = calculateFinalGrade(gradeSummary);
  return finalGrade !== 'IG';
};

const generateCIReport = (gradeSummary) => {
  const finalGrade = calculateFinalGrade(gradeSummary);
  const readyForSubmission = isReadyForSubmission(gradeSummary);
  const timestamp = new Date().toISOString();
  
  // Count test results
  const log = gradeSummary.log;
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  let skippedTests = 0;
  
  Object.values(log).forEach(requirement => {
    totalTests++;
    if (requirement.checked === true) {
      passedTests++;
    } else if (requirement.checked === false) {
      failedTests++;
    } else {
      skippedTests++;
    }
  });
  
  return {
    student: gradeSummary.student,
    timestamp: timestamp,
    finalGrade: finalGrade,
    readyForSubmission: readyForSubmission,
    testSummary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests,
      passRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
    },
    gradeBreakdown: {
      G: {
        passed: Object.values(log).filter(r => r.affectedGrade === 'G' && r.checked === true).length,
        total: Object.values(log).filter(r => r.affectedGrade === 'G').length
      },
      VG: {
        passed: Object.values(log).filter(r => r.affectedGrade === 'VG' && r.checked === true).length,
        total: Object.values(log).filter(r => r.affectedGrade === 'VG').length
      }
    },
    detailedResults: log,
    ciRecommendation: readyForSubmission ? 
      `✅ Student ${gradeSummary.student} is ready for submission with grade ${finalGrade}` :
      `❌ Student ${gradeSummary.student} needs more work before submission (current: ${finalGrade})`
  };
};

const saveCIReport = (gradeSummary) => {
  const report = generateCIReport(gradeSummary);
  const studentName = gradeSummary.student || 'unknown';
  const fileName = `cypress/students/${studentName}.json`;
  
  // Update the original gradeSummary with calculated grade
  gradeSummary.grade = report.finalGrade;
  gradeSummary.lastUpdated = report.timestamp;
  gradeSummary.ciReport = {
    readyForSubmission: report.readyForSubmission,
    testSummary: report.testSummary,
    gradeBreakdown: report.gradeBreakdown,
    recommendation: report.ciRecommendation
  };
  
  // Write updated file (this would be done in a Cypress task in real implementation)
  cy.writeFile(fileName, gradeSummary);
  
  // Also create a separate CI-focused report
  const ciFileName = `cypress/students/${studentName}_ci_report.json`;
  cy.writeFile(ciFileName, report);
  
  // Log results for CI output
  cy.log(`CI Report: ${report.ciRecommendation}`);
  cy.log(`Test Results: ${report.testSummary.passed}/${report.testSummary.total} passed (${report.testSummary.passRate}%)`);
  
  return report;
};

export { 
  createGradeSummary, 
  updateGradeSummary, 
  calculateFinalGrade,
  isReadyForSubmission,
  generateCIReport,
  saveCIReport,
  debugRunTestGrade, 
  debugRunTestChannelText, 
  grades 
};




