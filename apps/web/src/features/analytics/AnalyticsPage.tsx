import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const ATTENDANCE_DATA = [
  { month: 'May', pct: 88 },
  { month: 'Jun', pct: 90 },
  { month: 'Jul', pct: 94 },
  { month: 'Aug', pct: 96 },
];

const AVENUE_DISTRIBUTION = [
  { name: 'Club Service', count: 8, color: '#F7A81B' },
  { name: 'Community Service', count: 6, color: '#D41B2C' },
  { name: 'Professional Dev', count: 4, color: '#38BDF8' },
  { name: 'International', count: 3, color: '#34D399' },
];

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-3xl font-extrabold text-white">Analytics & Performance Visualizer</h1>
        <p className="text-sm text-slate-400">Quantitative insights across member engagement, avenue distribution, and attendance trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Trend Bar Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white">Monthly Attendance Rate (%)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ATTENDANCE_DATA}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0E131F', borderColor: 'rgba(255,255,255,0.1)', color: '#FFF' }} />
                <Bar dataKey="pct" fill="#F7A81B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avenue Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white">Projects Completed by Avenue</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={AVENUE_DISTRIBUTION} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {AVENUE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0E131F', borderColor: 'rgba(255,255,255,0.1)', color: '#FFF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
