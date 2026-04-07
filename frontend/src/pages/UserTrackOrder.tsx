 
import React, { useState, useEffect } from "react"; 

import { motion, AnimatePresence } from "framer-motion"; 

import {  

  Phone, CheckCircle2, Copy, X, Package, MapPin, Loader2, AlertCircle, LogOut  

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

 

  const backgroundImage = "/Background2-track.png"; 

 

  const handleExit = () => { 

    navigate('/user'); // Navigate to user homepage 

  }; 

 

  const fetchMyOrders = async () => { 

    if (!user?.id) return; 

 

    try { 

      const token = localStorage.getItem("token"); 

      const res = await fetch( 

        `http://localhost:5000/api/users/${user.id}/bookings`, 

        { 

          headers: { 

            "Content-Type": "application/json", 

            "Authorization": `Bearer ${token}`, 

            "x-user-id": String(user.id) 

          }, 

        } 

      ); 

 

      if (!res.ok) throw new Error("Could not load your bookings"); 

 

      const data = await res.json(); 

 

      // Ensure data is mapped correctly for the UI 

      const mappedOrders = Array.isArray(data) ? data.map((order: any) => ({ 

        ...order, 

        id: order.booking_id || order.id,  

        // Backend now handles the 'runner' nesting, but we add a fallback just in case 

        runner: order.runner ? { 

          ...order.runner, 

          avatar: order.runner.avatar || order.runner.name.replace(/\s/g, '').toLowerCase() 

        } : null 

      })) : []; 

 

      setOrders(mappedOrders); 

      setError(null); 

    } catch (err: any) { 

      console.error("Fetch error:", err.message); 

      setError(err.message); 

    } finally { 

      setLoading(false); 

    } 

  }; 

 

  useEffect(() => { 

    fetchMyOrders(); 

 

    // Socket.io for real-time status changes 

    const socket = io("http://localhost:5000"); 

    if (user?.id) { 

      socket.emit("join", user.id); 

      socket.on("orderUpdate", (update) => { 

        setOrders(prev => prev.map(o =>  

          o.id === update.bookingId ? { ...o, status: update.newStatus } : o 

        )); 

      }); 

    } 

 

    // Refresh interval as a fallback backup 

    const interval = setInterval(fetchMyOrders, 10000); 

 

    return () => { 

      socket.disconnect(); 

      clearInterval(interval); 

    }; 

  }, [user?.id]); 

 

  const getTimelineSteps = (status: string, time?: string) => { 

    const statuses = ["CREATED", "PURCHASING", "IN_TRANSIT", "DELIVERED"]; 

    const currentIndex = statuses.indexOf(status); 

    const formattedTime = time  

      ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })  

      : "Pending"; 

 

    return [ 

      { t: "Booking Created", d: formattedTime, active: currentIndex >= 0 }, 

      { t: "Purchasing Items", d: currentIndex >= 1 ? "In Progress" : "Pending", active: currentIndex >= 1 }, 

      { t: "On The Way", d: currentIndex >= 2 ? "In Transit" : "Pending", active: currentIndex >= 2 }, 

      { t: "Delivered", d: currentIndex >= 3 ? "Arrived" : "Pending", active: currentIndex >= 3 }, 

    ]; 

  }; 

 

  const copyNumber = (num: string) => { 

    navigator.clipboard.writeText(num); 

    // You could add a 'Copied!' toast notification here 

  }; 

 

  if (loading) { 

    return ( 

      <div className="min-h-screen flex items-center justify-center bg-[#0D330E]"> 

        <Loader2 className="text-white animate-spin" size={48} /> 

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

 

      {/* Exit Button - Fixed position on the right bottom */} 

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

          <header className="mb-6 text-center sm:text-left"> 

            <h2 className="text-4xl sm:text-5xl font-black text-white">Live Tracking</h2> 

            <p className="text-white/90 font-bold text-lg"> 

              {orders.length > 0 ? `Tracking ${orders.length} active orders` : "No active orders found"} 

            </p> 

          </header> 

 

          {error && ( 

            <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-2xl flex items-center gap-3"> 

              <AlertCircle size={20} /> 

              <p className="font-bold">{error}</p> 

            </div> 

          )} 

 

          {orders.map((order) => { 

            const steps = getTimelineSteps(order.status, order.created_at); 

            const runner = order.runner || { name: "Assigning...", phone: "N/A", avatar: "initial" }; 

 

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

                  {runner.phone !== "N/A" && ( 

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