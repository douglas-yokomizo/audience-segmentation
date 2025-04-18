import React, { useState, useEffect } from "react";
import { useSegmentContext } from "../../application/state/SegmentContext";
import { useUIContext } from "../../application/state/UIContext";
import { v4 as uuidv4 } from "uuid";
import { Filter, FilterType, FilterOperator } from "../../core/models/Filter";
import { SegmentRepository } from "../../infrastructure/repositories/SegmentRepository";
import { mockUsers } from "../../infrastructure/mocks/mockUsers";

const SegmentBuilderPage: React.FC = () => {
  const { state: segmentState, dispatch: segmentDispatch } =
    useSegmentContext();
  const { dispatch: _ } = useUIContext(); // Renamed to _ since it's not used

  // Get the current segment from context
  const { currentSegment } = segmentState;

  const [segmentName, setSegmentName] = useState("");
  const [segmentDescription, setSegmentDescription] = useState("");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [segmentId, setSegmentId] = useState<string | undefined>(undefined);

  // Filter form state
  const [filterType, setFilterType] = useState<FilterType>("demographic");
  const [filterField, setFilterField] = useState<string>("age");
  const [filterOperator, setFilterOperator] =
    useState<FilterOperator>("equals");
  const [filterValue, setFilterValue] = useState<string>("");

  // Preview state
  const [previewUserCount, setPreviewUserCount] = useState<number>(0);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);

  // Field options based on filter type
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);

  // Update field options when filter type changes
  useEffect(() => {
    switch (filterType) {
      case "demographic":
        setFieldOptions(["age", "gender", "income", "occupation"]);
        break;
      case "behavioral":
        setFieldOptions([
          "totalSpent",
          "purchaseHistory",
          "lastActive",
          "hasSubscription",
          "loyaltyTier",
        ]);
        break;
      case "geographic":
        setFieldOptions(["country", "city"]);
        break;
      case "custom":
        setFieldOptions(["interests", "tags", "deviceType", "browser"]);
        break;
      default:
        setFieldOptions([]);
    }

    // Reset field and operator when type changes
    if (fieldOptions.length > 0) {
      setFilterField(fieldOptions[0]);
    }
    setFilterOperator("equals");
    setFilterValue("");
  }, [filterType]);

  // Load current segment when it changes
  useEffect(() => {
    if (currentSegment) {
      setSegmentName(currentSegment.name);
      setSegmentDescription(currentSegment.description);
      setFilters(currentSegment.filters);
      setPreviewUserCount(currentSegment.userCount);
      setIsEditMode(true);
      setSegmentId(currentSegment.id);
    }
  }, [currentSegment]);

  // Preview segment when filters change
  useEffect(() => {
    const previewSegment = async () => {
      if (filters.length === 0) {
        setPreviewUserCount(0);
        return;
      }

      setIsPreviewLoading(true);
      try {
        // In a real app, this would call an API to get the count
        // For now, we'll simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Calculate a realistic user count based on filters
        const userCount = Math.floor(Math.random() * 500) + 50;
        setPreviewUserCount(userCount);
      } catch (error) {
        console.error("Failed to preview segment:", error);
      } finally {
        setIsPreviewLoading(false);
      }
    };

    previewSegment();
  }, [filters]);

  // Add a new filter
  const handleAddFilter = () => {
    const newFilter: Filter = {
      id: uuidv4(),
      type: filterType,
      field: filterField,
      operator: filterOperator,
      value: filterValue,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setFilters([...filters, newFilter]);

    // Reset value field
    setFilterValue("");
  };

  // Remove a filter
  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter((filter) => filter.id !== filterId));
  };

  // Create or update a segment
  const handleCreateSegment = async () => {
    if (!segmentName) return;

    try {
      const segmentRepository = new SegmentRepository();
      const now = new Date();

      if (isEditMode && segmentId) {
        // Update existing segment
        const updatedSegment = {
          id: segmentId,
          name: segmentName,
          description: segmentDescription,
          filters,
          userCount: previewUserCount,
          percentageOfTotal: Math.round(
            (previewUserCount / mockUsers.length) * 100
          ),
          createdAt: currentSegment?.createdAt || now,
          updatedAt: now,
          createdBy: currentSegment?.createdBy || "current-user@example.com",
          isActive: true,
          tags: currentSegment?.tags || [],
        };

        const updated = await segmentRepository.update(
          segmentId,
          updatedSegment
        );

        // Update global state
        segmentDispatch({ type: "UPDATE_SEGMENT", payload: updated as any });

        alert("Segment updated successfully!");
      } else {
        // Create new segment
        const newSegment = {
          name: segmentName,
          description: segmentDescription,
          filters,
          userCount: previewUserCount,
          percentageOfTotal: Math.round(
            (previewUserCount / mockUsers.length) * 100
          ),
          createdAt: now,
          updatedAt: now,
          createdBy: "current-user@example.com",
          isActive: true,
          tags: [],
        };

        const createdSegment = await segmentRepository.create(newSegment);

        // Update global state
        segmentDispatch({ type: "ADD_SEGMENT", payload: createdSegment });

        alert("Segment created successfully!");
      }

      // Reset form and state
      setSegmentName("");
      setSegmentDescription("");
      setFilters([]);
      setPreviewUserCount(0);
      setIsEditMode(false);
      setSegmentId(undefined);

      // Clear current segment in context
      segmentDispatch({ type: "SET_CURRENT_SEGMENT", payload: null as any });
    } catch (error) {
      console.error("Failed to save segment:", error);
      alert("Failed to save segment. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Segment" : "Create New Segment"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update your audience segment definition"
            : "Define your audience segment with filters"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segment Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Segment Details
              </h3>
            </div>

            <div className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="segmentName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Segment Name *
                  </label>
                  <input
                    id="segmentName"
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    placeholder="e.g., High Value Customers"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="segmentDescription"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="segmentDescription"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={segmentDescription}
                    onChange={(e) => setSegmentDescription(e.target.value)}
                    placeholder="Describe this segment..."
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Segment Preview
                  </h4>
                  <p className="text-blue-700">
                    {isPreviewLoading ? (
                      "Calculating segment size..."
                    ) : (
                      <>
                        This segment will contain{" "}
                        <span className="font-bold">{previewUserCount}</span>{" "}
                        users (
                        {Math.round(
                          (previewUserCount / mockUsers.length) * 100
                        )}
                        % of total audience)
                      </>
                    )}
                  </p>
                </div>

                <div className="flex flex-col space-y-2 pt-4">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                    disabled={!segmentName}
                    onClick={handleCreateSegment}
                  >
                    {isEditMode ? "Update Segment" : "Create Segment"}
                  </button>

                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    onClick={() => setIsPreviewLoading(true)}
                    disabled={filters.length === 0}
                  >
                    Refresh Preview
                  </button>

                  {isEditMode && (
                    <button
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      onClick={() => {
                        // Reset form and state
                        setSegmentName("");
                        setSegmentDescription("");
                        setFilters([]);
                        setPreviewUserCount(0);
                        setIsEditMode(false);
                        setSegmentId(undefined);

                        // Clear current segment in context
                        segmentDispatch({
                          type: "SET_CURRENT_SEGMENT",
                          payload: null,
                        });
                      }}
                    >
                      Cancel Editing
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Builder */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Filters
              </h3>

              <div className="space-y-2">
                {filters.length === 0 ? (
                  <p className="text-gray-500 italic">No filters added yet</p>
                ) : (
                  <div className="space-y-2">
                    {filters.map((filter) => (
                      <div
                        key={filter.id}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                      >
                        <div>
                          <span className="text-xs font-medium text-gray-500 mr-1">
                            {filter.type}:
                          </span>
                          <span className="text-sm font-medium">
                            {filter.field}
                          </span>
                          <span className="text-xs text-gray-500 mx-1">
                            {filter.operator}
                          </span>
                          <span className="text-sm">
                            {filter.value.toString()}
                          </span>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveFilter(filter.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Add New Filter
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {/* Filter Type */}
                  <div>
                    <label
                      htmlFor="filterType"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Type
                    </label>
                    <select
                      id="filterType"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      value={filterType}
                      onChange={(e) =>
                        setFilterType(e.target.value as FilterType)
                      }
                    >
                      <option value="demographic">Demographic</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="geographic">Geographic</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>

                  {/* Field */}
                  <div>
                    <label
                      htmlFor="filterField"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Field
                    </label>
                    <select
                      id="filterField"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      value={filterField}
                      onChange={(e) => setFilterField(e.target.value)}
                    >
                      {fieldOptions.map((field) => (
                        <option key={field} value={field}>
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Operator */}
                  <div>
                    <label
                      htmlFor="filterOperator"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Operator
                    </label>
                    <select
                      id="filterOperator"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      value={filterOperator}
                      onChange={(e) =>
                        setFilterOperator(e.target.value as FilterOperator)
                      }
                    >
                      <option value="equals">equals</option>
                      <option value="not_equals">not equals</option>
                      <option value="greater_than">greater than</option>
                      <option value="less_than">less than</option>
                      <option value="contains">contains</option>
                      <option value="not_contains">not contains</option>
                      <option value="in">in</option>
                      <option value="between">between</option>
                    </select>
                  </div>

                  {/* Value */}
                  <div>
                    <label
                      htmlFor="filterValue"
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Value
                    </label>
                    <input
                      id="filterValue"
                      type="text"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      placeholder="Enter value"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                    />
                  </div>

                  {/* Add Button */}
                  <div className="flex items-end">
                    <button
                      className="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                      onClick={handleAddFilter}
                      disabled={!filterValue}
                    >
                      Add Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SegmentBuilderPage);
