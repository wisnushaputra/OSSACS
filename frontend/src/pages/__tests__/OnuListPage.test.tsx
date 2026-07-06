import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import OnuListPage from '../OnuListPage';
import { useAuthStore } from '../../store/auth';

vi.mock('../../services/onu', () => ({
  onuApi: {
    getOnus: vi.fn().mockResolvedValue({
      items: [{ id: '1', serialNumber: 'SN-001', ponPort: '1/1/1', onuId: 1, profileName: 'Profile-1', model: 'ModelX', manufacturer: 'VendorY' }],
      total: 1,
      limit: 10,
      offset: 0,
    }),
  }
}));

describe('OnuListPage', () => {
  it('renders ONU list from API', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { login } = useAuthStore.getState();
    login('token1', 'refresh1', { id: '1', username: 'test', fullname: 'Test', roleId: 'role1' });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OnuListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('SN-001')).toBeInTheDocument();
    });
  });
});
