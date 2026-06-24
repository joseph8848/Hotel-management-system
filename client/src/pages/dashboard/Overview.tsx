import React from 'react';
import { 
  Users, 
  CalendarCheck, 
  DollarSign, 
  BedDouble, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { StatsCard } from '../../components/dashboard/StatsCard';

const data = [
  { name: 'Mon', revenue: 4000, occupancy: 24 },
  { name: 'Tue', revenue: 3000, occupancy: 13 },
  { name: 'Wed', revenue: 2000, occupancy: 98 },
  { name: 'Thu', revenue: 2780, occupancy: 39 },
  { name: 'Fri', revenue: 1890, occupancy: 48 },
  { name: 'Sat', revenue: 2390, occupancy: 38 },
  { name: 'Sun', revenue: 3490, occupancy: 43 },
];

export const Overview: React.FC = () => {
  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-tight text-white mb-2">Executive Overview</h1>
          <p className="text-white/50">Welcome back, here's what's happening today at Champion Hotel.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-outline border-white/10 text-white bg-white/5">Download Report</button>
          <button className="btn btn-primary flex items-center gap-2">
            New Booking <ArrowUpRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Revenue" 
          value="$128,430" 
          trend="+12.5% from last month" 
          trendType="up" 
          icon={DollarSign} 
          color="#c19a6b" 
        />
        <StatsCard 
          title="Average Occupancy" 
          value="78%" 
          trend="-2.1% from last week" 
          trendType="down" 
          icon={BedDouble} 
          color="#1a365d" 
        />
        <StatsCard 
          title="Active Guests" 
          value="42" 
          trend="+4 check-ins today" 
          trendType="up" 
          icon={Users} 
          color="#8b7355" 
        />
        <StatsCard 
          title="Pending Bookings" 
          value="18" 
          trend="No change" 
          trendType="neutral" 
          icon={CalendarCheck} 
          color="#10b981" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display text-white uppercase tracking-tight">Revenue Analytics</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 bg-secondary rounded-full" />
              <span className="text-xs text-white/40 uppercase">Global Revenue</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c19a6b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c19a6b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: '#c19a6b' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#c19a6b" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-display text-white uppercase tracking-tight mb-8">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-secondary">
                  <Activity size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">New Booking: Suite 101</p>
                  <p className="text-xs text-white/40">2 hours ago · Guest: John Doe</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full btn btn-outline border-white/5 bg-white/5 text-white/60 text-sm mt-8 py-3">View All Logs</button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
