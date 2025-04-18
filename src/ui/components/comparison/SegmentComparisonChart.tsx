import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Segment } from "../../../core/models/Segment";

interface SegmentComparisonChartProps {
  segments: Segment[];
  metric:
    | "userCount"
    | "percentageOfTotal"
    | "avgPurchaseValue"
    | "conversionRate";
  title?: string;
}

// Helper function to calculate additional metrics
const calculateMetrics = () => {
  // These would normally come from real data, but we'll simulate them for now
  const avgPurchaseValue = Math.round(Math.random() * 100) + 50;
  const conversionRate = Math.round(Math.random() * 30) + 5;

  return {
    avgPurchaseValue,
    conversionRate,
  };
};

export const SegmentComparisonChart: React.FC<SegmentComparisonChartProps> = ({
  segments,
  metric,
  title = "Segment Comparison",
}) => {
  // Prepare data for the chart
  const data = segments.map((segment) => {
    const additionalMetrics = calculateMetrics();

    return {
      name: segment.name,
      userCount: segment.userCount,
      percentageOfTotal: segment.percentageOfTotal,
      ...additionalMetrics,
    };
  });

  // Get the appropriate label for the metric
  const getMetricLabel = () => {
    switch (metric) {
      case "userCount":
        return "User Count";
      case "percentageOfTotal":
        return "Percentage of Total (%)";
      case "avgPurchaseValue":
        return "Avg. Purchase Value ($)";
      case "conversionRate":
        return "Conversion Rate (%)";
      default:
        return "Value";
    }
  };

  // Get the appropriate formatter for the tooltip
  const getTooltipFormatter = (value: any) => {
    switch (metric) {
      case "percentageOfTotal":
      case "conversionRate":
        return `${value}%`;
      case "avgPurchaseValue":
        return `$${value}`;
      default:
        return value;
    }
  };

  // Generate a unique color for each segment
  const getBarColor = (index: number) => {
    const colors = [
      "#3B82F6",
      "#EC4899",
      "#8B5CF6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
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
          <Tooltip
            formatter={(value) => [
              getTooltipFormatter(value),
              getMetricLabel(),
            ]}
          />
          <Legend />
          {segments.map((segment, index) => (
            <Bar
              key={segment.id}
              dataKey={metric}
              name={segment.name}
              fill={getBarColor(index)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
