
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-center sm:text-left">
      <h3 className="text-gray-400 text-sm font-semibold uppercase">{title}</h3>
      <p className="text-3xl text-white font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
