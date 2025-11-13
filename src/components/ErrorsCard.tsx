import React from "react";

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
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg h-full">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-white mr-2">Erros</h2>
      </div>
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
          <p className="text-gray-500">Nenhum erro reportado.</p>
        </div>
      )}
    </div>
  );
};

export default ErrorsCard;
