import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from './components/layout/BaseLayout';
import ErrorPage from './ErrorPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Add other routes here
    ],
  },
]);

export default router;
