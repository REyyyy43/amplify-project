import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';

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
  const [users, setUsers] = useState<User[]>([]); // Local state for users (mapped from Todo table)
  const [formData, setFormData] = useState<User>({ id: '', name: '', email: '', phone: '', role: 'tenant' }); // Form for adding/editing users
  const [showModal, setShowModal] = useState(false); // State to toggle Add/Edit User modal
  const [currentView, setCurrentView] = useState("dashboard"); // New state to track the current view
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // State for confirm delete modal
  const [taskData, setTaskData] = useState({ taskName: '', assignedTo: '', deadline: '', priority: 'normal', status: 'pending' });

  // Fetch users (mapped from Todo table) on component mount
  useEffect(() => {
    const subscription = client.models.User.observeQuery().subscribe({
      next: (data) => {
        // Map the Todo items to User objects
        const mappedUsers = data.items
          .filter((item) => item.content) // Filtrar elementos con contenido no nulo
          .map((item) => {
            const [name = 'Unknown', email = 'Unknown', phone = 'Unknown', role = 'tenant'] = item.content!.split('|'); // Asignar un valor por defecto 'tenant' para el rol
            // Validar y asegurarse de que el role sea uno de los valores válidos
            const validRoles: ('tenant' | 'taxi' | 'maintenance' | 'security')[] = ['tenant', 'taxi', 'maintenance', 'security'];
            const roleValue = validRoles.includes(role as 'tenant' | 'taxi' | 'maintenance' | 'security') ? (role as 'tenant' | 'taxi' | 'maintenance' | 'security') : 'tenant'; // Asegurar que el valor de 'role' sea uno de los valores válidos
            return { id: item.id, name, email, phone, role: roleValue };
          });
        setUsers(mappedUsers); // Ahora 'role' es uno de los valores válidos
      },
    });
    return () => subscription.unsubscribe(); // Cleanup the subscription on unmount
  }, []);

  // Handle search
  const filteredUsers = users.filter((user) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  });

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

  // Create or update a user
  const handleAddUser = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    // Create a new Todo item representing a user
    const content = ${formData.name}|${formData.email}|${formData.phone}|${formData.role}; // Use a delimiter to store both name and email in content

    if (formData.id) {
      // Update existing user
      await client.models.User.update({ id: formData.id, content });
    } else {
      // Create new user
      await client.models.User.create({ content });
    }

    setFormData({ id: '', name: '', email: '', phone: '', role: 'tenant' }); // Reset the form
    setShowModal(false);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (formData.id) {
      await client.models.User.delete({ id: formData.id });
      setShowModal(false); // Close the modal
    }
  };

  // Handle navigation
  const handleNavigation = (view: string) => {
    setCurrentView(view); // Change the current view based on the clicked link
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ id: '', name: '', email: '', phone: '', role: 'tenant' }); // Reset form
    setShowModal(false); // Close modal
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
          <button onClick={signOut} className="sidebar-item sign-out-btn">Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title-search">
            <h1 className="header-title">Tenant Admin Dashboard</h1>
            <input
              type="text"
              placeholder="Search users by name or role"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={signOut} className="sign-out-btn">Sign Out</button>
        </header>

       {/* Main Content */}
<main className="main-section">
  {/* Render different components based on the current view */}
  {currentView === "dashboard" && (
    <section>
    <h2 className="building-overview-title">Building Management Overview</h2>
    <div className="grid-container">
      <div className="building-card">
        <h3 className="card-title">Total Buildings</h3>
        <input type="number" className="card-input" defaultValue={3} />
      </div>
      <div className="building-card">
        <h3 className="card-title">Occupancy Rate</h3>
        <input type="number" className="card-input" defaultValue={85} />
      </div>
      <div className="building-card">
        <h3 className="card-title">Total Units</h3>
        <input type="number" className="card-input" defaultValue={150} />
      </div>
    </div>
  </section>
  )}

  {currentView === "dashboard" && (
    <section className="user-management">
      <h2 className="section-title">User Management</h2>
      <div className="user-list">
        <button onClick={() => setShowModal(true)} className="add-user-btn">Add User</button>
        <h3 className="user-list-title">Registered Users</h3>
        <ul className="user-list-items">
          {filteredUsers.map((user) => (
            <li key={user.id} className="user-item">
              <div className="user-info">
                <p className="user-name">{user.name}</p>
              </div>
              <div className="user-actions">
                <button
                  onClick={() => {
                    setFormData(user);
                    setShowModal(true);
                  }}
                  className="edit-btn"
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )}


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

      {/* Modal for Adding/Editing User */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{formData.id ? 'Edit User' : 'Add User'}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <div className="form-group">
                <label className="label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Phone</label>
                <input
                  type="number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'tenant' | 'taxi' | 'maintenance' | 'security' })}
                  className="input"
                >
                  <option value="tenant">Tenant</option>
                  <option value="taxi">Taxi</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="security">Security</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">{formData.id ? 'Save' : 'Add User'}</button>
                <button
                  type="button"
                  onClick={handleCancel} // Use the new cancel function
                  className="cancel-btn"
                >
                  Cancel
                </button>

                {formData.id && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                )}
               </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting User */}
      {showConfirmDelete && (
        <div className="modal-overlay2">
          <div className="modal">
            <h2 className="modal-title">Are you sure you want to delete this user?</h2>
            <div className="modal-actions">
              <button onClick={handleDeleteUser} className="btn-delete2">Yes, Delete</button>
              <button onClick={() => setShowConfirmDelete(false)} className="btn-cancel2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantAdminDashboard;