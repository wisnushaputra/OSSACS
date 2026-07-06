import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import OnuListPage from '../OnuListPage';

vi.mock('../../services/onu', () => ({
  getOnus: vi.fn().mockResolvedValue({
    data: [{ id: '1', serialNumber: 'SN-001', customerId: 'c1', oltId: 'o1' }],
    total: 1,
    limit: 10,
    offset: 0,
  }),
}));

describe('OnuListPage', () => {
  it('renders ONU list from API', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
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
