import React, { useEffect, useState } from "react";
import { useSegmentContext } from "../../application/state/SegmentContext";
import { useComparisonContext } from "../../application/state/ComparisonContext";
import { mockUsers } from "../../infrastructure/mocks/mockUsers";
import { MockDataService } from "../../infrastructure/mocks/mockDataService";
import { SegmentSizeChart } from "../../ui/components/charts/SegmentSizeChart";
import { GenderDistributionChart } from "../../ui/components/charts/GenderDistributionChart";
import { AgeDistributionChart } from "../../ui/components/charts/AgeDistributionChart";
import { Segment } from "../../core/models/Segment";
import { StatCard } from "../../ui/components/common/StatCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../ui/components/common/Card";
import { Button } from "../../ui/components/common/Button";
import { Badge } from "../../ui/components/common/Badge";

const DashboardPage: React.FC = () => {
  const { state: segmentState, dispatch: segmentDispatch } =
    useSegmentContext();
  const { state: comparisonState, dispatch: comparisonDispatch } =
    useComparisonContext();

  const { segments } = segmentState;
  const { comparisonSegments } = comparisonState;

  // Get statistics from mock data service
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    const mockDataService = MockDataService.getInstance();
    setStatistics(mockDataService.getDataStatistics());
  }, []);

  // Handle adding segment to comparison
  const handleAddToComparison = (segment: Segment) => {
    comparisonDispatch({ type: "ADD_COMPARISON_SEGMENT", payload: segment });
  };

  // Check if a segment is already in comparison
  const isInComparison = (segmentId: string) => {
    return comparisonSegments.some((segment) => segment.id === segmentId);
  };
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Overview of your audience segments and key metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Audience"
          value={mockUsers.length.toLocaleString()}
          variant="primary"
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          }
          trend={{ value: 12, isPositive: true }}
        />

        <StatCard
          title="Segments"
          value={segments.length}
          variant="success"
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
        />

        <StatCard
          title="Avg. Segment Size"
          value={
            segments.length > 0
              ? Math.round(
                  segments.reduce(
                    (sum, segment) => sum + segment.userCount,
                    0
                  ) / segments.length
                )
              : 0
          }
          variant="info"
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Segment Size Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64 bg-gray-50 rounded-md overflow-hidden">
              {segments.length > 0 ? (
                <SegmentSizeChart segments={segments} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No segments available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64 bg-gray-50 rounded-md overflow-hidden">
              {statistics ? (
                <GenderDistributionChart users={mockUsers} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Loading data...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64 bg-gray-50 rounded-md overflow-hidden">
              {statistics ? (
                <AgeDistributionChart users={mockUsers} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Loading data...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-y-auto max-h-64">
              <ul className="divide-y divide-gray-200">
                {segments.slice(0, 5).map((segment) => (
                  <li key={segment.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-medium text-gray-900">
                            {segment.name}
                          </h4>
                          <Badge variant="secondary">
                            {segment.userCount.toLocaleString()} users
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {segment.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // First set the current segment in the context
                            segmentDispatch({
                              type: "SET_CURRENT_SEGMENT",
                              payload: segment,
                            });
                            // Then navigate to the builder page
                            window.location.href = "#/builder";
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant={
                            isInComparison(segment.id) ? "ghost" : "secondary"
                          }
                          size="sm"
                          onClick={() =>
                            !isInComparison(segment.id) &&
                            handleAddToComparison(segment)
                          }
                          disabled={isInComparison(segment.id)}
                          title={
                            isInComparison(segment.id)
                              ? "Already added to comparison"
                              : "Add to comparison"
                          }
                        >
                          {isInComparison(segment.id) ? "Added" : "Compare"}
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="default"
              fullWidth
              onClick={() => (window.location.href = "#/builder")}
            >
              Create New Segment
            </Button>

            {comparisonSegments.length > 0 && (
              <Button
                variant="success"
                fullWidth
                onClick={() => (window.location.href = "#/comparison")}
              >
                View Comparison ({comparisonSegments.length})
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(DashboardPage);
