import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, X, Send, Bot, Sparkles,
  ChevronRight, GraduationCap, Award, HelpCircle,
  ThumbsUp, ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SmartAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", text: "Hello! I'm your Smart Assistant. How can I help you today?", time: new Date() }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), type: "user", text: inputText, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulated Smart Logic
    setTimeout(() => {
      let botResponse = "";
      const lowerInput = inputText.toLowerCase();

      if (lowerInput.includes("university") || lowerInput.includes("uni")) {
        botResponse = "I can help you with that! You can explore our top-rated universities in the Universities section. Would you like me to take you there?";
      } else if (lowerInput.includes("scholarship")) {
        botResponse = "We have many scholarship opportunities available. You can filter them by benefits and deadlines in the Scholarships page.";
      } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        botResponse = "Hi there! I'm here to assist you with your educational journey. What's on your mind?";
      } else if (lowerInput.includes("help") || lowerInput.includes("support")) {
        botResponse = "For technical issues or deep support, you can open a thread in our Support Hub. I can also try to answer basic questions here!";
      } else {
        botResponse = "That's an interesting question! For specific inquiries like that, I recommend checking our FAQ or starting a conversation with a human specialist in the Support Hub.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, type: "bot", text: botResponse, time: new Date() }]);
      setIsTyping(false);
    }, 1000);
  };

  const quickActions = [
    { label: "View Universities", icon: GraduationCap, path: "/dashboard/universities" },
    { label: "Find Scholarships", icon: Award, path: "/dashboard/scholarships" },
    { label: "Contact Support", icon: HelpCircle, path: "/support-chat" }
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl z-[999] group overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageSquare size={28} />
              <div className="absolute top-0 right-0 w-4 h-4 bg-rose-500 border-2 border-indigo-600 rounded-full animate-pulse"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 w-96 h-[600px] bg-white rounded-[2.5rem] shadow-2xl z-[999] overflow-hidden flex flex-col border border-slate-100"
          >
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full"></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Smart Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Always Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50">
              {messages.map((m) => (
                <motion.div
                  initial={{ opacity: 0, x: m.type === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={m.id}
                  className={`flex ${m.type === 'user' ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${m.type === 'user'
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
                    }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}

              {/* Quick Actions at Bottom of Scroll */}
              <div className="pt-4 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Links</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => { navigate(action.path); setIsOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                    >
                      <action.icon size={12} /> {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-100 shrink-0 bg-white">
              <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-slate-800 py-2"
                />
                <button
                  onClick={handleSend}
                  className="text-indigo-600 hover:scale-110 transition-transform disabled:opacity-30"
                  disabled={!inputText.trim()}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest mt-4 flex items-center justify-center gap-1.5">
                <Sparkles size={10} className="text-amber-400" /> Powered by UniYatra Smart Intelligence
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartAssistant;
