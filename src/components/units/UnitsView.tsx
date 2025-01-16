import { useState } from 'react';

interface Unit {
  id: string;
  tenantId: string;
  unitNumber: string;
  status: 'sold' | 'rented';
  buildingId: string;
}

// Mock data for units
const mockUnits: Unit[] = [
  { id: '1', tenantId: 'tenant1', unitNumber: '101A', status: 'rented', buildingId: 'building1' },
  { id: '2', tenantId: 'tenant2', unitNumber: '102B', status: 'sold', buildingId: 'building1' },
  { id: '3', tenantId: 'tenant3', unitNumber: '201A', status: 'rented', buildingId: 'building2' },
  { id: '4', tenantId: 'tenant4', unitNumber: '202B', status: 'sold', buildingId: 'building2' },
];

const UnitsView = () => {
  const [units] = useState<Unit[]>(mockUnits);
  const [formData, setFormData] = useState<Unit>({
    id: '',
    tenantId: '',
    unitNumber: '',
    status: 'rented',
    buildingId: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter units based on search query
  const filteredUnits = units.filter((unit) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      unit.unitNumber.toLowerCase().includes(searchTerm) ||
      unit.status.toLowerCase().includes(searchTerm)
    );
  });

  // Mock handlers (no actual functionality)
  const handleCancel = () => {
    setFormData({ id: '', tenantId: '', unitNumber: '', status: 'rented', buildingId: '' });
    setShowModal(false);
  };

  return (
    <section className="user-management">
      <h2 className="section-title">Unit Management</h2>
      <div className="user-list">
        <button onClick={() => setShowModal(true)} className="add-user-btn">Add Unit</button>
        <input
          type="text"
          placeholder="Search units by number or status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <h3 className="user-list-title">Available Units</h3>
        <ul className="user-list-items">
          {filteredUnits.map((unit) => (
            <li key={unit.id} className="user-item">
              <div className="user-info">
                <p className="user-name">Unit {unit.unitNumber}</p>
                <p className="user-details">Status: {unit.status}</p>
                <p className="user-details">Building ID: {unit.buildingId}</p>
              </div>
              <div className="user-actions">
                <button
                  onClick={() => {
                    setFormData(unit);
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

      {/* Modal for Adding/Editing Unit */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">{formData.id ? 'Edit Unit' : 'Add Unit'}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCancel(); // Just close the modal for now
            }}>
              <div className="form-group">
                <label className="label">Unit Number</label>
                <input
                  type="text"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Building ID</label>
                <input
                  type="text"
                  value={formData.buildingId}
                  onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Tenant ID</label>
                <input
                  type="text"
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'sold' | 'rented' })}
                  className="input"
                >
                  <option value="rented">Rented</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {formData.id ? 'Save' : 'Add Unit'}
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

      {/* Confirmation Modal for Deleting Unit */}
      {showConfirmDelete && (
        <div className="modal-overlay2">
          <div className="modal">
            <h2 className="modal-title">Are you sure you want to delete this unit?</h2>
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

export default UnitsView; 