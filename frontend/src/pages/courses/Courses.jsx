import { useState, useEffect } from 'react';
import { courseAPI } from '../../api/axios';

const Courses = () => {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [search, setSearch]       = useState('');
  const [form, setForm] = useState({
    code: '', name: '', description: '', credits: 3,
  });

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCourse) {
        await courseAPI.update(editCourse.id, form);
      } else {
        await courseAPI.create(form);
      }
      fetchCourses();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving course');
    }
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setForm({
      code: course.code, name: course.name,
      description: course.description || '',
      credits: course.credits,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this course?')) {
      await courseAPI.delete(id);
      fetchCourses();
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditCourse(null);
    setForm({ code: '', name: '', description: '', credits: 3 });
  };

  /* unique gradient per card */
  const cardThemes = [
    { gradient: 'linear-gradient(135deg,#667eea,#764ba2)', shadow: 'rgba(102,126,234,0.35)', light: '#f5f3ff', text: '#4f46e5' },
    { gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', shadow: 'rgba(245,87,108,0.35)', light: '#fff1f2', text: '#e11d48' },
    { gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', shadow: 'rgba(79,172,254,0.35)', light: '#eff6ff', text: '#0284c7' },
    { gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', shadow: 'rgba(67,233,123,0.35)', light: '#f0fdf4', text: '#16a34a' },
    { gradient: 'linear-gradient(135deg,#fa709a,#fee140)', shadow: 'rgba(250,112,154,0.35)', light: '#fff7ed', text: '#ea580c' },
    { gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', shadow: 'rgba(161,140,209,0.35)', light: '#fdf4ff', text: '#9333ea' },
  ];

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .crs-wrap { font-family:'Inter',sans-serif; }

        /* ── HERO ── */
        .crs-hero {
          position:relative; border-radius:24px;
          padding:32px 36px; margin-bottom:28px;
          overflow:hidden;
          background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);
          box-shadow:0 20px 60px rgba(15,52,96,0.4);
          display:flex; align-items:center;
          justify-content:space-between;
        }

        .crs-hero::before {
          content:''; position:absolute;
          top:-80px; right:-80px;
          width:280px; height:280px;
          background:radial-gradient(circle,rgba(240,147,251,0.25) 0%,transparent 65%);
          pointer-events:none;
        }

        .crs-hero::after {
          content:''; position:absolute;
          bottom:-60px; left:25%;
          width:220px; height:220px;
          background:radial-gradient(circle,rgba(79,172,254,0.2) 0%,transparent 65%);
          pointer-events:none;
        }

        .crs-hero-left { position:relative; z-index:1; }

        .crs-hero-badge {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.14);
          border-radius:50px; padding:4px 13px;
          font-size:11.5px; font-weight:600;
          color:rgba(255,255,255,0.7);
          margin-bottom:12px;
          text-transform:uppercase; letter-spacing:0.5px;
        }

        .crs-hero-dot {
          width:7px; height:7px; border-radius:50%;
          background:#f093fb;
          box-shadow:0 0 8px #f093fb;
          animation:crsPulse 2s ease infinite;
        }

        @keyframes crsPulse {
          0%,100%{box-shadow:0 0 8px #f093fb;}
          50%    {box-shadow:0 0 16px #f093fb;}
        }

        .crs-hero h1 {
          font-size:28px; font-weight:800; color:#fff;
          letter-spacing:-0.5px; margin-bottom:6px;
        }

        .crs-hero h1 span {
          background:linear-gradient(90deg,#f093fb,#f5576c,#fa709a);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        .crs-hero p {
          font-size:14px; color:rgba(255,255,255,0.5);
        }

        .crs-hero-right {
          position:relative; z-index:1;
          display:flex; gap:14px; align-items:center;
        }

        .hero-stat-box {
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:16px; padding:14px 20px;
          text-align:center; min-width:80px;
        }

        .hero-stat-num {
          font-size:24px; font-weight:800;
          color:#fff; line-height:1;
        }

        .hero-stat-label {
          font-size:11px; color:rgba(255,255,255,0.4);
          margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;
        }

        /* Add button */
        .add-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 22px;
          background:linear-gradient(135deg,#f093fb,#f5576c);
          color:#fff; border:none; border-radius:13px;
          font-size:14px; font-weight:700;
          font-family:'Inter',sans-serif; cursor:pointer;
          box-shadow:0 6px 20px rgba(245,87,108,0.5);
          transition:transform 0.2s, box-shadow 0.2s;
          white-space:nowrap;
        }

        .add-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(245,87,108,0.6);
        }

        /* ── TOOLBAR ── */
        .crs-toolbar {
          display:flex; align-items:center;
          justify-content:space-between;
          gap:16px; margin-bottom:24px; flex-wrap:wrap;
        }

        .search-wrap { position:relative; flex:1; max-width:400px; }

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
          border-color:#f093fb;
          box-shadow:0 0 0 3px rgba(240,147,251,0.15);
        }

        .view-toggle {
          display:flex; gap:4px;
          background:#f1f5f9; border-radius:10px; padding:4px;
        }

        .view-btn {
          padding:7px 14px; border:none; border-radius:7px;
          font-size:13px; font-weight:600; cursor:pointer;
          font-family:'Inter',sans-serif;
          transition:all 0.2s; background:transparent; color:#64748b;
        }

        .view-btn.active {
          background:#fff; color:#4f46e5;
          box-shadow:0 2px 8px rgba(0,0,0,0.08);
        }

        /* ── COURSE CARDS GRID ── */
        .courses-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
          gap:22px;
        }

        .course-card {
          background:#fff;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 4px 24px rgba(0,0,0,0.07);
          border:1px solid #f1f5f9;
          transition:transform 0.25s, box-shadow 0.25s;
          display:flex; flex-direction:column;
        }

        .course-card:hover {
          transform:translateY(-6px);
        }

        /* Colorful top banner */
        .card-banner {
          height:90px; position:relative;
          overflow:hidden; padding:20px 22px;
          display:flex; align-items:flex-start;
          justify-content:space-between;
        }

        .card-banner::before {
          content:''; position:absolute;
          top:-20px; right:-20px;
          width:100px; height:100px;
          background:rgba(255,255,255,0.12);
          border-radius:50%;
        }

        .card-banner::after {
          content:''; position:absolute;
          bottom:-30px; right:30px;
          width:80px; height:80px;
          background:rgba(255,255,255,0.07);
          border-radius:50%;
        }

        .card-code {
          background:rgba(255,255,255,0.2);
          border:1px solid rgba(255,255,255,0.3);
          color:#fff; padding:5px 12px;
          border-radius:20px; font-size:12.5px;
          font-weight:800; letter-spacing:0.5px;
          position:relative; z-index:1;
          backdrop-filter:blur(6px);
        }

        .card-status {
          position:relative; z-index:1;
          display:inline-flex; align-items:center; gap:4px;
          padding:5px 11px; border-radius:20px;
          font-size:12px; font-weight:700;
          background:rgba(255,255,255,0.18);
          backdrop-filter:blur(6px);
          border:1px solid rgba(255,255,255,0.25);
          color:#fff;
        }

        .status-dot {
          width:6px; height:6px; border-radius:50%;
          background:#fff; opacity:0.85;
        }

        /* Card body */
        .card-body {
          padding:20px 22px; flex:1;
          display:flex; flex-direction:column;
        }

        .card-icon-row {
          display:flex; align-items:center;
          gap:12px; margin-bottom:14px;
        }

        .card-icon {
          width:46px; height:46px;
          border-radius:14px;
          display:flex; align-items:center;
          justify-content:center; font-size:22px;
          flex-shrink:0;
        }

        .card-dept {
          font-size:11.5px; font-weight:600;
          text-transform:uppercase; letter-spacing:0.5px;
          opacity:0.6;
        }

        .card-name {
          font-size:16px; font-weight:800;
          color:#1e293b; line-height:1.3;
          margin-bottom:8px; letter-spacing:-0.2px;
        }

        .card-desc {
          font-size:13px; color:#94a3b8;
          line-height:1.6; flex:1; margin-bottom:16px;
        }

        /* Card footer */
        .card-footer {
          display:flex; align-items:center;
          justify-content:space-between;
          padding:14px 22px;
          border-top:1px solid #f1f5f9;
          background:#fafbff;
        }

        .credits-badge {
          display:inline-flex; align-items:center; gap:6px;
          padding:6px 12px; border-radius:10px;
          font-size:12.5px; font-weight:700;
        }

        .card-actions { display:flex; gap:8px; }

        .btn-edit {
          display:inline-flex; align-items:center; gap:5px;
          padding:7px 14px; border:none; border-radius:9px;
          font-size:12.5px; font-weight:700;
          font-family:'Inter',sans-serif; cursor:pointer;
          background:linear-gradient(135deg,#eff6ff,#e0e7ff);
          color:#4f46e5;
          transition:all 0.2s;
        }

        .btn-edit:hover {
          background:linear-gradient(135deg,#667eea,#764ba2);
          color:#fff;
          box-shadow:0 4px 14px rgba(102,126,234,0.4);
          transform:translateY(-1px);
        }

        .btn-del {
          display:inline-flex; align-items:center; gap:5px;
          padding:7px 12px; border:none; border-radius:9px;
          font-size:13px; font-weight:700;
          font-family:'Inter',sans-serif; cursor:pointer;
          background:linear-gradient(135deg,#fff1f2,#fee2e2);
          color:#e11d48;
          transition:all 0.2s;
        }

        .btn-del:hover {
          background:linear-gradient(135deg,#f43f5e,#e11d48);
          color:#fff;
          box-shadow:0 4px 14px rgba(225,29,72,0.4);
          transform:translateY(-1px);
        }

        /* Skeleton */
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

        .skel-card {
          border-radius:20px; overflow:hidden;
          border:1px solid #f1f5f9;
        }

        /* Empty */
        .empty-state {
          grid-column:1/-1; text-align:center;
          padding:80px 20px;
        }

        .empty-icon { font-size:64px; opacity:0.3; margin-bottom:16px; }
        .empty-text { font-size:16px; color:#94a3b8; font-weight:500; }
        .empty-sub  { font-size:13px; color:#cbd5e1; margin-top:6px; }

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
          padding:36px; width:100%; max-width:540px;
          max-height:90vh; overflow-y:auto;
          box-shadow:0 30px 80px rgba(0,0,0,0.2);
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
          background:linear-gradient(135deg,#f093fb,#f5576c);
          display:flex; align-items:center;
          justify-content:center; font-size:22px;
          box-shadow:0 6px 20px rgba(245,87,108,0.4);
        }

        .modal-title {
          font-size:20px; font-weight:800;
          color:#0f172a; letter-spacing:-0.3px;
        }

        .modal-sub {
          font-size:13px; color:#94a3b8; margin-top:2px;
        }

        .modal-close {
          width:36px; height:36px;
          background:#f1f5f9; border:none;
          border-radius:10px; cursor:pointer;
          font-size:18px; color:#64748b;
          display:flex; align-items:center;
          justify-content:center;
          transition:background 0.2s;
          font-family:'Inter',sans-serif;
        }

        .modal-close:hover { background:#fee2e2; color:#e11d48; }

        .form-group { display:flex; flex-direction:column; gap:7px; margin-bottom:18px; }

        .form-label {
          font-size:12.5px; font-weight:700; color:#374151;
          text-transform:uppercase; letter-spacing:0.4px;
        }

        .form-input {
          padding:12px 14px;
          background:#f8fafc; border:2px solid #e2e8f0;
          border-radius:11px; font-size:14px; color:#0f172a;
          font-family:'Inter',sans-serif; outline:none;
          transition:border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .form-input::placeholder { color:#cbd5e1; }

        .form-input:focus {
          border-color:#f093fb; background:#fdf4ff;
          box-shadow:0 0 0 3px rgba(240,147,251,0.15);
        }

        .form-row {
          display:grid; grid-template-columns:1fr 1fr; gap:16px;
        }

        .modal-actions {
          display:flex; gap:12px;
          margin-top:8px; justify-content:flex-end;
        }

        .btn-cancel {
          padding:11px 22px; background:#f1f5f9; color:#475569;
          border:none; border-radius:11px;
          font-size:14px; font-weight:600;
          font-family:'Inter',sans-serif; cursor:pointer;
          transition:background 0.2s;
        }

        .btn-cancel:hover { background:#e2e8f0; }

        .btn-save {
          padding:11px 26px;
          background:linear-gradient(135deg,#f093fb,#f5576c);
          color:#fff; border:none; border-radius:11px;
          font-size:14px; font-weight:700;
          font-family:'Inter',sans-serif; cursor:pointer;
          box-shadow:0 4px 14px rgba(245,87,108,0.4);
          transition:transform 0.2s, box-shadow 0.2s;
        }

        .btn-save:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 22px rgba(245,87,108,0.5);
        }

        /* Credits selector */
        .credits-selector {
          display:flex; gap:8px; flex-wrap:wrap;
        }

        .credit-opt {
          width:44px; height:44px;
          border-radius:11px; border:2px solid #e2e8f0;
          background:#f8fafc; font-size:15px; font-weight:700;
          color:#475569; cursor:pointer;
          font-family:'Inter',sans-serif;
          display:flex; align-items:center; justify-content:center;
          transition:all 0.18s;
        }

        .credit-opt:hover { border-color:#f093fb; color:#f5576c; }

        .credit-opt.selected {
          background:linear-gradient(135deg,#f093fb,#f5576c);
          border-color:transparent; color:#fff;
          box-shadow:0 4px 12px rgba(245,87,108,0.4);
        }

        @media(max-width:640px){
          .crs-hero-right { display:none; }
          .crs-hero h1    { font-size:22px; }
          .courses-grid   { grid-template-columns:1fr; }
          .form-row       { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="crs-wrap">

        {/* ══ HERO ══ */}
        <div className="crs-hero">
          <div className="crs-hero-left">
            <div className="crs-hero-badge">
              <span className="crs-hero-dot" />
              Course Management
            </div>
            <h1>
              <span>Courses</span> Catalog
            </h1>
            <p>Manage and organize all academic courses</p>
          </div>

          <div className="crs-hero-right">
            <div className="hero-stat-box">
              <div className="hero-stat-num">{courses.length}</div>
              <div className="hero-stat-label">Total</div>
            </div>
            <div className="hero-stat-box">
              <div className="hero-stat-num">
                {courses.filter(c => c.active).length}
              </div>
              <div className="hero-stat-label">Active</div>
            </div>
            <div className="hero-stat-box">
              <div className="hero-stat-num">
                {courses.reduce((s, c) => s + (c.credits || 0), 0)}
              </div>
              <div className="hero-stat-label">Credits</div>
            </div>
            <button className="add-btn" onClick={() => setShowForm(true)}>
              ＋ Add Course
            </button>
          </div>
        </div>

        {/* ══ TOOLBAR ══ */}
        <div className="crs-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by course name or code..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="view-toggle">
            <button className="view-btn active">⊞ Grid</button>
            <button className="view-btn">≡ List</button>
          </div>
        </div>

        {/* ══ CARDS GRID ══ */}
        {loading ? (
          <div className="courses-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skel-card">
                <div className="skel" style={{ height:'90px' }} />
                <div style={{ padding:'20px 22px' }}>
                  <div className="skel" style={{ height:'14px', width:'60%', marginBottom:'10px' }} />
                  <div className="skel" style={{ height:'20px', width:'90%', marginBottom:'8px' }} />
                  <div className="skel" style={{ height:'13px', width:'75%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="courses-grid">
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <div className="empty-text">
                {search ? `No courses found for "${search}"` : 'No courses yet!'}
              </div>
              <div className="empty-sub">
                {!search && 'Click "Add Course" to create your first course.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="courses-grid">
            {filtered.map((course, idx) => {
              const theme = cardThemes[idx % cardThemes.length];
              return (
                <div key={course.id} className="course-card"
                  style={{ boxShadow: `0 8px 32px ${theme.shadow}` }}
                >
                  {/* Colorful banner top */}
                  <div className="card-banner" style={{ background: theme.gradient }}>
                    <span className="card-code">{course.code}</span>
                    <span className="card-status">
                      <span className="status-dot" />
                      {course.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="card-body">
                    <div className="card-icon-row">
                      <div className="card-icon"
                        style={{ background: theme.light }}
                      >
                        📚
                      </div>
                      <span className="card-dept" style={{ color: theme.text }}>
                        {course.code.replace(/[0-9]/g, '')} Department
                      </span>
                    </div>

                    <div className="card-name">{course.name}</div>
                    <div className="card-desc">
                      {course.description || 'No description provided for this course.'}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="card-footer">
                    <span className="credits-badge"
                      style={{ background: theme.light, color: theme.text }}
                    >
                      ⭐ {course.credits} Credits
                    </span>
                    <div className="card-actions">
                      <button className="btn-edit" onClick={() => handleEdit(course)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-del" onClick={() => handleDelete(course.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ MODAL ══ */}
        {showForm && (
          <div className="modal-overlay"
            onClick={e => e.target === e.currentTarget && resetForm()}
          >
            <div className="modal-box">

              <div className="modal-header">
                <div className="modal-title-wrap">
                  <div className="modal-icon">📚</div>
                  <div>
                    <div className="modal-title">
                      {editCourse ? 'Edit Course' : 'Add New Course'}
                    </div>
                    <div className="modal-sub">
                      {editCourse ? 'Update course details' : 'Fill in the course information'}
                    </div>
                  </div>
                </div>
                <button className="modal-close" onClick={resetForm}>✕</button>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Course Code *</label>
                    <input className="form-input" required
                      value={form.code} placeholder="e.g. CS101"
                      onChange={e => setForm({ ...form, code: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input className="form-input"
                      value={form.code.replace(/[0-9]/g,'')}
                      disabled
                      style={{ opacity:0.6, cursor:'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Course Name *</label>
                  <input className="form-input" required
                    value={form.name}
                    placeholder="e.g. Introduction to Computer Science"
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input"
                    style={{ height:'88px', resize:'vertical' }}
                    value={form.description}
                    placeholder="Brief description of this course..."
                    onChange={e => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Credits *</label>
                  <div className="credits-selector">
                    {[1,2,3,4,5,6].map(n => (
                      <button
                        key={n} type="button"
                        className={`credit-opt ${form.credits === n ? 'selected' : ''}`}
                        onClick={() => setForm({ ...form, credits: n })}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editCourse ? '💾 Update Course' : '➕ Add Course'}
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

export default Courses;
