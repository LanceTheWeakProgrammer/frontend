import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'; 
import isLeapYear from 'dayjs/plugin/isLeapYear'; 
import advancedFormat from 'dayjs/plugin/advancedFormat'; 
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(customParseFormat);
dayjs.extend(isLeapYear);
dayjs.extend(advancedFormat);
dayjs.extend(isBetween); 

dayjs().format('YYYY-MM-DD'); 

export default dayjs;
