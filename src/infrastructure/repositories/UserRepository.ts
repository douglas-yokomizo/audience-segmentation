import { IUserRepository } from "../../core/interfaces/IUserRepository";
import { User } from "../../core/models/User";
import { mockUsers } from "../mocks/mockUsers";
import { v4 as uuidv4 } from "uuid";

/**
 * Implementation of the User repository using mock data
 */
export class UserRepository implements IUserRepository {
  private users: User[] = [...mockUsers];

  async getAll(): Promise<User[]> {
    return Promise.resolve([...this.users]);
  }

  async getById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return Promise.resolve(user || null);
  }

  async create(entity: Omit<User, "id">): Promise<User> {
    const newUser: User = {
      ...entity,
      id: `user-${uuidv4()}`,
    };

    this.users.push(newUser);
    return Promise.resolve(newUser);
  }

  async update(id: string, entity: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return Promise.resolve(null);
    }

    const updatedUser = {
      ...this.users[index],
      ...entity,
    };

    this.users[index] = updatedUser;
    return Promise.resolve(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);

    return Promise.resolve(initialLength !== this.users.length);
  }

  async getUsersByFilter(
    field: string,
    operator: string,
    value: any
  ): Promise<User[]> {
    return Promise.resolve(this.filterUsers({ field, operator, value }));
  }

  async getUsersBySegment(segmentId: string): Promise<User[]> {
    // This would typically involve fetching the segment and applying its filters
    // For now, we'll return a subset of users based on the segment ID
    const segmentNumber = parseInt(segmentId.replace("segment-", ""), 10) || 0;
    const startIndex = (segmentNumber * 100) % this.users.length;
    const endIndex = Math.min(startIndex + 100, this.users.length);

    return Promise.resolve(this.users.slice(startIndex, endIndex));
  }

  async searchUsers(query: string): Promise<User[]> {
    const lowercaseQuery = query.toLowerCase();

    return Promise.resolve(
      this.users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(lowercaseQuery) ||
          user.lastName.toLowerCase().includes(lowercaseQuery) ||
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.occupation.toLowerCase().includes(lowercaseQuery) ||
          user.country.toLowerCase().includes(lowercaseQuery) ||
          user.city.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  /**
   * Helper method to filter users based on a filter condition
   */
  private filterUsers(filter: {
    field: string;
    operator: string;
    value: any;
  }): User[] {
    const { field, operator, value } = filter;

    return this.users.filter((user) => {
      const fieldValue = this.getNestedProperty(user, field);

      switch (operator) {
        case "equals":
          return fieldValue === value;

        case "not_equals":
          return fieldValue !== value;

        case "greater_than":
          return fieldValue > value;

        case "less_than":
          return fieldValue < value;

        case "greater_than_equals":
          return fieldValue >= value;

        case "less_than_equals":
          return fieldValue <= value;

        case "contains":
          if (Array.isArray(fieldValue)) {
            return fieldValue.includes(value);
          }
          return String(fieldValue).includes(String(value));

        case "not_contains":
          if (Array.isArray(fieldValue)) {
            return !fieldValue.includes(value);
          }
          return !String(fieldValue).includes(String(value));

        case "starts_with":
          return String(fieldValue).startsWith(String(value));

        case "ends_with":
          return String(fieldValue).endsWith(String(value));

        case "in":
          if (Array.isArray(value)) {
            return value.includes(fieldValue);
          }
          return false;

        case "not_in":
          if (Array.isArray(value)) {
            return !value.includes(fieldValue);
          }
          return true;

        case "between":
          if (Array.isArray(value) && value.length === 2) {
            return fieldValue >= value[0] && fieldValue <= value[1];
          }
          return false;

        default:
          return false;
      }
    });
  }

  /**
   * Helper method to get a nested property from an object
   */
  private getNestedProperty(obj: any, path: string): any {
    const keys = path.split(".");
    return keys.reduce(
      (o, key) => (o && o[key] !== undefined ? o[key] : null),
      obj
    );
  }
}
