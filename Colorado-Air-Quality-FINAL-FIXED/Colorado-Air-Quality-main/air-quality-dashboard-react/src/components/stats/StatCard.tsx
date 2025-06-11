import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => {
  return (
    <div className="stat-card">
      {icon && <div className="mb-2 text-primary-500">{icon}</div>}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatCard;
