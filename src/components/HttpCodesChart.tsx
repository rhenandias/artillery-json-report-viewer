import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface HttpCodesChartProps {
  counters: { [key: string]: number };
}

const HttpCodesChart: React.FC<HttpCodesChartProps> = ({ counters }) => {
  const codeEntries = Object.entries(counters).filter(([key]) =>
    key.startsWith("http.codes.")
  );
  const errorEntries = Object.entries(counters).filter(([key]) =>
    key.startsWith("errors.")
  );

  const allEntries = [...codeEntries, ...errorEntries];

  if (allEntries.length === 0) {
    return <p className="text-gray-400">Sem dados de resposta.</p>;
  }

  const data = {
    labels: allEntries.map(([key]) =>
      key.replace("http.codes.", "HTTP ").replace("errors.", "Erro: ")
    ),
    datasets: [
      {
        label: "Contagem",
        data: allEntries.map(([, value]) => value),
        backgroundColor: [
          "#22C55E", // Green for success
          "#F43F5E", // Red for errors
          "#F97316", // Orange for other errors
          "#FACC15", // Yellow
          "#6366F1", // Indigo
          "#A855F7", // Purple
        ],
        borderColor: "#1E1E1E",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#A0AEC0",
          boxWidth: 12,
          padding: 15,
        },
      },
    },
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "300px",
        height: "300px",
      }}
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default HttpCodesChart;
