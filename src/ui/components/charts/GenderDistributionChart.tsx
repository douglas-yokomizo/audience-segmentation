import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { User } from "../../../core/models/User";

interface GenderDistributionChartProps {
  users: User[];
}

export const GenderDistributionChart: React.FC<
  GenderDistributionChartProps
> = ({ users }) => {
  // Calculate gender distribution
  const genderCounts: Record<string, number> = {};

  users.forEach((user) => {
    genderCounts[user.gender] = (genderCounts[user.gender] || 0) + 1;
  });

  // Prepare data for the chart
  const data = Object.entries(genderCounts).map(([gender, count]) => ({
    name: gender,
    value: count,
  }));

  // Colors for different genders
  const COLORS = ["#3B82F6", "#EC4899", "#8B5CF6", "#6B7280"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
