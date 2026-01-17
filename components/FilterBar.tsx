/**
 * FilterBar Component
 * 
 * Reusable filter bar for the Aadhaar Intelligence Dashboard.
 * Used across Heatmap, Charts, Reports, and other pages.
 */

import React from 'react';
import { Filter, X, Loader2 } from 'lucide-react';
import {
  FilterOptions,
  AppliedFilters,
  MetricType,
  AgeGroup,
  IndexType,
} from '../types';

interface FilterBarProps {
  filterOptions: FilterOptions | null;
  filters: AppliedFilters;
  loading?: boolean;
  
  // Filter setters
  onStateChange: (state: string | undefined) => void;
  onDistrictChange: (district: string | undefined) => void;
  onYearChange: (year: number | undefined) => void;
  onMonthChange: (month: number | undefined) => void;
  onMetricTypeChange: (metricType: MetricType | undefined) => void;
  onAgeGroupChange: (ageGroup: AgeGroup | undefined) => void;
  onIndexTypeChange: (indexType: IndexType | undefined) => void;
  onClearFilters: () => void;
  
  // Optional action button
  actionButton?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
  
  // Filtered districts based on state selection
  filteredDistricts?: { code: string; name: string; stateCode: string }[];
  
  // Which filters to show (default: all)
  showFilters?: {
    state?: boolean;
    district?: boolean;
    year?: boolean;
    month?: boolean;
    metricType?: boolean;
    ageGroup?: boolean;
    indexType?: boolean;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterOptions,
  filters,
  loading = false,
  onStateChange,
  onDistrictChange,
  onYearChange,
  onMonthChange,
  onMetricTypeChange,
  onAgeGroupChange,
  onIndexTypeChange,
  onClearFilters,
  actionButton,
  filteredDistricts,
  showFilters = {
    state: true,
    district: true,
    year: true,
    month: true,
    metricType: true,
    ageGroup: true,
    indexType: true,
  },
}) => {
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);
  const districts = filteredDistricts || filterOptions?.districts || [];

  const selectClassName = `
    px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 
    bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-transparent transition-colors cursor-pointer min-w-[140px]
  `;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading filters...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">Filters</span>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="ml-2 flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* State Filter */}
        {showFilters.state && (
          <select
            value={filters.state || ''}
            onChange={(e) => onStateChange(e.target.value || undefined)}
            className={selectClassName}
          >
            <option value="">All States</option>
            {filterOptions?.states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        )}

        {/* District Filter */}
        {showFilters.district && (
          <select
            value={filters.district || ''}
            onChange={(e) => onDistrictChange(e.target.value || undefined)}
            className={selectClassName}
            disabled={!filters.state && districts.length === 0}
          >
            <option value="">All Districts</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        )}

        {/* Year Filter */}
        {showFilters.year && (
          <select
            value={filters.year || ''}
            onChange={(e) => onYearChange(e.target.value ? parseInt(e.target.value) : undefined)}
            className={selectClassName}
          >
            <option value="">All Years</option>
            {filterOptions?.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        )}

        {/* Month Filter */}
        {showFilters.month && (
          <select
            value={filters.month || ''}
            onChange={(e) => onMonthChange(e.target.value ? parseInt(e.target.value) : undefined)}
            className={selectClassName}
          >
            <option value="">All Months</option>
            {filterOptions?.months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        )}

        {/* Metric Type Filter */}
        {showFilters.metricType && (
          <select
            value={filters.metricType || ''}
            onChange={(e) => onMetricTypeChange((e.target.value as MetricType) || undefined)}
            className={selectClassName}
          >
            <option value="">All Metrics</option>
            {filterOptions?.metricTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        )}

        {/* Age Group Filter */}
        {showFilters.ageGroup && (
          <select
            value={filters.ageGroup || ''}
            onChange={(e) => onAgeGroupChange((e.target.value as AgeGroup) || undefined)}
            className={selectClassName}
          >
            <option value="">All Ages</option>
            {filterOptions?.ageGroups.map((group) => (
              <option key={group} value={group}>
                {group === 'All' ? 'All Age Groups' : group}
              </option>
            ))}
          </select>
        )}

        {/* Index Type Filter */}
        {showFilters.indexType && (
          <select
            value={filters.indexType || ''}
            onChange={(e) => onIndexTypeChange((e.target.value as IndexType) || undefined)}
            className={selectClassName}
          >
            <option value="">All Indexes</option>
            {filterOptions?.indexTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'CompositeRisk' ? 'Composite Risk' : `${type} Index`}
              </option>
            ))}
          </select>
        )}

        {/* Action Button */}
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            disabled={actionButton.disabled || actionButton.loading}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                       text-sm font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:ring-offset-2 transition-colors 
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {actionButton.loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
