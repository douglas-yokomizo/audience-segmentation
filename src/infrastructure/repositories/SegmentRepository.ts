import { ISegmentRepository } from "../../core/interfaces/ISegmentRepository";
import { Segment } from "../../core/models/Segment";
import { User } from "../../core/models/User";
import { mockSegments } from "../mocks/mockSegments";
import { mockUsers } from "../mocks/mockUsers";
import { v4 as uuidv4 } from "uuid";
import { Filter } from "../../core/models/Filter";

/**
 * Implementation of the Segment repository using mock data
 */
export class SegmentRepository implements ISegmentRepository {
  private segments: Segment[] = [...mockSegments];
  private users: User[] = [...mockUsers];

  async getAll(): Promise<Segment[]> {
    return Promise.resolve([...this.segments]);
  }

  async getById(id: string): Promise<Segment | null> {
    const segment = this.segments.find((s) => s.id === id);
    return Promise.resolve(segment || null);
  }

  async create(entity: Omit<Segment, "id">): Promise<Segment> {
    const newSegment: Segment = {
      ...entity,
      id: `segment-${uuidv4()}`,
    };

    this.segments.push(newSegment);
    return Promise.resolve(newSegment);
  }

  async update(id: string, entity: Partial<Segment>): Promise<Segment | null> {
    const index = this.segments.findIndex((s) => s.id === id);

    if (index === -1) {
      return Promise.resolve(null);
    }

    const updatedSegment = {
      ...this.segments[index],
      ...entity,
      updatedAt: new Date(),
    };

    this.segments[index] = updatedSegment;
    return Promise.resolve(updatedSegment);
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.segments.length;
    this.segments = this.segments.filter((s) => s.id !== id);

    return Promise.resolve(initialLength !== this.segments.length);
  }

  async getSegmentUsers(segmentId: string): Promise<User[]> {
    const segment = await this.getById(segmentId);

    if (!segment) {
      return Promise.resolve([]);
    }

    return this.applyFilters(segmentId);
  }

  async getSegmentUserCount(segmentId: string): Promise<number> {
    const users = await this.getSegmentUsers(segmentId);
    return Promise.resolve(users.length);
  }

  async applyFilters(segmentId: string): Promise<User[]> {
    const segment = await this.getById(segmentId);

    if (!segment || !segment.filters || segment.filters.length === 0) {
      return Promise.resolve([]);
    }

    // Apply all filters sequentially
    let filteredUsers = [...this.users];

    for (const filter of segment.filters) {
      filteredUsers = this.applyFilter(filteredUsers, filter);
    }

    return Promise.resolve(filteredUsers);
  }

  /**
   * Helper method to apply a single filter to a list of users
   */
  private applyFilter(users: User[], filter: Filter): User[] {
    const { field, operator, value } = filter;

    return users.filter((user) => {
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
