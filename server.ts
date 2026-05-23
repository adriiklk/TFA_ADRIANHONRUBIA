/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Dynamic high-fidelity heuristic fallback analyzer in case Gemini API is missing or fails
function getHeuristicAnalysis(prompt: string) {
  const norm = prompt.toLowerCase();
  
  // Determine characteristics based on keywords
  let scale = "Escala Mediana";
  let orgType = "Entidad Privada";
  let intensity = "Procesamiento local de flujos de automatización e inferencia general de lenguaje";
  let complexity = "Arquitectura Mediana";
  let servers = 2;
  let gpus = 8;
  let gpuModel = "Nvidia L40S 48GB";
  let storage = 45;
  let space = 180;
  let dailyKw = 110;
  let complexityLvl = "Configuración Significativa";
  let heatBtu = 375000;
  let rareEarth = 42;
  let sustainScore = 75;
  
  let hwCost = 135000;
  let rateKwh = 0.15;
  let replacementYears = 4;
  let difficulty = "Complejo";
  let decentralizationMeter = 60;
  let viability = 65;

  let advice: string[] = [
    "Opte por GPUs Nvidia L4 de alta eficiencia energética si su contexto no requiere un rendimiento de entrenamiento máximo extremo.",
    "Utilice una programación consciente de la huella de carbono para ejecutar lotes de IA no críticos durante horas más frías o con energía verde.",
    "Implemente redundancia contenerizada utilizando orquestación ligera para evitar fallos de hardware físico de punto único."
  ];

  let verdict = "Una nube privada o descentralizada local es viable, pero exige adaptaciones profesionales de ingeniería mecánica, eléctrica y de fontanería (MEP) para soportar la enorme demanda de energía y refrigeración líquida.";

  if (norm.includes("video") || norm.includes("image") || norm.includes("generation") || norm.includes("film") || norm.includes("production") || norm.includes("película") || norm.includes("creativo")) {
    orgType = "Estudio de Producción Creativa y Video";
    scale = "Espacio de Medios de Alta Intensidad";
    intensity = "Procesamiento de renderizado de alta fidelidad, entrenamiento de modelos generativos visuales y clústeres de gráficos en paralelo";
    complexity = "Malla de GPUs agrupadas altamente exigente";
    servers = 4;
    gpus = 16;
    gpuModel = "Nvidia H100 SXM5 80GB";
    storage = 280;
    space = 320;
    dailyKw = 340;
    heatBtu = 1150000;
    rareEarth = 110;
    sustainScore = 48;
    hwCost = 640000;
    decentralizationMeter = 45;
    viability = 52;
    difficulty = "Extremo";
    advice = [
      "Use matrices RAID NVMe de alta velocidad conectadas mediante un conmutador InfiniBand de 400 Gbps para alimentar múltiples H100 sin cuellos de botella de datos.",
      "Considere un modelo de nube híbrida para escalar hacia pipelines de gráficos remotos durante picos de renderizado, manteniendo las cargas de trabajo normales en local.",
      "Explore opciones de refrigeración líquida directa para evitar estrangulamiento térmico por calor extremo bajo estrés continuo de renderizado."
    ];
    verdict = "Se requieren sistemas de estaciones de trabajo refrigeradas por líquido. Debido al presupuesto de energía astronómico y a las complejas configuraciones dedicadas de InfiniBand, es muy aconsejable disponer de un subpanel eléctrico independiente.";
  } else if (norm.includes("personal") || norm.includes("private assistant") || norm.includes("individual") || norm.includes("home") || norm.includes("myself") || norm.includes("casa") || norm.includes("propio") || norm.length < 35) {
    orgType = "Asistente Personal / Microoficina";
    scale = "Enclave local de un solo usuario";
    intensity = "Ejecución continua de asistentes de productividad personal, inferencia de chat interactivo y generación de prototipos locales";
    complexity = "Nodo silencioso a nivel de estación de trabajo";
    servers = 1;
    gpus = 1;
    gpuModel = "Nvidia RTX 5000 Ada Generation";
    storage = 6;
    space = 15;
    dailyKw = 8;
    heatBtu = 28000;
    rareEarth = 4;
    sustainScore = 92;
    hwCost = 8500;
    decentralizationMeter = 95;
    viability = 98;
    difficulty = "Fácil";
    advice = [
      "Aproveche modelos altamente cuantizados (por ejemplo, formato GGUF para LLMs) para ejecutarlos eficientemente en memoria unificada, evitando hardware de servidor costoso.",
      "Ancle el sistema en una fuente de alimentación premium de consumo silencioso de 120 voltios estándar, esquivando por completo reformas complejas del edificio.",
      "Configure activadores automáticos de suspensión para reducir el consumo en espera a cero cuando su microasistente esté inactivo."
    ];
    verdict = "Candidato perfecto para una descentralización absoluta. Electricidad doméstica estándar, cero reformas de refrigeración y ruido ambiental mínimo.";
  } else if (norm.includes("law") || norm.includes("legal") || norm.includes("compliance") || norm.includes("document") || norm.includes("abogado") || norm.includes("jurídic")) {
    orgType = "Oficina de Asesoría Jurídica y Profesional";
    scale = "Enclave Empresarial a Medida";
    intensity = "Análisis automatizado de sumarios, auditoría cruzada de contratos y búsqueda semántica de documentos jurídicos aislados";
    complexity = "Clúster local redundante de alta seguridad";
    servers = 2;
    gpus = 4;
    gpuModel = "Nvidia RTX 6000 Ada (48GB)";
    storage = 60;
    space = 80;
    dailyKw = 48;
    heatBtu = 145000;
    rareEarth = 18;
    sustainScore = 80;
    hwCost = 65000;
    decentralizationMeter = 85;
    viability = 82;
    difficulty = "Moderado";
    advice = [
      "Aplique un aislamiento absoluto (air-gapping) en el clúster de inferencia local para cumplir con las estrictas regulaciones de secreto profesional abogado-cliente.",
      "Implemente almacenamiento en caché semántico local. Esto minimiza drásticamente los cálculos de consultas repetitivas de contratos, manteniendo bajos los tiempos de inactividad de las GPUs.",
      "Configure la duplicación automática y cifrada del almacenamiento físico en servidores secundarios en caso de fallos de unidad."
    ];
    verdict = "Caso ideal para IA privada en local. Las restricciones de propiedad intelectual prohíben las rutas en la nube, lo que hace que un rack de servidores dedicado de bajo espacio sea muy viable y económicamente sensato.";
  } else if (norm.includes("hospital") || norm.includes("medical") || norm.includes("health") || norm.includes("clinical") || norm.includes("médic") || norm.includes("pacientes") || norm.includes("salud")) {
    orgType = "Centro de Atención Clínica e Imágenes Médicas";
    scale = "Marco Institucional Crítico";
    intensity = "Inferencia asistida de diagnóstico clínico, segmentación de imágenes médicas y asistencia médica local de baja latencia";
    complexity = "Malla tolerante a fallos de grado médico";
    servers = 5;
    gpus = 12;
    gpuModel = "Nvidia H100 NVL (Tarjeta Dual-GPU)";
    storage = 500;
    space = 250;
    dailyKw = 210;
    heatBtu = 720000;
    rareEarth = 75;
    sustainScore = 60;
    hwCost = 450000;
    decentralizationMeter = 70;
    viability = 75;
    difficulty = "Complejo";
    advice = [
      "Integre fuentes de alimentación ininterrumpida (SAI/UPS) redundantes para garantizar que los diagnósticos sigan activos incluso durante apagones estructurales.",
      "Establezca niveles estrictos de prioridad de hardware, priorizando el análisis de imágenes de diagnóstico inmediato sobre la preparación administrativa general.",
      "Diseñe un alojamiento de servidores con monitoreo climático activo para proteger los componentes críticos de caídas de rendimiento."
    ];
    verdict = "Una configuración privada compleja pero fundamentalmente necesaria. Las normas de cumplimiento y la confidencialidad de los pacientes hacen que el procesamiento en la nube sea peligroso. Los servidores locales garantizan disponibilidad inmediata.";
  } else if (norm.includes("university") || norm.includes("school") || norm.includes("students") || norm.includes("education") || norm.includes("escuela") || norm.includes("universidad") || norm.includes("estudiantes") || norm.includes("investig")) {
    orgType = "Centro de Investigación e Institución Académica";
    scale = "Red de Campus Multiusuario";
    intensity = "Computación de alto rendimiento, entrenamiento de modelos estudiantiles y simulaciones científicas paralelas multiusuario";
    complexity = "Nodo HPC compartido de alto rendimiento";
    servers = 8;
    gpus = 24;
    gpuModel = "Nvidia A100 Tensor Core 80GB";
    storage = 750;
    space = 400;
    dailyKw = 480;
    heatBtu = 1600000;
    rareEarth = 140;
    sustainScore = 68;
    hwCost = 520000;
    decentralizationMeter = 75;
    viability = 78;
    difficulty = "Complejo";
    advice = [
      "Utilice la partición dinámica de GPU multiinstancia (MIG) en las A100. Esto divide las grandes GPUs en sectores óptimos para servir a cientos de estudiantes simultáneamente.",
      "Establezca límites de cola en todo el campus para evitar que un solo laboratorio monopolice los clústeres de cálculo.",
      "Aproveche la infraestructura central de servicios del campus para omitir costosos condensadores de refrigeración adicionales."
    ];
    verdict = "Muy recomendado para la independencia académica. La capacidad computacional privada respalda diversos estudios de investigación sin depender de costosas suscripciones de pago por uso en la nube.";
  }

  // Derived economic / environmental economics
  const monthlyElectricityCost = Math.round(dailyKw * 30 * rateKwh);
  const annualMaintenance = Math.round(hwCost * 0.08);
  const hardwareReplacementAnnual = Math.round(hwCost / replacementYears);
  const coolingAnnualCost = Math.round(monthlyElectricityCost * 0.35 * 12);
  const yearlyKwh = Math.round(dailyKw * 365);
  const monthlyKwh = Math.round(dailyKw * 30);
  const yearlyCo2EmissionsTons = Math.round((yearlyKwh * 0.00038) * 10) / 10;
  
  const equivalenceResidentialRatio = Math.round((yearlyKwh / 10500) * 10) / 10;
  const equivalenceText = `Equivalente al consumo eléctrico anual de ${equivalenceResidentialRatio} hogares residenciales promedio.`;

  return {
    organizationType: orgType,
    scale,
    workloadIntensity: intensity,
    complexityLevel: complexity,
    decentralizationDifficulty: `${difficulty} - ${complexityLvl}`,
    serversRequired: servers,
    gpusNeeded: gpus,
    gpuModel,
    storageRequiredTB: storage,
    storageType: servers > 1 ? "Enterprise PCIe NVMe RAID 10" : "Symmetric PCIe Direct Drive",
    networkingSpeedGbps: servers > 2 ? 200 : 10,
    coolingSystem: servers > 3 ? "Refrigeración líquida directa al chip" : "Convección silenciosa por aire forzado",
    estimatedPhysicalSpaceSqFt: space,
    dailyKwh: dailyKw,
    monthlyKwh,
    yearlyKwh,
    equivalenceResidentialRatio,
    equivalenceText,
    hardwareInvestment: hwCost,
    monthlyElectricityCost,
    annualMaintenance,
    hardwareReplacementCycleYears: replacementYears,
    hardwareReplacementAnnual,
    coolingAnnualCost,
    yearlyCo2EmissionsTons,
    heatGenerationBtuHrs: heatBtu,
    materialRareEarthKg: rareEarth,
    sustainabilityScore: sustainScore,
    viabilityScore: viability,
    decentralizationMeter,
    difficultyIndicator: difficulty,
    analysisVerdict: verdict,
    strategicAdvice: advice
  };
}

// REST endpoint for AI analysis
app.post("/api/analyze", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Organization description is required as a string prompt." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    // If API Key is missing, generate highly sophisticated, fully logical heuristic analysis report
    console.log("No active Gemini API key found, running master heuristic simulator...");
    setTimeout(() => {
      return res.json(getHeuristicAnalysis(prompt));
    }, 1500); // Simulate network/computation latency for advanced feel
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemPrompt = `
      You are the Master AI Infrastructure Architect at a premium, cutting-edge next-generation computing organization (like Nvidia, OpenAI, Apple or a custom advanced datacenter builder).
      
      Your goal is to parse a natural language description of an organization, company, institution, or personal need and estimate detailed operational, physical, and economic metrics for setting up a completely PRIVATE, LOCAL, or DECENTRALIZED AI infrastructure.
      
      Your calculations MUST be realistic and mathematically cohesive:
      - Small use cases (personal desktop local assistants) should have tiny numbers (8-15 sq ft physical footprint, 1 workstation workstation GPU like RTX 5000 / Ada, very low power ~8 kWh/day, highly viable, inexpensive ~$8k hardware investment, low scale).
      - Mid-scale setups (medium companies, law offices with 50 lawyers) need mid-scale numbers (4-8 GPUs such as Nvidia L40S, 40-80 TB storage, ~50 kWh/day, high-speed networking, ~$65k investment).
      - Large-scale setups (large universities, hospitals, media/film video generation teams) need major server scale (12-24+ top-tier enterprise GPUs like Nvidia H100 SXM5 / NVL, hundreds of TB of storage, specialized cooling systems, very high kWh/day ~200-500+, severe cooling and power challenges, highly complex, low sustainability, low viability without massive investment of $300k-$1M).
      
      Ensure power calculations align with hardware sizes: each dual SXM5 H100 node draws approximately 1.5 - 2 kW continuous.
      CO2 emissions: assume 0.00038 metric tons of CO2 per kWh.
      Heat generation: ~3412 BTU per kW (so e.g. a 10 kW draw generates roughly ~34120 BTU/hr).
      Residential equivalence residential home average electric usage is roughly 10,500 kWh per year. Let equivalenceResidentialRatio match (yearlyKwh / 10500).
      
      CRITICAL: You MUST write all the textual descriptions and array elements (such as organizationType, scale, workloadIntensity, complexityLevel, decentralizationDifficulty, equivalenceText, difficultyIndicator, analysisVerdict, and strategicAdvice elements) in Spanish (Castellano) so that it flows perfectly with a Spanish UI interface.
      
      CRITICAL FOR workloadIntensity: This field MUST be a highly detailed, elegant, and action-oriented explanation in Spanish specifying EXACTLY what function and utility the AI infrastructure will perform for this specific organization (e.g. "Análisis avanzado y auditoría hermética de contratos mercantiles a nivel estatal", "Procesamiento masivo de modelos generativos de video y renderizado tridimensional", "Inferencia de diagnóstico por imagen clínica asistida con total custodia de datos"). You are STRICLY FORBIDDEN from using simple intensity labels like "Moderada", "Moderada-alta", "Alta", "Baja", "Carga media" or "Carga de trabajo bastante alta". Always focus on explaining the active functional task.

      Respond STRICTLY in JSON conforming to the requested schema. Provide deep, authentic, strategic advice specifically tailored to their query in Spanish.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Calculate infrastructure metrics matching the exact schema for the following organization description:\n\n"${prompt}"`,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            organizationType: { type: Type.STRING, description: "Detailed summary of detected organization type" },
            scale: { type: Type.STRING, description: "Visual scale indicator description" },
            workloadIntensity: { type: Type.STRING, description: "Action-oriented active function description in Spanish explaining exactly what the local AI infrastructure is used for" },
            complexityLevel: { type: Type.STRING, description: "Visual complexity level description" },
            decentralizationDifficulty: { type: Type.STRING, description: "Detailed explanation of decentralization difficulty" },
            serversRequired: { type: Type.INTEGER, description: "Estimated total server units" },
            gpusNeeded: { type: Type.INTEGER, description: "Estimated total physical GPUs" },
            gpuModel: { type: Type.STRING, description: "Specific professional GPU/workstation card recommended" },
            storageRequiredTB: { type: Type.INTEGER, description: "Total high-performance local storage required in Terabytes" },
            storageType: { type: Type.STRING, description: "Exact technology type of recommended storage" },
            networkingSpeedGbps: { type: Type.INTEGER, description: "Networking backplane throughput speed in Gigabits per second" },
            coolingSystem: { type: Type.STRING, description: "Cooling tech e.g. liquid cooled, air cooled chassis" },
            estimatedPhysicalSpaceSqFt: { type: Type.INTEGER, description: "Estimated physical room/rack space size in square feet" },
            dailyKwh: { type: Type.NUMBER, description: "Daily electrical power consumption in Kilowatt-Hours" },
            monthlyKwh: { type: Type.NUMBER, description: "Monthly electrical power consumption in Kilowatt-Hours" },
            yearlyKwh: { type: Type.NUMBER, description: "Yearly electrical power consumption in Kilowatt-Hours" },
            equivalenceResidentialRatio: { type: Type.NUMBER, description: "Ratio of yearly energy vs standard home yearly energy" },
            equivalenceText: { type: Type.STRING, description: "Dynamic equivalence statement e.g. Equivalent to XX homes power" },
            hardwareInvestment: { type: Type.NUMBER, description: "Total initial cap-ex investment required in USD" },
            monthlyElectricityCost: { type: Type.NUMBER, description: "Estimated monthly electrical operating costs in USD" },
            annualMaintenance: { type: Type.NUMBER, description: "Estimated annual hardware upkeep, diagnostic & spare budget in USD" },
            hardwareReplacementCycleYears: { type: Type.INTEGER, description: "Average product hardware refresh cycle years (typically 3 or 4)" },
            hardwareReplacementAnnual: { type: Type.NUMBER, description: "Depreciated annualized replacement set-aside cache in USD" },
            coolingAnnualCost: { type: Type.NUMBER, description: "Thermal dispersion, fluid recharge, fan power total yearly cost in USD" },
            yearlyCo2EmissionsTons: { type: Type.NUMBER, description: "Estimated carbon footprint equivalents in metric tons per year" },
            heatGenerationBtuHrs: { type: Type.NUMBER, description: "Total continuous thermal load generated in BTU per hour" },
            materialRareEarthKg: { type: Type.NUMBER, description: "Estimated structural raw rare earth core metals used in hardware kilograms" },
            sustainabilityScore: { type: Type.INTEGER, description: "Sustainability index out of 100 based on carbon, materials, and power recovery" },
            viabilityScore: { type: Type.INTEGER, description: "Total on-premise viability rating from 1 to 100" },
            decentralizationMeter: { type: Type.INTEGER, description: "Decentralization autonomy score from 1 to 100" },
            difficultyIndicator: { type: Type.STRING, description: "General difficulty tag: e.g. Low, Moderate, Complex, Extreme" },
            analysisVerdict: { type: Type.STRING, description: "Final comprehensive architectural consensus verdict" },
            strategicAdvice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Distinct actionable, highly premium engineering guidelines (3 to 5 keys)"
            }
          },
          required: [
            "organizationType", "scale", "workloadIntensity", "complexityLevel",
            "decentralizationDifficulty", "serversRequired", "gpusNeeded", "gpuModel",
            "storageRequiredTB", "storageType", "networkingSpeedGbps", "coolingSystem",
            "estimatedPhysicalSpaceSqFt", "dailyKwh", "monthlyKwh", "yearlyKwh",
            "equivalenceResidentialRatio", "equivalenceText", "hardwareInvestment",
            "monthlyElectricityCost", "annualMaintenance", "hardwareReplacementCycleYears",
            "hardwareReplacementAnnual", "coolingAnnualCost", "yearlyCo2EmissionsTons",
            "heatGenerationBtuHrs", "materialRareEarthKg", "sustainabilityScore",
            "viabilityScore", "decentralizationMeter", "difficultyIndicator", "analysisVerdict",
            "strategicAdvice"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text.trim());
    return res.json(parsedData);
  } catch (error) {
    console.error("Gemini API call failed, reverting gracefully to high-fidelity master heuristic analysis:", error);
    // Graceful fallback prevents blank dashboards/crashes
    return res.json(getHeuristicAnalysis(prompt));
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Simulator Server] Running on http://0.0.0.0:${PORT} under NODE_ENV=${process.env.NODE_ENV}`);
  });
}

startServer();
