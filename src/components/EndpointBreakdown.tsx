import React, { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import type { ArtilleryData } from "../types";
import EndpointDetailChart from "./EndpointDetailChart";
import type { ChartOptions } from "chart.js";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface EndpointMetric {
  codes: { [code: string]: number };
  errors: { [error: string]: number };
  total: number;
  timeSeries: { x: number; y: number }[];
}

const sparklineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  animation: false,
};

const getTagColor = (metric: string, type: "bg" | "text") => {
  if (metric.startsWith("2"))
    return type === "bg" ? "bg-green-500/20" : "text-green-400";
  if (metric.startsWith("3"))
    return type === "bg" ? "bg-sky-500/20" : "text-sky-400";
  if (metric.startsWith("4"))
    return type === "bg" ? "bg-yellow-500/20" : "text-yellow-400";
  if (metric.startsWith("5"))
    return type === "bg" ? "bg-orange-500/20" : "text-orange-400";
  return type === "bg" ? "bg-red-500/20" : "text-red-400";
};

const EndpointBreakdown: React.FC<{ data: ArtilleryData }> = ({ data }) => {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const endpointData = useMemo(() => {
    const endpoints: { [name: string]: EndpointMetric } = {};
    const regex = /^plugins\.metrics-by-endpoint\.(.*?)\.(codes|errors)\.(.*)$/;

    // FIX: Cast the result of Object.entries to correctly type `value` as a number.
    for (const [key, value] of Object.entries(data.aggregate.counters) as [
      string,
      number
    ][]) {
      const match = key.match(regex);
      if (match) {
        const [, endpointName, type, metric] = match;
        if (!endpoints[endpointName]) {
          endpoints[endpointName] = {
            codes: {},
            errors: {},
            total: 0,
            timeSeries: [],
          };
        }
        if (type === "codes") {
          endpoints[endpointName].codes[metric] = value;
        } else if (type === "errors") {
          endpoints[endpointName].errors[metric] = value;
        }
      }
    }

    for (const endpointName in endpoints) {
      const endpoint = endpoints[endpointName];
      const totalCodes = Object.values(endpoint.codes).reduce(
        (a, b) => a + b,
        0
      );
      const totalErrors = Object.values(endpoint.errors).reduce(
        (a, b) => a + b,
        0
      );
      endpoint.total = totalCodes + totalErrors;

      endpoint.timeSeries = data.intermediate.map((point) => {
        let countInPeriod = 0;
        for (const key in point.counters) {
          const match = key.match(regex);
          if (match && match[1] === endpointName) {
            countInPeriod += point.counters[key];
          }
        }
        return { x: parseInt(point.period), y: countInPeriod };
      });
    }

    return endpoints;
  }, [data]);

  const handleToggleExpand = (name: string) => {
    setExpandedEndpoint((prev) => (prev === name ? null : name));
  };

  if (Object.keys(endpointData).length === 0) {
    return null; // Don't render anything if no endpoint data is found
  }

  return (
    <Card className="p-0">
      <CardHeader className="p-4 sm:p-6 border-b border-gray-700">
        <CardTitle>Detalhamento por URL</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-700">
        {/* FIX: Explicitly type the arguments of the map callback to resolve the 'unknown' type for metrics. */}
        {Object.entries(endpointData).map(
          ([name, metrics]: [string, EndpointMetric]) => (
            <div key={name}>
              <div
                className="flex flex-wrap items-center justify-between gap-4 p-4 hover:bg-gray-700/50 cursor-pointer"
                onClick={() => handleToggleExpand(name)}
              >
                <div
                  className="w-full sm:w-auto sm:flex-1 font-mono text-gray-300 truncate"
                  title={name}
                >
                  {name}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* FIX: Explicitly type the arguments of the map callback to resolve the 'unknown' type for count. */}
                  {Object.entries(metrics.codes).map(
                    ([code, count]: [string, number]) => (
                      <span
                        key={code}
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getTagColor(
                          code,
                          "bg"
                        )} ${getTagColor(code, "text")}`}
                      >
                        {`HTTP ${code}: ${(
                          (count / metrics.total) *
                          100
                        ).toFixed(1)}%`}
                      </span>
                    )
                  )}
                  {/* FIX: Explicitly type the arguments of the map callback to resolve the 'unknown' type for count. */}
                  {Object.entries(metrics.errors).map(
                    ([error, count]: [string, number]) => (
                      <span
                        key={error}
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getTagColor(
                          error,
                          "bg"
                        )} ${getTagColor(error, "text")}`}
                      >
                        {`${error}: ${((count / metrics.total) * 100).toFixed(
                          1
                        )}%`}
                      </span>
                    )
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-sm text-gray-400">Total</span>
                    <p className="font-bold text-white">
                      {metrics.total.toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <div className="w-32 h-8">
                    <Line
                      options={sparklineOptions}
                      data={{
                        datasets: [
                          {
                            data: metrics.timeSeries,
                            borderColor: "#38BDF8",
                            borderWidth: 2,
                          },
                        ],
                      }}
                    />
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                      expandedEndpoint === name ? "rotate-90" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              {expandedEndpoint === name && (
                <div className="p-4 bg-gray-900/50">
                  <EndpointDetailChart
                    endpointName={name}
                    intermediateData={data.intermediate}
                  />
                </div>
              )}
            </div>
          )
        )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EndpointBreakdown;
