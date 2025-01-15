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

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="sidebar">
        <nav className="nav">
          <a className="nav-item">Dashboard Overview</a>
          <a onClick={() => alert('Navigating to Rentals')} className="nav-item">
            Rentals
          </a>
          <a onClick={() => alert('Navigating to Maintenance Requests')} className="nav-item">
            Maintenance Requests
          </a>
          <a onClick={() => alert('Navigating to Reports & Analytics')} className="nav-item">
            Reports & Analytics
          </a>
          <button onClick={signOut} className="sign-out">
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <h1 className="header-title">Tenant Admin Dashboard</h1>
          <button onClick={signOut} className="sign-out-button">
            Sign Out
          </button>
        </header>

        {/* Main Content */}
        <main className="main-section">
          {/* User Management Section */}
          <section>
            <h2 className="section-title">User Management</h2>
            <div className="user-management">
              <button onClick={() => setShowModal(true)} className="add-user-button">
                Add User
              </button>
              <h3 className="user-list-title">Registered Users</h3>
              <ul className="user-list">
                {users.map((user) => (
                  <li key={user.id} className="user-item">
                    <div>
                      <p className="user-name">{user.name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="user-actions">
                      <button
                        onClick={() => {
                          setFormData(user);
                          setShowModal(true);
                        }}
                        className="edit-button"
                      >
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
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
              <div className="form-field">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-button">
                  Cancel
                </button>
                <button type="submit" className="submit-button">
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
