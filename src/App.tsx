/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Cpu, 
  Database, 
  Zap, 
  Thermometer, 
  Coins, 
  Leaf, 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  Sliders, 
  CheckCircle,
  Sparkles, 
  Search, 
  ArrowRight, 
  Layers, 
  Building,
  Info,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  LineChart
} from "lucide-react";
import NetworkBackground from "./components/NetworkBackground";
import { InfrastructureReport } from "./types";

// Rotating placeholder sentences for conversational input
const PLACEHOLDERS = [
  "Somos un estudio de producción de video que utiliza generación de imágenes y video por IA...",
  "Quiero un asistente de IA privado para mi despacho de abogados en Madrid o Barcelona...",
  "Somos una universidad con 3000 estudiantes que ejecuta cálculos de alto rendimiento...",
  "Somos un hospital que utiliza modelos de IA locales para escaneos médicos clínicos...",
  "Somos un distribuidor minorista regional que predice el inventario con aprendizaje automático aislado..."
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentPlaceholderIdx, setCurrentPlaceholderIdx] = useState(0);
  const [report, setReport] = useState<InfrastructureReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNodeInfo, setShowNodeInfo] = useState(false);
  
  // Terminal logs streaming during cinematic loading
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const logsStreamRef = useRef<HTMLDivElement | null>(null);

  // Energy adjustment factor sliders
  const [redundancyLevel, setRedundancyLevel] = useState<number>(1.2); // Overhead multiplier, default is 1.2
  const [lowPowerMode, setLowPowerMode] = useState<boolean>(false); // eco-mode saver checkbox

  // Interval for rotating conversational prompt placeholders
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPlaceholderIdx((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Sync scroll for the cinematic analysis terminal log box
  useEffect(() => {
    if (logsStreamRef.current) {
      logsStreamRef.current.scrollTop = logsStreamRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Loading logs sequence simulated in steps
  const simulationLogsList = [
    "[SISTEMA_CENTRAL] Inicializando modelos físicos de red de transferencia de calor...",
    "[RESOLVIENDO] Analizando escala organizativa y ratios de concurrencia de cargas críticas...",
    "[HARDWARE] Mapeando cargas de GPU (cargas estimadas de núcleos tensor de coma flotante)...",
    "[OPERACIÓN] Emparejando restricciones de espacio físico y modelos de carga del suelo...",
    "[MEDIO_AMBIENTE] Calculando tasas de dispersión de calor BTU frente a sistemas HVAC estándar...",
    "[FINANZAS] Recuperando índices de costes de hardware globales del mercado para H100s, A100s y L40S...",
    "[SERVICIOS] Estandarizando sobrecostes eléctricos comerciales de redes de alta densidad...",
    "[AUTONOMÍA] Modelando redundancias de seguridad aisladas y métricas de cumplimiento regulatorio...",
    "[SÍNTESIS] Estructurando matrices de costes analíticos y mapas estratégicos de optimización..."
  ];

  // Submit and trigger master plan calculation
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    const actualPrompt = prompt.trim() || PLACEHOLDERS[currentPlaceholderIdx];
    
    // Clear states and launch cinematic sequence
    setError(null);
    setReport(null);
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setTerminalLogs(["[SYSTEM_CORE] Decentralized physical model simulation spawned."]);

    // Fast-step interval ticker simulating server computational steps
    let currentPct = 0;
    const tickerInterval = setInterval(() => {
      currentPct += Math.floor(Math.random() * 8) + 4;
      if (currentPct >= 100) {
        currentPct = 100;
        clearInterval(tickerInterval);
      }
      setAnalysisProgress(currentPct);

      // Add corresponding technical logs based on percentage progress
      const logIdx = Math.floor((currentPct / 100) * (simulationLogsList.length - 1));
      setTerminalLogs((prev) => {
        const nextLog = simulationLogsList[logIdx];
        if (nextLog && !prev.includes(nextLog)) {
          return [...prev, nextLog];
        }
        return prev;
      });
    }, 180);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: actualPrompt }),
      });

      if (!response.ok) {
        throw new Error("Los nodos de análisis locales experimentaron un error de tiempo de espera de socket.");
      }

      const reportData: InfrastructureReport = await response.json();
      
      // Delay resolution slightly until loading percentage finishes 100%
      setTimeout(() => {
        setReport(reportData);
        setIsAnalyzing(false);
      }, 2500);

    } catch (err: any) {
      console.warn("Express endpoint failed, triggering client fallback logic:", err);
      // Wait for ticker, then fail over cleanly
      setTimeout(() => {
        setError("Conexión telemétrica interrumpida. Proceda de nuevo utilizando parámetros de nodo simulados.");
        setIsAnalyzing(false);
      }, 2500);
    }
  };

  // Quick prompt presets for faster user discovery
  const handleUsePreset = (txt: string) => {
    setPrompt(txt);
  };

  // Reset core simulation helper
  const handleReset = () => {
    setPrompt("");
    setReport(null);
    setError(null);
    setAnalysisProgress(0);
  };

  // Energy consumption recalclated dynamically based on lowPowerMode checkbox & overhead slider
  const getRecalculatedPower = () => {
    if (!report) return { daily: 0, monthly: 0, yearly: 0, tonsCo2: 0 };
    const baseDaily = report.dailyKwh;
    const modifier = (redundancyLevel / 1.2) * (lowPowerMode ? 0.85 : 1.0);
    const daily = Math.round(baseDaily * modifier);
    const monthly = Math.round(daily * 30);
    const yearly = Math.round(daily * 365);
    const tonsCo2 = Math.round((yearly * 0.00038) * 10) / 10;
    return { daily, monthly, yearly, tonsCo2 };
  };

  const dynamicPower = getRecalculatedPower();

  return (
    <div className="relative min-h-screen bg-[#020204] text-white selection:bg-cyan-500/30 selection:text-cyan-300 md:border-4 md:border-[#1A1A1F] flex flex-col justify-between">
      {/* Premium Constellation Grid */}
      <NetworkBackground />

      {/* Modern dot network background overlay layer */}
      <div className="absolute inset-0 opacity-20 pointer-events-none dot-pattern z-0" />

      {/* Decorative Outer Ambient Glows from Bold Typography theme */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Large decorative watermark background element */}
      <div className="absolute bottom-12 right-12 text-white/5 text-[5rem] sm:text-[7rem] md:text-[9rem] font-black tracking-tighter leading-none pointer-events-none select-none z-0">
        SIMULATOR
      </div>

      {/* Main Structural Containment Wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col min-h-screen justify-between w-full">
        {/* Top Header Navigation Panel */}
        <header id="site_header" className="flex items-center justify-between border-b border-white/5 pb-5 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              <Cpu className="h-4.5 w-4.5 text-cyan-400 rotate-45" />
            </div>
            <div>
              <span className="font-display font-extrabold text-sm tracking-[0.2em] text-white uppercase block">
                IA DESCENTRALIZADA
              </span>
              <p className="font-mono text-[9px] text-cyan-400/80 tracking-widest uppercase">Simulador de Infraestructura</p>
            </div>
          </div>
        </header>

        {/* Dynamic Screen Lifecycle Router */}
        <main className="flex-grow flex flex-col justify-center my-auto">
          
          {/* Landing State Screen: Conversation Input */}
          {!isAnalyzing && !report && !error && (
            <div id="landing_frame" className="max-w-4xl mx-auto w-full flex flex-col items-center py-8 lg:py-16 relative">
              {/* Core Hero Headlines */}
              <div className="text-center mb-10 w-full animate-fadeIn z-10">
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-cyan-400 mb-2 mt-4 block">
                  Simulador de Infraestructura
                </span>
                <h1 className="font-display text-5xl sm:text-7xl font-extrabold tracking-tighter leading-[0.95] mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                  ¿Cuánto costaría su propia <br /> infraestructura de IA?
                </h1>
                <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                  Describa su organización y descubra la huella física, económica y medioambiental real de la inteligencia descentralizada en local.
                </p>
              </div>

              {/* Central Conversational Interface */}
              <div className="w-full max-w-3xl relative group mb-8">
                {/* Glow layer behind card container */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 group-focus-within:opacity-45 transition-opacity duration-500 pointer-events-none"></div>
                
                <form onSubmit={handleAnalyze} className="relative bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  {/* Outer textbox layout with custom iconography inside textarea card design */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center shrink-0">
                      <Cpu className="h-5 w-5 text-cyan-400" />
                    </div>
                    
                    <textarea
                      id="conversational_prompt_input"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={PLACEHOLDERS[currentPlaceholderIdx]}
                      className="bg-transparent border-none focus:ring-0 text-white placeholder-white/20 w-full resize-none h-24 text-lg outline-none p-1 font-sans"
                    />
                  </div>

                  {/* Footer links within card */}
                  <div className="flex flex-col sm:flex-row justify-end items-center mt-4 pt-4 border-t border-white/5 gap-4">
                    <button
                      type="submit"
                      id="analysis_trigger_btn"
                      className="px-8 py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-cyan-400 hover:text-black transition-colors shadow-lg shadow-white/5 inline-flex items-center gap-2 cursor-pointer duration-200 shrink-0"
                    >
                      <span>Analizar Infraestructura</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Visual interactive preset recommendation panels list */}
              <div className="w-full text-center mt-8 z-10">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em] block mb-4">
                  PREAJUSTES DEMOSTRATIVOS RÁPIDOS
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  <div 
                    onClick={() => handleUsePreset("Somos abogados de investigación en Barcelona que queremos aislar localmente análisis de contratos confidenciales de clientes.")}
                    className="p-4 rounded-xl bg-[#0A0A0F]/60 border border-white/5 hover:border-white/15 hover:bg-[#0A0A0F]/95 cursor-pointer text-left transition-all duration-300 group font-sans"
                  >
                    <Building className="h-4 w-4 text-amber-500/80 mb-2 group-hover:scale-105 transition-transform" />
                    <h4 className="text-gray-200 font-bold text-xs mb-1 uppercase tracking-wider">Bufete de Asesoría Jurídica</h4>
                    <p className="sky-text text-[11px] text-white/40 leading-normal line-clamp-2">
                      Enfoque en privacidad absoluta, estricto aislamiento de clientes y resúmenes de texto estructurados.
                    </p>
                  </div>

                  <div 
                    onClick={() => handleUsePreset("Somos una escuela de ingeniería configurando una partición local clústerizada para cientos de tareas de diseño en paralelo para los estudiantes.")}
                    className="p-4 rounded-xl bg-[#0A0A0F]/60 border border-white/5 hover:border-white/15 hover:bg-[#0A0A0F]/95 cursor-pointer text-left transition-all duration-300 group font-sans"
                  >
                    <Layers className="h-4 w-4 text-indigo-500/80 mb-2 group-hover:scale-105 transition-transform" />
                    <h4 className="text-gray-300 font-bold text-xs mb-1 uppercase tracking-wider">Bloque de Investigación y Academia</h4>
                    <p className="sky-text text-[11px] text-white/40 leading-normal line-clamp-2">
                      Protocolos de compartición de GPU multi-instancia para gestionar tareas concurrentes con facilidad.
                    </p>
                  </div>

                  <div 
                    onClick={() => handleUsePreset("Nodo de estación de trabajo comercial de escritorio para ejecutar microasistentes cuantizados en configuración de consumo.")}
                    className="p-4 rounded-xl bg-[#0A0A0F]/60 border border-white/5 hover:border-white/15 hover:bg-[#0A0A0F]/95 cursor-pointer text-left transition-all duration-300 sm:col-span-2 lg:col-span-1 group font-sans"
                  >
                    <Cpu className="h-4 w-4 text-emerald-500/80 mb-2 group-hover:scale-105 transition-transform" />
                    <h4 className="text-gray-300 font-bold text-xs mb-1 uppercase tracking-wider">Desarrollador Micro Local</h4>
                    <p className="sky-text text-[11px] text-white/40 leading-normal line-clamp-2">
                      Bajo nivel de ruido, sin adaptaciones estructurales de edificios y baja huella energética de escritorio.
                    </p>
                  </div>
                </div>


              </div>
            </div>
          )}

          {/* Cinematic Analysis Scan State Screen */}
          {isAnalyzing && (
            <div id="loading_analysis_screen" className="max-w-2xl mx-auto w-full bg-[#050814]/70 border border-cyan-500/10 rounded-2xl p-6 sm:p-8 shadow-2xl glassmorphism font-mono flex flex-col gap-6 relative">
              {/* Scanning visual overlay */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/40 shadow-cyan animate-pulse" />
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4.5 w-4.5 text-cyan-400 animate-spin" />
                  <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">
                    RESOLVIENDO OBJETIVOS DE MATRIZ DE CÓMPUTO
                  </span>
                </div>
                <span className="text-gray-500 text-xs">{analysisProgress}%</span>
              </div>

              {/* Simulated physical data paths loading card details */}
              <div className="bg-slate-950/90 border border-slate-900 rounded p-4 flex flex-col gap-3 min-h-[170px] relative">
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                </div>
                
                {/* Scrollable streams log block */}
                <div ref={logsStreamRef} className="flex flex-col gap-1.5 text-[11px] text-cyan-500/90 overflow-y-auto max-h-[150px] leading-relaxed">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-slate-600 select-none">&gt;&gt;</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress bar visualizer */}
              <div className="flex flex-col gap-1.5">
                <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-150 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 text-right uppercase">
                  AUDITORÍA ACTIVA DE COHERENCIA EN PIPELINE
                </span>
              </div>
            </div>
          )}

          {/* Results State Screen: Simplified Infrastructure Dashboard */}
          {report && !isAnalyzing && (
            <div id="analytics_dashboard" className="w-full flex flex-col gap-6 animate-fadeIn max-w-4xl mx-auto">
              
              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5" />
                    <span>DIAGNÓSTICO SINTÉTICO COMPLETADO</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-gray-100 mt-1">
                    {report.organizationType}
                  </h2>
                  <p className="text-slate-400 text-xs font-sans mt-2 max-w-xl">
                    <span className="text-cyan-400 font-mono font-bold uppercase text-[10px] tracking-wider block mb-0.5">Función de la infraestructura</span>
                    Se usará para: <strong className="text-gray-200 font-medium">{report.workloadIntensity}</strong>.
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded hover:bg-cyan-400 hover:text-black transition-colors duration-200 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-white/5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Ejecutar otra simulación</span>
                  </button>
                </div>
              </div>

              {/* GRID: CORE REQUISITIONS requested by USER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. NIVEL ARQUITECTÓNICO && INFRAESTRUCTURA */}
                <div className="bg-[#0A0A0F]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 tracking-wider uppercase mb-4">
                      <Layers className="h-4 w-4" />
                      <span>Nivel Arquitectónico</span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-white/40 text-[10px] font-mono uppercase block">Nivel de la Arquitectura</span>
                      <span className="text-xl font-bold text-white block mt-1 leading-snug">{report.complexityLevel}</span>
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-3 text-xs font-mono text-white/60">
                      <div className="flex justify-between items-center bg-white/0 hover:bg-white/[0.02] p-1 rounded-md transition-colors">
                        <span className="flex items-center gap-1.5">
                          Unidades de Nodo:
                          <button 
                            type="button" 
                            onClick={() => setShowNodeInfo(!showNodeInfo)}
                            className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 hover:bg-cyan-900 hover:text-cyan-300 transition-colors cursor-pointer"
                            title="Haz clic para ver la explicación"
                          >
                            <Info className="h-2.5 w-2.5" />
                          </button>
                        </span>
                        <span className="text-white font-bold">{report.serversRequired} Nodos</span>
                      </div>

                      {showNodeInfo && (
                        <div className="bg-[#0f1422] border border-cyan-500/30 rounded-xl p-3.5 text-[11px] leading-relaxed text-slate-300 space-y-2.5 mt-1 relative shadow-lg shadow-black/40 animate-fadeIn">
                          <p>
                            Las <strong className="text-cyan-400">Unidades de Nodo</strong> son los servidores físicos individuales instalados en los armarios rack de tu centro de datos portátil o de sala.
                          </p>
                          <p>
                            Cada nodo es un computador independiente completo que cuenta con sus propios procesadores, memoria del sistema y fuentes eléctricas, y actúa como el "chasis" o soporte de hardware para albergar y comunicar tus aceleradores de IA (las GPUs).
                          </p>
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => setShowNodeInfo(false)}
                              className="text-cyan-400 hover:text-white font-mono uppercase text-[9px] hover:underline"
                            >
                              [ Cerrar Explicación ]
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Complejidad de Carga:</span>
                        <span className="text-cyan-400 font-bold">{report.difficultyIndicator}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. ADQUISICIÓN Y GASTO DE HARDWARE */}
                <div className="bg-[#0A0A0F]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-500 tracking-wider uppercase mb-4">
                      <Coins className="h-4 w-4" />
                      <span>Gasto de Hardware</span>
                    </div>

                    <div className="mb-4">
                      <span className="text-white/40 text-[10px] font-mono uppercase block">Inversión Inicial en Hardware</span>
                      <span className="text-3xl font-extrabold font-display text-white mt-1 block">
                        {report.hardwareInvestment.toLocaleString()} €
                      </span>
                      <span className="text-[10px] text-white/30 block mt-1">Costo estimado de adquisición de servidores y GPUs</span>
                    </div>

                    <div className="text-[11px] font-sans text-gray-400 border-t border-white/5 pt-3 leading-relaxed">
                      Esta partida corresponde a la adquisición del silicio de procesamiento (núcleos aceleradores) y los sistemas de gabinetes rackeables necesarios para operar localmente de forma privada.
                    </div>
                  </div>
                </div>

                {/* 3. APROXIMACIÓN DEL PRESUPUESTO COMPLETO (Capex + Opex 1er Año) */}
                <div className="bg-[#0A0A0F]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-300 md:col-span-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 tracking-wider uppercase mb-4">
                      <Coins className="h-4 w-4" />
                      <span>Aproximación del Presupuesto</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="text-white/40 text-[10px] block font-mono">Inversión Inicial Hardware</span>
                        <span className="text-white text-lg font-bold mt-1 block">{report.hardwareInvestment.toLocaleString()} €</span>
                        <span className="text-[9px] text-white/30">Costo inicial de adquisición</span>
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <span className="text-white/40 text-[10px] block font-mono font-bold text-cyan-400">Gasto Operativo Anual</span>
                        <span className="text-cyan-400 text-lg font-bold mt-1 block">
                          {((report.monthlyElectricityCost * 12) + report.annualMaintenance).toLocaleString()} €
                        </span>
                        <span className="text-[9px] text-white/30">Luz, refrigeración y mantenimiento</span>
                      </div>

                      <div className="bg-cyan-500/15 p-4 rounded-xl border border-cyan-500/20">
                        <span className="text-cyan-300 text-[10px] block font-mono font-bold">PRESUPUESTO APROXIMADO (AÑO 1)</span>
                        <span className="text-white text-xl font-extrabold mt-1 block">
                          {(report.hardwareInvestment + (report.monthlyElectricityCost * 12) + report.annualMaintenance).toLocaleString()} €
                        </span>
                        <span className="text-[9px] text-cyan-300/60">Totales combinados de puesta en marcha</span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs font-sans text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                      <strong>Nota de estimación financiera:</strong> El gasto operativo anual se desglosa en consumo eléctrico aproximado de <strong>{(report.monthlyElectricityCost * 12).toLocaleString()} €</strong> al año (basado en una tarifa de 0.15 €/kWh) y unos <strong>{report.annualMaintenance.toLocaleString()} €</strong> anuales sugeridos para el mantenimiento preventivo del hardware e infraestructura en frío.
                    </div>
                  </div>
                </div>

                {/* 4. MEDIDOR DE CONSUMO ENERGÉTICO */}
                <div className="bg-[#0A0A0F]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-300 md:col-span-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 tracking-wider uppercase mb-4">
                      <Zap className="h-4 w-4" />
                      <span>Consumo Energético Diario, Mensual y Anual</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono mb-4 text-center">
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-white/40 text-[10px] block uppercase">Consumo Diario</span>
                        <span className="text-white text-2xl font-bold mt-1.5 block">{dynamicPower.daily.toLocaleString()} kWh</span>
                        <span className="text-[9px] text-white/30 block mt-1">Demanda típica de 24 horas</span>
                      </div>

                      <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-white/40 text-[10px] block uppercase">Consumo Mensual</span>
                        <span className="text-cyan-400 text-2xl font-bold mt-1.5 block">{dynamicPower.monthly.toLocaleString()} kWh</span>
                        <span className="text-[9px] text-white/30 block mt-1">Acumulado regular de 30 días</span>
                      </div>

                      <div className="p-4 rounded-xl bg-[#131b2d] border border-cyan-500/20">
                        <span className="text-cyan-300 text-[10px] block uppercase font-bold">Consumo Anual</span>
                        <span className="text-white text-2xl font-extrabold mt-1.5 block">{dynamicPower.yearly.toLocaleString()} kWh</span>
                        <span className="text-[9px] text-cyan-300/60 block mt-1">Cercano al consumo de un clúster</span>
                      </div>
                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded p-3 text-[11px] leading-relaxed text-gray-300">
                      <strong>Equivalencia de Referencia:</strong> {report.equivalenceText}
                    </div>
                  </div>
                </div>

                {/* 5. HUELLA DE CARBONO */}
                <div className="bg-[#0A0A0F]/80 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-300 md:col-span-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 tracking-wider uppercase mb-4">
                      <Leaf className="h-4 w-4" />
                      <span>Huella de Carbono</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                      <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 flex flex-col items-center justify-center text-center shrink-0 w-full sm:w-48">
                        <span className="text-emerald-400 text-3xl font-extrabold tracking-tight">{dynamicPower.tonsCo2} Tons</span>
                        <span className="text-[10px] font-mono text-emerald-400/80 mt-1 uppercase">CO₂ emitido por año</span>
                      </div>

                      <div className="text-xs text-gray-400 leading-relaxed font-sans">
                        <span className="text-white font-semibold font-display text-sm block mb-1">Impacto Ambiental de Despliegue Local</span>
                        Nuestra simulación calcula una huella de carbono estimada de <strong>{dynamicPower.tonsCo2} toneladas de CO₂</strong> al año para las necesidades descritas de su organización.
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Fallback Telemetry Interrupted Error state visual (User comfort) */}
          {error && !isAnalyzing && (
            <div id="error_boundary_frame" className="max-w-md mx-auto w-full bg-rose-950/20 border border-rose-500/20 p-6 rounded-2xl glassmorphism font-mono flex flex-col items-center gap-4 text-center">
              <div className="h-10 w-10 rounded-full bg-rose-500/10 border border-rose-400/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-medium text-sm text-gray-100 uppercase tracking-wider">
                  TIEMPO DE ESPERA DE TELEMETRÍA EXCEDIDO
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">
                  El bucle de análisis en la nube ha experimentado una interrupción temporal. ¿Desea activar el simulador heurístico integrado en modo offline?
                </p>
              </div>

              <div className="flex gap-3 w-full mt-2 text-xs">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-gray-300 font-bold py-2 rounded-lg transition-all cursor-pointer"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    // Force render offline heuristic fallback
                    setError(null);
                    setReport(null);
                    setIsAnalyzing(true);
                    setAnalysisProgress(0);
                    setTerminalLogs(["[SYSTEM_CORE] Iniciando analizador local heurístico de emergencia integrado en cliente..."]);
                    
                    let p = 0;
                    const fallbackInterval = setInterval(() => {
                      p += 15;
                      if (p >= 100) {
                        p = 100;
                        clearInterval(fallbackInterval);
                        
                        // Fake a report based on previous inputs
                        const randomPrompts = [
                          "We are an video production studio using AI models...",
                          "Private law assistant air-gapped office network..."
                        ];
                        // Call local routine directly
                        const testValue = responseHeuristicGenerator(prompt || "Personal decentralized node setup...");
                        setReport(testValue);
                        setIsAnalyzing(false);
                      }
                      setAnalysisProgress(p);
                    }, 100);
                  }}
                  className="w-full bg-cyan-500 text-slate-900 font-bold py-2 rounded-lg hover:bg-cyan-400 transition-all cursor-pointer"
                >
                  Forzar Fallback
                </button>
              </div>
            </div>
          )}

        </main>

        {/* Global Footer Layout */}
        <footer id="site_global_footer" className="border-t border-slate-900/60 pt-5 mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[10px] text-slate-500">
          <div>
            <span>© 2026 Decentralized AI Simulator.</span>
          </div>
          <div>
            <span>Hecho por Adrián Honrubia</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Client-side quick generator function to support direct offline force-fallback button
function responseHeuristicGenerator(prompt: string): InfrastructureReport {
  const norm = prompt.toLowerCase();
  let scale = "Mediana Empresa";
  let orgType = "Nodo de Trabajo Local";
  let intensity = "Procesamiento local de flujos de automatización e inferencia general de lenguaje";
  let complexity = "Configuración de Rack Tipo 2";
  let servers = 2;
  let gpus = 8;
  let gpuModel = "Nvidia L40S (48GB)";
  let storage = 45;
  let space = 150;
  let dailyKw = 120;
  let hwCost = 140000;
  let replacementYears = 4;
  let difficulty = "Complejo";
  let decentralizationMeter = 65;
  let viability = 75;
  let sustainScore = 78;

  let advice = [
    "Seleccione altas densidades de GPU por rack (p. ej., sistemas de 4x u 8x) para reducir el conteo de saltos de red.",
    "Utilice cachés de vectores semánticos locales para disminuir drásticamente el coste recurrente de consultas a LLMs.",
    "Consulte a planificadores técnicos y de climatización cualificados antes de escalar la potencia eléctrica de su sala de servidores."
  ];

  let verdict = "Los servidores físicos locales son muy viables, pero exigen cabinas climatizadas estables para contrarrestar la alta dispersión de calor.";

  if (norm.includes("video") || norm.includes("image") || norm.includes("film") || norm.includes("creative") || norm.includes("creativo") || norm.includes("diseño")) {
    orgType = "Laboratorio Gráfico y Producción de Video";
    scale = "Equipos de Alta Densidad de Rendimiento";
    intensity = "Procesamiento de renderizado de alta fidelidad, entrenamiento de modelos generativos visuales y pipelines de simulación gráfica intensiva";
    complexity = "Malla de clústeres GPU de Tipo 4";
    servers = 5;
    gpus = 16;
    gpuModel = "Nvidia H100 SXM5 (80GB)";
    storage = 250;
    space = 350;
    dailyKw = 360;
    hwCost = 650000;
    decentralizationMeter = 45;
    viability = 55;
    difficulty = "Extremo";
    sustainScore = 52;
    advice = [
      "Agregue almacenamiento agrupado NVMe RAID 10 acoplado con conmutadores ethernet de 400 Gbps.",
      "Considere arquitecturas híbridas para absorber de forma segura los picos máximos de carga de renderizado.",
      "Considere un sistema de refrigeración líquida directa sobre el silicio para evitar recortes por sobrecalentamiento."
    ];
    verdict = "Carga de renderizado sumamente alta. Se requieren servidores de refrigeración líquida de gama enterprise para evitar pérdidas por estrangulamiento térmico.";
  } else if (norm.includes("hospital") || norm.includes("medical") || norm.includes("health") || norm.includes("clinical") || norm.includes("médic") || norm.includes("pacientes") || norm.includes("salud")) {
    orgType = "Centro de Atención Clínica e Imágenes Médicas";
    scale = "Marco Institucional Crítico";
    intensity = "Inferencia asistida de diagnóstico clínico, segmentación automatizada de imágenes médicas y asistencia médica local segura para pacientes";
    complexity = "Malla tolerante a fallos de grado médico";
    servers = 5;
    gpus = 12;
    gpuModel = "Nvidia H100 NVL (Tarjeta Dual-GPU)";
    storage = 500;
    space = 250;
    dailyKw = 210;
    hwCost = 450000;
    decentralizationMeter = 70;
    viability = 75;
    difficulty = "Complejo";
    sustainScore = 60;
    advice = [
      "Integre fuentes de alimentación ininterrumpida (SAI/UPS) redundantes para garantizar que los diagnósticos sigan activos incluso durante apagones estructurales.",
      "Establezca niveles estrictos de prioridad de hardware, priorizando el análisis de imágenes de diagnóstico inmediato sobre la preparación administrativa general.",
      "Diseñe un alojamiento de servidores con monitoreo climático activo para proteger los componentes críticos de caídas de rendimiento."
    ];
    verdict = "Una configuración privada compleja pero fundamentalmente necesaria. Las normas de cumplimiento y la confidencialidad de los pacientes hacen que el procesamiento en la nube sea peligroso. Los servidores locales garantizan disponibilidad inmediata.";
  } else if (norm.includes("law") || norm.includes("legal") || norm.includes("compliance") || norm.includes("document") || norm.includes("abogado") || norm.includes("jurídic")) {
    orgType = "Oficina de Asesoría Jurídica y Profesional";
    scale = "Enclave Empresarial a Medida";
    intensity = "Análisis automatizado de sumarios, auditoría cruzada de contratos y búsqueda semántica en repositorios documentales totalmente herméticos";
    complexity = "Clúster local redundante de alta seguridad";
    servers = 2;
    gpus = 4;
    gpuModel = "Nvidia RTX 6000 Ada (48GB)";
    storage = 60;
    space = 80;
    dailyKw = 48;
    hwCost = 65000;
    decentralizationMeter = 85;
    viability = 82;
    difficulty = "Moderado";
    sustainScore = 80;
    advice = [
      "Aplique un aislamiento absoluto (air-gapping) en el clúster de inferencia local para cumplir con las estrictas regulaciones de secreto profesional abogado-cliente.",
      "Implemente almacenamiento en caché semántico local. Esto minimiza drásticamente los cálculos de consultas repetitivas de contratos, manteniendo bajos los tiempos de inactividad de las GPUs.",
      "Configure la duplicación automática y cifrada del almacenamiento físico en servidores secundarios en caso de fallos de unidad."
    ];
    verdict = "Caso ideal para IA privada en local. Las restricciones de propiedad intelectual prohíben las rutas en la nube, lo que hace que un rack de servidores dedicado de bajo espacio sea muy viable y económicamente sensato.";
  } else if (norm.includes("personal") || norm.includes("micro") || norm.includes("individual") || norm.includes("home") || norm.includes("casa") || norm.includes("propio") || prompt.length < 35) {
    orgType = "Asistente Personal / Microoficina";
    scale = "Enclave local de un solo usuario";
    intensity = "Ejecución continua de asistentes de productividad personal, inferencia de chat interactivo y generación de prototipos locales ligeros";
    complexity = "Nodo silencioso a nivel de estación de trabajo";
    servers = 1;
    gpus = 1;
    gpuModel = "Nvidia RTX 5000 Ada Generation";
    storage = 6;
    space = 15;
    dailyKw = 8;
    hwCost = 8500;
    decentralizationMeter = 95;
    viability = 98;
    difficulty = "Fácil";
    sustainScore = 92;
    advice = [
      "Aproveche modelos altamente cuantizados (por ejemplo, formato GGUF para LLMs) para ejecutarlos eficientemente en memoria unificada, evitando hardware de servidor costoso.",
      "Ancle el sistema en una fuente de alimentación premium de consumo silencioso de 120 voltios estándar, esquivando por completo reformas complejas del edificio.",
      "Configure activadores automáticos de suspensión para reducir el consumo en espera a cero cuando su microasistente esté inactivo."
    ];
    verdict = "Candidato perfecto para una descentralización absoluta. Electricidad doméstica estándar, cero reformas de refrigeración y ruido ambiental mínimo.";
  } else if (norm.includes("university") || norm.includes("school") || norm.includes("students") || norm.includes("education") || norm.includes("escuela") || norm.includes("universidad") || norm.includes("estudiantes") || norm.includes("investig")) {
    orgType = "Centro de Investigación e Institución Académica";
    scale = "Red de Campus Multiusuario";
    intensity = "Simulaciones experimentales complejas, entrenamiento de redes neuronales estudiantiles y computación de alto rendimiento multitarea";
    complexity = "Nodo HPC compartido de alto rendimiento";
    servers = 8;
    gpus = 24;
    gpuModel = "Nvidia A100 Tensor Core 80GB";
    storage = 750;
    space = 400;
    dailyKw = 480;
    hwCost = 520000;
    decentralizationMeter = 75;
    viability = 78;
    difficulty = "Complejo";
    sustainScore = 68;
    advice = [
      "Utilice la partición dinámica de GPU multiinstancia (MIG) en las A100. Esto divide las grandes GPUs en sectores óptimos para servir a cientos de estudiantes simultáneamente.",
      "Establezca límites de cola en todo el campus para evitar que un solo laboratorio monopolice los clústeres de cálculo.",
      "Aproveche la infraestructura central de servicios del campus para omitir costosos condensadores de refrigeración adicionales."
    ];
    verdict = "Muy recomendado para la independencia académica. La capacidad computacional privada respalda diversos estudios de investigación sin depender de costosas suscripciones de pago por uso en la nube.";
  }

  const monthlyElectricityCost = Math.round(dailyKw * 30 * 0.15);
  const annualMaintenance = Math.round(hwCost * 0.08);
  const hardwareReplacementAnnual = Math.round(hwCost / replacementYears);
  const coolingAnnualCost = Math.round(monthlyElectricityCost * 0.35 * 12);
  const yearlyKwh = Math.round(dailyKw * 365);
  const monthlyKwh = Math.round(dailyKw * 30);
  const yearlyCo2EmissionsTons = Math.round((yearlyKwh * 0.00038) * 10) / 10;
  
  const equivalenceText = `Equivalente al consumo eléctrico anual promedio de ${Math.round((yearlyKwh / 10500) * 10) / 10} viviendas residenciales.`;

  return {
    organizationType: orgType,
    scale,
    workloadIntensity: intensity,
    complexityLevel: complexity,
    decentralizationDifficulty: `${difficulty} - Direct deployment`,
    serversRequired: servers,
    gpusNeeded: gpus,
    gpuModel,
    storageRequiredTB: storage,
    storageType: "Enterprise NVMe RAID 10",
    networkingSpeedGbps: servers > 2 ? 200 : 10,
    coolingSystem: servers > 3 ? "Direct Fluid Cool" : "Forced Air Cooling",
    estimatedPhysicalSpaceSqFt: space,
    dailyKwh: dailyKw,
    monthlyKwh,
    yearlyKwh,
    equivalenceResidentialRatio: Math.round((yearlyKwh / 10500) * 10) / 10,
    equivalenceText,
    hardwareInvestment: hwCost,
    monthlyElectricityCost,
    annualMaintenance,
    hardwareReplacementCycleYears: replacementYears,
    hardwareReplacementAnnual,
    coolingAnnualCost,
    yearlyCo2EmissionsTons,
    heatGenerationBtuHrs: Math.round(dailyKw * 3412 * (24 / 1000)),
    materialRareEarthKg: gpus * 5,
    sustainabilityScore: sustainScore,
    viabilityScore: viability,
    decentralizationMeter,
    difficultyIndicator: difficulty,
    analysisVerdict: verdict,
    strategicAdvice: advice
  };
}
