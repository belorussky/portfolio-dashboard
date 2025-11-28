import { AssetsList } from '@/components/AssetsList';
import Link from 'next/link';
import { LivePricesTicker } from '@/components/LivePricesTicker';

export default function HomePage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">
        Portfolio Dashboard (Practice Project)
      </h1>

      <p>
        This page shows assets from the Nest.js GraphQL backend. You can also check your{' '}
        <Link href="/watchlists" className="text-blue-600 underline">
          watchlists
        </Link>{' '}
        or the{' '}
        <Link href="/assets-virtual" className="text-blue-600 underline">
          virtualized assets table
        </Link>
        .
      </p>
      <p>
      <Link href="/backtests" className="text-blue-600 underline">
        backtests
      </Link>
      </p>

      <AssetsList />
      <LivePricesTicker />
    </main>
  );
}
