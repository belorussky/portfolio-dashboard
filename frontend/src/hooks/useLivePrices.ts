'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface LivePrice {
  symbol: string;
  price: number;
}

export function useLivePrices() {
  const [prices, setPrices] = useState<Record<string, LivePrice>>({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket: Socket = io('http://localhost:4000', {
      transports: ['websocket'], // avoid long polling noise
    });

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('priceSnapshot', (snapshot: LivePrice[]) => {
      setPrices(
        snapshot.reduce((acc, p) => {
          acc[p.symbol] = p;
          return acc;
        }, {} as Record<string, LivePrice>),
      );
    });

    socket.on('priceUpdate', (updates: LivePrice[]) => {
      setPrices(prev => {
        const next = { ...prev };
        updates.forEach(p => {
          next[p.symbol] = p;
        });
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const list = Object.values(prices).sort((a, b) => a.symbol.localeCompare(b.symbol));

  return { prices: list, connected };
}
