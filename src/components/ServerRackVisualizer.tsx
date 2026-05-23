/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Cpu, Wifi, Server, Activity } from "lucide-react";

interface ServerRackVisualizerProps {
  serversCount: number;
  gpusCount: number;
  gpuModel: string;
}

export default function ServerRackVisualizer({
  serversCount,
  gpusCount,
  gpuModel,
}: ServerRackVisualizerProps) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Safeguard number of nodes to show (max 12 visually to prevent overflow, but label correct count)
  const totalSlots = Math.max(serversCount, 1);
  const visibleNodes = Array.from({ length: Math.min(totalSlots, 10) }, (_, i) => i);
  const hiddenNodesCount = totalSlots > 10 ? totalSlots - 10 : 0;

  // Distribute estimated GPUs evenly among visible servers
  const gpusPerNode = Math.max(Math.floor(gpusCount / totalSlots), 1);

  return (
    <div id="hardware_rack_wrapper" className="flex flex-col gap-4">
      {/* Rack HUD Header */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Server id="icon_rack_main" className="h-5 w-5 text-cyan-400" />
          <div>
            <h4 className="font-display text-sm font-semibold text-gray-200 uppercase tracking-wider">
              PRIME H-CLUSTER SCHEMATIC
            </h4>
            <p className="font-mono text-[10px] text-gray-500">
              Active Server Chassis: {totalSlots} Chassis | {gpusCount}x {gpuModel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-emerald-400 font-semibold tracking-wide text-[10px]">COHERENT BUS SYNC: 100%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Physical Rack Column */}
        <div className="lg:col-span-2 bg-[#0A0A0F]/80 border border-white/10 rounded-lg p-4 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-500/20" />
          
          {/* Hardware chassis stacked vertically */}
          <div className="flex flex-col gap-2 z-10">
            {visibleNodes.map((idx) => {
              const hasGpu = idx < gpusCount;
              const isHovered = hoveredNode === idx;

              return (
                <div
                  key={idx}
                  id={`server_blade_${idx}`}
                  onMouseEnter={() => setHoveredNode(idx)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`relative p-3 rounded border font-mono transition-all duration-300 cursor-crosshair flex items-center justify-between ${
                    isHovered
                      ? "bg-cyan-950/30 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                      : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90"
                  }`}
                >
                  {/* Left structural details */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">U0{10 - idx}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-300">BLADE-NODE-X{idx + 101}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] text-gray-400">STATE: NOMINAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Micro blinking led panel design */}
                  <div className="flex items-center gap-4">
                    {/* Active GPU Indicators */}
                    {hasGpu && (
                      <div className="flex items-center gap-1 bg-cyan-900/50 border border-cyan-500/30 px-1.5 py-0.5 rounded text-[8px] text-cyan-300 animate-pulse">
                        <Cpu className="h-2.5 w-2.5" />
                        <span>SXM5 x{gpusPerNode}</span>
                      </div>
                    )}

                    {/* Blinking telemetry bulbs */}
                    <div className="flex gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" style={{ animationDelay: "0.2s" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 style={{ animationDelay: '0.4s' }}" />
                    </div>

                    {/* Small spinning circular fans */}
                    <div className="flex gap-1">
                      <div className="h-4 w-4 rounded-full border border-slate-700 border-t-cyan-500 animate-spin flex items-center justify-center text-[7px] text-slate-500">
                        ❄
                      </div>
                      <div className="h-4 w-4 rounded-full border border-slate-700 border-t-cyan-500 animate-spin flex items-center justify-center text-[7px] text-slate-500" style={{ animationDelay: "0.15s" }}>
                        ❄
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {hiddenNodesCount > 0 && (
              <div className="text-center p-2 rounded border border-dashed border-slate-800 bg-slate-900/20 text-xs font-mono text-gray-500">
                + {hiddenNodesCount} more infrastructure blades stacked below in cluster rack...
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-2">
            <span>CHASSIS GROUND: OK</span>
            <span>BUS PROTOCOL: PCIe GEN 5 x16 MESH</span>
            <span>TEMP: 21°C ambient</span>
          </div>
        </div>

        {/* Dynamic Node HUD Panel */}
        <div className="bg-[#0A0A0F]/80 border border-white/10 rounded-lg p-5 flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-10">
            <Activity className="w-full h-full text-cyan-400" />
          </div>

          <div>
            <h5 className="font-display text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-3">
              LIVE TELEMETRY READOUT
            </h5>

            {hoveredNode !== null ? (
              <div className="font-mono flex flex-col gap-4 text-xs animate-fadeIn">
                <div className="border-b border-slate-800/60 pb-2">
                  <div className="text-gray-400 text-[10px]">SELECTED UNIT</div>
                  <div className="text-gray-200 font-bold font-display text-sm">BLADE-NODE-X{hoveredNode + 101}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-gray-500 block">CORE LOAD</span>
                    <span className="text-emerald-400 font-semibold">41.2% idle avg</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">THERMALS</span>
                    <span className="text-amber-400 font-semibold">63°C load / 28°C</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">BUS FREQUENCY</span>
                    <span className="text-cyan-300">4.12 GHz</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">PCI-E LINK</span>
                    <span className="text-cyan-300">128 GB/s bi-dir</span>
                  </div>
                </div>

                <div className="bg-cyan-950/20 border border-cyan-400/20 p-2.5 rounded text-[11px]">
                  <div className="flex items-center gap-1 text-cyan-300 font-semibold mb-1">
                    <Wifi className="h-3 w-3" />
                    <span>Nvidia NVLink Inter-Connect</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed text-[10px]">
                    Direct GPU-to-GPU mesh communication protocol active. Memory space fully pooled across all physical cards.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10 text-center font-mono">
                <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 animate-pulse">
                  <Activity className="h-4 w-4 text-gray-500" />
                </div>
                <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                  Hover over any active mainframe physical server blade unit to scan real-time core telemetry and sub-system indicators.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-900 pt-3 mt-4 text-[10px] font-mono text-slate-500">
            <span>POWER EFFICIENCY MODEL: 1.15 PUE RATIO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
