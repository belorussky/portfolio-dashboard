'use client';

import { useState, useTransition } from 'react';
import { useBacktestWorker } from '@/hooks/useBacktestWorker';

function generateSyntheticPrices(length: number): number[] {
  const prices: number[] = [];
  let price = 100;

  for (let i = 0; i < length; i++) {
    const noise = (Math.random() - 0.5) * 2; // -1..1
    price = Math.max(1, price + noise);
    prices.push(Number(price.toFixed(2)));
  }

  return prices;
}

export default function BacktestsPage() {
  const [shortWindow, setShortWindow] = useState(10);
  const [longWindow, setLongWindow] = useState(30);
  const [bars, setBars] = useState(20000); // size of the series
  const [isPending, startTransition] = useTransition();

  const { runBacktest, status, result, error } = useBacktestWorker();

  function handleRun() {
    startTransition(() => {
      const prices = generateSyntheticPrices(bars);
      runBacktest({ prices, shortWindow, longWindow });
    });
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Backtests (Web Worker + useTransition)</h1>
      <p className="text-sm text-gray-600">
        This page generates a long synthetic price series in the main thread and sends it to a
        Web Worker, which runs a simple moving-average crossover backtest.{' '}
        <code>useTransition</code> keeps the UI responsive while starting heavy work.
      </p>

      <section className="border rounded-md p-4 space-y-4 max-w-xl">
        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col text-sm">
            Short MA window
            <input
              type="number"
              className="border rounded px-2 py-1 mt-1"
              min={2}
              value={shortWindow}
              onChange={e => setShortWindow(Number(e.target.value))}
            />
          </label>

          <label className="flex flex-col text-sm">
            Long MA window
            <input
              type="number"
              className="border rounded px-2 py-1 mt-1"
              min={3}
              value={longWindow}
              onChange={e => setLongWindow(Number(e.target.value))}
            />
          </label>

          <label className="flex flex-col text-sm">
            Bars
            <input
              type="number"
              className="border rounded px-2 py-1 mt-1"
              min={1000}
              step={1000}
              value={bars}
              onChange={e => setBars(Number(e.target.value))}
            />
          </label>
        </div>

        <button
          onClick={handleRun}
          className="px-4 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
          disabled={status === 'running' || isPending}
        >
          {status === 'running' || isPending ? 'Running backtest…' : 'Run backtest'}
        </button>

        <div className="text-xs text-gray-600">
          Status: <span className="font-mono">{status}</span>{' '}
          {isPending && <span>(transition pending…)</span>}
        </div>

        {error && <p className="text-sm text-red-600">Error: {error}</p>}

        {result && (
          <div className="mt-4 border-t pt-4 text-sm space-y-1">
            <h2 className="font-semibold mb-1">Results</h2>
            <div>Bars: {result.bars}</div>
            <div>Trades: {result.trades}</div>
            <div>Profit: {result.profit}</div>
            <div>Max drawdown: {result.maxDrawdown}</div>
          </div>
        )}
      </section>
    </main>
  );
}
