import React, { useState, useEffect } from "react";

const palette = {
  cream: "#F2EDE4",
  sand1: "#D9D0C0",
  sand2: "#C4B89A",
  tan:   "#A99D84",
  warm:  "#998A6D",
  bark:  "#7A6E5A",
  dark:  "#2E2A24",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Mono:wght@300;400&display=swap');

  .un-page {
    min-height: 100vh;
    background: #fff;
    font-family: 'DM Mono', monospace;
    padding: 56px 0 80px;
  }

  .un-container {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .un-eyebrow {
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${palette.warm};
    margin-bottom: 10px;
  }

  .un-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px;
    font-weight: 300;
    color: ${palette.dark};
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .un-title em {
    font-style: italic;
    color: ${palette.bark};
  }

  .un-meta {
    font-size: 11px;
    color: ${palette.tan};
    letter-spacing: 0.08em;
    margin-bottom: 40px;
  }

  .un-divider {
    width: 40px;
    height: 1px;
    background: ${palette.warm};
    opacity: 0.5;
    margin-bottom: 40px;
  }

  .un-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid ${palette.sand1};
    margin-bottom: 32px;
  }

  .un-tab {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 10px 20px;
    border: none;
    background: none;
    cursor: pointer;
    color: ${palette.tan};
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.2s;
  }

  .un-tab.active {
    color: ${palette.dark};
    border-bottom-color: ${palette.warm};
  }

  .un-empty {
    text-align: center;
    padding: 64px 0;
    color: ${palette.sand2};
  }

  .un-empty-icon {
    font-size: 32px;
    margin-bottom: 12px;
    opacity: 0.4;
  }

  .un-empty-text {
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .un-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .un-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px 0;
    border-bottom: 1px solid ${palette.cream};
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
  }

  .un-item:hover {
    background: #FAFAF9;
    padding-left: 8px;
    padding-right: 8px;
    margin-left: -8px;
    margin-right: -8px;
    border-radius: 4px;
  }

  .un-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 5px;
  }

  .un-dot.unread { background: ${palette.warm}; }
  .un-dot.read   { background: ${palette.sand1}; }

  .un-item-body { flex: 1; }

  .un-item-message {
    font-size: 13px;
    color: ${palette.dark};
    line-height: 1.5;
    margin-bottom: 4px;
  }

  .un-item-message.read {
    color: ${palette.tan};
    font-weight: 300;
  }

  .un-item-time {
    font-size: 10px;
    color: ${palette.sand2};
    letter-spacing: 0.06em;
  }

  .un-item-badge {
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .un-item-badge.unread {
    background: ${palette.cream};
    color: ${palette.warm};
  }

  .un-item-badge.read {
    background: transparent;
    color: ${palette.sand2};
  }

  .un-mark-all {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${palette.warm};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-bottom: 24px;
    display: block;
    margin-left: auto;
    transition: color 0.15s;
  }

  .un-mark-all:hover { color: ${palette.bark}; }

  .un-error {
    text-align: center;
    padding: 40px;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${palette.tan};
  }

  .un-loading {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 8px;
  }

  .un-skeleton {
    height: 56px;
    background: linear-gradient(90deg, ${palette.cream} 25%, ${palette.sand1}33 50%, ${palette.cream} 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 4px;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [tab, setTab]         = useState("all"); // "all" | "unread" | "read"

  // Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        // JWT may encode the id as _id, id, or userId — check all
        const userId = user._id || user.id || user.userId;
        const mine = data.filter((n) => n.userId === userId);
        // Sort newest first
        mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setNotifications(mine);
      } catch {
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5001/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markAsRead(n._id)));
  };

  const filtered = notifications.filter((n) => {
    if (tab === "unread") return !n.isRead;
    if (tab === "read")   return n.isRead;
    return true;
  });

  // Derive counts directly from notifications state so they always stay in sync
  const totalCount  = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount   = notifications.filter((n) => n.isRead).length;

  return (
    <>
      <style>{styles}</style>
      <div className="un-page">
        <div className="un-container">

          <p className="un-eyebrow">Inbox</p>
          <h1 className="un-title">My <em>Notifications</em></h1>
          <p className="un-meta">
            {user ? `Signed in as ${user.username || user.name || user.email || "User"}` : ""}
            {unreadCount > 0 ? ` · ${unreadCount} unread` : " · All caught up"}
          </p>
          <div className="un-divider" />

          {/* Tabs */}
          <div className="un-tabs">
            {[
              { key: "all",    label: `All (${totalCount})`       },
              { key: "unread", label: `Unread (${unreadCount})`   },
              { key: "read",   label: `Read (${readCount})`       },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`un-tab ${tab === key ? "active" : ""}`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Mark all read */}
          {unreadCount > 0 && (
            <button className="un-mark-all" onClick={markAllRead}>
              Mark all as read →
            </button>
          )}

          {/* States */}
          {error && <div className="un-error">{error}</div>}

          {loading && (
            <div className="un-loading">
              {[1, 2, 3].map((i) => <div key={i} className="un-skeleton" />)}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="un-empty">
              <div className="un-empty-icon">○</div>
              <p className="un-empty-text">
                {tab === "unread" ? "No unread notifications" :
                 tab === "read"   ? "No read notifications" :
                 "No notifications yet"}
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <ul className="un-list">
              {filtered.map((n) => (
                <li
                  key={n._id}
                  className="un-item"
                  onClick={() => !n.isRead && markAsRead(n._id)}
                >
                  <div className={`un-dot ${n.isRead ? "read" : "unread"}`} />
                  <div className="un-item-body">
                    <p className={`un-item-message ${n.isRead ? "read" : ""}`}>
                      {n.message}
                    </p>
                    <p className="un-item-time">{timeAgo(n.createdAt)}</p>
                  </div>
                  <span className={`un-item-badge ${n.isRead ? "read" : "unread"}`}>
                    {n.isRead ? "Read" : "New"}
                  </span>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </>
  );
};

export default UserNotifications;
