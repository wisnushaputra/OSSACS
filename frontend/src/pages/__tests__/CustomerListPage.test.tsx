import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import CustomerListPage from '../CustomerListPage';

vi.mock('../../services/customer', () => ({
  getCustomers: vi.fn().mockResolvedValue({
    data: [{ id: '1', customerCode: 'C001', fullName: 'Test Customer', status: 'Active' }],
    total: 1,
    limit: 10,
    offset: 0,
  }),
}));

describe('CustomerListPage', () => {
  it('renders customer list from API', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
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
