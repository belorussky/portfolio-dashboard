/// <reference lib="webworker" />

export type IndicatorsRequest = {
    closes: number[];
    smaPeriod?: number;
    emaPeriod?: number;
  };
  
  export type IndicatorsResult = {
    sma?: (number | null)[];
    ema?: (number | null)[];
  };
  
  function sma(closes: number[], period: number): (number | null)[] {
    const out: (number | null)[] = Array(closes.length).fill(null);
    let sum = 0;
  
    for (let i = 0; i < closes.length; i++) {
      sum += closes[i];
      if (i >= period) sum -= closes[i - period];
      if (i >= period - 1) out[i] = Number((sum / period).toFixed(4));
    }
    return out;
  }
  
  function ema(closes: number[], period: number): (number | null)[] {
    const out: (number | null)[] = Array(closes.length).fill(null);
    const k = 2 / (period + 1);
  
    let prev: number | null = null;
    for (let i = 0; i < closes.length; i++) {
      const price = closes[i];
      if (i < period - 1) continue;
  
      if (prev === null) {
        // seed EMA with SMA at first valid point
        const window = closes.slice(i - period + 1, i + 1);
        const seed = window.reduce((a, b) => a + b, 0) / period;
        prev = seed;
        out[i] = Number(seed.toFixed(4));
      } else {
        const next = price * k + prev * (1 - k);
        prev = next;
        out[i] = Number(next.toFixed(4));
      }
    }
    return out;
  }
  
  self.onmessage = (event: MessageEvent<IndicatorsRequest>) => {
    const { closes, smaPeriod, emaPeriod } = event.data;
  
    const result: IndicatorsResult = {};
    if (smaPeriod && smaPeriod > 1) result.sma = sma(closes, smaPeriod);
    if (emaPeriod && emaPeriod > 1) result.ema = ema(closes, emaPeriod);
  
    (self as unknown as Worker).postMessage(result);
  };
  