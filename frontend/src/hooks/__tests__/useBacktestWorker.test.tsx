import { render, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { useBacktestWorker } from '@/hooks/useBacktestWorker';

// Simple mock Worker that immediately calls onmessage with fake result
class MockWorker {
  onmessage: ((event: MessageEvent<any>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;

  constructor(_url: URL, _options?: WorkerOptions) {
    // ignore
  }

  postMessage(data: any) {
    const result = {
      trades: 3,
      profit: 123.45,
      maxDrawdown: 10.5,
      bars: data.prices.length,
    };

    setTimeout(() => {
      this.onmessage?.({ data: result } as MessageEvent);
    }, 0);
  }

  terminate() {
    // noop
  }
}

// Attach mock Worker to global
// @ts-ignore
global.Worker = MockWorker;

function TestComponent() {
  const { runBacktest, status, result, error } = useBacktestWorker();

  useEffect(() => {
    runBacktest({
      prices: [100, 101, 102, 103, 104],
      shortWindow: 2,
      longWindow: 3,
    });
  }, [runBacktest]);

  return (
    <div>
      <div data-testid="status">{status}</div>
      <div data-testid="error">{error ?? ''}</div>
      <div data-testid="bars">{result?.bars ?? ''}</div>
      <div data-testid="profit">{result?.profit ?? ''}</div>
    </div>
  );
}

describe('useBacktestWorker', () => {
  it('transitions from running to done and returns result', async () => {
    render(<TestComponent />);

    // initial or early state
    expect(screen.getByTestId('status').textContent).toBe('running');

    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('done'),
    );

    expect(screen.getByTestId('error').textContent).toBe('');
    expect(screen.getByTestId('bars').textContent).toBe('5');
    expect(screen.getByTestId('profit').textContent).toBe('123.45');
  });
});
