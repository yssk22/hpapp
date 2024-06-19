/**
 * provide a helper functions for Date object.
 *
 * You may have a various type of representation of a date in your application so this module also help you to convert the representation to a Date object.
 *
 * @module
 */
import * as object from './object';

export type maybeDate = Date | string | number | null | undefined;
export type maybeNumber = number | null | undefined;

const N_MINUTES = 60 * 1000;
const N_HOURS = 60 * N_MINUTES;
const N_DAYS = 24 * N_HOURS;

const INVALID_DATE_STRING = '-';
const DATE_STRING_REGEXP = /\d{4}\/\d{2}\/\d{2}/;

const TimezoneOffset = {
  JST: -9 * 60,
  UTC: 0
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * check if the object is a Date object
 * @param t - any object
 * @returns true if t is a Date object
 */
const isDate = (t: any): boolean => {
  return t?.getFullYear();
};

/**
 * check if the Date object is invalid
 * @param t - an object that can be converted to a Date object
 * @returns true if t is an invalid Date object
 */
const isInvalidDate = (t: Date): boolean => {
  return t.toString() === 'Invalid Date';
};

const n = (d: number): string => {
  if (d >= 10) {
    return '' + d;
  }
  return '0' + d;
};

/**
 * add a number of units of time to a Date object
 * @param t - an object that can be converted to a Date object
 * @param num - number of units to add
 * @param unit - unit of time to add
 * @returns a new Date object with the added time
 */
const addDate = (t: maybeDate, num: number, unit: 'minute' | 'hour' | 'day'): Date => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return t;
  }
  const value = num * (unit === 'minute' ? N_MINUTES : unit === 'hour' ? N_HOURS : N_DAYS);
  return new Date(t.getTime() + value);
};

/**
 * parse an object to a Date object
 * @param t - an object that can be converted to a Date object. if it is number, it is treated as a Unix timestamp.
 * @returns a Date object
 */
const parseDate = (t: maybeDate): Date => {
  if (t == null) {
    return new Date('Invalid Date'); // invalid
  }
  if (t instanceof Date) {
    return t;
  }
  if (typeof t === 'number') {
    return new Date(t * 1000);
  }
  return new Date(t);
};

/**
 * convert timezone. Date object always use system's timezone so this function just calculate the difference between the timezone offset and the timezone offset of the Date object, then
 * return a new Date object with the difference added to the original Date object.
 * @param t - an object that can be converted to a Date object
 * @param timezoneOffset - timezone offset in minutes. If timezoneOffset is null, it does nothing.
 * @returns a new Date object with the timezone offset
 */
const convertTimezone = (t: Date, timezoneOffset: maybeNumber = TimezoneOffset.JST): Date => {
  if (timezoneOffset == null) {
    return t;
  }
  const diff = timezoneOffset - t.getTimezoneOffset();
  if (diff === 0) {
    return t;
  }
  return new Date(t.getTime() - diff * 60 * 1000);
};

const WeekdayString = [
  ['Sunday', 'Sun'],
  ['Monday', 'Mon'],
  ['Tuesday', 'Tue'],
  ['Wednesday', 'Wed'],
  ['Thursday', 'Thu'],
  ['Friday', 'Fri'],
  ['Saturday', 'Sat']
];

/**
 * convert getDay() value to a string ('Sunday', 'Monday', ...etc).
 * @param t - an object that can be converted to a Date object
 * @returns a string of the weekday
 */
const toWeekdayString = (t: maybeDate): string => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  return WeekdayString[t.getDay()][0];
};

/**
 * convert getDay() value to a short string ('Sun', 'Mon', ...etc).
 * @param t - an object that can be converted to a Date object
 * @returns a short string of the weekday
 */
const toShortWeekdayString = (t: maybeDate): string => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  return WeekdayString[t.getDay()][1];
};

/**
 * convert a Date object to a string in the format of 'yyyy/mm/dd'
 * @param t - an object that can be converted to a Date object
 * @param timezoneOffset - timezone offset in minutes
 * @returns a string of the date
 */
const toDateString = (t: maybeDate, timezoneOffset?: maybeNumber): string => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  t = convertTimezone(t, timezoneOffset);
  return `${t.getFullYear()}/${n(t.getMonth() + 1)}/${n(t.getDate())}`;
};

/**
 * convert a Date object to a string in the format of 'HH:MM'
 * @param t - an object that can be converted to a Date object
 * @param timezoneOffset - timezone offset in minutes
 * @returns a string of the time
 */
const toTimeString = (t: maybeDate, timezoneOffset?: maybeNumber): string => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  t = convertTimezone(t, timezoneOffset);
  return `${n(t.getHours())}:${n(t.getMinutes())}`;
};

/**
 * convert a Date object to a string in the format of 'yyyy/mm/dd HH:MM'
 * @param t - an object that can be converted to a Date object
 * @param timezoneOffset - timezone offset in minutes
 * @returns a string of the datetime
 */
const toDateTimeString = (t: maybeDate, timezoneOffset?: maybeNumber): string => {
  t = parseDate(t);
  if (!t) {
    return INVALID_DATE_STRING;
  }
  return `${toDateString(t, timezoneOffset)} ${toTimeString(t, timezoneOffset)}`;
};

/**
 *
 * @returns a Date object of today
 */
const getToday = (): Date => {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};

/**
 * get a Date object of the date part of the object
 * @param t - an object that can be converted to a Date object
 * @returns the date
 */
const getDate = (t: maybeDate): Date => {
  t = parseDate(t);
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};

/**
 * get a time offset (milliseconds) of the Date object
 * @param t - an object that can be converted to a Date object
 * @returns the time offset in milliseconds
 */
const getTimeOffset = (t: Date): number => {
  return t.getTime() % (60 * 60 * 24 * 1000);
};

/**
 * get the query string representation of the Date
 * @param t - an object that can be converted to a Date object
 * @returns a string that can be used in a query string
 */
const toQueryString = (t: maybeDate): string => {
  const s = JSON.stringify(t);
  return s.substr(1, s.length - 2);
};

/**
 * get the query string representation of the Date but null if the Date is invalid
 * @param t - an object that can be converted to a Date object
 * @returns a string that can be used in a query string
 */
const toNullableQueryString = (t: maybeDate): string | null => {
  if (t) {
    const s = JSON.stringify(t);
    return s.substr(1, s.length - 2);
  }
  return null;
};

/**
 * check if the string is a valid date string
 * @param t - an object that can be converted to a Date object
 * @returns true if the string is a valid date string
 */
const isDateString = (t: string): boolean => {
  if (t.match(DATE_STRING_REGEXP)) {
    return true;
  }
  return false;
};

/**
 * get the string representation of the Japanese academic year of the Date object.
 * @param t - an object that can be converted to a Date object
 * @returns the string representation of the Japanese academic year
 */
const getAcademicYear = (t: maybeDate): string => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  const target = _getAcademicYearNumber(t);
  const thisYear = _getAcademicYearNumber(new Date());
  const yd = thisYear - target;
  if (object.In(yd, 12, 11, 10, 9, 8, 7)) {
    return `小${yd - 15}`;
  }
  if (object.In(yd, 13, 14, 15)) {
    return `中${yd - 12}`;
  }
  if (object.In(yd, 16, 17, 18)) {
    return `高${yd - 15}`;
  }
  if (object.In(yd, 19, 20, 21, 22)) {
    return `大${yd - 18}`;
  }
  return `社${yd - 22}`;
};

/**
 * get the human age of the Date object.
 * @param t - an object that can be converted to a Date object
 * @returns the human age
 */
const getAge = (t: maybeDate): number => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return -1;
  }
  const target = getDate(convertTimezone(t, TimezoneOffset.JST));
  const thisYear = getDate(convertTimezone(new Date(), TimezoneOffset.JST));
  return Math.floor((thisYear.getTime() - target.getTime()) / (N_DAYS * 365));
};

const _getAcademicYearNumber = (t: Date): number => {
  const jpDate = convertTimezone(t, TimezoneOffset.JST);
  if (jpDate.getMonth() < 3) {
    // Jan, Feb, Mar
    return jpDate.getFullYear() - 1;
  }
  return jpDate.getFullYear();
};

export {
  TimezoneOffset,
  toWeekdayString,
  toShortWeekdayString,
  toDateString,
  toTimeString,
  toDateTimeString,
  addDate,
  parseDate,
  getToday,
  getDate,
  getTimeOffset,
  getAcademicYear,
  getAge,
  toQueryString,
  toNullableQueryString,
  isDate,
  isDateString
};
