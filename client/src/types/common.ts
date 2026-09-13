// Common, cross-cutting utility types -- not specific to any one feature.
// Promoted here only once a second feature needs a given type
// (FRONTEND_ARCHITECTURE.md Section 3's promotion rule).

// Every monetary field in this application is an integer number of cents
// (FRONTEND_ARCHITECTURE.md Section 3's currency contract). A branded type
// prevents a raw `number` (e.g. a count, a percentage) from being passed
// somewhere a cents value is expected, without adding runtime overhead.
export type Cents = number & { readonly __brand: 'Cents' };

export function asCents(value: number): Cents {
  return value as Cents;
}

// A resource identifier as returned by the API -- always a string
// (API_SPECIFICATION.md Section 3's ID format standard), never a raw ObjectId.
export type EntityId = string;

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}
