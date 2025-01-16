import { useState } from 'react';

interface MaintenanceRequest {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  unitId: string;
  status: 'open' | 'inProgress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  escalationDeadline: string;
  escalated: boolean;
}

// Mock data for maintenance requests
const mockRequests: MaintenanceRequest[] = [
  {
    id: '1',
    tenantId: 'tenant1',
    title: 'Leaking Faucet',
    description: 'Kitchen sink faucet is leaking continuously.',
    unitId: 'unit1',
    status: 'open',
    priority: 'medium',
    assignedTo: 'staff1',
    createdBy: 'tenant1',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    escalationDeadline: '2024-03-12T10:00:00Z',
    escalated: false
  },
  {
    id: '2',
    tenantId: 'tenant2',
    title: 'AC Not Working',
    description: 'Air conditioning unit not cooling properly.',
    unitId: 'unit2',
    status: 'inProgress',
    priority: 'high',
    assignedTo: 'staff2',
    createdBy: 'tenant2',
    createdAt: '2024-03-09T15:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
    escalationDeadline: '2024-03-11T15:00:00Z',
    escalated: true
  },
  {
    id: '3',
    tenantId: 'tenant3',
    title: 'Light Bulb Replacement',
    description: 'Living room light bulb needs replacement.',
    unitId: 'unit3',
    status: 'resolved',
    priority: 'low',
    assignedTo: 'staff1',
    createdBy: 'tenant3',
    createdAt: '2024-03-08T12:00:00Z',
    updatedAt: '2024-03-09T14:00:00Z',
    escalationDeadline: '2024-03-11T12:00:00Z',
    escalated: false
  }
];

const MaintenanceRequestsView = () => {
  const [requests] = useState<MaintenanceRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = requests.filter((request) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      request.title.toLowerCase().includes(searchTerm) ||
      request.status.toLowerCase().includes(searchTerm) ||
      request.priority.toLowerCase().includes(searchTerm)
    );
  });

  const handleRequestClick = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleOpenNew = () => {
    setSelectedRequest(null);
    setShowModal(true);
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6">Maintenance Requests</h2>
      
      {/* Search and Add Section */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={handleOpenNew}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          New Request
        </button>
        <input
          type="text"
          placeholder="Search requests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <div 
            key={request.id} 
            className="bg-white rounded-lg shadow border border-gray-200 p-4"
          >
            <div className="flex flex-col gap-2">
              {/* Title and Status Row */}
              <div className="flex justify-between items-start">
                <h3 
                  onClick={() => handleRequestClick(request)}
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:underline"
                >
                  {request.title}
                </h3>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'inProgress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {request.status === 'inProgress'
                      ? 'In Progress'
                      : request.status === 'resolved'
                      ? 'Completed'
                      : 'Open'}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : request.priority === 'medium'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600">{request.description}</p>

              {/* Details Row */}
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Unit: {request.unitId}</span>
                <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                {request.assignedTo && <span>Assigned to: {request.assignedTo}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            {selectedRequest ? (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{selectedRequest.title}</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedRequest.status === 'open'
                          ? 'bg-green-100 text-green-800'
                          : selectedRequest.status === 'inProgress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {selectedRequest.status === 'inProgress'
                        ? 'In Progress'
                        : selectedRequest.status === 'resolved'
                        ? 'Completed'
                        : 'Open'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedRequest.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : selectedRequest.priority === 'medium'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">{selectedRequest.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Unit:</span> {selectedRequest.unitId}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>{' '}
                      {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </div>
                    {selectedRequest.assignedTo && (
                      <div>
                        <span className="font-medium">Assigned to:</span> {selectedRequest.assignedTo}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Last Updated:</span>{' '}
                      {new Date(selectedRequest.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* New Request Modal (placeholder) */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">New Maintenance Request</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Close
                  </button>
                </div>
                <p className="text-gray-600">
                  This is where a new maintenance request form could appear.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default MaintenanceRequestsView;
