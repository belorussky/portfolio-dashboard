'use client';

import { useLivePrices } from '@/hooks/useLivePrices';

export function LivePricesTicker() {
  const { prices, connected } = useLivePrices();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            connected ? 'bg-green-500' : 'bg-gray-300'
          }`}
        />
        <span className="text-xs text-gray-500">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {prices.length === 0 ? (
        <p className="text-sm text-gray-400">Waiting for price data…</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {prices.map(p => (
            <div
              key={p.symbol}
              className="flex items-baseline gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
            >
              <span className="font-mono text-xs font-semibold text-blue-700">{p.symbol}</span>
              <span className="text-sm font-medium text-gray-800">{p.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
