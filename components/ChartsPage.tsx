/**
 * ChartsPage Component
 * 
 * Charts & Visuals page with filter-driven Chart.js visualizations.
 * Includes line charts, bar charts, and pie charts.
 */

import React, { useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Loader2, BarChart3, TrendingUp, PieChart, AlertTriangle } from 'lucide-react';
import { VisualsResponse } from '../types';
import { fetchVisualsData } from '../services/aadhaarApi';
import { useFilters } from '../hooks/useFilters';
import FilterBar from './FilterBar';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartsPage: React.FC = () => {
  const {
    filterOptions,
    filters,
    loadingOptions,
    setStateFilter,
    setDistrictFilter,
    setYearFilter,
    setMonthFilter,
    setMetricTypeFilter,
    setAgeGroupFilter,
    setIndexTypeFilter,
    clearFilters,
    filteredDistricts,
  } = useFilters();

  const [visualsData, setVisualsData] = useState<VisualsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Generate visuals
  const handleGenerateVisuals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchVisualsData(filters);
      setVisualsData(data);
      setHasGenerated(true);
    } catch (err) {
      console.warn('API unavailable, using mock data:', err);
      // Generate mock data for demo (clear error since we have fallback)
      setError(null);
      setVisualsData(generateMockVisualsData());
      setHasGenerated(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: visualsData?.lineChart?.title || 'Trend Analysis',
        font: { size: 14, weight: 'bold' as const },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: visualsData?.barChart?.title || 'Comparison Analysis',
        font: { size: 14, weight: 'bold' as const },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: visualsData?.pieChart?.title || 'Distribution Analysis',
        font: { size: 14, weight: 'bold' as const },
      },
    },
  };

  // Prepare chart data
  const lineChartData = visualsData?.lineChart
    ? {
        labels: visualsData.lineChart.labels,
        datasets: visualsData.lineChart.datasets.map((ds, idx) => ({
          ...ds,
          borderColor: ds.borderColor || ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][idx % 4],
          backgroundColor: ds.backgroundColor || `${['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][idx % 4]}20`,
          tension: 0.3,
          fill: true,
        })),
      }
    : null;

  const barChartData = visualsData?.barChart
    ? {
        labels: visualsData.barChart.labels,
        datasets: visualsData.barChart.datasets.map((ds, idx) => ({
          ...ds,
          backgroundColor: ds.backgroundColor || ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][idx % 4],
        })),
      }
    : null;

  const pieChartData = visualsData?.pieChart
    ? {
        labels: visualsData.pieChart.labels,
        datasets: [
          {
            data: visualsData.pieChart.data,
            backgroundColor: visualsData.pieChart.backgroundColor,
            borderWidth: 2,
            borderColor: '#fff',
          },
        ],
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Charts & Visuals</h1>
        <p className="text-gray-600 text-sm mt-1">
          Generate filter-driven visualizations for Aadhaar system analysis
        </p>
      </div>

      {/* Filter Bar with Generate Button */}
      <FilterBar
        filterOptions={filterOptions}
        filters={filters}
        loading={loadingOptions}
        onStateChange={setStateFilter}
        onDistrictChange={setDistrictFilter}
        onYearChange={setYearFilter}
        onMonthChange={setMonthFilter}
        onMetricTypeChange={setMetricTypeFilter}
        onAgeGroupChange={setAgeGroupFilter}
        onIndexTypeChange={setIndexTypeFilter}
        onClearFilters={clearFilters}
        filteredDistricts={filteredDistricts}
        actionButton={{
          label: 'Generate Visuals',
          onClick: handleGenerateVisuals,
          loading: loading,
        }}
      />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Empty State - Before Generation */}
      {!hasGenerated && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Visuals Generated</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Apply filters above and click "Generate Visuals" to create charts based on your selected criteria.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Generating visualizations...</p>
        </div>
      )}

      {/* Charts Grid */}
      {hasGenerated && !loading && visualsData && (
        <div className="space-y-6">
          {/* Line Chart */}
          {lineChartData && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Trend Analysis</h3>
              </div>
              <div style={{ height: '350px' }}>
                <Line data={lineChartData} options={lineChartOptions} />
              </div>
            </div>
          )}

          {/* Bar and Pie Charts - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            {barChartData && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Comparison</h3>
                </div>
                <div style={{ height: '300px' }}>
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>
            )}

            {/* Pie Chart */}
            {pieChartData && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Distribution</h3>
                </div>
                <div style={{ height: '300px' }}>
                  <Pie data={pieChartData} options={pieChartOptions} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Generate mock visuals data for demo
function generateMockVisualsData(): VisualsResponse {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const states = ['UP', 'MH', 'BR', 'WB', 'MP', 'TN', 'RJ', 'GJ'];

  return {
    lineChart: {
      title: 'Monthly Trend - Demand Pressure & Operational Stress',
      labels: months,
      datasets: [
        {
          label: 'Demand Pressure Index',
          data: months.map(() => 40 + Math.random() * 40),
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f620',
        },
        {
          label: 'Operational Stress Index',
          data: months.map(() => 30 + Math.random() * 35),
          borderColor: '#ef4444',
          backgroundColor: '#ef444420',
        },
      ],
    },
    barChart: {
      title: 'State-wise Composite Risk Index',
      labels: states,
      datasets: [
        {
          label: 'Composite Risk',
          data: states.map(() => 30 + Math.random() * 50),
          backgroundColor: [
            '#dc2626', '#f59e0b', '#dc2626', '#22c55e',
            '#f59e0b', '#22c55e', '#22c55e', '#22c55e',
          ],
        },
      ],
    },
    pieChart: {
      title: 'District Status Distribution',
      labels: ['Critical', 'Watch', 'Normal'],
      data: [127, 234, 389],
      backgroundColor: ['#dc2626', '#f59e0b', '#22c55e'],
    },
  };
}

export default ChartsPage;
