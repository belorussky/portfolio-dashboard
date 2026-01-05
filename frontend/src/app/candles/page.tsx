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
    // We queried "desc" order from backend (latest first).
    // Tables usually feel nicer oldest->newest, so reverse.
    const list = (data?.priceCandles ?? []) as Candle[];
    return [...list].reverse();
  }, [data]);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Historical Candles (Virtualized)</h1>

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm">
          Asset:{' '}
          <select
            className="border rounded px-2 py-1"
            value={assetId}
            onChange={e => {
              const next = Number(e.target.value);
              startTransition(() => setAssetId(next));
            }}
          >
            {assets.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.symbol} — {a.name}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Limit:{' '}
          <select
            className="border rounded px-2 py-1"
            value={limit}
            onChange={e => {
              const next = Number(e.target.value);
              startTransition(() => setLimit(next));
            }}
          >
            <option value={200}>200</option>
            <option value={2000}>2,000</option>
            <option value={10000}>10,000</option>
            <option value={50000}>50,000</option>
          </select>
        </label>

        <span className="text-xs text-gray-600">
          {isPending ? 'Updating…' : loading ? 'Loading…' : `Rows: ${candles.length}`}
        </span>
      </div>

      {error && <p className="text-red-600">Error: {error.message}</p>}

      {candles.length > 0 ? (
        <VirtualizedCandleTable candles={candles} />
      ) : (
        <p className="text-sm text-gray-600">
          {loading ? 'Loading candles…' : 'No candles found.'}
        </p>
      )}
    </main>
  );
}

