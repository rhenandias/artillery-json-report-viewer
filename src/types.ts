export interface Summary {
  min: number;
  max: number;
  count: number;
  mean: number;
  median: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
  p999: number;
}

export interface AggregateData {
  counters: { [key: string]: number };
  rates: { [key: string]: number };
  summaries: { [key: string]: Summary };
}

export interface IntermediateData {
  counters: { [key: string]: number };
  rates: { [key: string]: number };
  summaries: { [key: string]: Summary };
  period: string;
}

export interface ArtilleryData {
  aggregate: AggregateData;
  intermediate: IntermediateData[];
}
