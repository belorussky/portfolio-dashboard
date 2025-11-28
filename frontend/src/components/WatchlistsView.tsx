'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

export const GET_WATCHLISTS_AND_ASSETS = gql`
    query GetWatchlistsAndAssets {
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
        assets {
            id
            symbol
            name
        }
    }
`;

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

const REMOVE_WATCHLIST_ITEM = gql`
  mutation RemoveWatchlistItem($itemId: Int!) {
    removeWatchlistItem(itemId: $itemId) {
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
    const { data, loading, error, refetch } = useQuery(GET_WATCHLISTS_AND_ASSETS);
    const [addWatchlistItem, { loading: adding }] = useMutation(ADD_WATCHLIST_ITEM);
    const [removeWatchlistItem, { loading: removing }] = useMutation(REMOVE_WATCHLIST_ITEM);
  
    if (loading) return <p>Loading watchlists...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    const { watchlists, assets } = data;
  
    if (!watchlists.length) {
      return <p>No watchlists yet.</p>;
    }
  
    const watchlist = watchlists[0]; // for now just use the first one
    const [firstWatchlist] = watchlists;
  
    async function handleAdd(assetId: number) {
      await addWatchlistItem({
        variables: {
          watchlistId: firstWatchlist.id,
          assetId,
        },
      });
  
      // simplest way: refetch query
      await refetch();
    }
  
    async function handleRemove(itemId: number) {
      await removeWatchlistItem({
        variables: { itemId },
      });
  
      await refetch();
    }
  
    // build a set of assetIds already in the watchlist to prevent duplicates
    const currentAssetIds = new Set<number>(
      firstWatchlist.items.map(
        (item: { asset: { id: number } }) => item.asset.id,
      ),
    );
  
    const availableAssets = assets.filter(
      (asset: { id: number }) => !currentAssetIds.has(asset.id),
    );
  
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Watchlists</h1>
  
        <section className="border rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">
            {firstWatchlist.name}
          </h2>
  
          {firstWatchlist.items.length === 0 ? (
            <p className="text-sm text-gray-500 mb-2">
              No assets in this watchlist yet.
            </p>
          ) : (
            <ul className="space-y-1 mb-4">
              {firstWatchlist.items.map(
                (item: {
                  id: number;
                  asset: { id: number; symbol: string; name: string };
                }) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono mr-2">
                        {item.asset.symbol}
                      </span>
                      <span>{item.asset.name}</span>
                    </div>
                    <button
                      className="text-sm text-red-600 underline disabled:opacity-50"
                      onClick={() => handleRemove(item.id)}
                      disabled={removing}
                    >
                      Remove
                    </button>
                  </li>
                ),
              )}
            </ul>
          )}
  
          <div className="border-t pt-3 mt-3">
            <h3 className="font-semibold mb-2">Add asset</h3>
            {availableAssets.length === 0 ? (
              <p className="text-sm text-gray-500">
                All assets are already in this watchlist.
              </p>
            ) : (
              <ul className="space-y-1">
                {availableAssets.map(
                  (asset: { id: number; symbol: string; name: string }) => (
                    <li
                      key={asset.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono mr-2">
                          {asset.symbol}
                        </span>
                        <span>{asset.name}</span>
                      </div>
                      <button
                        className="text-sm text-blue-600 underline disabled:opacity-50"
                        onClick={() => handleAdd(asset.id)}
                        disabled={adding}
                      >
                        Add
                      </button>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
        </section>
      </div>
    );
}
