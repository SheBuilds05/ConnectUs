import React, { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion"; 
import {  
  Phone, CheckCircle2, Copy, X, Package, MapPin, Loader2, AlertCircle, LogOut, RefreshCw 
} from "lucide-react"; 
import { useAuth } from "../context/AuthContext"; 
import { io } from "socket.io-client"; 
import { useNavigate } from "react-router-dom"; 

// Define the shape of our Runner and Order objects 
interface Runner { 
  name: string; 
  phone: string; 
  avatar: string; 
} 

interface Order { 
  id: string | number; 
  status: string; 
  product_description: string; 
  delivery_location: string; 
  created_at?: string; 
  runner?: Runner; 
} 

const UserTrackOrder = () => { 
  const { user } = useAuth(); 
  const navigate = useNavigate(); 
  const [orders, setOrders] = useState<Order[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [selectedRunner, setSelectedRunner] = useState<Runner | null>(null); 
  const [retryCount, setRetryCount] = useState(0);

  const backgroundImage = "/Background2-track.png"; 

  const handleExit = () => { 
    navigate('/user'); 
  }; 

  // Helper function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage or sessionStorage');
      return null;
    }
    return token;
  };

  // Helper function to get user ID
  const getUserId = () => {
    const userId = user?.id;
    if (!userId) {
      console.error('No user ID found in auth context');
      return null;
    }
    return userId;
  };

  const fetchMyOrders = async () => {
    const userId = getUserId();
    const token = getAuthToken();

    if (!userId || !token) {
      console.error('Missing userId or token');
      setError('Authentication required. Please log in again.');
      setLoading(false);
      
      // Redirect to login after 2 seconds if no auth
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching orders for user:', userId);
      console.log('Token exists:', !!token);
      
      const response = await fetch(
        `https://connectus-tpyp.onrender.com/api/users/${userId}/bookings`,
        { 
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      console.log('Response status:', response.status);

      if (response.status === 401) {
        // Token expired or invalid
        console.error('Token invalid or expired');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setError('Session expired. Please log in again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Could not load your bookings: ${response.status}`);
      }

      const data = await response.json();
      console.log('Orders fetched:', data);

      // Map the data correctly
      const mappedOrders = Array.isArray(data) ? data.map((order: any) => ({
        id: order.booking_id || order.id,
        status: order.status || 'CREATED',
        product_description: order.product_description || 'No description',
        delivery_location: order.delivery_location || 'No location',
        created_at: order.created_at,
        runner: order.runner ? {
          name: order.runner.name || order.runner.username || 'Unassigned',
          phone: order.runner.phone || order.runner.phone_number || 'N/A',
          avatar: order.runner.avatar || order.runner.name?.replace(/\s/g, '').toLowerCase() || 'default'
        } : null
      })) : [];

      setOrders(mappedOrders);
      
      if (mappedOrders.length === 0) {
        setError('No orders found. Create a booking to get started!');
      }
      
    } catch (err: any) {
      console.error("Fetch error:", err.message);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    setRetryCount(prev => prev + 1);
    fetchMyOrders();
  };

  useEffect(() => {
    fetchMyOrders();

    // Socket.io for real-time status changes
    const userId = getUserId();
    let socket: any = null;

    try {
      socket = io("https://connectus-tpyp.onrender.com", {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5
      });

      if (userId && socket) {
        socket.emit("join", userId);
        socket.on("orderUpdate", (update) => {
          console.log('Received order update:', update);
          setOrders(prev => prev.map(o => 
            o.id === update.bookingId ? { ...o, status: update.newStatus } : o
          ));
        });
      }
    } catch (err) {
      console.error('Socket connection error:', err);
    }

    // Refresh interval as a fallback backup (every 15 seconds instead of 10)
    const interval = setInterval(() => {
      // Only refresh if we have a valid token
      if (getAuthToken()) {
        fetchMyOrders();
      }
    }, 15000);

    return () => {
      if (socket) {
        socket.disconnect();
      }
      clearInterval(interval);
    };
  }, [user?.id, retryCount]); // Add retryCount as dependency for manual refresh

  const getTimelineSteps = (status: string, time?: string) => { 
    const statuses = ["CREATED", "PURCHASING", "IN_TRANSIT", "DELIVERED"]; 
    const currentIndex = statuses.indexOf(status); 
    const formattedTime = time  
      ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })  
      : "Pending"; 

    return [ 
      { t: "Booking Created", d: currentIndex >= 0 ? formattedTime : "Pending", active: currentIndex >= 0 }, 
      { t: "Purchasing Items", d: currentIndex >= 1 ? "In Progress" : "Pending", active: currentIndex >= 1 }, 
      { t: "On The Way", d: currentIndex >= 2 ? "In Transit" : "Pending", active: currentIndex >= 2 }, 
      { t: "Delivered", d: currentIndex >= 3 ? "Arrived" : "Pending", active: currentIndex >= 3 }, 
    ]; 
  }; 

  const copyNumber = (num: string) => { 
    navigator.clipboard.writeText(num); 
    // Optional: Add toast notification here
    alert('Phone number copied to clipboard!');
  }; 

  if (loading && orders.length === 0) { 
    return ( 
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D330E]"> 
        <Loader2 className="text-white animate-spin" size={48} /> 
        <p className="text-white/80 mt-4">Loading your orders...</p>
      </div> 
    ); 
  } 

  return ( 
    <> 
      {/* Fixed Background Layer */} 
      <div className="fixed inset-0 z-0"> 
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})` }} /> 
        <div className="absolute inset-0 bg-black/60" /> 
      </div> 

      {/* Exit Button */} 
      <button 
        onClick={handleExit} 
        className="fixed bottom-8 right-8 z-50 bg-[#0D330E] text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group border-2 border-[#A3B18A]/30 hover:border-[#A3B18A]" 
        title="Back to Home" 
      > 
        <LogOut size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" /> 
        <span className="text-sm">Exit</span> 
      </button> 

      <div className="relative z-10 min-h-screen w-full flex flex-col items-center py-8 px-4"> 
        <div className="w-full max-w-3xl space-y-6 pb-16"> 
          <header className="mb-6 text-center sm:text-left flex justify-between items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Live Tracking</h2> 
              <p className="text-white/90 font-bold text-lg"> 
                {orders.length > 0 ? `Tracking ${orders.length} active order${orders.length > 1 ? 's' : ''}` : "No active orders found"} 
              </p> 
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
              title="Refresh orders"
            >
              <RefreshCw size={20} className="text-white" />
            </button>
          </header> 

          {error && ( 
            <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-2xl flex items-center justify-between gap-3"> 
              <div className="flex items-center gap-3">
                <AlertCircle size={20} /> 
                <p className="font-bold">{error}</p>
              </div>
              {error.includes('log in again') && (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-white/20 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/30"
                >
                  Login
                </button>
              )}
              {error.includes('No orders') && (
                <button
                  onClick={() => navigate('/user/bookings')}
                  className="bg-white/20 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/30"
                >
                  Create Booking
                </button>
              )}
            </div> 
          )} 

          {orders.length === 0 && !error && (
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl text-center">
              <Package size={48} className="mx-auto text-white/60 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Orders Yet</h3>
              <p className="text-white/80 mb-4">You haven't created any bookings yet.</p>
              <button
                onClick={() => navigate('/user/bookings')}
                className="bg-[#477023] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#3a5c1d] transition-colors"
              >
                Create Your First Booking
              </button>
            </div>
          )}

          {orders.map((order) => { 
            const steps = getTimelineSteps(order.status, order.created_at); 
            const runner = order.runner || { name: "Assigning...", phone: "N/A", avatar: "default" }; 

            return ( 
              <motion.div  
                key={order.id}  
                initial={{ opacity: 0, y: 20 }}  
                animate={{ opacity: 1, y: 0 }}  
                className="space-y-4 mb-10" 
              > 
                {/* Main Order Status Card */} 
                <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-[36px] shadow-2xl"> 
                  <div className="flex justify-between items-start mb-7"> 
                    <div className="flex items-center gap-4"> 
                      <div className="bg-[#477023]/20 p-3 rounded-xl"> 
                        <Package className="text-[#0D330E]" size={24} /> 
                      </div> 
                      <div> 
                        <h2 className="text-2xl font-black text-[#0D330E]">Order #{order.id}</h2> 
                        <p className="text-[#477023] font-bold">{order.product_description}</p> 
                      </div> 
                    </div> 
                    <span className="bg-[#0D330E] text-white px-5 py-1 rounded-full text-xs font-black uppercase"> 
                      {order.status.replace("_", " ")} 
                    </span> 
                  </div> 

                  {/* Vertical Timeline */} 
                  <div className="space-y-6 ml-1"> 
                    {steps.map((s, i) => ( 
                      <div key={i} className="flex gap-5 items-start"> 
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${s.active ? "bg-[#477023] text-white" : "bg-gray-200 text-gray-400"}`}> 
                          <CheckCircle2 size={16} /> 
                        </div> 
                        <div> 
                          <p className={`font-black ${s.active ? "text-[#0D330E]" : "text-gray-400"}`}>{s.t}</p> 
                          <p className="text-sm font-bold">{s.d}</p> 
                        </div> 
                      </div> 
                    ))} 
                  </div> 
                </div> 

                {/* Assigned Runner Details Card */} 
                <div className="bg-[#0D330E]/90 p-5 rounded-[32px] text-white flex items-center justify-between"> 
                  <div className="flex items-center gap-4"> 
                    <div className="w-14 h-14 bg-white/20 rounded-full overflow-hidden border-2 border-white/10"> 
                      <img  
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${runner.avatar}`}  
                        className="w-full h-full object-cover"  
                        alt="Runner Avatar"  
                      /> 
                    </div> 
                    <div> 
                      <p className="font-black">{runner.name}</p> 
                      <p className="text-xs text-white/60 flex items-center gap-1"> 
                        <MapPin size={11} /> {order.delivery_location} 
                      </p> 
                    </div> 
                  </div> 
                  {runner.phone !== "N/A" && runner.phone !== "Unassigned" && ( 
                    <button  
                      onClick={() => setSelectedRunner(runner)}  
                      className="bg-[#477023] p-3 rounded-xl hover:bg-[#5a8d2c] transition-colors active:scale-95" 
                    > 
                      <Phone size={22} /> 
                    </button> 
                  )} 
                </div> 
              </motion.div> 
            ); 
          })} 
        </div> 
      </div> 

      {/* Runner Contact Modal */} 
      <AnimatePresence> 
        {selectedRunner && ( 
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"> 
            <motion.div  
              initial={{ opacity: 0 }}  
              animate={{ opacity: 1 }}  
              exit={{ opacity: 0 }}  
              onClick={() => setSelectedRunner(null)}  
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"  
            /> 
            <motion.div  
              initial={{ scale: 0.9, y: 20 }}  
              animate={{ scale: 1, y: 0 }}  
              exit={{ scale: 0.9, y: 20 }}  
              className="relative bg-white w-full max-w-sm rounded-[45px] p-9 shadow-2xl" 
            > 
              <button  
                onClick={() => setSelectedRunner(null)}  
                className="absolute right-7 top-7 text-gray-400 hover:text-black transition-colors" 
              > 
                <X size={26} /> 
              </button> 
               
              <div className="text-center mb-7"> 
                <h3 className="text-2xl font-black text-[#0D330E]">Contact Runner</h3> 
                <p className="font-bold text-[#477023]">{selectedRunner.name}</p> 
              </div> 

              <div className="bg-gray-100 p-5 rounded-3xl flex justify-between items-center mb-7"> 
                <span className="text-xl font-mono font-black">{selectedRunner.phone}</span> 
                <button  
                  onClick={() => copyNumber(selectedRunner.phone)}  
                  className="text-gray-500 hover:text-[#477023] transition-colors" 
                > 
                  <Copy size={22} /> 
                </button> 
              </div> 

              <a  
                href={`tel:${selectedRunner.phone}`}  
                className="block text-center py-4 bg-[#477023] text-white rounded-[22px] font-black hover:bg-[#3a5c1d] transition-transform active:scale-95" 
              > 
                Start Call Now 
              </a> 
            </motion.div> 
          </div> 
        )} 
      </AnimatePresence> 
    </> 
  ); 
}; 

export default UserTrackOrder;