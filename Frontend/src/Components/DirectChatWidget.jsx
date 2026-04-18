import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Search, User } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const API = `${BASE_URL}/api/direct-chat`;

const token = () => localStorage.getItem("token");

function decodeJwt() {
  const t = token();
  if (!t) return {};
  try {
    return JSON.parse(atob(t.split(".")[1]));
  } catch {
    return {};
  }
}

export default function DirectChatWidget() {
  const currentUser = decodeJwt();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("threads"); // "threads", "search", "chat"
  
  const [threads, setThreads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Headers for axios
  const config = {
    headers: { Authorization: `Bearer ${token()}` }
  };

  useEffect(() => {
    if (isOpen && token()) {
      fetchThreads();
    }
  }, [isOpen]);

  const fetchThreads = async () => {
    try {
      const res = await axios.get(`${API}/threads`, config);
      setThreads(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(`${API}/search?q=${searchQuery}`, config);
      setSearchResults(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const startChat = async (targetUserId) => {
    try {
      const res = await axios.post(`${API}/threads`, { targetUserId }, config);
      const thread = res.data.data;
      setActiveThread(thread);
      setView("chat");
      fetchMessages(thread._id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (threadId) => {
    try {
      const res = await axios.get(`${API}/threads/${threadId}/messages`, config);
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (view === "chat" && activeThread && token()) {
      const s = io(BASE_URL, { transports: ["websocket", "polling"] });
      socketRef.current = s;

      s.on("connect", () => {
        s.emit("direct:join-thread", { threadId: activeThread._id, token: token() });
      });

      s.on("direct:new-message", (msg) => {
        if (msg.threadId === activeThread._id) {
          setMessages((prev) => {
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        }
      });

      return () => {
        s.emit("direct:leave-thread", { threadId: activeThread._id });
        s.disconnect();
      };
    }
  }, [view, activeThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeThread) return;
    
    try {
      const res = await axios.post(`${API}/threads/${activeThread._id}/messages`, { text }, config);
      // Optimistically add message or rely on socket. For fast UX, add locally:
      setMessages((prev) => {
        if (prev.some((m) => m._id === res.data.data._id)) return prev;
        return [...prev, res.data.data];
      });
      setText("");
      fetchThreads(); // update lastMessageAt
    } catch (err) {
      console.error(err);
    }
  };

  const getOtherParticipant = (thread) => {
    if (!thread.participants) return null;
    return thread.participants.find(p => p._id !== currentUser.userId && p._id !== currentUser.id);
  };

  if (!token()) return null; // Don't show if not logged in

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              {view === "chat" ? (
                <button onClick={() => setView("threads")} className="mr-2 hover:text-indigo-200 text-sm">
                  &larr; Back
                </button>
              ) : view === "search" ? (
                <button onClick={() => setView("threads")} className="mr-2 hover:text-indigo-200 text-sm">
                  &larr; Back
                </button>
              ) : null}
              <h3 className="font-semibold">
                {view === "chat" 
                  ? getOtherParticipant(activeThread)?.username || "Chat" 
                  : view === "search" ? "Find Users" : "Messages"}
              </h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-slate-50 relative">
            
            {/* THREADS VIEW */}
            {view === "threads" && (
              <div className="p-4">
                <button 
                  onClick={() => setView("search")}
                  className="w-full mb-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-indigo-100 flex items-center justify-center gap-2"
                >
                  <Search size={16} /> New Chat
                </button>
                {threads.length === 0 ? (
                  <p className="text-center text-slate-500 text-sm mt-10">No messages yet. Start a chat!</p>
                ) : (
                  <div className="space-y-2">
                    {threads.map((t) => {
                      const other = getOtherParticipant(t);
                      return (
                        <div 
                          key={t._id} 
                          onClick={() => { setActiveThread(t); setView("chat"); fetchMessages(t._id); }}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:border-indigo-300"
                        >
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                            {other?.username?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-800 truncate">{other?.username}</h4>
                            <p className="text-xs text-slate-500 capitalize">{other?.role}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* SEARCH VIEW */}
            {view === "search" && (
              <div className="p-4">
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name or email..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-3 py-2 rounded-lg"><Search size={18} /></button>
                </form>
                <div className="space-y-2">
                  {searchResults.map(user => (
                    <div 
                      key={user._id} 
                      onClick={() => startChat(user._id)}
                      className="flex justify-between items-center p-3 bg-white border rounded-lg cursor-pointer hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-medium text-sm">{user.username}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600 uppercase">{user.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHAT VIEW */}
            {view === "chat" && (
              <div className="flex flex-col h-full absolute inset-0">
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map((m) => {
                    const isMe = String(m.senderId) === String(currentUser.userId || currentUser.id);
                    return (
                      <div key={m._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                          isMe ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white border text-slate-800 rounded-bl-sm"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={sendMessage} className="p-3 bg-white border-t flex gap-2">
                  <input 
                    type="text" 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-slate-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button type="submit" disabled={!text.trim()} className="bg-indigo-600 text-white p-2 rounded-full disabled:opacity-50">
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}
