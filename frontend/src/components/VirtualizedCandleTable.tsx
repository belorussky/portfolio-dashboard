'use client';

import { List } from 'react-window';

export type Candle = {
  id: number;
  time: string; // ISO string from GraphQL
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number | null;
};

type Props = {
  candles: Candle[];
  height?: number;     // viewport height
  rowHeight?: number;  // row height
};

export function VirtualizedCandleTable({
  candles,
  height = 520,
  rowHeight = 36,
}: Props) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const c = candles[index];

    return (
      <div
        style={style}
        className={`grid grid-cols-6 px-3 text-sm items-center border-t ${
          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
        }`}
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
    );
  };

  return (
    <div className="border rounded-md overflow-hidden text-gray-600 bg-white">
      <div className="grid grid-cols-6 bg-gray-100 px-3 py-2 text-sm font-semibold">
        <div>Time</div>
        <div className="text-right">Open</div>
        <div className="text-right">High</div>
        <div className="text-right">Low</div>
        <div className="text-right">Close</div>
        <div className="text-right">Volume</div>
      </div>

      <List
        rowCount={candles.length}
        rowHeight={rowHeight}
        rowComponent={Row}
        rowProps={{} as any}
        style={{ height, width: '100%' }}
      />
    </div>
  );
}
