import React from 'react';
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
import type { IntermediateData } from '../types';

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
  const crosshairPlugin = {
    id: 'crosshair',
    afterDraw: (chart: ChartJS<'line'>) => {
      if (chart.tooltip?.getActiveElements().length) {
        const ctx = chart.ctx;
        const activePoint = chart.tooltip.getActiveElements()[0];
        const x = activePoint.element.x;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#A0AEC0',
          usePointStyle: true,
          pointStyle: 'rectRounded',
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0,0,0,0.8)',
        displayColors: true,
        usePointStyle: true,
        titleFont: {
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].parsed.x || '');
            return date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            });
          },
        },
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
