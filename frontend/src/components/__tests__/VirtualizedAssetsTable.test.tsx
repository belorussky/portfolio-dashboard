import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import {
  VirtualizedAssetsTable,
  GET_ASSETS,
} from '@/components/VirtualizedAssetsTable';

const mocks = [
  {
    request: {
      query: GET_ASSETS,
    },
    result: {
      data: {
        assets: [
          { id: 1, symbol: 'AAPL', name: 'Apple Inc.' },
          { id: 2, symbol: 'TSLA', name: 'Tesla Inc.' },
          { id: 3, symbol: 'MSFT', name: 'Microsoft Corp.' },
        ],
      },
    },
  },
];

describe('VirtualizedAssetsTable', () => {
  it('renders header and some rows from virtualized list', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <VirtualizedAssetsTable />
      </MockedProvider>,
    );

    // Wait for loading to finish
    await waitFor(() => expect(screen.queryByText(/Loading/)).not.toBeInTheDocument());

    // Header should be visible after loading
    expect(screen.getByText(/Symbol/i)).toBeInTheDocument();
    expect(screen.getByText(/Name/i)).toBeInTheDocument();

    // Because of virtualization, not all rows are in the DOM,
    // but the first few should be visible.
    // The component repeats assets, so there will be multiple matches
    expect(screen.getAllByText(/AAPL/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Apple Inc./).length).toBeGreaterThan(0);
  });
});
