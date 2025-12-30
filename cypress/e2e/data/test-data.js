// Test data and constants
import {svt1Data, svt2Data, svtBarnData, kunskapsKanalenData, svt24Data} from './tvdataformatted';
import {svt1DataSorted, svt2DataSorted, svtBarnDataSorted, kunskapsKanalenDataSorted, svt24DataSorted} from './tvdatasortedformatted';
import {svt1DataRaw, svt2DataRaw, svtBarnDataRaw, kunskapsKanalenDataRaw, svt24DataRaw} from './tvdataraw';

export const menuItems = ["SVT 1","SVT 2","SVT Barn","Kunskapskanalen","SVT 24"];

export const channels = {
  Svt1: menuItems[0],
  Svt2: menuItems[1],
  SvtBarn: menuItems[2],
  Kunskapskanalen: menuItems[3],
  Svt24: menuItems[4]
};

export const getTvDataRawByChannelIndex = (index) => {
  switch (index){
    case 0: return svt1DataRaw;
    case 1: return svt2DataRaw;
    case 2: return svtBarnDataRaw;
    case 3: return kunskapsKanalenDataRaw;
    case 4: return svt24DataRaw;
    default: return null;
  }
};

export const getTvDataFormattedUnsorted = (index) => {
  switch (index){
    case 0: return svt1Data;
    case 1: return svt2Data;
    case 2: return svtBarnData;
    case 3: return kunskapsKanalenData;
    case 4: return svt24Data;
    default: return null;
  }
};

export const getTvDataFormattedAndSorted = (index) => {
  switch (index){
    case 0: return svt1DataSorted;
    case 1: return svt2DataSorted;
    case 2: return svtBarnDataSorted;
    case 3: return kunskapsKanalenDataSorted;
    case 4: return svt24DataSorted;
    default: return null;
  }
};

export const getCorrectHeadingText = (index) => menuItems[index];

// Date/Time utilities
export function formatDateToTime(date) {
  date = new Date(date);
  return date.toTimeString().substr(0, 5);
}

export function getTimeOnly(date) {
  let timeOnly = new Date(0);
  timeOnly = new Date(timeOnly.setHours(date.getHours()));
  timeOnly = new Date(timeOnly.setMinutes(date.getMinutes()));
  return timeOnly;
}

export const getFilteredProgramsRaw = (scheduleRaw) => {
  return scheduleRaw.filter(
    (s) => getTimeOnly(new Date(s.start)) > getTimeOnly(new Date())
  );
};

export const getFilteredPrograms = (svt2DataSorted) => {
  return svt2DataSorted.filter(
    (s) => getTimeOnly(new Date("2023-01-01 "+s.start+":00")) > getTimeOnly(new Date())
  );
};