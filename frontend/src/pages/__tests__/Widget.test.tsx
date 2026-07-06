import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import { useAuthStore } from '../../store/auth';

vi.mock('../../services/dashboard', () => ({
  dashboardApi: {
    getSummary: vi.fn().mockResolvedValue({
      totalCustomers: 10,
      totalOlts: 2,
      totalOnus: 20,
      onlineOnus: 15,
      offlineOnus: 3,
      losOnus: 1,
      dyingGaspOnus: 1,
      activeAlarms: 5,
      runningWorkflows: 2,
    }),
    getOpticalDistribution: vi.fn().mockResolvedValue({
      normal: 10,
      warning: 5,
      critical: 5,
    }),
    getOnuByVendor: vi.fn().mockResolvedValue([
      { vendor: 'Huawei', count: 12 },
      { vendor: 'ZTE', count: 8 },
    ]),
    getLatestAlarms: vi.fn().mockResolvedValue([]), // No alarms
  }
}));

describe('WidgetTest', () => {
  it('renders quick action widgets and handles no alarm state gracefully', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { login } = useAuthStore.getState();
    login('token1', 'refresh1', { id: '1', username: 'test', fullname: 'Test', roleId: 'role1' });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DashboardPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Register ONU')).toBeInTheDocument();
      expect(screen.getByText('No active alarms.')).toBeInTheDocument();
    });
  });
});
