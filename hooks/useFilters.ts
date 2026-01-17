/**
 * useFilters Hook
 * 
 * Centralized filter state management for the Aadhaar Intelligence Dashboard.
 * Provides filter options from API and maintains current filter selections.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  FilterOptions,
  AppliedFilters,
  MetricType,
  AgeGroup,
  IndexType,
} from '../types';
import { fetchFilterMetadata } from '../services/aadhaarApi';

interface UseFiltersResult {
  // Filter options from API
  filterOptions: FilterOptions | null;
  loadingOptions: boolean;
  optionsError: string | null;
  
  // Current filter values
  filters: AppliedFilters;
  
  // Filter setters
  setStateFilter: (state: string | undefined) => void;
  setDistrictFilter: (district: string | undefined) => void;
  setYearFilter: (year: number | undefined) => void;
  setMonthFilter: (month: number | undefined) => void;
  setMetricTypeFilter: (metricType: MetricType | undefined) => void;
  setAgeGroupFilter: (ageGroup: AgeGroup | undefined) => void;
  setIndexTypeFilter: (indexType: IndexType | undefined) => void;
  
  // Bulk operations
  setFilters: (filters: AppliedFilters) => void;
  clearFilters: () => void;
  
  // Query string builder
  buildQueryString: () => string;
  
  // Filtered district options based on selected state
  filteredDistricts: { code: string; name: string; stateCode: string }[];
  
  // Refresh filter options
  refreshOptions: () => Promise<void>;
}

const INITIAL_FILTERS: AppliedFilters = {};

export const useFilters = (): UseFiltersResult => {
  // Filter options state
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  
  // Current filter selections
  const [filters, setFiltersState] = useState<AppliedFilters>(INITIAL_FILTERS);

  // Fetch filter options from API
  const fetchOptions = useCallback(async () => {
    try {
      setLoadingOptions(true);
      setOptionsError(null);
      const options = await fetchFilterMetadata();
      setFilterOptions(options);
    } catch (err) {
      setOptionsError(err instanceof Error ? err.message : 'Failed to load filter options');
      // Set default fallback options
      setFilterOptions({
        states: [],
        districts: [],
        years: [2024, 2025, 2026],
        months: [
          { value: 1, label: 'January' },
          { value: 2, label: 'February' },
          { value: 3, label: 'March' },
          { value: 4, label: 'April' },
          { value: 5, label: 'May' },
          { value: 6, label: 'June' },
          { value: 7, label: 'July' },
          { value: 8, label: 'August' },
          { value: 9, label: 'September' },
          { value: 10, label: 'October' },
          { value: 11, label: 'November' },
          { value: 12, label: 'December' },
        ],
        metricTypes: ['Enrolment', 'Biometric', 'Demographic'],
        ageGroups: ['All', '0-5', '5-18', '18-60', '60+'],
        indexTypes: ['Demand', 'Stress', 'Gap', 'CompositeRisk'],
      });
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Individual filter setters
  const setStateFilter = useCallback((state: string | undefined) => {
    setFiltersState(prev => {
      // Clear district when state changes
      const newFilters: AppliedFilters = { ...prev, state };
      if (state !== prev.state) {
        newFilters.district = undefined;
      }
      return newFilters;
    });
  }, []);

  const setDistrictFilter = useCallback((district: string | undefined) => {
    setFiltersState(prev => ({ ...prev, district }));
  }, []);

  const setYearFilter = useCallback((year: number | undefined) => {
    setFiltersState(prev => ({ ...prev, year }));
  }, []);

  const setMonthFilter = useCallback((month: number | undefined) => {
    setFiltersState(prev => ({ ...prev, month }));
  }, []);

  const setMetricTypeFilter = useCallback((metricType: MetricType | undefined) => {
    setFiltersState(prev => ({ ...prev, metricType }));
  }, []);

  const setAgeGroupFilter = useCallback((ageGroup: AgeGroup | undefined) => {
    setFiltersState(prev => ({ ...prev, ageGroup }));
  }, []);

  const setIndexTypeFilter = useCallback((indexType: IndexType | undefined) => {
    setFiltersState(prev => ({ ...prev, indexType }));
  }, []);

  // Bulk operations
  const setFilters = useCallback((newFilters: AppliedFilters) => {
    setFiltersState(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(INITIAL_FILTERS);
  }, []);

  // Build query string from current filters
  const buildQueryString = useCallback((): string => {
    const params = new URLSearchParams();
    
    if (filters.state) params.append('state', filters.state);
    if (filters.district) params.append('district', filters.district);
    if (filters.year) params.append('year', filters.year.toString());
    if (filters.month) params.append('month', filters.month.toString());
    if (filters.metricType) params.append('metricType', filters.metricType);
    if (filters.ageGroup) params.append('ageGroup', filters.ageGroup);
    if (filters.indexType) params.append('indexType', filters.indexType);
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }, [filters]);

  // Filter districts based on selected state
  const filteredDistricts = useMemo(() => {
    if (!filterOptions?.districts) return [];
    if (!filters.state) return filterOptions.districts;
    return filterOptions.districts.filter(d => d.stateCode === filters.state);
  }, [filterOptions?.districts, filters.state]);

  return {
    filterOptions,
    loadingOptions,
    optionsError,
    filters,
    setStateFilter,
    setDistrictFilter,
    setYearFilter,
    setMonthFilter,
    setMetricTypeFilter,
    setAgeGroupFilter,
    setIndexTypeFilter,
    setFilters,
    clearFilters,
    buildQueryString,
    filteredDistricts,
    refreshOptions: fetchOptions,
  };
};

export default useFilters;
