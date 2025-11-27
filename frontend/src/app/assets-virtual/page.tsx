import { VirtualizedAssetsTable } from '@/components/VirtualizedAssetsTable';

export default function AssetsVirtualPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-2">
        Virtualized Assets Table
      </h1>
      <p className="text-sm text-gray-600 mb-4">
        This table uses <code>react-window</code> to efficiently render thousands
        of rows. Data comes from the GraphQL backend and is expanded to simulate
        a large list.
      </p>
      <VirtualizedAssetsTable />
    </main>
  );
}
