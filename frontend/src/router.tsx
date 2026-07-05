import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from './components/layout/BaseLayout';
import ErrorPage from './ErrorPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import RequireAuth from './components/auth/RequireAuth';
import LoginPage from './pages/LoginPage';

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
          // Add other protected routes here
        ],
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      // Add other routes here
    ],
  },
]);

export default router;
