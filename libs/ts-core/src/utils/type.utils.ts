
import { AnyStringKeyedObject, Maybe, ObjectKey, DateString, DateRange, DateTime } from '../types';
import { isDateString, isValidDate, toDateString } from './date.utils';

export function isString(val: unknown): val is string {
  return typeof val === 'string';
}

export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val);
}

export function isObject(val: unknown): val is AnyStringKeyedObject {
  return !!val && typeof val === 'object' && !Array.isArray(val);
}

export function isArray(val: unknown): val is Array<unknown> {
  return Array.isArray(val);
}

export function isBool(val: unknown): val is boolean {
  return typeof val === 'boolean';
}

export function isDateObject(val: unknown): val is Date {
  return isObject(val) && Object.prototype.toString.call(val) === '[object Date]';
}

export function isStringRecord(val: unknown): boolean {
  return isObject(val) && Object.keys(val).every(x => isString(x));
}

export function isIterable(val: unknown): val is Iterable<unknown> {
  return isArray(val) || hasKey(val, Symbol.iterator) && typeof val[Symbol.iterator] === 'function';
}

export function isStringList(val: unknown): val is Iterable<string> {
  return isIterable(val) && Array.from(val).every(isString);
}

export function isNullOrUndefined<T>(val: Maybe<T>): boolean {
  return typeof val === 'undefined' || val === null;
}

export function isNotNullOrUndefined<T>(val: Maybe<T>): boolean {
  return !isNullOrUndefined(val);
}

export function isNumberList(val: unknown): val is Iterable<number> {
  return isIterable(val) && Array.from(val).every(isNumber);
}

export function hasKey<TKey extends ObjectKey>
(val: unknown, key: TKey): val is { [key in TKey]: unknown } {
  if (!val || !key) {
    return false;
  }
  return isObject(val) && (key in val);
}

export function hasKeyWithValue<TKey extends ObjectKey = string, TValue = unknown>
(subject: unknown, key: TKey, value: TValue): subject is { [key in TKey]: TValue } {
  return hasKey(subject, key) && subject[key] === value;
}

export function tryParseBool(val: unknown): Maybe<boolean> {
  if (isBool(val)) {
    return val;
  }

  if (isString(val)) {
    const v = val.toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes') {
      return true;
    }
    if (v === 'false' || v === '0' || v === 'no') {
      return false;
    }
  }

  return undefined;
}

export function tryParseDate(val: unknown): Maybe<Date> {
  if (!val) {
    return undefined;
  }

  if (isDateObject(val)) {
    return val;
  }

  try {
    const date = new Date(val as string);
    return isNaN(date.getTime()) ? undefined : date;
  } catch (err) {
    console.warn('Failed to parse date range from val: ', val, err);
    return undefined;
  }
}

export function tryParseDateString(val: unknown): Maybe<DateString> {
  if (!val) {
    return undefined;
  }

  if (!isDateString(val)) {
    return undefined;
  }

  const date = new Date(val);
  return isValidDate(date) ? toDateString(date) : undefined;
}

export function tryParseDateRange(val: unknown): Maybe<DateRange> {
  if (typeof val === 'string') {
    try {
      const range = JSON.parse(val) as [string, string];
      return tryParseDateRange(range);
    } catch (err) {
      console.warn('Failed to parse date range from val: ', val, err);
      return undefined;
    }
  }

  if (isArray(val) && val.length === 2) {
    const [start, end] = val;

    if (isDateObject(start) && isDateObject(end)) {
      return [toDateString(start), toDateString(end)];
    }

    const startDate = tryParseDate(start);
    const endDate = tryParseDate(end);

    if (startDate && endDate) {
      return [toDateString(startDate), toDateString(endDate)];
    }
  }
}

export function isDateTime(val: unknown): val is DateTime {
  return tryParseDate(val) !== undefined;
}

export function isDateRange(val: unknown): val is DateRange {
  return tryParseDateRange(val) !== undefined;
}

export function tryParseArray<T>(val: unknown, typeTest?: (val: unknown) => boolean): Maybe<T[]> {
  let arr: unknown[] | undefined = undefined;


  if (isArray(val)) {
    arr = val;
  } else if (isIterable(val)) {
    arr = Array.from(val);
  } else if (typeof val === 'string') {
    try {
      arr = tryParseDateRange(JSON.parse(val));
    } catch (err) {
      // TODO: Handle error
    }
    try {
      arr = JSON.parse(val);
    } catch (err) {
      return undefined;
    }
  }


  if (!Array.isArray(arr)) {
    return undefined;
  }


  return arr?.every(x => !typeTest || typeTest(x))
    ? arr as T[]
    : undefined;
}

export function toFormData(data: unknown): FormData {
  if (data instanceof FormData) {
    return data;
  }
  if (data instanceof HTMLFormElement) {
    return new FormData(data);
  }
  if (isObject(data)) {
    const formData = new FormData();
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key]);
      }
    }
    return formData;
  }
  console.warn('Cannot convert argument to form data', data);
  return new FormData();
}

/**
 * Tries to parse a property from an object
 * @param obj - The object to parse the property from
 * @param key - The key or nested key in dotted notation
 * @returns The parsed property if found, undefined otherwise
 */
export const tryParseProperty = <T>(obj: unknown, key: string): T | undefined => {
  if (!isObject(obj)) {
    return undefined;
  }

  if (key.includes('.')) {
    const [k, ...rest] = key.split('.');
    return tryParseProperty(obj[k as keyof typeof obj], rest.join('.'));
  }

  return obj[key as keyof typeof obj] as T;
}
