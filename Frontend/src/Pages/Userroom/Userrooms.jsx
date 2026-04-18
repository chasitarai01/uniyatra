// pages/user/UserRooms.jsx
// Route: /classes
// Students browse available live rooms and join them

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getUser = () => {
  try { return JSON.parse(atob(localStorage.getItem("token").split(".")[1])); }
  catch { return null; }
};

const fmt = (d) => d
  ? new Date(d).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
  : null;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Mono:wght@300;400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ur-root {
  min-height: 100vh; background: #fff;
  font-family: 'DM Mono', monospace; color: #2e2a24;
  padding-bottom: 80px;
}

.ur-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 40px; border-bottom: 1px solid #e8e2d9;
  position: sticky; top: 0; background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px); z-index: 10;
}
.ur-logo { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: #2e2a24; }
.ur-logo em { font-style: italic; color: #998a6d; }
.ur-user-tag { font-size: 10px; color: #a99d84; letter-spacing: 0.08em; }

.ur-hero { padding: 52px 40px 28px; }
.ur-eyebrow { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: #998a6d; margin-bottom: 12px; }
.ur-title { font-family: 'Cormorant Garamond', serif; font-size: 52px; font-weight: 300; color: #2e2a24; line-height: 1; margin-bottom: 8px; }
.ur-title em { font-style: italic; color: #7a6e5a; }
.ur-sub { font-size: 11px; color: #a99d84; letter-spacing: 0.06em; }
.ur-divider { width: 40px; height: 1px; background: #998a6d; opacity: 0.5; margin: 24px 40px 36px; }

/* search */
.ur-search-row { padding: 0 40px 32px; display: flex; align-items: center; gap: 12px; }
.ur-search {
  flex: 1; max-width: 360px; background: transparent; border: none; border-bottom: 1px solid #d9d0c0;
  padding: 8px 2px; font-family: 'DM Mono', monospace; font-size: 13px; color: #2e2a24; outline: none;
  transition: border-color 0.2s;
}
.ur-search:focus { border-bottom-color: #998a6d; }
.ur-search::placeholder { color: #c4b89a; }
.ur-count { font-size: 10px; color: #c4b89a; letter-spacing: 0.08em; }

/* grid */
.ur-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1px; margin: 0 40px; background: #e8e2d9;
}

.ur-card { background: #fff; padding: 28px; transition: background 0.15s; cursor: default; }
.ur-card:hover { background: #faf8f5; }

.ur-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.ur-badge { font-size: 8px; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 10px; border-radius: 2px; }
.ur-badge.live { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
.ur-badge.sched { background: #fff8e1; color: #f57f17; border: 1px solid #ffecb3; }
.ur-code { font-size: 10px; letter-spacing: 0.2em; color: #998a6d; font-weight: 400; }

.ur-card-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: #2e2a24; margin-bottom: 12px; line-height: 1.2; }
.ur-card-meta  { font-size: 10px; color: #a99d84; letter-spacing: 0.05em; line-height: 2.2; }
.ur-card-meta b { color: #7a6e5a; font-weight: 400; }

/* capacity bar */
.ur-cap { margin-top: 14px; }
.ur-cap-row { display: flex; justify-content: space-between; font-size: 9px; color: #c4b89a; margin-bottom: 5px; letter-spacing: 0.06em; }
.ur-cap-track { height: 2px; background: #e8e2d9; }
.ur-cap-fill  { height: 2px; background: #998a6d; transition: width 0.4s; }

.ur-divider-sm { height: 1px; background: #f0ece6; margin: 16px 0; }

.ur-join-btn {
  width: 100%; padding: 12px; background: #2e2a24; color: #fff; border: none;
  font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.14em;
  text-transform: uppercase; cursor: pointer; transition: background 0.18s;
}
.ur-join-btn:hover    { background: #998a6d; }
.ur-join-btn.full     { background: #f5f0ea; color: #c4b89a; cursor: not-allowed; }
.ur-join-btn.full:hover { background: #f5f0ea; }

/* empty */
.ur-empty {
  margin: 0 40px; background: #faf8f5; border: 1px dashed #d9d0c0;
  display: flex; flex-direction: column; align-items: center; padding: 80px; text-align: center;
}
.ur-empty-icon { font-size: 32px; opacity: 0.25; margin-bottom: 14px; }
.ur-empty-txt  { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #c4b89a; }

.ur-loading { display: flex; align-items: center; justify-content: center; height: 180px; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #c4b89a; }

/* join by code */
.ur-code-section { margin: 40px 40px 0; padding: 28px; background: #faf8f5; border: 1px solid #e8e2d9; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.ur-code-label { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #998a6d; flex-shrink: 0; }
.ur-code-input {
  background: transparent; border: none; border-bottom: 1px solid #d9d0c0;
  padding: 8px 2px; font-family: 'DM Mono', monospace; font-size: 14px; letter-spacing: 0.1em;
  color: #2e2a24; outline: none; width: 160px; text-transform: uppercase;
  transition: border-color 0.2s;
}
.ur-code-input:focus { border-bottom-color: #998a6d; }
.ur-code-input::placeholder { color: #d9d0c0; letter-spacing: 0.08em; font-size: 12px; }
.ur-code-btn {
  padding: 10px 22px; background: #2e2a24; color: #fff; border: none;
  font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; cursor: pointer; transition: background 0.18s;
}
.ur-code-btn:hover { background: #998a6d; }
.ur-code-err { font-size: 10px; color: #c62828; letter-spacing: 0.05em; }
`;

export default function UserRooms() {
  const [rooms, setRooms]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [codeErr, setCodeErr]   = useState("");
  const navigate = useNavigate();
  const user     = getUser();
  const token    = localStorage.getItem("token");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res  = await fetch("http://localhost:5001/api/rooms", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        // Only show active rooms to users
        setRooms((data.rooms || []).filter(r => r.isActive));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const joinByCode = async () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) return;
    setCodeErr("");
    try {
      const res  = await fetch(`http://localhost:5001/api/rooms/${code}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) navigate(`/room/${code}`);
      else setCodeErr(data.message || "Room not found");
    } catch { setCodeErr("Cannot reach server"); }
  };

  const filtered = rooms.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.roomCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{css}</style>
      <div className="ur-root">

        {/* Topbar */}
        <div className="ur-topbar">
          <div className="ur-logo">Uni<em>Yatra</em></div>
          <span className="ur-user-tag">
            {user?.username || user?.email || "Student"}
          </span>
        </div>

        {/* Hero */}
        <div className="ur-hero">
          <p className="ur-eyebrow">Live Classes</p>
          <h1 className="ur-title">Join a <em>Class</em></h1>
          <p className="ur-sub">Browse live sessions or enter a room code from your instructor</p>
        </div>

        <div className="ur-divider" />

        {/* Join by code */}
        <div className="ur-code-section">
          <span className="ur-code-label">Have a room code?</span>
          <input
            className="ur-code-input"
            placeholder="Enter code…"
            value={codeInput}
            maxLength={6}
            onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeErr(""); }}
            onKeyDown={e => e.key === "Enter" && joinByCode()}
          />
          <button className="ur-code-btn" onClick={joinByCode}>Join →</button>
          {codeErr && <span className="ur-code-err">{codeErr}</span>}
        </div>

        {/* Search */}
        <div className="ur-search-row" style={{ marginTop: 32 }}>
          <input
            className="ur-search"
            placeholder="Search classes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="ur-count">{filtered.length} live</span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="ur-loading">Loading classes…</div>
        ) : filtered.length === 0 ? (
          <div className="ur-empty">
            <div className="ur-empty-icon">○</div>
            <p className="ur-empty-txt">
              {search ? "No classes match your search" : "No live classes right now"}
            </p>
          </div>
        ) : (
          <div className="ur-grid">
            {filtered.map(room => {
              const pct  = Math.round(((room.participants?.length || 0) / room.maxParticipants) * 100);
              const full = (room.participants?.length || 0) >= room.maxParticipants;
              return (
                <div key={room._id} className="ur-card">
                  <div className="ur-card-top">
                    <span className="ur-badge live">● Live</span>
                    <span className="ur-code">{room.roomCode}</span>
                  </div>

                  <p className="ur-card-title">{room.title}</p>

                  <div className="ur-card-meta">
                    <div><b>Host &nbsp;</b>{room.createdBy?.username || "Instructor"}</div>
                    {room.scheduledAt && <div><b>Scheduled &nbsp;</b>{fmt(room.scheduledAt)}</div>}
                  </div>

                  {/* Capacity */}
                  <div className="ur-cap">
                    <div className="ur-cap-row">
                      <span>{room.participants?.length || 0} joined</span>
                      <span>{room.maxParticipants} max</span>
                    </div>
                    <div className="ur-cap-track">
                      <div className="ur-cap-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="ur-divider-sm" />

                  <button
                    className={`ur-join-btn ${full ? "full" : ""}`}
                    onClick={() => !full && navigate(`/room/${room.roomCode}`)}
                    disabled={full}
                  >
                    {full ? "Room Full" : "Join Class →"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}