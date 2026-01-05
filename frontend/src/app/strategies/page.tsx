'use client';

import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { useState } from 'react';

const GET_STRATEGIES = gql`
  query GetStrategies {
    strategies {
      id
      name
      type
      shortWindow
      longWindow
      createdAt
    }
  }
`;

const CREATE_STRATEGY = gql`
  mutation CreateStrategy($input: CreateStrategyInput!) {
    createStrategy(input: $input) {
      id
      name
      type
      shortWindow
      longWindow
    }
  }
`;

const DELETE_STRATEGY = gql`
  mutation RemoveStrategy($id: Int!) {
    removeStrategy(id: $id) {
      id
    }
  }
`;

export default function StrategiesPage() {
  const { data, loading, error, refetch } = useQuery(GET_STRATEGIES);
  const [createStrategy, { loading: creating }] = useMutation(CREATE_STRATEGY);
  const [removeStrategy, { loading: deleting }] = useMutation(DELETE_STRATEGY);

  const [name, setName] = useState('MA 10/30');
  const [shortWindow, setShortWindow] = useState(10);
  const [longWindow, setLongWindow] = useState(30);

  async function handleCreate() {
    await createStrategy({
      variables: {
        input: { name, type: 'MA_CROSS', shortWindow, longWindow },
      },
    });
    await refetch();
  }

  async function handleDelete(id: number) {
    await removeStrategy({ variables: { id } });
    await refetch();
  }

  if (loading) return <main className="p-6">Loading…</main>;
  if (error) return <main className="p-6 text-red-600">{error.message}</main>;

  const strategies = data?.strategies ?? [];

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Strategies</h1>

      <section className="border rounded-md p-4 space-y-3 max-w-xl">
        <h2 className="font-semibold">Create MA_CROSS strategy</h2>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-sm">
            Name
            <input className="border rounded px-2 py-1 w-full" value={name} onChange={e => setName(e.target.value)} />
          </label>
          <label className="text-sm">
            Short
            <input className="border rounded px-2 py-1 w-full" type="number" value={shortWindow} onChange={e => setShortWindow(Number(e.target.value))} />
          </label>
          <label className="text-sm">
            Long
            <input className="border rounded px-2 py-1 w-full" type="number" value={longWindow} onChange={e => setLongWindow(Number(e.target.value))} />
          </label>
        </div>
        <button
          className="px-3 py-2 rounded bg-blue-600 text-white text-sm disabled:opacity-50"
          disabled={creating}
          onClick={handleCreate}
        >
          Create
        </button>
      </section>

      <section className="border rounded-md p-4">
        <h2 className="font-semibold mb-3">Saved strategies</h2>
        {strategies.length === 0 ? (
          <p className="text-sm text-gray-600">No strategies yet.</p>
        ) : (
          <ul className="space-y-2">
            {strategies.map((s: any) => (
              <li key={s.id} className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{s.name}</span>{' '}
                  <span className="text-xs text-gray-600">
                    ({s.type}{s.shortWindow ? ` ${s.shortWindow}/${s.longWindow}` : ''})
                  </span>
                </div>
                <button
                  className="text-sm text-red-600 underline disabled:opacity-50"
                  disabled={deleting}
                  onClick={() => handleDelete(s.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
