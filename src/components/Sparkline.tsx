import React from "react";
import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import "chartjs-adapter-date-fns";

const sparklineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    // use a time scale so Chart.js correctly places points by timestamp
    x: { display: false, type: "time", time: { unit: "second" } },
    y: { display: false },
  },
  elements: {
    point: { radius: 0 },
    line: { tension: 0.4 },
  },
  spanGaps: true,
  animation: false,
};

const Sparkline: React.FC<{
  data: { x: number; y: number | null }[];
  color: string;
}> = ({ data, color }) => {
  // Filter out null y values - Chart.js can handle gaps but removing nulls
  // prevents rendering unexpected vertical lines when only one valid x exists.
  const filtered = data.filter((d) => d.y !== null).sort((a, b) => a.x - b.x);

  const chartData = {
    datasets: [
      {
        data: filtered,
        borderColor: color,
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.2,
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
