import React from 'react';
import { Settings, Bell, Star, Package, CheckCircle, ShoppingCart, Store, Clock } from 'lucide-react';

const RunnerProfile = () => {
  return (
    /* REMOVED p-4 md:p-8 from here to clear the space at the top */
    <div className="min-h-screen bg-runner-bg font-sans text-white">
      
      {/* Top Navigation Bar - Now flush with the top and square-edged */}
      <nav className="bg-runner-deep p-4 flex justify-between items-center shadow-lg w-full">
        <div className="flex items-center gap-2">
          <div className="bg-runner-light p-2 rounded-lg">
            <ShoppingCart size={20} />
          </div>
          <span className="font-bold tracking-wider uppercase">Runner's Profile</span>
        </div>
        <div className="flex gap-4 items-center">
          <Settings className="cursor-pointer hover:text-runner-light transition" size={20} />
          <div className="relative">
            <Bell className="cursor-pointer hover:text-runner-light transition" size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </div>
          <div className="w-8 h-8 bg-runner-light rounded-full border border-white/20 overflow-hidden">
             <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" alt="Profile" />
          </div>
        </div>
      </nav>

      {/* Main Content Area - Added padding back here so content doesn't hit the screen edges */}
      <div className="p-4 md:p-8">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Performance & Store Expertise */}
          <div className="space-y-6">
            <div className="bg-runner-deep p-6 rounded-3xl shadow-xl">
              <h3 className="text-xs uppercase tracking-widest mb-4 opacity-80">Errand Performance</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm opacity-70">Jobs Completed</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Avg. Rating</p>
                  <p className="text-2xl font-bold text-yellow-400">4.9 ★</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">On-Time Rate</p>
                  <p className="text-2xl font-bold">98%</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Avg. Delivery</p>
                  <p className="text-2xl font-bold">42 <span className="text-sm font-normal">min</span></p>
                </div>
              </div>
            </div>

            <div className="bg-runner-deep p-6 rounded-3xl shadow-xl">
              <h3 className="text-xs uppercase tracking-widest mb-4 opacity-80">Store Expertise</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="flex items-center gap-2"><Store size={14}/> Groceries</span> 
                  <span className="font-bold text-runner-light text-sm uppercase">Expert</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="flex items-center gap-2"><Store size={14}/> Hair & Beauty</span> 
                  <span className="font-bold text-runner-light text-sm uppercase">Pro</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2"><Store size={14}/> Clothes</span> 
                  <span className="font-bold text-runner-light text-sm uppercase">Expert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Profile Header & Recent Activity */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-runner-light p-6 rounded-3xl shadow-xl flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20"><CheckCircle size={80} /></div>
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 relative z-10">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" alt="Sarah J" />
              </div>
              <h2 className="text-2xl font-bold z-10">Sarah J.</h2>
              <p className="text-sm z-10 opacity-90">Verified Community Runner</p>
              <p className="mt-2 bg-runner-dark px-4 py-1 rounded-full text-xs font-mono z-10">ID: #477023 • Seattle, WA</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl text-runner-deep">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold uppercase text-xs tracking-widest">Recent Errands</h3>
                  <button className="text-xs font-bold text-runner-medium">View All</button>
               </div>
               <div className="flex items-center gap-4 p-3 hover:bg-runner-bg/30 rounded-2xl transition border-b border-runner-bg">
                  <div className="bg-runner-light p-2 rounded-lg text-white"><Package size={18}/></div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">Grocery Fulfillment</p>
                    <p className="text-xs opacity-60">Whole Foods Market • 0.5km away</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-600">Completed</p>
                    <p className="text-[10px] opacity-60">Today, 10:30 AM</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Weekly Trust & Badges */}
          <div className="space-y-6">
            <div className="bg-runner-dark p-6 rounded-3xl shadow-xl">
               <h3 className="text-xs uppercase tracking-widest mb-4 opacity-80">Fulfillment Consistency</h3>
               <div className="flex items-end justify-between h-32 gap-2">
                  {[40, 80, 50, 90, 75, 100, 60].map((height, i) => (
                    <div key={i} className="w-full bg-runner-light rounded-t-md transition-all hover:bg-white" style={{ height: `${height}%` }}></div>
                  ))}
               </div>
               <div className="mt-4 flex justify-between items-center border-t border-white/20 pt-4 text-xs">
                  <span>Weekly Target Met</span>
                  <span className="font-bold">24/25 Errands</span>
               </div>
            </div>

            <div className="bg-runner-deep p-6 rounded-3xl shadow-xl">
              <h3 className="text-xs uppercase tracking-widest mb-4 opacity-80">Reputation Badges</h3>
              <div className="flex gap-4">
                 <div className="flex-1 flex flex-col items-center bg-runner-dark p-4 rounded-2xl">
                    <Clock className="text-yellow-400 mb-2" size={24}/>
                    <span className="text-[10px] text-center font-bold">Speedy Shopper</span>
                 </div>
                 <div className="flex-1 flex flex-col items-center bg-runner-dark p-4 rounded-2xl">
                    <CheckCircle className="text-green-400 mb-2" size={24} />
                    <span className="text-[10px] text-center font-bold">100+ Deliveries</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Full-Width Bottom Section: Product Showcase */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-xl text-runner-deep">
            <h3 className="font-bold uppercase text-xs tracking-widest mb-6">Delivered Items Showcase</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['item1.png', 'item2.png', 'item3.png', 'item4.png', 'item5.png', 'item6.png', 'item7.png', 'item8.png', 'item9.png'].map((fileName, index) => (
                <div key={index} className="group relative aspect-square bg-runner-bg rounded-2xl overflow-hidden cursor-pointer">
                  <img 
                    src={`/showcase/${fileName}`} 
                    alt={`Delivered product ${index + 1}`} 
                    className="object-cover w-full h-full group-hover:scale-110 transition duration-300"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                    <p className="text-[10px] text-white font-medium">Verified Delivery</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RunnerProfile;