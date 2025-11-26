'use client';

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { client } from '@/graphql/client';

export const ApolloWrapper = ({ children }: { children: ReactNode }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};