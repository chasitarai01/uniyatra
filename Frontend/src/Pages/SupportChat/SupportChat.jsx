import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const API = `${BASE_URL}/api/support-chat`;
const token = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

function decodeJwt() {
  const t = token();
  if (!t) return {};
  try {
    return JSON.parse(atob(t.split(".")[1]));
  } catch {
    return {};
  }
}

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...headers(), ...options.headers } });
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const txt = await res.text();
    throw new Error(txt.slice(0, 120) || `HTTP ${res.status}`);
  }
  return res.json();
}

export default function SupportChat() {
  const claims = decodeJwt();
  const isAdmin = claims.role === "admin";

  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const loadThreads = useCallback(async () => {
    if (!token()) {
      setError("Please log in to use support chat.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const path = isAdmin ? `${API}/threads/all` : `${API}/threads/me`;
      const res = await jsonFetch(path);
      if (!res.success) throw new Error(res.message || "Failed to load threads");
      setThreads(res.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const loadMessages = useCallback(async (threadId) => {
    if (!threadId) return;
    const res = await jsonFetch(`${API}/threads/${threadId}/messages`);
    if (!res.success) throw new Error(res.message || "Failed to load messages");
    setMessages(res.data || []);
  }, []);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (!activeId || !token()) return;
    loadMessages(activeId).catch((e) => setError(e.message));
  }, [activeId, loadMessages]);

  useEffect(() => {
    if (!activeId || !token()) return;
    const s = io(BASE_URL, {
      transports: ["websocket", "polling"],
      auth: { token: token() },
    });
    socketRef.current = s;
    s.on("connect", () => {
      s.emit("support:join-thread", { threadId: activeId, token: token() }, (ack) => {
        if (!ack?.ok) console.warn("support:join-thread", ack);
      });
    });
    s.on("support:new-message", (msg) => {
      if (msg.threadId !== activeId) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });
    return () => {
      s.emit("support:leave-thread", { threadId: activeId });
      s.disconnect();
      socketRef.current = null;
    };
  }, [activeId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openOrCreateThread = async () => {
    try {
      setError(null);
      const res = await jsonFetch(`${API}/threads`, {
        method: "POST",
        body: JSON.stringify({ topic: "Student support" }),
      });
      if (!res.success) throw new Error(res.message || "Could not open thread");
      await loadThreads();
      setActiveId(res.data._id);
    } catch (e) {
      setError(e.message);
    }
  };

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || !activeId) return;
    setText("");
    try {
      const res = await jsonFetch(`${API}/threads/${activeId}/messages`, {
        method: "POST",
        body: JSON.stringify({ text: trimmed }),
      });
      if (!res.success) throw new Error(res.message || "Send failed");
      setMessages((prev) => {
        if (prev.some((m) => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const closeThread = async () => {
    if (!activeId) return;
    if (!confirm("Close this conversation?")) return;
    try {
      const res = await jsonFetch(`${API}/threads/${activeId}/close`, {
        method: "PATCH",
      });
      if (!res.success) throw new Error(res.message || "Close failed");
      setActiveId(null);
      setMessages([]);
      await loadThreads();
    } catch (e) {
      setError(e.message);
    }
  };

  if (!token()) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <p className="text-slate-600">Log in to use support chat.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 bg-white p-4 shrink-0">
        <h1 className="text-lg font-bold text-slate-900 mb-1">Support chat</h1>
        <p className="text-xs text-slate-500 mb-4">
          {isAdmin ? "All student threads (admin)" : "Chat with support — encrypted at rest"}
        </p>
        {!isAdmin && (
          <button
            type="button"
            onClick={openOrCreateThread}
            className="w-full py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
          >
            New / open chat
          </button>
        )}
        <div className="mt-4 space-y-1 max-h-48 md:max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-xs text-slate-400">Loading…</p>
          ) : (
            threads.map((t) => (
              <button
                key={t._id}
                type="button"
                onClick={() => setActiveId(t._id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  activeId === t._id
                    ? "bg-indigo-50 text-indigo-800 border border-indigo-100"
                    : "hover:bg-slate-50 text-slate-700 border border-transparent"
                }`}
              >
                <span className="font-medium line-clamp-1">
                  {isAdmin
                    ? t.studentId?.fullName || t.studentId?.email || "Student"
                    : t.topic || "Support"}
                </span>
                <span className="text-[10px] text-slate-400 block">{t.status}</span>
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-[50vh] md:min-h-screen">
        {error && (
          <div className="m-3 p-3 rounded-xl bg-rose-50 text-rose-800 text-sm border border-rose-100">
            {error}
          </div>
        )}

        {!activeId ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm p-8">
            {isAdmin ? "Select a thread" : "Open or create a chat from the sidebar"}
          </div>
        ) : (
          <>
            <div className="border-b border-slate-200 bg-white px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-800">Conversation</span>
              <button
                type="button"
                onClick={closeThread}
                className="text-xs text-slate-500 hover:text-rose-600"
              >
                Close thread
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const sid = String(m.senderId);
                const mine =
                  sid === String(claims.userId || "") ||
                  sid === String(claims.id || "") ||
                  sid === String(claims.sub || "");
                return (
                  <div
                    key={m._id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                        mine
                          ? "bg-indigo-600 text-white rounded-br-md"
                          : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                      }`}
                    >
                      <span className="text-[10px] opacity-80 block mb-0.5">
                        {m.senderRole === "admin" ? "Support" : "You"}
                      </span>
                      {m.text}
                      <div className="text-[10px] opacity-70 mt-1">
                        {new Date(m.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
            <div className="border-t border-slate-200 bg-white p-3 flex gap-2">
              <input
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm"
                placeholder="Type a message…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
              />
              <button
                type="button"
                onClick={send}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium shrink-0"
              >
                Send
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
