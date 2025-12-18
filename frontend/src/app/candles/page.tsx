'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import Link from 'next/link';
import { useState } from 'react';
import { Asset, PriceCandle } from '@/graphql/types';

const GET_ASSETS = gql`
  query GetAssetsForCandles {
    assets {
      id
      symbol
      name
    }
  }
`;

const GET_CANDLES = gql`
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

interface AssetsQueryResult {
  assets: Asset[];
}

interface CandlesQueryResult {
  priceCandles: PriceCandle[];
}

export default function CandlesPage() {
  const { data: assetsData, loading: assetsLoading } = useQuery<AssetsQueryResult>(GET_ASSETS);
  const [assetId, setAssetId] = useState<number>(1);

  const { data, loading, error } = useQuery<CandlesQueryResult>(GET_CANDLES, {
    variables: { assetId, timeframe: '1D', limit: 200 },
    skip: assetsLoading,
  });

  const assets = assetsData?.assets ?? [];

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Historical Candles</h1>

      <p className="text-sm text-gray-600">
        Backed by Postgres (Prisma) and fetched via GraphQL.
      </p>

      <div className="flex items-center gap-3">
        <label className="text-sm">
          Asset:{' '}
          <select
            className="border rounded px-2 py-1"
            value={assetId}
            onChange={e => setAssetId(Number(e.target.value))}
          >
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.symbol} — {a.name}
              </option>
            ))}
          </select>
        </label>

        <Link href="/assets-virtual" className="text-blue-600 underline text-sm">
          Virtual table demo
        </Link>
      </div>

      {loading && <p>Loading candles…</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}

      {data && (
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-6 bg-gray-100 px-3 py-2 text-sm font-semibold">
            <div>Time</div>
            <div className="text-right">Open</div>
            <div className="text-right">High</div>
            <div className="text-right">Low</div>
            <div className="text-right">Close</div>
            <div className="text-right">Volume</div>
          </div>

          <div className="max-h-[520px] overflow-auto">
            {data.priceCandles.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-6 px-3 py-2 text-sm border-t"
              >
                <div className="font-mono text-xs">
                  {new Date(c.time).toISOString().slice(0, 10)}
                </div>
                <div className="text-right">{c.open.toFixed(2)}</div>
                <div className="text-right">{c.high.toFixed(2)}</div>
                <div className="text-right">{c.low.toFixed(2)}</div>
                <div className="text-right">{c.close.toFixed(2)}</div>
                <div className="text-right">{Math.round(c.volume ?? 0)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
