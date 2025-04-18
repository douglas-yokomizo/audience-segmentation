import { IRepository } from './IRepository';
import { Segment } from '../models/Segment';
import { User } from '../models/User';

/**
 * Segment repository interface with additional methods
 */
export interface ISegmentRepository extends IRepository<Segment> {
  getSegmentUsers(segmentId: string): Promise<User[]>;
  getSegmentUserCount(segmentId: string): Promise<number>;
  applyFilters(segmentId: string): Promise<User[]>;
}
