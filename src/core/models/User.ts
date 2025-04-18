/**
 * User model representing an individual in the audience
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  country: string;
  city: string;
  income: number;
  occupation: string;
  interests: string[];
  signupDate: Date;
  lastActive: Date;
  deviceType: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  purchaseHistory: {
    productId: string;
    productName: string;
    price: number;
    purchaseDate: Date;
  }[];
  totalSpent: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  hasSubscription: boolean;
  subscriptionTier?: string;
  tags: string[];
}
