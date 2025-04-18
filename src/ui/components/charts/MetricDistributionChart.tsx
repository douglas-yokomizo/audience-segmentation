import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { User } from "../../../core/models/User";

interface MetricDistributionChartProps {
  users: User[];
  metric: string;
  chartType: "bar" | "pie";
}

export const MetricDistributionChart: React.FC<
  MetricDistributionChartProps
> = ({ users, metric, chartType }) => {
  // Calculate distribution based on the selected metric
  const getDistributionData = () => {
    switch (metric) {
      case "age":
        return getAgeDistribution();
      case "gender":
        return getGenderDistribution();
      case "country":
        return getCountryDistribution();
      case "income":
        return getIncomeDistribution();
      case "deviceType":
        return getDeviceTypeDistribution();
      case "loyaltyTier":
        return getLoyaltyTierDistribution();
      default:
        return [];
    }
  };

  const getAgeDistribution = () => {
    const ageGroups = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45-54": 0,
      "55-64": 0,
      "65+": 0,
    };

    users.forEach((user) => {
      if (user.age < 25) {
        ageGroups["18-24"]++;
      } else if (user.age < 35) {
        ageGroups["25-34"]++;
      } else if (user.age < 45) {
        ageGroups["35-44"]++;
      } else if (user.age < 55) {
        ageGroups["45-54"]++;
      } else if (user.age < 65) {
        ageGroups["55-64"]++;
      } else {
        ageGroups["65+"]++;
      }
    });

    return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
  };

  const getGenderDistribution = () => {
    const genderCounts: Record<string, number> = {};

    users.forEach((user) => {
      genderCounts[user.gender] = (genderCounts[user.gender] || 0) + 1;
    });

    return Object.entries(genderCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getCountryDistribution = () => {
    const countryCounts: Record<string, number> = {};

    users.forEach((user) => {
      countryCounts[user.country] = (countryCounts[user.country] || 0) + 1;
    });

    // Sort by count and take top 10
    return Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));
  };

  const getIncomeDistribution = () => {
    const incomeGroups = {
      "<$30k": 0,
      "$30k-$50k": 0,
      "$50k-$75k": 0,
      "$75k-$100k": 0,
      "$100k-$150k": 0,
      ">$150k": 0,
    };

    users.forEach((user) => {
      if (user.income < 30000) {
        incomeGroups["<$30k"]++;
      } else if (user.income < 50000) {
        incomeGroups["$30k-$50k"]++;
      } else if (user.income < 75000) {
        incomeGroups["$50k-$75k"]++;
      } else if (user.income < 100000) {
        incomeGroups["$75k-$100k"]++;
      } else if (user.income < 150000) {
        incomeGroups["$100k-$150k"]++;
      } else {
        incomeGroups[">$150k"]++;
      }
    });

    return Object.entries(incomeGroups).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getDeviceTypeDistribution = () => {
    const deviceCounts: Record<string, number> = {};

    users.forEach((user) => {
      deviceCounts[user.deviceType] = (deviceCounts[user.deviceType] || 0) + 1;
    });

    return Object.entries(deviceCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getLoyaltyTierDistribution = () => {
    const tierCounts: Record<string, number> = {};

    users.forEach((user) => {
      tierCounts[user.loyaltyTier] = (tierCounts[user.loyaltyTier] || 0) + 1;
    });

    return Object.entries(tierCounts).map(([name, value]) => ({ name, value }));
  };

  const data = getDistributionData();
  const COLORS = [
    "#3B82F6",
    "#EC4899",
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6B7280",
    "#8B5CF6",
    "#EC4899",
    "#3B82F6",
  ];

  const getMetricLabel = () => {
    switch (metric) {
      case "age":
        return "Age Group";
      case "gender":
        return "Gender";
      case "country":
        return "Country";
      case "income":
        return "Income Range";
      case "deviceType":
        return "Device Type";
      case "loyaltyTier":
        return "Loyalty Tier";
      default:
        return "Value";
    }
  };

  if (chartType === "pie") {
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
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

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
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12 }}
          height={60}
          interval={0}
          angle={-45}
          textAnchor="end"
        />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} users`, "Count"]} />
        <Legend />
        <Bar dataKey="value" name={getMetricLabel()} fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
};
