import { VirtualizedAssetsTable } from '@/components/VirtualizedAssetsTable';

export default function AssetsVirtualPage() {
  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Virtualized Assets Table</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Uses <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">react-window</code> to efficiently render thousands of rows.
          Data comes from the GraphQL backend and is expanded to simulate a large list.
        </p>
      </div>
      <VirtualizedAssetsTable />
    </main>
  );
}
