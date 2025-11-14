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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "./ui/card";

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
            New Report
          </Button>
        </div>

        <Separator />

        <TabsContent value="overview" className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard
              title="VUsers Created"
              value={vusersCreated.toLocaleString("pt-BR")}
            />
            <Card className="col-span-1">
              <CardDescription>Completion</CardDescription>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-2xl text-green-400 font-bold">
                      {vusersCompleted.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm text-green-400">
                      {completionRate.toFixed(2)}%
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl text-red-400 font-bold">
                      {vusersFailed.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm text-red-400">
                      {failureRate.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <StatCard title="Average Req/s" value={avgReqs.toFixed(1)} />
            <StatCard title="Peak Req/s" value={peakReqs.toFixed(1)} />
            <StatCard
              title="Total Requests"
              value={(aggregate.counters["http.requests"] || 0).toLocaleString(
                "pt-BR"
              )}
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

          <Card>
            <CardHeader>
              <CardTitle>Load Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart intermediateData={intermediate} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>HTTP Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponseTimeChart
                  summary={aggregate.summaries["http.response_time"]}
                />
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center justify-center">
              <CardHeader>
                <CardTitle>Requests Breakdown by URL</CardTitle>
              </CardHeader>
              <CardContent>
                <HttpCodesChart counters={aggregate.counters} />
              </CardContent>
            </Card>
          </div>

          <EndpointBreakdown data={data} />

          <Card>
            <CardContent>
              <ChartBuilder data={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="animate-fadeIn">
          <MetricsView data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
