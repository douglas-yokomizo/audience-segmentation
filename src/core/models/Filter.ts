/**
 * Filter model representing a condition for segmenting users
 */

export type FilterType = "demographic" | "behavioral" | "geographic" | "custom";

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "greater_than_equals"
  | "less_than_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "in"
  | "not_in"
  | "between";

export interface Filter {
  id: string;
  type: FilterType;
  field: string;
  operator: FilterOperator;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}

// Factory methods for creating different types of filters
export class FilterFactory {
  static createDemographicFilter(
    field: string,
    operator: FilterOperator,
    value: any
  ): Omit<Filter, "id" | "createdAt" | "updatedAt"> {
    return {
      type: "demographic",
      field,
      operator,
      value,
    };
  }

  static createBehavioralFilter(
    field: string,
    operator: FilterOperator,
    value: any
  ): Omit<Filter, "id" | "createdAt" | "updatedAt"> {
    return {
      type: "behavioral",
      field,
      operator,
      value,
    };
  }

  static createGeographicFilter(
    field: string,
    operator: FilterOperator,
    value: any
  ): Omit<Filter, "id" | "createdAt" | "updatedAt"> {
    return {
      type: "geographic",
      field,
      operator,
      value,
    };
  }

  static createCustomFilter(
    field: string,
    operator: FilterOperator,
    value: any
  ): Omit<Filter, "id" | "createdAt" | "updatedAt"> {
    return {
      type: "custom",
      field,
      operator,
      value,
    };
  }
}
