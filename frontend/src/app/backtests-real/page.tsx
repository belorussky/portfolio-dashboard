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

const selectCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer';

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
    <main className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Backtests (Real)</h1>
        <p className="text-sm text-gray-500">Real candles from GraphQL · Web Worker backtest · Saved runs</p>
      </div>

      <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Configuration</h2>
          <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
            {isPending ? 'Updating…' : candlesLoading ? 'Loading candles…' : `${closes.length.toLocaleString()} closes`}
          </span>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div className="grid grid-cols-3 gap-4">
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
              Strategy
              <select
                className={selectCls}
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

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Bars
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
          </div>

          <div className="flex items-center gap-3">
            <button
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleRun}
              disabled={!selectedStrategy || candlesLoading || closes.length === 0 || status === 'running' || isPending}
            >
              {status === 'running' || isPending ? 'Running…' : 'Run backtest'}
            </button>

            <button
              className="px-5 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 bg-white text-sm font-medium text-gray-700 transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleSave}
              disabled={!result || saving}
            >
              {saving ? 'Saving…' : 'Save run'}
            </button>

            <span className="text-xs text-gray-500">
              Worker: <span className="font-mono bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">{status}</span>
            </span>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              Worker error: {error}
            </p>
          )}

          {result && (
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Results</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Bars', value: result.bars },
                  { label: 'Trades', value: result.trades },
                  { label: 'Profit', value: result.profit },
                  { label: 'Max Drawdown', value: result.maxDrawdown },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">{label}</div>
                    <div className="font-semibold text-gray-900 text-base">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Recent Saved Runs</h2>
          {runsData?.backtestRuns?.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 font-mono px-2 py-0.5 rounded-full">
              {runsData.backtestRuns.length} runs
            </span>
          )}
        </div>

        {!(runsData?.backtestRuns?.length) ? (
          <p className="text-sm text-gray-400 px-5 py-6">No saved runs yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {runsData.backtestRuns.map((r: any) => (
              <li key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded tracking-wider">
                    {r.asset.symbol}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{r.strategy.name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(r.createdAt).toISOString().slice(0, 19).replace('T', ' ')}
                  </span>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium text-gray-800">Profit: {r.profit.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">DD: {r.maxDrawdown.toFixed(2)} · Trades: {r.trades}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
