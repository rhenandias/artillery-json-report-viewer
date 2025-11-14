import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import type { Summary } from "../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ResponseTimeChartProps {
  summary?: Summary;
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ summary }) => {
  if (!summary) {
    return (
      <p className="text-center text-gray-400">
        Response time data not available.
      </p>
    );
  }

  const options: ChartOptions<"bar"> = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.formattedValue} ms`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#A0AEC0",
          callback: (value) => `${value} ms`,
        },
        title: {
          display: true,
          text: "Response Time",
          color: "#A0AEC0",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#A0AEC0",
          font: {
            weight: "bold",
          },
        },
      },
    },
  };

  const labels = ["min", "mean", "p50", "p75", "p90", "p95", "p99", "max"];
  const dataValues = [
    summary.min,
    summary.mean,
    summary.p50,
    summary.p75,
    summary.p90,
    summary.p95,
    summary.p99,
    summary.max,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Response Time (ms)",
        data: dataValues,
        backgroundColor: [
          "#0284C7",
          "#0369A1",
          "#075985",
          "#0891B2",
          "#06B6D4",
          "#22D3EE",
          "#67E8F9",
          "#A5F3FC",
        ],
        borderColor: [
          "#0EA5E9",
          "#38BDF8",
          "#7DD3FC",
          "#06B6D4",
          "#22D3EE",
          "#67E8F9",
          "#A5F3FC",
          "#CFFAFE",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ height: "400px" }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default ResponseTimeChart;
