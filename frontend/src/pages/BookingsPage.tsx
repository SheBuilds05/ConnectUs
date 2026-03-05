// src/pages/BookingsPage.jsx
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  MapPin,
  ArrowLeft,
  Package,
  User,
  Star,
  Phone,
  MessageCircle,
  MoreVertical,
  AlertCircle,
  RefreshCw,
  X,
  ShoppingBag,
  Truck,
  Home,
  Award,
  CreditCard,
  Download,
  Filter
} from 'lucide-react';

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');

  const statusTabs = [
    { id: 'active', label: 'Active', count: 2 },
    { id: 'pending', label: 'Pending', count: 1 },
    { id: 'completed', label: 'Completed', count: 8 },
    { id: 'cancelled', label: 'Cancelled', count: 1 }
  ];

  // Mock bookings data
  const bookings = [
    {
      id: 1,
      type: 'Grocery',
      store: 'Woolworths',
      location: 'Sandton City',
      date: 'Today, 14:00',
      status: 'active',
      statusText: 'Runner En Route',
      statusColor: 'bg-blue-50 text-blue-600',
      runner: {
        name: 'Lindiwe M.',
        rating: 4.9,
        image: null,
        phone: '+27 82 123 4567',
        location: '1.2 km away'
      },
      items: [
        { name: 'Organic Avocados', quantity: 2, price: 'R60' },
        { name: 'Fresh Bread', quantity: 1, price: 'R25' },
        { name: 'Free-range Eggs', quantity: 1, price: 'R45' }
      ],
      total: 'R130',
      deliveryFee: 'R25',
      serviceFee: 'R35',
      platformFee: 'R10',
      grandTotal: 'R200',
      timeline: [
        { time: '13:45', status: 'Order confirmed', completed: true },
        { time: '13:50', status: 'Runner assigned', completed: true },
        { time: '14:00', status: 'Shopping started', completed: true },
        { time: '14:15', status: 'Items found', completed: true },
        { time: '14:30', status: 'Checkout', completed: false },
        { time: '15:00', status: 'Delivery', completed: false }
      ]
    },
    {
      id: 2,
      type: 'Tech',
      store: 'Game',
      location: 'Eastgate Mall',
      date: 'Today, 16:30',
      status: 'active',
      statusText: 'Shopping in Progress',
      statusColor: 'bg-purple-50 text-purple-600',
      runner: {
        name: 'Sipho K.',
        rating: 4.8,
        image: null,
        phone: '+27 83 987 6543',
        location: '2.5 km away'
      },
      items: [
        { name: 'Laptop Charger', quantity: 1, price: 'R450' },
        { name: 'HDMI Cable', quantity: 2, price: 'R120' }
      ],
      total: 'R570',
      deliveryFee: 'R30',
      serviceFee: 'R40',
      platformFee: 'R10',
      grandTotal: 'R650',
      timeline: [
        { time: '16:00', status: 'Order confirmed', completed: true },
        { time: '16:05', status: 'Runner assigned', completed: true },
        { time: '16:30', status: 'Shopping started', completed: true },
        { time: '16:45', status: 'Items found', completed: false }
      ]
    },
    {
      id: 3,
      type: 'Fashion',
      store: 'Zara',
      location: 'Sandton City',
      date: 'Tomorrow, 10:00',
      status: 'pending',
      statusText: 'Awaiting Runner',
      statusColor: 'bg-yellow-50 text-yellow-600',
      runner: null,
      items: [
        { name: 'Summer Dress', quantity: 1, price: 'R899' }
      ],
      total: 'R899',
      deliveryFee: 'R25',
      serviceFee: 'R45',
      platformFee: 'R10',
      grandTotal: 'R979',
      timeline: [
        { time: 'Today, 09:30', status: 'Order placed', completed: true },
        { time: 'Tomorrow, 10:00', status: 'Scheduled shopping', completed: false }
      ]
    },
    {
      id: 4,
      type: 'Grocery',
      store: 'Checkers',
      location: 'Greenstone',
      date: 'Yesterday, 11:00',
      status: 'completed',
      statusText: 'Delivered',
      statusColor: 'bg-green-50 text-green-600',
      runner: {
        name: 'Thandi N.',
        rating: 5.0,
        image: null
      },
      items: [
        { name: 'Fresh Produce', quantity: 3, price: 'R120' },
        { name: 'Dairy', quantity: 2, price: 'R85' }
      ],
      total: 'R205',
      deliveryFee: 'R25',
      serviceFee: 'R35',
      platformFee: 'R10',
      grandTotal: 'R275',
      timeline: [
        { time: 'Yesterday, 10:00', status: 'Order confirmed', completed: true },
        { time: 'Yesterday, 10:15', status: 'Runner assigned', completed: true },
        { time: 'Yesterday, 11:00', status: 'Shopping started', completed: true },
        { time: 'Yesterday, 11:30', status: 'Items found', completed: true },
        { time: 'Yesterday, 12:00', status: 'Checkout', completed: true },
        { time: 'Yesterday, 12:30', status: 'Delivered', completed: true }
      ]
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  }).filter(booking => {
    if (dateFilter === 'all') return true;
    if (dateFilter === 'today') return booking.date.includes('Today');
    if (dateFilter === 'tomorrow') return booking.date.includes('Tomorrow');
    if (dateFilter === 'week') return true; // Would need proper date logic
    return true;
  });

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = () => {
    if (!cancelReason) {
      alert('Please select a cancellation reason');
      return;
    }
    console.log('Cancelling booking:', selectedBooking?.id, 'Reason:', cancelReason);
    setShowCancelModal(false);
    setCancelReason('');
    // In real app, you'd call an API here
    alert('Booking cancelled successfully');
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <Clock size={14} />;
      case 'pending': return <AlertCircle size={14} />;
      case 'completed': return <CheckCircle2 size={14} />;
      case 'cancelled': return <X size={14} />;
      default: return null;
    }
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
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Bookings</h1>
              <p className="text-gray-500 text-sm mt-1">
                {bookings.filter(b => b.status === 'active').length} active, {bookings.filter(b => b.status === 'pending').length} pending
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Filter size={20} />
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Filter Dropdown */}
        {showFilter && (
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Filter by Date</h4>
              <button onClick={() => setShowFilter(false)}>
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'today', 'tomorrow', 'this week'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDateFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    dateFilter === filter
                      ? 'bg-[#2D531A] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all
                flex items-center justify-center gap-2
                ${activeTab === tab.id 
                  ? 'bg-[#2D531A] text-white shadow-md' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              {tab.label}
              <span className={`
                text-[9px] px-1.5 py-0.5 rounded-full
                ${activeTab === tab.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center shrink-0
                    ${booking.type === 'Grocery' ? 'bg-green-50' : 
                      booking.type === 'Tech' ? 'bg-blue-50' : 
                      'bg-purple-50'}
                  `}>
                    {booking.type === 'Grocery' ? (
                      <ShoppingBag size={28} className="text-[#2D531A]" />
                    ) : booking.type === 'Tech' ? (
                      <Package size={28} className="text-blue-600" />
                    ) : (
                      <Award size={28} className="text-purple-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black text-lg text-gray-900">
                          {booking.type} - {booking.store}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-gray-400" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            {booking.location}
                          </span>
                          {booking.runner && (
                            <span className="flex items-center gap-1">
                              <User size={12} className="text-gray-400" />
                              {booking.runner.name}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Badge - Uses statusColor from data */}
                      <div className={`px-4 py-2 rounded-xl ${booking.statusColor} flex items-center gap-1`}>
                        {getStatusIcon(booking.status)}
                        <span className="font-black text-[10px] uppercase tracking-widest">
                          {booking.statusText}
                        </span>
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div className="flex flex-wrap gap-2">
                      {booking.items.slice(0, 2).map((item, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          {item.name} x{item.quantity}
                        </span>
                      ))}
                      {booking.items.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          +{booking.items.length - 2} more
                        </span>
                      )}
                    </div>

                    {/* Runner Info (if assigned) */}
                    {booking.runner && (
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                            <User size={12} className="text-gray-400" />
                          </div>
                          <span className="text-xs font-medium">{booking.runner.name}</span>
                          <span className="flex items-center gap-1 text-xs text-yellow-500">
                            <Star size={10} className="fill-yellow-500" />
                            {booking.runner.rating}
                          </span>
                        </div>
                        {booking.runner.phone && (
                          <button className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <Phone size={12} className="text-gray-600" />
                          </button>
                        )}
                        <button className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                          <MessageCircle size={12} className="text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {booking.status === 'pending' && (
                      <button 
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowCancelModal(true);
                        }}
                        className="p-3 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
                      >
                        <X size={20} className="text-red-500" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleViewDetails(booking)}
                      className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-[40px] border-2 border-dashed border-gray-200">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold text-lg mb-2">No bookings found</p>
              <p className="text-gray-400 text-sm mb-6">
                {activeTab === 'all' 
                  ? "You haven't made any bookings yet" 
                  : `No ${activeTab} bookings at the moment`}
              </p>
              <button 
                onClick={goToHome}
                className="px-6 py-3 bg-[#2D531A] text-white rounded-xl font-bold text-sm hover:bg-[#1a3a0f] transition-colors"
              >
                Browse Runners
              </button>
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900">Booking Details</h3>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status Timeline */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-4">Timeline</h4>
                  <div className="space-y-4">
                    {selectedBooking.timeline.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="relative">
                          <div className={`w-3 h-3 rounded-full mt-1 ${
                            item.completed ? 'bg-[#2D531A]' : 'bg-gray-300'
                          }`} />
                          {idx < selectedBooking.timeline.length - 1 && (
                            <div className={`absolute top-4 left-1.5 w-0.5 h-12 -translate-x-1/2 ${
                              selectedBooking.timeline[idx + 1].completed ? 'bg-[#2D531A]/30' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className={`text-sm font-bold ${
                            item.completed ? 'text-gray-900' : 'text-gray-400'
                          }`}>{item.status}</p>
                          <p className="text-xs text-gray-400">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Items</h4>
                  <div className="space-y-2">
                    {selectedBooking.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-xs text-gray-400">x{item.quantity}</span>
                        </div>
                        <span className="text-sm font-bold">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Cost Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-bold">{selectedBooking.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-bold">{selectedBooking.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-bold">{selectedBooking.serviceFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform Fee</span>
                      <span className="font-bold">{selectedBooking.platformFee}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-black">
                      <span>Total</span>
                      <span className="text-[#2D531A]">{selectedBooking.grandTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedBooking.status === 'active' && (
                    <>
                      <button className="flex-1 px-6 py-4 bg-[#2D531A] text-white rounded-xl font-bold hover:bg-[#1a3a0f] transition-colors">
                        Track Live
                      </button>
                      <button className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                        Contact Runner
                      </button>
                    </>
                  )}
                  {selectedBooking.status === 'completed' && (
                    <>
                      <button className="flex-1 px-6 py-4 bg-[#2D531A] text-white rounded-xl font-bold hover:bg-[#1a3a0f] transition-colors">
                        Rate Runner
                      </button>
                      <button className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                        Rebook
                      </button>
                    </>
                  )}
                  {selectedBooking.status === 'pending' && (
                    <button 
                      onClick={() => {
                        setShowDetailsModal(false);
                        setShowCancelModal(true);
                      }}
                      className="w-full px-6 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                  <button className="p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                    <Download size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Booking Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[40px] max-w-md w-full p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Cancel Booking</h3>
                <p className="text-gray-500 text-sm">
                  Are you sure you want to cancel your {selectedBooking.type} booking?
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Reason for cancellation</h4>
                {['Changed my mind', 'Found another runner', 'No longer needed', 'Runner unavailable', 'Other'].map((reason) => (
                  <label key={reason} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-4 h-4 text-[#2D531A]"
                    />
                    <span className="text-sm font-medium">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleCancelBooking}
                  className="flex-1 px-6 py-4 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;