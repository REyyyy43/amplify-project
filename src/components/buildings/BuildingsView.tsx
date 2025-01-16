import { useState } from 'react';

interface Building {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  towerCount: number;
  floorsPerTower: number;
  unitsPerFloor: number;
}

// Mock data for buildings
const mockBuildings: Building[] = [
  { 
    id: '1', 
    tenantId: 'tenant1', 
    name: 'Sunset Towers', 
    address: '123 Main St', 
    towerCount: 2,
    floorsPerTower: 10,
    unitsPerFloor: 4
  },
  { 
    id: '2', 
    tenantId: 'tenant1', 
    name: 'Ocean View Complex', 
    address: '456 Beach Road', 
    towerCount: 3,
    floorsPerTower: 15,
    unitsPerFloor: 6
  },
  { 
    id: '3', 
    tenantId: 'tenant2', 
    name: 'Mountain Heights', 
    address: '789 Hill Avenue', 
    towerCount: 1,
    floorsPerTower: 8,
    unitsPerFloor: 3
  },
];

const BuildingsView = () => {
  const [buildings] = useState<Building[]>(mockBuildings);
  const [formData, setFormData] = useState<Building>({
    id: '',
    tenantId: '',
    name: '',
    address: '',
    towerCount: 1,
    floorsPerTower: 1,
    unitsPerFloor: 1
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter buildings based on search query
  const filteredBuildings = buildings.filter((building) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      building.name.toLowerCase().includes(searchTerm) ||
      building.address.toLowerCase().includes(searchTerm)
    );
  });

  // Mock handlers (no actual functionality)
  const handleCancel = () => {
    setFormData({
      id: '',
      tenantId: '',
      name: '',
      address: '',
      towerCount: 1,
      floorsPerTower: 1,
      unitsPerFloor: 1
    });
    setShowModal(false);
  };

  return (
    <section className="user-management">
      <h2 className="section-title">Building Management</h2>
      <div className="user-list">
        <button onClick={() => setShowModal(true)} className="add-user-btn">Add Building</button>
        <input
          type="text"
          placeholder="Search buildings by name or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <h3 className="user-list-title">Registered Buildings</h3>
        <ul className="user-list-items">
          {filteredBuildings.map((building) => (
            <li key={building.id} className="user-item">
              <div className="user-info">
                <p className="user-name">{building.name}</p>
                <p className="user-details">Address: {building.address}</p>
                <p className="user-details">Towers: {building.towerCount}</p>
                <p className="user-details">Floors per Tower: {building.floorsPerTower}</p>
                <p className="user-details">Units per Floor: {building.unitsPerFloor}</p>
              </div>
              <div className="user-actions">
                <button
                  onClick={() => {
                    setFormData(building);
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

      {/* Modal for Adding/Editing Building */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{formData.id ? 'Edit Building' : 'Add Building'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCancel(); // Just close the modal for now
            }}>
              <div className="form-group">
                <label className="label">Building Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Number of Towers</label>
                <input
                  type="number"
                  min="1"
                  value={formData.towerCount}
                  onChange={(e) => setFormData({ ...formData, towerCount: parseInt(e.target.value) })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Floors per Tower</label>
                <input
                  type="number"
                  min="1"
                  value={formData.floorsPerTower}
                  onChange={(e) => setFormData({ ...formData, floorsPerTower: parseInt(e.target.value) })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Units per Floor</label>
                <input
                  type="number"
                  min="1"
                  value={formData.unitsPerFloor}
                  onChange={(e) => setFormData({ ...formData, unitsPerFloor: parseInt(e.target.value) })}
                  className="input"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {formData.id ? 'Save Changes' : 'Add Building'}
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

      {/* Confirmation Modal for Deleting Building */}
      {showConfirmDelete && (
        <div className="modal-overlay2">
          <div className="modal">
            <h2 className="modal-title">Are you sure you want to delete this building?</h2>
            <div className="modal-actions">
              <button 
                onClick={() => setShowConfirmDelete(false)} 
                className="btn-delete2"
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setShowConfirmDelete(false)} 
                className="btn-cancel2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BuildingsView; 