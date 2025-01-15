import { useState } from "react";
import '/src/styles/tailwind.css';
import type { Schema } from '@/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

export default function UserDashboard() {
  const client = generateClient<Schema>();
  const [users, setUsers] = useState<Schema['User'][]>([]);

  // Cargar usuarios al inicio
  useEffect(() => {
    listUsers();
  }, []);

  // Función para listar usuarios
  async function listUsers() {
    const { data } = await client.models.User.list();
    setUsers(data);
  }

  // Función para agregar usuario
  async function addUser() {
    const name = prompt('Ingrese el nombre del usuario:');
    const email = prompt('Ingrese el correo electrónico del usuario:');
    if (name && email) {
      const { data, errors } = await client.models.User.create({
        id: crypto.randomUUID(),
        name,
        email,
      });
      if (errors) console.error(errors);
      else listUsers(); // Actualizar la lista
    }
  }

  // Función para eliminar usuario
  async function deleteUser(id: string) {
    const { errors } = await client.models.User.delete({ id });
    if (errors) console.error(errors);
    else listUsers(); // Actualizar la lista
  }

  // Función para editar usuario
  async function editUser(id: string) {
    const name = prompt('Ingrese el nuevo nombre del usuario:');
    const email = prompt('Ingrese el nuevo correo electrónico del usuario:');
    if (name && email) {
      const { data, errors } = await client.models.User.update({
        id,
        name,
        email,
      });
      if (errors) console.error(errors);
      else listUsers(); // Actualizar la lista
    }
  }

  return (
    <div>
      <h1>Dashboard de Usuarios</h1>
      <button onClick={addUser}>Agregar Usuario</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} ({user.email})
            <button onClick={() => editUser(user.id)}>Editar</button>
            <button onClick={() => deleteUser(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}



// // import { useState } from "react";
// import '/src/styles/tailwind.css';


// interface User {
//   id: number | null;
//   name: string;
//   email: string;
// }

// const TenantAdminDashboard = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [showMessagingModal, setShowMessagingModal] = useState(false);
//   const [users, setUsers] = useState<User[]>([
//     { id: 1, name: "John Doe", email: "john@example.com" },
//     { id: 2, name: "Jane Smith", email: "jane@example.com" },
//   ]);
//   const [formData, setFormData] = useState<User>({ id: null, name: "", email: "" });
//   const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
//   const [userEmail, setUserEmail] = useState("");  // Cambié messageTitle por userEmail
//   const [messageContent, setMessageContent] = useState("");

//   const handleNavigation = (section: string) => {
//     alert(`Navigating to ${section}...`);
//   };

//   const handleAddUser = () => {
//     if (!formData.name.trim() || !formData.email.trim()) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     if (formData.id !== null) {
//       // Edit user
//       setUsers((prevUsers) =>
//         prevUsers.map((user) => (user.id === formData.id ? formData : user))
//       );
//     } else {
//       // Add new user
//       setUsers((prevUsers) => [...prevUsers, { ...formData, id: Date.now() }]);
//     }
//     setFormData({ id: null, name: "", email: "" });
//     setShowModal(false);
//   };

//   const handleEditUser = (user: User) => {
//     setFormData(user);
//     setShowModal(true);
//   };

//   const handleDeleteUser = (id: number) => {
//     setDeleteConfirmation(id);
//   };

//   const confirmDeleteUser = () => {
//     if (deleteConfirmation !== null) {
//       setUsers((prevUsers) => prevUsers.filter((user) => user.id !== deleteConfirmation));
//       setDeleteConfirmation(null);
//     }
//   };

//   const cancelDeleteUser = () => {
//     setDeleteConfirmation(null);
//   };

//   const handleSendMessage = () => {
//     if (!userEmail.trim() || !messageContent.trim()) {
//       alert("Please fill in both fields.");
//       return;
//     }

//     // Handle sending the message here (e.g., save to database or send to backend)
//     alert(`Message sent!\nUser Email: ${userEmail}\nContent: ${messageContent}`);
//     setUserEmail("");
//     setMessageContent("");
//     setShowMessagingModal(false);
//   };

//   return (
//     <div className="flex bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white min-h-screen">
//         <nav className="space-y-4 p-4">
//           <a onClick={() => handleNavigation("Dashboard Overview")} className="block py-2 px-4 bg-gray-900 rounded-lg cursor-pointer">Dashboard Overview</a>
//           <a onClick={() => setShowMessagingModal(true)} className="block py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer">Messaging</a>
//           <a onClick={() => handleNavigation("Rentals")} className="block py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer">Rentals</a>
//           <a onClick={() => handleNavigation("Maintenance Requests")} className="block py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer">Maintenance Requests</a>
//           <a onClick={() => handleNavigation("Task Management")} className="block py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer">Task Management</a>
//           <a onClick={() => handleNavigation("Tenant Information")} className="block py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer">Tenant Information</a>
//           <a onClick={() => handleNavigation("Event Calendar")} className="block py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer">Event Calendar</a>
//           <a onClick={() => handleNavigation("Reports & Analytics")} className="block py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer">Reports & Analytics</a>
//           <a onClick={() => handleNavigation("Audit & Notifications")} className="block py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer">Audit & Notifications</a>
//           <a onClick={() => handleNavigation("Settings")} className="block py-2 px-4 hover:bg-gray-700 rounded-lg cursor-pointer">Settings</a>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1">
//         {/* Header */}
//         <header className="bg-white shadow-md p-4 flex items-center justify-between">
//           <div className="text-lg font-bold text-blue-600">Company Logo</div>
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 mx-4"
//           />
//           <img
//             src="https://via.placeholder.com/40"
//             alt="User Avatar"
//             className="h-10 w-10 rounded-full border"
//           />
//         </header>

//         {/* Main Content Sections */}
//         <main className="p-6 space-y-6">
//           {/* Building Management Overview */}
//           <section>
//             <h2 className="text-xl font-semibold text-gray-700">Building Management Overview</h2>
//             <div className="grid grid-cols-3 gap-4 mt-4">
//               <div className="p-4 bg-white shadow rounded-lg">
//                 <h3 className="text-gray-500">Total Buildings</h3>
//                 <input type="number" className="text-2xl font-bold text-gray-700 w-full" defaultValue={3} />
//               </div>
//               <div className="p-4 bg-white shadow rounded-lg">
//                 <h3 className="text-gray-500">Occupancy Rate</h3>
//                 <input type="number" className="text-2xl font-bold text-gray-700 w-full" defaultValue={85} />
//               </div>
//               <div className="p-4 bg-white shadow rounded-lg">
//                 <h3 className="text-gray-500">Total Units</h3>
//                 <input type="number" className="text-2xl font-bold text-gray-700 w-full" defaultValue={150} />
//               </div>
//             </div>
//           </section>

//           {/* User Management Section */}
//           <section>
//             <h2 className="text-xl font-semibold p-4 text-gray-700">User Management</h2>
//             <div className="p-4 bg-white shadow rounded-lg">
//               <button
//                 onClick={() => setShowModal(true)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//               >
//                 Add User
//               </button>
//               <h3 className="mt-4 text-lg font-semibold">Registered Tenants</h3>
//               <ul className="mt-4 space-y-2">
//                 {users.map((user) => (
//                   <li key={user.id} className="flex justify-between items-center p-2 border rounded-lg">
//                     <div>
//                       <p className="text-gray-700">{user.name}</p>
//                       <p className="text-gray-500 text-sm">{user.email}</p>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEditUser(user)}
//                         className="px-2 py-1 bg-yellow-500 text-white rounded-lg"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteUser(user.id!)}
//                         className="px-2 py-1 bg-red-600 text-white rounded-lg"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </section>
//         </main>
//       </div>

//       {/* Modal for Adding/Editing User */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-semibold mb-4">{formData.id ? "Edit User" : "Add User"}</h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleAddUser();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block text-gray-700">Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Email</label>
//                 <input
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   className="w-full px-4 py-2 border rounded-lg"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
//                   {formData.id ? "Save Changes" : "Add User"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Messaging Modal */}
//       {showMessagingModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-semibold mb-4">Send Message</h2>
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSendMessage();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block text-gray-700">User Email</label>
//                 <input
//                   type="email"
//                   value={userEmail}
//                   onChange={(e) => setUserEmail(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-lg"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-700">Message Content</label>
//                 <textarea
//                   value={messageContent}
//                   onChange={(e) => setMessageContent(e.target.value)}
//                   className="w-full px-4 py-2 border rounded-lg"
//                   rows={4}
//                   required
//                 />
//               </div>
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowMessagingModal(false)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
//                   Send Message
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deleteConfirmation && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-semibold mb-4">Are you sure?</h2>
//             <p className="text-gray-700">Are you sure you want to delete this user?</p>
//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 onClick={cancelDeleteUser}
//                 className="px-4 py-2 bg-gray-500 text-white rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmDeleteUser}
//                 className="px-4 py-2 bg-red-600 text-white rounded-lg"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TenantAdminDashboard;
