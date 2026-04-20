import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download, MessageSquare, Search, FileImage, ShieldAlert, CheckCircle, X } from "lucide-react";

const AdminFileManagement = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Feedback Modal State
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/file");
      if (response.ok) {
        const result = await response.json();
        // Extract array from response payload { data: [...] }
        const filesData = Array.isArray(result.data) ? result.data : [];
        setFiles(filesData);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSendFeedback = async () => {
    if (!feedbackMsg.trim() || !selectedFile) return;

    setSending(true);
    setErrorMsg("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          recipient: selectedFile.userId._id, 
          title: "Document Review Update",
          message: feedbackMsg,
          type: "document"
        }),
      });

      if (!res.ok) throw new Error("Failed to send feedback");

      setFeedbackSuccess(true);
      setTimeout(() => {
        setFeedbackSuccess(false);
        setSelectedFile(null);
        setFeedbackMsg("");
      }, 2000);

    } catch (err) {
      setErrorMsg("Could not deliver feedback. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const filteredFiles = files.filter(f => {
    const term = searchTerm.toLowerCase();
    const email = f.userId?.email?.toLowerCase() || "";
    const username = f.userId?.username?.toLowerCase() || "";
    return email.includes(term) || username.includes(term);
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Document Management</h1>
          <p className="text-slate-500 font-medium mt-1">Review user uploaded documents, download files, and send feedback.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by user email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
      </div>

      {/* Files Table Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Uploader</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Document</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Uploaded At</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-slate-400 font-bold">
                      Loading documents...
                    </td>
                  </tr>
                ) : filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <FileText className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold">No documents found matching your search</p>
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map((file) => (
                    <motion.tr
                      layout
                      key={file._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-500 shadow-sm">
                            {(file.userId?.username || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{file.userId?.username || "Unknown User"}</p>
                            <p className="text-xs font-medium text-slate-400">{file.userId?.email || "No Email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <a
                          href={file.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all w-fit"
                        >
                          <FileImage size={14} />
                          View File
                        </a>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-400 tracking-tighter">
                        {new Date(file.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={file.image}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download File"
                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          >
                            <Download size={18} />
                          </a>
                          <button
                            onClick={() => setSelectedFile(file)}
                            title="Send Feedback"
                            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          >
                            <MessageSquare size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {selectedFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFile(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <MessageSquare size={18} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Send Feedback</h2>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-8">
                <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Recipient</p>
                  <p className="text-sm font-bold text-slate-800">{selectedFile.userId?.username} ({selectedFile.userId?.email})</p>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Feedback Message
                  </label>
                  <textarea
                    value={feedbackMsg}
                    onChange={(e) => setFeedbackMsg(e.target.value)}
                    placeholder="E.g. Your document has been verified successfully..."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="mt-4 flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl text-sm font-bold">
                    <ShieldAlert size={16} />
                    {errorMsg}
                  </div>
                )}

                {feedbackSuccess && (
                  <div className="mt-4 flex items-center gap-2 text-emerald-500 bg-emerald-50 p-3 rounded-xl text-sm font-bold">
                    <CheckCircle size={16} />
                    Feedback sent successfully!
                  </div>
                )}

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendFeedback}
                    disabled={sending || !feedbackMsg.trim() || feedbackSuccess}
                    className="flex-[2] px-6 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>Send Notification</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminFileManagement;
