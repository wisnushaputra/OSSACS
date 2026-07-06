import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import OltListPage from '../OltListPage';
import { useAuthStore } from '../../store/auth';

vi.mock('../../services/olt', () => ({
  oltApi: {
    getOlts: vi.fn().mockResolvedValue({
      items: [{ id: '1', name: 'OLT-001', vendor: 'Huawei', ipAddress: '192.168.1.1', status: 'active' }],
      total: 1,
      limit: 10,
      offset: 0,
    }),
  }
}));

describe('OltListPage', () => {
  it('renders OLT list from API', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { login } = useAuthStore.getState();
    login('token1', 'refresh1', { id: '1', username: 'test', fullname: 'Test', roleId: 'role1' });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OltListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('OLT-001')).toBeInTheDocument();
    });
  });
});
