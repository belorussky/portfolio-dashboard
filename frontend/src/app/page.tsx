import { AssetsList } from '@/components/AssetsList';
import Link from 'next/link';
import { LivePricesTicker } from '@/components/LivePricesTicker';
import { NAV_CARDS } from '@/config/navCards';

export default function HomePage() {
  return (
    <main className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
        <p className="text-sm text-gray-500">
          Practice project — NestJS · GraphQL · Prisma · Next.js · React
        </p>
      </div>

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Pages</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {NAV_CARDS.map(card => (
            <Link
              key={card.href}
              href={card.href}
              className={`block border rounded-xl px-4 py-3.5 transition-all hover:shadow-sm hover:-translate-y-0.5 ${card.color}`}
            >
              <div className={`text-sm font-semibold mb-0.5 ${card.labelColor}`}>{card.label}</div>
              <div className="text-xs text-gray-500 leading-snug">{card.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">Assets</h2>
        </div>
        <div className="px-5 py-4">
          <AssetsList />
        </div>
      </section>

      <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">Live Prices</h2>
        </div>
        <div className="px-5 py-4">
          <LivePricesTicker />
        </div>
      </section>
    </main>
  );
}
