import { mockUsers } from "./mockUsers";
import { mockSegments } from "./mockSegments";
import { mockFilters } from "./mockFilters";
import { User } from "../../core/models/User";
import { Segment } from "../../core/models/Segment";
import { Filter } from "../../core/models/Filter";

/**
 * Service for providing mock data to the application
 */
export class MockDataService {
  private static instance: MockDataService;

  private users: User[] = [...mockUsers];
  private segments: Segment[] = [...mockSegments];
  private filters: Filter[] = [...mockFilters];

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of the MockDataService
   */
  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }

    return MockDataService.instance;
  }

  /**
   * Get all mock users
   */
  public getUsers(): User[] {
    return [...this.users];
  }

  /**
   * Get all mock segments
   */
  public getSegments(): Segment[] {
    return [...this.segments];
  }

  /**
   * Get all mock filters
   */
  public getFilters(): Filter[] {
    return [...this.filters];
  }

  /**
   * Get a summary of the mock data
   */
  public getDataSummary(): {
    users: number;
    segments: number;
    filters: number;
  } {
    return {
      users: this.users.length,
      segments: this.segments.length,
      filters: this.filters.length,
    };
  }

  /**
   * Get statistics about the mock data
   */
  public getDataStatistics(): any {
    // Gender distribution
    const genderDistribution = this.users.reduce((acc, user) => {
      acc[user.gender] = (acc[user.gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Age distribution
    const ageGroups = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55-64": 0,
      "65+": 0,
    };

    this.users.forEach((user) => {
      if (user.age < 25) {
        ageGroups["18-24"]++;
      } else if (user.age < 35) {
        ageGroups["25-34"]++;
      } else if (user.age < 45) {
        ageGroups["35-44"]++;
      } else if (user.age < 55) {
        ageGroups["45-54"]++;
      } else if (user.age < 65) {
        ageGroups["55-64"]++;
      } else {
        ageGroups["65+"]++;
      }
    });

    // Country distribution
    const countryDistribution = this.users.reduce((acc, user) => {
      acc[user.country] = (acc[user.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Device type distribution
    const deviceDistribution = this.users.reduce((acc, user) => {
      acc[user.deviceType] = (acc[user.deviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Loyalty tier distribution
    const loyaltyDistribution = this.users.reduce((acc, user) => {
      acc[user.loyaltyTier] = (acc[user.loyaltyTier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Subscription status
    const subscriptionStatus = {
      Subscribed: this.users.filter((user) => user.hasSubscription).length,
      "Not Subscribed": this.users.filter((user) => !user.hasSubscription)
        .length,
    };

    // Average income
    const averageIncome =
      this.users.reduce((sum, user) => sum + user.income, 0) /
      this.users.length;

    // Average total spent
    const averageTotalSpent =
      this.users.reduce((sum, user) => sum + user.totalSpent, 0) /
      this.users.length;

    return {
      genderDistribution,
      ageGroups,
      countryDistribution,
      deviceDistribution,
      loyaltyDistribution,
      subscriptionStatus,
      averageIncome,
      averageTotalSpent,
    };
  }
}
