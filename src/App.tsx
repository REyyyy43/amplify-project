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
}

const TenantAdminDashboard = () => {
  const { signOut } = useAuthenticator(); // For handling user sign-out
  const [users, setUsers] = useState<User[]>([]); // Local state for users (mapped from Todo table)
  const [formData, setFormData] = useState<User>({ id: '', name: '', email: '' }); // Form for adding/editing users
  const [showModal, setShowModal] = useState(false); // State to toggle Add/Edit User modal
  const [currentView, setCurrentView] = useState("dashboard"); // New state to track the current view

  // Fetch users (mapped from Todo table) on component mount
  useEffect(() => {
    const subscription = client.models.User.observeQuery().subscribe({
      next: (data) => {
        // Map the Todo items to User objects
        const mappedUsers = data.items
          .filter((item) => item.content) // Filtrar elementos con contenido no nulo
          .map((item) => {
            const [name = 'Unknown', email = 'Unknown'] = item.content!.split('|'); // Proporcionar valores predeterminados
            return { id: item.id, name, email };
          });
        setUsers(mappedUsers);
      },
    });
    return () => subscription.unsubscribe(); // Cleanup the subscription on unmount
  }, []);

  // Create or update a user
  const handleAddUser = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    // Create a new Todo item representing a user
    const content = `${formData.name}|${formData.email}`; // Use a delimiter to store both name and email in content
    if (formData.id) {
      // Update existing user
      await client.models.User.update({ id: formData.id, content });
    } else {
      // Create new user
      await client.models.User.create({ content });
    }

    setFormData({ id: '', name: '', email: '' }); // Reset the form
    setShowModal(false);
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
          <a onClick={() => handleNavigation("rentals")} className="sidebar-item">Rentals</a>
          <a onClick={() => handleNavigation("maintenance")} className="sidebar-item">Maintenance Requests</a>
          <a onClick={() => handleNavigation("reports")} className="sidebar-item">Reports & Analytics</a>
          <button onClick={signOut} className="sidebar-item sign-out-btn">Sign Out</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h1 className="header-title">Tenant Admin Dashboard</h1>
          <button onClick={signOut} className="sign-out-btn">Sign Out</button>
        </header>

        {/* Main Content */}
        <main className="main-section">
          {/* Render different components based on the current view */}
          {currentView === "dashboard" && (
            <section className="user-management">
              <h2 className="section-title">User Management</h2>
              <div className="user-list">
                <button onClick={() => setShowModal(true)} className="add-user-btn">Add User</button>
                <h3 className="user-list-title">Registered Users</h3>
                <ul className="user-list-items">
                  {users.map((user) => (
                    <li key={user.id} className="user-item">
                      <div className="user-info">
                        <p className="user-name">{user.name}</p>
                        <p className="user-email">{user.email}</p>
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

          {/* Placeholder for other views */}
          {currentView === "rentals" && <div>Rentals Content</div>}
          {currentView === "maintenance" && <div>Maintenance Requests Content</div>}
          {currentView === "reports" && <div>Reports & Analytics Content</div>}
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
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {formData.id ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantAdminDashboard;
