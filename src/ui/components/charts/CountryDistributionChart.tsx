import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User } from '../../../core/models/User';

interface CountryDistributionChartProps {
  users: User[];
}

export const CountryDistributionChart: React.FC<CountryDistributionChartProps> = ({ users }) => {
  // Calculate country distribution
  const countryCounts: Record<string, number> = {};
  
  users.forEach(user => {
    countryCounts[user.country] = (countryCounts[user.country] || 0) + 1;
  });
  
  // Sort by count and take top 10
  const data = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({
      country,
      count
    }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 80,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="country" type="category" width={80} />
        <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
        <Legend />
        <Bar dataKey="count" name="Users" fill="#10B981" />
      </BarChart>
    </ResponsiveContainer>
  );
};
