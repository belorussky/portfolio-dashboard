'use client';

import { useEffect, useRef, useState } from 'react';
import type { IndicatorsRequest, IndicatorsResult } from '@/workers/indicatorsWorker';

type Status = 'idle' | 'running' | 'done' | 'error';

export function useIndicatorsWorker() {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<IndicatorsResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/indicatorsWorker.ts', import.meta.url),
      { type: 'module' },
    );

    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<IndicatorsResult>) => {
      setResult(event.data);
      setStatus('done');
    };

    worker.onerror = e => {
      console.error('Indicators worker error', e);
      setError(e.message);
      setStatus('error');
    };

    return () => worker.terminate();
  }, []);

  function compute(payload: IndicatorsRequest) {
    if (!workerRef.current) return;
    setStatus('running');
    setError(null);
    setResult(null);
    workerRef.current.postMessage(payload);
  }

  return { compute, status, result, error };
}
