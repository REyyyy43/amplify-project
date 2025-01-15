import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json'; // Asegúrate de que la ruta esté correcta
import '@aws-amplify/ui-react/styles.css';
import TenantAdminDashboard from './pages/tenantAdmin/DashboardTenant'; // Ruta correcta

// Configuración de Amplify
Amplify.configure(outputs);

// Punto de entrada principal
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <TenantAdminDashboard />
);


