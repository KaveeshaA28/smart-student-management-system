import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  {
    path: '/dashboard',
    icon: '🏠',
    label: 'Dashboard',
    roles: ['ADMIN', 'LECTURER', 'STUDENT'],
    grad: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.45)',
    hoverBg: 'rgba(99,102,241,0.10)',
  },
  {
    path: '/students',
    icon: '🎓',
    label: 'Students',
    roles: ['ADMIN', 'LECTURER'],
    grad: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    glow: 'rgba(59,130,246,0.4)',
    hoverBg: 'rgba(59,130,246,0.10)',
  },
  {
    path: '/courses',
    icon: '📚',
    label: 'Courses',
    roles: ['ADMIN', 'LECTURER', 'STUDENT'],
    grad: 'linear-gradient(135deg, #10b981, #059669)',
    glow: 'rgba(16,185,129,0.4)',
    hoverBg: 'rgba(16,185,129,0.10)',
  },
  {
    path: '/enrollments',
    icon: '📋',
    label: 'Enrollments',
    roles: ['ADMIN'],
    grad: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    glow: 'rgba(245,158,11,0.4)',
    hoverBg: 'rgba(245,158,11,0.10)',
  },
  {
    path: '/attendance',
    icon: '✅',
    label: 'Attendance',
    roles: ['ADMIN', 'LECTURER'],
    grad: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    glow: 'rgba(236,72,153,0.4)',
    hoverBg: 'rgba(236,72,153,0.10)',
  },
  {
    path: '/marks',
    icon: '📊',
    label: 'Marks & GPA',
    roles: ['ADMIN', 'LECTURER', 'STUDENT'],
    grad: 'linear-gradient(135deg, #14b8a6, #3b82f6)',
    glow: 'rgba(20,184,166,0.4)',
    hoverBg: 'rgba(20,184,166,0.10)',
  },
];

const avatarGrads = [
  'linear-gradient(135deg,#f093fb,#f5576c)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#43e97b,#38f9d7)',
  'linear-gradient(135deg,#fa709a,#fee140)',
  'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  'linear-gradient(135deg,#ffecd2,#fcb69f)',
];

const getRoleConfig = (role) => {
  switch (role) {
    case 'ADMIN':
      return {
        bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        label: '⚡ Admin',
        color: '#fff',
      };
    case 'LECTURER':
      return {
        bg: 'linear-gradient(135deg,#10b981,#059669)',
        label: '👨‍🏫 Lecturer',
        color: '#fff',
      };
    case 'STUDENT':
      return {
        bg: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
        label: '🎓 Student',
        color: '#fff',
      };
    default:
      return {
        bg: 'linear-gradient(135deg,#64748b,#475569)',
        label: role || 'User',
        color: '#fff',
      };
  }
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = menuItems.filter(item =>
    item.roles.includes(user?.role)
  );

  const roleConfig  = getRoleConfig(user?.role);
  const avatarIndex = (user?.name?.charCodeAt(0) || 0) % avatarGrads.length;
  const avatarInitial = user?.name?.[0]?.toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Shell ── */
        .sidebar-root {
          width: var(--sidebar-width, 250px);
          height: 100vh;
          position: fixed;
          left: 0; top: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(180deg, #0f172a 0%, #1e1b4b 55%, #0f172a 100%);
          box-shadow: 4px 0 32px rgba(0,0,0,0.35);
          overflow: hidden;
        }

        /* Ambient blobs */
        .sidebar-root::before {
          content: '';
          position: absolute;
          top: -60px; left: -60px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .sidebar-root::after {
          content: '';
          position: absolute;
          bottom: -40px; right: -40px;
          width: 220px; height: 220px;
          background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 65%);
          pointer-events: none;
        }

        /* ── Brand ── */
        .sb-brand {
          padding: 22px 20px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }
        .sb-logo-box {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
          box-shadow: 0 4px 18px rgba(99,102,241,0.5);
          border: 1px solid rgba(255,255,255,0.15);
        }
        .sb-brand-name {
          color: #fff;
          font-size: 1rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: 0.02em;
        }
        .sb-brand-sub {
          color: rgba(255,255,255,0.4);
          font-size: 0.68rem;
          margin: 2px 0 0;
          letter-spacing: 0.03em;
        }

        /* ── User Card ── */
        .sb-user-card {
          margin: 14px 12px;
          padding: 13px 14px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }
        .sb-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; font-weight: 800; color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
          border: 2px solid rgba(255,255,255,0.2);
        }
        .sb-user-name {
          color: #fff;
          font-size: 0.88rem;
          font-weight: 700;
          margin: 0 0 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 148px;
        }
        .sb-role-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          border: 1px solid rgba(255,255,255,0.15);
        }

        /* ── Section Label ── */
        .sb-section-label {
          padding: 10px 20px 6px;
          font-size: 0.63rem;
          font-weight: 700;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          position: relative;
          z-index: 1;
          flex-shrink: 0;
        }

        /* ── Nav ── */
        .sb-nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 2px 0 8px;
          position: relative;
          z-index: 1;
        }
        .sb-nav::-webkit-scrollbar { width: 3px; }
        .sb-nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }

        /* ── Nav Item ── */
        .sb-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          margin: 3px 10px;
          border-radius: 13px;
          text-decoration: none;
          color: rgba(255,255,255,0.55);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          border: 1px solid transparent;
        }
        .sb-nav-item:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.08);
          transform: translateX(2px);
        }
        .sb-nav-item.sb-active {
          color: #fff;
          font-weight: 700;
          border-color: rgba(255,255,255,0.12);
          transform: translateX(3px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
        }

        /* Active left-bar indicator */
        .sb-active-bar {
          position: absolute;
          left: 0; top: 18%; bottom: 18%;
          width: 3px;
          border-radius: 0 3px 3px 0;
          opacity: 0;
          transition: opacity 0.22s;
        }
        .sb-nav-item.sb-active .sb-active-bar {
          opacity: 1;
        }

        /* Icon box */
        .sb-nav-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
          transition: transform 0.22s, box-shadow 0.22s;
          position: relative;
          z-index: 1;
          background: rgba(255,255,255,0.07);
        }
        .sb-nav-item:hover .sb-nav-icon {
          transform: scale(1.1) rotate(-4deg);
        }
        .sb-nav-item.sb-active .sb-nav-icon {
          transform: scale(1.08);
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        }

        .sb-nav-label {
          position: relative;
          z-index: 1;
          flex: 1;
        }

        /* Active dot */
        .sb-nav-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          position: relative;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.22s;
          flex-shrink: 0;
        }
        .sb-nav-item.sb-active .sb-nav-dot {
          opacity: 1;
        }

        /* ── Divider ── */
        .sb-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 8px 16px;
        }

        /* ── Logout ── */
        .sb-logout-wrap {
          padding: 10px 12px 14px;
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .sb-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 16px;
          border-radius: 12px;
          border: 1px solid rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.22s;
        }
        .sb-logout-btn:hover {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 18px rgba(239,68,68,0.45);
          transform: translateY(-1px);
        }
        .sb-logout-btn:active {
          transform: translateY(0);
        }

        /* ── Version ── */
        .sb-version {
          text-align: center;
          padding: 0 12px 12px;
          font-size: 0.62rem;
          color: rgba(255,255,255,0.15);
          position: relative;
          z-index: 1;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        /* ── Mobile: hide sidebar ── */
        @media (max-width: 768px) {
          .sidebar-root { display: none; }
        }
      `}</style>

      <aside className="sidebar-root">

        {/* Brand */}
        <div className="sb-brand">
          <div className="sb-logo-box">🏫</div>
          <div>
            <p className="sb-brand-name">SmartSMS</p>
            <p className="sb-brand-sub">School Management System</p>
          </div>
        </div>

        {/* User Card */}
        <div className="sb-user-card">
          <div
            className="sb-avatar"
            style={{ background: avatarGrads[avatarIndex] }}
          >
            {avatarInitial}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p className="sb-user-name">{user?.name || 'Administrator'}</p>
            <span
              className="sb-role-badge"
              style={{ background: roleConfig.bg, color: roleConfig.color }}
            >
              {roleConfig.label}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="sb-nav">
          <div className="sb-section-label">Main Menu</div>

          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sb-nav-item${isActive ? ' sb-active' : ''}`
              }
              style={({ isActive }) => ({
                background: isActive ? item.hoverBg : 'transparent',
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains('sb-active')) {
                  e.currentTarget.style.background = item.hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains('sb-active')) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {({ isActive }) => (
                <>
                  {/* Active left bar */}
                  <span
                    className="sb-active-bar"
                    style={{ background: item.grad }}
                  />

                  {/* Icon */}
                  <span
                    className="sb-nav-icon"
                    style={{
                      background: isActive
                        ? item.grad
                        : 'rgba(255,255,255,0.07)',
                    }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className="sb-nav-label">{item.label}</span>

                  {/* Active dot */}
                  <span
                    className="sb-nav-dot"
                    style={{ background: item.grad }}
                  />
                </>
              )}
            </NavLink>
          ))}

          <div className="sb-divider" />
        </nav>

        {/* Logout */}
        <div className="sb-logout-wrap">
          <button className="sb-logout-btn" onClick={handleLogout}>
            <span style={{ fontSize: '1.05rem' }}>🚪</span>
            Logout
          </button>
        </div>

        {/* Version */}
        <div className="sb-version">SmartSMS v1.0.0</div>

      </aside>
    </>
  );
};

export default Sidebar;
