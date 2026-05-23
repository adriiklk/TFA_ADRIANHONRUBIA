/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sliders, TrendingUp, Info } from "lucide-react";

interface FinancialForecastChartProps {
  initialCapex: number;
  initialMaintenance: number;
  initialElectricity: number;
  initialCooling: number;
}

export default function FinancialForecastChart({
  initialCapex,
  initialMaintenance,
  initialElectricity,
  initialCooling,
}: FinancialForecastChartProps) {
  // Interactive adjustment factors
  const [electricityRateKwh, setElectricityRateKwh] = useState<number>(0.15); // Rate per kWh, default is $0.15
  const [maintenanceRate, setMaintenanceRate] = useState<number>(8); // Maintenance rate % of capex, default 8%
  const [lifespanYears, setLifespanYears] = useState<number>(5); // Up to 5 years

  // Calculate annual OPEX based on custom interactive sliders
  // Baseline electricity cost is tied to the rate.
  const powerFactor = electricityRateKwh / 0.15;
  const customElectricityCostYearly = initialElectricity * 12 * powerFactor;
  const customCoolingCostYearly = initialCooling * powerFactor;
  const customMaintenanceCostYearly = initialCapex * (maintenanceRate / 100);

  const annualOpex = customElectricityCostYearly + customCoolingCostYearly + customMaintenanceCostYearly;

  // Calculate cumulative costs year by year
  const rawData: Array<{ year: number; capex: number; opex: number; total: number }> = [];
  for (let year = 1; year <= 5; year++) {
    const cumulativeOpex = annualOpex * year;
    const totalCost = initialCapex + cumulativeOpex;
    rawData.push({
      year,
      capex: initialCapex,
      opex: cumulativeOpex,
      total: totalCost,
    });
  }

  // Find max total cost to scale SVG values
  const maxTotal = rawData[lifespanYears - 1].total;

  // Render SVG points for area charts
  const width = 500;
  const height = 220;
  const paddingLeft = 65;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Map data to SVG coordinates
  const getX = (index: number) => {
    return paddingLeft + (index / (lifespanYears - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return paddingTop + chartHeight - (value / maxTotal) * chartHeight;
  };

  // Build SVG path strings
  let totalAreaPath = "";
  let capexAreaPath = "";
  let totalLinePath = "";
  let capexLinePath = "";

  if (lifespanYears > 1) {
    // CAPEX points (which is a flat constant value initialCapex)
    const pointsCapex = rawData.slice(0, lifespanYears).map((d, i) => ({ x: getX(i), y: getY(d.capex) }));
    // Capex area sits at the bottom
    capexAreaPath = `M ${getX(0)} ${getY(0)} ` + 
      pointsCapex.map(p => `L ${p.x} ${p.y}`).join(" ") + 
      ` L ${getX(lifespanYears - 1)} ${getY(0)} Z`;
    
    capexLinePath = `M ` + pointsCapex.map(p => `${p.x} ${p.y}`).join(" L ");

    // TOTAL points (CAPEX + cumulative OPEX)
    const pointsTotal = rawData.slice(0, lifespanYears).map((d, i) => ({ x: getX(i), y: getY(d.total) }));
    
    totalAreaPath = `M ${getX(0)} ${getY(0)} ` + 
      pointsTotal.map(p => `L ${p.x} ${p.y}`).join(" ") + 
      ` L ${getX(lifespanYears - 1)} ${getY(0)} Z`;

    totalLinePath = `M ` + pointsTotal.map(p => `${p.x} ${p.y}`).join(" L ");
  }

  // Format currency helpers
  const fmt = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(2)}M`;
    }
    return `$${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      {/* Simulation Controls Column */}
      <div className="xl:col-span-2 flex flex-col gap-5 bg-[#0A0A0F]/80 border border-white/10 p-5 rounded-lg">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <h4 className="font-display text-xs font-semibold text-gray-200 tracking-wider uppercase">
            OPERATING SIMULATION PARAMS
          </h4>
        </div>

        {/* Sliders bundle */}
        <div className="flex flex-col gap-4 text-xs font-mono">
          {/* Energy cost input slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-gray-400">
              <span className="flex items-center gap-1">
                Electricity rate
                <span className="group relative cursor-help text-gray-600">
                  <Info className="h-3 w-3" />
                  <span className="absolute bottom-5 left-0 scale-0 group-hover:scale-100 transition-all duration-200 bg-slate-900 border border-slate-800 text-[10px] w-48 p-2 rounded-md leading-relaxed text-gray-300 z-50">
                    Calculated in USD per Kilowatt-Hour. Highly correlated to physical datacenter local utility tariffs.
                  </span>
                </span>
              </span>
              <span className="text-cyan-400 font-bold">${electricityRateKwh.toFixed(2)} / kWh</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.40"
              step="0.01"
              value={electricityRateKwh}
              onChange={(e) => setElectricityRateKwh(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>$0.05 (Industrial)</span>
              <span>$0.40 (Retail peak)</span>
            </div>
          </div>

          {/* Maintenance budget rate slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-gray-400">
              <span>Mantenimiento y repuestos anuales</span>
              <span className="text-blue-400 font-bold">{maintenanceRate}% de inversión inicial</span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={maintenanceRate}
              onChange={(e) => setMaintenanceRate(parseInt(e.target.value))}
              className="w-full accent-blue-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-600">
              <span>3% (Micro-server)</span>
              <span>15% (Enterprise grade)</span>
            </div>
          </div>

          {/* Target operational workspace years */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-gray-400">
              <span>Financial forecast horizon</span>
              <span className="text-gray-200 font-bold">{lifespanYears} Years</span>
            </div>
            <input
              type="range"
              min="2"
              max="5"
              step="1"
              value={lifespanYears}
              onChange={(e) => setLifespanYears(parseInt(e.target.value))}
              className="w-full accent-emerald-400 h-1 bg-slate-900 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Dynamic calculation result outputs */}
        <div className="border-t border-slate-900 pt-4 mt-auto">
          <div className="font-mono text-[10px] text-slate-500 mb-2 uppercase">RECALCULATED COST TIER:</div>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="bg-slate-900/40 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-gray-500 block">INVERSIÓN INICIAL</span>
              <span className="text-sm font-bold font-display text-gray-200">{fmt(initialCapex)}</span>
            </div>
            <div className="bg-slate-900/40 p-2.5 rounded border border-slate-800">
              <span className="text-[10px] text-gray-500 block">GASTO OPERATIVO ACUMULADO (AÑO)</span>
              <span className="text-sm font-bold font-display text-cyan-400">{fmt(annualOpex)}</span>
            </div>
          </div>
          <div className="bg-cyan-950/20 rounded border border-cyan-500/10 p-3 mt-3 text-[11px] font-mono leading-relaxed text-gray-400">
            <div className="flex items-center gap-1 text-cyan-300 font-semibold mb-1">
              <TrendingUp className="h-3 w-3" />
              <span>Projected Total Expenditure ({lifespanYears} Yr)</span>
            </div>
            Total estimated cost: <strong className="text-gray-100">{fmt(initialCapex + (annualOpex * lifespanYears))}</strong> over {lifespanYears} years, combining upfront hardware build with rolling operational power/maintenance.
          </div>
        </div>
      </div>

      {/* SVG Vector Chart Column */}
      <div className="xl:col-span-3 flex flex-col justify-between bg-[#0A0A0F]/80 border border-white/10 p-5 rounded-lg relative overflow-hidden">
        <div>
          <h4 className="font-display text-xs font-semibold text-gray-200 tracking-wider uppercase mb-1">
            CUMULATIVE EXPENSE PROJECTION
          </h4>
          <p className="font-mono text-[10px] text-gray-500">
            Comparativa de Inversión Inicial (Azul) vs. Crecimiento Operativo Acumulado (Cian)
          </p>
        </div>

        {/* Vector SVG Representation */}
        <div className="w-full my-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            {/* Grid Lines */}
            {Array.from({ length: 4 }).map((_, i) => {
              const value = (maxTotal / 3) * i;
              const y = getY(value);
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 4}
                    fill="rgba(156, 163, 175, 0.7)"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {fmt(value)}
                  </text>
                </g>
              );
            })}

            {/* Vertical grid lines representing Years */}
            {Array.from({ length: lifespanYears }).map((_, i) => {
              const x = getX(i);
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={paddingTop}
                    x2={x}
                    y2={height - paddingBottom}
                    stroke="rgba(255, 255, 255, 0.04)"
                  />
                  <text
                    x={x}
                    y={height - paddingBottom + 16}
                    fill="rgba(156, 163, 175, 0.7)"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    Year {i + 1}
                  </text>
                </g>
              );
            })}

            {/* Total expense fill (OPEX + CAPEX cumulative) */}
            <path
              d={totalAreaPath}
              className="transition-all duration-500 ease-out"
              fill="url(#total-grad)"
              opacity="0.35"
            />
            {/* CAPEX Flat Area fill */}
            <path
              d={capexAreaPath}
              className="transition-all duration-500 ease-out"
              fill="url(#capex-grad)"
              opacity="0.25"
            />

            {/* Flat static CAPEX Line representing upfront seed */}
            <path
              d={capexLinePath}
              className="transition-all duration-500 ease-out"
              stroke="#1d4ed8" /* Solid Blue */
              strokeWidth="2"
              fill="none"
              strokeDasharray="3 3"
            />

            {/* Total Expense Line */}
            <path
              d={totalLinePath}
              className="transition-all duration-500 ease-out animate-draw-path"
              stroke="#06b6d4" /* Cyan line */
              strokeWidth="2.5"
              fill="none"
            />

            {/* Intersecting dots at selected end horizon node */}
            <circle
              cx={getX(lifespanYears - 1)}
              cy={getY(rawData[lifespanYears - 1].total)}
              r="4"
              fill="#06b6d4"
              stroke="#082f49"
              strokeWidth="2"
              className="transition-all duration-500 ease-out"
            />
            <circle
              cx={getX(lifespanYears - 1)}
              cy={getY(initialCapex)}
              r="4"
              fill="#1d4ed8"
              stroke="#082f49"
              strokeWidth="2"
              className="transition-all duration-500 ease-out"
            />

            {/* Interactive Area definitions */}
            <defs>
              <linearGradient id="total-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0"/>
              </linearGradient>
              <linearGradient id="capex-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500 border-t border-slate-900 pt-2 lg:pt-0">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-700 inline-block" /> Inversión de Hardware
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-cyan-500 inline-block" /> Gasto de Operación Acumulado
          </span>
        </div>
      </div>
    </div>
  );
}
