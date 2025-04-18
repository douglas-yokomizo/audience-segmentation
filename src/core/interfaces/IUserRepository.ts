import { IRepository } from './IRepository';
import { User } from '../models/User';

/**
 * User repository interface with additional methods
 */
export interface IUserRepository extends IRepository<User> {
  getUsersByFilter(field: string, operator: string, value: any): Promise<User[]>;
  getUsersBySegment(segmentId: string): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;
}
