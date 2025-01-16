import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import UsersView from './components/users/UsersView';
import TaskView from './components/tasks/TaskView';

const TenantAdminDashboard = () => {
  const { signOut } = useAuthenticator();
  const [currentView, setCurrentView] = useState("dashboard");

  // Handle navigation
  const handleNavigation = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <a onClick={() => handleNavigation("dashboard")} className="sidebar-item">Dashboard Overview</a>
          <a onClick={() => handleNavigation("buildings")} className="sidebar-item">Buildings</a>
          <a onClick={() => handleNavigation("users")} className="sidebar-item">Users</a>
          <a onClick={() => handleNavigation("units")} className="sidebar-item">Units</a>
          <a onClick={() => handleNavigation("task")} className="sidebar-item">Task</a>
          <a onClick={() => handleNavigation("messages")} className="sidebar-item">Messages</a>
          <a onClick={() => handleNavigation("notifications")} className="sidebar-item">Notifications</a>
          <a onClick={() => handleNavigation("maintenance")} className="sidebar-item">Maintenance Requests</a>
          <a onClick={() => handleNavigation("reports")} className="sidebar-item">Reports & Analytics</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title-search">
            <h1 className="header-title">Tenant Admin Dashboard</h1>
          </div>
          <button onClick={signOut} className="sign-out-btn">Sign Out</button>
        </header>

        {/* Main Content */}
        <main className="main-section">
          {currentView === "dashboard" && (
            <section className="dashboard-overview">
              <h2 className="section-title">Dashboard Overview</h2>
              {/* Add dashboard overview content here */}
            </section>
          )}

          {currentView === "users" && <UsersView />}
          {currentView === "task" && <TaskView />}
        </main>
      </div>
    </div>
  );
};

export default TenantAdminDashboard;
