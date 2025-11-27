'use client';

import { useLivePrices } from '@/hooks/useLivePrices';

export function LivePricesTicker() {
  const { prices, connected } = useLivePrices();

  return (
    <div className="border rounded-md p-3 mt-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">Live Prices</h2>
        <span
          className={`text-xs ${
            connected ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          {connected ? 'connected' : 'disconnected'}
        </span>
      </div>

      {prices.length === 0 ? (
        <p className="text-sm text-gray-500">Waiting for price data...</p>
      ) : (
        <div className="flex flex-wrap gap-3 text-sm">
          {prices.map(p => (
            <div key={p.symbol} className="flex items-baseline gap-1">
              <span className="font-mono">{p.symbol}</span>
              <span>{p.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
