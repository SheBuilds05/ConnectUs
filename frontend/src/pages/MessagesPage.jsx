// src/pages/MessagesPage.jsx
import React, { useState } from 'react';
import { 
  MessageCircle, 
  Search, 
  User, 
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Clock,
  Star,
  MapPin,
  Package,
  Calendar,
  X
} from 'lucide-react';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Mock data for chats
  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Lindiwe M.',
      avatar: null,
      lastMessage: "I've picked up the items!",
      lastMessageTime: '12:45 PM',
      unread: 2,
      online: true,
      typing: false,
      status: 'active',
      messages: [
        { id: 1, sender: 'them', text: 'Hi! I can help you with your grocery shopping today.', time: '11:30 AM', status: 'read' },
        { id: 2, sender: 'me', text: 'That would be great! I need some fresh vegetables.', time: '11:32 AM', status: 'read' },
        { id: 3, sender: 'them', text: 'No problem! What would you like me to get?', time: '11:33 AM', status: 'read' },
        { id: 4, sender: 'me', text: 'Tomatoes, onions, and some avocados please.', time: '11:35 AM', status: 'read' },
        { id: 5, sender: 'them', text: 'Perfect! I know the best spot for fresh avocados.', time: '11:36 AM', status: 'read' },
        { id: 6, sender: 'them', text: "I've picked up the items!", time: '12:45 PM', status: 'delivered' },
      ]
    },
    {
      id: 2,
      name: 'Sipho K.',
      avatar: null,
      lastMessage: 'Thanks for the delivery!',
      lastMessageTime: 'Yesterday',
      unread: 0,
      online: false,
      typing: false,
      status: 'inactive',
      messages: [
        { id: 1, sender: 'them', text: 'Your laptop has been delivered.', time: 'Yesterday, 2:30 PM', status: 'read' },
        { id: 2, sender: 'me', text: 'Thanks for the delivery!', time: 'Yesterday, 3:00 PM', status: 'read' },
      ]
    },
    {
      id: 3,
      name: 'Thandi N.',
      avatar: null,
      lastMessage: 'I found the dress you wanted',
      lastMessageTime: '2 days ago',
      unread: 0,
      online: false,
      typing: false,
      status: 'completed',
      messages: [
        { id: 1, sender: 'them', text: 'I found the dress you wanted at the mall.', time: '2 days ago, 1:15 PM', status: 'read' },
      ]
    },
  ]);

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    // In a real app, you'd send this to your backend
    console.log('Sending message:', messageText);
    
    // Add to current chat messages (mock)
    if (selectedChat) {
      // Create a copy of the selected chat with new message
      const updatedChat = {
        ...selectedChat,
        messages: [
          ...selectedChat.messages,
          {
            id: selectedChat.messages.length + 1,
            sender: 'me',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent'
          }
        ],
        lastMessage: messageText,
        lastMessageTime: 'Just now'
      };
      
      // Update the selected chat
      setSelectedChat(updatedChat);
      
      // Update the chat in the chats array
      setChats(chats.map(chat => 
        chat.id === selectedChat.id ? updatedChat : chat
      ));
    }
    
    setMessageText('');
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowMobileChat(true);
    
    // Mark as read - create a copy with unread set to 0
    if (chat.unread > 0) {
      const updatedChats = chats.map(c => 
        c.id === chat.id ? { ...c, unread: 0 } : c
      );
      setChats(updatedChats);
      
      // Also update selected chat if needed
      setSelectedChat({ ...chat, unread: 0 });
    }
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  const getMessageStatusIcon = (status) => {
    switch(status) {
      case 'sent':
        return <Check size={14} className="text-gray-400" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-gray-400" />;
      case 'read':
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  const formatMessageTime = (timeStr) => {
    // Simple formatting - you'd want to use a library like date-fns in production
    return timeStr;
  };

  const goToHome = () => {
    // Force navigate to home page
    window.location.href = '/'; // This will reload the app at root
  };

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      {/* Header */}
      <div className="p-4 px-6 md:px-12 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={goToHome}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-[#0D330E] hover:bg-gray-50 hover:border-[#2D531A] transition-all shadow-sm active:scale-95"
              title="Go back to home"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Messages</h1>
              <p className="text-gray-500 text-sm mt-1">
                {chats.filter(c => c.unread > 0).length} unread conversations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 p-4 px-6 md:px-12 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="h-full bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* Chat List - Left Panel */}
          <div className={`
            w-full md:w-80 border-r border-gray-50 flex flex-col
            ${showMobileChat ? 'hidden md:flex' : 'flex'}
          `}>
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#2D531A]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    onClick={() => handleChatSelect(chat)}
                    className={`
                      p-4 rounded-3xl flex gap-3 cursor-pointer transition-all
                      ${selectedChat?.id === chat.id ? 'bg-green-50 border border-green-100' : 'hover:bg-gray-50'}
                    `}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl shadow-sm flex items-center justify-center">
                        <User size={20} className="text-gray-400" />
                      </div>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {chat.typing ? (
                          <span className="text-[#2D531A]">Typing...</span>
                        ) : (
                          chat.lastMessage
                        )}
                      </p>
                      {chat.unread > 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#2D531A] text-white text-[9px] font-bold rounded-full">
                          {chat.unread} new
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Search size={24} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">No chats found</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="p-4 border-t border-gray-50">
              <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-xs">
                <div className="text-center">
                  <span className="block font-bold text-gray-700">{chats.length}</span>
                  <span className="text-gray-400">Total</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-gray-700">{chats.filter(c => c.online).length}</span>
                  <span className="text-gray-400">Online</span>
                </div>
                <div className="text-center">
                  <span className="block font-bold text-gray-700">{chats.filter(c => c.unread > 0).length}</span>
                  <span className="text-gray-400">Unread</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area - Right Panel */}
          <div className={`
            flex-1 flex flex-col bg-white
            ${!showMobileChat ? 'hidden md:flex' : 'flex'}
          `}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Mobile back button */}
                    <button 
                      onClick={handleBackToList}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-xl"
                    >
                      <ArrowLeft size={20} />
                    </button>

                    {/* Runner Info */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl shadow-sm flex items-center justify-center">
                        <User size={20} className="text-gray-400" />
                      </div>
                      {selectedChat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedChat.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">4.9</span>
                        </div>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={10} />
                          1.2 km away
                        </span>
                        {selectedChat.online ? (
                          <span className="text-xs text-green-500 flex items-center gap-1 ml-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Online
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 flex items-center gap-1 ml-2">
                            <Clock size={10} />
                            Last seen yesterday
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                      <Phone size={18} className="text-gray-600" />
                    </button>
                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                      <Video size={18} className="text-gray-600" />
                    </button>
                    <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedChat.messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-end gap-2 max-w-[70%]">
                        {msg.sender === 'them' && (
                          <div className="w-6 h-6 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                            <User size={12} className="text-gray-400" />
                          </div>
                        )}
                        
                        <div
                          className={`
                            px-4 py-3 rounded-2xl text-sm
                            ${msg.sender === 'me' 
                              ? 'bg-[#2D531A] text-white rounded-br-none' 
                              : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }
                          `}
                        >
                          <p className="whitespace-pre-wrap wrap-break-word">{msg.text}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                            msg.sender === 'me' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            <span>{formatMessageTime(msg.time)}</span>
                            {msg.sender === 'me' && getMessageStatusIcon(msg.status)}
                          </div>
                        </div>

                        {msg.sender === 'me' && (
                          <div className="w-6 h-6 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                            <User size={12} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-50">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 bg-gray-50 rounded-2xl p-2">
                      {/* Attachment buttons */}
                      <div className="flex items-center gap-2 px-2 pb-2">
                        <button className="p-2 hover:bg-gray-200 rounded-xl transition-colors">
                          <Paperclip size={18} className="text-gray-500" />
                        </button>
                        <button 
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                          <Smile size={18} className="text-gray-500" />
                        </button>
                      </div>

                      {/* Text input */}
                      <div className="flex items-center gap-2">
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-1 bg-transparent outline-none resize-none max-h-24 px-2 py-1 text-sm"
                          rows="1"
                        />
                        <button 
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                          className={`
                            p-3 rounded-xl transition-all
                            ${messageText.trim() 
                              ? 'bg-[#2D531A] text-white hover:bg-[#1a3a0f]' 
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
                          `}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick replies */}
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 transition-colors">
                      On my way
                    </button>
                    <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 transition-colors">
                      Got it, thanks
                    </button>
                    <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 transition-colors">
                      When will you arrive?
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State - No Chat Selected */
              <div className="h-full flex items-center justify-center bg-gray-50/50">
                <div className="text-center space-y-4 p-8">
                  <div className="bg-white p-6 rounded-[40px] shadow-sm w-fit mx-auto">
                    <MessageCircle size={48} className="text-[#2D531A]" />
                  </div>
                  <h3 className="text-xl font-black text-gray-800">Your Messages</h3>
                  <p className="text-gray-400 text-sm max-w-sm">
                    Select a conversation to start messaging with runners about your bookings
                  </p>

                  {/* Quick Stats Cards */}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <div className="text-2xl font-black text-gray-900">{chats.length}</div>
                      <div className="text-xs text-gray-500">Total Chats</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <div className="text-2xl font-black text-[#2D531A]">
                        {chats.filter(c => c.unread > 0).length}
                      </div>
                      <div className="text-xs text-gray-500">Unread</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;