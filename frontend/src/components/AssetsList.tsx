'use client';

import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Asset } from '@/graphql/types';

const GET_ASSETS = gql`
    query Assets {
        assets {
            id
            name
            symbol
        }
    }
`;

interface AssetsQueryResult {
    assets: Asset[];
}

export const AssetsList = () => {
    const { data, loading, error } = useQuery<AssetsQueryResult>(GET_ASSETS);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <ul className="divide-y divide-gray-100">
            {data?.assets.map((asset: Asset) => (
                <li key={asset.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded tracking-wider">
                        {asset.symbol}
                    </span>
                    <span className="text-sm text-gray-700">{asset.name}</span>
                </li>
            ))}
        </ul>
    )
}