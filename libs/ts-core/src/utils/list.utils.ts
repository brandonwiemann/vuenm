import { Entries } from '../types';
import { compareStr } from './string.utils';
import { isObject } from './type.utils';

/**
 * Converts an array of T to a map of T
 */
export function toMap<T>(items: T[], keyFn: (item: T) => string): Map<string, T> {
  return items.reduce((map, item) => map.set(keyFn(item), item), new Map<string, T>());
}

/**
 * Returns a map of the given id'd array by id
 *
 */
export function mapById<T extends { id: string }>(items: T[]): Map<string, T> {
  return toMap(items, (x) => x.id);
}

/**
 * Returns a new array of distinct items
 * @param items
 */
export function distinct<T>(items: T[]): T[] {
  return items.reduce((res, item) => {
    if (!res.includes(item)) {
      res.push(item);
    }
    return res;
  }, [] as T[]);
}

/**
 * Returns a random item from an array
 * @param items
 */
export function randomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error('Cannot get random item from empty array');
  }
  return items[Math.floor(Math.random() * items.length)]!;
}

/**
 * Create an incremeting array of integers
 */
export function nArray(from: number, to: number): number[] {
  const arr = [];
  for (let i = from; i <= to; i++) {
    arr.push(i);
  }
  return arr;
}

/**
 * Sorts a list of strings alphabetically
 * @param items
 * @param descending
 */
export function sortAlphabetically(items: string[], descending = false) {
  return descending
    ? [...items].sort(compareStr).reverse()
    : [...items].sort(compareStr);
}

/**
 * Sorts a list of numbers in given order
 */
export function sortNumerically(items: number[], descending = false) {
  return descending
    ? [...items].sort((a, b) => a - b).reverse()
    : [...items].sort((a, b) => a - b);
}

/**
 * Sorts a list of datetime values in given order
 */
export function sortByDate(items: Date[] | string[], descending = false) {
  // const sorted = [...items].sort(compareDates);
  //
  // return descending
  //   ? sorted.reverse()
  //   : sorted;
  return items;
}

/**
 * Sorts a list of objects by the value of the given key and sort callback
 */
export function sortByKeyValue<T, K extends keyof T>(
  items: T[],
  key: K,
  descending: boolean,
  sortFn: (a: T[K], b: T[K]) => number
): T[] {
  if (!items.every(i => isObject(i))) {
    return items;
  }

  const sorted = [...items].sort((a, b) => sortFn(a[key], b[key]));

  return descending
    ? sorted.reverse()
    : sorted;
}

/**
 * Sorts a list of objects by the string value of the given key
 */
export function sortByStrValue<T extends { [key in K]: string | undefined }, K extends keyof T>(
  items: T[],
  key: K,
  descending = false
): T[] {
  return sortByKeyValue(items, key, descending, compareStr);
}

/**
 * Sorts a list of objects by the date value of the given key
 */
// export function sortByDateValue<T extends { [key in K]: DateTime | undefined }, K extends keyof T>(
//   items: T[],
//   key: K,
//   descending = false
// ): T[] {
//   return sortByKeyValue(items, key, descending, compareDates);
// }

/**
 * Sorts a list of objects by the numeric value of the given key
 */
export function sortByNumberValue<T extends { [key in K]: number | undefined }, K extends keyof T>(
  items: T[],
  key: K,
  descending = false
): T[] {
  return sortByKeyValue(items, key, descending, (a, b) => (a ?? 0) - (b ?? 0));
}

export function pop<T>(items: T[]): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items[items.length - 1];
}

export function sum(items: number[]): number {
  return items.reduce((acc, val) => acc + val, 0);
}

export function avg(items: number[]): number {
  return sum(items) / items.length;
}

export const lastItem = <T>(items: T[]): T | null => items[items.length - 1] ?? null;

/**
 * Toggles a value in an array. If the value exists, it removes it; if it doesn't, it adds it.
 */
export const toggleArrayValue = <T>(array: T[], value: T): T[] => {
  const index = array.indexOf(value);
  return index === -1
    ? [...array, value]
    : array.filter((_, i) => i !== index);
};

/**
 * Type-hinted version of Object.entries
 */
export const entriesOf = <T extends Object>(obj: T): Entries<T> => {
  return Object.entries(obj) as Entries<T>;
}
