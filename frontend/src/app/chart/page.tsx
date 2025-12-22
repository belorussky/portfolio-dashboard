'use client';

import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { PriceChart } from '@/components/PriceChart';
import { useIndicatorsWorker } from '@/hooks/useIndicatorsWorker';

const GET_ASSETS = gql`
  query GetAssetsForChart {
    assets {
      id
      symbol
      name
    }
  }
`;

const GET_CANDLES = gql`
  query GetCandlesForChart($assetId: Int!, $timeframe: String!, $limit: Int!) {
    priceCandles(assetId: $assetId, timeframe: $timeframe, limit: $limit) {
      time
      close
    }
  }
`;

export default function ChartPage() {
  const { data: assetsData, loading: assetsLoading } = useQuery(GET_ASSETS);

  const [assetId, setAssetId] = useState<number>(1);
  const [limit, setLimit] = useState<number>(2000);

  const [showSma, setShowSma] = useState(true);
  const [showEma, setShowEma] = useState(false);
  const [smaPeriod, setSmaPeriod] = useState(20);
  const [emaPeriod, setEmaPeriod] = useState(20);

  const [isPending, startTransition] = useTransition();

  const { data, loading, error } = useQuery(GET_CANDLES, {
    variables: { assetId, timeframe: '1D', limit },
    skip: assetsLoading,
  });

  // Backend returns desc (latest first). For charts, use oldest -> newest.
  const candles = useMemo(() => {
    const list = data?.priceCandles ?? [];
    return [...list].reverse();
  }, [data]);

  const closes = useMemo(() => candles.map((c: any) => c.close as number), [candles]);

  const { compute, status: indStatus, result: indResult, error: indError } = useIndicatorsWorker();

  // Recompute indicators whenever inputs change
  useEffect(() => {
    if (!candles.length) return;

    const payload = {
      closes,
      smaPeriod: showSma ? smaPeriod : undefined,
      emaPeriod: showEma ? emaPeriod : undefined,
    };

    compute(payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closes, showSma, showEma, smaPeriod, emaPeriod]);

  const chartData = useMemo(() => {
    const smaArr = indResult?.sma;
    const emaArr = indResult?.ema;

    return candles.map((c: any, idx: number) => ({
      time: new Date(c.time).toISOString().slice(0, 10),
      close: c.close,
      sma: smaArr?.[idx] ?? null,
      ema: emaArr?.[idx] ?? null,
    }));
  }, [candles, indResult]);

  const assets = assetsData?.assets ?? [];

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Chart (Candles + Worker Indicators)</h1>

      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm">
          Asset:{' '}
          <select
            className="border rounded px-2 py-1"
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

        <label className="text-sm">
          Limit:{' '}
          <select
            className="border rounded px-2 py-1"
            value={limit}
            onChange={e => startTransition(() => setLimit(Number(e.target.value)))}
          >
            <option value={200}>200</option>
            <option value={2000}>2,000</option>
            <option value={10000}>10,000</option>
          </select>
        </label>

        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={showSma}
            onChange={e => setShowSma(e.target.checked)}
          />
          SMA
        </label>

        <label className="text-sm">
          SMA period:{' '}
          <input
            type="number"
            className="border rounded px-2 py-1 w-20"
            value={smaPeriod}
            min={2}
            onChange={e => setSmaPeriod(Number(e.target.value))}
            disabled={!showSma}
          />
        </label>

        <label className="text-sm flex items-center gap-2">
          <input
            type="checkbox"
            checked={showEma}
            onChange={e => setShowEma(e.target.checked)}
          />
          EMA
        </label>

        <label className="text-sm">
          EMA period:{' '}
          <input
            type="number"
            className="border rounded px-2 py-1 w-20"
            value={emaPeriod}
            min={2}
            onChange={e => setEmaPeriod(Number(e.target.value))}
            disabled={!showEma}
          />
        </label>

        <span className="text-xs text-gray-600">
          {isPending
            ? 'Updating…'
            : loading
            ? 'Loading candles…'
            : `Points: ${chartData.length}`}
          {' · '}
          {indStatus === 'running' ? 'Indicators: computing…' : `Indicators: ${indStatus}`}
        </span>
      </div>

      {error && <p className="text-red-600">Candles error: {error.message}</p>}
      {indError && <p className="text-red-600">Indicators error: {indError}</p>}

      {chartData.length > 0 ? (
        <PriceChart data={chartData} showSma={showSma} showEma={showEma} />
      ) : (
        <p className="text-sm text-gray-600">
          {loading ? 'Loading…' : 'No data yet.'}
        </p>
      )}
    </main>
  );
}
