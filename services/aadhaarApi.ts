/**
 * Aadhaar Intelligence System API Service
 * 
 * Handles all API calls to the backend for dashboard data,
 * state/district summaries, filters, heatmap, visuals, alerts, reports, and policies.
 */

import {
  DashboardOverview,
  StateSummary,
  DistrictSummary,
  FilterOptions,
  AppliedFilters,
  HeatmapResponse,
  VisualsResponse,
  AadhaarAlert,
  PolicyFramework,
  ReportMetadata,
} from '../types';

// Base API URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Helper to build query string from filters
 */
function buildQueryString(filters: AppliedFilters): string {
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
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// ============================================
// DASHBOARD ENDPOINTS
// ============================================

/**
 * Fetch dashboard overview KPIs
 * GET /api/dashboard/overview
 */
export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  return apiFetch<DashboardOverview>('/dashboard/overview');
}

/**
 * Fetch all states summary
 * GET /api/dashboard/states-summary
 */
export async function fetchStatesSummary(): Promise<StateSummary[]> {
  return apiFetch<StateSummary[]>('/dashboard/states-summary');
}

/**
 * Fetch districts summary for a specific state
 * GET /api/dashboard/states/{stateName}/districts-summary
 */
export async function fetchDistrictsSummary(stateName: string): Promise<DistrictSummary[]> {
  const encodedState = encodeURIComponent(stateName);
  return apiFetch<DistrictSummary[]>(`/dashboard/states/${encodedState}/districts-summary`);
}

/**
 * Trigger ML pipeline sync
 * POST /api/dashboard/sync
 */
export async function syncData(): Promise<{ success: boolean; message: string }> {
  return apiFetch<{ success: boolean; message: string }>('/dashboard/sync', {
    method: 'POST',
  });
}

// ============================================
// FILTER METADATA
// ============================================

/**
 * Fetch filter dropdown options
 * GET /api/metadata/filters
 */
export async function fetchFilterMetadata(): Promise<FilterOptions> {
  return apiFetch<FilterOptions>('/metadata/filters');
}

// ============================================
// HEATMAP
// ============================================

/**
 * Fetch heatmap data with filters
 * GET /api/dashboard/heatmap?filters...
 */
export async function fetchHeatmapData(filters: AppliedFilters): Promise<HeatmapResponse> {
  const queryString = buildQueryString(filters);
  return apiFetch<HeatmapResponse>(`/dashboard/heatmap${queryString}`);
}

// ============================================
// CHARTS & VISUALS
// ============================================

/**
 * Fetch visualization data with filters
 * GET /api/dashboard/visuals?filters...
 */
export async function fetchVisualsData(filters: AppliedFilters): Promise<VisualsResponse> {
  const queryString = buildQueryString(filters);
  return apiFetch<VisualsResponse>(`/dashboard/visuals${queryString}`);
}

// ============================================
// ALERTS
// ============================================

/**
 * Fetch all alerts
 * GET /api/dashboard/alerts
 */
export async function fetchAlerts(): Promise<AadhaarAlert[]> {
  return apiFetch<AadhaarAlert[]>('/dashboard/alerts');
}

// ============================================
// POLICY FRAMEWORKS
// ============================================

/**
 * Fetch policy frameworks
 * GET /api/dashboard/policy-frameworks
 */
export async function fetchPolicyFrameworks(): Promise<PolicyFramework[]> {
  return apiFetch<PolicyFramework[]>('/dashboard/policy-frameworks');
}

// ============================================
// REPORTS
// ============================================

/**
 * Generate a new report
 * POST /api/reports/generate
 */
export async function generateReport(filters: AppliedFilters): Promise<ReportMetadata> {
  return apiFetch<ReportMetadata>('/reports/generate', {
    method: 'POST',
    body: JSON.stringify({ filters }),
  });
}

/**
 * Fetch all reports
 * GET /api/reports
 */
export async function fetchReports(): Promise<ReportMetadata[]> {
  return apiFetch<ReportMetadata[]>('/reports');
}

/**
 * Delete a report
 * DELETE /api/reports/{id}
 */
export async function deleteReport(id: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/reports/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Download a report file
 * Returns the download URL or triggers download
 */
export function getReportDownloadUrl(report: ReportMetadata): string {
  if (report.fileUrl) {
    return report.fileUrl;
  }
  return `${API_BASE_URL}/reports/${report.id}/download`;
}
