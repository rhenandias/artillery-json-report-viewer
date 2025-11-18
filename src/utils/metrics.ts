import type { IntermediateData, Summary } from '../types';

// Helper to extract metric values from an intermediate data point
export const getMetricValue = (
  item: IntermediateData,
  key: string,
): number | null => {
  // Check for summary metric first (e.g., http.response_time.p95)
  const parts = key.split('.');
  if (parts.length > 1) {
    const subKey = parts.pop() as keyof Summary;
    const summaryKey = parts.join('.');
    if (
      item.summaries[summaryKey] &&
      typeof item.summaries[summaryKey]?.[subKey] !== 'undefined'
    ) {
      return item.summaries[summaryKey]?.[subKey] ?? null;
    }
  }

  // Check counters (e.g., http.requests)
  if (typeof item.counters[key] !== 'undefined') {
    return item.counters[key];
  }

  // Check rates (e.g., http.request_rate)
  if (typeof item.rates[key] !== 'undefined') {
    return item.rates[key];
  }

  return null;
};
