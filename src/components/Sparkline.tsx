import React from "react";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

const sparklineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
  elements: {
    point: { radius: 0 },
    line: { tension: 0.4 },
  },
  animation: false,
};

const Sparkline: React.FC<{
  data: { x: number; y: number | null }[];
  color: string;
}> = ({ data, color }) => {
  const chartData = {
    datasets: [
      {
        data: data,
        borderColor: color,
        borderWidth: 1.5,
      },
    ],
  };
  return (
    <div className="w-12 h-6">
      <Line options={sparklineOptions} data={chartData} />
    </div>
  );
};

export default Sparkline;
