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
        <div>
            <h2 className="text-xl font-bold mb-2">Assets</h2>
            <ul className="space-y-2">
                {data?.assets.map((asset: Asset) => (
                    <li key={asset.id}>
                        <span className="font-mono mr-2">{asset.symbol}</span>
                        <span className="text-gray-600">{asset.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}