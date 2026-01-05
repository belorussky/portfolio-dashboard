'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useMemo, useState, useTransition } from 'react';
import { useBacktestWorker } from '@/hooks/useBacktestWorker';

const GET_ASSETS = gql`
  query GetAssetsForBacktest {
    assets { id symbol name }
  }
`;

const GET_STRATEGIES = gql`
  query GetStrategiesForBacktest {
    strategies { id name type shortWindow longWindow }
  }
`;

const GET_CANDLES = gql`
  query GetCandlesForBacktest($assetId: Int!, $timeframe: String!, $limit: Int!) {
    priceCandles(assetId: $assetId, timeframe: $timeframe, limit: $limit) {
      time
      close
    }
  }
`;

const SAVE_RUN = gql`
  mutation SaveRun($input: SaveBacktestRunInput!) {
    saveBacktestRun(input: $input) {
      id
      createdAt
      bars
      trades
      profit
      maxDrawdown
      asset { symbol }
      strategy { name }
    }
  }
`;

const GET_RUNS = gql`
  query GetRuns($limit: Int!) {
    backtestRuns(limit: $limit) {
      id
      createdAt
      bars
      trades
      profit
      maxDrawdown
      asset { symbol }
      strategy { name }
    }
  }
`;

export default function BacktestsRealPage() {
  const [assetId, setAssetId] = useState(1);
  const [strategyId, setStrategyId] = useState<number | null>(null);
  const [limit, setLimit] = useState(2000);
  const [isPending, startTransition] = useTransition();

  const { data: assetsData } = useQuery(GET_ASSETS);
  const { data: strategiesData } = useQuery(GET_STRATEGIES);
  const { data: runsData, refetch: refetchRuns } = useQuery(GET_RUNS, { variables: { limit: 20 } });

  const strategies = strategiesData?.strategies ?? [];
  const assets = assetsData?.assets ?? [];

  // default select first strategy once loaded
  if (strategyId === null && strategies.length > 0) {
    setStrategyId(strategies[0].id);
  }

  const selectedStrategy = strategies.find((s: any) => s.id === strategyId) ?? null;

  const { data: candlesData, loading: candlesLoading } = useQuery(GET_CANDLES, {
    variables: { assetId, timeframe: '1D', limit },
    skip: !assetId,
  });

  const closes = useMemo(() => {
    const list = candlesData?.priceCandles ?? [];
    // oldest -> newest
    return [...list].reverse().map((c: any) => c.close as number);
  }, [candlesData]);

  const { runBacktest, status, result, error } = useBacktestWorker();
  const [saveRun, { loading: saving }] = useMutation(SAVE_RUN);

  async function handleRun() {
    if (!selectedStrategy) return;
    if (selectedStrategy.type !== 'MA_CROSS') return;

    startTransition(() => {
      runBacktest({
        prices: closes,
        shortWindow: selectedStrategy.shortWindow,
        longWindow: selectedStrategy.longWindow,
      });
    });
  }

  async function handleSave() {
    if (!result || !selectedStrategy) return;

    await saveRun({
      variables: {
        input: {
          assetId,
          strategyId: selectedStrategy.id,
          timeframe: '1D',
          bars: result.bars,
          trades: result.trades,
          profit: result.profit,
          maxDrawdown: result.maxDrawdown,
        },
      },
    });

    await refetchRuns();
  }

  return (
    <main className="p-6 space-y-5">
      <h1 className="text-2xl font-bold">Backtests (Real Candles + Worker + Saved Runs)</h1>

      <section className="border rounded-md p-4 space-y-3">
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
            Strategy:{' '}
            <select
              className="border rounded px-2 py-1"
              value={strategyId ?? ''}
              onChange={e => startTransition(() => setStrategyId(Number(e.target.value)))}
            >
              {strategies.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.type}{s.shortWindow ? ` ${s.shortWindow}/${s.longWindow}` : ''})
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            Bars:{' '}
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

          <span className="text-xs text-gray-600">
            {isPending ? 'Updating…' : candlesLoading ? 'Loading candles…' : `Loaded closes: ${closes.length}`}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            className="px-3 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
            onClick={handleRun}
            disabled={!selectedStrategy || candlesLoading || closes.length === 0 || status === 'running'}
          >
            {status === 'running' ? 'Running…' : 'Run backtest'}
          </button>

          <button
            className="px-3 py-2 rounded border text-sm disabled:opacity-50"
            onClick={handleSave}
            disabled={!result || saving}
          >
            Save run
          </button>
        </div>

        <div className="text-xs text-gray-600">
          Worker status: <span className="font-mono">{status}</span>
        </div>

        {error && <p className="text-sm text-red-600">Worker error: {error}</p>}

        {result && (
          <div className="border-t pt-3 text-sm space-y-1">
            <div>Bars: {result.bars}</div>
            <div>Trades: {result.trades}</div>
            <div>Profit: {result.profit}</div>
            <div>Max drawdown: {result.maxDrawdown}</div>
          </div>
        )}
      </section>

      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-3">Recent saved runs</h2>
        {!(runsData?.backtestRuns?.length) ? (
          <p className="text-sm text-gray-600">No saved runs yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {runsData.backtestRuns.map((r: any) => (
              <li key={r.id} className="flex items-center justify-between">
                <div>
                  <span className="font-mono mr-2">{r.asset.symbol}</span>
                  <span className="font-semibold mr-2">{r.strategy.name}</span>
                  <span className="text-xs text-gray-600">
                    ({new Date(r.createdAt).toISOString().slice(0, 19).replace('T', ' ')})
                  </span>
                </div>
                <div className="text-right">
                  <div>Profit: {r.profit.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">DD: {r.maxDrawdown.toFixed(2)} · Trades: {r.trades}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
