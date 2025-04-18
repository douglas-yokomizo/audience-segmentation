import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import { Segment } from '../../core/models/Segment';

// State interface
interface ComparisonState {
  comparisonSegments: Segment[];
}

// Action types
type ComparisonAction =
  | { type: 'ADD_COMPARISON_SEGMENT'; payload: Segment }
  | { type: 'REMOVE_COMPARISON_SEGMENT'; payload: string }
  | { type: 'CLEAR_COMPARISON_SEGMENTS' };

// Initial state
const initialState: ComparisonState = {
  comparisonSegments: [],
};

// Context type
interface ComparisonContextType {
  state: ComparisonState;
  dispatch: React.Dispatch<ComparisonAction>;
}

// Create context
export const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

// Reducer function
const comparisonReducer = (state: ComparisonState, action: ComparisonAction): ComparisonState => {
  switch (action.type) {
    case 'ADD_COMPARISON_SEGMENT':
      // Don't add if already in comparison list
      if (state.comparisonSegments.some(segment => segment.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        comparisonSegments: [...state.comparisonSegments, action.payload],
      };
      
    case 'REMOVE_COMPARISON_SEGMENT':
      return {
        ...state,
        comparisonSegments: state.comparisonSegments.filter(
          segment => segment.id !== action.payload
        ),
      };
      
    case 'CLEAR_COMPARISON_SEGMENTS':
      return {
        ...state,
        comparisonSegments: [],
      };

    default:
      return state;
  }
};

// Provider component
interface ComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(comparisonReducer, initialState);

  return (
    <ComparisonContext.Provider value={{ state, dispatch }}>
      {children}
    </ComparisonContext.Provider>
  );
};

// Custom hook to use the context
export const useComparisonContext = () => {
  const context = useContext(ComparisonContext);
  
  if (context === undefined) {
    throw new Error('useComparisonContext must be used within a ComparisonProvider');
  }
  
  return context;
};
