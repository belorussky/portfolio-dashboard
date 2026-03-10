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

const selectCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer';
const inputCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 disabled:opacity-40 disabled:cursor-not-allowed';

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

  const candles = useMemo(() => {
    const list = data?.priceCandles ?? [];
    return [...list].reverse();
  }, [data]);

  const closes = useMemo(() => candles.map((c: any) => c.close as number), [candles]);

  const { compute, status: indStatus, result: indResult, error: indError } = useIndicatorsWorker();

  useEffect(() => {
    if (!candles.length) return;
    compute({
      closes,
      smaPeriod: showSma ? smaPeriod : undefined,
      emaPeriod: showEma ? emaPeriod : undefined,
    });
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
    <main className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Chart</h1>
        <p className="text-sm text-gray-500">Price candles with SMA / EMA indicators computed via Web Worker</p>
      </div>

      <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Controls</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
              {isPending ? 'Updating…' : loading ? 'Loading…' : `${chartData.length.toLocaleString()} pts`}
            </span>
            <span className="text-gray-300">·</span>
            <span className="font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
              {indStatus === 'running' ? 'computing…' : `indicators: ${indStatus}`}
            </span>
          </div>
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
            </select>
          </label>

          <div className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            SMA
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  checked={showSma}
                  onChange={e => setShowSma(e.target.checked)}
                />
                <span className="text-xs text-gray-500">Show</span>
              </label>
              <input
                type="number"
                className={inputCls}
                value={smaPeriod}
                min={2}
                onChange={e => setSmaPeriod(Number(e.target.value))}
                disabled={!showSma}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            EMA
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                  checked={showEma}
                  onChange={e => setShowEma(e.target.checked)}
                />
                <span className="text-xs text-gray-500">Show</span>
              </label>
              <input
                type="number"
                className={inputCls}
                value={emaPeriod}
                min={2}
                onChange={e => setEmaPeriod(Number(e.target.value))}
                disabled={!showEma}
              />
            </div>
          </div>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Candles error: {error.message}
        </p>
      )}
      {indError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          Indicators error: {indError}
        </p>
      )}

      <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">Price Chart</h2>
        </div>
        <div className="p-4">
          {chartData.length > 0 ? (
            <PriceChart data={chartData} showSma={showSma} showEma={showEma} />
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              {loading ? 'Loading…' : 'No data yet.'}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
