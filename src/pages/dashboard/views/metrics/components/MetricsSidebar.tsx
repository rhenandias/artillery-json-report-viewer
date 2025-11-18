import React, { useMemo } from 'react';
import type { ArtilleryData } from '../types';
import { getMetricValue } from '../utils/metrics';
import Sparkline from './Sparkline';

const COLORS = [
  '#f43f5e',
  '#38bdf8',
  '#22c55e',
  '#f97316',
  '#a78bfa',
  '#6366f1',
  '#ec4899',
  '#14b8a6',
  '#facc15',
  '#d946ef',
  '#e11d48',
  '#8b5cf6',
];

interface MetricsSidebarProps {
  chartConfigs: { title: string; metrics: { key: string }[] }[];
  intermediateData: ArtilleryData['intermediate'];
}

function MetricsSidebar({
  chartConfigs,
  intermediateData,
}: MetricsSidebarProps) {
  const sanitizedTitle = (title: string) =>
    title.replace(/[^a-zA-Z0-9-]/g, '-');

  const handleScrollToChart = (title: string) => {
    const chartId = `chart-${sanitizedTitle(title)}`;
    const element = document.getElementById(chartId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const groupedMetrics = useMemo(() => {
    const groups: { [category: string]: typeof chartConfigs } = {};

    chartConfigs.forEach((config) => {
      let category = 'General';
      if (config.title.startsWith('http.')) category = 'HTTP';
      else if (config.title.startsWith('vusers.')) category = 'VUsers';
      else if (config.title.startsWith('errors.')) category = 'Errors';
      else if (config.title.includes('transaction'))
        category = 'Plugins › metrics-by-endpoint';

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(config);
    });
    return groups;
  }, [chartConfigs]);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-white mb-4">Metrics</h3>
      <div className="space-y-4">
        {Object.entries(groupedMetrics).map(([category, configs]) => (
          <div key={category}>
            <h4 className="font-bold text-sm text-blue-400 uppercase mb-2 tracking-wider">
              {category}
            </h4>
            <div className="space-y-1">
              {configs.map((config, index) => {
                const metricKey = config.metrics[0].key;
                const dataPoints = intermediateData.map((item) => ({
                  x: parseInt(item.period),
                  y: getMetricValue(item, metricKey),
                }));

                if (dataPoints.every((d) => d.y === null)) return null;

                return (
                  <div
                    key={config.title}
                    onClick={() => handleScrollToChart(config.title)}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors duration-200"
                  >
                    <span className="text-sm text-gray-300 truncate">
                      {config.title.replace(/.*\./, '')}
                    </span>
                    <Sparkline
                      data={dataPoints}
                      color={COLORS[index % COLORS.length]}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MetricsSidebar;
