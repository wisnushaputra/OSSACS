import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import OltListPage from '../OltListPage';

vi.mock('../../services/olt', () => ({
  getOlts: vi.fn().mockResolvedValue({
    data: [{ id: '1', name: 'OLT-001', vendor: 'Huawei', status: 'active' }],
    total: 1,
    limit: 10,
    offset: 0,
  }),
}));

describe('OltListPage', () => {
  it('renders OLT list from API', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
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
