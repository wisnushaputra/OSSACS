import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import CustomerListPage from '../CustomerListPage';
import { useAuthStore } from '../../store/auth';

vi.mock('../../services/customer', () => ({
  customerApi: {
    getCustomers: vi.fn().mockResolvedValue({
      items: [{ id: '1', customerCode: 'C001', fullName: 'Test Customer', email: 'test@example.com', status: 'Active' }],
      total: 1,
      limit: 10,
      offset: 0,
    }),
  }
}));

describe('CustomerListPage', () => {
  it('renders customer list from API', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { login } = useAuthStore.getState();
    login('token1', 'refresh1', { id: '1', username: 'test', fullname: 'Test', roleId: 'role1' });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Customer')).toBeInTheDocument();
    });
  });
});
