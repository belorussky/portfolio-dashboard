'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useMemo, useState, useTransition } from 'react';
import { VirtualizedCandleTable, Candle } from '@/components/VirtualizedCandleTable';

const GET_ASSETS = gql`
  query GetAssetsForCandles {
    assets {
      id
      symbol
      name
    }
  }
`;

export const GET_CANDLES = gql`
  query GetCandles($assetId: Int!, $timeframe: String!, $limit: Int!) {
    priceCandles(assetId: $assetId, timeframe: $timeframe, limit: $limit) {
      id
      time
      open
      high
      low
      close
      volume
    }
  }
`;

const selectCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer';

export default function CandlesPage() {
  const { data: assetsData, loading: assetsLoading } = useQuery(GET_ASSETS);

  const [assetId, setAssetId] = useState<number>(1);
  const [limit, setLimit] = useState<number>(2000);
  const [isPending, startTransition] = useTransition();

  const { data, loading, error } = useQuery(GET_CANDLES, {
    variables: { assetId, timeframe: '1D', limit },
    skip: assetsLoading,
  });

  const assets = assetsData?.assets ?? [];

  const candles: Candle[] = useMemo(() => {
    const list = (data?.priceCandles ?? []) as Candle[];
    return [...list].reverse();
  }, [data]);

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Historical Candles</h1>
        <p className="text-sm text-gray-500">Virtualized table of OHLCV data from the GraphQL backend</p>
      </div>

      <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">Filters</h2>
        </div>
        <div className="px-5 py-4 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Asset
            <select
              className={selectCls}
              value={assetId}
              onChange={e => startTransition(() => setAssetId(Number(e.target.value)))}
            >
              {assets.map((a: any) => (
                <option key={a.id} value={a.id}>
                  {a.symbol} — {a.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Limit
            <select
              className={selectCls}
              value={limit}
              onChange={e => startTransition(() => setLimit(Number(e.target.value)))}
            >
              <option value={200}>200</option>
              <option value={2000}>2,000</option>
              <option value={10000}>10,000</option>
              <option value={50000}>50,000</option>
            </select>
          </label>

          <div className="flex items-center gap-2 pb-0.5">
            <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
              {isPending ? 'Updating…' : loading ? 'Loading…' : `${candles.length.toLocaleString()} rows`}
            </span>
          </div>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Error: {error.message}
        </p>
      )}

      {candles.length > 0 ? (
        <VirtualizedCandleTable candles={candles} />
      ) : (
        <div className="flex items-center justify-center h-40 text-sm text-gray-400 border border-gray-200 rounded-xl bg-white">
          {loading ? 'Loading candles…' : 'No candles found.'}
        </div>
      )}
    </main>
  );
}
