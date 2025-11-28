'use client';

import { useEffect, useRef, useState } from 'react';
import type { BacktestRequest, BacktestResult } from '@/workers/backtestWorker';

type Status = 'idle' | 'running' | 'done' | 'error';

export function useBacktestWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    const worker = new Worker(
      new URL('../workers/backtestWorker.ts', import.meta.url),
      { type: 'module' },
    );

    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<BacktestResult>) => {
      setResult(event.data);
      setStatus('done');
    };

    worker.onerror = e => {
      console.error('Backtest worker error', e);
      setError(e.message);
      setStatus('error');
    };

    return () => {
      worker.terminate();
    };
  }, []);

  function runBacktest(params: BacktestRequest) {
    if (!workerRef.current) return;
    setStatus('running');
    setError(null);
    setResult(null);
    workerRef.current.postMessage(params);
  }

  return { runBacktest, status, result, error };
}
