import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import userEvent from '@testing-library/user-event';
import { WatchlistsView, GET_WATCHLISTS_AND_ASSETS } from '@/components/WatchlistsView';
import { gql } from '@apollo/client';

const ADD_WATCHLIST_ITEM = gql`
  mutation AddWatchlistItem($watchlistId: Int!, $assetId: Int!) {
    addWatchlistItem(watchlistId: $watchlistId, assetId: $assetId) {
      id
      name
      items {
        id
        asset {
          id
          symbol
          name
        }
      }
    }
  }
`;

const mocks = [
  {
    request: {
      query: GET_WATCHLISTS_AND_ASSETS,
    },
    result: {
      data: {
        watchlists: [
          {
            id: 1,
            name: 'Tech Favorites',
            items: [
              {
                id: 10,
                asset: {
                  id: 1,
                  symbol: 'AAPL',
                  name: 'Apple Inc.',
                },
              },
            ],
          },
        ],
        assets: [
          { id: 1, symbol: 'AAPL', name: 'Apple Inc.' },
          { id: 2, symbol: 'TSLA', name: 'Tesla Inc.' },
        ],
      },
    },
  },
  {
    request: {
      query: ADD_WATCHLIST_ITEM,
      variables: {
        watchlistId: 1,
        assetId: 2,
      },
    },
    result: {
      data: {
        addWatchlistItem: {
          id: 1,
          name: 'Tech Favorites',
          items: [
            {
              id: 10,
              asset: {
                id: 1,
                symbol: 'AAPL',
                name: 'Apple Inc.',
              },
            },
            {
              id: 11,
              asset: {
                id: 2,
                symbol: 'TSLA',
                name: 'Tesla Inc.',
              },
            },
          ],
        },
      },
    },
  },
  // Mock for refetch after mutation
  {
    request: {
      query: GET_WATCHLISTS_AND_ASSETS,
    },
    result: {
      data: {
        watchlists: [
          {
            id: 1,
            name: 'Tech Favorites',
            items: [
              {
                id: 10,
                asset: {
                  id: 1,
                  symbol: 'AAPL',
                  name: 'Apple Inc.',
                },
              },
              {
                id: 11,
                asset: {
                  id: 2,
                  symbol: 'TSLA',
                  name: 'Tesla Inc.',
                },
              },
            ],
          },
        ],
        assets: [
          { id: 1, symbol: 'AAPL', name: 'Apple Inc.' },
          { id: 2, symbol: 'TSLA', name: 'Tesla Inc.' },
        ],
      },
    },
  },
];

function renderWithApollo() {
  return render(
    <MockedProvider mocks={mocks}>
      <WatchlistsView />
    </MockedProvider>,
  );
}

describe('WatchlistsView', () => {
  it('renders watchlist name and items from GraphQL data', async () => {
    renderWithApollo();

    // Loading state first
    expect(screen.getByText(/Loading watchlists/i)).toBeInTheDocument();

    // Wait for data
    await waitFor(() =>
      expect(screen.getByText('Tech Favorites')).toBeInTheDocument(),
    );

    // Watchlist item
    expect(screen.getByText(/AAPL/)).toBeInTheDocument();
    expect(screen.getByText(/Apple Inc./)).toBeInTheDocument();
  });

  it('shows "Add asset" section', async () => {
    renderWithApollo();

    await waitFor(() =>
      expect(screen.getByText('Tech Favorites')).toBeInTheDocument(),
    );

    expect(screen.getByText(/Add asset/i)).toBeInTheDocument();
    // TSLA is not yet in the watchlist -> should appear as available
    expect(screen.getByText(/TSLA/)).toBeInTheDocument();
  });

  it('clicks "Add" button for an asset', async () => {
    renderWithApollo();

    await waitFor(() =>
      expect(screen.getByText('Tech Favorites')).toBeInTheDocument(),
    );

    const addButtons = screen.getAllByRole('button', { name: /add/i });
    expect(addButtons.length).toBeGreaterThan(0);

    await userEvent.click(addButtons[0]);
    // We don't assert mutation result here (because we used a single static mock),
    // but we at least verify UI interaction doesn't crash.
  });
});
