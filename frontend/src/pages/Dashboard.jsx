import React from 'react';
import { 
  ShoppingBag, 
  Star, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Package, 
  ArrowRight 
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8">
      {/* 1. TOP PERFORMANCE BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<ShoppingBag className="text-white" />} title="Jobs Completed" value="156" subtitle="3 this week" color="bg-runner-deep" />
        <StatCard icon={<Star className="text-yellow-400" />} title="Avg. Rating" value="4.9" subtitle="Top 5% Runner" color="bg-runner-deep" />
        <StatCard icon={<TrendingUp className="text-green-400" />} title="On-Time Rate" value="98%" subtitle="42 min avg" color="bg-runner-deep" />
        <StatCard icon={<CheckCircle2 className="text-blue-400" />} title="Level" value="Pro" subtitle="Store Expert" color="bg-runner-deep" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. EARNINGS CHART AREA (Middle Left) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500 text-sm font-medium">Earnings Snapshot</p>
                <h2 className="text-3xl font-bold text-runner-deep">R75,000</h2>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">+12.5%</span>
            </div>
            {/* Placeholder for Chart - You can integrate Recharts here later */}
            <div className="h-48 bg-gray-50 rounded-2xl flex items-end justify-between p-4 gap-2">
              {[40, 70, 45, 90, 65, 80, 95].map((height, i) => (
                <div key={i} style={{ height: `${height}%` }} className="w-full bg-runner-light rounded-t-lg opacity-80 hover:opacity-100 transition-opacity" />
              ))}
            </div>
          </div>

          {/* 3. RECENT ACTIVITY TABLE */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-runner-deep">Recent Activity</h3>
            <div className="space-y-4">
              <ActivityRow icon={<Package />} title="Grocery Fulfillment" store="Whole Foods Market" status="Completed" time="2h ago" />
              <ActivityRow icon={<ShoppingBag />} title="Pharmacy Pickup" store="Walgreens" status="Pending" time="Now" />
            </div>
          </div>
        </div>

        {/* 4. SIDEBAR CARDS (Right Side) */}
        <div className="space-y-8">
          {/* Availability Toggle */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4">Your Availability</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-medium">Accepting Requests</span>
              <div className="w-12 h-6 bg-runner-light rounded-full relative">
                <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">Working Hours: 9:00 AM - 5:00 PM</p>
          </div>

          {/* Available Requests Sneak Peek */}
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Available</h3>
              <button className="text-runner-light text-xs font-bold">View All</button>
            </div>
            <div className="p-4 bg-runner-deep rounded-2xl text-white">
              <p className="text-xs opacity-60">Electronics Pickup</p>
              <p className="font-bold">Best Buy • 2.5km</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-runner-light font-bold">R3,500</span>
                <button className="bg-runner-light text-runner-deep px-3 py-1 rounded-lg text-xs font-bold">Accept</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// HELPER COMPONENTS
const StatCard = ({ icon, title, value, subtitle, color }) => (
  <div className={`${color} p-6 rounded-[32px] text-white shadow-lg`}>
    <div className="bg-white/10 w-10 h-10 rounded-xl flex items-center justify-center mb-4">{icon}</div>
    <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{title}</p>
    <h3 className="text-2xl font-bold my-1">{value}</h3>
    <p className="text-white/40 text-[10px]">{subtitle}</p>
  </div>
);

const ActivityRow = ({ icon, title, store, status, time }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
    <div className="flex items-center gap-4">
      <div className="bg-gray-100 p-3 rounded-xl text-runner-deep">{icon}</div>
      <div>
        <p className="font-bold text-sm text-runner-deep">{title}</p>
        <p className="text-xs text-gray-400">{store}</p>
      </div>
    </div>
    <div className="text-right">
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
        {status}
      </span>
      <p className="text-[10px] text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

export default Dashboard;