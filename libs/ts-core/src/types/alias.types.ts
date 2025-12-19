/* eslint-disable @typescript-eslint/no-explicit-any */

import { WithRequired } from './utility.types';

/**
 * Alias for valid object keys
 */
export type ObjectKey<T extends object = object> = string | number | symbol | keyof T

/**
 * Object with known key of any value
 */
export type WithKey<K extends ObjectKey> = {
    [k in K]: unknown
}

/**
 * Object with key of type Tkey and value of type TValue
 */
export type WithKeyValue<TKey extends ObjectKey, TValue> = {
    [key in TKey]: TValue
}

export type AnyStringKeyedObject = {
    [key: string]: any
}

/**
 * ObjectLike with property identiefier TKey of type T
 */
export interface HasId extends AnyStringKeyedObject {
    id: string
}

export type RequireId<T extends AnyStringKeyedObject> = WithRequired<T, 'id'>

/**
 * Type respresenting any callable function
 */
export type Fn<TArgs = never[], TReturn = unknown> = (args: TArgs) => TReturn

/**
 * A function that returns a boolean given a single argument T
 */
export type Predicate<T = unknown> = Fn<[T], boolean>

/**
 * Represents valid types that can be stored in cache
 */
export type Cacheable = null | number | string | boolean | Array<unknown> | AnyStringKeyedObject;
