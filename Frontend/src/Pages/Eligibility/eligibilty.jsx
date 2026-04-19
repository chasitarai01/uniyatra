import React, { useState, useEffect } from "react";
import axios from "axios";

const EligibilityTest = () => {
  const [ieltsScore, setIeltsScore] = useState("");
  const [gradeScore, setGradeScore] = useState("");
  const [eligibility, setEligibility] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEligibility(null);
    setUniversities([]);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please login first.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5001/api/eligibility/test",
        { ieltsScore: Number(ieltsScore), gradeScore: Number(gradeScore) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEligibility(res.data);

      const uniRes = await axios.get("http://localhost:5001/api/universities");
      const uniArray = Array.isArray(uniRes.data)
        ? uniRes.data
        : Array.isArray(uniRes.data.universities)
        ? uniRes.data.universities
        : [];
      setUniversities(uniArray.slice(0, 3));
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Unauthorized! Please login again.");
      } else {
        setError("Failed to check eligibility or fetch universities.");
      }
    } finally {
      setLoading(false);
    }
  };

  const ieltsPercent = ieltsScore ? (Number(ieltsScore) / 9) * 100 : 0;
  const gradePercent = gradeScore ? Number(gradeScore) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .et-wrap {
          min-height: calc(100vh - 80px);
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
        }

        .et-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 40px;
          width: 100%;
          max-width: 520px;
          padding: 60px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
          animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .et-eyebrow {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 12px;
          font-weight: 800;
        }

        .et-title {
          font-size: 36px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        .et-subtitle {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 40px;
          font-weight: 500;
        }

        .et-user-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #f1f5f9;
          border-radius: 100px;
          padding: 8px 16px 8px 10px;
          margin-bottom: 40px;
        }

        .et-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: #ffffff;
        }

        .et-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
        }

        .et-field {
          margin-bottom: 32px;
        }

        .et-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .et-label-text {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .et-label-value {
          font-size: 18px;
          color: #4f46e5;
          font-weight: 800;
        }

        .et-input {
          width: 100%;
          background: #f8fafc;
          border: 2px solid #f1f5f9;
          border-radius: 20px;
          padding: 16px 20px;
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }

        .et-input:focus {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.05);
        }

        .et-progress-bar {
          height: 4px;
          background: #f1f5f9;
          border-radius: 10px;
          margin-top: 12px;
          overflow: hidden;
        }

        .et-progress-fill {
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(90deg, #6366f1, #818cf8);
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .et-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 40px 0;
        }

        .et-btn {
          width: 100%;
          padding: 18px;
          background: #0f172a;
          border: none;
          border-radius: 20px;
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.1);
        }

        .et-btn:hover:not(:disabled) {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1);
        }

        .et-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .et-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .et-result {
          margin-top: 40px;
          padding: 30px;
          background: #f8fafc;
          border-radius: 30px;
          border: 1px solid #f1f5f9;
          animation: slideUp 0.4s both;
        }

        .et-result-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .et-result-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .et-result-icon.pass {
          background: #ecfdf5;
          color: #059669;
        }

        .et-result-icon.fail {
          background: #fef2f2;
          color: #dc2626;
        }

        .et-result-title {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a;
        }

        .et-result-msg {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          font-weight: 500;
        }

        .et-unis-title {
          font-size: 12px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 30px 0 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .et-unis-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .et-uni-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          margin-bottom: 10px;
          transition: all 0.2s;
        }

        .et-uni-item:hover {
          border-color: #6366f1;
          transform: translateX(4px);
        }

        .et-uni-num {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          color: #64748b;
        }

        .et-uni-name {
          font-size: 14px;
          color: #1e293b;
          font-weight: 700;
        }
      `}</style>

      <div className="et-wrap">
        <div className="et-card">
          <div className="et-eyebrow">Academic Assessment</div>
          <h1 className="et-title">Eligibility<br />Check</h1>
          <p className="et-subtitle">Enter your academic scores to discover your qualification status and matched universities.</p>

          {user && (
            <div className="et-user-badge">
              <div className="et-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="et-user-name">{user.name}</span>
              <span className="et-user-role">· {user.role}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="et-field">
              <div className="et-label">
                <span className="et-label-text">IELTS Score</span>
                <span className="et-label-value">{ieltsScore || "—"} <span style={{fontSize:'11px',color:'#94a3b8',fontFamily:'Plus Jakarta Sans'}}>/ 9.0</span></span>
              </div>
              <div className="et-input-wrap">
                <input
                  className="et-input"
                  type="number"
                  step="0.1"
                  value={ieltsScore}
                  onChange={(e) => setIeltsScore(e.target.value)}
                  onFocus={() => setFocused('ielts')}
                  onBlur={() => setFocused(null)}
                  required
                  min="0"
                  max="9"
                  placeholder="0.0"
                />
              </div>
              <div className="et-progress-bar">
                <div className="et-progress-fill" style={{ width: `${ieltsPercent}%` }} />
              </div>
            </div>

            <div className="et-field">
              <div className="et-label">
                <span className="et-label-text">Grade Score</span>
                <span className="et-label-value">{gradeScore || "—"} <span style={{fontSize:'11px',color:'#94a3b8',fontFamily:'Plus Jakarta Sans'}}>%</span></span>
              </div>
              <div className="et-input-wrap">
                <input
                  className="et-input"
                  type="number"
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  onFocus={() => setFocused('grade')}
                  onBlur={() => setFocused(null)}
                  required
                  min="0"
                  max="100"
                  placeholder="0"
                />
              </div>
              <div className="et-progress-bar">
                <div className="et-progress-fill" style={{ width: `${gradePercent}%` }} />
              </div>
            </div>

            <div className="et-divider" />

            <button className="et-btn" type="submit" disabled={loading}>
              {loading ? (
                <span className="et-btn-loader">
                  <span className="et-spinner" />
                  Analysing...
                </span>
              ) : "Check Eligibility"}
            </button>
          </form>

          {error && (
            <div className="et-error">
              <span className="et-error-icon">⚠</span>
              <span className="et-error-text">{error}</span>
            </div>
          )}

          {eligibility && (() => {
            // Robustly determine eligibility from any API response shape
            const msg = (eligibility.message || "").toLowerCase();
            const isEligible =
              eligibility.eligible === true ||
              eligibility.isEligible === true ||
              eligibility.status === "eligible" ||
              eligibility.status === "success" ||
              (!eligibility.hasOwnProperty('eligible') &&
               !eligibility.hasOwnProperty('isEligible') &&
               (msg.includes("congratulations") || msg.includes("eligible") || msg.includes("met")));

            return (
            <div className="et-result">
              <div className="et-result-header">
                <div className={`et-result-icon ${isEligible ? 'pass' : 'fail'}`}>
                  {isEligible ? '✓' : '✕'}
                </div>
                <div>
                  <div className="et-result-title">
                    {isEligible ? 'Eligible' : 'Not Eligible'}
                  </div>
                </div>
              </div>
              <div className="et-result-msg">{eligibility.message}</div>

              {universities.length > 0 && (
                <>
                  <div className="et-unis-title">Recommended</div>
                  {universities.map((uni, i) => (
                    <div className="et-uni-item" key={i}>
                      <div className="et-uni-num">{String(i + 1).padStart(2, '0')}</div>
                      <span className="et-uni-name">{uni.name || uni.UniversityName}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
            );
          })()}
        </div>
      </div>
    </>
  );
};

export default EligibilityTest;
