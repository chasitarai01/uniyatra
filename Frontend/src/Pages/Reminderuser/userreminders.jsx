import { useState, useEffect, useRef } from "react";
import { API_BASE_URL, SOCKET_URL } from "../../config";

const API = `${API_BASE_URL}/api/reminders`;
const token = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token()}`,
});

async function safeFetch(url, options = {}) {
  const res = await fetch(url, options);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error(`API returned HTML (status ${res.status}) — check VITE_API_URL`);
  }
  return res.json();
}

const PRIORITY_COLOR = {
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  high: "bg-rose-100 text-rose-700 border-rose-200",
};

const REMINDER_TYPES = [
  { value: "application_deadline", label: "Application deadline", icon: "📄" },
  { value: "intake_date", label: "Intake / course start", icon: "🎓" },
  { value: "scholarship_deadline", label: "Scholarship deadline", icon: "💰" },
  { value: "visa_schedule", label: "Visa appointment / deadline", icon: "✈️" },
  { value: "document_submission", label: "Document submission", icon: "📎" },
  { value: "interview", label: "Interview", icon: "🎙️" },
  { value: "exam", label: "Exam / test", icon: "📝" },
  { value: "other", label: "Other", icon: "📌" },
];

const TYPE_ICON = Object.fromEntries(
  REMINDER_TYPES.map((t) => [t.value, t.icon])
);

function defaultTitleForType(type) {
  const row = REMINDER_TYPES.find((t) => t.value === type);
  return row ? row.label : "Reminder";
}

function getUserIdFromToken() {
  const t = token();
  if (!t) return null;
  try {
    const payload = JSON.parse(atob(t.split(".")[1]));
    return payload.userId || payload.id || null;
  } catch {
    return null;
  }
}

function formatDate(d) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ReminderCard({ reminder, onComplete, onDelete, onEdit }) {
  const isPast = new Date(reminder.reminderDate) < new Date();
  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        reminder.isCompleted
          ? "border-gray-100 opacity-60"
          : isPast
          ? "border-rose-200 bg-rose-50/30"
          : "border-slate-200"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-2xl mt-0.5 shrink-0">
              {TYPE_ICON[reminder.type] || "📌"}
            </span>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-slate-800 truncate ${
                  reminder.isCompleted ? "line-through text-slate-400" : ""
                }`}
              >
                {reminder.title}
              </h3>
              {reminder.description && (
                <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                  {reminder.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                    PRIORITY_COLOR[reminder.priority] ||
                    "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {reminder.priority}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDate(reminder.reminderDate)}
                </span>
                {reminder.universityId && (
                  <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">
                    🏫{" "}
                    {reminder.universityId.University ||
                      reminder.universityId.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions - visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {!reminder.isCompleted && (
              <>
                <button
                  onClick={() => onEdit(reminder)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => onComplete(reminder._id)}
                  className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                  title="Mark complete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </>
            )}
            <button
              onClick={() => onDelete(reminder._id)}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {reminder.isCompleted && (
        <div className="absolute top-3 right-3">
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
            ✓ Done
          </span>
        </div>
      )}
    </div>
  );
}

function ReminderModal({ reminder, presetType, onClose, onSave }) {
  const [form, setForm] = useState(
    reminder
      ? {
          ...reminder,
          reminderDate: reminder.reminderDate
            ? new Date(reminder.reminderDate).toISOString().slice(0, 16)
            : "",
        }
      : {
          title: "",
          description: "",
          type: presetType || "application_deadline",
          reminderDate: "",
          notifyBefore: 1440,
          priority: "medium",
          universityId: "",
        }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reminder && presetType) {
      setForm((f) => ({
        ...f,
        type: presetType,
        title: f.title || defaultTitleForType(presetType),
      }));
    }
  }, [reminder, presetType]);

  const handleSubmit = async () => {
    if (!form.title || !form.reminderDate) return;
    setLoading(true);
    setError(null);
    try {
      const method = reminder ? "PUT" : "POST";
      const url = reminder ? `${API}/${reminder._id}` : API;
      const data = await safeFetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(form),
      });
      if (data.success) onSave(data.data);
      else setError(data.message || "Failed to save reminder");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {reminder ? "Edit Reminder" : "New Reminder"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Title *</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Reminder title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
            <textarea
              rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Optional details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Type</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {REMINDER_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.icon} {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Priority</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {["low", "medium", "high"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Reminder Date & Time *
            </label>
            <input
              type="datetime-local"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.reminderDate}
              onChange={(e) => setForm({ ...form, reminderDate: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              Notify before (minutes):{" "}
              <span className="text-indigo-600 font-bold">{form.notifyBefore}</span>
            </label>
            <input
              type="range"
              min={15}
              max={10080}
              step={15}
              value={form.notifyBefore}
              onChange={(e) =>
                setForm({ ...form, notifyBefore: Number(e.target.value) })
              }
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>15 min</span>
              <span>1 week</span>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.title || !form.reminderDate}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Saving..." : reminder ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UserReminders() {
  const [reminders, setReminders] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [presetType, setPresetType] = useState(null);
  const [filters, setFilters] = useState({ type: "", priority: "", isCompleted: "" });
  const [activeTab, setActiveTab] = useState("all");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "default") return;
    Notification.requestPermission().catch(() => {});
  }, []);

  useEffect(() => {
    const uid = getUserIdFromToken();
    if (!uid) return;
    const s = io(SOCKET_URL, { transports: ["websocket"], withCredentials: false });
    socketRef.current = s;
    s.emit("join-user-reminders", { userId: uid });
    s.on("reminder-due", (payload) => {
      if (Notification.permission === "granted" && payload?.title) {
        new Notification("Study abroad reminder", {
          body: `${payload.title}`,
        });
      }
    });
    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.priority) params.append("priority", filters.priority);
      if (filters.isCompleted !== "") params.append("isCompleted", filters.isCompleted);

      const [remData, upData] = await Promise.all([
        safeFetch(`${API}?${params}`, { headers: headers() }),
        safeFetch(`${API}/upcoming`, { headers: headers() }),
      ]);
      if (remData.success) setReminders(remData.data);
      if (upData.success) setUpcoming(upData.data);
    } catch (e) {
      console.error("Reminder fetch failed:", e.message);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [filters]);

  const handleComplete = async (id) => {
    try {
      const data = await safeFetch(`${API}/${id}/complete`, {
        method: "PATCH",
        headers: headers(),
      });
      if (data.success)
        setReminders((prev) => prev.map((r) => (r._id === id ? data.data : r)));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this reminder?")) return;
    try {
      const data = await safeFetch(`${API}/${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (data.success) setReminders((prev) => prev.filter((r) => r._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = (saved) => {
    if (editingReminder) {
      setReminders((prev) => prev.map((r) => (r._id === saved._id ? saved : r)));
    } else {
      setReminders((prev) => [saved, ...prev]);
    }
    setShowModal(false);
    setEditingReminder(null);
  };

  const displayed = activeTab === "upcoming" ? upcoming : reminders;
  const pending = reminders.filter((r) => !r.isCompleted).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Reminders</h1>
            <p className="text-xs text-slate-400 mt-0.5">{pending} pending</p>
          </div>
          <button
            onClick={() => {
              setEditingReminder(null);
              setPresetType(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Quick add
          </p>
          <div className="flex flex-wrap gap-2">
            {REMINDER_TYPES.slice(0, 4).map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setEditingReminder(null);
                  setPresetType(t.value);
                  setShowModal(true);
                }}
                className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 transition-colors"
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Reminders notify you ahead of time (slider in the form) and appear in Notifications when due.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-800">Failed to load reminders</p>
              <p className="text-xs text-rose-600 mt-0.5 font-mono break-all">{error}</p>
              <p className="text-xs text-rose-500 mt-1">
                Make sure your backend is running and{" "}
                <code className="bg-rose-100 px-1 rounded">VITE_API_URL</code> is set in{" "}
                <code className="bg-rose-100 px-1 rounded">.env</code>
              </p>
              <button
                onClick={fetchReminders}
                className="mt-2 text-xs bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-rose-600 shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Upcoming banner */}
        {!error && upcoming.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {upcoming.length} reminder{upcoming.length > 1 ? "s" : ""} due in the next 24 hours
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                Next: {upcoming[0]?.title} — {formatDate(upcoming[0]?.reminderDate)}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
          {["all", "upcoming"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "upcoming"
                ? `⏳ Upcoming (${upcoming.length})`
                : `📋 All (${reminders.length})`}
            </button>
          ))}
        </div>

        {/* Filters */}
        {activeTab === "all" && (
          <div className="flex gap-2 flex-wrap">
            <select
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              {REMINDER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <select
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="">All Priorities</option>
              {["low", "medium", "high"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <select
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={filters.isCompleted}
              onChange={(e) => setFilters({ ...filters, isCompleted: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="false">Pending</option>
              <option value="true">Completed</option>
            </select>
            {(filters.type || filters.priority || filters.isCompleted) && (
              <button
                onClick={() => setFilters({ type: "", priority: "", isCompleted: "" })}
                className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🗓️</p>
            <p className="text-slate-500 font-medium">No reminders found</p>
            <p className="text-slate-400 text-sm mt-1">
              {activeTab === "upcoming"
                ? "Nothing due in the next 24 hours"
                : "Create your first reminder"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((r) => (
              <ReminderCard
                key={r._id}
                reminder={r}
                onComplete={handleComplete}
                onDelete={handleDelete}
                onEdit={(rem) => {
                  setEditingReminder(rem);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <ReminderModal
          reminder={editingReminder}
          presetType={editingReminder ? null : presetType}
          onClose={() => {
            setShowModal(false);
            setEditingReminder(null);
            setPresetType(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}