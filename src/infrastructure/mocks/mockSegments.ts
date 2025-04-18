import { Segment } from '../../core/models/Segment';
import { mockFilters, generateMockFilters } from './mockFilters';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate a random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to pick a random item from an array
const randomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Helper function to pick multiple random items from an array
const randomItems = <T>(items: T[], count: number): T[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Sample data for generating mock segments
const segmentNames = [
  'High Value Customers',
  'New Customers',
  'Churn Risk',
  'Mobile Users',
  'Young Professionals',
  'Frequent Shoppers',
  'Premium Subscribers',
  'Tech Enthusiasts',
  'International Customers',
  'Weekend Shoppers',
  'Discount Seekers',
  'Luxury Buyers',
  'Inactive Users',
  'Social Media Followers',
  'Email Subscribers'
];

const segmentDescriptions = [
  'Customers who have spent over $1000 in the last year',
  'Users who signed up in the last 30 days',
  'Customers who haven\'t made a purchase in the last 90 days',
  'Users who primarily access our platform via mobile devices',
  'Professionals aged 25-35 with high income',
  'Customers who make purchases at least once a month',
  'Users subscribed to our premium tier services',
  'Customers interested in technology products',
  'Users located outside the United States',
  'Customers who primarily shop on weekends',
  'Users who frequently use discount codes',
  'Customers who purchase high-end products',
  'Users who haven\'t logged in for over 60 days',
  'Customers who follow us on social media platforms',
  'Users who have subscribed to our email newsletter'
];

const segmentTags = [
  'High Value', 'New', 'At Risk', 'Mobile', 'Young', 'Frequent', 'Premium',
  'Tech', 'International', 'Weekend', 'Discount', 'Luxury', 'Inactive',
  'Social', 'Email', 'Targeted', 'Campaign', 'Promotion', 'Retention',
  'Acquisition', 'Conversion', 'Engagement', 'Loyalty', 'Seasonal'
];

// Generate a single mock segment
const generateMockSegment = (id: number): Segment => {
  const name = segmentNames[id % segmentNames.length];
  const description = segmentDescriptions[id % segmentDescriptions.length];
  
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  const createdAt = randomDate(oneYearAgo, now);
  const updatedAt = randomDate(createdAt, now);
  
  const filterCount = Math.floor(Math.random() * 3) + 1; // 1-3 filters
  const filters = generateMockFilters(filterCount);
  
  const userCount = Math.floor(Math.random() * 500) + 50; // 50-550 users
  const percentageOfTotal = Math.round((userCount / 1000) * 100); // Assuming 1000 total users
  
  const tagCount = Math.floor(Math.random() * 3) + 1; // 1-3 tags
  const tags = randomItems(segmentTags, tagCount);
  
  return {
    id: `segment-${id}`,
    name,
    description,
    filters,
    userCount,
    percentageOfTotal,
    createdAt,
    updatedAt,
    createdBy: 'admin@example.com',
    isActive: Math.random() > 0.2, // 80% chance of being active
    tags
  };
};

// Generate predefined segments with specific filters
export const generatePredefinedSegments = (): Segment[] => {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  return [
    // High Value Customers
    {
      id: uuidv4(),
      name: 'High Value Customers',
      description: 'Customers who have spent over $1000 and are in the Gold or Platinum loyalty tier',
      filters: [
        mockFilters[3], // totalSpent > 1000
        mockFilters[5]  // loyaltyTier = Gold
      ],
      userCount: 250,
      percentageOfTotal: 25,
      createdAt: randomDate(sixMonthsAgo, now),
      updatedAt: now,
      createdBy: 'admin@example.com',
      isActive: true,
      tags: ['High Value', 'Loyalty', 'Targeted']
    },
    
    // New Customers
    {
      id: uuidv4(),
      name: 'New Customers',
      description: 'Users who signed up in the last 30 days',
      filters: [
        {
          id: uuidv4(),
          type: 'behavioral',
          field: 'signupDate',
          operator: 'greater_than',
          value: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
          updatedAt: now
        }
      ],
      userCount: 120,
      percentageOfTotal: 12,
      createdAt: randomDate(sixMonthsAgo, now),
      updatedAt: now,
      createdBy: 'admin@example.com',
      isActive: true,
      tags: ['New', 'Acquisition']
    },
    
    // Churn Risk
    {
      id: uuidv4(),
      name: 'Churn Risk',
      description: 'Customers who haven\'t made a purchase in the last 90 days',
      filters: [
        {
          id: uuidv4(),
          type: 'behavioral',
          field: 'lastActive',
          operator: 'less_than',
          value: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
          updatedAt: now
        }
      ],
      userCount: 180,
      percentageOfTotal: 18,
      createdAt: randomDate(sixMonthsAgo, now),
      updatedAt: now,
      createdBy: 'admin@example.com',
      isActive: true,
      tags: ['At Risk', 'Retention']
    },
    
    // Mobile Users
    {
      id: uuidv4(),
      name: 'Mobile Users',
      description: 'Users who primarily access our platform via mobile devices',
      filters: [
        mockFilters[9] // deviceType = Mobile
      ],
      userCount: 450,
      percentageOfTotal: 45,
      createdAt: randomDate(sixMonthsAgo, now),
      updatedAt: now,
      createdBy: 'admin@example.com',
      isActive: true,
      tags: ['Mobile', 'Engagement']
    },
    
    // Young Professionals
    {
      id: uuidv4(),
      name: 'Young Professionals',
      description: 'Professionals aged 25-35 with high income',
      filters: [
        {
          id: uuidv4(),
          type: 'demographic',
          field: 'age',
          operator: 'between',
          value: [25, 35],
          createdAt: now,
          updatedAt: now
        },
        mockFilters[2] // income > 75000
      ],
      userCount: 200,
      percentageOfTotal: 20,
      createdAt: randomDate(sixMonthsAgo, now),
      updatedAt: now,
      createdBy: 'admin@example.com',
      isActive: true,
      tags: ['Young', 'High Value', 'Targeted']
    }
  ];
};

// Generate a specified number of mock segments
export const generateMockSegments = (count: number): Segment[] => {
  const segments: Segment[] = [];
  
  for (let i = 1; i <= count; i++) {
    segments.push(generateMockSegment(i));
  }
  
  return segments;
};

// Export a set of mock segments
export const mockSegments = generatePredefinedSegments();
