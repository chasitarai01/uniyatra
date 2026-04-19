// pages/admin/AdminVideoRoom.jsx
// Route: /admin/room/:roomCode
// Admin version — has "End Class for All" and participant management

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { SOCKET_URL, API_BASE_URL } from "../../config";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const getUser = () => {
  try { return JSON.parse(atob(localStorage.getItem("token").split(".")[1])); }
  catch { return null; }
};

const initials = (n = "?") => n.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const timeFmt  = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Mono:wght@300;400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Lobby ── */
.avr-lobby {
  min-height:100vh; background:#0c0b0a; font-family:'DM Mono',monospace;
  display:flex; align-items:center; justify-content:center;
}
.avr-lobby-card {
  width:420px; max-width:95vw; background:#111009;
  border:1px solid #2e2a24; border-top:3px solid #998a6d; padding:48px 40px;
}
.avr-lobby-tag   { font-size:9px; letter-spacing:0.28em; text-transform:uppercase; color:#998a6d; margin-bottom:10px; }
.avr-lobby-title { font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#e8e2d9; margin-bottom:6px; letter-spacing:-0.02em; }
.avr-lobby-meta  { font-size:10px; color:#5c5244; line-height:2.2; letter-spacing:0.05em; margin-bottom:28px; }
.avr-lobby-meta b { color:#a99d84; font-weight:400; }
.avr-host-badge  {
  display:inline-flex; align-items:center; gap:6px; background:#1a2e1a; border:1px solid #2d4a2d;
  color:#66bb6a; font-size:9px; letter-spacing:0.14em; text-transform:uppercase; padding:5px 12px; margin-bottom:24px;
}
.avr-lobby-preview {
  width:100%; aspect-ratio:16/9; object-fit:cover; background:#0c0b0a;
  border:1px solid #1e1c19; margin-bottom:24px; display:block;
}
.avr-lobby-join {
  width:100%; padding:14px; background:#998a6d; color:#0c0b0a; border:none;
  font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.16em; text-transform:uppercase;
  cursor:pointer; transition:background 0.18s; margin-bottom:10px;
}
.avr-lobby-join:hover { background:#b8a98a; }
.avr-lobby-back {
  width:100%; padding:12px; background:transparent; color:#5c5244;
  border:1px solid #2e2a24; font-family:'DM Mono',monospace; font-size:10px;
  letter-spacing:0.14em; text-transform:uppercase; cursor:pointer;
}
.avr-lobby-err {
  font-size:11px; color:#ef5350; background:#2e1a1a; padding:10px 14px;
  border-left:2px solid #ef5350; margin-bottom:20px;
}

/* ── Ended ── */
.avr-ended {
  min-height:100vh; background:#0c0b0a; font-family:'DM Mono',monospace;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; text-align:center;
}
.avr-ended-icon  { font-size:42px; opacity:0.25; }
.avr-ended-title { font-family:'Syne',sans-serif; font-size:30px; font-weight:800; color:#e8e2d9; }
.avr-ended-sub   { font-size:11px; color:#5c5244; letter-spacing:0.08em; }
.avr-ended-btn {
  margin-top:10px; padding:12px 28px; background:#998a6d; color:#0c0b0a; border:none;
  font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.15em; text-transform:uppercase; cursor:pointer;
}

/* ── Call ── */
.avr-root { display:flex; height:100vh; background:#0c0b0a; font-family:'DM Mono',monospace; color:#e8e2d9; overflow:hidden; }
.avr-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }

/* Topbar */
.avr-topbar {
  display:flex; align-items:center; justify-content:space-between;
  padding:11px 18px; background:#111009; border-bottom:1px solid #1e1c19; flex-shrink:0;
}
.avr-topbar-l { display:flex; align-items:center; gap:10px; }
.avr-live-dot { width:7px; height:7px; border-radius:50%; background:#66bb6a; animation:pulse 2s infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(102,187,106,0.4)} 50%{box-shadow:0 0 0 5px rgba(102,187,106,0)} }
.avr-room-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#e8e2d9; }
.avr-room-code  { font-size:10px; letter-spacing:0.18em; color:#998a6d; background:#1e1c19; padding:3px 10px; }
.avr-host-pill  { font-size:8px; letter-spacing:0.14em; text-transform:uppercase; background:#1a2e1a; color:#66bb6a; border:1px solid #2d4a2d; padding:3px 8px; }
.avr-topbar-r   { font-size:10px; color:#5c5244; }

/* Grid */
.avr-grid { flex:1; display:grid; gap:4px; padding:10px; background:#0c0b0a; overflow:hidden; align-content:start; }
.avr-grid.g1{grid-template-columns:1fr}
.avr-grid.g2{grid-template-columns:1fr 1fr}
.avr-grid.g3,.avr-grid.g4{grid-template-columns:repeat(2,1fr)}
.avr-grid.g5,.avr-grid.g6{grid-template-columns:repeat(3,1fr)}
.avr-grid.gn{grid-template-columns:repeat(4,1fr)}

.avr-tile { position:relative; background:#111009; border:1px solid #1e1c19; aspect-ratio:16/9; overflow:hidden; }
.avr-tile.me { border-color:#998a6d44; }
.avr-tile video { width:100%; height:100%; object-fit:cover; display:block; }
.avr-tile-avatar {
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  background:linear-gradient(135deg,#161410,#1e1c19);
  font-family:'Syne',sans-serif; font-size:32px; font-weight:700; color:#998a6d;
}
.avr-tile-bar {
  position:absolute; bottom:0; left:0; right:0;
  background:linear-gradient(transparent,rgba(0,0,0,0.72));
  padding:16px 10px 8px; display:flex; align-items:center; justify-content:space-between;
}
.avr-tile-name  { font-size:10px; letter-spacing:0.08em; color:#e8e2d9; }
.avr-tile-icons { display:flex; gap:5px; font-size:10px; }

/* Controls */
.avr-controls {
  display:flex; align-items:center; justify-content:center; gap:10px;
  padding:14px 20px; background:#111009; border-top:1px solid #1e1c19; flex-shrink:0;
}
.avr-ctrl {
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
  width:56px; height:56px; border-radius:4px; border:1px solid #2e2a24;
  background:#1e1c19; color:#a99d84; cursor:pointer; font-size:18px; transition:all 0.15s;
}
.avr-ctrl:hover  { background:#2e2a24; }
.avr-ctrl.off    { background:#2e1a1a; color:#ef5350; border-color:#4a2d2d; }
.avr-ctrl.leave  { background:#3a2020; color:#ef9090; border-color:#4a2d2d; }
.avr-ctrl.leave:hover { background:#5c1f1f; }
.avr-ctrl-lbl    { font-size:8px; letter-spacing:0.08em; font-family:'DM Mono',monospace; color:#5c5244; }

.avr-end-btn {
  padding:0 20px; height:56px; background:transparent; color:#ef5350;
  border:1px solid #4a2d2d; font-family:'DM Mono',monospace; font-size:10px;
  letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all 0.15s;
}
.avr-end-btn:hover { background:#7c1f1f; color:#fff; border-color:#7c1f1f; }

/* Sidebar */
.avr-sidebar { width:280px; background:#111009; border-left:1px solid #1e1c19; display:flex; flex-direction:column; flex-shrink:0; }
.avr-tabs { display:flex; border-bottom:1px solid #1e1c19; flex-shrink:0; }
.avr-tab {
  flex:1; padding:12px; background:transparent; border:none; border-bottom:2px solid transparent;
  font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.14em; text-transform:uppercase;
  color:#5c5244; cursor:pointer; margin-bottom:-1px; transition:all 0.15s;
}
.avr-tab.active { color:#998a6d; border-bottom-color:#998a6d; }

/* Participants */
.avr-plist { flex:1; overflow-y:auto; padding:10px; }
.avr-pitem { display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid #1e1c19; }
.avr-pitem:last-child { border-bottom:none; }
.avr-pavatar {
  width:34px; height:34px; background:#1e1c19; display:flex; align-items:center; justify-content:center;
  font-family:'Syne',sans-serif; font-size:12px; font-weight:700; color:#998a6d; flex-shrink:0;
}
.avr-pname  { font-size:11px; color:#e8e2d9; }
.avr-prole  { font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:#5c5244; margin-top:1px; }
.avr-picons { margin-left:auto; font-size:10px; display:flex; gap:4px; color:#5c5244; }

/* Admin participant badge */
.avr-admin-badge { background:#1a2e1a; color:#66bb6a; font-size:8px; letter-spacing:0.1em; text-transform:uppercase; padding:2px 6px; margin-left:6px; }

/* Chat */
.avr-chat { flex:1; display:flex; flex-direction:column; overflow:hidden; }
.avr-msgs { flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:12px; }
.avr-msgs::-webkit-scrollbar { width:3px; }
.avr-msgs::-webkit-scrollbar-thumb { background:#2e2a24; }
.avr-msg-me    { align-self:flex-end; max-width:84%; }
.avr-msg-other { align-self:flex-start; max-width:84%; }
.avr-msg-name  { font-size:9px; color:#5c5244; letter-spacing:0.06em; margin-bottom:3px; }
.avr-bubble { padding:8px 12px; font-size:12px; color:#e8e2d9; line-height:1.5; border-radius:2px; }
.avr-msg-me    .avr-bubble { background:#998a6d; color:#0c0b0a; }
.avr-msg-other .avr-bubble { background:#1e1c19; }
.avr-msg-time  { font-size:9px; color:#5c5244; margin-top:3px; text-align:right; }
.avr-sys-msg   { text-align:center; font-size:9px; color:#3d3830; letter-spacing:0.08em; }
.avr-no-msg    { text-align:center; font-size:10px; color:#3d3830; padding:28px 0; }

.avr-chat-row { display:flex; border-top:1px solid #1e1c19; flex-shrink:0; }
.avr-chat-in  { flex:1; background:transparent; border:none; padding:12px 14px; font-family:'DM Mono',monospace; font-size:12px; color:#e8e2d9; outline:none; }
.avr-chat-in::placeholder { color:#3d3830; }
.avr-chat-send { background:transparent; border:none; border-left:1px solid #1e1c19; padding:12px 16px; color:#998a6d; font-size:16px; cursor:pointer; transition:background 0.15s; }
.avr-chat-send:hover { background:#1e1c19; }
`;

function PeerTile({ stream, username, videoOn, audioOn }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && stream) ref.current.srcObject = stream; }, [stream]);
  return (
    <div className="avr-tile">
      {videoOn && stream ? <video ref={ref} autoPlay playsInline /> : <div className="avr-tile-avatar">{initials(username)}</div>}
      <div className="avr-tile-bar">
        <span className="avr-tile-name">{username}</span>
        <div className="avr-tile-icons">
          {!audioOn && <span>🔇</span>}
          {!videoOn && <span>📵</span>}
        </div>
      </div>
    </div>
  );
}

export default function AdminVideoRoom() {
  const { roomCode } = useParams();
  const navigate     = useNavigate();
  const user         = getUser();
  const myName       = user?.username || user?.email || "Admin";

  const [phase, setPhase]     = useState("lobby");
  const [roomInfo, setRoomInfo] = useState(null);
  const [loadErr, setLoadErr] = useState("");
  const [peers, setPeers]     = useState({});
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [tab, setTab]         = useState("people");
  const [messages, setMessages]   = useState([]);
  const [chatInput, setChatInput] = useState("");

  const socketRef      = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef  = useRef(null);
  const pcsRef         = useRef({});
  const chatEndRef     = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/api/rooms/${roomCode}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setRoomInfo(d.room); else setLoadErr(d.message || "Room not found"); })
      .catch(() => setLoadErr("Cannot reach server"));
  }, [roomCode]);

  // Start camera preview in lobby
  useEffect(() => {
    if (phase === "lobby") {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          localStreamRef.current = stream;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        })
        .catch(err => setLoadErr("Camera/mic access denied: " + err.message));
    }
  }, [phase]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const createPC = useCallback((remoteId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    localStreamRef.current?.getTracks().forEach(t => pc.addTrack(t, localStreamRef.current));
    pc.onicecandidate = ({ candidate }) => { if (candidate) socketRef.current?.emit("ice-candidate", { to: remoteId, candidate }); };
    pc.ontrack = ({ streams }) => setPeers(prev => ({ ...prev, [remoteId]: { ...prev[remoteId], stream: streams[0] } }));
    pcsRef.current[remoteId] = pc;
    return pc;
  }, []);

  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    Object.values(pcsRef.current).forEach(pc => pc.close());
    pcsRef.current = {};
    socketRef.current?.disconnect();
    socketRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const joinCall = async () => {
    try {
      // Use existing camera stream from lobby preview
      if (!localStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;

      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/rooms/${roomCode}/join`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });

      const socket = io(SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: false,
        reconnectionAttempts: 5,
        timeout: 10000,
      });
      socketRef.current = socket;

      socket.emit("join-room", { roomCode, userId: user?._id || user?.id, username: myName });

      socket.on("existing-peers", async (ids) => {
        for (const id of ids) {
          const pc = createPC(id);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("offer", { to: id, offer });
        }
      });

      socket.on("user-joined", ({ socketId, username }) => {
        setPeers(prev => ({ ...prev, [socketId]: { username, videoOn: true, audioOn: true } }));
        setMessages(prev => [...prev, { id: Date.now(), system: true, text: `${username} joined`, time: new Date().toISOString() }]);
      });

      socket.on("offer", async ({ from, offer }) => {
        const pc = createPC(from);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { to: from, answer });
      });

      socket.on("answer", async ({ from, answer }) => {
        const pc = pcsRef.current[from];
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on("ice-candidate", async ({ from, candidate }) => {
        try { await pcsRef.current[from]?.addIceCandidate(new RTCIceCandidate(candidate)); } catch {}
      });

      socket.on("user-left", ({ socketId, username }) => {
        pcsRef.current[socketId]?.close();
        delete pcsRef.current[socketId];
        setPeers(prev => { const c = { ...prev }; delete c[socketId]; return c; });
        setMessages(prev => [...prev, { id: Date.now(), system: true, text: `${username || "Someone"} left`, time: new Date().toISOString() }]);
      });

      socket.on("peer-video-toggle", ({ socketId, enabled }) =>
        setPeers(prev => ({ ...prev, [socketId]: { ...prev[socketId], videoOn: enabled } })));
      socket.on("peer-audio-toggle", ({ socketId, enabled }) =>
        setPeers(prev => ({ ...prev, [socketId]: { ...prev[socketId], audioOn: enabled } })));
      socket.on("chat-message", msg => setMessages(prev => [...prev, { ...msg, id: Date.now() }]));
      socket.on("room-ended", () => { cleanup(); setPhase("ended"); });

      setPhase("call");
    } catch (err) {
      setLoadErr("Camera/mic access denied: " + err.message);
    }
  };

  const toggleVideo = () => {
    const t = localStreamRef.current?.getVideoTracks()[0]; if (!t) return;
    t.enabled = !t.enabled; setVideoOn(t.enabled);
    socketRef.current?.emit("toggle-video", { roomCode, enabled: t.enabled });
  };

  const toggleAudio = () => {
    const t = localStreamRef.current?.getAudioTracks()[0]; if (!t) return;
    t.enabled = !t.enabled; setAudioOn(t.enabled);
    socketRef.current?.emit("toggle-audio", { roomCode, enabled: t.enabled });
  };

  const leaveCall = () => { cleanup(); navigate("/admin/rooms"); };

  const endRoom = async () => {
    socketRef.current?.emit("end-room", { roomCode });
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE_URL}/api/rooms/${roomCode}/close`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    cleanup(); setPhase("ended");
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    socketRef.current?.emit("chat-message", { roomCode, message: chatInput.trim(), username: myName });
    setChatInput("");
  };

  const total   = Object.keys(peers).length + 1;
  const gridCls = total <= 1 ? "g1" : total === 2 ? "g2" : total <= 4 ? "g3" : total <= 6 ? "g5" : "gn";

  if (phase === "lobby") return (
    <>
      <style>{css}</style>
      <div className="avr-lobby">
        <div className="avr-lobby-card">
          <p className="avr-lobby-tag">Room · {roomCode}</p>
          <h1 className="avr-lobby-title">{roomInfo?.title || "Loading…"}</h1>
          <div className="avr-host-badge"><span>●</span> You are the Host</div>
          <div className="avr-lobby-meta">
            {roomInfo && <>
              <div><b>Participants &nbsp;</b>{roomInfo.participants?.length || 0} joined</div>
              <div><b>Max &nbsp;</b>{roomInfo.maxParticipants}</div>
            </>}
          </div>
          {loadErr && <div className="avr-lobby-err">{loadErr}</div>}
          <video ref={localVideoRef} autoPlay muted playsInline className="avr-lobby-preview" />
          <button className="avr-lobby-join" onClick={joinCall} disabled={!!loadErr}>
            ▶ &nbsp;Start Class
          </button>
          <button className="avr-lobby-back" onClick={() => navigate("/admin/rooms")}>
            ← Back to Rooms
          </button>
        </div>
      </div>
    </>
  );

  if (phase === "ended") return (
    <>
      <style>{css}</style>
      <div className="avr-ended">
        <div className="avr-ended-icon">◻</div>
        <p className="avr-ended-title">Class Ended</p>
        <p className="avr-ended-sub">Session closed for all participants</p>
        <button className="avr-ended-btn" onClick={() => navigate("/admin/rooms")}>← Back to Rooms</button>
      </div>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="avr-root">
        <div className="avr-main">

          {/* Topbar */}
          <div className="avr-topbar">
            <div className="avr-topbar-l">
              <div className="avr-live-dot" />
              <span className="avr-room-title">{roomInfo?.title || roomCode}</span>
              <span className="avr-room-code">{roomCode}</span>
              <span className="avr-host-pill">Host</span>
            </div>
            <span className="avr-topbar-r">{total} in room</span>
          </div>

          {/* Video grid */}
          <div className={`avr-grid ${gridCls}`}>
            <div className="avr-tile me">
              {videoOn ? <video ref={localVideoRef} autoPlay muted playsInline /> : <div className="avr-tile-avatar">{initials(myName)}</div>}
              <div className="avr-tile-bar">
                <span className="avr-tile-name">{myName} (Host)</span>
                <div className="avr-tile-icons">{!audioOn && <span>🔇</span>}{!videoOn && <span>📵</span>}</div>
              </div>
            </div>
            {Object.entries(peers).map(([id, p]) => (
              <PeerTile key={id} stream={p.stream} username={p.username || "Student"} videoOn={p.videoOn !== false} audioOn={p.audioOn !== false} />
            ))}
          </div>

          {/* Controls */}
          <div className="avr-controls">
            <button className={`avr-ctrl ${!audioOn ? "off" : ""}`} onClick={toggleAudio}>
              <span>{audioOn ? "🎤" : "🔇"}</span>
              <span className="avr-ctrl-lbl">{audioOn ? "Mute" : "Unmute"}</span>
            </button>
            <button className={`avr-ctrl ${!videoOn ? "off" : ""}`} onClick={toggleVideo}>
              <span>{videoOn ? "📹" : "🚫"}</span>
              <span className="avr-ctrl-lbl">{videoOn ? "Video" : "No Cam"}</span>
            </button>
            <button className="avr-ctrl leave" onClick={leaveCall}>
              <span>🚪</span>
              <span className="avr-ctrl-lbl">Leave</span>
            </button>
            <button className="avr-end-btn" onClick={endRoom}>
              End Class for All
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="avr-sidebar">
          <div className="avr-tabs">
            <button className={`avr-tab ${tab === "people" ? "active" : ""}`} onClick={() => setTab("people")}>
              People ({total})
            </button>
            <button className={`avr-tab ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>
              Chat
            </button>
          </div>

          {tab === "people" && (
            <div className="avr-plist">
              {/* Admin (me) */}
              <div className="avr-pitem">
                <div className="avr-pavatar">{initials(myName)}</div>
                <div>
                  <div className="avr-pname">{myName} <span className="avr-admin-badge">Host</span></div>
                  <div className="avr-prole">You</div>
                </div>
                <div className="avr-picons">{audioOn ? "🎤" : "🔇"} {videoOn ? "📹" : "📵"}</div>
              </div>
              {/* Students */}
              {Object.entries(peers).map(([id, p]) => (
                <div key={id} className="avr-pitem">
                  <div className="avr-pavatar">{initials(p.username || "?")}</div>
                  <div>
                    <div className="avr-pname">{p.username || "Student"}</div>
                    <div className="avr-prole">Student</div>
                  </div>
                  <div className="avr-picons">
                    {p.audioOn !== false ? "🎤" : "🔇"} {p.videoOn !== false ? "📹" : "📵"}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "chat" && (
            <div className="avr-chat">
              <div className="avr-msgs">
                {messages.length === 0 && <p className="avr-no-msg">No messages yet</p>}
                {messages.map(msg => {
                  if (msg.system) return <div key={msg.id} className="avr-sys-msg">{msg.text}</div>;
                  const isMe = msg.username === myName;
                  return (
                    <div key={msg.id} className={isMe ? "avr-msg-me" : "avr-msg-other"}>
                      {!isMe && <div className="avr-msg-name">{msg.username}</div>}
                      <div className="avr-bubble">{msg.message}</div>
                      <div className="avr-msg-time">{timeFmt(msg.time)}</div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <div className="avr-chat-row">
                <input className="avr-chat-in" placeholder="Message…" value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()} />
                <button className="avr-chat-send" onClick={sendChat}>↑</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}