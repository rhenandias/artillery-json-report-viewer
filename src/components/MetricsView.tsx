
import React from 'react';
import type { ArtilleryData } from '../types';
import MetricChart from './MetricChart';
import MetricsSidebar from './MetricsSidebar';
import { Card, CardContent } from './ui/card';

const chartConfigs = [
  {
    title: 'errors.ETIMEDOUT',
    yAxisLabel: 'Contagem',
    metrics: [{ key: 'errors.ETIMEDOUT', label: 'errors.ETIMEDOUT' }],
  },
  {
    title: 'http.codes.201',
    yAxisLabel: 'Contagem',
    metrics: [{ key: 'http.codes.201', label: 'http.codes.201' }],
  },
  {
    title: 'http.downloaded_bytes',
    yAxisLabel: 'Bytes',
    yAxisType: 'bytes',
    metrics: [{ key: 'http.downloaded_bytes', label: 'http.downloaded_bytes', isFilled: true }],
  },
  {
    title: 'http.request_rate',
    yAxisLabel: 'Req/s',
    metrics: [{ key: 'http.request_rate', label: 'http.request_rate' }],
  },
  {
    title: 'http.requests',
    yAxisLabel: 'Contagem',
    metrics: [{ key: 'http.requests', label: 'http.requests' }],
  },
  {
    title: 'http.response_time',
    yAxisLabel: 'Tempo (ms)',
    yAxisType: 'time',
    metrics: [
      { key: 'http.response_time.min', label: 'min' },
      { key: 'http.response_time.mean', label: 'mean' },
      { key: 'http.response_time.p50', label: 'p50' },
      { key: 'http.response_time.p95', label: 'p95' },
      { key: 'http.response_time.max', label: 'max' },
    ],
  },
  {
    title: 'http.response_time.2xx',
    yAxisLabel: 'Tempo (ms)',
    yAxisType: 'time',
    metrics: [
      { key: 'http.response_time.2xx.min', label: 'min' },
      { key: 'http.response_time.2xx.mean', label: 'mean' },
      { key: 'http.response_time.2xx.p50', label: 'p50' },
      { key: 'http.response_time.2xx.p95', label: 'p95' },
      { key: 'http.response_time.2xx.p99', label: 'p99' },
      { key: 'http.response_time.2xx.max', label: 'max' },
    ],
  },
  {
    title: 'http.responses',
    yAxisLabel: 'Contagem',
    metrics: [{ key: 'http.responses', label: 'http.responses' }],
  },
  {
    title: '/transaction.codes.201',
    yAxisLabel: 'Contagem',
    metrics: [{ key: 'plugins.metrics-by-endpoint./transaction.codes.201', label: 'plugins.metrics-by-endpoint./transaction.codes.201' }],
  },
  {
    title: '/transaction.errors.ETIMEDOUT',
    yAxisLabel: 'Contagem',
    metrics: [{ key: 'plugins.metrics-by-endpoint./transaction.errors.ETIMEDOUT', label: 'plugins.metrics-by-endpoint./transaction.errors.ETIMEDOUT' }],
  },
   {
    title: 'response_time./transaction',
    yAxisLabel: 'Tempo (ms)',
    yAxisType: 'time',
    metrics: [
      { key: 'plugins.metrics-by-endpoint.response_time./transaction.min', label: 'min' },
      { key: 'plugins.metrics-by-endpoint.response_time./transaction.mean', label: 'mean' },
      { key: 'plugins.metrics-by-endpoint.response_time./transaction.p50', label: 'p50' },
      { key: 'plugins.metrics-by-endpoint.response_time./transaction.p95', label: 'p95' },
      { key: 'plugins.metrics-by-endpoint.response_time./transaction.p99', label: 'p99' },
      { key: 'plugins.metrics-by-endpoint.response_time./transaction.max', label: 'max' },
    ],
  },
  {
    title: 'vusers',
    yAxisLabel: 'Contagem',
    metrics: [
      { key: 'vusers.created', label: 'vusers.created', isFilled: true },
      { key: 'vusers.completed', label: 'vusers.completed', isFilled: true },
      { key: 'vusers.failed', label: 'vusers.failed', isFilled: true },
      // Note: vusers.active and created_by_name might not be in all reports
      { key: 'vusers.active', label: 'vusers.active', isFilled: true }, 
      { key: 'vusers.created_by_name.Load Test', label: 'vusers.created_by_name.Load Test', isFilled: true },
    ],
  },
  {
    title: 'vusers.session_length',
    yAxisLabel: 'Tempo (ms)',
    yAxisType: 'time',
    metrics: [
      { key: 'vusers.session_length.min', label: 'min' },
      { key: 'vusers.session_length.mean', label: 'mean' },
      { key: 'vusers.session_length.p50', label: 'p50' },
      { key: 'vusers.session_length.p95', label: 'p95' },
      { key: 'vusers.session_length.p99', label: 'p99' },
      { key: 'vusers.session_length.max', label: 'max' },
    ],
  },
];

const MetricsView: React.FC<{ data: ArtilleryData }> = ({ data }) => {
    const sanitizedTitle = (title: string) => title.replace(/[^a-zA-Z0-9-]/g, '-');
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-[2fr_1fr] gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chartConfigs.map(config => (
                    <Card key={config.title} id={`chart-${sanitizedTitle(config.title)}`}>
                        <CardContent>
                            <MetricChart
                                title={config.title}
                                metrics={config.metrics}
                                yAxisLabel={config.yAxisLabel}
                                yAxisType={config.yAxisType as any}
                                intermediateData={data.intermediate}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="space-y-6">
                 <MetricsSidebar chartConfigs={chartConfigs} intermediateData={data.intermediate} />
            </div>
        </div>
    );
};

export default MetricsView;