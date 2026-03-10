'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { List } from 'react-window';

export const GET_ASSETS = gql`
  query GetAssetsForVirtualTable {
    assets {
      id
      symbol
      name
    }
  }
`;

type Asset = {
  id: number;
  symbol: string;
  name: string;
};

interface AssetsQueryResult {
  assets: Asset[];
}

export function VirtualizedAssetsTable() {
  const { data, loading, error } = useQuery<AssetsQueryResult>(GET_ASSETS);

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-500">
        Loading assets…
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-red-500">
        Error: {error.message}
      </div>
    );
  if (!data?.assets)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-500">
        No assets found
      </div>
    );

  const assets: Asset[] = data.assets;

  // For demo, create a "large" list by repeating assets
  // so virtualization actually has something to do.
  const bigList: Asset[] = Array.from({ length: 5000 }, (_, i) => {
    const base = assets[i % assets.length];
    return {
      ...base,
      id: i, // use index as unique row id in this context
    };
  });

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const asset = bigList[index];

    return (
      <div
        style={style}
        className={`flex items-center px-4 text-sm border-b border-gray-100 transition-colors hover:bg-blue-50 ${
          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'
        }`}
      >
        <div className="w-20 font-mono font-semibold text-blue-700 text-xs tracking-wider">
          {asset.symbol}
        </div>
        <div className="flex-1 text-gray-700">{asset.name}</div>
        <div className="w-24 text-right font-mono text-xs text-gray-400">
          #{String(index).padStart(4, '0')}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-800">Assets</span>
          <span className="text-xs bg-blue-100 text-blue-700 font-mono px-2 py-0.5 rounded-full">
            {bigList.length.toLocaleString()} rows
          </span>
        </div>
        <span className="text-xs text-gray-400">Virtualized with react-window</span>
      </div>

      <div className="flex px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="w-20">Symbol</div>
        <div className="flex-1">Name</div>
        <div className="w-24 text-right">Row</div>
      </div>

      <List<{}>
        rowCount={bigList.length}
        rowHeight={36}
        rowComponent={Row}
        rowProps={{} as any}
        style={{ height: 480, width: '100%' }}
      />
    </div>
  );
}
