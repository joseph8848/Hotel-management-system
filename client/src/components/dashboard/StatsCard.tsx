import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendType, icon: Icon, color }) => {
  return (
    <div className="glass-card p-6 flex items-center gap-6">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`} style={{ backgroundColor: color }}>
        <Icon size={28} />
      </div>
      <div>
        <h3 className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className={`text-xs mt-1 ${
          trendType === 'up' ? 'text-success' : trendType === 'down' ? 'text-error' : 'text-white/40'
        }`}>
          {trendType === 'up' ? '↑' : trendType === 'down' ? '↓' : '•'} {trend}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
