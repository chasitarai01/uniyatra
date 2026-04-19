import React, { useState, useRef, useCallback, useEffect } from "react";
import axios from "../../api/axios.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, File, X, CheckCircle, AlertCircle,
  Info, Shield, Zap, FileText, ImageIcon,
  Film, Music, Archive, Table
} from "lucide-react";

import { API_BASE_URL } from "../../config";
const API_BASE = API_BASE_URL;

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
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

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileIcon = (file) => {
    if (!file) return <FileText className="text-slate-400" />;
    const type = file.type;
    if (type.startsWith("image/")) return <ImageIcon className="text-indigo-500" />;
    if (type.startsWith("video/")) return <Film className="text-purple-500" />;
    if (type.startsWith("audio/")) return <Music className="text-sky-500" />;
    if (type.includes("pdf")) return <FileText className="text-rose-500" />;
    if (type.includes("zip")) return <Archive className="text-amber-500" />;
    if (type.includes("sheet") || type.includes("excel")) return <Table className="text-emerald-500" />;
    return <File className="text-indigo-500" />;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: "error", text: "Please select a file to continue." });
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setProgress(0);
      setMessage(null);

      const response = await axios.post(
        `${API_BASE}/api/file`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
          },
        }
      );

      setProgress(100);
      setMessage({ type: "success", text: "Document uploaded to secure vault successfully!" });
      setFile(null);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Upload failed. Maximum file size is 10MB."
      });
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Page Header */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          <Shield size={12} /> Encrypted Storage
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Application <span className="text-indigo-600">Documents.</span>
        </h1>
        <p className="text-slate-500 font-medium">Manage and upload your essential credentials for university applications.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Upload Section */}
        <div className="lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden"
          >
            <div className="p-10">
              <form onSubmit={handleUpload}>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => inputRef.current?.click()}
                  className={`relative group cursor-pointer rounded-[2rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-16 ${dragOver
                      ? "border-indigo-600 bg-indigo-50/50 scale-[0.99]"
                      : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50/50"
                    }`}
                >
                  <div className={`w-20 h-20 rounded-3xl mb-6 flex items-center justify-center transition-all duration-500 ${dragOver ? "bg-indigo-600 text-white scale-110 rotate-12" : "bg-indigo-50 text-indigo-600 group-hover:scale-110"
                    }`}>
                    <UploadCloud size={40} />
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-black text-slate-800 mb-2">Drop your file here</p>
                    <p className="text-sm font-bold text-slate-400">or <span className="text-indigo-600 underline">browse your device</span></p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 text-slate-200 opacity-20"><Zap size={40} /></div>
                </div>

                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-inner flex items-center justify-center text-2xl">
                        {getFileIcon(file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate">{file.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{formatSize(file.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="p-2 hover:bg-rose-50 hover:text-rose-500 text-slate-300 transition-all rounded-xl"
                      >
                        <X size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-indigo-600 hover:-translate-y-1 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>Push to Vault <Zap size={16} /></>
                    )}
                  </button>

                  <AnimatePresence>
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Uploading...</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-indigo-600"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mt-6 p-5 rounded-3xl flex items-center gap-4 border ${message.type === "success"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : "bg-rose-50 border-rose-100 text-rose-700"
                      }`}
                  >
                    {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="text-sm font-bold">{message.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full"></div>
            <h3 className="text-lg font-black mb-6 flex items-center gap-3">
              <Info size={20} className="text-indigo-400" /> Guidelines
            </h3>
            <ul className="space-y-6">
              {[
                { label: "Max File Size", value: "10 MB", desc: "Optimized for speed" },
                { label: "Formats", value: "PDF, JPG, PNG", desc: "Standard app formats" },
                { label: "Security", value: "256-bit", desc: "AES encrypted vault" }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-1 h-10 bg-indigo-500/30 rounded-full shrink-0"></div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{item.label}</p>
                    <p className="font-bold text-sm mt-0.5">{item.value}</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tight">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20"
          >
            <h4 className="text-lg font-black mb-3">Need Assistance?</h4>
            <p className="text-sm text-indigo-100 font-medium mb-6 leading-relaxed">
              If you're having trouble uploading certificates, connect with our support team instantly.
            </p>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all active:scale-95 shadow-lg shadow-black/10">
              Open Support Hub
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default FileUpload;