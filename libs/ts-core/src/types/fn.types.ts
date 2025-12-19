export type MapperFn<TInput, TOutput> = (input: TInput) => TOutput;

export type MockMapperFn<TOutput> = MapperFn<undefined, TOutput>;

export type MockFn<T> = (overrides?: Partial<T>) => T;

export type MockDefaultFn<T> = (defaults: T) => MockFn<T>;
