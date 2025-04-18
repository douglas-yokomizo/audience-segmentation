import React, { useState } from "react";
import { useSegmentContext } from "../../application/state/SegmentContext";
import { useComparisonContext } from "../../application/state/ComparisonContext";
import { SegmentComparisonSelector } from "../../ui/components/comparison/SegmentComparisonSelector";
import { SegmentComparisonChart } from "../../ui/components/comparison/SegmentComparisonChart";
import { SegmentComparisonTable } from "../../ui/components/comparison/SegmentComparisonTable";
import { Segment } from "../../core/models/Segment";

const ComparisonPage: React.FC = () => {
  const { state: segmentState } = useSegmentContext();
  const { state: comparisonState, dispatch: comparisonDispatch } =
    useComparisonContext();

  const { segments } = segmentState;
  const { comparisonSegments } = comparisonState;

  const [selectedMetric, setSelectedMetric] = useState<
    "userCount" | "percentageOfTotal" | "avgPurchaseValue" | "conversionRate"
  >("userCount");

  // Handlers for segment selection
  const handleSelectSegment = (segment: Segment) => {
    comparisonDispatch({ type: "ADD_COMPARISON_SEGMENT", payload: segment });
  };

  const handleRemoveSegment = (segmentId: string) => {
    comparisonDispatch({
      type: "REMOVE_COMPARISON_SEGMENT",
      payload: segmentId,
    });
  };

  const handleClearSegments = () => {
    comparisonDispatch({ type: "CLEAR_COMPARISON_SEGMENTS" });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Segment Comparison</h1>
        <p className="text-gray-600">
          Compare different audience segments side by side
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        {/* Segment Selector */}
        <div className="lg:col-span-1">
          <SegmentComparisonSelector
            segments={segments}
            selectedSegments={comparisonSegments}
            onSelectSegment={handleSelectSegment}
            onRemoveSegment={handleRemoveSegment}
            onClearSegments={handleClearSegments}
          />
        </div>

        {/* Comparison Content */}
        <div className="lg:col-span-3">
          {comparisonSegments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
              <p className="text-gray-500 text-center">
                Select segments from the panel on the left to start comparing
                them.
                <br />
                <span className="text-sm">
                  You can select up to 5 segments to compare at once.
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Metric Selector */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <label
                      htmlFor="metricSelect"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Compare by Metric
                    </label>
                    <select
                      id="metricSelect"
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value as any)}
                    >
                      <option value="userCount">User Count</option>
                      <option value="percentageOfTotal">
                        Percentage of Total
                      </option>
                      <option value="avgPurchaseValue">
                        Average Purchase Value
                      </option>
                      <option value="conversionRate">Conversion Rate</option>
                    </select>
                  </div>

                  <div>
                    <button className="px-3 py-1.5 text-sm bg-transparent text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                      Export Comparison
                    </button>
                  </div>
                </div>
              </div>

              {/* Comparison Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <SegmentComparisonChart
                  segments={comparisonSegments}
                  metric={selectedMetric}
                  title={`Segment Comparison by ${
                    selectedMetric === "userCount"
                      ? "User Count"
                      : selectedMetric === "percentageOfTotal"
                      ? "Percentage of Total"
                      : selectedMetric === "avgPurchaseValue"
                      ? "Average Purchase Value"
                      : "Conversion Rate"
                  }`}
                />
              </div>

              {/* Comparison Table */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Detailed Comparison
                </h3>
                <SegmentComparisonTable segments={comparisonSegments} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ComparisonPage);
