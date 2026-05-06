import { useState, useEffect } from 'react';
import { enrollmentAPI, studentAPI, courseAPI } from '../../api/axios';

const Enrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students,    setStudents]    = useState([]);
  const [courses,     setCourses]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [search,      setSearch]      = useState('');
  const [form, setForm] = useState({ studentId: '', courseId: '' });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [e, s, c] = await Promise.all([
        enrollmentAPI.getAll(),
        studentAPI.getAll(),
        courseAPI.getAll(),
      ]);
      setEnrollments(e.data);
      setStudents(s.data);
      setCourses(c.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    try {
      await enrollmentAPI.enroll({
        studentId: parseInt(form.studentId),
        courseId:  parseInt(form.courseId),
      });
      fetchAll();
      setShowForm(false);
      setForm({ studentId: '', courseId: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error enrolling student');
    }
  };

  const handleDrop = async (id) => {
    if (window.confirm('Drop this enrollment?')) {
      await enrollmentAPI.drop(id);
      fetchAll();
    }
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

  /* course code → theme color */
  const courseThemes = [
    { gradient:'linear-gradient(135deg,#667eea,#764ba2)', light:'#f5f3ff', text:'#4f46e5' },
    { gradient:'linear-gradient(135deg,#f093fb,#f5576c)', light:'#fff1f2', text:'#e11d48' },
    { gradient:'linear-gradient(135deg,#4facfe,#00f2fe)', light:'#eff6ff', text:'#0284c7' },
    { gradient:'linear-gradient(135deg,#43e97b,#38f9d7)', light:'#f0fdf4', text:'#16a34a' },
    { gradient:'linear-gradient(135deg,#fa709a,#fee140)', light:'#fff7ed', text:'#ea580c' },
    { gradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)', light:'#fdf4ff', text:'#9333ea' },
  ];

  const filtered = enrollments.filter(e =>
    (e.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.courseName  || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.courseCode  || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.studentNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  const activeCount    = enrollments.filter(e => e.status === 'ACTIVE').length;
  const droppedCount   = enrollments.filter(e => e.status === 'DROPPED').length;
  const completedCount = enrollments.filter(e => e.status === 'COMPLETED').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .enr-wrap { font-family:'Inter',sans-serif; }

        /* ── HERO ── */
        .enr-hero {
          position:relative; border-radius:24px;
          padding:32px 36px; margin-bottom:28px;
          overflow:hidden;
          background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);
          box-shadow:0 20px 60px rgba(15,52,96,0.4);
          display:flex; align-items:center;
          justify-content:space-between;
        }

        .enr-hero::before {
          content:''; position:absolute;
          top:-80px; right:-80px;
          width:280px; height:280px;
          background:radial-gradient(circle,rgba(79,172,254,0.28) 0%,transparent 65%);
          pointer-events:none;
        }

        .enr-hero::after {
          content:''; position:absolute;
          bottom:-60px; left:20%;
          width:220px; height:220px;
          background:radial-gradient(circle,rgba(67,233,123,0.18) 0%,transparent 65%);
          pointer-events:none;
        }

        .enr-hero-left { position:relative; z-index:1; }

        .enr-badge {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.14);
          border-radius:50px; padding:4px 13px;
          font-size:11.5px; font-weight:600;
          color:rgba(255,255,255,0.7);
          margin-bottom:12px;
          text-transform:uppercase; letter-spacing:0.5px;
        }

        .enr-dot {
          width:7px; height:7px; border-radius:50%;
          background:#4facfe;
          box-shadow:0 0 8px #4facfe;
          animation:enrPulse 2s ease infinite;
        }

        @keyframes enrPulse {
          0%,100%{box-shadow:0 0 8px #4facfe;}
          50%    {box-shadow:0 0 18px #4facfe;}
        }

        .enr-hero h1 {
          font-size:28px; font-weight:800; color:#fff;
          letter-spacing:-0.5px; margin-bottom:6px;
        }

        .enr-hero h1 span {
          background:linear-gradient(90deg,#4facfe,#00f2fe,#43e97b);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        .enr-hero p { font-size:14px; color:rgba(255,255,255,0.5); }

        .enr-hero-right {
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
          font-size:22px; font-weight:800;
          color:#fff; line-height:1;
        }

        .hero-stat-label {
          font-size:10.5px; color:rgba(255,255,255,0.4);
          margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;
        }

        .enroll-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 22px;
          background:linear-gradient(135deg,#4facfe,#00f2fe);
          color:#0c4a6e; border:none; border-radius:13px;
          font-size:14px; font-weight:800;
          font-family:'Inter',sans-serif; cursor:pointer;
          box-shadow:0 6px 20px rgba(79,172,254,0.5);
          transition:transform 0.2s, box-shadow 0.2s;
          white-space:nowrap;
        }

        .enroll-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(79,172,254,0.65);
        }

        /* ── STATS ROW ── */
        .stats-mini {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:16px; margin-bottom:24px;
        }

        .stat-mini-card {
          border-radius:16px; padding:18px 20px;
          display:flex; align-items:center; gap:14px;
          box-shadow:0 4px 20px rgba(0,0,0,0.07);
          border:1px solid rgba(255,255,255,0.8);
          transition:transform 0.2s;
        }

        .stat-mini-card:hover { transform:translateY(-2px); }

        .stat-mini-icon {
          width:46px; height:46px; border-radius:13px;
          display:flex; align-items:center;
          justify-content:center; font-size:22px;
          flex-shrink:0;
        }

        .stat-mini-num {
          font-size:26px; font-weight:800;
          line-height:1; letter-spacing:-0.5px;
        }

        .stat-mini-label {
          font-size:12px; font-weight:600;
          margin-top:3px; text-transform:uppercase; letter-spacing:0.4px;
        }

        /* ── TOOLBAR ── */
        .enr-toolbar {
          display:flex; align-items:center;
          justify-content:space-between;
          gap:16px; margin-bottom:20px; flex-wrap:wrap;
        }

        .search-wrap { position:relative; flex:1; max-width:420px; }

        .search-icon {
          position:absolute; left:14px; top:50%;
          transform:translateY(-50%);
          font-size:16px; opacity:0.4; pointer-events:none;
        }

        .search-input {
          width:100%; padding:12px 16px 12px 42px;
          background:#fff; border:2px solid #e2e8f0;
          border-radius:13px; font-size:14px;
          font-family:'Inter',sans-serif;
          outline:none; color:#0f172a;
          transition:border-color 0.2s, box-shadow 0.2s;
        }

        .search-input::placeholder { color:#cbd5e1; }

        .search-input:focus {
          border-color:#4facfe;
          box-shadow:0 0 0 3px rgba(79,172,254,0.15);
        }

        .result-count {
          font-size:13.5px; color:#94a3b8; font-weight:500;
          white-space:nowrap;
        }

        .result-count strong { color:#4f46e5; }

        /* ── TABLE ── */
        .table-card {
          background:#fff; border-radius:20px;
          overflow:hidden;
          box-shadow:0 4px 24px rgba(0,0,0,0.07);
          border:1px solid #f1f5f9;
        }

        .enr-tbl { width:100%; border-collapse:collapse; }

        .enr-tbl thead tr {
          background:linear-gradient(135deg,#0ea5e9 0%,#4facfe 50%,#00f2fe 100%);
        }

        .enr-tbl thead th {
          padding:16px 18px; text-align:left;
          font-size:11.5px; font-weight:700;
          color:rgba(255,255,255,0.92);
          text-transform:uppercase; letter-spacing:0.7px;
          white-space:nowrap;
        }

        .enr-tbl tbody tr {
          border-bottom:1px solid #f8fafc;
          transition:background 0.18s;
        }

        .enr-tbl tbody tr:last-child { border-bottom:none; }
        .enr-tbl tbody tr:hover { background:#f0f9ff; }

        .enr-tbl td { padding:14px 18px; vertical-align:middle; }

        /* row number */
        .row-num {
          width:30px; height:30px;
          background:#f1f5f9; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          font-size:12.5px; font-weight:700; color:#94a3b8;
        }

        /* avatar */
        .avatar {
          width:38px; height:38px; border-radius:11px;
          display:flex; align-items:center; justify-content:center;
          font-size:15px; font-weight:800; color:#fff;
          flex-shrink:0;
          box-shadow:0 3px 10px rgba(0,0,0,0.15);
        }

        .student-cell { display:flex; align-items:center; gap:11px; }

        .s-name {
          font-size:14px; font-weight:700; color:#1e293b;
        }

        .s-num {
          font-size:12px; color:#94a3b8; margin-top:1px;
        }

        /* course badge */
        .course-code-badge {
          display:inline-flex; align-items:center; gap:4px;
          padding:4px 10px; border-radius:8px;
          font-size:11.5px; font-weight:800;
          letter-spacing:0.3px; margin-bottom:3px;
        }

        .course-name-text {
          font-size:13px; font-weight:600; color:#374151;
        }

        /* date */
        .date-chip {
          display:inline-flex; align-items:center; gap:5px;
          background:#f1f5f9; color:#475569;
          padding:5px 11px; border-radius:8px;
          font-size:12.5px; font-weight:600;
        }

        /* status badge */
        .status-badge {
          display:inline-flex; align-items:center; gap:5px;
          padding:5px 12px; border-radius:20px;
          font-size:12.5px; font-weight:700;
        }

        .status-dot {
          width:6px; height:6px; border-radius:50%;
        }

        /* drop button */
        .btn-drop {
          display:inline-flex; align-items:center; gap:5px;
          padding:7px 14px; border:none; border-radius:10px;
          font-size:12.5px; font-weight:700;
          font-family:'Inter',sans-serif; cursor:pointer;
          background:linear-gradient(135deg,#fff1f2,#fee2e2);
          color:#e11d48;
          transition:all 0.2s;
          box-shadow:0 2px 8px rgba(225,29,72,0.15);
        }

        .btn-drop:hover {
          background:linear-gradient(135deg,#f43f5e,#e11d48);
          color:#fff;
          box-shadow:0 5px 16px rgba(225,29,72,0.45);
          transform:translateY(-1px);
        }

        /* table footer */
        .tbl-footer {
          padding:14px 18px;
          border-top:1px solid #f1f5f9;
          background:linear-gradient(135deg,#f0f9ff,#f0fdf4);
          font-size:13px; color:#64748b;
          display:flex; justify-content:space-between; align-items:center;
        }

        .tbl-footer strong { color:#0284c7; }

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

        /* empty */
        .empty-state {
          padding:70px 20px; text-align:center;
        }

        .empty-icon  { font-size:60px; opacity:0.3; margin-bottom:14px; }
        .empty-text  { font-size:15px; color:#94a3b8; font-weight:500; }
        .empty-sub   { font-size:13px; color:#cbd5e1; margin-top:6px; }

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

        .modal-title-wrap {
          display:flex; align-items:center; gap:13px;
        }

        .modal-icon {
          width:48px; height:48px; border-radius:14px;
          background:linear-gradient(135deg,#4facfe,#00f2fe);
          display:flex; align-items:center;
          justify-content:center; font-size:22px;
          box-shadow:0 6px 20px rgba(79,172,254,0.45);
        }

        .modal-title {
          font-size:20px; font-weight:800;
          color:#0f172a; letter-spacing:-0.3px;
        }

        .modal-sub { font-size:13px; color:#94a3b8; margin-top:2px; }

        .modal-close {
          width:36px; height:36px;
          background:#f1f5f9; border:none; border-radius:10px;
          cursor:pointer; font-size:18px; color:#64748b;
          display:flex; align-items:center; justify-content:center;
          transition:background 0.2s; font-family:'Inter',sans-serif;
        }

        .modal-close:hover { background:#fee2e2; color:#e11d48; }

        .form-group { margin-bottom:20px; }

        .form-label {
          display:block; font-size:12.5px; font-weight:700;
          color:#374151; margin-bottom:8px;
          text-transform:uppercase; letter-spacing:0.4px;
        }

        .form-select {
          width:100%; padding:12px 14px;
          background:#f8fafc; border:2px solid #e2e8f0;
          border-radius:12px; font-size:14px; color:#0f172a;
          font-family:'Inter',sans-serif; outline:none;
          transition:border-color 0.2s, box-shadow 0.2s;
          cursor:pointer;
          appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2394a3b8' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat:no-repeat;
          background-position:right 14px center;
          padding-right:36px;
        }

        .form-select:focus {
          border-color:#4facfe;
          background-color:#f0f9ff;
          box-shadow:0 0 0 3px rgba(79,172,254,0.15);
        }

        /* preview card */
        .preview-card {
          background:linear-gradient(135deg,#f0f9ff,#f0fdf4);
          border:1px solid #bae6fd;
          border-radius:14px; padding:14px 16px;
          margin-top:16px;
          display:flex; align-items:center; gap:12px;
        }

        .preview-icon {
          width:40px; height:40px; border-radius:11px;
          background:linear-gradient(135deg,#4facfe,#00f2fe);
          display:flex; align-items:center;
          justify-content:center; font-size:18px;
          flex-shrink:0;
        }

        .preview-text { font-size:13px; font-weight:600; color:#0369a1; }
        .preview-sub  { font-size:12px; color:#7dd3fc; margin-top:2px; }

        .modal-actions {
          display:flex; gap:12px;
          margin-top:24px; justify-content:flex-end;
        }

        .btn-cancel {
          padding:11px 22px; background:#f1f5f9; color:#475569;
          border:none; border-radius:11px; font-size:14px; font-weight:600;
          font-family:'Inter',sans-serif; cursor:pointer; transition:background 0.2s;
        }

        .btn-cancel:hover { background:#e2e8f0; }

        .btn-enroll {
          padding:11px 26px;
          background:linear-gradient(135deg,#4facfe,#00f2fe);
          color:#0c4a6e; border:none; border-radius:11px;
          font-size:14px; font-weight:800;
          font-family:'Inter',sans-serif; cursor:pointer;
          box-shadow:0 4px 14px rgba(79,172,254,0.45);
          transition:transform 0.2s, box-shadow 0.2s;
        }

        .btn-enroll:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 22px rgba(79,172,254,0.55);
        }

        @media(max-width:768px){
          .enr-hero-right { display:none; }
          .stats-mini { grid-template-columns:1fr; }
          .enr-hero h1 { font-size:22px; }
        }
      `}</style>

      <div className="enr-wrap">

        {/* ══ HERO ══ */}
        <div className="enr-hero">
          <div className="enr-hero-left">
            <div className="enr-badge">
              <span className="enr-dot" />
              Enrollment Management
            </div>
            <h1><span>Enrollments</span> Board</h1>
            <p>Track and manage all student course enrollments</p>
          </div>

          <div className="enr-hero-right">
            <div className="hero-stat">
              <div className="hero-stat-num">{enrollments.length}</div>
              <div className="hero-stat-label">Total</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{activeCount}</div>
              <div className="hero-stat-label">Active</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{students.length}</div>
              <div className="hero-stat-label">Students</div>
            </div>
            <button className="enroll-btn" onClick={() => setShowForm(true)}>
              ＋ Enroll Student
            </button>
          </div>
        </div>

        {/* ══ MINI STATS ══ */}
        <div className="stats-mini">
          <div className="stat-mini-card"
            style={{ background:'linear-gradient(135deg,#f0f9ff,#e0f2fe)' }}>
            <div className="stat-mini-icon"
              style={{ background:'linear-gradient(135deg,#4facfe,#00f2fe)' }}>
              ✅
            </div>
            <div>
              <div className="stat-mini-num" style={{ color:'#0284c7' }}>
                {activeCount}
              </div>
              <div className="stat-mini-label" style={{ color:'#7dd3fc' }}>
                Active Enrollments
              </div>
            </div>
          </div>

          <div className="stat-mini-card"
            style={{ background:'linear-gradient(135deg,#fff1f2,#fee2e2)' }}>
            <div className="stat-mini-icon"
              style={{ background:'linear-gradient(135deg,#f43f5e,#e11d48)' }}>
              ❌
            </div>
            <div>
              <div className="stat-mini-num" style={{ color:'#e11d48' }}>
                {droppedCount}
              </div>
              <div className="stat-mini-label" style={{ color:'#fca5a5' }}>
                Dropped
              </div>
            </div>
          </div>

          <div className="stat-mini-card"
            style={{ background:'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
            <div className="stat-mini-icon"
              style={{ background:'linear-gradient(135deg,#43e97b,#38f9d7)' }}>
              🎓
            </div>
            <div>
              <div className="stat-mini-num" style={{ color:'#16a34a' }}>
                {completedCount}
              </div>
              <div className="stat-mini-label" style={{ color:'#86efac' }}>
                Completed
              </div>
            </div>
          </div>
        </div>

        {/* ══ TOOLBAR ══ */}
        <div className="enr-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by student, course or code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="result-count">
            Showing <strong>{filtered.length}</strong> of{' '}
            <strong>{enrollments.length}</strong> enrollments
          </span>
        </div>

        {/* ══ TABLE ══ */}
        <div className="table-card">
          <table className="enr-tbl">
            <thead>
              <tr>
                {['#','Student','Course','Enrolled Date','Status','Actions']
                  .map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i}>
                    {[60,140,160,100,80,80].map((w,j) => (
                      <td key={j} style={{ padding:'16px 18px' }}>
                        <div className="skel" style={{ height:'14px', width:`${w}px` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-icon">📋</div>
                      <div className="empty-text">
                        {search
                          ? `No enrollments found for "${search}"`
                          : 'No enrollments yet!'}
                      </div>
                      <div className="empty-sub">
                        {!search && 'Click "Enroll Student" to add the first enrollment.'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((enr, idx) => {
                  const theme = courseThemes[idx % courseThemes.length];
                  const grad  = avatarGrads[idx % avatarGrads.length];

                  const statusStyles = {
                    ACTIVE:    { bg:'linear-gradient(135deg,#d1fae5,#a7f3d0)', color:'#065f46', dot:'#10b981' },
                    DROPPED:   { bg:'linear-gradient(135deg,#fee2e2,#fecaca)', color:'#991b1b', dot:'#ef4444' },
                    COMPLETED: { bg:'linear-gradient(135deg,#dbeafe,#bfdbfe)', color:'#1e40af', dot:'#3b82f6' },
                  };
                  const ss = statusStyles[enr.status] || statusStyles.ACTIVE;

                  return (
                    <tr key={enr.id}>
                      {/* # */}
                      <td>
                        <div className="row-num">{idx + 1}</div>
                      </td>

                      {/* Student */}
                      <td>
                        <div className="student-cell">
                          <div className="avatar" style={{ background: grad }}>
                            {(enr.studentName || 'S').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="s-name">{enr.studentName}</div>
                            <div className="s-num">{enr.studentNumber}</div>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td>
                        <div className="course-code-badge"
                          style={{ background: theme.light, color: theme.text }}
                        >
                          🎫 {enr.courseCode}
                        </div>
                        <div className="course-name-text">{enr.courseName}</div>
                      </td>

                      {/* Date */}
                      <td>
                        <div className="date-chip">
                          📅 {enr.enrolledDate}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className="status-badge"
                          style={{ background: ss.bg, color: ss.color }}
                        >
                          <span className="status-dot"
                            style={{ background: ss.dot }} />
                          {enr.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        {enr.status === 'ACTIVE' && (
                          <button className="btn-drop"
                            onClick={() => handleDrop(enr.id)}
                          >
                            ✕ Drop
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="tbl-footer">
              <span>
                <strong>{filtered.length}</strong> enrollment{filtered.length !== 1 ? 's' : ''} shown
              </span>
              <span>
                {activeCount} active · {droppedCount} dropped · {completedCount} completed
              </span>
            </div>
          )}
        </div>

        {/* ══ MODAL ══ */}
        {showForm && (
          <div className="modal-overlay"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title-wrap">
                  <div className="modal-icon">📋</div>
                  <div>
                    <div className="modal-title">Enroll Student</div>
                    <div className="modal-sub">
                      Assign a student to a course
                    </div>
                  </div>
                </div>
                <button className="modal-close"
                  onClick={() => setShowForm(false)}
                >✕</button>
              </div>

              <form onSubmit={handleEnroll}>
                <div className="form-group">
                  <label className="form-label">👨‍🎓 Select Student *</label>
                  <select className="form-select" required
                    value={form.studentId}
                    onChange={e => setForm({ ...form, studentId: e.target.value })}
                  >
                    <option value="">— Choose a student —</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.studentNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">📚 Select Course *</label>
                  <select className="form-select" required
                    value={form.courseId}
                    onChange={e => setForm({ ...form, courseId: e.target.value })}
                  >
                    <option value="">— Choose a course —</option>
                    {courses.filter(c => c.active).map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.name} ({c.credits} cr)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preview */}
                {form.studentId && form.courseId && (() => {
                  const st = students.find(s => s.id === parseInt(form.studentId));
                  const co = courses.find(c => c.id === parseInt(form.courseId));
                  return st && co ? (
                    <div className="preview-card">
                      <div className="preview-icon">✅</div>
                      <div>
                        <div className="preview-text">
                          {st.name} → {co.name}
                        </div>
                        <div className="preview-sub">
                          {st.studentNumber} · {co.code} · {co.credits} credits
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                <div className="modal-actions">
                  <button type="button" className="btn-cancel"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-enroll">
                    ✅ Confirm Enrollment
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

export default Enrollment;
