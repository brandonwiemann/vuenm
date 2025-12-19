/**
 * JSON types compatible with Prisma's InputJsonValue
 * These types align with what Prisma expects for JSON fields
 */

// Primitive JSON values
export type JsonPrimitive = string | number | boolean | null;

// JSON array type
export type JsonArray = JsonValue[];

// JSON object type
export type JsonObject = { [key: string]: JsonValue };

// Union of all possible JSON values
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// For nullable JSON fields in Prisma
export type JsonValueOrNull = JsonValue | null;

// For optional JSON fields
export type JsonValueOrUndefined = JsonValue | undefined;

// Combined nullable and optional
export type JsonValueOptional = JsonValue | null | undefined;