import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import type { IntermediateData } from '@/types';
import {
  crosshairPlugin,
  legendConfig,
  lineTooltipConfig,
  interactionConfig,
} from '@/chartjs/plugins';

interface EndpointDetailChartProps {
  endpointName: string;
  intermediateData: IntermediateData[];
}

function EndpointDetailChart({
  endpointName,
  intermediateData,
}: EndpointDetailChartProps) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      ...interactionConfig,
    },
    plugins: {
      legend: {
        ...legendConfig,
      },
      tooltip: {
        ...lineTooltipConfig,
      },
      title: {
        display: true,
        text: `Response Times for ${endpointName} (ms)`,
        color: '#FFFFFF',
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: { tooltipFormat: 'T', unit: 'second' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#A0AEC0', maxTicksLimit: 15 },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: { display: true, text: 'Time (ms)', color: '#A0AEC0' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#A0AEC0' },
      },
    },
  };

  const responseTimeKey = `plugins.metrics-by-endpoint.response_time.${endpointName}`;

  const percentiles: (keyof NonNullable<
    IntermediateData['summaries'][string]
  >)[] = ['min', 'mean', 'p50', 'p75', 'p95', 'p99', 'max'];

  const colors = {
    min: '#A5F3FC',
    mean: '#67E8F9',
    p50: '#22D3EE',
    p75: '#06B6D4',
    p95: '#0891B2',
    p99: '#0369A1',
    max: '#0284C7',
  };

  const data = {
    datasets: percentiles.map((p) => ({
      label: String(p === 'mean' ? 'mean' : p),
      data: intermediateData.map((item) => ({
        x: parseInt(item.period),
        y: item.summaries[responseTimeKey]?.[p] ?? null,
      })),
      borderColor: colors[p as keyof typeof colors] || '#FFFFFF',
      backgroundColor: `${colors[p as keyof typeof colors] || '#FFFFFF'}1A`,
      yAxisID: 'y',
      borderDash: p === 'mean' || p === 'p50' ? [5, 5] : [],
      pointHoverRadius: 5,
      pointStyle: 'rectRounded',
    })),
  };

  return (
    <div style={{ height: '350px' }}>
      <Line options={options} data={data} plugins={[crosshairPlugin]} />
    </div>
  );
}

export default EndpointDetailChart;
