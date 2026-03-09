'use client';

import { useState, useTransition } from 'react';
import { useBacktestWorker } from '@/hooks/useBacktestWorker';

function generateSyntheticPrices(length: number): number[] {
  const prices: number[] = [];
  let price = 100;

  for (let i = 0; i < length; i++) {
    const noise = (Math.random() - 0.5) * 2;
    price = Math.max(1, price + noise);
    prices.push(Number(price.toFixed(2)));
  }

  return prices;
}

export default function BacktestsPage() {
  const [shortWindow, setShortWindow] = useState(10);
  const [longWindow, setLongWindow] = useState(30);
  const [bars, setBars] = useState(20000);
  const [isPending, startTransition] = useTransition();

  const { runBacktest, status, result, error } = useBacktestWorker();

  function handleRun() {
    startTransition(() => {
      const prices = generateSyntheticPrices(bars);
      runBacktest({ prices, shortWindow, longWindow });
    });
  }

  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Backtests (Web Worker + useTransition)</h1>
      <p className="text-sm text-gray-500 leading-relaxed">
        This page generates a long synthetic price series in the main thread and sends it to a
        Web Worker, which runs a simple moving-average crossover backtest.{' '}
        <code>useTransition</code> keeps the UI responsive while starting heavy work.
      </p>

      <section className="border border-gray-200 rounded-xl p-6 space-y-5 shadow-sm bg-white">
        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Short MA window
            <input
              type="number"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={2}
              value={shortWindow}
              onChange={e => setShortWindow(Number(e.target.value))}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Long MA window
            <input
              type="number"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={3}
              value={longWindow}
              onChange={e => setLongWindow(Number(e.target.value))}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Bars
            <input
              type="number"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={1000}
              step={1000}
              value={bars}
              onChange={e => setBars(Number(e.target.value))}
            />
          </label>
        </div>

        <button
          onClick={handleRun}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
          disabled={status === 'running' || isPending}
        >
          {status === 'running' || isPending ? 'Running backtest…' : 'Run backtest'}
        </button>

        <div className="text-xs text-gray-700 flex items-center gap-2">
          Status:
          <span className="font-mono bg-gray-100 text-gray-900 px-2 py-0.5 rounded">{status}</span>
          {isPending && <span>(transition pending…)</span>}
        </div>

        {error && <p className="text-sm text-red-600">Error: {error}</p>}

        {result && (
          <div className="mt-4 border-t pt-4 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">Results</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Bars', value: result.bars },
                { label: 'Trades', value: result.trades },
                { label: 'Profit', value: result.profit },
                { label: 'Max Drawdown', value: result.maxDrawdown },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="text-gray-500 text-xs mb-1">{label}</div>
                  <div className="font-semibold text-gray-900 text-base">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
