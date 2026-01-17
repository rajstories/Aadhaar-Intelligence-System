/**
 * HeatmapPage Component
 * 
 * India map with district-level dots colored by selected index type.
 * Uses Leaflet for map rendering and integrates with filter bar.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import { Loader2, AlertTriangle, Info } from 'lucide-react';
import {
  HeatmapResponse,
  HeatmapDataPoint,
  IndexType,
  RegionStatus,
} from '../types';
import { fetchHeatmapData } from '../services/aadhaarApi';
import { useFilters } from '../hooks/useFilters';
import FilterBar from './FilterBar';

// Map bounds for India
const INDIA_BOUNDS: [[number, number], [number, number]] = [
  [6.5, 68.0],  // Southwest
  [37.0, 97.5], // Northeast
];

const INDIA_CENTER: [number, number] = [22.5, 82.5];

// Helper to get color based on index value
const getIndexColor = (value: number): string => {
  if (value >= 80) return '#dc2626'; // red-600
  if (value >= 60) return '#ea580c'; // orange-600
  if (value >= 40) return '#ca8a04'; // yellow-600
  if (value >= 20) return '#16a34a'; // green-600
  return '#0891b2'; // cyan-600
};

// Helper to get status color
const getStatusColor = (status: RegionStatus): string => {
  switch (status) {
    case 'CRITICAL': return '#dc2626';
    case 'WATCH': return '#f59e0b';
    case 'NORMAL': return '#22c55e';
    default: return '#6b7280';
  }
};

// Map controller for centering
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const HeatmapPage: React.FC = () => {
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

  const [heatmapData, setHeatmapData] = useState<HeatmapResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(INDIA_CENTER);
  const [mapZoom, setMapZoom] = useState(5);

  // Load heatmap data
  const loadHeatmapData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchHeatmapData(filters);
      setHeatmapData(data);
    } catch (err) {
      console.warn('API unavailable, using mock data:', err);
      // Generate mock data for demo (clear error since we have fallback)
      setError(null);
      const mockData: HeatmapDataPoint[] = generateMockHeatmapData();
      setHeatmapData({
        data: mockData,
        indexType: (filters.indexType as IndexType) || 'CompositeRisk',
        minValue: 10,
        maxValue: 95,
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load data on mount and when filters change
  useEffect(() => {
    loadHeatmapData();
  }, [loadHeatmapData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Heatmap</h1>
        <p className="text-gray-600 text-sm mt-1">
          District-level visualization of Aadhaar system metrics across India
        </p>
      </div>

      {/* Filter Bar */}
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
        showFilters={{
          state: true,
          district: true,
          year: true,
          month: true,
          metricType: false,
          ageGroup: false,
          indexType: true,
        }}
      />

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {filters.indexType ? `${filters.indexType} Index` : 'Composite Risk Index'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-600" />
              <span className="text-xs text-gray-600">Low (0-20)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-xs text-gray-600">Normal (20-40)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600" />
              <span className="text-xs text-gray-600">Moderate (40-60)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-600" />
              <span className="text-xs text-gray-600">High (60-80)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600" />
              <span className="text-xs text-gray-600">Critical (80+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-[1000] bg-white/80 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading map data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Leaflet Map */}
        <div style={{ height: '600px' }}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            maxBounds={INDIA_BOUNDS}
            minZoom={4}
            maxZoom={10}
          >
            <MapController center={mapCenter} zoom={mapZoom} />
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* District Markers */}
            {heatmapData?.data.map((point) => (
              <CircleMarker
                key={point.districtCode}
                center={point.coordinates}
                radius={8}
                pathOptions={{
                  color: getIndexColor(point.indexValue),
                  fillColor: getIndexColor(point.indexValue),
                  fillOpacity: 0.7,
                  weight: 2,
                }}
              >
                <Tooltip direction="top" offset={[0, -5]} permanent={false}>
                  <div className="text-xs">
                    <p className="font-semibold">{point.districtName}</p>
                    <p className="text-gray-500">{point.stateName}</p>
                  </div>
                </Tooltip>
                <Popup>
                  <div className="min-w-[200px]">
                    <h3 className="font-bold text-sm mb-2">{point.districtName}</h3>
                    <p className="text-xs text-gray-500 mb-3">{point.stateName}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                          {heatmapData.indexType === 'CompositeRisk' ? 'Composite Risk' : `${heatmapData.indexType} Index`}
                        </span>
                        <span 
                          className="text-sm font-bold"
                          style={{ color: getIndexColor(point.indexValue) }}
                        >
                          {point.indexValue.toFixed(1)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Status</span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                          style={{
                            backgroundColor: `${getStatusColor(point.status)}20`,
                            color: getStatusColor(point.status),
                          }}
                        >
                          {point.status}
                        </span>
                      </div>
                      
                      {point.signals.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-[10px] text-gray-500 mb-1">Signals:</p>
                          <div className="flex flex-wrap gap-1">
                            {point.signals.map((signal, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-[9px] font-medium"
                              >
                                {signal.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Stats Summary */}
      {heatmapData && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">Total Districts</p>
            <p className="text-2xl font-bold text-gray-900">{heatmapData.data.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">Critical</p>
            <p className="text-2xl font-bold text-red-600">
              {heatmapData.data.filter(d => d.status === 'CRITICAL').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">Watch</p>
            <p className="text-2xl font-bold text-yellow-600">
              {heatmapData.data.filter(d => d.status === 'WATCH').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">Normal</p>
            <p className="text-2xl font-bold text-green-600">
              {heatmapData.data.filter(d => d.status === 'NORMAL').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Generate mock heatmap data for demo
function generateMockHeatmapData(): HeatmapDataPoint[] {
  const states = [
    { name: 'Uttar Pradesh', coords: [27.0, 80.5], districts: 15 },
    { name: 'Maharashtra', coords: [19.5, 75.5], districts: 12 },
    { name: 'Bihar', coords: [25.5, 85.5], districts: 10 },
    { name: 'West Bengal', coords: [23.0, 87.5], districts: 8 },
    { name: 'Madhya Pradesh', coords: [23.5, 78.0], districts: 10 },
    { name: 'Tamil Nadu', coords: [11.0, 78.5], districts: 10 },
    { name: 'Rajasthan', coords: [27.0, 73.5], districts: 10 },
    { name: 'Karnataka', coords: [15.0, 76.0], districts: 8 },
    { name: 'Gujarat', coords: [22.5, 71.5], districts: 8 },
    { name: 'Andhra Pradesh', coords: [15.5, 79.5], districts: 6 },
    { name: 'Odisha', coords: [20.5, 84.5], districts: 8 },
    { name: 'Kerala', coords: [10.0, 76.5], districts: 5 },
    { name: 'Jharkhand', coords: [24.0, 85.5], districts: 6 },
    { name: 'Assam', coords: [26.0, 92.5], districts: 5 },
    { name: 'Punjab', coords: [31.0, 75.5], districts: 5 },
    { name: 'Haryana', coords: [29.0, 76.0], districts: 5 },
    { name: 'Chhattisgarh', coords: [21.5, 82.0], districts: 5 },
  ];

  const dataPoints: HeatmapDataPoint[] = [];

  states.forEach(state => {
    for (let i = 0; i < state.districts; i++) {
      const indexValue = 15 + Math.random() * 75;
      const status: RegionStatus = indexValue >= 70 ? 'CRITICAL' : indexValue >= 50 ? 'WATCH' : 'NORMAL';
      
      dataPoints.push({
        districtCode: `${state.name.substring(0, 2).toUpperCase()}-D${i + 1}`,
        districtName: `${state.name} District ${i + 1}`,
        stateName: state.name,
        coordinates: [
          state.coords[0] + (Math.random() - 0.5) * 3,
          state.coords[1] + (Math.random() - 0.5) * 3,
        ] as [number, number],
        indexValue,
        indexType: 'CompositeRisk',
        status,
        signals: indexValue >= 75 ? [{ type: 'ANOMALY' as const, label: 'Anomaly' }] : [],
      });
    }
  });

  return dataPoints;
}

export default HeatmapPage;
