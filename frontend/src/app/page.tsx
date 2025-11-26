import { AssetsList } from "@/components/AssetsList";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6">
     <h1 className="text-2xl font-bold mb-4">Portfolio Dashboard</h1>
     <p>
        This page shows assets from the Nest.js GraphQL backend. You can also check your{' '}
        <Link href="/watchlists" className="text-blue-600 underline">
          watchlists
        </Link>
        .
      </p>
     <AssetsList />
    </div>
  );
}
