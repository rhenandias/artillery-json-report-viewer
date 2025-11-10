import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
  type ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import type { IntermediateData } from "../types";
import { formatBytes } from "../utils/formatters";
import { getMetricValue } from "../utils/metrics";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

const COLORS = [
  "#38bdf8",
  "#f97316",
  "#22c55e",
  "#f43f5e",
  "#a78bfa",
  "#facc15",
  "#e11d48",
  "#14b8a6",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#65a30d",
];

interface MetricChartProps {
  title: string;
  metrics: { key: string; label: string; isFilled?: boolean }[];
  intermediateData: IntermediateData[];
  yAxisLabel: string;
  yAxisType?: "bytes" | "time" | "count";
}

const MetricChart: React.FC<MetricChartProps> = ({
  title,
  metrics,
  intermediateData,
  yAxisLabel,
  yAxisType = "count",
}) => {
  const chartOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#A0AEC0",
            boxWidth: 12,
            padding: 15,
          },
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0,0,0,0.8)",
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                let value = context.parsed.y;
                if (yAxisType === "bytes") label += formatBytes(value);
                else if (yAxisType === "time")
                  label += `${value.toFixed(2)} ms`;
                else label += value.toLocaleString("pt-BR");
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: { tooltipFormat: "T", unit: "second" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: { color: "#A0AEC0" },
        },
        y: {
          title: { display: true, text: yAxisLabel, color: "#A0AEC0" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
          ticks: {
            color: "#A0AEC0",
            callback: (value) => {
              if (typeof value !== "number") return value;
              if (yAxisType === "bytes") return formatBytes(value);
              if (yAxisType === "time") return `${value}ms`;
              if (value >= 1000) return `${value / 1000}k`;
              return value;
            },
          },
        },
      },
    }),
    [yAxisLabel, yAxisType]
  );

  const chartData = useMemo(() => {
    const datasets = metrics
      .map((metric, index) => {
        const dataPoints = intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: getMetricValue(item, metric.key),
        }));

        // Don't render a dataset if it has no data points
        if (dataPoints.every((d) => d.y === null)) {
          return null;
        }

        return {
          label: metric.label,
          data: dataPoints,
          borderColor: COLORS[index % COLORS.length],
          backgroundColor: `${COLORS[index % COLORS.length]}4D`, // 30% opacity
          tension: 0.2,
          pointRadius: 1.5,
          borderWidth: 2,
          fill: metric.isFilled || false,
        };
      })
      .filter(Boolean); // Filter out null datasets

    return { datasets };
  }, [metrics, intermediateData]);

  // Don't render the chart component if there's no data to display
  if (!chartData.datasets || chartData.datasets.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-[300px] border border-dashed border-gray-700 rounded-md">
          <p className="text-gray-500">Métrica não encontrada no relatório.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div style={{ height: "300px" }}>
        {/* FIX: The 'options' prop was being passed an undefined variable 'options' instead of 'chartOptions'. */}
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default MetricChart;
