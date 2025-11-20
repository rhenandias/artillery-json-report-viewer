import { Line } from 'react-chartjs-2';
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
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import type { IntermediateData } from '@/types';
import {
  crosshairPlugin,
  legendConfig,
  lineTooltipConfig,
  interactionConfig,
} from '@/chartjs/plugins';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
);

interface TimeSeriesChartProps {
  intermediateData: IntermediateData[];
}

function TimeSeriesChart({ intermediateData }: TimeSeriesChartProps) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      ...interactionConfig,
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        ...legendConfig,
      },
      tooltip: {
        ...lineTooltipConfig,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'T',
          unit: 'second',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#A0AEC0',
          maxTicksLimit: 15,
          autoSkip: true,
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'VUsers',
          color: '#A0AEC0',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#A0AEC0',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Response Time (ms)',
          color: '#A0AEC0',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#A0AEC0',
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Request Rate (req/s)',
          color: '#A0AEC0',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#A0AEC0',
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        label: 'Request Rate (http.request_rate)',
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.rates['http.request_rate'] || 0,
        })),
        borderColor: '#F97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        yAxisID: 'y2',
        fill: true,
        pointHoverRadius: 5,
        pointStyle: 'rectRounded',
      },
      {
        label: 'Response Time p95 (ms)',
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.summaries['http.response_time']?.p95 || null,
        })),
        borderColor: '#38BDF8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        yAxisID: 'y1',
        fill: true,
        pointHoverRadius: 5,
        pointStyle: 'rectRounded',
      },
      {
        label: 'VUsers Created',
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.counters['vusers.created'] || 0,
        })),
        borderColor: '#A78BFA',
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
        yAxisID: 'y',
        fill: false,
        pointHoverRadius: 5,
        pointStyle: 'rectRounded',
      },
      {
        label: 'VUsers Failed',
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.counters['vusers.failed'] || 0,
        })),
        borderColor: '#F43F5E',
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        yAxisID: 'y',
        fill: false,
        pointHoverRadius: 5,
        pointStyle: 'rectRounded',
      },
      {
        label: 'VUsers Completed',
        data: intermediateData.map((item) => ({
          x: parseInt(item.period),
          y: item.counters['vusers.completed'] || 0,
        })),
        borderColor: '#22C55E',
        yAxisID: 'y',
        fill: false,
        pointHoverRadius: 5,
        pointStyle: 'rectRounded',
      },
    ],
  };

  return (
    <div style={{ height: '450px' }}>
      <Line options={options} data={data} plugins={[crosshairPlugin]} />
    </div>
  );
}

export default TimeSeriesChart;
