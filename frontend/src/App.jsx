import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import ProtectedRoute     from './components/common/ProtectedRoute';
import Sidebar            from './components/common/Sidebar';
import Login              from './pages/auth/Login';
import Dashboard          from './pages/dashboard/Dashboard';
import Students           from './pages/students/Students';
import Courses            from './pages/courses/Courses';
import Enrollment         from './pages/enrollment/Enrollment';
import Attendance         from './pages/attendance/Attendance';
import Marks              from './pages/marks/Marks';

/* ─────────────────────────────────────────────
   Global Styles
───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --sidebar-width:  250px;
      --primary:        #4f46e5;
      --primary-dark:   #4338ca;
      --secondary:      #06b6d4;
      --success:        #10b981;
      --warning:        #f59e0b;
      --danger:         #ef4444;
      --dark:           #1e293b;
      --light:          #f8fafc;
      --gray:           #64748b;
      --border:         #e2e8f0;
    }

    html, body, #root {
      height: 100%;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f0f4ff;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a { text-decoration: none; color: inherit; }

    button { cursor: pointer; border: none; outline: none; font-family: inherit; }

    input, select, textarea { outline: none; font-family: inherit; }

    ::-webkit-scrollbar       { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  `}</style>
);

/* ─────────────────────────────────────────────
   Layout
───────────────────────────────────────────── */
const Layout = ({ children }) => (
  <>
    <style>{`
      .app-shell {
        display: flex;
        min-height: 100vh;
      }
      .app-content {
        margin-left: var(--sidebar-width);
        flex: 1;
        min-height: 100vh;
        background: #f0f4ff;
        overflow-x: hidden;
        transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
      }
      @media (max-width: 768px) {
        .app-content { margin-left: 0; }
      }
    `}</style>
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        {children}
      </main>
    </div>
  </>
);

/* ─────────────────────────────────────────────
   404 Page
───────────────────────────────────────────── */
const NotFound = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
    background: '#f0f4ff',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
  }}>
    <div style={{ fontSize: '5rem', lineHeight: 1 }}>🔍</div>
    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
      404 — Page Not Found
    </h1>
    <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '360px', lineHeight: 1.6 }}>
      The page you are looking for does not exist or you don't have permission to view it.
    </p>
    <a
      href="/dashboard"
      style={{
        marginTop: '8px',
        padding: '12px 32px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: '#fff',
        fontWeight: 700,
        fontSize: '0.95rem',
        boxShadow: '0 4px 18px rgba(99,102,241,0.4)',
      }}
    >
      ← Back to Dashboard
    </a>
  </div>
);

/* ─────────────────────────────────────────────
   App
───────────────────────────────────────────── */
const App = () => {
  return (
    <>
      <GlobalStyles />
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/"      element={<Navigate to="/dashboard" replace />} />

            {/* All roles */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />

            {/* ADMIN + LECTURER */}
            <Route path="/students" element={
              <ProtectedRoute roles={['ADMIN', 'LECTURER']}>
                <Layout><Students /></Layout>
              </ProtectedRoute>
            } />

            {/* All roles */}
            <Route path="/courses" element={
              <ProtectedRoute>
                <Layout><Courses /></Layout>
              </ProtectedRoute>
            } />

            {/* ADMIN only */}
            <Route path="/enrollments" element={
              <ProtectedRoute roles={['ADMIN']}>
                <Layout><Enrollment /></Layout>
              </ProtectedRoute>
            } />

            {/* ADMIN + LECTURER */}
            <Route path="/attendance" element={
              <ProtectedRoute roles={['ADMIN', 'LECTURER']}>
                <Layout><Attendance /></Layout>
              </ProtectedRoute>
            } />

            {/* All roles */}
            <Route path="/marks" element={
              <ProtectedRoute>
                <Layout><Marks /></Layout>
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default App;
