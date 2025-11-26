'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_WATCHLISTS = gql`
  query GetWatchlists {
    watchlists {
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

export function WatchlistsView() {
  const { data, loading, error } = useQuery(GET_WATCHLISTS);

  if (loading) return <p>Loading watchlists...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data?.watchlists.length) {
    return <p>No watchlists yet.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Watchlists</h1>
      <div className="space-y-6">
        {data?.watchlists.map(
          (wl: {
            id: string;
            name: string;
            items: { id: string; asset: { symbol: string; name: string } }[];
          }) => (
            <div key={wl.id} className="border rounded-md p-4">
              <h2 className="text-xl font-semibold mb-2">{wl.name}</h2>
              {wl.items.length === 0 ? (
                <p className="text-sm text-gray-500">No assets in this watchlist.</p>
              ) : (
                <ul className="space-y-1">
                  {wl.items.map(item => (
                    <li key={item.id} className="flex gap-2">
                      <span className="font-mono">{item.asset.symbol}</span>
                      <span>- {item.asset.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
