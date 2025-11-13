import type { ArtilleryData } from "../types";
import StatCard from "./StatCard";
import TimeSeriesChart from "./TimeSeriesChart";
import ResponseTimeChart from "./ResponseTimeChart";
import HttpCodesChart from "./HttpCodesChart";
import ChartBuilder from "./ChartBuilder";
import EndpointBreakdown from "./EndpointBreakdown";
import ErrorsCard from "./ErrorsCard";
import MetadataCard from "./MetadataCard";
import MetricsView from "./MetricsView";
import { ChartPie, Eye, File, RefreshCcw } from "lucide-react";
import { Separator } from "./ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";

interface DashboardProps {
  data: ArtilleryData;
  fileName: string;
  onReset: () => void;
}

function Dashboard({ data, fileName, onReset }: DashboardProps) {
  const { aggregate, intermediate } = data;

  const vusersCreated = aggregate.counters["vusers.created"] || 0;
  const vusersCompleted = aggregate.counters["vusers.completed"] || 0;
  const vusersFailed = aggregate.counters["vusers.failed"] || 0;
  const avgReqs = aggregate.rates["http.request_rate"] || 0;

  const peakReqs =
    intermediate.length > 0
      ? Math.max(...intermediate.map((i) => i.rates["http.request_rate"] || 0))
      : 0;

  const completionRate =
    vusersCreated > 0 ? (vusersCompleted / vusersCreated) * 100 : 0;
  const failureRate =
    vusersCreated > 0 ? (vusersFailed / vusersCreated) * 100 : 0;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white font-semibold bg-gray-800 px-3 py-2 rounded-lg">
              <File className="text-green-400" size={20} />
              <span>{fileName}</span>
            </div>

            <Separator orientation="vertical" />

            <TabsList>
              <TabsTrigger value="overview">
                <Eye size={20} />
                Overview
              </TabsTrigger>
              <TabsTrigger value="metrics">
                <ChartPie size={20} />
                Metrics
              </TabsTrigger>
            </TabsList>
          </div>

          <Button variant="action" onClick={onReset}>
            <RefreshCcw />
            Novo Relatório
          </Button>
        </div>

        <Separator />

        <TabsContent value="overview">
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard
                title="VUsers Criados"
                value={vusersCreated.toLocaleString("pt-BR")}
              />
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg col-span-1">
                <h3 className="text-gray-400 text-sm font-semibold uppercase">
                  Conclusão
                </h3>
                <p className="text-2xl text-green-400 font-bold">
                  {vusersCompleted.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-green-400">
                  {completionRate.toFixed(2)}%
                </p>
                <p className="text-2xl text-red-400 font-bold mt-2">
                  {vusersFailed.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-red-400">
                  {failureRate.toFixed(2)}%
                </p>
              </div>
              <StatCard title="Média de Req/s" value={avgReqs.toFixed(1)} />
              <StatCard title="Pico de Req/s" value={peakReqs.toFixed(1)} />
              <StatCard
                title="Total Requisições"
                value={(
                  aggregate.counters["http.requests"] || 0
                ).toLocaleString("pt-BR")}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ErrorsCard counters={aggregate.counters} />
              </div>
              <div>
                <MetadataCard intermediate={intermediate} fileName={fileName} />
              </div>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4">
                Métricas ao Longo do Tempo
              </h2>
              <TimeSeriesChart intermediateData={intermediate} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">
                  Performance HTTP
                </h2>
                <ResponseTimeChart
                  summary={aggregate.summaries["http.response_time"]}
                />
              </div>
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center justify-center">
                <h2 className="text-xl font-bold text-white mb-4">
                  Distribuição de Respostas
                </h2>
                <HttpCodesChart counters={aggregate.counters} />
              </div>
            </div>

            <EndpointBreakdown data={data} />

            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
              <ChartBuilder data={data} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="animate-fadeIn">
            <MetricsView data={data} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
