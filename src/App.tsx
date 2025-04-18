import { useState, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProviders } from "./application/state/AppProviders";
import { cn } from "./ui/utils/cn";

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import("./features/dashboard/DashboardPage"));
const SegmentBuilderPage = lazy(
  () => import("./features/segmentBuilder/SegmentBuilderPage")
);
const VisualizationPage = lazy(
  () => import("./features/visualization/VisualizationPage")
);
const ComparisonPage = lazy(
  () => import("./features/comparison/ComparisonPage")
);

// Create a client
const queryClient = new QueryClient();

function App() {
  const [activePage, setActivePage] = useState<
    "dashboard" | "builder" | "visualization" | "comparison"
  >("dashboard");

  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0 flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary-600 flex items-center justify-center text-white font-bold">
                        AS
                      </div>
                      <h1 className="text-xl font-bold text-primary-600 hidden sm:block">
                        Audience Segmentation
                      </h1>
                    </div>
                  </div>
                  <nav className="ml-6 flex space-x-1 sm:space-x-4">
                    {[
                      { id: "dashboard", label: "Dashboard" },
                      { id: "builder", label: "Segment Builder" },
                      { id: "visualization", label: "Visualization" },
                      { id: "comparison", label: "Comparison" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        className={cn(
                          "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          activePage === item.id
                            ? "bg-primary-50 text-primary-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                        onClick={() => setActivePage(item.id as any)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 p-1"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">U</span>
                      </div>
                      <span className="hidden md:block text-sm font-medium text-gray-700">
                        User
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full border-4 border-primary-200 border-opacity-50"></div>
                      <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-l-4 border-primary-600 animate-spin"></div>
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">
                      Loading content...
                    </p>
                  </div>
                </div>
              }
            >
              {activePage === "dashboard" && <DashboardPage />}
              {activePage === "builder" && <SegmentBuilderPage />}
              {activePage === "visualization" && <VisualizationPage />}
              {activePage === "comparison" && <ComparisonPage />}
            </Suspense>
          </main>
        </div>
      </AppProviders>
    </QueryClientProvider>
  );
}

export default App;
