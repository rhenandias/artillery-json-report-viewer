import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type Plugin,
} from 'chart.js';
import type { Summary } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface ResponseTimeChartProps {
  summary?: Summary;
}

function ResponseTimeChart({ summary }: ResponseTimeChartProps) {
  const allMetrics: { [key: string]: number | undefined } = {
    min: summary?.min,
    mean: summary?.mean,
    p50: summary?.p50,
    p75: summary?.p75,
    p90: summary?.p90,
    p95: summary?.p95,
    p99: summary?.p99,
    max: summary?.max,
  };

  const metrics = Object.entries(allMetrics)
    .filter(([_, value]) => value !== undefined)
    .reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {} as { [key: string]: number },
    );

  if (!summary || Object.keys(metrics).length === 0) {
    return (
      <p className="text-center text-gray-400">
        Response time data not available.
      </p>
    );
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 50,
      },
    },
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          color: '#A0AEC0',
          usePointStyle: true,
          pointStyle: 'rectRounded',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${context.formattedValue} ms`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#A0AEC0',
          callback: (value) => `${value} ms`,
        },
        title: {
          display: true,
          text: 'Response Time',
          color: '#A0AEC0',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  const colors = [
    '#0284C7',
    '#0369A1',
    '#075985',
    '#0891B2',
    '#06B6D4',
    '#22D3EE',
    '#67E8F9',
    '#A5F3FC',
  ];

  const labels = Object.keys(metrics);

  const datasets = labels.map((key, index) => ({
    label: key,
    data: [metrics[key]],
    backgroundColor: colors[index % colors.length],
    borderColor: `${colors[index % colors.length]}B3`,
    borderWidth: 1,
    borderRadius: 5,
  }));

  const data = {
    labels: ['Response Time'],
    datasets,
  };

  const labelPlugin: Plugin<'bar'> = {
    id: 'barLabels',
    afterDatasetsDraw(chart) {
      const {
        ctx,
        scales: { x },
      } = chart;

      ctx.save();
      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#A0AEC0';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      chart.data.datasets.forEach((dataset, i) => {
        if (!chart.isDatasetVisible(i)) return;
        const meta = chart.getDatasetMeta(i);
        const bar = meta.data[0];
        if (bar) {
          ctx.fillText(dataset.label || '', x.left - 40, bar.y);
        }
      });
      ctx.restore();
    },
  };

  return (
    <div style={{ height: '400px' }}>
      <Bar options={options} data={data} plugins={[labelPlugin]} />
    </div>
  );
}

export default ResponseTimeChart;
