import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User } from '../../../core/models/User';

interface AgeDistributionChartProps {
  users: User[];
}

export const AgeDistributionChart: React.FC<AgeDistributionChartProps> = ({ users }) => {
  // Calculate age distribution
  const ageGroups = {
    '18-24': 0,
    '25-34': 0,
    '35-44': 0,
    '45-54': 0,
    '55-64': 0,
    '65+': 0
  };
  
  users.forEach(user => {
    if (user.age < 25) {
      ageGroups['18-24']++;
    } else if (user.age < 35) {
      ageGroups['25-34']++;
    } else if (user.age < 45) {
      ageGroups['35-44']++;
    } else if (user.age < 55) {
      ageGroups['45-54']++;
    } else if (user.age < 65) {
      ageGroups['55-64']++;
    } else {
      ageGroups['65+']++;
    }
  });
  
  // Prepare data for the chart
  const data = Object.entries(ageGroups).map(([ageGroup, count]) => ({
    ageGroup,
    count
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ageGroup" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
        <Legend />
        <Bar dataKey="count" name="Users" fill="#8B5CF6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
