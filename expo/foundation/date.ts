import * as object from "./object";

type maybeDate = Date | string | number | null | undefined;
type maybeNumber = number | null | undefined;

const N_MINUTES = 60 * 1000;
const N_HOURS = 60 * N_MINUTES;
const N_DAYS = 24 * N_HOURS;
const N_WEEKS = 7 * N_DAYS;

const INVALID_DATE_STRING = "-";
const DATE_STRING_REGEXP = /\d{4}\/\d{2}\/\d{2}/;

const TimezoneOffset = {
  JST: -9 * 60,
  UTC: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDate = (t: any): boolean => {
  return t && t.getFullYear;
};

const isInvalidDate = (t: Date): boolean => {
  return t.toString() === "Invalid Date";
};

const n = (d: number): string => {
  if (d >= 10) {
    return "" + d;
  }
  return "0" + d;
};

const parseDate = (t: maybeDate): Date => {
  if (t == null) {
    return new Date("Invalid Date"); // invalid
  }
  if (t instanceof Date) {
    return t;
  }
  if (typeof t === "number") {
    return new Date(t * 1000);
  }
  return new Date(t);
};

const convertTimezone = (
  t: Date,
  timezoneOffset: maybeNumber = TimezoneOffset.JST
): Date => {
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
  ["Sunday", "Sun"],
  ["Monday", "Mon"],
  ["Tuesday", "Tue"],
  ["Wednesday", "Wed"],
  ["Thursday", "Thu"],
  ["Friday", "Fri"],
  ["Saturday", "Sat"],
];

const toWeekdayString = (t: maybeDate): string => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  return WeekdayString[t.getDay()][0];
};

const toShortWeekdayString = (t: maybeDate): string => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  return WeekdayString[t.getDay()][1];
};

const toDateString = (t: maybeDate, timezoneOffset?: maybeNumber): string => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  t = convertTimezone(t, timezoneOffset);
  return `${t.getFullYear()}/${n(t.getMonth() + 1)}/${n(t.getDate())}`;
};

const toTimeString = (t: maybeDate, timezoneOffset?: maybeNumber): string => {
  t = parseDate(t);
  if (isInvalidDate(t)) {
    return INVALID_DATE_STRING;
  }
  t = convertTimezone(t, timezoneOffset);
  return `${n(t.getHours())}:${n(t.getMinutes())}`;
};

const toDateTimeString = (
  t: maybeDate,
  timezoneOffset?: maybeNumber
): string => {
  t = parseDate(t);
  if (!t) {
    return INVALID_DATE_STRING;
  }
  return `${toDateString(t, timezoneOffset)} ${toTimeString(
    t,
    timezoneOffset
  )}`;
};

const getToday = (): Date => {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};

const getDate = (t: maybeDate): Date => {
  t = parseDate(t);
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
};

const getDateOffset = (t: Date): number => {
  return t.getTime() - (t.getTime() % (60 * 60 * 24 * 1000));
};

const getTimeOffset = (t: Date): number => {
  return t.getTime() % (60 * 60 * 24 * 1000);
};

const toQueryString = (t: maybeDate): string => {
  const s = JSON.stringify(t);
  return s.substr(1, s.length - 2);
};

const toNullableQueryString = (t: maybeDate): string | null => {
  if (t) {
    const s = JSON.stringify(t);
    return s.substr(1, s.length - 2);
  }
  return null;
};

const isDateString = (t: string): boolean => {
  if (t.match(DATE_STRING_REGEXP)) {
    return true;
  }
  return false;
};

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
  N_MINUTES,
  N_HOURS,
  N_DAYS,
  N_WEEKS,
  TimezoneOffset,
  toWeekdayString,
  toShortWeekdayString,
  toDateString,
  toTimeString,
  toDateTimeString,
  parseDate,
  getToday,
  getDate,
  getDateOffset,
  getTimeOffset,
  getAcademicYear,
  getAge,
  toQueryString,
  toNullableQueryString,
  isDate,
  isDateString,
};
