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

const inputCls = 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full';

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-500">
        Loading…
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-48 text-sm text-red-500">
        {error.message}
      </div>
    );

  const strategies = data?.strategies ?? [];

  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Strategies</h1>
        <p className="text-sm text-gray-500">Create and manage MA-crossover trading strategies</p>
      </div>

      <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">New Strategy</h2>
          <p className="text-xs text-gray-400 mt-0.5">Type: MA_CROSS</p>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Name
              <input
                className={inputCls}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Short window
              <input
                className={inputCls}
                type="number"
                value={shortWindow}
                min={2}
                onChange={e => setShortWindow(Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Long window
              <input
                className={inputCls}
                type="number"
                value={longWindow}
                min={3}
                onChange={e => setLongWindow(Number(e.target.value))}
              />
            </label>
          </div>
          <button
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={creating}
            onClick={handleCreate}
          >
            {creating ? 'Creating…' : 'Create strategy'}
          </button>
        </div>
      </section>

      <section className="border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Saved Strategies</h2>
          {strategies.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 font-mono px-2 py-0.5 rounded-full">
              {strategies.length}
            </span>
          )}
        </div>

        {strategies.length === 0 ? (
          <p className="text-sm text-gray-400 px-5 py-6">No strategies yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {strategies.map((s: any) => (
              <li
                key={s.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800">{s.name}</span>
                  <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    {s.type}{s.shortWindow ? ` ${s.shortWindow}/${s.longWindow}` : ''}
                  </span>
                </div>
                <button
                  className="text-xs text-red-500 border border-red-200 px-2.5 py-1 rounded-lg transition-all cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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
