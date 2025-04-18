import React, { useState, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { useSegmentContext } from "../../application/state/SegmentContext";
import { useComparisonContext } from "../../application/state/ComparisonContext";
import { SegmentRepository } from "../../infrastructure/repositories/SegmentRepository";
import { User } from "../../core/models/User";
import { MetricDistributionChart } from "../../ui/components/charts/MetricDistributionChart";

const VisualizationPage: React.FC = () => {
  const { state: segmentState } = useSegmentContext();
  const { state: comparisonState, dispatch: comparisonDispatch } =
    useComparisonContext();

  const { segments } = segmentState;
  const { comparisonSegments } = comparisonState;

  const [selectedSegmentId, setSelectedSegmentId] = useState<string>("");
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [chartMetric, setChartMetric] = useState<string>("age");
  const [segmentUsers, setSegmentUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Set initial segment ID when segments are loaded
  useEffect(() => {
    if (segments.length > 0 && !selectedSegmentId) {
      setSelectedSegmentId(segments[0].id);
    }
  }, [segments, selectedSegmentId]);

  // Load segment users when segment ID changes
  useEffect(() => {
    const loadSegmentUsers = async () => {
      if (!selectedSegmentId) return;

      setIsLoading(true);
      try {
        const segmentRepository = new SegmentRepository();
        const users = await segmentRepository.getSegmentUsers(
          selectedSegmentId
        );
        setSegmentUsers(users);
      } catch (error) {
        console.error("Failed to load segment users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSegmentUsers();
  }, [selectedSegmentId]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Segment Visualization
        </h1>
        <p className="text-gray-600">
          Analyze and visualize your audience segments
        </p>
      </div>

      {/* Segment Selector */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <label
                htmlFor="segmentSelect"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Segment
              </label>
              <select
                id="segmentSelect"
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedSegmentId}
                onChange={(e) => setSelectedSegmentId(e.target.value)}
                disabled={segments.length === 0}
              >
                {segments.length === 0 ? (
                  <option value="">Loading segments...</option>
                ) : (
                  segments.map((segment) => (
                    <option key={segment.id} value={segment.id}>
                      {segment.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm bg-transparent text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                Export CSV
              </button>
              <button className="px-3 py-1.5 text-sm bg-transparent text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                Export JSON
              </button>
              {segments.length > 0 && selectedSegmentId && (
                <button
                  className={`px-3 py-1.5 text-sm rounded-md ${
                    comparisonSegments.some((s) => s.id === selectedSegmentId)
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  onClick={() => {
                    if (
                      !comparisonSegments.some(
                        (s) => s.id === selectedSegmentId
                      )
                    ) {
                      const segment = segments.find(
                        (s) => s.id === selectedSegmentId
                      );
                      if (segment) {
                        comparisonDispatch({
                          type: "ADD_COMPARISON_SEGMENT",
                          payload: segment,
                        });
                      }
                    }
                  }}
                  disabled={comparisonSegments.some(
                    (s) => s.id === selectedSegmentId
                  )}
                >
                  {comparisonSegments.some((s) => s.id === selectedSegmentId)
                    ? "Added to Comparison"
                    : "Add to Comparison"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Segment Summary */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Segment Summary
          </h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">Total Users</h4>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "Loading..." : segmentUsers.length}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                % of Audience
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading
                  ? "Loading..."
                  : `${Math.round((segmentUsers.length / 1000) * 100)}%`}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Avg. Purchase Count
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading
                  ? "Loading..."
                  : segmentUsers.length > 0
                  ? Math.round(
                      segmentUsers.reduce(
                        (sum, user) => sum + user.purchaseHistory.length,
                        0
                      ) / segmentUsers.length
                    )
                  : 0}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-500">
                Avg. Order Value
              </h4>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading
                  ? "Loading..."
                  : segmentUsers.length > 0
                  ? `$${Math.round(
                      segmentUsers.reduce(
                        (sum, user) => sum + user.totalSpent,
                        0
                      ) / segmentUsers.length
                    ).toLocaleString()}`
                  : "$0"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Visualization Controls
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="chartType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Chart Type
                  </label>
                  <select
                    id="chartType"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={chartType}
                    onChange={(e) =>
                      setChartType(e.target.value as "bar" | "pie")
                    }
                  >
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="chartMetric"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Metric
                  </label>
                  <select
                    id="chartMetric"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={chartMetric}
                    onChange={(e) => setChartMetric(e.target.value)}
                  >
                    <option value="age">Age Distribution</option>
                    <option value="gender">Gender Distribution</option>
                    <option value="country">Country Distribution</option>
                    <option value="income">Income Distribution</option>
                    <option value="deviceType">Device Type</option>
                    <option value="loyaltyTier">Loyalty Tier</option>
                  </select>
                </div>

                <div className="pt-4 space-y-2">
                  <button className="w-full px-4 py-2 bg-transparent text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                    Download Chart
                  </button>

                  {comparisonSegments.length > 0 && (
                    <button
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      onClick={() => (window.location.href = "#/comparison")}
                    >
                      View Comparison ({comparisonSegments.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {chartMetric.charAt(0).toUpperCase() + chartMetric.slice(1)}{" "}
                Distribution
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="h-80 bg-gray-100 rounded">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Loading data...</p>
                  </div>
                ) : segmentUsers.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">
                      No users found in this segment
                    </p>
                  </div>
                ) : (
                  <MetricDistributionChart
                    users={segmentUsers}
                    metric={chartMetric}
                    chartType={chartType}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Segment Data</h3>
        </div>
        <div className="px-6 py-4">
          <div className="border rounded-md overflow-hidden">
            <div className="flex items-center border-b border-gray-200 bg-gray-50">
              <div className="px-4 py-2 font-medium text-gray-700 w-24">ID</div>
              <div className="px-4 py-2 font-medium text-gray-700 w-16">
                Age
              </div>
              <div className="px-4 py-2 font-medium text-gray-700 w-24">
                Gender
              </div>
              <div className="px-4 py-2 font-medium text-gray-700 w-32">
                Country
              </div>
              <div className="px-4 py-2 font-medium text-gray-700 w-24">
                Income
              </div>
            </div>

            <div className="h-80">
              {isLoading ? (
                <div className="flex items-center justify-center h-full py-8">
                  <p className="text-gray-500">Loading segment data...</p>
                </div>
              ) : segmentUsers.length === 0 ? (
                <div className="flex items-center justify-center h-full py-8">
                  <p className="text-gray-500">
                    No users found in this segment
                  </p>
                </div>
              ) : (
                <List
                  height={320}
                  width="100%"
                  itemCount={segmentUsers.length}
                  itemSize={40}
                  overscanCount={5}
                >
                  {({ index, style }) => {
                    const user = segmentUsers[index];
                    return (
                      <div
                        style={style}
                        className={`flex items-center border-b border-gray-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <div className="px-4 py-2 truncate w-24">{user.id}</div>
                        <div className="px-4 py-2 truncate w-16">
                          {user.age}
                        </div>
                        <div className="px-4 py-2 truncate w-24">
                          {user.gender}
                        </div>
                        <div className="px-4 py-2 truncate w-32">
                          {user.country}
                        </div>
                        <div className="px-4 py-2 truncate w-24">
                          ${user.income.toLocaleString()}
                        </div>
                      </div>
                    );
                  }}
                </List>
              )}
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-500 text-center">
            {segmentUsers.length > 0
              ? `Showing all ${segmentUsers.length} records. Export to see all data.`
              : "No data to display."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VisualizationPage);
