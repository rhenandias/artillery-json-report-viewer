
import React from 'react';

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
  const errorEntries = Object.entries(counters)
    .filter(([key]) => key.startsWith('errors.'));

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg h-full">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-white mr-2">Erros</h2>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      {errorEntries.length > 0 ? (
        <div className="space-y-3 font-mono">
          {/* FIX: Explicitly type the arguments of the map callback to resolve the 'unknown' type for value. */}
          {errorEntries.map(([key, value]: [string, number]) => (
            <div key={key} className="flex justify-between items-center text-gray-300 text-sm">
              <span>{key.replace('errors.', '')}</span>
              <span className="font-semibold text-white">{formatNumber(value)}</span>
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
