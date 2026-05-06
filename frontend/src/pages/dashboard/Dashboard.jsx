import { useState, useEffect } from 'react';
import { studentAPI, courseAPI, enrollmentAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, courses, enrollments] = await Promise.all([
          studentAPI.getAll(),
          courseAPI.getAll(),
          enrollmentAPI.getAll(),
        ]);
        setStats({
          students: students.data.length,
          courses: courses.data.length,
          enrollments: enrollments.data.length,
        });
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      icon: '👨‍🎓',
      title: 'Total Students',
      value: stats.students,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadow: 'rgba(102,126,234,0.45)',
      sparkle: '📈',
      trend: '+12% this month',
    },
    {
      icon: '📚',
      title: 'Total Courses',
      value: stats.courses,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      shadow: 'rgba(245,87,108,0.45)',
      sparkle: '🔥',
      trend: '+5% this month',
    },
    {
      icon: '📋',
      title: 'Total Enrollments',
      value: stats.enrollments,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      shadow: 'rgba(79,172,254,0.45)',
      sparkle: '⚡',
      trend: '+18% this month',
    },
    {
      icon: '🎓',
      title: 'Active System',
      value: '100%',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      shadow: 'rgba(67,233,123,0.45)',
      sparkle: '✅',
      trend: 'All systems go',
    },
  ];

  const quickActions = [
    {
      label: 'Add Student',
      icon: '👨‍🎓',
      path: '/students',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      shadow: 'rgba(102,126,234,0.4)',
      desc: 'Register new student',
    },
    {
      label: 'Add Course',
      icon: '📖',
      path: '/courses',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      shadow: 'rgba(245,87,108,0.4)',
      desc: 'Create new course',
    },
    {
      label: 'Mark Attendance',
      icon: '✅',
      path: '/attendance',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      shadow: 'rgba(79,172,254,0.4)',
      desc: 'Track daily attendance',
    },
    {
      label: 'Add Marks',
      icon: '📝',
      path: '/marks',
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      shadow: 'rgba(67,233,123,0.4)',
      desc: 'Enter student grades',
    },
  ];

  const recentActivity = [
    { icon: '👨‍🎓', text: 'New student enrolled', time: '2 min ago',   color: '#667eea' },
    { icon: '📚', text: 'Course updated',         time: '15 min ago',  color: '#f5576c' },
    { icon: '✅', text: 'Attendance marked',       time: '1 hour ago',  color: '#4facfe' },
    { icon: '📝', text: 'Marks submitted',         time: '3 hours ago', color: '#43e97b' },
    { icon: '🎓', text: 'New enrollment added',    time: 'Yesterday',   color: '#f093fb' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .dash-wrap {
          font-family: 'Inter', sans-serif;
          padding: 4px 0;
        }

        /* ══ HERO BANNER ══ */
        .hero-banner {
          position: relative;
          border-radius: 24px;
          padding: 36px 40px;
          margin-bottom: 28px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
          box-shadow: 0 20px 60px rgba(15,52,96,0.4);
        }

        .hero-banner::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 65%);
          pointer-events: none;
        }

        .hero-banner::after {
          content: '';
          position: absolute;
          bottom: -60px; left: 30%;
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(79,172,254,0.2) 0%, transparent 65%);
          pointer-events: none;
        }

        .hero-content { position: relative; z-index: 1; }

        .hero-greeting {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          margin-bottom: 14px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .hero-dot {
          width: 7px; height: 7px;
          background: #4ade80; border-radius: 50%;
          box-shadow: 0 0 8px #4ade80;
          animation: heroPulse 2s ease infinite;
        }

        @keyframes heroPulse {
          0%,100% { box-shadow: 0 0 8px #4ade80; }
          50%      { box-shadow: 0 0 16px #4ade80; }
        }

        .hero-title {
          font-size: 30px; font-weight: 800;
          color: #fff; line-height: 1.2;
          margin-bottom: 8px; letter-spacing: -0.5px;
        }

        .hero-title span {
          background: linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 14px; color: rgba(255,255,255,0.5);
          font-weight: 400;
        }

        .hero-right {
          position: absolute;
          right: 40px; top: 50%;
          transform: translateY(-50%);
          z-index: 1;
          display: flex; gap: 16px;
        }

        .hero-badge {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 14px 20px;
          text-align: center;
          backdrop-filter: blur(10px);
          min-width: 80px;
        }

        .hero-badge-num {
          font-size: 22px; font-weight: 800; color: #fff; line-height: 1;
        }

        .hero-badge-label {
          font-size: 11px; color: rgba(255,255,255,0.4);
          margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;
        }

        /* ══ SECTION TITLE ══ */
        .section-title {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 18px;
        }

        .section-title-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
        }

        .section-title h2 {
          font-size: 18px; font-weight: 700;
          color: #0f172a; letter-spacing: -0.3px;
        }

        .section-title p {
          font-size: 12.5px; color: #94a3b8; margin-top: 1px;
        }

        /* ══ STAT CARDS GRID ══ */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .stat-card {
          border-radius: 20px;
          padding: 24px 22px;
          position: relative;
          overflow: hidden;
          cursor: default;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: -30px; right: -30px;
          width: 120px; height: 120px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }

        .stat-card::after {
          content: '';
          position: absolute;
          bottom: -40px; right: 20px;
          width: 90px; height: 90px;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
        }

        .stat-icon-wrap {
          width: 52px; height: 52px;
          background: rgba(255,255,255,0.2);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px;
          margin-bottom: 16px;
          position: relative; z-index: 1;
        }

        .stat-value {
          font-size: 38px; font-weight: 800;
          color: #fff; line-height: 1;
          margin-bottom: 6px;
          position: relative; z-index: 1;
          letter-spacing: -1px;
        }

        .stat-title {
          font-size: 13px; color: rgba(255,255,255,0.75);
          font-weight: 600; margin-bottom: 12px;
          position: relative; z-index: 1;
          text-transform: uppercase; letter-spacing: 0.4px;
        }

        .stat-trend {
          display: inline-flex; align-items: center; gap: 5px;
          background: rgba(255,255,255,0.15);
          border-radius: 20px; padding: 3px 10px;
          font-size: 11.5px; color: rgba(255,255,255,0.9);
          font-weight: 600; position: relative; z-index: 1;
        }

        /* Loading skeleton */
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ══ BOTTOM ROW ══ */
        .bottom-row {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
          margin-bottom: 28px;
        }

        /* Quick Actions */
        .quick-actions-card {
          background: #fff;
          border-radius: 20px;
          padding: 26px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .action-btn {
          border-radius: 16px;
          padding: 20px 16px;
          text-align: center;
          text-decoration: none;
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          transition: transform 0.25s, box-shadow 0.25s;
          position: relative; overflow: hidden;
          cursor: pointer; border: none;
        }

        .action-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0.15);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .action-btn:hover::before { opacity: 1; }

        .action-btn:hover {
          transform: translateY(-4px);
        }

        .action-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.25);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px;
        }

        .action-label {
          font-size: 13.5px; font-weight: 700;
          color: #fff; line-height: 1.2;
        }

        .action-desc {
          font-size: 11px; color: rgba(255,255,255,0.7);
          font-weight: 400;
        }

        /* Activity Feed */
        .activity-card {
          background: #fff;
          border-radius: 20px;
          padding: 26px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }

        .activity-list {
          display: flex; flex-direction: column; gap: 4px;
        }

        .activity-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 12px;
          border-radius: 12px;
          transition: background 0.2s;
          cursor: default;
        }

        .activity-item:hover { background: #f8fafc; }

        .activity-dot {
          width: 38px; height: 38px;
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }

        .activity-text {
          flex: 1;
          font-size: 13.5px; font-weight: 600; color: #1e293b;
        }

        .activity-time {
          font-size: 11.5px; color: #94a3b8; font-weight: 500;
          white-space: nowrap;
        }

        /* ══ PROGRESS SECTION ══ */
        .progress-section {
          background: #fff;
          border-radius: 20px;
          padding: 26px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          margin-bottom: 28px;
        }

        .progress-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 4px;
        }

        .progress-item { }

        .progress-header {
          display: flex; justify-content: space-between;
          margin-bottom: 8px;
        }

        .progress-label {
          font-size: 13px; font-weight: 600; color: #334155;
        }

        .progress-pct {
          font-size: 13px; font-weight: 700;
        }

        .progress-bar-bg {
          height: 8px; border-radius: 100px;
          background: #f1f5f9; overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%; border-radius: 100px;
          transition: width 1s ease;
        }

        .progress-sub {
          font-size: 11.5px; color: #94a3b8; margin-top: 5px;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .hero-right { display: none; }
        }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr; }
          .bottom-row { grid-template-columns: 1fr; }
          .progress-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 22px; }
          .actions-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="dash-wrap">

        {/* ══════════ HERO BANNER ══════════ */}
        <div className="hero-banner">
          <div className="hero-content">
            <div className="hero-greeting">
              <span className="hero-dot" />
              Dashboard · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            <h1 className="hero-title">
              Welcome back, <span>{user?.name || 'Admin'}!</span>
            </h1>
            <p className="hero-sub">
              Here's what's happening in your system today.
            </p>
          </div>

          {/* Hero right badges */}
          <div className="hero-right">
            <div className="hero-badge">
              <div className="hero-badge-num">{loading ? '—' : stats.students}</div>
              <div className="hero-badge-label">Students</div>
            </div>
            <div className="hero-badge">
              <div className="hero-badge-num">{loading ? '—' : stats.courses}</div>
              <div className="hero-badge-label">Courses</div>
            </div>
            <div className="hero-badge">
              <div className="hero-badge-num">{loading ? '—' : stats.enrollments}</div>
              <div className="hero-badge-label">Enrolled</div>
            </div>
          </div>
        </div>

        {/* ══════════ STAT CARDS ══════════ */}
        <div className="section-title">
          <div className="section-title-icon" style={{ background: '#eff6ff' }}>📊</div>
          <div>
            <h2>Overview</h2>
            <p>Real-time system statistics</p>
          </div>
        </div>

        {loading ? (
          <div className="stats-grid" style={{ marginBottom: '28px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '20px' }} />
            ))}
          </div>
        ) : (
          <div className="stats-grid">
            {statCards.map((card, i) => (
              <div
                key={i}
                className="stat-card"
                style={{
                  background: card.gradient,
                  boxShadow: `0 16px 40px ${card.shadow}`,
                }}
              >
                <div className="stat-icon-wrap">{card.icon}</div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-title">{card.title}</div>
                <div className="stat-trend">
                  <span>{card.sparkle}</span>
                  {card.trend}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════ BOTTOM ROW ══════════ */}
        <div className="bottom-row">

          {/* Quick Actions */}
          <div className="quick-actions-card">
            <div className="section-title" style={{ marginBottom: '20px' }}>
              <div className="section-title-icon" style={{ background: '#fef3c7' }}>⚡</div>
              <div>
                <h2>Quick Actions</h2>
                <p>Jump to key tasks instantly</p>
              </div>
            </div>
            <div className="actions-grid">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={action.path}
                  className="action-btn"
                  style={{
                    background: action.gradient,
                    boxShadow: `0 8px 24px ${action.shadow}`,
                  }}
                  onClick={(e) => { e.preventDefault(); navigate(action.path); }}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-label">{action.label}</div>
                  <div className="action-desc">{action.desc}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-card">
            <div className="section-title" style={{ marginBottom: '16px' }}>
              <div className="section-title-icon" style={{ background: '#f0fdf4' }}>🕐</div>
              <div>
                <h2>Recent Activity</h2>
                <p>Latest system events</p>
              </div>
            </div>
            <div className="activity-list">
              {recentActivity.map((item, i) => (
                <div key={i} className="activity-item">
                  <div
                    className="activity-dot"
                    style={{ background: `${item.color}18` }}
                  >
                    {item.icon}
                  </div>
                  <div className="activity-text">{item.text}</div>
                  <div className="activity-time">{item.time}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ══════════ PROGRESS BARS ══════════ */}
        <div className="progress-section">
          <div className="section-title" style={{ marginBottom: '20px' }}>
            <div className="section-title-icon" style={{ background: '#fdf4ff' }}>📈</div>
            <div>
              <h2>System Performance</h2>
              <p>Monthly targets & progress</p>
            </div>
          </div>
          <div className="progress-grid">
            {[
              {
                label: 'Student Enrollment',
                pct: Math.min(100, Math.round((stats.students / 20) * 100)) || 65,
                color: 'linear-gradient(90deg,#667eea,#764ba2)',
                textColor: '#764ba2',
                sub: `${stats.students} of 20 target`,
              },
              {
                label: 'Course Completion',
                pct: Math.min(100, Math.round((stats.courses / 10) * 100)) || 78,
                color: 'linear-gradient(90deg,#f093fb,#f5576c)',
                textColor: '#f5576c',
                sub: `${stats.courses} active courses`,
              },
              {
                label: 'Attendance Rate',
                pct: 92,
                color: 'linear-gradient(90deg,#4facfe,#00f2fe)',
                textColor: '#4facfe',
                sub: 'Avg across all classes',
              },
            ].map((bar, i) => (
              <div key={i} className="progress-item">
                <div className="progress-header">
                  <span className="progress-label">{bar.label}</span>
                  <span className="progress-pct" style={{ color: bar.textColor }}>
                    {bar.pct}%
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${bar.pct}%`, background: bar.color }}
                  />
                </div>
                <div className="progress-sub">{bar.sub}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;
