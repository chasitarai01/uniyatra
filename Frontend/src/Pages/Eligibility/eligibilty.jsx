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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .et-wrap {
          min-height: 100vh;
          background: #0d0d0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .et-wrap::before {
          content: '';
          position: fixed;
          top: -30%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .et-wrap::after {
          content: '';
          position: fixed;
          bottom: -20%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(180,100,255,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .et-card {
          background: #141416;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          width: 100%;
          max-width: 480px;
          padding: 48px 44px;
          position: relative;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset;
          animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .et-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #d4af37;
          margin-bottom: 10px;
          font-weight: 500;
        }

        .et-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #f5f0e8;
          line-height: 1.15;
          margin-bottom: 6px;
        }

        .et-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          line-height: 1.5;
          margin-bottom: 36px;
          font-weight: 300;
        }

        .et-user-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 100px;
          padding: 6px 14px 6px 8px;
          margin-bottom: 32px;
          animation: fadeIn 0.4s 0.3s both;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .et-avatar {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #d4af37, #b8860b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #0d0d0f;
        }

        .et-user-name {
          font-size: 12px;
          font-weight: 500;
          color: #d4af37;
        }

        .et-user-role {
          font-size: 11px;
          color: rgba(212,175,55,0.5);
        }

        .et-field {
          margin-bottom: 24px;
        }

        .et-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .et-label-text {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .et-label-value {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: #d4af37;
          font-weight: 700;
        }

        .et-input-wrap {
          position: relative;
        }

        .et-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 22px;
          font-family: 'Playfair Display', serif;
          color: #f5f0e8;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          -moz-appearance: textfield;
        }

        .et-input::-webkit-outer-spin-button,
        .et-input::-webkit-inner-spin-button { -webkit-appearance: none; }

        .et-input:focus {
          border-color: rgba(212,175,55,0.4);
          background: rgba(212,175,55,0.04);
          box-shadow: 0 0 0 4px rgba(212,175,55,0.06);
        }

        .et-progress-bar {
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          margin-top: 10px;
          overflow: hidden;
        }

        .et-progress-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, #b8860b, #d4af37, #f0d060);
          transition: width 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }

        .et-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 32px 0;
        }

        .et-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #c49b2a 100%);
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0d0d0f;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 4px 20px rgba(212,175,55,0.25);
        }

        .et-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(212,175,55,0.35);
        }

        .et-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .et-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .et-btn-loader {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .et-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.2);
          border-top-color: #0d0d0f;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .et-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(255,80,80,0.07);
          border: 1px solid rgba(255,80,80,0.2);
          border-radius: 10px;
          padding: 12px 14px;
          margin-top: 16px;
          animation: fadeIn 0.3s both;
        }

        .et-error-icon {
          font-size: 14px;
          margin-top: 1px;
          flex-shrink: 0;
        }

        .et-error-text {
          font-size: 13px;
          color: rgba(255,120,120,0.9);
          line-height: 1.5;
        }

        .et-result {
          margin-top: 28px;
          animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        .et-result-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .et-result-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .et-result-icon.pass {
          background: rgba(80,200,120,0.12);
          border: 1px solid rgba(80,200,120,0.25);
        }

        .et-result-icon.fail {
          background: rgba(255,100,80,0.12);
          border: 1px solid rgba(255,100,80,0.25);
        }

        .et-result-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          color: #f5f0e8;
        }

        .et-result-msg {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          margin-top: 4px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          border-left: 3px solid rgba(212,175,55,0.4);
        }

        .et-unis-title {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          color: #f5f0e8;
          margin: 24px 0 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .et-unis-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .et-uni-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          margin-bottom: 8px;
          transition: border-color 0.2s, background 0.2s;
          animation: slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        .et-uni-item:nth-child(1) { animation-delay: 0.05s; }
        .et-uni-item:nth-child(2) { animation-delay: 0.1s; }
        .et-uni-item:nth-child(3) { animation-delay: 0.15s; }

        .et-uni-item:hover {
          border-color: rgba(212,175,55,0.15);
          background: rgba(212,175,55,0.03);
        }

        .et-uni-num {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: #d4af37;
          flex-shrink: 0;
        }

        .et-uni-name {
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          font-weight: 400;
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
                <span className="et-label-value">{ieltsScore || "—"} <span style={{fontSize:'11px',color:'rgba(212,175,55,0.5)',fontFamily:'DM Sans'}}>/ 9.0</span></span>
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
                <span className="et-label-value">{gradeScore || "—"} <span style={{fontSize:'11px',color:'rgba(212,175,55,0.5)',fontFamily:'DM Sans'}}>%</span></span>
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
