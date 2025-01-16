import { useState } from 'react';

interface Message {
  id: string;
  tenantId: string;
  title: string;
  content: string;
  recipientId: string;
  type: 'emergency' | 'maintenance' | 'general' | 'listing';
  createdAt: string;
  createdBy: string;
  isRead: boolean;
  readBy: Record<string, { readAt: string }>;
  linkedRentalUnitId?: string;
  recipientName?: string; // For display purposes
  senderName?: string; // For display purposes
}

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: '1',
    tenantId: 'tenant1',
    title: 'Emergency: Water Leak',
    content: 'There is a major water leak in the kitchen that needs immediate attention.',
    recipientId: 'maintenance1',
    type: 'emergency',
    createdAt: '2024-03-10T08:00:00Z',
    createdBy: 'tenant1',
    isRead: false,
    readBy: {},
    recipientName: 'Maintenance Team',
    senderName: 'John Doe'
  },
  {
    id: '2',
    tenantId: 'tenant1',
    title: 'New Listing Available',
    content: 'A new 2-bedroom apartment is available for viewing.',
    recipientId: 'tenant2',
    type: 'listing',
    createdAt: '2024-03-09T15:30:00Z',
    createdBy: 'admin1',
    isRead: true,
    readBy: { 'tenant2': { readAt: '2024-03-09T16:00:00Z' } },
    linkedRentalUnitId: 'rental1',
    recipientName: 'Jane Smith',
    senderName: 'Admin'
  },
  {
    id: '3',
    tenantId: 'tenant1',
    title: 'Maintenance Request Update',
    content: 'Your maintenance request for AC repair has been scheduled.',
    recipientId: 'tenant3',
    type: 'maintenance',
    createdAt: '2024-03-08T11:00:00Z',
    createdBy: 'maintenance1',
    isRead: true,
    readBy: { 'tenant3': { readAt: '2024-03-08T12:00:00Z' } },
    recipientName: 'Alice Johnson',
    senderName: 'Maintenance Team'
  }
];

const MessagesView = () => {
  const [messages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMessages = messages.filter((message) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      message.title.toLowerCase().includes(searchTerm) ||
      message.type.toLowerCase().includes(searchTerm) ||
      message.content.toLowerCase().includes(searchTerm)
    );
  });

  const getTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      case 'listing':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-6">Messages</h2>
      
      {/* Search and New Message Button */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => {
            setSelectedMessage(null);
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          New Message
        </button>
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div 
            key={message.id} 
            className={`bg-white rounded-lg shadow border border-gray-200 p-4 ${
              !message.isRead ? 'border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex flex-col gap-2">
              {/* Title and Type Row */}
              <div className="flex justify-between items-start">
                <h3 
                  onClick={() => {
                    setSelectedMessage(message);
                    setShowModal(true);
                  }}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                >
                  {message.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(message.type)}`}>
                  {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                </span>
              </div>

              {/* Preview Content */}
              <p className="text-gray-600 line-clamp-2">{message.content}</p>

              {/* Message Details */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex gap-4">
                  <span>From: {message.senderName}</span>
                  <span>To: {message.recipientName}</span>
                </div>
                <span>{formatDate(message.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">
                {selectedMessage ? selectedMessage.title : 'New Message'}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            
            {selectedMessage && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedMessage.type)}`}>
                    {selectedMessage.type.charAt(0).toUpperCase() + selectedMessage.type.slice(1)}
                  </span>
                </div>
                
                <p className="text-gray-600 whitespace-pre-wrap">{selectedMessage.content}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">From:</span> {selectedMessage.senderName}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {selectedMessage.recipientName}
                  </div>
                  <div>
                    <span className="font-medium">Sent:</span> {formatDate(selectedMessage.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Status:</span> {selectedMessage.isRead ? 'Read' : 'Unread'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default MessagesView; 