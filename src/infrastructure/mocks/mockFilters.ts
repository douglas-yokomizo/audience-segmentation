import { Filter, FilterOperator, FilterType } from "../../core/models/Filter";
import { v4 as uuidv4 } from "uuid";

// Helper function to generate a random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper function to pick a random item from an array
const randomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Sample data for generating mock filters
const demographicFields = ["age", "gender", "income", "occupation"];

const behavioralFields = [
  "totalSpent",
  "purchaseHistory",
  "lastActive",
  "hasSubscription",
  "subscriptionTier",
  "loyaltyTier",
];

const geographicFields = ["country", "city"];

const customFields = ["interests", "tags", "deviceType", "browser"];

const operators: FilterOperator[] = [
  "equals",
  "not_equals",
  "greater_than",
  "less_than",
  "greater_than_equals",
  "less_than_equals",
  "contains",
  "not_contains",
  "starts_with",
  "ends_with",
  "in",
  "not_in",
  "between",
];

// Generate a single mock filter
const generateMockFilter = (type: FilterType): Filter => {
  let field: string;
  let operator: FilterOperator;
  let value: any;

  // Select field based on filter type
  switch (type) {
    case "demographic":
      field = randomItem(demographicFields);
      break;
    case "behavioral":
      field = randomItem(behavioralFields);
      break;
    case "geographic":
      field = randomItem(geographicFields);
      break;
    case "custom":
      field = randomItem(customFields);
      break;
    default:
      field = randomItem([
        ...demographicFields,
        ...behavioralFields,
        ...geographicFields,
        ...customFields,
      ]);
  }

  // Select appropriate operator and value based on field
  switch (field) {
    case "age":
      operator = randomItem(["equals", "greater_than", "less_than", "between"]);
      if (operator === "between") {
        value = [25, 45];
      } else {
        value = Math.floor(Math.random() * 60) + 18; // 18-78
      }
      break;

    case "gender":
      operator = randomItem(["equals", "not_equals"]);
      value = randomItem(["Male", "Female", "Other"]);
      break;

    case "income":
      operator = randomItem(["greater_than", "less_than", "between"]);
      if (operator === "between") {
        const min = Math.floor(Math.random() * 80000) + 20000;
        value = [min, min + Math.floor(Math.random() * 50000)];
      } else {
        value = Math.floor(Math.random() * 150000) + 20000; // 20k-170k
      }
      break;

    case "occupation":
      operator = randomItem(["equals", "not_equals", "contains"]);
      value = randomItem([
        "Engineer",
        "Designer",
        "Manager",
        "Developer",
        "Analyst",
        "Consultant",
      ]);
      break;

    case "totalSpent":
      operator = randomItem(["greater_than", "less_than", "between"]);
      if (operator === "between") {
        const min = Math.floor(Math.random() * 900) + 100;
        value = [min, min + Math.floor(Math.random() * 1000)];
      } else {
        value = Math.floor(Math.random() * 2000) + 100; // 100-2100
      }
      break;

    case "lastActive":
      operator = randomItem(["greater_than", "less_than"]);
      const now = new Date();
      const daysAgo = Math.floor(Math.random() * 90) + 1; // 1-90 days ago
      const date = new Date();
      date.setDate(now.getDate() - daysAgo);
      value = date.toISOString();
      break;

    case "hasSubscription":
      operator = "equals";
      value = randomItem([true, false]);
      break;

    case "subscriptionTier":
      operator = randomItem(["equals", "not_equals"]);
      value = randomItem(["Basic", "Standard", "Premium", "Ultimate"]);
      break;

    case "loyaltyTier":
      operator = randomItem(["equals", "not_equals"]);
      value = randomItem(["Bronze", "Silver", "Gold", "Platinum"]);
      break;

    case "country":
      operator = randomItem(["equals", "not_equals", "in"]);
      if (operator === "in") {
        value = randomItem([
          ["USA", "Canada", "UK"],
          ["Germany", "France", "Spain"],
          ["Japan", "China", "India"],
        ]);
      } else {
        value = randomItem([
          "USA",
          "UK",
          "Canada",
          "Australia",
          "Germany",
          "France",
        ]);
      }
      break;

    case "city":
      operator = randomItem(["equals", "not_equals", "contains"]);
      value = randomItem([
        "New York",
        "London",
        "Paris",
        "Tokyo",
        "Sydney",
        "Berlin",
      ]);
      break;

    case "interests":
      operator = randomItem(["contains", "not_contains"]);
      value = randomItem([
        "Travel",
        "Technology",
        "Sports",
        "Music",
        "Art",
        "Food",
      ]);
      break;

    case "tags":
      operator = randomItem(["contains", "not_contains"]);
      value = randomItem([
        "High Value",
        "New Customer",
        "Inactive",
        "Promotion Responsive",
      ]);
      break;

    case "deviceType":
      operator = randomItem(["equals", "not_equals"]);
      value = randomItem(["Mobile", "Desktop", "Tablet"]);
      break;

    case "browser":
      operator = randomItem(["equals", "not_equals"]);
      value = randomItem(["Chrome", "Firefox", "Safari", "Edge"]);
      break;

    default:
      operator = randomItem(operators);
      value = "default value";
  }

  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);

  const createdAt = randomDate(sixMonthsAgo, now);
  const updatedAt = randomDate(createdAt, now);

  return {
    id: uuidv4(),
    type,
    field,
    operator,
    value,
    createdAt,
    updatedAt,
  };
};

// Generate a specified number of mock filters
export const generateMockFilters = (count: number): Filter[] => {
  const filters: Filter[] = [];
  const filterTypes: FilterType[] = [
    "demographic",
    "behavioral",
    "geographic",
    "custom",
  ];

  for (let i = 0; i < count; i++) {
    const type = filterTypes[i % filterTypes.length];
    filters.push(generateMockFilter(type));
  }

  return filters;
};

// Generate a set of predefined filters for common use cases
export const generatePredefinedFilters = (): Filter[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  return [
    // Demographic filters
    {
      id: uuidv4(),
      type: "demographic",
      field: "age",
      operator: "greater_than",
      value: 30,
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      type: "demographic",
      field: "gender",
      operator: "equals",
      value: "Female",
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      type: "demographic",
      field: "income",
      operator: "greater_than",
      value: 75000,
      createdAt: yesterday,
      updatedAt: now,
    },

    // Behavioral filters
    {
      id: uuidv4(),
      type: "behavioral",
      field: "totalSpent",
      operator: "greater_than",
      value: 1000,
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      type: "behavioral",
      field: "hasSubscription",
      operator: "equals",
      value: true,
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      type: "behavioral",
      field: "loyaltyTier",
      operator: "equals",
      value: "Gold",
      createdAt: yesterday,
      updatedAt: now,
    },

    // Geographic filters
    {
      id: uuidv4(),
      type: "geographic",
      field: "country",
      operator: "in",
      value: ["USA", "Canada", "UK"],
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      type: "geographic",
      field: "city",
      operator: "equals",
      value: "New York",
      createdAt: yesterday,
      updatedAt: now,
    },

    // Custom filters
    {
      id: uuidv4(),
      type: "custom",
      field: "interests",
      operator: "contains",
      value: "Technology",
      createdAt: yesterday,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      type: "custom",
      field: "deviceType",
      operator: "equals",
      value: "Mobile",
      createdAt: yesterday,
      updatedAt: now,
    },
  ];
};

// Export a set of mock filters
export const mockFilters = generatePredefinedFilters();
