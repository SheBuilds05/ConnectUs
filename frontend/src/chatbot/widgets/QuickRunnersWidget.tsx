import React from 'react';
import { Star, MapPin } from 'lucide-react';

const QuickRunnersWidget = ({ params }: any) => {
  const runners = params?.payload?.runners || [];

  if (runners.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-2">
      {runners.map((runner: any) => (
        <div key={runner.runner_id} className="p-3 bg-white border rounded-xl shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2D531A] rounded-full flex items-center justify-center text-white font-bold">
            {runner.username.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{runner.username}</p>
            <div className="flex items-center text-xs text-gray-500 gap-2">
              <span className="flex items-center"><Star size={10} className="fill-yellow-400 text-yellow-400"/> 4.8</span>
              <span><MapPin size={10}/> {runner.city}</span>
            </div>
          </div>
          <button className="text-xs font-bold text-[#2D531A] bg-[#2D531A]/10 px-3 py-1 rounded-lg">View</button>
        </div>
      ))}
    </div>
  );
};

export default QuickRunnersWidget;