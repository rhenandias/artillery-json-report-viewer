import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  type ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import type { IntermediateData } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

interface TimeSeriesChartProps {
  intermediateData: IntermediateData[];
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  intermediateData,
}) => {
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#A0AEC0",
          boxWidth: 12,
          padding: 20,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: {
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "T",
          unit: "second",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#A0AEC0",
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "VUsers / Requisições por Segundo",
          color: "#A0AEC0",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#A0AEC0",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Tempo de Resposta (ms)",
          color: "#A0AEC0",
        },
        grid: {
          drawOnChartArea: false, // only show the grid for the main Y axis
        },
        ticks: {
          color: "#A0AEC0",
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: "Taxa de Requisições (http.request_rate)",
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.rates["http.request_rate"] || 0,
        })),
        borderColor: "#F97316", // Orange
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        tension: 0,
        yAxisID: "y",
        fill: true,
      },
      {
        label: "Tempo de Resposta p95 (ms)",
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.summaries["http.response_time"]?.p95 || null,
        })),
        borderColor: "#38BDF8", // Light Blue
        backgroundColor: "rgba(56, 189, 248, 0.1)",
        tension: 0,
        yAxisID: "y1",
        fill: true,
      },
      {
        label: "VUsers Criados",
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.counters["vusers.created"] || 0,
        })),
        borderColor: "#A78BFA", // Violet
        backgroundColor: "rgba(167, 139, 250, 0.1)",
        tension: 0,
        yAxisID: "y",
        fill: false,
        pointRadius: 2,
      },
      {
        label: "VUsers Falhados",
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.counters["vusers.failed"] || 0,
        })),
        borderColor: "#F43F5E", // Rose
        backgroundColor: "rgba(244, 63, 94, 0.1)",
        tension: 0,
        yAxisID: "y",
        fill: false,
        pointRadius: 2,
      },
      {
        label: "VUsers Completos",
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.counters["vusers.completed"] || 0,
        })),
        borderColor: "#22C55E", // Green
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        tension: 0,
        yAxisID: "y",
        fill: false,
        pointRadius: 2,
      },
    ],
  };

  return (
    <div style={{ height: "450px" }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default TimeSeriesChart;
