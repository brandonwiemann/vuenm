/* eslint-disable @typescript-eslint/no-explicit-any */
import { HasId, Maybe } from '../types';
import { isValidDate } from './date.utils';
import {
  hasKey, isArray, isNumber, isString
} from './type.utils';
import qs from 'qs';

const QUERY_STRING_REGEX = /^\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/;

/**
 * Returns a random string beginning with an alphanumeric character.
 * Not truly unique but good enough for one-off elements.
 * @param prexifx - An optional prefix for the resulting string
 */
export function getRandomId(prefix = ''): string {
  return prefix + Math.random().toString(36).replace(/[^a-z]+/g, '').slice(2, 10);
}

/**
 * Case-insensitive alias for localeCompare of str2 to str1
 * @param str1 The string to compare against
 * @param str2 The string to compare
 */
export function compareStr(str1: Maybe<string>, str2: Maybe<string>): number {
  if (!str1 && !str2) {
    return 0;
  }

  if (!str1) {
    return -1;
  }

  if (!str2) {
    return 1;
  }

  return str1.toLocaleLowerCase().localeCompare(str2.toLocaleLowerCase());
}

/**
 * Returns the value as an app-common string format
 * @param val
 */
export function toString(val: unknown): string {
  if (isValidDate(val)) {
    return new Date(val).toISOString();
  }
  if (isString(val)) {
    return val;
  }
  if (isNumber(val)) {
    return val.toLocaleString();
  }
  return JSON.stringify(val);
}

/**
 * Attempts to format the given value as a user-friendly string
 * @param str The value
 * @param tryParseDate Attempt to parse the value into a date
 */
export function toDisplayString(str: unknown, tryParseDate?: boolean): string {
  if (!str) {
    return '';
  }

  if (tryParseDate) {
    if (isValidDate(str)) {
      return new Date(str).toLocaleDateString();
    }
  }

  if (isString(str)) {
    return str;
  }

  if (isNumber(str)) {
    return str.toLocaleString();
  }

  return JSON.stringify(str);
}

/**
 * Gets the first letter of each string-separated word
 * @param str The string value
 * @param maxLength The maximum initials to return
 */
export function getInitials(str: string, maxLength = 2) {
  return str.split(' ').map(x => x.replace(' ', '').charAt(0).toLocaleUpperCase())
    .slice(0, maxLength).join('');
}

export function getNameInitials(firstOrFullName: string, lastName?: string) {
  if (lastName) {
    // Assume firstOrFullName is the first name
    return `${firstOrFullName.charAt(0).toLocaleUpperCase()}${lastName.charAt(0).toLocaleUpperCase()}`;
  }

  // firstOrFullName could be "last, first", "first last" or just "first"
  const name = firstOrFullName.split(',').reverse().join(' ').trim();
  return getInitials(name);
}


/**
 * Gets the id from the given key or a random default
 * @param item The item to id
 * @param key The key of the item id property
 */
export function getIdOrDefault<T = unknown>(item: T, key: keyof T | string): string {
  return hasKey(item, key) && isString(item[key])
    ? item[key] as string
    : getRandomId();
}

/**
 * Creates a query string from an object using qs library with sensible defaults.
 * This ensures consistency with Express/NestJS query parsing behavior.
 *
 * @param initialObj - The object to convert to a query string
 * @param options - Optional qs stringify options to override defaults
 * @returns Query string (without leading '?')
 */
export const toQueryString = <T extends object>(
  initialObj: T,
  options?: qs.IStringifyOptions
): string => {
  const defaultOptions: qs.IStringifyOptions = {
    addQueryPrefix: false, // Don't add leading '?'
    arrayFormat: 'brackets', // fileIds[]=123&fileIds[]=456 (matches Express default)
    encode: true, // URL encode values
  };

  return qs.stringify(initialObj, { ...defaultOptions, ...options });
};

/**
 * Parses a query string into an object using qs library with sensible defaults.
 * This ensures consistency with Express/NestJS query parsing behavior.
 *
 * @param str - The query string to parse (with or without leading '?')
 * @param options - Optional qs parse options to override defaults
 * @returns Parsed object
 */
export const parseQueryString = (
  str: string,
  options?: qs.IParseOptions
): qs.ParsedQs => {
  const defaultOptions: qs.IParseOptions = {
    arrayLimit: 100, // Reasonable limit for arrays
    parseArrays: true, // Parse bracket notation as arrays
    ignoreQueryPrefix: true, // Ignore leading '?'
  };

  const finalOptions = { ...defaultOptions, ...options };
  return qs.parse(str, finalOptions) as qs.ParsedQs;
}

export function getItemId<T extends HasId = HasId>(itemOrId: T | string): string {
  return isString(itemOrId) ? itemOrId : itemOrId.id;
}

/**
 * Simple *insecure* hash for algorithmic use where security isn't needed.
 * @param str The string to hash
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0]!.toString(36);
}

/**
 * Converts a string to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/\s+/g, '').replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => {
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

/**
 * Converts a string to snake_case
 */
export function toSnakeCase(str: string, toLowerCase = false): string {
  return toLowerCase
    ? str.replace(/\s+/g, '_').toLowerCase()
    : str.replace(/\s+/g, '_');
}

/**
 * Converts a camelCase string to snake_case
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Converts a snake_case string to camelCase
 */
export function snakeToCamelCase(str: string): string {
  return str.toLowerCase().replace(/([-_][a-z])/g, g =>
    g.toUpperCase().replace('-', '')
  );
}

// Converts a string into a URL slug (lowercase characters, numbers, hyphens, and underscores only)
// https://gist.github.com/max10rogerio/c67c5d2d7a3ce714c4bc0c114a3ddc6e
export function slugify(...args: string[]): string {
  const value = args.join(' ');

  return value
    .normalize('NFD') // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, '-'); // separator
}

export function stringify(val: unknown, defaultVal = ''): string {
  if (typeof val === 'string') {
    return val;
  }
  if (typeof val === 'number') {
    return val.toString();
  }
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }
  if (!val) {
    return defaultVal;
  }
  if (val instanceof Date) {
    return val.toISOString();
  }
  return JSON.stringify(val);
}

/**
 *
 * @param template The string template with vars in {} brackets
 * @param values An ordered array of values matching the number of placeholders
 * @returns string
 */
export function replacePlaceholders(template: string, values: string[]): string {

  if (!isArray(values) || !values.length) {
    return template;
  }

  // Check that all values are strings
  if (!values.every(value => typeof value === 'string')) {
    throw new Error('All values must be strings');
  }

  // Count the number of placeholders in the template
  const placeholderCount = (template.match(/\{.*?\}/g) || []).length;

  // Check that the number of placeholders matches the length of the values array
  if (placeholderCount !== values.length) {
    throw new Error('The number of placeholders in the template must match the number of values');
  }

  let index = 0;
  return template.replace(/\{.*?\}/g, () => {
    const value = values[index++];
    if (value === undefined) {
      throw new Error(`No value provided for placeholder at index ${index - 1}`);
    }
    return value;
  });
}

export function truncate(val: string | null | undefined, maxLength: number = 50, ellipsis = '...'): string {
  if (!val) {
    return '';
  }

  return val.length <= maxLength
    ? val
    : val.substring(0, maxLength - ellipsis.length) + ellipsis;
}

export const titleCase = (val: string, gapWords = ['and', 'or']): string => {
  return val
    .toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .split(' ')
    .map(word => gapWords.includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const tryParseErrorMessage = (err: unknown, defaultMessage?: string): string | undefined => {
  if (typeof err === 'string') {
    return err;
  }
  if (hasKey(err, 'message') && typeof err.message === 'string') {
    return err.message;
  }
  return defaultMessage;
}
