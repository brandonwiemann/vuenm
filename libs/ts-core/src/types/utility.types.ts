/* eslint-disable @typescript-eslint/no-explicit-any */
/*============================================================
 == Utility types are modifiers of the given generic type(s)
/============================================================*/

import { AnyStringKeyedObject } from './alias.types';

/**
 * All possible value types of an object
 */
export type ValuesOf<T> = T[keyof T];

export type ValuesOfArr<T extends unknown[]> = T[number];

/**
 * Value of property at index K
 */
export type ValueOf<T, K extends keyof T> = T[K];
/**
 * Keys of type T shared witbh type T2
 */
export type SharedKeys<T, T2> = {
  [K in Extract<keyof T, keyof T2>]: T[K]
}

/**
 * Keys of type T2 not shared witbh type T1
 */
export type ExcludedKeys<T, T2> = {
  [K in Exclude<keyof T, keyof T2>]: T[K]
}

/**
 * Make an optional key (K) on type T required
 */
export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Make a required key (K) of type (T) optional
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Make all keys of tyoe T optional except specified keys
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

/**
 * A value (T) that is possibly undefined
 */
export type Maybe<T> = T | undefined

/**
 * All arguments of function T
 */
export type ArgumentsOf<T> = T extends (...args: infer U) => unknown ? U : never;

/**
 * All arguments of function T
 */
export type ExtractFnArgs<T> = T extends (...args: infer U) => any ? U : never;

/**
 * First argument of function T
 */
export type FirstArg<T> = ArgumentsOf<T>[0]

/**
 * Argument type of function T at index TIndex
 */
export type ArgAt<T, TIndex extends number> = ArgumentsOf<T>[TIndex]

/**
 * Any function that returns a value of type T
 */
export type Returns<T> = (...args: any) => T;

/**
 * Any function that returns a promise of type T
 */
export type ReturnsAsync<T> = Returns<Promise<T>>

// Extract <T> from ReturnsAsync<T>
export type AwaitedPromise<T extends ReturnsAsync<any>> = T extends ReturnsAsync<infer U> ? U : never;

// Pick properties of type V
export type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>

// Type helper for Object.entries
// export type Entries<T> = {
//     [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]]
// }[keyof T][];

export type Entries<T> = {
    [K in keyof T]-?: [K, T[K]];
}[keyof T][];

/*============================================================
 == Types for dotted string access of object properties
/============================================================*/

type Join<
  Key,
  Previous,
  TKey extends number | string = string
> = Key extends TKey
  ? Previous extends TKey
    ? `${Key}${'' extends Previous ? '' : '.'}${Previous}`
    : never
  : never;

type Previous = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

// Represents a dotted path string to a property of an object
export type DottedObjNotation<
  TEntity extends AnyStringKeyedObject,
  TDepth extends number = 3
> = [TDepth] extends [never]
  ? never
  : TEntity extends AnyStringKeyedObject
  ? {
      [Key in keyof TEntity]-?: Key extends string
        ? `${Key}` | Join<Key, DottedObjNotation<TEntity[Key], Previous[TDepth]>>
        : never;
    }[keyof TEntity]
  : '';


// Extracts type of an object property at the given dotted path string
export type ExtractFromDottedPath<T extends AnyStringKeyedObject, TPath extends string> = TPath extends DottedObjNotation<T>
  ? TPath extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? ExtractFromDottedPath<T[Key], Rest>
      : never
    : TPath extends keyof T
    ? T[TPath]
    : never
  : never;
