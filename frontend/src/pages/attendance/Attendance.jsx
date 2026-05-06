import { useState, useEffect } from 'react';
import { attendanceAPI, enrollmentAPI } from '../../api/axios';

const Attendance = () => {
  const [enrollments,        setEnrollments]        = useState([]);
  const [attendance,         setAttendance]         = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState('');
  const [stats,              setStats]              = useState(null);
  const [showForm,           setShowForm]           = useState(false);
  const [form, setForm] = useState({
    enrollmentId: '',
    date:   new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    remarks: '',
  });

  useEffect(() => { fetchEnrollments(); }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await enrollmentAPI.getAll();
      setEnrollments(res.data.filter(e => e.status === 'ACTIVE'));
    } catch (err) { console.error(err); }
  };

  const fetchAttendance = async (enrollmentId) => {
    try {
      const [att, st] = await Promise.all([
        attendanceAPI.getByEnrollment(enrollmentId),
        attendanceAPI.getStats(enrollmentId),
      ]);
      setAttendance(att.data);
      setStats(st.data);
    } catch (err) { console.error(err); }
  };

  const handleEnrollmentChange = (id) => {
    setSelectedEnrollment(id);
    if (id) fetchAttendance(id);
    else { setAttendance([]); setStats(null); }
  };

  const handleMark = async (e) => {
    e.preventDefault();
    try {
      await attendanceAPI.mark({
        ...form, enrollmentId: parseInt(form.enrollmentId),
      });
      fetchAttendance(form.enrollmentId);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error marking attendance');
    }
  };

  /* status config */
  const statusCfg = {
    PRESENT: { gradient:'linear-gradient(135deg,#d1fae5,#a7f3d0)', color:'#065f46', dot:'#10b981', icon:'✅' },
    ABSENT:  { gradient:'linear-gradient(135deg,#fee2e2,#fecaca)', color:'#991b1b', dot:'#ef4444', icon:'❌' },
    LATE:    { gradient:'linear-gradient(135deg,#fef9c3,#fde68a)', color:'#92400e', dot:'#f59e0b', icon:'⏰' },
    EXCUSED: { gradient:'linear-gradient(135deg,#dbeafe,#bfdbfe)', color:'#1e40af', dot:'#3b82f6', icon:'🔵' },
  };

  /* avatar gradients */
  const avatarGrads = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
    'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  ];

  const pct = stats?.attendancePercentage ?? 0;
  const pctColor = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .att-wrap { font-family:'Inter',sans-serif; }

        /* ── HERO ── */
        .att-hero {
          position:relative; border-radius:24px;
          padding:32px 36px; margin-bottom:28px; overflow:hidden;
          background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#064e3b 100%);
          box-shadow:0 20px 60px rgba(6,78,59,0.35);
          display:flex; align-items:center; justify-content:space-between;
        }

        .att-hero::before {
          content:''; position:absolute; top:-80px; right:-80px;
          width:280px; height:280px;
          background:radial-gradient(circle,rgba(52,211,153,0.25) 0%,transparent 65%);
          pointer-events:none;
        }

        .att-hero::after {
          content:''; position:absolute; bottom:-60px; left:20%;
          width:220px; height:220px;
          background:radial-gradient(circle,rgba(79,172,254,0.15) 0%,transparent 65%);
          pointer-events:none;
        }

        .att-hero-left { position:relative; z-index:1; }

        .att-badge {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.14);
          border-radius:50px; padding:4px 13px;
          font-size:11.5px; font-weight:600;
          color:rgba(255,255,255,0.7);
          margin-bottom:12px;
          text-transform:uppercase; letter-spacing:0.5px;
        }

        .att-dot {
          width:7px; height:7px; border-radius:50%;
          background:#34d399; box-shadow:0 0 8px #34d399;
          animation:attPulse 2s ease infinite;
        }

        @keyframes attPulse {
          0%,100%{box-shadow:0 0 8px #34d399;}
          50%    {box-shadow:0 0 18px #34d399;}
        }

        .att-hero h1 {
          font-size:28px; font-weight:800; color:#fff;
          letter-spacing:-0.5px; margin-bottom:6px;
        }

        .att-hero h1 span {
          background:linear-gradient(90deg,#34d399,#4facfe);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        .att-hero p { font-size:14px; color:rgba(255,255,255,0.5); }

        .att-hero-right {
          position:relative; z-index:1;
          display:flex; gap:12px; align-items:center;
        }

        .hero-stat {
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:16px; padding:14px 18px;
          text-align:center; min-width:76px;
        }

        .hero-stat-num {
          font-size:22px; font-weight:800; color:#fff; line-height:1;
        }

        .hero-stat-label {
          font-size:10.5px; color:rgba(255,255,255,0.4);
          margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;
        }

        .mark-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 22px;
          background:linear-gradient(135deg,#34d399,#10b981);
          color:#064e3b; border:none; border-radius:13px;
          font-size:14px; font-weight:800;
          font-family:'Inter',sans-serif; cursor:pointer;
          box-shadow:0 6px 20px rgba(52,211,153,0.5);
          transition:transform 0.2s, box-shadow 0.2s;
          white-space:nowrap;
        }

        .mark-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(52,211,153,0.65);
        }

        /* ── FILTER CARD ── */
        .filter-card {
          background:#fff; border-radius:20px;
          padding:22px 24px; margin-bottom:24px;
          box-shadow:0 4px 24px rgba(0,0,0,0.07);
          border:1px solid #f1f5f9;
          display:flex; align-items:flex-end; gap:20px;
          flex-wrap:wrap;
        }

        .filter-group { display:flex; flex-direction:column; gap:7px; flex:1; min-width:260px; }

        .filter-label {
          font-size:12.5px; font-weight:700; color:#374151;
          text-transform:uppercase; letter-spacing:0.4px;
          display:flex; align-items:center; gap:6px;
        }

        .filter-select {
          padding:12px 36px 12px 14px;
          background:#f8fafc; border:2px solid #e2e8f0;
          border-radius:12px; font-size:14px; color:#0f172a;
          font-family:'Inter',sans-serif; outline:none;
          transition:border-color 0.2s, box-shadow 0.2s;
          cursor:pointer; width:100%;
          appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' viewBox='0 0 12 8'%3E%3Cpath stroke='%2394a3b8' stroke-width='1.5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat:no-repeat;
          background-position:right 14px center;
        }

        .filter-select:focus {
          border-color:#34d399;
          background-color:#f0fdf4;
          box-shadow:0 0 0 3px rgba(52,211,153,0.15);
        }

        .selected-info {
          background:linear-gradient(135deg,#f0fdf4,#dcfce7);
          border:1px solid #a7f3d0; border-radius:12px;
          padding:12px 16px; flex:1; min-width:200px;
          display:flex; align-items:center; gap:10px;
        }

        .selected-info-icon {
          width:38px; height:38px; border-radius:10px;
          background:linear-gradient(135deg,#34d399,#10b981);
          display:flex; align-items:center; justify-content:center;
          font-size:18px; flex-shrink:0;
        }

        .selected-info-text { font-size:13px; font-weight:600; color:#065f46; }
        .selected-info-sub  { font-size:11.5px; color:#6ee7b7; margin-top:2px; }

        /* ── STATS GRID ── */
        .stats-grid {
          display:grid;
          grid-template-columns:repeat(5,1fr);
          gap:16px; margin-bottom:24px;
        }

        .stat-card {
          border-radius:18px; overflow:hidden;
          box-shadow:0 6px 24px rgba(0,0,0,0.08);
          transition:transform 0.25s;
          cursor:default;
        }

        .stat-card:hover { transform:translateY(-4px); }

        .stat-card-top {
          padding:20px 16px 14px;
          display:flex; flex-direction:column; align-items:center; gap:8px;
        }

        .stat-icon {
          width:44px; height:44px; border-radius:13px;
          background:rgba(255,255,255,0.25);
          display:flex; align-items:center; justify-content:center;
          font-size:22px;
        }

        .stat-value {
          font-size:32px; font-weight:800; color:#fff;
          line-height:1; letter-spacing:-1px;
        }

        .stat-card-bot {
          padding:8px 16px 14px;
          text-align:center;
        }

        .stat-label-txt {
          font-size:12px; font-weight:700; color:rgba(255,255,255,0.75);
          text-transform:uppercase; letter-spacing:0.4px;
        }

        /* Progress ring for attendance % */
        .pct-ring-wrap {
          position:relative; display:flex;
          align-items:center; justify-content:center;
          width:70px; height:70px; margin:4px auto;
        }

        .pct-ring-svg { transform:rotate(-90deg); }

        .pct-ring-bg  { fill:none; stroke:rgba(255,255,255,0.2); stroke-width:5; }
        .pct-ring-fill{ fill:none; stroke:#fff; stroke-width:5;
          stroke-linecap:round; transition:stroke-dashoffset 1s ease; }

        .pct-ring-text {
          position:absolute; font-size:16px; font-weight:800;
          color:#fff; letter-spacing:-0.5px;
        }

        /* ── TABLE ── */
        .table-card {
          background:#fff; border-radius:20px; overflow:hidden;
          box-shadow:0 4px 24px rgba(0,0,0,0.07);
          border:1px solid #f1f5f9;
        }

        .att-tbl { width:100%; border-collapse:collapse; }

        .att-tbl thead tr {
          background:linear-gradient(135deg,#059669 0%,#34d399 60%,#4facfe 100%);
        }

        .att-tbl thead th {
          padding:16px 18px; text-align:left;
          font-size:11.5px; font-weight:700;
          color:rgba(255,255,255,0.92);
          text-transform:uppercase; letter-spacing:0.7px;
          white-space:nowrap;
        }

        .att-tbl tbody tr {
          border-bottom:1px solid #f8fafc;
          transition:background 0.18s;
        }

        .att-tbl tbody tr:last-child { border-bottom:none; }
        .att-tbl tbody tr:hover { background:#f0fdf4; }
        .att-tbl td { padding:14px 18px; vertical-align:middle; }

        .row-num {
          width:30px; height:30px; background:#f1f5f9;
          border-radius:8px; display:flex;
          align-items:center; justify-content:center;
          font-size:12.5px; font-weight:700; color:#94a3b8;
        }

        .avatar {
          width:38px; height:38px; border-radius:11px;
          display:flex; align-items:center; justify-content:center;
          font-size:15px; font-weight:800; color:#fff; flex-shrink:0;
          box-shadow:0 3px 10px rgba(0,0,0,0.15);
        }

        .student-cell { display:flex; align-items:center; gap:11px; }
        .s-name { font-size:14px; font-weight:700; color:#1e293b; }
        .s-num  { font-size:12px; color:#94a3b8; margin-top:1px; }

        .course-chip {
          display:inline-flex; align-items:center; gap:5px;
          background:linear-gradient(135deg,#f0fdf4,#dcfce7);
          color:#065f46; border:1px solid #a7f3d0;
          padding:5px 11px; border-radius:8px;
          font-size:12.5px; font-weight:700;
        }

        .date-chip {
          display:inline-flex; align-items:center; gap:5px;
          background:#f1f5f9; color:#475569;
          padding:5px 11px; border-radius:8px;
          font-size:12.5px; font-weight:600;
        }

        .status-badge {
          display:inline-flex; align-items:center; gap:5px;
          padding:5px 12px; border-radius:20px;
          font-size:12.5px; font-weight:700;
        }

        .status-dot { width:6px; height:6px; border-radius:50%; }

        .remarks-chip {
          background:#f8fafc; color:#64748b;
          padding:4px 10px; border-radius:7px;
          font-size:12.5px; font-weight:500;
          border:1px solid #e2e8f0;
          font-style:italic;
        }

        .tbl-footer {
          padding:14px 18px; border-top:1px solid #f1f5f9;
          background:linear-gradient(135deg,#f0fdf4,#f0f9ff);
          font-size:13px; color:#64748b;
          display:flex; justify-content:space-between; align-items:center;
        }

        .tbl-footer strong { color:#059669; }

        /* empty */
        .empty-state {
          padding:70px 20px; text-align:center;
        }

        .empty-icon { font-size:60px; opacity:0.3; margin-bottom:14px; }
        .empty-text { font-size:15px; color:#94a3b8; font-weight:500; }
        .empty-sub  { font-size:13px; color:#cbd5e1; margin-top:6px; }

        /* skeleton */
        .skel {
          border-radius:8px;
          background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);
          background-size:200% 100%;
          animation:shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0%  {background-position:200% 0;}
          100%{background-position:-200% 0;}
        }

        /* ── MODAL ── */
        .modal-overlay {
          position:fixed; inset:0;
          background:rgba(15,23,42,0.65);
          backdrop-filter:blur(8px);
          display:flex; align-items:center;
          justify-content:center; z-index:1000; padding:20px;
        }

        .modal-box {
          background:#fff; border-radius:24px;
          padding:36px; width:100%; max-width:500px;
          max-height:90vh; overflow-y:auto;
          box-shadow:0 30px 80px rgba(0,0,0,0.22);
          animation:modalIn 0.28s ease;
        }

        @keyframes modalIn {
          from{opacity:0;transform:scale(0.94) translateY(12px);}
          to  {opacity:1;transform:scale(1) translateY(0);}
        }

        .modal-header {
          display:flex; align-items:center;
          justify-content:space-between; margin-bottom:28px;
        }

        .modal-title-wrap { display:flex; align-items:center; gap:13px; }

        .modal-icon {
          width:48px; height:48px; border-radius:14px;
          background:linear-gradient(135deg,#34d399,#10b981);
          display:flex; align-items:center; justify-content:center;
          font-size:22px;
          box-shadow:0 6px 20px rgba(52,211,153,0.45);
        }

        .modal-title { font-size:20px; font-weight:800; color:#0f172a; letter-spacing:-0.3px; }
        .modal-sub   { font-size:13px; color:#94a3b8; margin-top:2px; }

        .modal-close {
          width:36px; height:36px; background:#f1f5f9;
          border:none; border-radius:10px; cursor:pointer;
          font-size:18px; color:#64748b;
          display:flex; align-items:center; justify-content:center;
          transition:background 0.2s; font-family:'Inter',sans-serif;
        }

        .modal-close:hover { background:#fee2e2; color:#e11d48; }

        .form-group { margin-bottom:18px; }

        .form-label {
          display:block; font-size:12.5px; font-weight:700;
          color:#374151; margin-bottom:8px;
          text-transform:uppercase; letter-spacing:0.4px;
        }

        .form-input, .form-select-m {
          width:100%; padding:12px 14px;
          background:#f8fafc; border:2px solid #e2e8f0;
          border-radius:12px; font-size:14px; color:#0f172a;
          font-family:'Inter',sans-serif; outline:none;
          transition:border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing:border-box;
        }

        .form-input::placeholder { color:#cbd5e1; }

        .form-input:focus, .form-select-m:focus {
          border-color:#34d399;
          background:#f0fdf4;
          box-shadow:0 0 0 3px rgba(52,211,153,0.15);
        }

        /* status picker */
        .status-picker {
          display:grid; grid-template-columns:1fr 1fr; gap:10px;
        }

        .status-opt {
          padding:10px 12px; border-radius:12px;
          border:2px solid #e2e8f0;
          background:#f8fafc; cursor:pointer;
          display:flex; align-items:center; gap:8px;
          font-size:13.5px; font-weight:700; color:#475569;
          font-family:'Inter',sans-serif;
          transition:all 0.2s;
        }

        .status-opt:hover { border-color:#34d399; }

        .status-opt.sel-PRESENT { background:linear-gradient(135deg,#d1fae5,#a7f3d0); border-color:#34d399; color:#065f46; }
        .status-opt.sel-ABSENT  { background:linear-gradient(135deg,#fee2e2,#fecaca); border-color:#ef4444; color:#991b1b; }
        .status-opt.sel-LATE    { background:linear-gradient(135deg,#fef9c3,#fde68a); border-color:#f59e0b; color:#92400e; }
        .status-opt.sel-EXCUSED { background:linear-gradient(135deg,#dbeafe,#bfdbfe); border-color:#3b82f6; color:#1e40af; }

        .modal-actions {
          display:flex; gap:12px; margin-top:24px; justify-content:flex-end;
        }

        .btn-cancel {
          padding:11px 22px; background:#f1f5f9; color:#475569;
          border:none; border-radius:11px; font-size:14px; font-weight:600;
          font-family:'Inter',sans-serif; cursor:pointer; transition:background 0.2s;
        }

        .btn-cancel:hover { background:#e2e8f0; }

        .btn-mark {
          padding:11px 26px;
          background:linear-gradient(135deg,#34d399,#10b981);
          color:#064e3b; border:none; border-radius:11px;
          font-size:14px; font-weight:800;
          font-family:'Inter',sans-serif; cursor:pointer;
          box-shadow:0 4px 14px rgba(52,211,153,0.45);
          transition:transform 0.2s, box-shadow 0.2s;
        }

        .btn-mark:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 22px rgba(52,211,153,0.55);
        }

        @media(max-width:900px){
          .stats-grid { grid-template-columns:repeat(3,1fr); }
        }

        @media(max-width:640px){
          .att-hero-right { display:none; }
          .stats-grid { grid-template-columns:1fr 1fr; }
          .att-hero h1 { font-size:22px; }
        }
      `}</style>

      <div className="att-wrap">

        {/* ══ HERO ══ */}
        <div className="att-hero">
          <div className="att-hero-left">
            <div className="att-badge">
              <span className="att-dot" />
              Attendance Tracker
            </div>
            <h1><span>Attendance</span> Monitor</h1>
            <p>Track and manage student attendance records</p>
          </div>

          <div className="att-hero-right">
            <div className="hero-stat">
              <div className="hero-stat-num">{enrollments.length}</div>
              <div className="hero-stat-label">Enrollments</div>
            </div>
            {stats && (
              <>
                <div className="hero-stat">
                  <div className="hero-stat-num">{stats.totalClasses}</div>
                  <div className="hero-stat-label">Classes</div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-num" style={{ color:'#34d399' }}>
                    {stats.attendancePercentage}%
                  </div>
                  <div className="hero-stat-label">Rate</div>
                </div>
              </>
            )}
            <button className="mark-btn" onClick={() => setShowForm(true)}>
              ✅ Mark Attendance
            </button>
          </div>
        </div>

        {/* ══ FILTER CARD ══ */}
        <div className="filter-card">
          <div className="filter-group">
            <label className="filter-label">
              👨‍🎓 Select Enrollment
            </label>
            <select
              className="filter-select"
              value={selectedEnrollment}
              onChange={e => handleEnrollmentChange(e.target.value)}
            >
              <option value="">— Choose an enrollment to view attendance —</option>
              {enrollments.map(e => (
                <option key={e.id} value={e.id}>
                  {e.studentName} → {e.courseName}
                </option>
              ))}
            </select>
          </div>

          {selectedEnrollment && (() => {
            const enr = enrollments.find(e => e.id === parseInt(selectedEnrollment));
            return enr ? (
              <div className="selected-info">
                <div className="selected-info-icon">👨‍🎓</div>
                <div>
                  <div className="selected-info-text">{enr.studentName}</div>
                  <div className="selected-info-sub">{enr.courseName}</div>
                </div>
              </div>
            ) : null;
          })()}
        </div>

        {/* ══ STATS CARDS ══ */}
        {stats && (
          <div className="stats-grid">

            {/* Total Classes */}
            <div className="stat-card"
              style={{ background:'linear-gradient(135deg,#1d4ed8,#3b82f6)',
                       boxShadow:'0 8px 28px rgba(29,78,216,0.4)' }}>
              <div className="stat-card-top">
                <div className="stat-icon">📅</div>
                <div className="stat-value">{stats.totalClasses}</div>
              </div>
              <div className="stat-card-bot">
                <div className="stat-label-txt">Total Classes</div>
              </div>
            </div>

            {/* Present */}
            <div className="stat-card"
              style={{ background:'linear-gradient(135deg,#059669,#34d399)',
                       boxShadow:'0 8px 28px rgba(5,150,105,0.4)' }}>
              <div className="stat-card-top">
                <div className="stat-icon">✅</div>
                <div className="stat-value">{stats.present}</div>
              </div>
              <div className="stat-card-bot">
                <div className="stat-label-txt">Present</div>
              </div>
            </div>

            {/* Absent */}
            <div className="stat-card"
              style={{ background:'linear-gradient(135deg,#dc2626,#f87171)',
                       boxShadow:'0 8px 28px rgba(220,38,38,0.4)' }}>
              <div className="stat-card-top">
                <div className="stat-icon">❌</div>
                <div className="stat-value">{stats.absent}</div>
              </div>
              <div className="stat-card-bot">
                <div className="stat-label-txt">Absent</div>
              </div>
            </div>

            {/* Late */}
            <div className="stat-card"
              style={{ background:'linear-gradient(135deg,#d97706,#fbbf24)',
                       boxShadow:'0 8px 28px rgba(217,119,6,0.4)' }}>
              <div className="stat-card-top">
                <div className="stat-icon">⏰</div>
                <div className="stat-value">{stats.late}</div>
              </div>
              <div className="stat-card-bot">
                <div className="stat-label-txt">Late</div>
              </div>
            </div>

            {/* Attendance % with ring */}
            <div className="stat-card"
              style={{
                background: pct >= 75
                  ? 'linear-gradient(135deg,#0f766e,#14b8a6)'
                  : pct >= 50
                  ? 'linear-gradient(135deg,#b45309,#f59e0b)'
                  : 'linear-gradient(135deg,#9f1239,#f43f5e)',
                boxShadow: `0 8px 28px ${
                  pct >= 75 ? 'rgba(20,184,166,0.4)'
                  : pct >= 50 ? 'rgba(245,158,11,0.4)'
                  : 'rgba(244,63,94,0.4)'
                }`,
              }}>
              <div className="stat-card-top" style={{ paddingBottom:'4px' }}>
                {/* SVG ring */}
                <div className="pct-ring-wrap">
                  <svg className="pct-ring-svg" width="70" height="70" viewBox="0 0 70 70">
                    <circle className="pct-ring-bg" cx="35" cy="35" r="28" />
                    <circle
                      className="pct-ring-fill"
                      cx="35" cy="35" r="28"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
                    />
                  </svg>
                  <span className="pct-ring-text">{pct}%</span>
                </div>
              </div>
              <div className="stat-card-bot">
                <div className="stat-label-txt">Attendance Rate</div>
              </div>
            </div>

          </div>
        )}

        {/* ══ TABLE ══ */}
        {(attendance.length > 0 || selectedEnrollment) && (
          <div className="table-card">
            <table className="att-tbl">
              <thead>
                <tr>
                  {['#','Date','Student','Course','Status','Remarks','Marked By']
                    .map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        <div className="empty-icon">✅</div>
                        <div className="empty-text">No attendance records yet</div>
                        <div className="empty-sub">
                          Click "Mark Attendance" to add the first record.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  attendance.map((a, idx) => {
                    const sc = statusCfg[a.status] || statusCfg.PRESENT;
                    const grad = avatarGrads[idx % avatarGrads.length];
                    return (
                      <tr key={a.id}>
                        {/* # */}
                        <td><div className="row-num">{idx + 1}</div></td>

                        {/* Date */}
                        <td>
                          <div className="date-chip">📅 {a.date}</div>
                        </td>

                        {/* Student */}
                        <td>
                          <div className="student-cell">
                            <div className="avatar" style={{ background: grad }}>
                              {(a.studentName || 'S').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="s-name">{a.studentName}</div>
                              <div className="s-num">{a.studentNumber}</div>
                            </div>
                          </div>
                        </td>

                        {/* Course */}
                        <td>
                          <div className="course-chip">
                            📚 {a.courseCode}
                          </div>
                        </td>

                        {/* Status */}
                        <td>
                          <span className="status-badge"
                            style={{ background: sc.gradient, color: sc.color }}
                          >
                            <span className="status-dot"
                              style={{ background: sc.dot }} />
                            {sc.icon} {a.status}
                          </span>
                        </td>

                        {/* Remarks */}
                        <td>
                          {a.remarks
                            ? <span className="remarks-chip">{a.remarks}</span>
                            : <span style={{ color:'#cbd5e1', fontSize:'13px' }}>—</span>
                          }
                        </td>

                        {/* Marked By */}
                        <td style={{ fontSize:'13px', color:'#64748b', fontWeight:'500' }}>
                          {a.markedByName || 'System'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {attendance.length > 0 && (
              <div className="tbl-footer">
                <span>
                  <strong>{attendance.length}</strong> record{attendance.length !== 1 ? 's' : ''} found
                </span>
                <span>
                  {stats?.present ?? 0} present ·{' '}
                  {stats?.absent ?? 0} absent ·{' '}
                  {stats?.late ?? 0} late
                </span>
              </div>
            )}
          </div>
        )}

        {/* ══ MODAL ══ */}
        {showForm && (
          <div className="modal-overlay"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title-wrap">
                  <div className="modal-icon">✅</div>
                  <div>
                    <div className="modal-title">Mark Attendance</div>
                    <div className="modal-sub">Record student attendance</div>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
              </div>

              <form onSubmit={handleMark}>

                <div className="form-group">
                  <label className="form-label">👨‍🎓 Enrollment *</label>
                  <select className="form-select-m" required
                    value={form.enrollmentId}
                    onChange={e => setForm({ ...form, enrollmentId: e.target.value })}
                  >
                    <option value="">— Select Enrollment —</option>
                    {enrollments.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.studentName} → {e.courseName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">📅 Date *</label>
                  <input className="form-input" type="date" required
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">📊 Status *</label>
                  <div className="status-picker">
                    {[
                      { val:'PRESENT', label:'Present', icon:'✅' },
                      { val:'ABSENT',  label:'Absent',  icon:'❌' },
                      { val:'LATE',    label:'Late',    icon:'⏰' },
                      { val:'EXCUSED', label:'Excused', icon:'🔵' },
                    ].map(opt => (
                      <button
                        key={opt.val} type="button"
                        className={`status-opt ${form.status === opt.val ? `sel-${opt.val}` : ''}`}
                        onClick={() => setForm({ ...form, status: opt.val })}
                      >
                        <span>{opt.icon}</span> {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">💬 Remarks</label>
                  <input className="form-input"
                    value={form.remarks}
                    onChange={e => setForm({ ...form, remarks: e.target.value })}
                    placeholder="Optional notes..."
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel"
                    onClick={() => setShowForm(false)}
                  >Cancel</button>
                  <button type="submit" className="btn-mark">
                    ✅ Save Attendance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Attendance;
