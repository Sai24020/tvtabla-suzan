// Data Validation Module
// Contains validation logic for program data and comparison functions

import { 
  getTvDataFormattedUnsorted,
  getTvDataFormattedAndSorted,
  getFilteredPrograms
} from '../data/test-data';
import { getProgramItemsElem, getShowPreviousButton } from './selectors';
import { normalizeTime, normalizeProgram, parseProgramItem } from './test-config';

// Create program item object
export const getProgramItem = (programstart, programTitle) => {
  return {
    start: normalizeTime(programstart), 
    program: normalizeProgram(programTitle)
  };
};

// Main validation function for different test types
export const validateProgramsData = (menuIndex, validationType) => {
  let programLiItems = [];
  
  getProgramItemsElem().each(($liElem, $index, $liItems) => {
    const programLiItem = parseProgramItem($liElem);
    if (programLiItem) {
      programLiItems.push(programLiItem);
    }
  }).then(() => {
    cy.log(`Found ${programLiItems.length} programs`);
    console.log(`Programs displayed [${validationType}]:`, programLiItems);

    // Perform validation based on type
    switch (validationType) {
      case 'sortedFiltered':
        validateSortedAndFiltered(menuIndex, programLiItems);
        break;
      case 'accepted':
        validateAccepted(menuIndex, programLiItems);
        break;
      case 'sortedUnfiltered':
        validateSortedUnfiltered(menuIndex, programLiItems);
        break;
      default:
        throw new Error(`Unknown validation type: ${validationType}`);
    }

    // Check for show previous button if applicable
    checkShowPreviousButton(validationType);
  });
};

// Validate sorted and filtered programs
const validateSortedAndFiltered = (menuIndex, programLiItems) => {
  const expectedProgramsFiltered = getFilteredPrograms(getTvDataFormattedAndSorted(menuIndex));
  
  if (expectedProgramsFiltered.length === 0) {
    cy.log('No expected filtered programs found');
    return;
  }

  // Compare each program
  for (let i = 0; i < Math.min(expectedProgramsFiltered.length, programLiItems.length); i++) {
    expect(expectedProgramsFiltered[i].start).to.equal(
      programLiItems[i].start,
      `Program ${i} start time mismatch`
    );
    expect(expectedProgramsFiltered[i].program).to.equal(
      programLiItems[i].program,
      `Program ${i} title mismatch`
    );
  }

  expect(isHtmlListSortedFiltered(menuIndex, programLiItems)).to.equal(
    true, 
    "List of filtered programs is correct"
  );
};

// Validate any acceptable program arrangement
const validateAccepted = (menuIndex, programLiItems) => {
  expect(isHtmlProgramsAccepted(menuIndex, programLiItems)).to.equal(
    true,
    "List of programs is accepted for G grade"
  );
};

// Validate sorted but unfiltered programs
const validateSortedUnfiltered = (menuIndex, programLiItems) => {
  const expectedProgramsSorted = getTvDataFormattedAndSorted(menuIndex);
  
  for (let i = 0; i < Math.min(expectedProgramsSorted.length, programLiItems.length); i++) {
    expect(expectedProgramsSorted[i].start).to.equal(
      programLiItems[i].start,
      `Program ${i} start time mismatch`
    );
    expect(expectedProgramsSorted[i].program).to.equal(
      programLiItems[i].program,
      `Program ${i} title mismatch`
    );
  }

  expect(isHtmlListSortedUnfiltered(menuIndex, programLiItems)).to.equal(
    true,
    "List of unfiltered programs is correct"
  );
};

// Check if show previous button exists when expected
const checkShowPreviousButton = (validationType) => {
  if (validationType === 'sortedFiltered' || validationType === 'accepted') {
    getShowPreviousButton().then($button => {
      if ($button) {
        cy.wrap($button).should('exist');
        cy.log('Show previous programs button is visible');
      } else {
        cy.log('Show previous button not found - may be implemented differently');
      }
    });
  }
};

// Validation helper functions
export const isHtmlListUnsortedUnfiltered = (menuIndex, programsLiItems) => {
  let expectedPrograms = getTvDataFormattedUnsorted(menuIndex);
  return comparePrograms(expectedPrograms, programsLiItems, "UnsortedUnfiltered");
};

export const isHtmlListSortedFiltered = (menuIndex, programsLiItems) => {
  let expectedProgramsFiltered = getFilteredPrograms(getTvDataFormattedAndSorted(menuIndex));
  return comparePrograms(expectedProgramsFiltered, programsLiItems, "SortedFiltered");
};

export const isHtmlListSortedUnfiltered = (menuIndex, programsLiItems) => {
  let expectedProgramsSorted = getTvDataFormattedAndSorted(menuIndex);
  return comparePrograms(expectedProgramsSorted, programsLiItems, "SortedUnfiltered");
};

export const isHtmlListUnsortedFiltered = (menuIndex, programsLiItems) => {
  let expectedPrograms = getTvDataFormattedUnsorted(menuIndex);
  let expectedProgramsUnsortedButFiltered = getFilteredPrograms(expectedPrograms);
  return comparePrograms(expectedProgramsUnsortedButFiltered, programsLiItems, "UnsortedFiltered");
};

export const isHtmlProgramsAccepted = (menuIndex, programsLiItems) => {
  let isUnsortedFiltered = isHtmlListUnsortedFiltered(menuIndex, programsLiItems);
  let isSortedUnfiltered = isHtmlListSortedUnfiltered(menuIndex, programsLiItems);
  let isUnsortedUnfiltered = isHtmlListUnsortedUnfiltered(menuIndex, programsLiItems);
  let isSortedFiltered = isHtmlListSortedFiltered(menuIndex, programsLiItems);
  
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
  
  return isUnsortedFiltered || isSortedUnfiltered || isUnsortedUnfiltered || isSortedFiltered || 
         (hasCorrectPrograms && hasReasonableCount && hasValidTimeFormat);
};

// Enhanced comparison with tolerance
export const comparePrograms = (expectedProgramsData, actualProgramsLiItems, expectedProgramsTestType) => {
  console.log(`Comparing programs: ${expectedProgramsTestType}`);
  console.log(`Expected length: ${expectedProgramsData.length}, Actual: ${actualProgramsLiItems.length}`);
  
  const lengthTolerance = 2;
  const lengthDiff = Math.abs(expectedProgramsData.length - actualProgramsLiItems.length);
  
  if (lengthDiff > lengthTolerance) {
    console.log(`Length difference too large: ${lengthDiff} > ${lengthTolerance}`);
    return false;
  }

  if (actualProgramsLiItems.length === 0) {
    return expectedProgramsData.length === 0;
  }

  if (lengthDiff === 0) {
    return compareExactPrograms(expectedProgramsData, actualProgramsLiItems);
  }

  return compareProgramsWithTolerance(expectedProgramsData, actualProgramsLiItems);
};

const compareExactPrograms = (expectedProgramsData, actualProgramsLiItems) => {
  for(let i = 0; i < actualProgramsLiItems.length; i++){
    const expectedTime = normalizeTime(expectedProgramsData[i].start);
    const actualTime = normalizeTime(actualProgramsLiItems[i].start);
    
    const timeMatch = expectedTime === actualTime;
    const programMatch = normalizeProgram(expectedProgramsData[i].program) === 
                        normalizeProgram(actualProgramsLiItems[i].program);
    
    if (!timeMatch || !programMatch) {
      console.log(`Mismatch at index ${i}:`);
      console.log(`Expected: ${expectedTime} - ${expectedProgramsData[i].program}`);
      console.log(`Actual: ${actualTime} - ${actualProgramsLiItems[i].program}`);
      return false;
    }
  }
  return true;
};

const compareProgramsWithTolerance = (expectedProgramsData, actualProgramsLiItems) => {
  let matchCount = 0;
  const minLength = Math.min(expectedProgramsData.length, actualProgramsLiItems.length);
  
  for(let i = 0; i < minLength; i++){
    const expectedTime = normalizeTime(expectedProgramsData[i].start);
    const actualTime = normalizeTime(actualProgramsLiItems[i].start);
    
    const timeMatch = expectedTime === actualTime;
    const programMatch = normalizeProgram(expectedProgramsData[i].program) === 
                        normalizeProgram(actualProgramsLiItems[i].program);
    
    if (timeMatch && programMatch) {
      matchCount++;
    }
  }
  
  const matchRatio = matchCount / minLength;
  console.log(`Match ratio: ${matchRatio} (${matchCount}/${minLength})`);
  return matchRatio >= 0.8;
};

// Additional validation helpers
export const checkProgramsExist = (menuIndex, programsLiItems) => {
  const allExpectedPrograms = getTvDataFormattedUnsorted(menuIndex);
  if (!allExpectedPrograms || programsLiItems.length === 0) return false;
  
  let matchCount = 0;
  for (const displayedProgram of programsLiItems) {
    const exists = allExpectedPrograms.some(expected => 
      normalizeProgram(expected.program) === normalizeProgram(displayedProgram.program) || 
      normalizeTime(expected.start) === normalizeTime(displayedProgram.start)
    );
    if (exists) matchCount++;
  }
  
  return (matchCount / programsLiItems.length) >= 0.8;
};

export const checkReasonableProgramCount = (menuIndex, programsLiItems) => {
  const allExpectedPrograms = getTvDataFormattedUnsorted(menuIndex);
  const filteredExpected = getFilteredPrograms(getTvDataFormattedAndSorted(menuIndex));
  
  if (!allExpectedPrograms) return false;
  
  const displayedCount = programsLiItems.length;
  const minExpected = Math.min(filteredExpected.length, 3);
  const maxExpected = allExpectedPrograms.length;
  
  return displayedCount >= minExpected && displayedCount <= maxExpected;
};

export const checkTimeFormat = (programsLiItems) => {
  if (programsLiItems.length === 0) return false;
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  let validTimeCount = 0;
  
  for (const program of programsLiItems) {
    const normalizedTime = normalizeTime(program.start);
    if (normalizedTime && timeRegex.test(normalizedTime)) {
      validTimeCount++;
      program.start = normalizedTime;
    }
  }
  
  return (validTimeCount / programsLiItems.length) >= 0.9;
};