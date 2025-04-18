import { Filter } from './Filter';

/**
 * Segment model representing a group of users based on specific criteria
 */
export interface Segment {
  id: string;
  name: string;
  description: string;
  filters: Filter[];
  userCount: number;
  percentageOfTotal: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
  tags: string[];
}
