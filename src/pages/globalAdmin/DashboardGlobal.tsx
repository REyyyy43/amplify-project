import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import "../styles/globalAdmin.css";

const DashboardGlobal: React.FC = () => {
  const [admins, setAdmins] = useState<{ name: string; email: string; password: string }[]>([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const addAdmin = () => {
    if (form.name && form.email && form.password) {
      setAdmins([...admins, form]);
      setForm({ name: '', email: '', password: '' });
    } else {
      alert('Please fill in all fields');
    }
  };

  React.useEffect(() => {
    let barChart: Chart | null = null;
    let pieChart: Chart | null = null;
    
    const barCtx = document.getElementById('barChart') as HTMLCanvasElement;
    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;

    if (barCtx && pieCtx) {
      barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Building 1', 'Building 2', 'Building 3'],
          datasets: [
            {
              label: 'Occupancy',
              data: [75, 85, 90],
              backgroundColor: ['rgba(75, 192, 192, 0.2)'],
              borderColor: ['rgba(75, 192, 192, 1)'],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Rented', 'Vacant'],
          datasets: [
            {
              data: [150, 70],
              backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
              borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            },
          ],
        },
      });
    }

    return () => {
      barChart?.destroy();
      pieChart?.destroy();
    };
  }, []);

  return (
    <div className="bg-gray-100 font-sans">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="text-lg font-bold text-blue-600">Company Logo</div>
        <div className="flex-grow max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 016 6v4l1 2v1H3v-1l1-2V8a6 6 0 016-6zm-7 12h14v1H3v-1z" />
            </svg>
          </button>
          <img src="https://via.placeholder.com/40" alt="User Avatar" className="h-10 w-10 rounded-full border" />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white min-h-screen">
          <nav className="space-y-4 p-4">
            <a href="#" className="block py-2 px-4 bg-gray-900 rounded-lg">
              Dashboard Overview
            </a>
            {/* Add other navigation items */}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Overview Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700">Building Management Overview</h2>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="p-4 bg-white shadow rounded-lg">
                <h3 className="text-gray-500">Total Buildings</h3>
                <input type="number" className="text-2xl font-bold text-gray-700 w-full" />
              </div>
              {/* Add other overview cards */}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-white shadow rounded-lg">
                <canvas id="barChart"></canvas>
              </div>
              <div className="p-4 bg-white shadow rounded-lg">
                <canvas id="pieChart"></canvas>
              </div>
            </div>
          </section>

          {/* Admin Management */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700">Admin Management</h2>
            <div className="bg-white p-4 shadow rounded-lg mt-4">
              <h3 className="text-gray-500">Add Admin</h3>
              <div className="space-y-4 mt-4">
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Admin Name"
                  value={form.name}
                  onChange={handleInputChange}
                />
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Admin Email"
                  value={form.email}
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Admin Password"
                  value={form.password}
                  onChange={handleInputChange}
                />
                <button onClick={addAdmin} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Admin
                </button>
              </div>
            </div>
            <div>
              {admins.map((admin, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow mb-2"
                >
                  <div>
                    <div className="text-gray-700">
                      <h1 className="font-bold">{admin.name}</h1> ({admin.email})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardGlobal;
