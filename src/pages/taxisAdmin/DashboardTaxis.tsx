import { useState } from "react";
import '/src/styles/tailwind.css';
import {
  Line
} from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Sample data for the line chart
  const taxiUsageData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Taxis Usage Per Month",
        data: [30, 45, 60, 50, 70, 80, 90],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const taxiList = [
    { id: 1, number: "TX001", phone: "+123456789" },
    { id: 2, number: "TX002", phone: "+987654321" },
    { id: 3, number: "TX003", phone: "+123459876" },
  ];

  const handleSendNotification = () => {
    if (message.trim()) {
      setNotifications((prev) => [...prev, message]); // Actualiza correctamente las notificaciones
      setMessage(""); // Limpia el campo de texto
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Taxi Management Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Metrics Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Monthly Taxi Usage</h2>
          <Line data={taxiUsageData} />
        </div>

        {/* Messaging Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Send Notifications</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a notification message..."
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleSendNotification}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send Notification
          </button>

          <h3 className="text-lg font-semibold mt-6">Sent Notifications</h3>
          <ul className="list-disc pl-5 mt-2">
            {notifications.map((note, index) => (
              <li key={index} className="text-gray-700">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Taxi List Section */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Taxi List</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Taxi Number</th>
              <th className="border border-gray-200 px-4 py-2">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {taxiList.map((taxi) => (
              <tr key={taxi.id} className="text-gray-700">
                <td className="border border-gray-200 px-4 py-2 text-center">{taxi.number}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{taxi.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;




