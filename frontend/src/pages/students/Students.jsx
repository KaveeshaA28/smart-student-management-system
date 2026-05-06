import { useState, useEffect } from 'react';
import { studentAPI } from '../../api/axios';

const Students = () => {
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [search, setSearch]       = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    studentNumber: '', phone: '', address: '',
    dateOfBirth: '', gender: 'MALE', enrolledYear: 2024,
  });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentAPI.getAll();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editStudent) {
        await studentAPI.update(editStudent.id, form);
      } else {
        await studentAPI.create(form);
      }
      fetchStudents();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving student');
    }
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setForm({
      name: student.name, email: student.email, password: '',
      studentNumber: student.studentNumber, phone: student.phone || '',
      address: student.address || '', dateOfBirth: student.dateOfBirth || '',
      gender: student.gender || 'MALE', enrolledYear: student.enrolledYear || 2024,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deactivate this student?')) {
      await studentAPI.delete(id);
      fetchStudents();
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditStudent(null);
    setForm({
      name: '', email: '', password: '',
      studentNumber: '', phone: '', address: '',
      dateOfBirth: '', gender: 'MALE', enrolledYear: 2024,
    });
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.studentNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  /* avatar color per index */
  const avatarColors = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
    'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .stu-wrap { font-family:'Inter',sans-serif; }

        /* ── HERO ── */
        .stu-hero {
          position: relative;
          border-radius: 24px;
          padding: 32px 36px;
          margin-bottom: 28px;
          overflow: hidden;
          background: linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);
          box-shadow: 0 20px 60px rgba(15,52,96,0.4);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stu-hero::before {
          content:'';
          position:absolute; top:-80px; right:-80px;
          width:280px; height:280px;
          background:radial-gradient(circle,rgba(102,126,234,0.3) 0%,transparent 65%);
          pointer-events:none;
        }

        .stu-hero::after {
          content:'';
          position:absolute; bottom:-60px; left:25%;
          width:220px; height:220px;
          background:radial-gradient(circle,rgba(240,147,251,0.2) 0%,transparent 65%);
          pointer-events:none;
        }

        .stu-hero-left { position:relative; z-index:1; }

        .stu-hero-badge {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.14);
          border-radius:50px; padding:4px 13px;
          font-size:11.5px; font-weight:600;
          color:rgba(255,255,255,0.7);
          margin-bottom:12px; text-transform:uppercase; letter-spacing:0.5px;
        }

        .stu-hero-dot {
          width:7px; height:7px; border-radius:50%;
          background:#4ade80;
          box-shadow:0 0 8px #4ade80;
          animation:heroPulse 2s ease infinite;
        }

        @keyframes heroPulse {
          0%,100%{box-shadow:0 0 8px #4ade80;}
          50%    {box-shadow:0 0 16px #4ade80;}
        }

        .stu-hero h1 {
          font-size:28px; font-weight:800; color:#fff;
          letter-spacing:-0.5px; margin-bottom:6px;
        }

        .stu-hero h1 span {
          background:linear-gradient(90deg,#60a5fa,#a78bfa);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        .stu-hero p {
          font-size:14px; color:rgba(255,255,255,0.5);
        }

        .stu-hero-right {
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
          font-size:24px; font-weight:800; color:#fff; line-height:1;
        }

        .hero-stat-label {
          font-size:11px; color:rgba(255,255,255,0.4);
          margin-top:4px; text-transform:uppercase; letter-spacing:0.5px;
        }

        /* Add button */
        .add-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 22px;
          background:linear-gradient(135deg,#667eea,#764ba2);
          color:#fff; border:none; border-radius:13px;
          font-size:14px; font-weight:700;
          font-family:'Inter',sans-serif;
          cursor:pointer;
          box-shadow:0 6px 20px rgba(102,126,234,0.5);
          transition:transform 0.2s, box-shadow 0.2s;
          white-space:nowrap;
        }

        .add-btn:hover {
          transform:translateY(-2px);
          box-shadow:0 10px 28px rgba(102,126,234,0.6);
        }

        /* ── TOOLBAR ── */
        .stu-toolbar {
          display:flex; align-items:center;
          justify-content:space-between;
          gap:16px; margin-bottom:22px;
          flex-wrap:wrap;
        }

        .search-wrap {
          position:relative; flex:1; max-width:420px;
        }

        .search-icon {
          position:absolute; left:14px; top:50%;
          transform:translateY(-50%);
          font-size:16px; opacity:0.4; pointer-events:none;
        }

        .search-input {
          width:100%; padding:12px 16px 12px 42px;
          background:#fff;
          border:2px solid #e2e8f0;
          border-radius:13px;
          font-size:14px; font-family:'Inter',sans-serif;
          outline:none; color:#0f172a;
          transition:border-color 0.2s, box-shadow 0.2s;
        }

        .search-input::placeholder { color:#cbd5e1; }

        .search-input:focus {
          border-color:#667eea;
          box-shadow:0 0 0 3px rgba(102,126,234,0.15);
        }

        .filter-chip {
          display:inline-flex; align-items:center; gap:6px;
          padding:8px 16px;
          background:#fff;
          border:2px solid #e2e8f0;
          border-radius:10px;
          font-size:13px; font-weight:600; color:#475569;
          cursor:pointer; font-family:'Inter',sans-serif;
          transition:all 0.2s;
        }

        .filter-chip:hover, .filter-chip.active {
          border-color:#667eea; color:#667eea;
          background:#f5f3ff;
        }

        /* ── TABLE CARD ── */
        .table-card {
          background:#fff;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 4px 24px rgba(0,0,0,0.07);
          border:1px solid #f1f5f9;
        }

        .tbl { width:100%; border-collapse:collapse; }

        .tbl thead tr {
          background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
        }

        .tbl thead th {
          padding:16px 18px;
          text-align:left;
          font-size:11.5px; font-weight:700;
          color:rgba(255,255,255,0.9);
          text-transform:uppercase; letter-spacing:0.7px;
          white-space:nowrap;
        }

        .tbl tbody tr {
          border-bottom:1px solid #f8fafc;
          transition:background 0.18s;
        }

        .tbl tbody tr:last-child { border-bottom:none; }

        .tbl tbody tr:hover { background:#fafbff; }

        .tbl td { padding:14px 18px; vertical-align:middle; }

        /* Row number */
        .row-num {
          width:32px; height:32px;
          background:#f1f5f9; border-radius:8px;
          display:flex; align-items:center; justify-content:center;
          font-size:13px; font-weight:700; color:#94a3b8;
        }

        /* Avatar */
        .avatar {
          width:40px; height:40px;
          border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          font-size:16px; font-weight:700; color:#fff;
          flex-shrink:0;
          box-shadow:0 4px 12px rgba(0,0,0,0.15);
        }

        .student-info { display:flex; align-items:center; gap:12px; }

        .student-name {
          font-size:14px; font-weight:700; color:#1e293b;
        }

        .student-email {
          font-size:12.5px; color:#94a3b8; margin-top:2px;
        }

        /* Student number badge */
        .snum-badge {
          display:inline-flex; align-items:center; gap:5px;
          background:linear-gradient(135deg,#eff6ff,#f5f3ff);
          border:1px solid #c7d2fe;
          color:#4f46e5; padding:5px 12px;
          border-radius:20px; font-size:12.5px; font-weight:700;
          white-space:nowrap;
        }

        /* Gender badge */
        .gender-badge {
          display:inline-flex; align-items:center; gap:4px;
          padding:4px 10px; border-radius:20px;
          font-size:12px; font-weight:600;
        }

        /* Status badge */
        .status-badge {
          display:inline-flex; align-items:center; gap:5px;
          padding:5px 12px; border-radius:20px;
          font-size:12.5px; font-weight:700;
        }

        .status-active {
          background:linear-gradient(135deg,#d1fae5,#a7f3d0);
          color:#065f46;
        }

        .status-inactive {
          background:linear-gradient(135deg,#fee2e2,#fecaca);
          color:#991b1b;
        }

        /* Action buttons */
        .act-edit {
          display:inline-flex; align-items:center; gap:5px;
          padding:7px 13px;
          background:linear-gradient(135deg,#eff6ff,#e0e7ff);
          color:#4f46e5; border:none; border-radius:9px;
          font-size:12.5px; font-weight:700;
          font-family:'Inter',sans-serif;
          cursor:pointer;
          transition:all 0.2s;
        }

        .act-edit:hover {
          background:linear-gradient(135deg,#667eea,#764ba2);
          color:#fff;
          box-shadow:0 4px 14px rgba(102,126,234,0.4);
          transform:translateY(-1px);
        }

        .act-del {
          display:inline-flex; align-items:center; gap:5px;
          padding:7px 13px;
          background:linear-gradient(135deg,#fff1f2,#fee2e2);
          color:#e11d48; border:none; border-radius:9px;
          font-size:12.5px; font-weight:700;
          font-family:'Inter',sans-serif;
          cursor:pointer;
          transition:all 0.2s;
        }

        .act-del:hover {
          background:linear-gradient(135deg,#f43f5e,#e11d48);
          color:#fff;
          box-shadow:0 4px 14px rgba(225,29,72,0.4);
          transform:translateY(-1px);
        }

        /* Table footer */
        .tbl-footer {
          padding:14px 18px;
          border-top:1px solid #f1f5f9;
          background:linear-gradient(135deg,#f8fafc,#f5f3ff);
          font-size:13.5px; color:#64748b;
          display:flex; align-items:center;
          justify-content:space-between;
        }

        .tbl-footer strong { color:#4f46e5; }

        /* Empty / Loading */
        .empty-state {
          padding:60px 20px; text-align:center;
        }

        .empty-icon {
          font-size:56px; margin-bottom:16px; opacity:0.4;
        }

        .empty-text {
          font-size:15px; color:#94a3b8; font-weight:500;
        }

        /* Skeleton */
        .skeleton-row td { padding:16px 18px; }

        .skel {
          height:16px; border-radius:8px;
          background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);
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
          background:rgba(15,23,42,0.6);
          backdrop-filter:blur(6px);
          display:flex; align-items:center;
          justify-content:center; z-index:1000;
          padding:20px;
        }

        .modal-box {
          background:#fff; border-radius:24px;
          padding:36px; width:100%; max-width:620px;
          max-height:92vh; overflow-y:auto;
          box-shadow:0 30px 80px rgba(0,0,0,0.2);
          animation:modalIn 0.3s ease;
        }

        @keyframes modalIn {
          from{opacity:0;transform:scale(0.95) translateY(10px);}
          to  {opacity:1;transform:scale(1) translateY(0);}
        }

        .modal-header {
          display:flex; align-items:center;
          justify-content:space-between;
          margin-bottom:28px;
        }

        .modal-title-wrap {
          display:flex; align-items:center; gap:12px;
        }

        .modal-icon {
          width:46px; height:46px;
          border-radius:14px;
          background:linear-gradient(135deg,#667eea,#764ba2);
          display:flex; align-items:center;
          justify-content:center; font-size:22px;
          box-shadow:0 6px 20px rgba(102,126,234,0.4);
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

        /* Form fields */
        .form-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:18px;
        }

        .form-group { display:flex; flex-direction:column; gap:7px; }
        .form-group.full { grid-column:1/-1; }

        .form-label {
          font-size:12.5px; font-weight:700;
          color:#374151; text-transform:uppercase;
          letter-spacing:0.4px;
        }

        .form-input {
          padding:11px 14px;
          background:#f8fafc;
          border:2px solid #e2e8f0;
          border-radius:11px;
          font-size:14px; color:#0f172a;
          font-family:'Inter',sans-serif;
          outline:none;
          transition:border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .form-input::placeholder { color:#cbd5e1; }

        .form-input:focus {
          border-color:#667eea;
          background:#fafbff;
          box-shadow:0 0 0 3px rgba(102,126,234,0.13);
        }

        /* Section divider in form */
        .form-section {
          grid-column:1/-1;
          border-top:2px solid #f1f5f9;
          margin:4px 0;
          padding-top:4px;
        }

        .form-section-label {
          font-size:11px; font-weight:700; color:#94a3b8;
          text-transform:uppercase; letter-spacing:0.6px;
          margin-bottom:4px;
        }

        /* Modal action buttons */
        .modal-actions {
          display:flex; gap:12px;
          margin-top:28px; justify-content:flex-end;
        }

        .btn-cancel {
          padding:11px 22px;
          background:#f1f5f9; color:#475569;
          border:none; border-radius:11px;
          font-size:14px; font-weight:600;
          font-family:'Inter',sans-serif;
          cursor:pointer; transition:background 0.2s;
        }

        .btn-cancel:hover { background:#e2e8f0; }

        .btn-save {
          padding:11px 26px;
          background:linear-gradient(135deg,#667eea,#764ba2);
          color:#fff; border:none; border-radius:11px;
          font-size:14px; font-weight:700;
          font-family:'Inter',sans-serif;
          cursor:pointer;
          box-shadow:0 4px 14px rgba(102,126,234,0.4);
          transition:transform 0.2s, box-shadow 0.2s;
        }

        .btn-save:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 22px rgba(102,126,234,0.5);
        }

        @media(max-width:640px){
          .form-grid{ grid-template-columns:1fr; }
          .stu-hero-right{ display:none; }
          .stu-hero h1{ font-size:22px; }
        }
      `}</style>

      <div className="stu-wrap">

        {/* ══ HERO ══ */}
        <div className="stu-hero">
          <div className="stu-hero-left">
            <div className="stu-hero-badge">
              <span className="stu-hero-dot" />
              Student Management
            </div>
            <h1>
              <span>Students</span> Directory
            </h1>
            <p>Manage and track all enrolled students</p>
          </div>

          <div className="stu-hero-right">
            <div className="hero-stat-box">
              <div className="hero-stat-num">{students.length}</div>
              <div className="hero-stat-label">Total</div>
            </div>
            <div className="hero-stat-box">
              <div className="hero-stat-num">
                {students.filter(s => s.active).length}
              </div>
              <div className="hero-stat-label">Active</div>
            </div>
            <button className="add-btn" onClick={() => setShowForm(true)}>
              ＋ Add Student
            </button>
          </div>
        </div>

        {/* ══ TOOLBAR ══ */}
        <div className="stu-toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name, email or student number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button className="filter-chip">
              👨‍🎓 All Students
            </button>
            <button className="filter-chip">
              ✅ Active
            </button>
          </div>
          {/* Mobile add button */}
          <button
            className="add-btn"
            style={{ display:'none' }}
            onClick={() => setShowForm(true)}
          >
            ＋ Add
          </button>
        </div>

        {/* ══ TABLE ══ */}
        <div className="table-card">
          <table className="tbl">
            <thead>
              <tr>
                {['#','Student','Student No.','Phone','Year','Gender','Status','Actions']
                  .map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4].map(i => (
                  <tr key={i} className="skeleton-row">
                    {[1,2,3,4,5,6,7,8].map(j => (
                      <td key={j}>
                        <div className="skel" style={{ width: j===2?'160px':'80px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <div className="empty-icon">👨‍🎓</div>
                      <div className="empty-text">
                        {search
                          ? `No students found for "${search}"`
                          : 'No students yet. Add your first student!'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((student, idx) => (
                  <tr key={student.id}>
                    {/* # */}
                    <td>
                      <div className="row-num">{idx + 1}</div>
                    </td>

                    {/* Student */}
                    <td>
                      <div className="student-info">
                        <div
                          className="avatar"
                          style={{ background: avatarColors[idx % avatarColors.length] }}
                        >
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="student-name">{student.name}</div>
                          <div className="student-email">{student.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Student No */}
                    <td>
                      <span className="snum-badge">
                        🎫 {student.studentNumber}
                      </span>
                    </td>

                    {/* Phone */}
                    <td style={{ color:'#64748b', fontSize:'13.5px', fontWeight:'500' }}>
                      {student.phone || '—'}
                    </td>

                    {/* Year */}
                    <td>
                      <span style={{
                        background:'linear-gradient(135deg,#fef9c3,#fef08a)',
                        color:'#854d0e', padding:'4px 10px',
                        borderRadius:'20px', fontSize:'12.5px', fontWeight:'700',
                      }}>
                        📅 {student.enrolledYear || '—'}
                      </span>
                    </td>

                    {/* Gender */}
                    <td>
                      <span className="gender-badge" style={
                        student.gender === 'FEMALE'
                          ? { background:'linear-gradient(135deg,#fdf2f8,#fce7f3)', color:'#9d174d' }
                          : { background:'linear-gradient(135deg,#eff6ff,#dbeafe)', color:'#1e40af' }
                      }>
                        {student.gender === 'FEMALE' ? '👩' : '👨'}
                        {student.gender || 'N/A'}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-badge ${student.active ? 'status-active' : 'status-inactive'}`}>
                        <span style={{
                          width:'6px', height:'6px',
                          borderRadius:'50%',
                          background: student.active ? '#10b981' : '#ef4444',
                          display:'inline-block',
                        }}/>
                        {student.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button className="act-edit" onClick={() => handleEdit(student)}>
                          ✏️ Edit
                        </button>
                        <button className="act-del" onClick={() => handleDelete(student.id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="tbl-footer">
              <span>
                Showing <strong>{filtered.length}</strong> of{' '}
                <strong>{students.length}</strong> students
              </span>
              <span style={{ fontSize:'12px', color:'#94a3b8' }}>
                {students.filter(s => s.active).length} active ·{' '}
                {students.filter(s => !s.active).length} inactive
              </span>
            </div>
          )}
        </div>

        {/* ══ MODAL ══ */}
        {showForm && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && resetForm()}>
            <div className="modal-box">

              {/* Modal Header */}
              <div className="modal-header">
                <div className="modal-title-wrap">
                  <div className="modal-icon">👨‍🎓</div>
                  <div>
                    <div className="modal-title">
                      {editStudent ? 'Edit Student' : 'Add New Student'}
                    </div>
                    <div className="modal-sub">
                      {editStudent ? 'Update student information' : 'Fill in the student details below'}
                    </div>
                  </div>
                </div>
                <button className="modal-close" onClick={resetForm}>✕</button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-grid">

                  {/* Section: Basic Info */}
                  <div className="form-section">
                    <div className="form-section-label">📋 Basic Information</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" required
                      value={form.name} placeholder="e.g. John Doe"
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Student Number *</label>
                    <input className="form-input" required
                      value={form.studentNumber} placeholder="e.g. ST0012"
                      onChange={e => setForm({ ...form, studentNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input className="form-input" required type="email"
                      value={form.email} placeholder="john@student.com"
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Password {editStudent ? '(leave blank)' : '*'}
                    </label>
                    <input className="form-input" type="password"
                      required={!editStudent}
                      value={form.password} placeholder="••••••••"
                      onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                  </div>

                  {/* Section: Personal */}
                  <div className="form-section">
                    <div className="form-section-label">👤 Personal Details</div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-input"
                      value={form.phone} placeholder="0771234567"
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input className="form-input" type="date"
                      value={form.dateOfBirth}
                      onChange={e => setForm({ ...form, dateOfBirth: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select className="form-input"
                      value={form.gender}
                      onChange={e => setForm({ ...form, gender: e.target.value })}
                    >
                      <option value="MALE">👨 Male</option>
                      <option value="FEMALE">👩 Female</option>
                      <option value="OTHER">🧑 Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Enrolled Year</label>
                    <input className="form-input" type="number"
                      value={form.enrolledYear} min="2000" max="2030"
                      onChange={e => setForm({ ...form, enrolledYear: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="form-group full">
                    <label className="form-label">Address</label>
                    <input className="form-input"
                      value={form.address} placeholder="123 Main St, Colombo"
                      onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                  </div>

                </div>

                {/* Actions */}
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    {editStudent ? '💾 Update Student' : '➕ Add Student'}
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

export default Students;
