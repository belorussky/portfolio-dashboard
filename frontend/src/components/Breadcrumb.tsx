'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABELS: Record<string, string> = {
  'watchlists': 'Watchlists',
  'assets-virtual': 'Virtualized Assets',
  'candles': 'Candles',
  'chart': 'Chart',
  'backtests': 'Backtests',
  'backtests-real': 'Backtests (Real)',
  'strategies': 'Strategies',
};

export function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = LABELS[seg] ?? seg;
    return { href, label };
  });

  return (
    <nav className="flex items-center gap-1.5 px-6 py-3 text-sm border-b border-gray-100 bg-white">
      <Link
        href="/"
        className="text-gray-400 hover:text-blue-600 transition-colors"
      >
        Home
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <span className="text-gray-300">/</span>
          {i === crumbs.length - 1 ? (
            <span className="text-gray-700 font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
