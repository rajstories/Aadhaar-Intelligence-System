import React, { useState, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { ViewState } from './types';
import { COLORS } from './constants';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const HeatmapPage = React.lazy(() => import('./components/HeatmapPage'));
const ChartsPage = React.lazy(() => import('./components/ChartsPage'));
const ReportsPage = React.lazy(() => import('./components/ReportsPage'));
const AlertsPage = React.lazy(() => import('./components/AlertsPage'));
const PolicyPage = React.lazy(() => import('./components/PolicyPage'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 animate-in fade-in duration-300">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
    <p className="text-sm font-medium">Loading module...</p>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.HEATMAP:
        return <HeatmapPage />;
      case ViewState.CHARTS:
        return <ChartsPage />;
      case ViewState.REPORTS:
        return <ReportsPage />;
      case ViewState.ALERTS:
        return <AlertsPage />;
      case ViewState.POLICY:
        return <PolicyPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-bold text-gray-800">{currentView} View</h2>
            <p className="text-gray-500 mt-2">This module is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
      <Header onViewChange={setCurrentView} />
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="ml-60 pt-16 min-h-screen transition-all duration-300">
        <div className="p-8 max-w-[1920px] mx-auto">
          <Suspense fallback={<LoadingFallback />}>
            {renderContent()}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default App;
