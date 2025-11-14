import type { ArtilleryData } from "../types";
import OverviewView from "./OverviewView";
import MetricsView from "./MetricsView";
import SummaryView from "./SummaryView";
import { ChartPie, Eye, File, RefreshCcw, FileText } from "lucide-react";
import { Separator } from "./ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";

interface DashboardProps {
  data: ArtilleryData;
  fileName: string;
  onReset: () => void;
}

function Dashboard({ data, fileName, onReset }: DashboardProps) {
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
              <TabsTrigger value="summary">
                <FileText size={20} />
                Summary
              </TabsTrigger>
            </TabsList>
          </div>

          <Button variant="action" onClick={onReset}>
            <RefreshCcw />
            New Report
          </Button>
        </div>

        <Separator />

        <TabsContent value="overview">
          <OverviewView data={data} fileName={fileName} />
        </TabsContent>

        <TabsContent value="metrics">
          <MetricsView data={data} />
        </TabsContent>

        <TabsContent value="summary">
          <SummaryView data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
