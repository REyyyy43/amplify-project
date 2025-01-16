import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'tenant' | 'taxi' | 'maintenance' | 'security';
}

const UsersView = () => {
  const [users, setUsers] = useState<User[]>([]); 
  const [formData, setFormData] = useState<User>({ id: '', name: '', email: '', phone: '', role: 'tenant' });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add this useEffect to fetch users
  useEffect(() => {
    const subscription = client.models.User.observeQuery().subscribe({
      next: (data) => {
        const mappedUsers = data.items
          .filter((item) => item.content)
          .map((item) => {
            const [name = 'Unknown', email = 'Unknown', phone = 'Unknown', role = 'tenant'] = item.content!.split('|');
            const validRoles: ('tenant' | 'taxi' | 'maintenance' | 'security')[] = ['tenant', 'taxi', 'maintenance', 'security'];
            const roleValue = validRoles.includes(role as 'tenant' | 'taxi' | 'maintenance' | 'security') 
              ? (role as 'tenant' | 'taxi' | 'maintenance' | 'security') 
              : 'tenant';
            return { id: item.id, name, email, phone, role: roleValue };
          });
        setUsers(mappedUsers);
      },
    });
    return () => subscription.unsubscribe();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  });

  // Handle form submission for creating/updating users
  const handleAddUser = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    const content = `${formData.name}|${formData.email}|${formData.phone}|${formData.role}`;

    try {
      if (formData.id) {
        await client.models.User.update({ id: formData.id, content });
      } else {
        await client.models.User.create({ content });
      }
      setFormData({ id: '', name: '', email: '', phone: '', role: 'tenant' });
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Error saving user. Please try again.');
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (formData.id) {
      try {
        await client.models.User.delete({ id: formData.id });
        setShowModal(false);
        setShowConfirmDelete(false);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({ id: '', name: '', email: '', phone: '', role: 'tenant' });
    setShowModal(false);
  };

  return (
    <section className="user-management">
      <h2 className="section-title">User Management</h2>
      <div className="user-list">
        <button onClick={() => setShowModal(true)} className="add-user-btn">Add User</button>
        <input
          type="text"
          placeholder="Search users by name or role"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
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

      {/* Modal for Adding/Editing User */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{formData.id ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddUser();
            }}>
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
                <button type="submit" className="btn-submit">
                  {formData.id ? 'Save' : 'Add User'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
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
    </section>
  );
};

export default UsersView; 