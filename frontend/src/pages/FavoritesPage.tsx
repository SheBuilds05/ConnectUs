// src/pages/FavoritesPage.jsx
import React, { useState } from 'react';
import { 
  Heart, 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock,
  Search,
  Filter,
  X,
  User,
  Calendar,
  MessageCircle,
  MoreVertical,
  Trash2,
  Bell
} from 'lucide-react';
import RunnerCard from '../components/RunnerCard';
import { runners } from '../data/mockData';

const FavoritesPage = () => {
  const [favoriteRunners, setFavoriteRunners] = useState(runners.slice(0, 3)); // Mocking favorites
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'available', 'nearby'
  const [, setSelectedRunner] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [runnerToRemove, setRunnerToRemove] = useState(null);

  // Filter favorites based on search and filter criteria
  const filteredFavorites = favoriteRunners.filter(runner => {
    // Search filter
    const matchesSearch = runner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         runner.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesFilter = filterBy === 'all' ? true :
                         filterBy === 'available' ? runner.available : // You'd need to add available property
                         filterBy === 'nearby' ? runner.distance < 2 : true;
    
    return matchesSearch && matchesFilter;
  });

  const handleRemoveFavorite = (runner) => {
    setRunnerToRemove(runner);
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    setFavoriteRunners(favoriteRunners.filter(r => r.id !== runnerToRemove.id));
    setShowRemoveModal(false);
    setRunnerToRemove(null);
  };

  const cancelRemove = () => {
    setShowRemoveModal(false);
    setRunnerToRemove(null);
  };

  const handleBookRunner = (runner) => {
    setSelectedRunner(runner);
    // You can trigger your booking modal here
    console.log('Book runner:', runner);
  };

  const goToHome = () => {
    // Force navigate to home page
    window.location.href = '/'; // This will reload the app at root
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="p-4 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-8 pb-20">
        
        {/* Header with Working Back Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={goToHome}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-[#0D330E] hover:bg-gray-50 hover:border-[#2D531A] transition-all shadow-sm active:scale-95"
              title="Go back to home"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Favorites</h1>
              <p className="text-gray-500 text-sm mt-1">
                {favoriteRunners.length} {favoriteRunners.length === 1 ? 'runner' : 'runners'} saved
              </p>
            </div>
          </div>

          <button className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <Bell size={22} />
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2D531A] transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search your favorites..."
              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-[#2D531A] outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative group">
            <button className="h-full px-5 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
              <Filter size={20} />
              <span className="text-sm font-medium hidden sm:inline">Filter</span>
            </button>
            
            {/* Simple filter dropdown - you can enhance this */}
            {filterBy !== 'all' && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-[#2D531A] rounded-full"></div>
            )}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={() => setFilterBy('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterBy === 'all' 
                ? 'bg-[#2D531A] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterBy('available')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterBy === 'available' 
                ? 'bg-[#2D531A] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Available Now
          </button>
          <button 
            onClick={() => setFilterBy('nearby')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filterBy === 'nearby' 
                ? 'bg-[#2D531A] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Nearby (&lt;2km)
          </button>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map(runner => (
              <div key={runner.id} className="relative group">
                <RunnerCard 
                  runner={runner} 
                  onClick={() => handleBookRunner(runner)} 
                />
                
                {/* Remove from favorites button */}
                <button 
                  onClick={() => handleRemoveFavorite(runner)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                </button>

                {/* Quick action badges */}
                <div className="absolute bottom-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <span className="p-1.5 bg-white rounded-full shadow-md hover:bg-[#2D531A] hover:text-white transition-colors cursor-pointer">
                    <Calendar size={12} />
                  </span>
                  <span className="p-1.5 bg-white rounded-full shadow-md hover:bg-[#2D531A] hover:text-white transition-colors cursor-pointer">
                    <MessageCircle size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-200 shadow-sm">
            {searchTerm || filterBy !== 'all' ? (
              <>
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-bold text-lg mb-2">No matches found</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filter</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBy('all');
                  }}
                  className="px-6 py-3 bg-[#2D531A] text-white rounded-xl font-bold text-sm hover:bg-[#1a3a0f] transition-colors"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-bold text-lg mb-2">No favorite runners yet</p>
                <p className="text-gray-400 text-sm mb-6">Save runners you love to see them here</p>
                <button 
                  onClick={goToHome}
                  className="px-6 py-3 bg-[#2D531A] text-white rounded-xl font-bold text-sm hover:bg-[#1a3a0f] transition-colors"
                >
                  Browse runners
                </button>
              </>
            )}
          </div>
        )}

        {/* Recently Added Section - Only show if there are favorites */}
        {favoriteRunners.length > 2 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Clock size={14} />
              Recently Added
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favoriteRunners.slice(0, 2).map(runner => (
                <div key={`recent-${runner.id}`} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{runner.name}</p>
                    <p className="text-xs text-gray-500">{runner.specialties.join(' • ')}</p>
                  </div>
                  <Heart size={16} className="text-[#2D531A] fill-[#2D531A]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remove Confirmation Modal */}
        {showRemoveModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Remove from favorites?</h3>
                <p className="text-gray-500 text-sm">
                  Are you sure you want to remove {runnerToRemove?.name} from your favorites?
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={cancelRemove}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRemove}
                  className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;