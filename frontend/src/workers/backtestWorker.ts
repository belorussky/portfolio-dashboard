/// <reference lib="webworker" />

export type BacktestRequest = {
    prices: number[];
    shortWindow: number;
    longWindow: number;
};
  
export type BacktestResult = {
    trades: number;
    profit: number;
    maxDrawdown: number;
    bars: number;
};

function movingAverage(prices: number[], window: number, index: number): number {
    let sum = 0;
    for (let i = index - window + 1; i <= index; i++) {
        sum += prices[i];
    }
    return sum / window;
}

function runStrategy({ prices, shortWindow, longWindow }: BacktestRequest): BacktestResult {
    if (prices.length < longWindow) {
        return { trades: 0, profit: 0, maxDrawdown: 0, bars: prices.length };
    }

    let position: 'long' | 'flat' = 'flat';
    let entryPrice = 0;
    let profit = 0;
    let trades = 0;

    let peakEquity = 0;
    let equity = 0;
    let maxDrawdown = 0;

    for (let i = longWindow; i < prices.length; i++) {
        const shortMA = movingAverage(prices, shortWindow, i);
        const longMA = movingAverage(prices, longWindow, i);

        // Simple crossover logic
        if (position === 'flat' && shortMA > longMA) {
            position = 'long';
            entryPrice = prices[i];
            trades++;
        } else if (position === 'long' && shortMA < longMA) {
            // close
            profit += prices[i] - entryPrice;
            position = 'flat';
            entryPrice = 0;
        }

        equity = profit + (position === 'long' ? prices[i] - entryPrice : 0);

        if (equity > peakEquity) {
            peakEquity = equity;
        }
        const drawdown = peakEquity - equity;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    }

    // Close any open position at the last bar
    const lastPrice = prices[prices.length - 1];
    if (position === 'long') {
        profit += lastPrice - entryPrice;
    }

    return {
        trades,
        profit: Number(profit.toFixed(2)),
        maxDrawdown: Number(maxDrawdown.toFixed(2)),
        bars: prices.length,
    };
}

self.onmessage = (event: MessageEvent<BacktestRequest>) => {
    const result = runStrategy(event.data);
    (self as unknown as Worker).postMessage(result);
};        
  