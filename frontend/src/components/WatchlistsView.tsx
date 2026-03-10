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
  
    if (loading)
      return (
        <div className="flex items-center justify-center h-48 text-sm text-gray-500">
          Loading watchlists…
        </div>
      );
    if (error)
      return (
        <div className="flex items-center justify-center h-48 text-sm text-red-500">
          Error: {error.message}
        </div>
      );

    const { watchlists, assets } = data;

    if (!watchlists.length) {
      return (
        <div className="flex items-center justify-center h-48 text-sm text-gray-500">
          No watchlists yet.
        </div>
      );
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Watchlists</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your tracked assets</p>
        </div>

        <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-base font-semibold text-gray-800">{firstWatchlist.name}</h2>
            <span className="text-xs bg-blue-100 text-blue-700 font-mono px-2 py-0.5 rounded-full">
              {firstWatchlist.items.length} asset{firstWatchlist.items.length !== 1 ? 's' : ''}
            </span>
          </div>

          {firstWatchlist.items.length === 0 ? (
            <p className="text-sm text-gray-400 px-5 py-6">No assets in this watchlist yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {firstWatchlist.items.map(
                (item: {
                  id: number;
                  asset: { id: number; symbol: string; name: string };
                }) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded tracking-wider">
                        {item.asset.symbol}
                      </span>
                      <span className="text-sm text-gray-700">{item.asset.name}</span>
                    </div>
                    <button
                      className="text-xs text-red-500 border border-red-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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

          <div className="border-t border-gray-200 bg-gray-50">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Add asset</h3>
            </div>
            {availableAssets.length === 0 ? (
              <p className="text-sm text-gray-400 px-5 py-4">
                All assets are already in this watchlist.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {availableAssets.map(
                  (asset: { id: number; symbol: string; name: string }) => (
                    <li
                      key={asset.id}
                      className="flex items-center justify-between px-5 py-3 hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded tracking-wider">
                          {asset.symbol}
                        </span>
                        <span className="text-sm text-gray-600">{asset.name}</span>
                      </div>
                      <button
                        className="text-xs text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                        onClick={() => handleAdd(asset.id)}
                        disabled={adding}
                      >
                        + Add
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
