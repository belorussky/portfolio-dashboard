'use client';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type ChartPoint = {
  time: string;
  close: number;
  sma?: number | null;
  ema?: number | null;
};

export function PriceChart({
  data,
  showSma,
  showEma,
}: {
  data: ChartPoint[];
  showSma: boolean;
  showEma: boolean;
}) {
  return (
    <div className="border rounded-md p-3">
      <div style={{ width: '100%', height: 420 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" minTickGap={30} />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="close" dot={false} strokeWidth={2} />
            {showSma && <Line type="monotone" dataKey="sma" dot={false} strokeWidth={1} />}
            {showEma && <Line type="monotone" dataKey="ema" dot={false} strokeWidth={1} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
