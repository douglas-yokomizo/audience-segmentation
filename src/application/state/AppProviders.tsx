import React, { ReactNode } from 'react';
import { SegmentProvider } from './SegmentContext';
import { ComparisonProvider } from './ComparisonContext';
import { UIProvider } from './UIContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <UIProvider>
      <SegmentProvider>
        <ComparisonProvider>
          {children}
        </ComparisonProvider>
      </SegmentProvider>
    </UIProvider>
  );
};
