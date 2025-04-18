import React, { createContext, useReducer, ReactNode, useEffect, useContext } from 'react';
import { Segment } from '../../core/models/Segment';
import { Filter } from '../../core/models/Filter';
import { User } from '../../core/models/User';
import { SegmentRepository } from '../../infrastructure/repositories/SegmentRepository';

// State interface
interface SegmentState {
  segments: Segment[];
  currentSegment: Segment | null;
  segmentResults: Record<string, User[]> | null;
}

// Action types
type SegmentAction =
  | { type: 'SET_SEGMENTS'; payload: Segment[] }
  | { type: 'SET_CURRENT_SEGMENT'; payload: Segment | null }
  | { type: 'ADD_SEGMENT'; payload: Segment }
  | { type: 'UPDATE_SEGMENT'; payload: Segment }
  | { type: 'DELETE_SEGMENT'; payload: string }
  | { type: 'ADD_FILTER'; payload: { segmentId: string; filter: Filter } }
  | { type: 'UPDATE_FILTER'; payload: { segmentId: string; filterId: string; filter: Filter } }
  | { type: 'REMOVE_FILTER'; payload: { segmentId: string; filterId: string } }
  | { type: 'SET_SEGMENT_RESULTS'; payload: Record<string, User[]> };

// Initial state
const initialState: SegmentState = {
  segments: [],
  currentSegment: null,
  segmentResults: null,
};

// Context type
interface SegmentContextType {
  state: SegmentState;
  dispatch: React.Dispatch<SegmentAction>;
}

// Create context
export const SegmentContext = createContext<SegmentContextType | undefined>(undefined);

// Reducer function
const segmentReducer = (state: SegmentState, action: SegmentAction): SegmentState => {
  switch (action.type) {
    case 'SET_SEGMENTS':
      return {
        ...state,
        segments: action.payload,
      };

    case 'SET_CURRENT_SEGMENT':
      return {
        ...state,
        currentSegment: action.payload,
      };

    case 'ADD_SEGMENT':
      return {
        ...state,
        segments: [...state.segments, action.payload],
      };

    case 'UPDATE_SEGMENT':
      return {
        ...state,
        segments: state.segments.map((segment) =>
          segment.id === action.payload.id ? action.payload : segment
        ),
        currentSegment:
          state.currentSegment?.id === action.payload.id
            ? action.payload
            : state.currentSegment,
      };

    case 'DELETE_SEGMENT':
      return {
        ...state,
        segments: state.segments.filter((segment) => segment.id !== action.payload),
        currentSegment:
          state.currentSegment?.id === action.payload
            ? null
            : state.currentSegment,
      };

    case 'ADD_FILTER': {
      const { segmentId, filter } = action.payload;
      return {
        ...state,
        segments: state.segments.map((segment) => {
          if (segment.id === segmentId) {
            return {
              ...segment,
              filters: [...segment.filters, filter],
            };
          }
          return segment;
        }),
        currentSegment:
          state.currentSegment?.id === segmentId
            ? {
                ...state.currentSegment,
                filters: [...state.currentSegment.filters, filter],
              }
            : state.currentSegment,
      };
    }

    case 'UPDATE_FILTER': {
      const { segmentId, filterId, filter } = action.payload;
      return {
        ...state,
        segments: state.segments.map((segment) => {
          if (segment.id === segmentId) {
            return {
              ...segment,
              filters: segment.filters.map((f) =>
                f.id === filterId ? filter : f
              ),
            };
          }
          return segment;
        }),
        currentSegment:
          state.currentSegment?.id === segmentId
            ? {
                ...state.currentSegment,
                filters: state.currentSegment.filters.map((f) =>
                  f.id === filterId ? filter : f
                ),
              }
            : state.currentSegment,
      };
    }

    case 'REMOVE_FILTER': {
      const { segmentId, filterId } = action.payload;
      return {
        ...state,
        segments: state.segments.map((segment) => {
          if (segment.id === segmentId) {
            return {
              ...segment,
              filters: segment.filters.filter((f) => f.id !== filterId),
            };
          }
          return segment;
        }),
        currentSegment:
          state.currentSegment?.id === segmentId
            ? {
                ...state.currentSegment,
                filters: state.currentSegment.filters.filter(
                  (f) => f.id !== filterId
                ),
              }
            : state.currentSegment,
      };
    }

    case 'SET_SEGMENT_RESULTS':
      return {
        ...state,
        segmentResults: action.payload,
      };

    default:
      return state;
  }
};

// Provider component
interface SegmentProviderProps {
  children: ReactNode;
}

// Create repository
const segmentRepository = new SegmentRepository();

export const SegmentProvider: React.FC<SegmentProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(segmentReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load segments from repository
        const segments = await segmentRepository.getAll();
        dispatch({ type: 'SET_SEGMENTS', payload: segments });
      } catch (error) {
        console.error('Failed to load segments:', error);
      }
    };

    loadInitialData();
  }, []);

  return (
    <SegmentContext.Provider value={{ state, dispatch }}>
      {children}
    </SegmentContext.Provider>
  );
};

// Custom hook to use the context
export const useSegmentContext = () => {
  const context = useContext(SegmentContext);
  
  if (context === undefined) {
    throw new Error('useSegmentContext must be used within a SegmentProvider');
  }
  
  return context;
};
