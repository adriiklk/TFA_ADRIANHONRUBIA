/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InfrastructureReport {
  // General Analysis Details
  organizationType: string;
  scale: string;
  workloadIntensity: string;
  complexityLevel: string;
  decentralizationDifficulty: string;

  // Infrastructure Requirements
  serversRequired: number;
  gpusNeeded: number;
  gpuModel: string;
  storageRequiredTB: number;
  storageType: string;
  networkingSpeedGbps: number;
  coolingSystem: string;
  estimatedPhysicalSpaceSqFt: number;

  // Energy Consumption
  dailyKwh: number;
  monthlyKwh: number;
  yearlyKwh: number;
  equivalenceResidentialRatio: number;
  equivalenceText: string;

  // Economic Costs
  hardwareInvestment: number;
  monthlyElectricityCost: number;
  annualMaintenance: number;
  hardwareReplacementCycleYears: number;
  hardwareReplacementAnnual: number;
  coolingAnnualCost: number;

  // Environmental Impact
  yearlyCo2EmissionsTons: number;
  heatGenerationBtuHrs: number;
  materialRareEarthKg: number;
  sustainabilityScore: number;

  // Feasibility Analysis
  viabilityScore: number;
  decentralizationMeter: number;
  difficultyIndicator: string; // "Low" | "Moderate" | "Complex" | "Extreme"
  analysisVerdict: string;
  strategicAdvice: string[];
}
