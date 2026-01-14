
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

const salesData = [
  { month: 'Jan', sales: 45000 },
  { month: 'Feb', sales: 52000 },
  { month: 'Mar', sales: 48000 },
  { month: 'Apr', sales: 61000 },
  { month: 'May', sales: 55000 },
  { month: 'Jun', sales: 67000 },
];

const categoryData = [
  { name: 'Seating', value: 45 },
  { name: 'Tables', value: 25 },
  { name: 'Lighting', value: 15 },
  { name: 'Decor', value: 15 },
];

const COLORS = ['#1c1917', '#44403c', '#78716c', '#a8a29e'];

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2 serif">Business Insights</h1>
          <p className="text-stone-500">Real-time performance metrics for FURNEXA.</p>
        </div>
        <div className="flex space-x-4 mt-6 md:mt-0">
          <div className="bg-white p-4 rounded-sm border border-stone-100 shadow-sm min-w-[150px]">
            <span className="text-xs text-stone-400 uppercase font-bold tracking-widest block mb-1">Mtd Revenue</span>
            <span className="text-2xl font-bold">$124,500</span>
          </div>
          <div className="bg-white p-4 rounded-sm border border-stone-100 shadow-sm min-w-[150px]">
            <span className="text-xs text-stone-400 uppercase font-bold tracking-widest block mb-1">Active Users</span>
            <span className="text-2xl font-bold">1,284</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend */}
        <div className="bg-white p-8 rounded-sm border border-stone-100 shadow-sm">
          <h3 className="text-lg font-bold mb-8">Revenue Growth (Last 6 Months)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="month" stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a8a29e" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1917', color: '#fff', border: 'none', borderRadius: '4px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#1c1917" strokeWidth={3} dot={{ fill: '#1c1917', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-8 rounded-sm border border-stone-100 shadow-sm">
          <h3 className="text-lg font-bold mb-8">Sales by Category</h3>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {categoryData.map((cat, idx) => (
                <div key={cat.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-sm font-medium text-stone-600">{cat.name} ({cat.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Studio Performance (Simulation) */}
        <div className="bg-white p-8 rounded-sm border border-stone-100 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold mb-8">AI Design Assistant Engagement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-l-4 border-stone-800 pl-6">
              <span className="text-stone-400 text-sm block mb-1">Conversion Rate from AI Advice</span>
              <span className="text-3xl font-bold">18.4%</span>
              <p className="text-xs text-green-600 mt-2 flex items-center font-medium">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5V5a1 1 0 011 1v5h-2a1 1 0 110-2V7.414l-4.293 4.293a1 1 0 01-1.414 0L7 8.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 9.586 14.586 6H12z" clipRule="evenodd"></path></svg>
                +2.4% this month
              </p>
            </div>
            <div className="border-l-4 border-stone-200 pl-6">
              <span className="text-stone-400 text-sm block mb-1">Average Advice Iterations</span>
              <span className="text-3xl font-bold">3.2</span>
              <p className="text-xs text-stone-400 mt-2 font-medium">Per unique session</p>
            </div>
            <div className="border-l-4 border-stone-200 pl-6">
              <span className="text-stone-400 text-sm block mb-1">Top Requested Category</span>
              <span className="text-3xl font-bold">Living Room</span>
              <p className="text-xs text-stone-400 mt-2 font-medium">62% of AI queries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
