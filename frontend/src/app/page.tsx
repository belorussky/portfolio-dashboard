import { AssetsList } from "@/components/AssetsList";

export default function Home() {
  return (
    <div className="p-6">
     <h1 className="text-2xl font-bold mb-4">Portfolio Dashboard</h1>
     <p className="text-gray-600 mb-4">This page is calling the Nest.js GraphQL backend and listing assets.</p>
     <AssetsList />
    </div>
  );
}
