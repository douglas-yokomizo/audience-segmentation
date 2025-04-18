import React, { createContext, useReducer, ReactNode, useContext } from 'react';

// State interface
interface UIState {
  isLoading: boolean;
  error: string | null;
}

// Action types
type UIAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: UIState = {
  isLoading: false,
  error: null,
};

// Context type
interface UIContextType {
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
}

// Create context
export const UIContext = createContext<UIContextType | undefined>(undefined);

// Reducer function
const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

// Provider component
interface UIProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
};

// Custom hook to use the context
export const useUIContext = () => {
  const context = useContext(UIContext);
  
  if (context === undefined) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  
  return context;
};
