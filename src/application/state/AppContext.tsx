import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import { Segment } from "../../core/models/Segment";
import { User } from "../../core/models/User";
import { Filter } from "../../core/models/Filter";
import { SegmentRepository } from "../../infrastructure/repositories/SegmentRepository";

// State interface
interface AppState {
  segments: Segment[];
  currentSegment: Segment | null;
  segmentResults: Record<string, User[]> | null;
  comparisonSegments: Segment[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: "SET_SEGMENTS"; payload: Segment[] }
  | { type: "SET_CURRENT_SEGMENT"; payload: Segment | null }
  | { type: "ADD_SEGMENT"; payload: Segment }
  | { type: "UPDATE_SEGMENT"; payload: Segment }
  | { type: "DELETE_SEGMENT"; payload: string }
  | { type: "ADD_FILTER"; payload: { segmentId: string; filter: Filter } }
  | {
      type: "UPDATE_FILTER";
      payload: { segmentId: string; filterId: string; filter: Filter };
    }
  | { type: "REMOVE_FILTER"; payload: { segmentId: string; filterId: string } }
  | { type: "SET_SEGMENT_RESULTS"; payload: Record<string, User[]> }
  | { type: "ADD_COMPARISON_SEGMENT"; payload: Segment }
  | { type: "REMOVE_COMPARISON_SEGMENT"; payload: string }
  | { type: "CLEAR_COMPARISON_SEGMENTS"; payload?: undefined }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Initial state
const initialState: AppState = {
  segments: [],
  currentSegment: null,
  segmentResults: null,
  comparisonSegments: [],
  isLoading: false,
  error: null,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_SEGMENTS":
      return {
        ...state,
        segments: action.payload,
      };

    case "SET_CURRENT_SEGMENT":
      return {
        ...state,
        currentSegment: action.payload,
      };

    case "ADD_SEGMENT":
      return {
        ...state,
        segments: [...state.segments, action.payload],
      };

    case "UPDATE_SEGMENT":
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

    case "DELETE_SEGMENT":
      return {
        ...state,
        segments: state.segments.filter(
          (segment) => segment.id !== action.payload
        ),
        currentSegment:
          state.currentSegment?.id === action.payload
            ? null
            : state.currentSegment,
      };

    case "ADD_FILTER": {
      const { segmentId, filter } = action.payload;

      return {
        ...state,
        segments: state.segments.map((segment) => {
          if (segment.id === segmentId) {
            return {
              ...segment,
              filters: [...segment.filters, filter],
              updatedAt: new Date(),
            };
          }
          return segment;
        }),
        currentSegment:
          state.currentSegment?.id === segmentId
            ? {
                ...state.currentSegment,
                filters: [...state.currentSegment.filters, filter],
                updatedAt: new Date(),
              }
            : state.currentSegment,
      };
    }

    case "UPDATE_FILTER": {
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
              updatedAt: new Date(),
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
                updatedAt: new Date(),
              }
            : state.currentSegment,
      };
    }

    case "REMOVE_FILTER": {
      const { segmentId, filterId } = action.payload;

      return {
        ...state,
        segments: state.segments.map((segment) => {
          if (segment.id === segmentId) {
            return {
              ...segment,
              filters: segment.filters.filter((f) => f.id !== filterId),
              updatedAt: new Date(),
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
                updatedAt: new Date(),
              }
            : state.currentSegment,
      };
    }

    case "SET_SEGMENT_RESULTS":
      return {
        ...state,
        segmentResults: action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "ADD_COMPARISON_SEGMENT":
      // Don't add if already in comparison list
      if (
        state.comparisonSegments.some(
          (segment) => segment.id === action.payload.id
        )
      ) {
        return state;
      }
      return {
        ...state,
        comparisonSegments: [...state.comparisonSegments, action.payload],
      };

    case "REMOVE_COMPARISON_SEGMENT":
      return {
        ...state,
        comparisonSegments: state.comparisonSegments.filter(
          (segment) => segment.id !== action.payload
        ),
      };

    case "CLEAR_COMPARISON_SEGMENTS":
      return {
        ...state,
        comparisonSegments: [],
      };

    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

// Create repository
const segmentRepository = new SegmentRepository();

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Load segments from repository
        const segments = await segmentRepository.getAll();
        dispatch({ type: "SET_SEGMENTS", payload: segments });

        dispatch({ type: "SET_LOADING", payload: false });
      } catch (error) {
        console.error("Failed to load initial data:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load initial data" });
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
