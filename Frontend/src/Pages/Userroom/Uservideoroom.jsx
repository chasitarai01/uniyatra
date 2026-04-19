// pages/user/UserVideoRoom.jsx
// Route: /room/:roomCode
// Student view — no End Class button, simplified controls

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
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Mono:wght@300;400&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Lobby ── */
.uvr-lobby {
  min-height: 100vh; background: #fff; font-family: 'DM Mono', monospace;
  display: flex; align-items: center; justify-content: center;
}
.uvr-lobby-card {
  width: 440px; max-width: 95vw; background: #fff;
  border: 1px solid #e8e2d9; border-top: 3px solid #998a6d; padding: 48px 40px;
}
.uvr-lobby-tag   { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: #998a6d; margin-bottom: 10px; }
.uvr-lobby-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; color: #2e2a24; margin-bottom: 6px; }
.uvr-lobby-title em { font-style: italic; color: #7a6e5a; }
.uvr-lobby-meta  { font-size: 10px; color: #a99d84; line-height: 2.2; letter-spacing: 0.05em; margin-bottom: 28px; }
.uvr-lobby-meta b { color: #7a6e5a; font-weight: 400; }
.uvr-lobby-preview {
  width: 100%; aspect-ratio: 16/9; object-fit: cover; background: #f5f0ea;
  border: 1px solid #e8e2d9; margin-bottom: 24px; display: block;
}
.uvr-lobby-join {
  width: 100%; padding: 14px; background: #2e2a24; color: #fff; border: none;
  font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.16em;
  text-transform: uppercase; cursor: pointer; transition: background 0.18s; margin-bottom: 10px;
}
.uvr-lobby-join:hover { background: #998a6d; }
.uvr-lobby-back {
  width: 100%; padding: 12px; background: transparent; color: #a99d84;
  border: 1px solid #e8e2d9; font-family: 'DM Mono', monospace; font-size: 10px;
  letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
}
.uvr-lobby-err { font-size: 11px; color: #c62828; background: #fde8e8; padding: 10px 14px; border-left: 2px solid #c62828; margin-bottom: 20px; }

/* ── Ended ── */
.uvr-ended {
  min-height: 100vh; background: #fff; font-family: 'DM Mono', monospace;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center;
}
.uvr-ended-icon  { font-size: 40px; opacity: 0.2; }
.uvr-ended-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: #2e2a24; }
.uvr-ended-sub   { font-size: 11px; color: #a99d84; letter-spacing: 0.08em; }
.uvr-ended-btn {
  margin-top: 8px; padding: 12px 28px; background: #2e2a24; color: #fff; border: none;
  font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
}
.uvr-ended-btn:hover { background: #998a6d; }

/* ── Call ── */
.uvr-root { display: flex; height: 100vh; background: #0c0b0a; font-family: 'DM Mono', monospace; color: #e8e2d9; overflow: hidden; }
.uvr-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

.uvr-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 18px; background: #111009; border-bottom: 1px solid #1e1c19; flex-shrink: 0;
}
.uvr-topbar-l { display: flex; align-items: center; gap: 10px; }
.uvr-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #66bb6a; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(102,187,106,0.4)} 50%{box-shadow:0 0 0 5px rgba(102,187,106,0)} }
.uvr-room-title { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 400; color: #e8e2d9; font-style: italic; }
.uvr-room-code  { font-size: 10px; letter-spacing: 0.18em; color: #998a6d; background: #1e1c19; padding: 3px 10px; }
.uvr-topbar-r   { font-size: 10px; color: #5c5244; }

/* Grid */
.uvr-grid { flex: 1; display: grid; gap: 4px; padding: 10px; background: #0c0b0a; overflow: hidden; align-content: start; }
.uvr-grid.g1{grid-template-columns:1fr}
.uvr-grid.g2{grid-template-columns:1fr 1fr}
.uvr-grid.g3,.uvr-grid.g4{grid-template-columns:repeat(2,1fr)}
.uvr-grid.g5,.uvr-grid.g6{grid-template-columns:repeat(3,1fr)}
.uvr-grid.gn{grid-template-columns:repeat(4,1fr)}

.uvr-tile { position: relative; background: #111009; border: 1px solid #1e1c19; aspect-ratio: 16/9; overflow: hidden; }
.uvr-tile.me { border-color: #c4b89a44; }
.uvr-tile video { width: 100%; height: 100%; object-fit: cover; display: block; }
.uvr-avatar {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #161410, #1e1c19);
  font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 400; color: #998a6d; font-style: italic;
}
.uvr-tile-bar {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.72));
  padding: 16px 10px 8px; display: flex; align-items: center; justify-content: space-between;
}
.uvr-tile-name  { font-size: 10px; letter-spacing: 0.08em; color: #e8e2d9; }
.uvr-tile-icons { display: flex; gap: 5px; font-size: 10px; }
.uvr-host-flag  { font-size: 8px; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(153,138,109,0.3); color: #c4b89a; padding: 2px 6px; margin-left: 6px; }

/* Controls */
.uvr-controls {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  padding: 16px 20px; background: #111009; border-top: 1px solid #1e1c19; flex-shrink: 0;
}
.uvr-ctrl {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  width: 56px; height: 56px; border-radius: 4px; border: 1px solid #2e2a24;
  background: #1e1c19; color: #a99d84; cursor: pointer; font-size: 18px; transition: all 0.15s;
}
.uvr-ctrl:hover { background: #2e2a24; }
.uvr-ctrl.off   { background: #2e1a1a; color: #ef5350; border-color: #4a2d2d; }
.uvr-ctrl.leave { background: #3a2020; color: #ef9090; border-color: #4a2d2d; }
.uvr-ctrl.leave:hover { background: #5c1f1f; }
.uvr-ctrl-lbl { font-size: 8px; letter-spacing: 0.08em; font-family: 'DM Mono', monospace; color: #5c5244; }

/* Sidebar */
.uvr-sidebar { width: 280px; background: #111009; border-left: 1px solid #1e1c19; display: flex; flex-direction: column; flex-shrink: 0; }
.uvr-tabs { display: flex; border-bottom: 1px solid #1e1c19; flex-shrink: 0; }
.uvr-tab {
  flex: 1; padding: 12px; background: transparent; border: none; border-bottom: 2px solid transparent;
  font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase;
  color: #5c5244; cursor: pointer; margin-bottom: -1px; transition: all 0.15s;
}
.uvr-tab.active { color: #998a6d; border-bottom-color: #998a6d; }

.uvr-plist { flex: 1; overflow-y: auto; padding: 10px; }
.uvr-pitem { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #1e1c19; }
.uvr-pitem:last-child { border-bottom: none; }
.uvr-pavatar {
  width: 34px; height: 34px; background: #1e1c19; display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif; font-size: 14px; color: #998a6d; font-style: italic; flex-shrink: 0;
}
.uvr-pname { font-size: 11px; color: #e8e2d9; }
.uvr-prole { font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: #5c5244; margin-top: 1px; }
.uvr-host-dot { width: 5px; height: 5px; border-radius: 50%; background: #66bb6a; display: inline-block; margin-right: 4px; }
.uvr-picons { margin-left: auto; font-size: 10px; display: flex; gap: 4px; }

.uvr-chat { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.uvr-msgs { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.uvr-msgs::-webkit-scrollbar { width: 3px; }
.uvr-msgs::-webkit-scrollbar-thumb { background: #2e2a24; }
.uvr-msg-me    { align-self: flex-end; max-width: 84%; }
.uvr-msg-other { align-self: flex-start; max-width: 84%; }
.uvr-msg-name  { font-size: 9px; color: #5c5244; letter-spacing: 0.06em; margin-bottom: 3px; }
.uvr-bubble    { padding: 8px 12px; font-size: 12px; color: #e8e2d9; line-height: 1.5; border-radius: 2px; }
.uvr-msg-me    .uvr-bubble { background: #998a6d; color: #0c0b0a; }
.uvr-msg-other .uvr-bubble { background: #1e1c19; }
.uvr-msg-time  { font-size: 9px; color: #5c5244; margin-top: 3px; text-align: right; }
.uvr-sys-msg   { text-align: center; font-size: 9px; color: #3d3830; letter-spacing: 0.08em; }
.uvr-no-msg    { text-align: center; font-size: 10px; color: #3d3830; padding: 28px 0; }

.uvr-chat-row { display: flex; border-top: 1px solid #1e1c19; flex-shrink: 0; }
.uvr-chat-in  { flex: 1; background: transparent; border: none; padding: 12px 14px; font-family: 'DM Mono', monospace; font-size: 12px; color: #e8e2d9; outline: none; }
.uvr-chat-in::placeholder { color: #3d3830; }
.uvr-chat-send { background: transparent; border: none; border-left: 1px solid #1e1c19; padding: 12px 16px; color: #998a6d; font-size: 16px; cursor: pointer; transition: background 0.15s; }
.uvr-chat-send:hover { background: #1e1c19; }
`;

function PeerTile({ stream, username, audioOn, videoOn, isHost }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && stream) ref.current.srcObject = stream; }, [stream]);
  return (
    <div className="uvr-tile">
      {videoOn && stream ? <video ref={ref} autoPlay playsInline /> : <div className="uvr-avatar">{initials(username)}</div>}
      <div className="uvr-tile-bar">
        <span className="uvr-tile-name">
          {username}
          {isHost && <span className="uvr-host-flag">Host</span>}
        </span>
        <div className="uvr-tile-icons">
          {!audioOn && <span>🔇</span>}
          {!videoOn && <span>📵</span>}
        </div>
      </div>
    </div>
  );
}

export default function UserVideoRoom() {
  const { roomCode } = useParams();
  const navigate     = useNavigate();
  const user         = getUser();
  const myName       = user?.username || user?.email || "Student";

  const [phase, setPhase]       = useState("lobby");
  const [roomInfo, setRoomInfo] = useState(null);
  const [loadErr, setLoadErr]   = useState("");
  const [peers, setPeers]       = useState({});
  const [videoOn, setVideoOn]   = useState(true);
  const [audioOn, setAudioOn]   = useState(true);
  const [tab, setTab]           = useState("chat");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const socketRef      = useRef(null);
  const localStreamRef = useRef(null);
  const localVideoRef  = useRef(null);
  const pcsRef         = useRef({});
  const chatEndRef     = useRef(null);

  // ── hostSocketId: track which socketId is the host ────────────────────────
  const [hostSocketId, setHostSocketId] = useState(null);

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
    return () => {
      if (phase === "lobby") {
        localStreamRef.current?.getTracks().forEach(t => t.stop());
      }
    };
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
      // Don't re-request camera — already started in lobby preview
      if (!localStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;

      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/rooms/${roomCode}/join`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      });

      const socket = io(SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: false,
        reconnectionAttempts: 5,
        timeout: 10000,
      });
      socketRef.current = socket;

      socket.emit("join-room", { roomCode, userId: user?._id || user?.id, username: myName });

      socket.on("existing-peers", async (ids) => {
        // First peer in list is likely the host (admin joined first)
        if (ids.length > 0) setHostSocketId(ids[0]);
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

      // Admin ended the class
      socket.on("room-ended", () => {
        cleanup();
        setMessages(prev => [...prev, { id: Date.now(), system: true, text: "The instructor ended the class", time: new Date().toISOString() }]);
        setTimeout(() => setPhase("ended"), 1500);
      });

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

  const leaveCall = () => { cleanup(); navigate("/classes"); };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    socketRef.current?.emit("chat-message", { roomCode, message: chatInput.trim(), username: myName });
    setChatInput("");
  };

  const total   = Object.keys(peers).length + 1;
  const gridCls = total <= 1 ? "g1" : total === 2 ? "g2" : total <= 4 ? "g3" : total <= 6 ? "g5" : "gn";

  // ── LOBBY ──────────────────────────────────────────────────────────────────
  if (phase === "lobby") return (
    <>
      <style>{css}</style>
      <div className="uvr-lobby">
        <div className="uvr-lobby-card">
          <p className="uvr-lobby-tag">Room · {roomCode}</p>
          <h1 className="uvr-lobby-title">{roomInfo ? <><em>{roomInfo.title}</em></> : "Loading…"}</h1>
          <div className="uvr-lobby-meta">
            {roomInfo && <>
              <div><b>Instructor &nbsp;</b>{roomInfo.createdBy?.username || "Admin"}</div>
              <div><b>Participants &nbsp;</b>{roomInfo.participants?.length || 0} joined</div>
              <div><b>Spots left &nbsp;</b>{roomInfo.maxParticipants - (roomInfo.participants?.length || 0)}</div>
            </>}
          </div>
          {loadErr && <div className="uvr-lobby-err">{loadErr}</div>}
          <video ref={localVideoRef} autoPlay muted playsInline className="uvr-lobby-preview" />
          <button className="uvr-lobby-join" onClick={joinCall} disabled={!!loadErr}>
            ▶ &nbsp;Join Class
          </button>
          <button className="uvr-lobby-back" onClick={() => navigate("/classes")}>
            ← Browse Classes
          </button>
        </div>
      </div>
    </>
  );

  // ── ENDED ──────────────────────────────────────────────────────────────────
  if (phase === "ended") return (
    <>
      <style>{css}</style>
      <div className="uvr-ended">
        <div className="uvr-ended-icon">○</div>
        <p className="uvr-ended-title"><em>Class Ended</em></p>
        <p className="uvr-ended-sub">The instructor has ended the session</p>
        <button className="uvr-ended-btn" onClick={() => navigate("/classes")}>← Browse Classes</button>
      </div>
    </>
  );

  // ── CALL ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="uvr-root">
        <div className="uvr-main">

          <div className="uvr-topbar">
            <div className="uvr-topbar-l">
              <div className="uvr-live-dot" />
              <span className="uvr-room-title">{roomInfo?.title || roomCode}</span>
              <span className="uvr-room-code">{roomCode}</span>
            </div>
            <span className="uvr-topbar-r">{total} in room</span>
          </div>

          <div className={`uvr-grid ${gridCls}`}>
            {/* Me */}
            <div className="uvr-tile me">
              {videoOn ? <video ref={localVideoRef} autoPlay muted playsInline /> : <div className="uvr-avatar">{initials(myName)}</div>}
              <div className="uvr-tile-bar">
                <span className="uvr-tile-name">{myName} (You)</span>
                <div className="uvr-tile-icons">{!audioOn && <span>🔇</span>}{!videoOn && <span>📵</span>}</div>
              </div>
            </div>
            {/* Peers */}
            {Object.entries(peers).map(([id, p]) => (
              <PeerTile
                key={id}
                stream={p.stream}
                username={p.username || "Participant"}
                videoOn={p.videoOn !== false}
                audioOn={p.audioOn !== false}
                isHost={id === hostSocketId}
              />
            ))}
          </div>

          {/* Controls — NO "End Class" button for students */}
          <div className="uvr-controls">
            <button className={`uvr-ctrl ${!audioOn ? "off" : ""}`} onClick={toggleAudio}>
              <span>{audioOn ? "🎤" : "🔇"}</span>
              <span className="uvr-ctrl-lbl">{audioOn ? "Mute" : "Unmute"}</span>
            </button>
            <button className={`uvr-ctrl ${!videoOn ? "off" : ""}`} onClick={toggleVideo}>
              <span>{videoOn ? "📹" : "🚫"}</span>
              <span className="uvr-ctrl-lbl">{videoOn ? "Video" : "No Cam"}</span>
            </button>
            <button className="uvr-ctrl leave" onClick={leaveCall}>
              <span>🚪</span>
              <span className="uvr-ctrl-lbl">Leave</span>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="uvr-sidebar">
          <div className="uvr-tabs">
            <button className={`uvr-tab ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>Chat</button>
            <button className={`uvr-tab ${tab === "people" ? "active" : ""}`} onClick={() => setTab("people")}>People ({total})</button>
          </div>

          {tab === "chat" && (
            <div className="uvr-chat">
              <div className="uvr-msgs">
                {messages.length === 0 && <p className="uvr-no-msg">No messages yet</p>}
                {messages.map(msg => {
                  if (msg.system) return <div key={msg.id} className="uvr-sys-msg">{msg.text}</div>;
                  const isMe = msg.username === myName;
                  return (
                    <div key={msg.id} className={isMe ? "uvr-msg-me" : "uvr-msg-other"}>
                      {!isMe && <div className="uvr-msg-name">{msg.username}</div>}
                      <div className="uvr-bubble">{msg.message}</div>
                      <div className="uvr-msg-time">{timeFmt(msg.time)}</div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <div className="uvr-chat-row">
                <input className="uvr-chat-in" placeholder="Ask a question…" value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendChat()} />
                <button className="uvr-chat-send" onClick={sendChat}>↑</button>
              </div>
            </div>
          )}

          {tab === "people" && (
            <div className="uvr-plist">
              {/* Me */}
              <div className="uvr-pitem">
                <div className="uvr-pavatar">{initials(myName)}</div>
                <div>
                  <div className="uvr-pname">{myName}</div>
                  <div className="uvr-prole">You</div>
                </div>
                <div className="uvr-picons">{audioOn ? "🎤" : "🔇"} {videoOn ? "📹" : "📵"}</div>
              </div>
              {/* Peers */}
              {Object.entries(peers).map(([id, p]) => (
                <div key={id} className="uvr-pitem">
                  <div className="uvr-pavatar">{initials(p.username || "?")}</div>
                  <div>
                    <div className="uvr-pname">{p.username || "Participant"}</div>
                    <div className="uvr-prole">
                      {id === hostSocketId && <span className="uvr-host-dot" />}
                      {id === hostSocketId ? "Instructor" : "Student"}
                    </div>
                  </div>
                  <div className="uvr-picons">
                    {p.audioOn !== false ? "🎤" : "🔇"} {p.videoOn !== false ? "📹" : "📵"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}