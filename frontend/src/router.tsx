import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from './components/layout/BaseLayout';
import ErrorPage from './ErrorPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import RequireAuth from './components/auth/RequireAuth';
import LoginPage from './pages/LoginPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import OltDetailPage from './pages/OltDetailPage';
import OnuDetailPage from './pages/OnuDetailPage';
import DeviceStatusPage from './pages/operational/DeviceStatusPage';
import DeviceDetailTimeline from './components/operational/DeviceDetailTimeline';
import AlarmListPage from './pages/operational/AlarmListPage';
import EventListPage from './pages/operational/EventListPage'; // Import EventListPage

// Import new pages
import CustomerListPage from './pages/CustomerListPage';
import CustomerFormPage from './pages/CustomerFormPage';
import OltListPage from './pages/OltListPage';
import OltFormPage from './pages/OltFormPage';
import OnuListPage from './pages/OnuListPage';
import OnuFormPage from './pages/OnuFormPage';
import ProfileListPage from './pages/ProfileListPage';
import ProfileFormPage from './pages/ProfileFormPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'customers',
            element: <CustomerListPage />,
          },
          {
            path: 'customers/new',
            element: <CustomerFormPage />,
          },
          {
            path: 'customers/:id/edit',
            element: <CustomerFormPage />,
          },
          {
            path: 'customers/:id',
            element: <CustomerDetailPage />,
          },
          {
            path: 'olts',
            element: <OltListPage />,
          },
          {
            path: 'olts/new',
            element: <OltFormPage />,
          },
          {
            path: 'olts/:id/edit',
            element: <OltFormPage />,
          },
          {
            path: 'olts/:id',
            element: <OltDetailPage />,
          },
          {
            path: 'onus',
            element: <OnuListPage />,
          },
          {
            path: 'onus/new',
            element: <OnuFormPage />,
          },
          {
            path: 'onus/:id/edit',
            element: <OnuFormPage />,
          },
          {
            path: 'onus/:id',
            element: <OnuDetailPage />,
          },
          {
            path: 'device-status',
            element: <DeviceStatusPage />,
          },
          {
            path: 'onus/:id/timeline',
            element: <DeviceDetailTimeline />,
          },
          {
            path: 'alarms',
            element: <AlarmListPage />,
          },
          {
            path: 'events',
            element: <EventListPage />,
          },
          {
            path: 'profiles',
            element: <ProfileListPage />,
          },
          {
            path: 'profiles/new',
            element: <ProfileFormPage />,
          },
          {
            path: 'profiles/:id/edit',
            element: <ProfileFormPage />,
          },
        ],
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
]);

export default router;

