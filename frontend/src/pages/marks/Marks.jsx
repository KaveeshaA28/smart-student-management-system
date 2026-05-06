import { useState, useEffect } from 'react';
import { markAPI, enrollmentAPI } from '../../api/axios';

const Marks = () => {
  const [enrollments,        setEnrollments]        = useState([]);
  const [marks,              setMarks]              = useState([]);
  const [gpa,                setGpa]                = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState('');
  const [showForm,           setShowForm]           = useState(false);
  const [loading,            setLoading]            = useState(false);
  const [searchText,         setSearchText]         = useState('');
  const [form,               setForm]               = useState({
    enrollmentId:   '',
    assessmentType: 'QUIZ',
    marksObtained:  '',
    maxMarks:       '',
    remarks:        '',
  });

  useEffect(() => { fetchEnrollments(); }, []);
  useEffect(() => { if (selectedEnrollment) fetchMarks(); }, [selectedEnrollment]);

  const fetchEnrollments = async () => {
    try {
      const res    = await enrollmentAPI.getAll();
      const active = (res.data || []).filter(e => e.status === 'ACTIVE');
      setEnrollments(active);
    } catch {
      setEnrollments([]);
    }
  };

  const fetchMarks = async () => {
    setLoading(true);
    try {
      const [marksRes, gpaRes] = await Promise.all([
        markAPI.getByEnrollment(selectedEnrollment),
        markAPI.getGpaByEnrollment(selectedEnrollment),
      ]);
      setMarks(marksRes.data || []);
      setGpa(gpaRes.data);
    } catch (err) {
      console.error('Fetch marks error:', err.response?.data);
      setMarks([]);
      setGpa(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const obtained = Number(form.marksObtained);
    const max      = Number(form.maxMarks);

    if (!obtained || !max) {
      alert('Please enter valid marks.');
      return;
    }
    if (obtained > max) {
      alert(`Marks obtained (${obtained}) cannot exceed max marks (${max}).`);
      return;
    }

    try {
      const payload = {
        enrollmentId:   Number(selectedEnrollment || form.enrollmentId),
        assessmentType: form.assessmentType,
        marksObtained:  obtained,
        maxMarks:       max,
        remarks:        form.remarks?.trim() || '',
      };

      await markAPI.add(payload);

      setShowForm(false);
      setForm({
        enrollmentId:   '',
        assessmentType: 'QUIZ',
        marksObtained:  '',
        maxMarks:       '',
        remarks:        '',
      });

      if (selectedEnrollment) fetchMarks();

    } catch (err) {
      console.error('Save mark error:', err.response?.data);
      alert(
        err.response?.data?.message ||
        err.response?.data?.error   ||
        'Failed to save mark'
      );
    }
  };

  const getGrade = (obtained, max) => {
    const pct = (obtained / max) * 100;
    if (pct >= 90) return { label: 'A+', cfg: { bg: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff' } };
    if (pct >= 80) return { label: 'A',  cfg: { bg: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff' } };
    if (pct >= 70) return { label: 'B',  cfg: { bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: '#fff' } };
    if (pct >= 60) return { label: 'C',  cfg: { bg: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff' } };
    if (pct >= 50) return { label: 'D',  cfg: { bg: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff' } };
    return           { label: 'F',  cfg: { bg: 'linear-gradient(135deg,#ef4444,#dc2626)', color: '#fff' } };
  };

  const assessmentCfg = {
    QUIZ:       { bg: 'linear-gradient(135deg,#6366f1,#4f46e5)', icon: '📝' },
    ASSIGNMENT: { bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', icon: '📋' },
    MIDTERM:    { bg: 'linear-gradient(135deg,#f59e0b,#d97706)', icon: '📖' },
    FINAL:      { bg: 'linear-gradient(135deg,#ef4444,#dc2626)', icon: '🎯' },
    PROJECT:    { bg: 'linear-gradient(135deg,#10b981,#059669)', icon: '🚀' },
  };

  const avatarGrads = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
    'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  ];

  const filteredMarks = marks.filter(m =>
    !searchText ||
    m.assessmentType?.toLowerCase().includes(searchText.toLowerCase()) ||
    m.remarks?.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalPct = marks.length
    ? Math.round(
        marks.reduce((s, m) => s + (m.marksObtained / m.maxMarks) * 100, 0) /
        marks.length
      )
    : 0;

  const ringColor   = totalPct >= 75 ? '#10b981' : totalPct >= 50 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 36;
  const dashOffset    = circumference - (totalPct / 100) * circumference;

  const selEnr = enrollments.find(
    e => String(e.id) === String(selectedEnrollment)
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .mk-page { font-family:'Inter',sans-serif; background:#f0f4ff; min-height:100vh; padding-bottom:40px; }

        /* ── HERO ── */
        .mk-hero { background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 40%,#0f172a 100%); padding:40px 32px 48px; position:relative; overflow:hidden; }
        .mk-hero::before { content:''; position:absolute; top:-80px; right:-80px; width:340px; height:340px; background:radial-gradient(circle,rgba(139,92,246,.25) 0%,transparent 65%); pointer-events:none; }
        .mk-hero::after  { content:''; position:absolute; bottom:-60px; left:60px; width:260px; height:260px; background:radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 65%); pointer-events:none; }
        .mk-hero-inner { max-width:1200px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; }
        .mk-hero-left h1 { color:#fff; font-size:2rem; font-weight:800; margin:0 0 6px; }
        .mk-hero-left p  { color:rgba(255,255,255,.55); margin:0 0 20px; font-size:.95rem; }
        .mk-hero-badges  { display:flex; gap:10px; flex-wrap:wrap; }
        .mk-badge { padding:6px 14px; border-radius:20px; font-size:.78rem; font-weight:600; }
        .mk-badge-purple { background:rgba(139,92,246,.2); color:#c4b5fd; border:1px solid rgba(139,92,246,.3); }
        .mk-badge-blue   { background:rgba(99,102,241,.2);  color:#a5b4fc; border:1px solid rgba(99,102,241,.3); }
        .mk-badge-green  { background:rgba(16,185,129,.2);  color:#6ee7b7; border:1px solid rgba(16,185,129,.3); }
        .mk-hero-btn { padding:12px 28px; border-radius:12px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; font-weight:700; font-size:.95rem; border:none; cursor:pointer; box-shadow:0 4px 20px rgba(99,102,241,.45); transition:.2s; font-family:'Inter',sans-serif; }
        .mk-hero-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(99,102,241,.55); }

        /* ── MAIN ── */
        .mk-main { max-width:1200px; margin:0 auto; padding:0 24px; }

        /* ── FILTER CARD ── */
        .mk-filter { background:#fff; border-radius:20px; padding:24px 28px; margin-top:-24px; box-shadow:0 4px 24px rgba(0,0,0,.08); display:flex; align-items:center; gap:16px; flex-wrap:wrap; position:relative; z-index:2; }
        .mk-select-wrap { flex:1; min-width:240px; position:relative; }
        .mk-select-wrap::after { content:'▾'; position:absolute; right:14px; top:50%; transform:translateY(-50%); color:#6366f1; pointer-events:none; }
        .mk-select { width:100%; padding:12px 36px 12px 16px; border-radius:12px; border:1.5px solid #e2e8f0; font-family:'Inter',sans-serif; font-size:.9rem; color:#0f172a; appearance:none; background:#f8faff; transition:.2s; }
        .mk-select:focus { border-color:#6366f1; background:#eef2ff; outline:none; }
        .mk-enr-chip { background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(139,92,246,.1)); border:1px solid rgba(99,102,241,.25); border-radius:10px; padding:8px 16px; font-size:.82rem; color:#4f46e5; font-weight:600; white-space:nowrap; }
        .mk-search { padding:12px 16px; border-radius:12px; border:1.5px solid #e2e8f0; font-family:'Inter',sans-serif; font-size:.9rem; background:#f8faff; color:#0f172a; width:220px; transition:.2s; }
        .mk-search:focus { border-color:#6366f1; background:#eef2ff; outline:none; }

        /* ── STATS GRID ── */
        .mk-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-top:24px; }
        .mk-stat { border-radius:18px; padding:22px 20px; color:#fff; position:relative; overflow:hidden; }
        .mk-stat::before { content:attr(data-icon); position:absolute; right:14px; bottom:10px; font-size:2.6rem; opacity:.18; pointer-events:none; }
        .mk-stat h3 { font-size:.78rem; font-weight:600; opacity:.75; margin:0 0 6px; text-transform:uppercase; letter-spacing:.05em; }
        .mk-stat p  { font-size:1.9rem; font-weight:800; margin:0; }

        /* ── GPA RING CARD ── */
        .mk-gpa-card { background:linear-gradient(135deg,#1e1b4b,#312e81); border-radius:20px; padding:28px 32px; margin-top:24px; display:flex; align-items:center; gap:40px; flex-wrap:wrap; box-shadow:0 8px 32px rgba(99,102,241,.25); }
        .mk-gpa-ring { position:relative; width:100px; height:100px; flex-shrink:0; }
        .mk-gpa-ring svg { transform:rotate(-90deg); }
        .mk-gpa-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
        .mk-gpa-center span  { color:#fff; font-size:1.5rem; font-weight:800; line-height:1; }
        .mk-gpa-center small { color:rgba(255,255,255,.6); font-size:.68rem; }
        .mk-gpa-info h2 { color:#fff; font-size:1.5rem; font-weight:800; margin:0 0 4px; }
        .mk-gpa-info p  { color:rgba(255,255,255,.55); margin:0 0 14px; font-size:.9rem; }
        .mk-gpa-pills { display:flex; gap:10px; flex-wrap:wrap; }
        .mk-gpa-pill { background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.15); border-radius:8px; padding:6px 14px; color:#fff; font-size:.82rem; font-weight:600; }

        /* ── TABLE CARD ── */
        .mk-table-card { background:#fff; border-radius:22px; overflow:hidden; margin-top:24px; box-shadow:0 4px 24px rgba(0,0,0,.07); }
        .mk-table-head { background:linear-gradient(135deg,#1e1b4b,#312e81); padding:20px 24px; display:flex; align-items:center; justify-content:space-between; }
        .mk-table-head h3 { color:#fff; font-size:1rem; font-weight:700; margin:0; }
        .mk-table-head span { color:rgba(255,255,255,.6); font-size:.82rem; }
        table.mk-table { width:100%; border-collapse:collapse; }
        table.mk-table th { background:#f8faff; color:#475569; font-size:.78rem; font-weight:700; text-transform:uppercase; letter-spacing:.06em; padding:12px 16px; text-align:left; border-bottom:2px solid #e2e8f0; }
        table.mk-table td { padding:14px 16px; border-bottom:1px solid #f1f5f9; vertical-align:middle; font-size:.88rem; color:#334155; }
        table.mk-table tr:hover td { background:#f8faff; }
        .mk-assess-badge { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:8px; color:#fff; font-size:.78rem; font-weight:700; }
        .mk-grade-badge { padding:4px 12px; border-radius:8px; font-size:.78rem; font-weight:800; display:inline-block; }
        .mk-pct-bar-wrap { display:flex; align-items:center; gap:8px; }
        .mk-pct-bar { height:6px; border-radius:3px; flex:1; background:#e2e8f0; overflow:hidden; min-width:80px; }
        .mk-pct-fill { height:100%; border-radius:3px; transition:.4s; }
        .mk-empty { text-align:center; padding:60px 20px; color:#94a3b8; }
        .mk-empty-icon { font-size:3rem; margin-bottom:10px; }
        .mk-footer { padding:16px 24px; background:#f8faff; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; border-top:1px solid #e2e8f0; }
        .mk-footer span { font-size:.82rem; color:#64748b; }

        /* ── SKELETON ── */
        .mk-skel td { padding:14px 16px; }
        .mk-skel-line { border-radius:6px; background:linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* ── MODAL ── */
        .mk-overlay { position:fixed; inset:0; background:rgba(0,0,0,.55); backdrop-filter:blur(6px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
        .mk-modal { background:#fff; border-radius:24px; width:100%; max-width:520px; box-shadow:0 30px 80px rgba(0,0,0,.3); overflow:hidden; max-height:90vh; overflow-y:auto; }
        .mk-modal-head { background:linear-gradient(135deg,#1e1b4b,#4f46e5); padding:24px 28px; position:sticky; top:0; z-index:1; }
        .mk-modal-head h2 { color:#fff; font-size:1.1rem; font-weight:700; margin:0 0 4px; }
        .mk-modal-head p  { color:rgba(255,255,255,.6); font-size:.85rem; margin:0; }
        .mk-modal-body { padding:28px; display:flex; flex-direction:column; gap:16px; }
        .mk-field label { display:block; font-size:.8rem; font-weight:600; color:#475569; margin-bottom:6px; text-transform:uppercase; letter-spacing:.05em; }
        .mk-field input, .mk-field select, .mk-field textarea { width:100%; padding:12px 14px; border-radius:12px; border:1.5px solid #e2e8f0; font-family:'Inter',sans-serif; font-size:.9rem; color:#0f172a; background:#f8faff; box-sizing:border-box; transition:.2s; }
        .mk-field input:focus,.mk-field select:focus,.mk-field textarea:focus { border-color:#6366f1; background:#eef2ff; outline:none; }
        .mk-field-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .mk-assess-types { display:flex; gap:8px; flex-wrap:wrap; }
        .mk-type-btn { padding:7px 14px; border-radius:8px; border:1.5px solid #e2e8f0; background:#f8faff; font-size:.8rem; font-weight:600; cursor:pointer; transition:.2s; color:#475569; font-family:'Inter',sans-serif; }
        .mk-type-btn.active { border-color:transparent; color:#fff; }
        .mk-type-btn:hover { border-color:#6366f1; color:#6366f1; }
        .mk-type-btn.active:hover { color:#fff; }
        .mk-modal-foot { padding:18px 28px; border-top:1px solid #f1f5f9; display:flex; gap:12px; justify-content:flex-end; position:sticky; bottom:0; background:#fff; }
        .mk-btn-cancel { padding:10px 24px; border-radius:10px; background:#f1f5f9; color:#475569; font-weight:600; font-size:.9rem; border:none; cursor:pointer; transition:.2s; font-family:'Inter',sans-serif; }
        .mk-btn-cancel:hover { background:#e2e8f0; }
        .mk-btn-save { padding:10px 24px; border-radius:10px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; font-weight:700; font-size:.9rem; border:none; cursor:pointer; box-shadow:0 4px 16px rgba(99,102,241,.4); transition:.2s; font-family:'Inter',sans-serif; }
        .mk-btn-save:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(99,102,241,.5); }

        /* ── EMPTY STATE ── */
        .mk-empty-state { text-align:center; padding:80px 20px; color:#94a3b8; }
        .mk-empty-state-icon { font-size:3.5rem; margin-bottom:12px; }

        /* ── RESPONSIVE ── */
        @media(max-width:680px) {
          .mk-hero-left h1 { font-size:1.5rem; }
          .mk-field-row { grid-template-columns:1fr; }
          .mk-gpa-card { flex-direction:column; gap:20px; }
          .mk-main { padding:0 16px; }
        }
      `}</style>

      <div className="mk-page">

        {/* ── HERO ── */}
        <div className="mk-hero">
          <div className="mk-hero-inner">
            <div className="mk-hero-left">
              <h1>📊 Marks & Grades</h1>
              <p>Track academic performance, GPA and assessment results</p>
              <div className="mk-hero-badges">
                <span className="mk-badge mk-badge-purple">
                  🎓 {enrollments.length} Active Enrollments
                </span>
                <span className="mk-badge mk-badge-blue">
                  📝 {marks.length} Records
                </span>
                {gpa && (
                  <span className="mk-badge mk-badge-green">
                    ⭐ GPA {Number(gpa.gpa || 0).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
            <button className="mk-hero-btn" onClick={() => setShowForm(true)}>
              + Add Mark
            </button>
          </div>
        </div>

        <div className="mk-main">

          {/* ── FILTER ── */}
          <div className="mk-filter">
            <div className="mk-select-wrap">
              <select
                className="mk-select"
                value={selectedEnrollment}
                onChange={e => setSelectedEnrollment(e.target.value)}
              >
                <option value="">— Select Enrollment —</option>
                {enrollments.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.student?.name || e.studentName || `Student #${e.studentId}`}
                    {' — '}
                    {e.course?.name  || e.courseName  || `Course #${e.courseId}`}
                  </option>
                ))}
              </select>
            </div>

            {selEnr && (
              <span className="mk-enr-chip">
                🎓 {selEnr.student?.name || `Student #${selEnr.studentId}`}
                {' · '}
                {selEnr.course?.name || `Course #${selEnr.courseId}`}
              </span>
            )}

            {selectedEnrollment && (
              <input
                className="mk-search"
                placeholder="🔍 Search assessments…"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            )}
          </div>

          {/* ── CONTENT ── */}
          {selectedEnrollment ? (
            <>
              {/* Stats */}
              <div className="mk-stats">
                {[
                  {
                    label: 'Total Marks',
                    val: marks.length,
                    icon: '📝',
                    bg: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                  },
                  {
                    label: 'Avg Score',
                    val: marks.length
                      ? Math.round(
                          marks.reduce(
                            (s, m) => s + (m.marksObtained / m.maxMarks) * 100,
                            0
                          ) / marks.length
                        ) + '%'
                      : '—',
                    icon: '📈',
                    bg: 'linear-gradient(135deg,#10b981,#059669)',
                  },
                  {
                    label: 'Highest',
                    val: marks.length
                      ? Math.round(
                          Math.max(
                            ...marks.map(m => (m.marksObtained / m.maxMarks) * 100)
                          )
                        ) + '%'
                      : '—',
                    icon: '🏆',
                    bg: 'linear-gradient(135deg,#f59e0b,#d97706)',
                  },
                  {
                    label: 'Lowest',
                    val: marks.length
                      ? Math.round(
                          Math.min(
                            ...marks.map(m => (m.marksObtained / m.maxMarks) * 100)
                          )
                        ) + '%'
                      : '—',
                    icon: '📉',
                    bg: 'linear-gradient(135deg,#ef4444,#dc2626)',
                  },
                  {
                    label: 'GPA',
                    val: gpa ? Number(gpa.gpa || 0).toFixed(2) : '—',
                    icon: '⭐',
                    bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="mk-stat"
                    data-icon={s.icon}
                    style={{ background: s.bg }}
                  >
                    <h3>{s.label}</h3>
                    <p>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* GPA Ring Card */}
              {gpa && (
                <div className="mk-gpa-card">
                  <div className="mk-gpa-ring">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="36"
                        fill="none"
                        stroke="rgba(255,255,255,.1)"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50" cy="50" r="36"
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset .6s ease' }}
                      />
                    </svg>
                    <div className="mk-gpa-center">
                      <span>{totalPct}%</span>
                      <small>avg</small>
                    </div>
                  </div>
                  <div className="mk-gpa-info">
                    <h2>GPA: {Number(gpa.gpa || 0).toFixed(2)} / 4.0</h2>
                    <p>
                      Based on {marks.length} assessment
                      {marks.length !== 1 ? 's' : ''} for this enrollment
                    </p>
                    <div className="mk-gpa-pills">
                      <span className="mk-gpa-pill">
                        📊 {marks.filter(m => (m.marksObtained / m.maxMarks) * 100 >= 90).length} A+
                      </span>
                      <span className="mk-gpa-pill">
                        📘 {marks.filter(m => {
                          const p = (m.marksObtained / m.maxMarks) * 100;
                          return p >= 80 && p < 90;
                        }).length} A
                      </span>
                      <span className="mk-gpa-pill">
                        📙 {marks.filter(m => {
                          const p = (m.marksObtained / m.maxMarks) * 100;
                          return p >= 70 && p < 80;
                        }).length} B
                      </span>
                      <span className="mk-gpa-pill">
                        📕 {marks.filter(m =>
                          (m.marksObtained / m.maxMarks) * 100 < 70
                        ).length} Below B
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="mk-table-card">
                <div className="mk-table-head">
                  <h3>Assessment Records</h3>
                  <span>
                    {filteredMarks.length} record
                    {filteredMarks.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <table className="mk-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Assessment</th>
                      <th>Score</th>
                      <th>Performance</th>
                      <th>Grade</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array(4).fill(0).map((_, i) => (
                        <tr key={i} className="mk-skel">
                          {Array(6).fill(0).map((_, j) => (
                            <td key={j}>
                              <div
                                className="mk-skel-line"
                                style={{
                                  height: 18,
                                  width: j === 3 ? 120 : j === 5 ? 160 : 70,
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filteredMarks.length === 0 ? (
                      <tr>
                        <td colSpan={6}>
                          <div className="mk-empty">
                            <div className="mk-empty-icon">📊</div>
                            <div>
                              {marks.length === 0
                                ? 'No marks recorded yet.'
                                : 'No results match your search.'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredMarks.map((m, i) => {
                        const pct = Math.round(
                          (m.marksObtained / m.maxMarks) * 100
                        );
                        const { label, cfg } = getGrade(
                          m.marksObtained,
                          m.maxMarks
                        );
                        const acfg =
                          assessmentCfg[m.assessmentType] || assessmentCfg.QUIZ;
                        const barColor =
                          pct >= 75
                            ? '#10b981'
                            : pct >= 50
                            ? '#f59e0b'
                            : '#ef4444';

                        return (
                          <tr key={m.id}>
                            <td>
                              <div style={{
                                width: 32, height: 32,
                                borderRadius: '50%',
                                background: avatarGrads[i % avatarGrads.length],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '.8rem',
                                fontWeight: 700,
                              }}>
                                {i + 1}
                              </div>
                            </td>
                            <td>
                              <span
                                className="mk-assess-badge"
                                style={{ background: acfg.bg }}
                              >
                                {acfg.icon} {m.assessmentType}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700, color: '#1e293b' }}>
                              {m.marksObtained} / {m.maxMarks}
                            </td>
                            <td>
                              <div className="mk-pct-bar-wrap">
                                <div className="mk-pct-bar">
                                  <div
                                    className="mk-pct-fill"
                                    style={{
                                      width: `${pct}%`,
                                      background: barColor,
                                    }}
                                  />
                                </div>
                                <span style={{
                                  fontSize: '.8rem',
                                  fontWeight: 600,
                                  color: barColor,
                                  minWidth: 38,
                                }}>
                                  {pct}%
                                </span>
                              </div>
                            </td>
                            <td>
                              <span
                                className="mk-grade-badge"
                                style={{
                                  background: cfg.bg,
                                  color: cfg.color,
                                }}
                              >
                                {label}
                              </span>
                            </td>
                            <td style={{
                              color: '#64748b',
                              maxWidth: 180,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {m.remarks || (
                                <span style={{ color: '#cbd5e1' }}>—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                <div className="mk-footer">
                  <span>Total: {marks.length} records</span>
                  <span>
                    Avg: {totalPct}% · GPA:{' '}
                    {gpa ? Number(gpa.gpa || 0).toFixed(2) : '—'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="mk-empty-state">
              <div className="mk-empty-state-icon">📊</div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: 6,
                color: '#475569',
              }}>
                Select an Enrollment
              </div>
              <div style={{ fontSize: '.9rem', color: '#94a3b8' }}>
                Choose an enrollment above to view marks and GPA.
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── MODAL ── */}
      {showForm && (
        <div
          className="mk-overlay"
          onClick={e => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="mk-modal">
            <div className="mk-modal-head">
              <h2>📝 Add New Mark</h2>
              <p>Record assessment score for a student enrollment</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mk-modal-body">

                {/* Enrollment Select */}
                <div className="mk-field">
                  <label>Enrollment</label>
                  <select
                    value={form.enrollmentId || selectedEnrollment}
                    onChange={e =>
                      setForm(f => ({ ...f, enrollmentId: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select enrollment</option>
                    {enrollments.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.student?.name || `Student #${e.studentId}`}
                        {' — '}
                        {e.course?.name || `Course #${e.courseId}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assessment Type */}
                <div className="mk-field">
                  <label>Assessment Type</label>
                  <div className="mk-assess-types">
                    {Object.entries(assessmentCfg).map(([type, cfg]) => (
                      <button
                        type="button"
                        key={type}
                        className={`mk-type-btn${
                          form.assessmentType === type ? ' active' : ''
                        }`}
                        style={
                          form.assessmentType === type
                            ? { background: cfg.bg }
                            : {}
                        }
                        onClick={() =>
                          setForm(f => ({ ...f, assessmentType: type }))
                        }
                      >
                        {cfg.icon} {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Marks Fields */}
                <div className="mk-field-row">
                  <div className="mk-field">
                    <label>Marks Obtained</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 85"
                      value={form.marksObtained}
                      onChange={e =>
                        setForm(f => ({ ...f, marksObtained: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="mk-field">
                    <label>Max Marks</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 100"
                      value={form.maxMarks}
                      onChange={e =>
                        setForm(f => ({ ...f, maxMarks: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div className="mk-field">
                  <label>Remarks (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Any notes about this assessment…"
                    value={form.remarks}
                    onChange={e =>
                      setForm(f => ({ ...f, remarks: e.target.value }))
                    }
                  />
                </div>

              </div>

              <div className="mk-modal-foot">
                <button
                  type="button"
                  className="mk-btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="mk-btn-save">
                  💾 Save Mark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Marks;
