import React from 'react';
import { Heart } from 'lucide-react';
import { RunnerCard } from '../components/RunnerCard';
import { runners } from '../data/mockData';

const FavoritesPage = () => {
  const favoriteRunners = runners.slice(0, 2); // Mocking favorites

  return (
    <div className="p-4 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-8 pb-20">
      <h1 className="text-3xl font-black text-gray-900 pt-4 tracking-tight">Favorites</h1>

      {favoriteRunners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {favoriteRunners.map(runner => (
            <RunnerCard key={runner.id} runner={runner} onClick={() => {}} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
           <Heart size={40} className="mx-auto text-gray-300 mb-4" />
           <p className="text-gray-400 font-bold">No favorite runners yet.</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;