import React, { useMemo } from "react";
import type { IntermediateData } from "../types";

interface MetadataCardProps {
  intermediate: IntermediateData[];
  fileName: string;
}

const MetadataItem: React.FC<{
  icon: React.ReactNode;
  label: React.ReactNode;
}> = ({ icon, label }) => (
  <div className="flex items-center text-gray-400 text-sm">
    <div className="w-5 h-5 mr-3 flex-shrink-0">{icon}</div>
    <div className="truncate font-mono">{label}</div>
  </div>
);

const MetadataCard: React.FC<MetadataCardProps> = ({
  intermediate,
  fileName,
}) => {
  const metadata = useMemo(() => {
    if (!intermediate || intermediate.length === 0) {
      return { id: "", startTimeFormatted: "", duration: "" };
    }

    const firstPeriod = parseInt(intermediate[0].period);
    const lastPeriod = parseInt(intermediate[intermediate.length - 1].period);

    const startTime = new Date(firstPeriod);
    // Mimicking the format from the screenshot
    const startTimeFormatted = startTime
      .toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })
      .replace(",", "");

    const durationInSeconds = Math.round((lastPeriod - firstPeriod) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    const duration = `${minutes}m ${seconds}s`;

    const id = fileName.replace(/\.json$/, "");

    return { id, startTimeFormatted, duration };
  }, [intermediate, fileName]);

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-bold text-white mb-4">Metadados</h2>
      <div className="space-y-3">
        <MetadataItem
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          }
          label={metadata.id}
        />
        <MetadataItem
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          }
          label={metadata.startTimeFormatted}
        />
        <MetadataItem
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          label={metadata.duration}
        />
      </div>
    </div>
  );
};

export default MetadataCard;
