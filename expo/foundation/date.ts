import * as object from './object';
/**
 * provide a helper functions for Date object.
 *
 * You may have a various type of representation of a date in your application so this module also help you to convert the representation to a Date object.
 *
 * @module
 */

export type maybeDate = Date | string | number | null | undefined;
export type maybeNumber = number | null | undefined;

const N_MINUTES = 60 * 1000;
const N_HOURS = 60 * N_MINUTES;
const N_DAYS = 24 * N_HOURS;

const INVALID_DATE_STRING = '-';

export type Timezone = number;

export const TimezoneOffset: { [key: string]: Timezone } = {
  JST: -9 * 60,
  UTC: 0
};

/**
 * check if the Date object is invalid
 * @param t - an object that can be converted to a Date object
 * @returns true if t is an invalid Date object
 */
export function isInvalidDate(t: Date | undefined | null) {
  if (t === undefined || t === null) {
    return true;
  }
  return t.toString() === 'Invalid Date';
}

function n(d: number) {
  if (d >= 10) {
    return '' + d;
  }
  return '0' + d;
}

/**
 * add a number of units of time to a Date object
 * @param t - an object that can be converted to a Date object
 * @param num - number of units to add
 * @param unit - unit of time to add
 * @returns a new Date object with the added time
 */
export function addDate(t: maybeDate, num: number, unit: 'minute' | 'hour' | 'day') {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return t;
  }
  switch (unit) {
    case 'minute':
      return new Date(t.getTime() + num * N_MINUTES);
    case 'hour':
      return new Date(t.getTime() + num * N_HOURS);
    case 'day':
      return new Date(t.getTime() + num * N_DAYS);
  }
}

export function parseDate(t: maybeDate) {
  if (t == null) {
    return new Date('Invalid Date'); // invalid
  }
  if (t instanceof Date) {
    return t;
  }
  return new Date(t);
}

export function convertTimezone(t: Date, timezoneOffset: maybeNumber = TimezoneOffset.JST) {
  if (timezoneOffset == null) {
    return t;
  }
  const diff = timezoneOffset - t.getTimezoneOffset();
  if (diff === 0) {
    return t;
  }
  return new Date(t.getTime() - diff * 60 * 1000);
}

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
export function toWeekdayString(t: maybeDate) {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  return WeekdayString[t.getDay()][0];
}

/**
 * convert getDay() value to a short string ('Sun', 'Mon', ...etc).
 * @param t - an object that can be converted to a Date object
 * @returns a short string of the weekday
 */
export function toShortWeekdayString(t: maybeDate) {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  return WeekdayString[t.getDay()][1];
}

/**
 * convert a Date object to a string in the format of 'yyyy/mm/dd'
 * @param t - an object that can be converted to a Date object
 * @param timezoneOffset - timezone offset in minutes
 * @returns a string of the date
 */
export function toDateString(t: maybeDate, timezoneOffset?: maybeNumber) {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  t = convertTimezone(t, timezoneOffset);
  return `${t.getFullYear()}/${n(t.getMonth() + 1)}/${n(t.getDate())}`;
}

/**
 * convert a Date object to a string in the format of 'HH:MM'
 * @param t - an object that can be converted to a Date object
 * @param timezoneOffset - timezone offset in minutes
 * @returns a string of the time
 */
export function toTimeString(t: maybeDate, timezoneOffset?: maybeNumber) {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  t = convertTimezone(t, timezoneOffset);
  return `${n(t.getHours())}:${n(t.getMinutes())}`;
}

/**
 * convert a Date object to a string in the format of 'yyyy/mm/dd HH:MM'
 * @param t - an object that can be converted to a Date object
 * @param timezoneOffset - timezone offset in minutes
 * @returns a string of the datetime
 */
export function toDateTimeString(t: maybeDate, timezoneOffset?: maybeNumber) {
  t = parseDate(t);
  if (!t) {
    return INVALID_DATE_STRING;
  }
  return `${toDateString(t, timezoneOffset)} ${toTimeString(t, timezoneOffset)}`;
}

/**
 * get today as a Date object
 * @returns a Date object of today
 */
export function getToday() {
  return getDate(new Date());
}

/**
 * get a Date object of the date part of the object
 * @param t - an object that can be converted to a Date object
 * @returns the date
 */
export function getDate(t: maybeDate) {
  t = parseDate(t);
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

/**
 * get the query string representation of the Date
 * @param t - an object that can be converted to a Date object
 * @returns a string that can be used in a query string
 */
export function toQueryString(t: maybeDate) {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return '';
  }
  const s = JSON.stringify(t);
  return s.substring(1, s.length - 2);
}

/**
 * get the query string representation of the Date but null if the Date is invalid
 * @param t - an object that can be converted to a Date object
 * @returns a string that can be used in a query string
 */
export function toNullableQueryString(t: maybeDate) {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return 'null';
  }
  const s = JSON.stringify(t);
  return s.substring(1, s.length - 2);
}

/**
 * get the duration between two Date objects
 * @param t1 maybe a Date object
 * @param t2 maybe a Date object
 * @param unit unit of time to return
 * @returns the duration between t1 and t2 in the unit of time
 */
export function getDuration(
  t1: maybeDate,
  t2: maybeDate,
  unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year' = 'day'
) {
  t1 = parseDate(t1);
  t2 = parseDate(t2);
  if (isInvalidDate(t1) || isInvalidDate(t2)) {
    throw new Error('invalid date');
  }
  const value = t1.getTime() - t2.getTime();
  switch (unit) {
    case 'second':
      return Math.floor(value / 1000);
    case 'minute':
      return Math.floor(value / N_MINUTES);
    case 'hour':
      return Math.floor(value / N_HOURS);
    case 'day':
      return Math.floor(value / N_DAYS);
    case 'week':
      return Math.floor(value / (7 * N_DAYS));
    case 'month':
      return Math.floor(value / (30 * N_DAYS));
    case 'year':
      return Math.floor(value / (365 * N_DAYS));
  }
}

/**
 * get the human age of the Date object.
 * @param t - an object that can be converted to a Date object
 * @returns the human age
 */
export function getAge(
  t: maybeDate,
  {
    at = new Date(),
    tz = TimezoneOffset.JST
  }: {
    at?: Date;
    tz?: Timezone;
  }
) {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return -1;
  }
  const target = getDate(convertTimezone(t, tz));
  const thisYear = getDate(convertTimezone(at, tz));
  return getDuration(thisYear, target, 'year');
}

/**
 * get the string representation of the Japanese school year of the Date object.
 * @param t - an object that can be converted to a Date object
 * @returns the string representation of the Japanese academic year
 */
export function getSchoolGrade(t: maybeDate, at: Date = new Date()) {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return '';
  }
  const target = _getSchoolYearNumber(t);
  const thisYear = _getSchoolYearNumber(at);
  const yd = thisYear - target;
  if (object.isIn(yd, 12, 11, 10, 9, 8, 7)) {
    return `小${yd - 6}`;
  }
  if (object.isIn(yd, 13, 14, 15)) {
    return `中${yd - 12}`;
  }
  if (object.isIn(yd, 16, 17, 18)) {
    return `高${yd - 15}`;
  }
  if (object.isIn(yd, 19, 20, 21, 22)) {
    return `大${yd - 18}`;
  }
  if (yd - 22 <= 0) {
    return '';
  }
  return `社${yd - 22}`;
}

const _getSchoolYearNumber = (t: Date): number => {
  const jpDate = convertTimezone(t, TimezoneOffset.JST);
  if (jpDate.getMonth() < 3) {
    // Jan, Feb, Mar
    return jpDate.getFullYear() - 1;
  }
  return jpDate.getFullYear();
};
