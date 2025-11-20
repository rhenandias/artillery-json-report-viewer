import { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  type ChartOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import type { ArtilleryData, Summary } from '@/types';
import {
  crosshairPlugin,
  legendConfig,
  lineTooltipConfig,
  interactionConfig,
} from '@/chartjs/plugins';
import { CardTitle } from '@/components/ui/card';
import Sparkline from '@/components/Sparkline';

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

interface ChartBuilderProps {
  data: ArtilleryData;
}

interface Metric {
  key: string;
  label: string;
  category: string;
  type: 'count' | 'time';
}

const COLORS = [
  '#38bdf8',
  '#f97316',
  '#22c55e',
  '#f43f5e',
  '#a78bfa',
  '#facc15',
  '#e11d48',
  '#14b8a6',
  '#8b5cf6',
  '#d946ef',
  '#ec4899',
  '#65a30d',
];

function ChartBuilder({ data }: ChartBuilderProps) {
  const { intermediate } = data;
  const [availableMetrics, setAvailableMetrics] = useState<Metric[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!intermediate || intermediate.length === 0) return;

    const discoveredMetrics = new Map<string, Metric>();
    const excludedPatterns = [/plugins\./, /created_by_name/];

    // Iterate over ALL intermediate points to find all possible metrics
    for (const point of intermediate) {
      // Discover counters
      for (const key in point.counters) {
        if (
          !discoveredMetrics.has(key) &&
          !excludedPatterns.some((p) => p.test(key))
        ) {
          discoveredMetrics.set(key, {
            key,
            label: key
              .replace('errors.', 'Error: ')
              .replace('http.codes.', 'HTTP '),
            category: key.startsWith('errors.')
              ? 'Errors'
              : key.startsWith('http.')
                ? 'HTTP'
                : 'VUsers',
            type: 'count',
          });
        }
      }

      // Discover rates
      for (const key in point.rates) {
        if (
          !discoveredMetrics.has(key) &&
          !excludedPatterns.some((p) => p.test(key))
        ) {
          discoveredMetrics.set(key, {
            key,
            label: key,
            category: 'Rates',
            type: 'count',
          });
        }
      }

      // Discover summaries (percentiles, etc.)
      for (const summaryKey in point.summaries) {
        const summary = point.summaries[summaryKey];
        if (summary && !excludedPatterns.some((p) => p.test(summaryKey))) {
          for (const subKey in summary) {
            if (
              typeof (summary as unknown as Record<string, unknown>)[subKey] ===
              'number'
            ) {
              const fullKey = `${summaryKey}.${subKey}`;
              if (!discoveredMetrics.has(fullKey)) {
                discoveredMetrics.set(fullKey, {
                  key: fullKey,
                  label: `${summaryKey.replace(
                    'http.response_time',
                    'Response Time',
                  )} (${subKey})`,
                  category: 'Response Time',
                  type: 'time',
                });
              }
            }
          }
        }
      }
    }

    // Sort metrics alphabetically within each category for better UX
    const sortedMetrics = Array.from(discoveredMetrics.values()).sort(
      (a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
      },
    );

    setAvailableMetrics(sortedMetrics);
  }, [intermediate]);

  const handleMetricToggle = (metricKey: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricKey)
        ? prev.filter((m) => m !== metricKey)
        : [...prev, metricKey],
    );
  };

  const chartOptions: ChartOptions<'line'> = useMemo(
    () => ({
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
          title: { display: true, text: 'Count / Rate', color: '#A0AEC0' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: '#A0AEC0' },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'Time (ms)', color: '#A0AEC0' },
          grid: { drawOnChartArea: false },
          ticks: { color: '#A0AEC0' },
        },
      },
    }),
    [],
  );

  const chartData = useMemo(() => {
    const datasets = selectedMetrics.map((metricKey, index) => {
      const metricInfo = availableMetrics.find((m) => m.key === metricKey);
      const dataPoints = intermediate.map((item) => {
        let value: number | null = null;

        if (metricInfo) {
          if (metricInfo.category === 'Response Time') {
            const parts = metricKey.split('.');
            const subKey = parts.pop() as keyof Summary;
            const summaryKey = parts.join('.');
            if (summaryKey && subKey && item.summaries[summaryKey]) {
              value = item.summaries[summaryKey]?.[subKey] ?? null;
            }
          } else if (metricInfo.category === 'Rates') {
            value = item.rates[metricKey] ?? null;
          } else {
            // Counters (VUsers, HTTP, Erros)
            value = item.counters[metricKey] ?? null;
          }
        }
        return { x: parseInt(item.period), y: value };
      });

      return {
        label: metricInfo?.label || metricKey,
        data: dataPoints.filter((d) => d.y !== null), // Filter out nulls to prevent charting issues
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: `${COLORS[index % COLORS.length]}1A`, // with alpha
        yAxisID: metricInfo?.type === 'time' ? 'y1' : 'y',
        pointRadius: 2,
        borderWidth: 2,
        pointStyle: 'rectRounded',
      };
    });

    return { datasets };
  }, [selectedMetrics, intermediate, availableMetrics]);

  const groupedMetrics = useMemo(() => {
    const groups: { [category: string]: Metric[] } = {};
    const filtered = availableMetrics.filter((m) =>
      m.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    for (const metric of filtered) {
      if (!groups[metric.category]) {
        groups[metric.category] = [];
      }
      groups[metric.category].push(metric);
    }
    return groups;
  }, [availableMetrics, searchTerm]);

  return (
    <div>
      <CardTitle className="mb-4">Chart Builder</CardTitle>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {selectedMetrics.length > 0 ? (
            <div style={{ height: '450px' }}>
              <Line
                options={chartOptions}
                data={chartData}
                plugins={[crosshairPlugin]}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-[450px] border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/50">
              <p className="text-gray-500 text-center">
                Select a metric from the list to start building your chart.
              </p>
            </div>
          )}
        </div>
        <div className="lg:col-span-1 bg-gray-900/50 p-4 rounded-lg">
          <input
            type="text"
            placeholder="Search metrics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-4 space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {/* FIX: Explicitly type the arguments of the map callback to resolve the 'unknown' type for metrics. */}
            {Object.entries(groupedMetrics).map(
              ([category, metrics]: [string, Metric[]]) => (
                <div key={category}>
                  <h4 className="font-bold text-sm text-blue-400 uppercase mb-2">
                    {category}
                  </h4>
                  {metrics.map((metric, mIndex) => {
                    const dataPoints = intermediate
                      .map((item) => {
                        let value: number | null = null;
                        if (metric.type === 'time') {
                          const parts = metric.key.split('.');
                          const subKey = parts.pop() as keyof Summary;
                          const summaryKey = parts.join('.');
                          const summariesMap =
                            item.summaries as unknown as Record<
                              string,
                              Record<string, number> | undefined
                            >;
                          value =
                            summariesMap[summaryKey]?.[subKey as string] ??
                            null;
                        } else {
                          // try rates first, then counters
                          value =
                            item.rates[metric.key] ??
                            item.counters[metric.key] ??
                            null;
                        }
                        return { x: parseInt(item.period), y: value };
                      })
                      .filter((d) => d.y !== null)
                      .sort((a, b) => a.x - b.x);

                    return (
                      <div
                        key={metric.key}
                        className="flex items-center justify-between mb-1"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={metric.key}
                            checked={selectedMetrics.includes(metric.key)}
                            onChange={() => handleMetricToggle(metric.key)}
                            className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={metric.key}
                            className="ml-2 text-sm text-gray-300 cursor-pointer max-w-40 truncate"
                          >
                            {metric.label}
                          </label>
                        </div>
                        <div className="w-16 h-6 ml-3">
                          <Sparkline
                            data={dataPoints}
                            color={COLORS[mIndex % COLORS.length]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setSelectedMetrics([])}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartBuilder;
