import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import meetingBg from '../../assets/meeting-bg.jpg';

const Login = () => {
  const [email, setEmail]               = useState('admin@smartsms.com');
  const [password, setPassword]         = useState('Admin@123');
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

        /* ── PAGE ── */
        .login-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          padding: 30px 20px;
          overflow: hidden;
        }

        /* ── BACKGROUND ── */
        .page-bg {
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
          transform: scale(1.05);
        }

        .page-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(5,8,22,0.82) 0%,
            rgba(15,20,50,0.65) 50%,
            rgba(5,8,22,0.85) 100%
          );
          z-index: 1;
        }

        .page-blob-1 {
          position: fixed;
          top: -100px; left: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%);
          z-index: 1; pointer-events: none;
        }
        .page-blob-2 {
          position: fixed;
          bottom: -80px; right: -80px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%);
          z-index: 1; pointer-events: none;
        }
        .page-blob-3 {
          position: fixed;
          top: 40%; left: 30%;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 65%);
          z-index: 1; pointer-events: none;
        }

        /* ── CARD ── */
        .login-layout {
          position: relative;
          z-index: 2;
          display: flex;
          width: 100%;
          max-width: 1080px;
          min-height: 600px;
          align-items: stretch;
          border-radius: 30px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08),
            0 50px 120px rgba(0,0,0,0.7),
            0 0 80px rgba(99,102,241,0.12);
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          flex: 1.25;
          padding: 60px 52px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: linear-gradient(
            160deg,
            rgba(15,23,42,0.55) 0%,
            rgba(30,27,75,0.45) 50%,
            rgba(15,23,42,0.55) 100%
          );
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-right: 1px solid rgba(255,255,255,0.07);
          position: relative;
          overflow: hidden;
        }

        .left-panel::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%);
          pointer-events: none;
        }
        .left-panel::after {
          content: '';
          position: absolute;
          bottom: 60px; left: -60px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 65%);
          pointer-events: none;
        }

        .left-top { position: relative; z-index: 1; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          padding: 7px 18px 7px 10px;
          color: #fff;
          font-size: 12px; font-weight: 500;
          margin-bottom: 32px;
          width: fit-content;
        }

        .badge-dot {
          width: 8px; height: 8px;
          background: #4ade80;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 10px rgba(74,222,128,0.9);
          animation: pulseDot 2s ease-in-out infinite;
        }

        @keyframes pulseDot {
          0%,100% { opacity:1; box-shadow:0 0 10px rgba(74,222,128,0.9); }
          50%      { opacity:0.4; box-shadow:0 0 3px rgba(74,222,128,0.3); }
        }

        .left-title {
          font-size: 44px; font-weight: 800;
          color: #fff; line-height: 1.15;
          letter-spacing: -1.5px; margin-bottom: 20px;
          text-shadow: 0 4px 24px rgba(0,0,0,0.5);
        }

        .left-title .highlight {
          background: linear-gradient(90deg, #818cf8, #a78bfa, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .left-desc {
          font-size: 14.5px;
          color: rgba(255,255,255,0.58);
          line-height: 1.85; max-width: 340px;
          text-shadow: 0 2px 10px rgba(0,0,0,0.4);
        }

        /* Feature pills */
        .feature-pills {
          display: flex; flex-direction: column;
          gap: 12px; margin-top: 36px;
          position: relative; z-index: 1;
        }

        .feature-pill {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 11px 16px;
          color: rgba(255,255,255,0.75);
          font-size: 13px; font-weight: 500;
          transition: background 0.2s, transform 0.2s;
        }

        .feature-pill:hover {
          background: rgba(255,255,255,0.11);
          transform: translateX(4px);
        }

        .feature-pill-icon {
          width: 32px; height: 32px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; flex-shrink: 0;
        }

        /* Stats row */
        .stats-row {
          display: flex; gap: 14px;
          position: relative; z-index: 1;
        }

        .stat-card {
          flex: 1;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: 20px 14px 18px;
          text-align: center;
          transition: background 0.3s, transform 0.3s;
          position: relative; overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: 18px;
          opacity: 0; transition: opacity 0.3s;
        }

        .stat-card:hover { transform: translateY(-4px); }
        .stat-card:hover::before { opacity: 1; }
        .stat-card-1::before { background: linear-gradient(135deg,rgba(99,102,241,0.25),transparent); }
        .stat-card-2::before { background: linear-gradient(135deg,rgba(20,184,166,0.25),transparent); }
        .stat-card-3::before { background: linear-gradient(135deg,rgba(245,158,11,0.25),transparent); }

        .stat-number {
          font-size: 28px; font-weight: 800;
          color: #fff; letter-spacing: -0.5px;
          line-height: 1; position: relative; z-index: 1;
        }

        .stat-label {
          font-size: 10.5px;
          color: rgba(255,255,255,0.45);
          margin-top: 7px; text-transform: uppercase;
          letter-spacing: 1px; font-weight: 600;
          position: relative; z-index: 1;
        }

        /* ══════════════════════════════
           ── RIGHT PANEL — WHITE ──
        ══════════════════════════════ */
        .right-panel {
          flex: 0.88;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 52px 48px 52px 44px;
          min-height: 600px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle color blobs on white bg */
        .right-panel::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%);
          pointer-events: none;
        }
        .right-panel::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 280px; height: 280px;
          background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%);
          pointer-events: none;
        }

        /* Vertical divider */
        .vert-line {
          position: absolute;
          left: 0; top: 8%; bottom: 8%;
          width: 1px;
          background: linear-gradient(
            180deg,
            transparent 0%,
            #e2e8f0 25%,
            #e2e8f0 75%,
            transparent 100%
          );
        }

        /* Logo */
        .logo-row {
          display: flex; align-items: center;
          gap: 13px; margin-bottom: 32px;
          position: relative; z-index: 1;
        }

        .logo-icon-box {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.35);
          flex-shrink: 0;
        }

        .logo-text h2 {
          font-size: 17px; font-weight: 800;
          color: #0f172a; letter-spacing: -0.2px;
        }

        .logo-text p {
          font-size: 11.5px; color: #94a3b8; margin-top: 2px;
        }

        /* Heading */
        .form-heading {
          margin-bottom: 28px;
          position: relative; z-index: 1;
        }

        .form-heading h1 {
          font-size: 28px; font-weight: 800;
          color: #0f172a; letter-spacing: -0.5px; line-height: 1.2;
        }

        .form-heading p {
          color: #94a3b8; font-size: 13.5px; margin-top: 7px;
        }

        /* Error */
        .error-msg {
          display: flex; align-items: center; gap: 9px;
          background: #fef2f2; border: 1px solid #fecaca;
          color: #dc2626; padding: 11px 14px;
          border-radius: 11px; margin-bottom: 18px;
          font-size: 13px; font-weight: 500;
          position: relative; z-index: 1;
        }

        /* Fields */
        .field-wrap {
          margin-bottom: 16px;
          position: relative; z-index: 1;
        }

        .field-label {
          display: block; font-size: 11.5px; font-weight: 600;
          color: #475569; margin-bottom: 8px;
          text-transform: uppercase; letter-spacing: 0.7px;
        }

        .input-box {
          position: relative; display: flex; align-items: center;
        }

        .input-prefix-icon {
          position: absolute; left: 14px; font-size: 15px;
          pointer-events: none; opacity: 0.45; z-index: 2; line-height: 1;
        }

        .form-input {
          width: 100%;
          padding: 13px 16px 13px 42px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          color: #0f172a; font-size: 14px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          caret-color: #6366f1;
        }

        .form-input::placeholder { color: #cbd5e1; }

        .form-input:focus {
          border-color: #6366f1;
          background: #eef2ff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .toggle-pw {
          position: absolute; right: 13px;
          background: none; border: none; cursor: pointer;
          font-size: 16px; opacity: 0.35;
          transition: opacity 0.2s; z-index: 2; padding: 2px;
        }

        .toggle-pw:hover { opacity: 0.75; }

        .forgot-row { text-align: right; margin-top: 8px; }

        .forgot-row a {
          font-size: 12.5px; color: #6366f1;
          text-decoration: none; font-weight: 600;
          transition: color 0.2s;
        }

        .forgot-row a:hover { color: #4f46e5; text-decoration: underline; }

        /* Sign In button */
        .sign-in-btn {
          width: 100%; padding: 14px;
          margin-top: 24px; margin-bottom: 20px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 55%, #8b5cf6 100%);
          color: #fff; border: none; border-radius: 13px;
          font-size: 15px; font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer; position: relative;
          overflow: hidden; z-index: 1;
          letter-spacing: 0.2px;
          box-shadow: 0 6px 24px rgba(99,102,241,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .sign-in-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0; transition: opacity 0.2s;
        }

        .sign-in-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.5);
        }

        .sign-in-btn:hover:not(:disabled)::before { opacity: 1; }
        .sign-in-btn:active:not(:disabled) { transform: translateY(0); }

        .sign-in-btn:disabled {
          opacity: 0.5; cursor: not-allowed; transform: none;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .spinner {
          display: inline-block; width: 15px; height: 15px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.65s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }

        /* Divider */
        .divider {
          display: flex; align-items: center;
          gap: 12px; margin-bottom: 16px;
          position: relative; z-index: 1;
        }

        .divider-line { flex: 1; height: 1px; background: #e2e8f0; }

        .divider span {
          font-size: 11px; color: #94a3b8; font-weight: 500;
          white-space: nowrap; text-transform: uppercase; letter-spacing: 0.6px;
        }

        /* Demo box */
        .demo-credentials {
          background: linear-gradient(135deg, #eef2ff, #f5f3ff);
          border: 1px solid #c7d2fe;
          border-radius: 14px; padding: 15px 18px;
          position: relative; z-index: 1;
        }

        .demo-title {
          font-size: 10.5px; font-weight: 700; color: #4f46e5;
          text-transform: uppercase; letter-spacing: 0.8px;
          margin-bottom: 10px;
          display: flex; align-items: center; gap: 6px;
        }

        .demo-row {
          display: flex; justify-content: space-between;
          align-items: center; padding: 3px 0;
        }

        .demo-key { font-size: 12px; color: #64748b; font-weight: 500; }

        .demo-val {
          font-size: 11.5px; color: #4338ca;
          font-family: 'Courier New', monospace;
          background: rgba(99,102,241,0.1);
          padding: 2px 9px; border-radius: 6px;
          border: 1px solid #c7d2fe; font-weight: 700;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 760px) {
          .left-panel { display: none; }
          .right-panel {
            padding: 44px 32px;
            min-height: auto;
            border-radius: 26px;
          }
          .login-layout { border-radius: 26px; }
        }
      `}</style>

      <div className="login-page">
        <div className="page-bg" style={{ backgroundImage: `url(${meetingBg})` }} />
        <div className="page-overlay" />
        <div className="page-blob-1" />
        <div className="page-blob-2" />
        <div className="page-blob-3" />

        <div className="login-layout">

          {/* ════ LEFT PANEL ════ */}
          <div className="left-panel">
            <div className="left-top">
              <div className="badge">
                <span className="badge-dot" />
                System Online · 2026
              </div>
              <h2 className="left-title">
                Manage Smarter,<br />
                <span className="highlight">Lead Better.</span>
              </h2>
              <p className="left-desc">
                Empowering educators and administrators with a unified
                platform to streamline student data, performance, and
                communication.
              </p>

              <div className="feature-pills">
                <div className="feature-pill">
                  <span className="feature-pill-icon"
                    style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                    📊
                  </span>
                  Real-time academic analytics
                </div>
                <div className="feature-pill">
                  <span className="feature-pill-icon"
                    style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                    ✅
                  </span>
                  Automated attendance tracking
                </div>
                <div className="feature-pill">
                  <span className="feature-pill-icon"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                    🎓
                  </span>
                  Smart enrollment management
                </div>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-card stat-card-1">
                <div className="stat-number">12K+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-card stat-card-2">
                <div className="stat-number">98%</div>
                <div className="stat-label">Uptime</div>
              </div>
              <div className="stat-card stat-card-3">
                <div className="stat-number">350+</div>
                <div className="stat-label">Schools</div>
              </div>
            </div>
          </div>

          {/* ════ RIGHT PANEL — WHITE ════ */}
          <div className="right-panel">
            <div className="vert-line" />

            {/* Logo */}
            <div className="logo-row">
              <div className="logo-icon-box">🏫</div>
              <div className="logo-text">
                <h2>Smart SMS</h2>
                <p>Student Management System</p>
              </div>
            </div>

            {/* Heading */}
            <div className="form-heading">
              <h1>Welcome back 👋</h1>
              <p>Sign in to access your dashboard</p>
            </div>

            {/* Error */}
            {error && (
              <div className="error-msg">
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="field-wrap">
                <label className="field-label">Email Address</label>
                <div className="input-box">
                  <span className="input-prefix-icon">📧</span>
                  <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@smartsms.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field-wrap">
                <label className="field-label">Password</label>
                <div className="input-box">
                  <span className="input-prefix-icon">🔒</span>
                  <input
                    className="form-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="forgot-row">
                  <a href="#">Forgot password?</a>
                </div>
              </div>

              <button
                type="submit"
                className="sign-in-btn"
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner" />Signing in...</>
                  : '🔐 Sign In'
                }
              </button>
            </form>

            {/* Divider */}
            <div className="divider">
              <div className="divider-line" />
              <span>Demo Credentials</span>
              <div className="divider-line" />
            </div>

            {/* Demo credentials */}
            <div className="demo-credentials">
              <div className="demo-title">
                <span>🧪</span> Test Access
              </div>
              <div className="demo-row">
                <span className="demo-key">Email</span>
                <span className="demo-val">admin@smartsms.com</span>
              </div>
              <div className="demo-row" style={{ marginTop: '6px' }}>
                <span className="demo-key">Password</span>
                <span className="demo-val">Admin@123</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
