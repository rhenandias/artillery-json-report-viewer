import React, { useMemo } from 'react';
import type { IntermediateData } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Calendar, Clock, Code } from 'lucide-react';

interface MetadataCardProps {
  intermediate: IntermediateData[];
  fileName: string;
}

interface MetadataItemProps {
  icon: React.ReactNode;
  label: React.ReactNode;
}

function MetadataItem({ icon, label }: MetadataItemProps) {
  return (
    <div className="flex items-center text-gray-400 text-sm">
      <div className="w-5 h-5 mr-3 shrink-0">{icon}</div>
      <div className="truncate font-mono">{label}</div>
    </div>
  );
}

function MetadataCard({ intermediate, fileName }: MetadataCardProps) {
  const metadata = useMemo(() => {
    if (!intermediate || intermediate.length === 0) {
      return { id: '', startTimeFormatted: '', duration: '' };
    }

    const firstPeriod = parseInt(intermediate[0].period);
    const lastPeriod = parseInt(intermediate[intermediate.length - 1].period);

    const startTime = new Date(firstPeriod);
    // Mimicking the format from the screenshot
    const startTimeFormatted = startTime
      .toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      })
      .replace(',', '');

    const durationInSeconds = Math.round((lastPeriod - firstPeriod) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    const duration = `${minutes}m ${seconds}s`;

    const id = fileName.replace(/\.json$/, '');

    return { id, startTimeFormatted, duration };
  }, [intermediate, fileName]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <MetadataItem icon={<Code size={20} />} label={metadata.id} />
          <MetadataItem
            icon={<Calendar size={20} />}
            label={metadata.startTimeFormatted}
          />
          <MetadataItem icon={<Clock size={20} />} label={metadata.duration} />
        </div>
      </CardContent>
    </Card>
  );
}

export default MetadataCard;
