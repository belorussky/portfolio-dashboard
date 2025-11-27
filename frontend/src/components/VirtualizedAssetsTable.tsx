'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { List } from 'react-window';

const GET_ASSETS = gql`
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

  if (loading) return <p>Loading assets...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data?.assets) return <p>No assets found</p>;

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
        className={`flex items-center px-3 text-sm ${
            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
        }`}
      >
        <div className="w-16 font-mono">{asset.symbol}</div>
        <div className="flex-1">{asset.name}</div>
        <div className="w-20 text-right text-xs text-gray-500">
          #{index}
        </div>
      </div>
    );
  };

  return (
    <div className="border rounded-md overflow-hidden text-gray-600 bg-white">
      <div className="flex bg-gray-100 px-3 py-2 text-sm font-semibold">
        <div className="w-16">Symbol</div>
        <div className="flex-1">Name</div>
        <div className="w-20 text-right">Row</div>
      </div>

      {/* The virtualized part */}
      <List<{}>
        rowCount={bigList.length}
        rowHeight={32}
        rowComponent={Row}
        rowProps={{} as any}
        style={{ height: 400, width: '100%' }}
      />
    </div>
  );
}
