import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import UsersView from './components/users/UsersView';

// Define the schema type for the Amplify models
import type { Schema } from '../amplify/data/resource';
const client = generateClient<Schema>();

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'tenant' | 'taxi' | 'maintenance' | 'security';
}

const TenantAdminDashboard = () => {
  const { signOut } = useAuthenticator(); // For handling user sign-out
  const [currentView, setCurrentView] = useState("dashboard"); // New state to track the current view
  const [taskData, setTaskData] = useState({ taskName: '', assignedTo: '', deadline: '', priority: 'normal', status: 'pending' });

  // Handle Task Submission
  const handleTaskSubmit = () => {
    if (!taskData.taskName.trim() || !taskData.assignedTo.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    console.log('Task Submitted:', taskData); // Log task data for now
    setTaskData({ taskName: '', assignedTo: '', deadline: '', priority: 'normal', status: 'pending' }); // Reset task form
  };

  // Handle task field change
  const handleTaskFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle navigation
  const handleNavigation = (view: string) => {
    setCurrentView(view); // Change the current view based on the clicked link
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
          {/* Render different components based on the current view */}
          {currentView === "dashboard" && (
            <section className="dashboard-overview">
              <h2 className="section-title">Dashboard Overview</h2>
              {/* Add dashboard overview content here */}
            </section>
          )}

          {currentView === "users" && <UsersView />}

          {currentView === "task" && (
            <section className="task-management">
              <h2 className="section-title">Task Management</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleTaskSubmit();
              }}>
                <div className="form-group">
                  <label className="label">Task Name</label>
                  <input
                    type="text"
                    name="taskName"
                    value={taskData.taskName}
                    onChange={handleTaskFieldChange}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Assigned To</label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={taskData.assignedTo}
                    onChange={handleTaskFieldChange}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={taskData.deadline}
                    onChange={handleTaskFieldChange}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Priority</label>
                  <select
                    name="priority"
                    value={taskData.priority}
                    onChange={handleTaskFieldChange}
                    className="input"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Status</label>
                  <select
                    name="status"
                    value={taskData.status}
                    onChange={handleTaskFieldChange}
                    className="input"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-submit">Submit Task</button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default TenantAdminDashboard;
