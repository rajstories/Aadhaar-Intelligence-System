import React from 'react';

// ============================================
// AADHAAR INTELLIGENCE SYSTEM TYPES
// ============================================

// Status types for regions
export type RegionStatus = 'NORMAL' | 'WATCH' | 'CRITICAL';
export type TrendDirection = 'up' | 'down' | 'stable';
export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

// Metric types for filtering
export type MetricType = 'Enrolment' | 'Biometric' | 'Demographic';
export type IndexType = 'Demand' | 'Stress' | 'Gap' | 'CompositeRisk';
export type AgeGroup = 'All' | '0-5' | '5-18' | '18-60' | '60+';

// ============================================
// DASHBOARD OVERVIEW (KPI Cards)
// ============================================
export interface DashboardOverview {
  totalTransactions: number;
  avgDemandPressure: number;
  avgOperationalStress: number;
  overallCompositeRisk: number;
  highRiskDistrictCount: number;
  lastUpdated: string;
}

// ============================================
// STATE & DISTRICT SUMMARY
// ============================================
export interface StateSummary {
  stateCode: string;
  stateName: string;
  status: RegionStatus;
  hasAnomaly: boolean;
  trend: TrendDirection;
  compositeRiskIndex: number;
  districtCount: number;
  highRiskDistricts: number;
}

export interface DistrictSummary {
  districtCode: string;
  districtName: string;
  stateName: string;
  status: RegionStatus;
  demandPressureIndex: number;
  operationalStressIndex: number;
  accessibilityGapIndex: number;
  compositeRiskIndex: number;
  trend: TrendDirection;
  signals: SignalBadge[];
  coordinates: [number, number]; // [lat, lng] for map
}

export interface SignalBadge {
  type: 'ANOMALY' | 'RISING_TREND' | 'FALLING_TREND' | 'HIGH_DEMAND' | 'LOW_COVERAGE';
  label: string;
}

// ============================================
// FILTER OPTIONS (from /api/metadata/filters)
// ============================================
export interface FilterOptions {
  states: { code: string; name: string }[];
  districts: { code: string; name: string; stateCode: string }[];
  years: number[];
  months: { value: number; label: string }[];
  metricTypes: MetricType[];
  ageGroups: AgeGroup[];
  indexTypes: IndexType[];
}

export interface AppliedFilters {
  state?: string;
  district?: string;
  year?: number;
  month?: number;
  metricType?: MetricType;
  ageGroup?: AgeGroup;
  indexType?: IndexType;
}

// ============================================
// HEATMAP DATA
// ============================================
export interface HeatmapDataPoint {
  districtCode: string;
  districtName: string;
  stateName: string;
  coordinates: [number, number];
  indexValue: number;
  indexType: IndexType;
  status: RegionStatus;
  signals: SignalBadge[];
}

export interface HeatmapResponse {
  data: HeatmapDataPoint[];
  indexType: IndexType;
  minValue: number;
  maxValue: number;
}

// ============================================
// CHARTS & VISUALS DATA
// ============================================
export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
}

export interface VisualsResponse {
  lineChart?: {
    title: string;
    labels: string[];
    datasets: ChartDataset[];
  };
  barChart?: {
    title: string;
    labels: string[];
    datasets: ChartDataset[];
  };
  pieChart?: {
    title: string;
    labels: string[];
    data: number[];
    backgroundColor: string[];
  };
}

// ============================================
// ALERTS & NOTIFICATIONS
// ============================================
export interface AadhaarAlert {
  id: string;
  region: string;
  regionType: 'State' | 'District';
  alertType: 'ANOMALY' | 'TREND' | 'GAP' | 'CAPACITY';
  severity: AlertSeverity;
  title: string;
  explanation: string;
  confidence: number; // 0-100
  detectedAt: string;
  metrics?: {
    label: string;
    value: number;
    threshold?: number;
  }[];
}

// ============================================
// POLICY FRAMEWORKS
// ============================================
export type PolicyFrameworkType = 
  | 'CAPACITY_AUGMENTATION' 
  | 'OPERATIONAL_STABILISATION' 
  | 'INCLUSION_OUTREACH' 
  | 'MONITOR_ONLY';

export interface PolicyFramework {
  id: string;
  type: PolicyFrameworkType;
  title: string;
  description: string;
  applicableRegions: string[];
  priority: 'High' | 'Medium' | 'Low';
  indicators: string[];
}

// ============================================
// REPORTS
// ============================================
export interface ReportMetadata {
  id: string;
  title: string;
  generatedAt: string;
  filters: AppliedFilters;
  status: 'Ready' | 'Processing' | 'Failed';
  fileUrl?: string;
  fileSize?: string;
}

// ============================================
// VIEW STATE (Navigation)
// ============================================
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  HEATMAP = 'HEATMAP',
  CHARTS = 'CHARTS',
  REPORTS = 'REPORTS',
  ALERTS = 'ALERTS',
  POLICY = 'POLICY',
  SETTINGS = 'SETTINGS'
}

// ============================================
// LEGACY TYPES (kept for compatibility during migration)
// ============================================
export interface Metric {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}
