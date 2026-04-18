import React, { useState, useRef, useCallback } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileIcon = (file) => {
    if (!file) return "📄";
    const type = file.type;
    if (type.startsWith("image/")) return "🖼️";
    if (type.startsWith("video/")) return "🎬";
    if (type.startsWith("audio/")) return "🎵";
    if (type.includes("pdf")) return "📕";
    if (type.includes("zip") || type.includes("compressed")) return "🗜️";
    if (type.includes("sheet") || type.includes("excel")) return "📊";
    if (type.includes("document") || type.includes("word")) return "📝";
    return "📄";
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      setMessageType("error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Session expired. Please login again.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setProgress(0);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5001/api/file",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
          },
        }
      );

      setProgress(100);
      setMessage("File uploaded successfully!");
      setMessageType("success");
      console.log(response.data);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Upload failed. Please try again."
      );
      setMessageType("error");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setMessage("");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .fu-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }

        .fu-card {
          width: 100%;
          max-width: 480px;
          background: #111118;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 36px;
          position: relative;
          overflow: hidden;
        }

        .fu-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .fu-header {
          margin-bottom: 28px;
        }

        .fu-label-tag {
          display: inline-block;
          font-family: 'Syne', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6366f1;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 100px;
          padding: 4px 12px;
          margin-bottom: 14px;
        }

        .fu-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 800;
          color: #f4f4f6;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .fu-subtitle {
          font-size: 13.5px;
          color: #6b6b80;
          font-weight: 300;
        }

        .fu-dropzone {
          border: 1.5px dashed rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 32px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.22s ease;
          background: rgba(255,255,255,0.02);
          margin-bottom: 16px;
          position: relative;
        }

        .fu-dropzone:hover,
        .fu-dropzone.drag-over {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.05);
        }

        .fu-dropzone.has-file {
          border-style: solid;
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.04);
        }

        .fu-drop-icon {
          font-size: 38px;
          margin-bottom: 12px;
          display: block;
          transition: transform 0.2s;
        }

        .fu-dropzone:hover .fu-drop-icon {
          transform: translateY(-3px);
        }

        .fu-drop-text {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #c4c4d4;
          margin-bottom: 4px;
        }

        .fu-drop-sub {
          font-size: 12px;
          color: #4a4a5a;
        }

        .fu-drop-link {
          color: #6366f1;
          text-decoration: underline;
          text-underline-offset: 2px;
          cursor: pointer;
        }

        .fu-file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 16px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .fu-file-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        .fu-file-details {
          flex: 1;
          min-width: 0;
        }

        .fu-file-name {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #e4e4f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fu-file-size {
          font-size: 11px;
          color: #5a5a70;
          margin-top: 2px;
        }

        .fu-clear-btn {
          background: rgba(255,255,255,0.06);
          border: none;
          color: #6b6b80;
          border-radius: 6px;
          width: 28px; height: 28px;
          cursor: pointer;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s;
        }

        .fu-clear-btn:hover {
          background: rgba(239,68,68,0.15);
          color: #ef4444;
        }

        .fu-progress-wrap {
          margin-bottom: 16px;
        }

        .fu-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .fu-progress-label {
          font-size: 11px;
          color: #5a5a70;
          font-weight: 500;
        }

        .fu-progress-pct {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #6366f1;
        }

        .fu-progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255,255,255,0.06);
          border-radius: 100px;
          overflow: hidden;
        }

        .fu-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          border-radius: 100px;
          transition: width 0.3s ease;
        }

        .fu-btn {
          width: 100%;
          padding: 15px;
          background: #6366f1;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .fu-btn:hover:not(:disabled) {
          background: #5254cc;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
        }

        .fu-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .fu-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .fu-btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .fu-message {
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fu-message.success {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          color: #4ade80;
        }

        .fu-message.error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }

        .fu-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 24px 0 20px;
        }

        .fu-hint {
          font-size: 11.5px;
          color: #3a3a4a;
          text-align: center;
          line-height: 1.6;
        }

        .fu-hint span {
          color: #4a4a5a;
        }

        input[type="file"] { display: none; }
      `}</style>

      <div className="fu-root">
        <div className="fu-card">
          <div className="fu-header">
            <div className="fu-label-tag">File Upload</div>
            <h1 className="fu-title">Upload your document</h1>
            <p className="fu-subtitle">Drag & drop or browse to get started</p>
          </div>

          <form onSubmit={handleUpload}>
            <input
              ref={inputRef}
              type="file"
              id="file-input"
              onChange={handleFileChange}
            />

            {!file ? (
              <div
                className={`fu-dropzone${dragOver ? " drag-over" : ""}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current?.click()}
              >
                <span className="fu-drop-icon">☁️</span>
                <p className="fu-drop-text">Drop your file here</p>
                <p className="fu-drop-sub">
                  or{" "}
                  <span className="fu-drop-link">browse from device</span>
                </p>
              </div>
            ) : (
              <div className="fu-file-info">
                <span className="fu-file-icon">{getFileIcon(file)}</span>
                <div className="fu-file-details">
                  <div className="fu-file-name">{file.name}</div>
                  <div className="fu-file-size">{formatSize(file.size)}</div>
                </div>
                <button className="fu-clear-btn" onClick={clearFile} type="button">✕</button>
              </div>
            )}

            {loading && (
              <div className="fu-progress-wrap">
                <div className="fu-progress-header">
                  <span className="fu-progress-label">Uploading…</span>
                  <span className="fu-progress-pct">{progress}%</span>
                </div>
                <div className="fu-progress-bar">
                  <div className="fu-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button className="fu-btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="fu-btn-spinner" />
                  Uploading…
                </>
              ) : (
                <>
                  ↑ Upload File
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`fu-message ${messageType}`}>
              <span>{messageType === "success" ? "✓" : "✕"}</span>
              {message}
            </div>
          )}

          <div className="fu-divider" />
          <p className="fu-hint">
            <span>Supported:</span> Images, PDFs, Documents, Archives · <span>Max size:</span> 10 MB
          </p>
        </div>
      </div>
    </>
  );
};

export default FileUpload;