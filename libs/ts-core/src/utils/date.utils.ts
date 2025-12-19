import { Maybe, DateString, DateTime } from '../types';
import { isDateObject, isDateTime, isNumber, isString } from './type.utils';

export const UNIX_EPOCH_MIN = 1635638400;

/**
 * RegExp to test a string for a ISO 8601 Date spec
 *  YYYY
 *  YYYY-MM
 *  YYYY-MM-DD
 *  YYYY-MM-DDThh:mmTZD
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see: https://www.w3.org/TR/NOTE-datetime
 * @type {RegExp}
 */
export const ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;


/**
 * RegExp to test a string for a full ISO 8601 Date
 * Does not do any sort of date validation, only checks if the string is according to the ISO 8601 spec.
 *  YYYY-MM-DDThh:mm:ss
 *  YYYY-MM-DDThh:mm:ssTZD
 *  YYYY-MM-DDThh:mm:ss.sTZD
 * @see: https://www.w3.org/TR/NOTE-datetime
 * @type {RegExp}
 */
export const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

/**
 * Matches format of Date.prototype.toUTCString()
 */
export const UTC_DATE_STRING = /[A-Za-z]{3}, \d{2} [A-Za-z]{3} [0-9]{4} (.*) GMT/;

export const DATE_STRING = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Determines if the given value is a valid date according to expected formats
 * @param val
 */
export function isValidDate(val: unknown): val is Date | number | string {
  if (isDateObject(val)) {
    return true;
  }
  if (isString(val)) {
    // Check if string is in date-only format of yyyy-mm-dd
    return (val.match(/^\d{4}-\d{2}-\d{2}$/) !== null) || ISO_8601_FULL.test(val) || UTC_DATE_STRING.test(val);
  }
  if (isNumber(val)) {
    // Unix epoch
    return val >= UNIX_EPOCH_MIN && String(val).length === 10;
  }
  return false;
}

export function isDateString(val: unknown): val is DateString {
  if (!isString(val)) {
    return false;
  }
  return DATE_STRING.test(val);
}

export function toDate(val: Maybe<string | number | DateTime>): Maybe<Date> {
  if (isDateObject(val)) {
    return val as Date;
  }
  return isValidDate(val)
    ? new Date(val)
    : undefined;
}

export function toDateString(date: Date): DateString {
  return date.toISOString().split('T')[0] as DateString;
}

export function toISO(val: string | number) {
  return new Date(val).toISOString();
}

export function toEpoch(val: string | number) {
  return new Date(val).getTime();
}

export function compareDates(date1: Maybe<string | number>, date2: Maybe<string | number>): number {
  if (!date1 && !date2) {
    return 0;
  }

  if (!date1) {
    return -1;
  }

  if (!date2) {
    return 1;
  }

  return new Date(date1).getTime() - new Date(date2).getTime();
}

export function secondsInMs(seconds: number): number {
  return seconds * 1000;
}

export function minutesInMs(minutes: number): number {
  return secondsInMs(minutes * 60);
}

export function hoursInMs(hours: number): number {
  return minutesInMs(hours * 60);
}

export function toDateObject(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  // If it's already a full ISO string, just use new Date(date)
  if (/^\d{4}-\d{2}-\d{2}T/.test(date)) return new Date(date);
  // If it's a date-only string, append T00:00:00Z to make it UTC midnight
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return new Date(date + 'T00:00:00.000Z');
  return new Date(date);
}

export function toDateOnlyString(date: Date | string | null | undefined): string | null {
  if (!date) return null;
  // If already a string in YYYY-MM-DD, return as is
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  // Otherwise, format as YYYY-MM-DD
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}
