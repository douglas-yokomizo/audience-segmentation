import React from "react";
import { Segment } from "../../../core/models/Segment";

interface SegmentComparisonTableProps {
  segments: Segment[];
}

// Helper function to calculate additional metrics
const calculateMetrics = () => {
  // These would normally come from real data, but we'll simulate them for now
  const avgPurchaseValue = Math.round(Math.random() * 100) + 50;
  const conversionRate = Math.round(Math.random() * 30) + 5;
  const retentionRate = Math.round(Math.random() * 40) + 50;
  const engagementScore = Math.round(Math.random() * 50) + 40;

  return {
    avgPurchaseValue,
    conversionRate,
    retentionRate,
    engagementScore,
  };
};

export const SegmentComparisonTable: React.FC<SegmentComparisonTableProps> = ({
  segments,
}) => {
  // Calculate additional metrics for each segment
  const segmentsWithMetrics = segments.map((segment) => ({
    ...segment,
    ...calculateMetrics(),
  }));

  // Define metrics to display
  const metrics = [
    {
      key: "userCount",
      label: "User Count",
      format: (value: number) => value.toLocaleString(),
    },
    {
      key: "percentageOfTotal",
      label: "Percentage of Total",
      format: (value: number) => `${value}%`,
    },
    {
      key: "avgPurchaseValue",
      label: "Avg. Purchase Value",
      format: (value: number) => `$${value}`,
    },
    {
      key: "conversionRate",
      label: "Conversion Rate",
      format: (value: number) => `${value}%`,
    },
    {
      key: "retentionRate",
      label: "Retention Rate",
      format: (value: number) => `${value}%`,
    },
    {
      key: "engagementScore",
      label: "Engagement Score",
      format: (value: number) => value,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Metric
            </th>
            {segmentsWithMetrics.map((segment) => (
              <th
                key={segment.id}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {segment.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {metrics.map((metric, index) => (
            <tr
              key={metric.key}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {metric.label}
              </td>
              {segmentsWithMetrics.map((segment) => (
                <td
                  key={`${segment.id}-${metric.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {metric.format((segment as any)[metric.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
