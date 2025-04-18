import React from 'react';
import { Segment } from '../../../core/models/Segment';

interface SegmentComparisonSelectorProps {
  segments: Segment[];
  selectedSegments: Segment[];
  onSelectSegment: (segment: Segment) => void;
  onRemoveSegment: (segmentId: string) => void;
  onClearSegments: () => void;
  maxSelections?: number;
}

export const SegmentComparisonSelector: React.FC<SegmentComparisonSelectorProps> = ({
  segments,
  selectedSegments,
  onSelectSegment,
  onRemoveSegment,
  onClearSegments,
  maxSelections = 5
}) => {
  // Filter out segments that are already selected
  const availableSegments = segments.filter(
    segment => !selectedSegments.some(selected => selected.id === segment.id)
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Compare Segments</h3>
      </div>
      
      <div className="px-6 py-4">
        <div className="mb-4">
          <label htmlFor="segmentSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Select Segments to Compare
          </label>
          <select
            id="segmentSelect"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => {
              const segmentId = e.target.value;
              if (segmentId) {
                const segment = segments.find(s => s.id === segmentId);
                if (segment) {
                  onSelectSegment(segment);
                  e.target.value = ''; // Reset select after selection
                }
              }
            }}
            disabled={selectedSegments.length >= maxSelections || availableSegments.length === 0}
          >
            <option value="">Select a segment...</option>
            {availableSegments.map(segment => (
              <option key={segment.id} value={segment.id}>
                {segment.name}
              </option>
            ))}
          </select>
          
          <div className="mt-1 text-xs text-gray-500">
            {selectedSegments.length >= maxSelections 
              ? `Maximum of ${maxSelections} segments can be compared at once.` 
              : `Select up to ${maxSelections} segments to compare (${selectedSegments.length}/${maxSelections} selected).`
            }
          </div>
        </div>
        
        {selectedSegments.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Segments</h4>
            <div className="space-y-2">
              {selectedSegments.map(segment => (
                <div key={segment.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">{segment.name}</span>
                  <button
                    onClick={() => onRemoveSegment(segment.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove ${segment.name} from comparison`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <button
                onClick={onClearSegments}
                className="w-full px-3 py-1.5 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
