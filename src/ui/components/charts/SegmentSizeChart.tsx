import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Segment } from '../../../core/models/Segment';

interface SegmentSizeChartProps {
  segments: Segment[];
}

export const SegmentSizeChart: React.FC<SegmentSizeChartProps> = ({ segments }) => {
  // Prepare data for the chart
  const data = segments.map(segment => ({
    name: segment.name,
    users: segment.userCount,
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
        <XAxis dataKey="name" tick={{ fontSize: 12 }} height={60} interval={0} angle={-45} textAnchor="end" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} users`, 'Size']} />
        <Legend />
        <Bar dataKey="users" name="Users" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
