import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

interface ErrorsCardProps {
  counters: { [key: string]: number };
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    const kValue = num / 1000;
    return `${parseFloat(kValue.toFixed(2))}K`;
  }
  return num.toString();
};

const ErrorsCard: React.FC<ErrorsCardProps> = ({ counters }) => {
  const errorEntries = Object.entries(counters).filter(([key]) =>
    key.startsWith("errors.")
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Errors</CardTitle>
      </CardHeader>
      <CardContent>
        {errorEntries.length > 0 ? (
          <div className="space-y-3 font-mono">
            {errorEntries.map(([key, value]: [string, number]) => (
              <div
                key={key}
                className="flex justify-between items-center text-gray-300 text-sm"
              >
                <span>{key.replace("errors.", "")}</span>
                <span className="font-semibold text-white">
                  {formatNumber(value)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24">
            <p className="text-gray-500">No errors reported.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorsCard;
