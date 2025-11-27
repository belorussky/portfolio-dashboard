import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed assets
  const assetsData = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  ];

  // Keep track of created assets for later use in watchlist seeding.
  // Explicitly type as 'any[]' here to avoid TypeScript inferring 'never[]'
  // before any items are pushed when using strict compiler options.
  const assets: any[] = [];
  for (const asset of assetsData) {
    const created = await prisma.asset.upsert({
      where: { symbol: asset.symbol },
      update: {},
      create: {
        symbol: asset.symbol,
        name: asset.name,
      },
    });
    assets.push(created);
  }

  // 2. Seed a user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });

  // 3. Seed a default watchlist
  const watchlist = await prisma.watchlist.upsert({
    where: { id: 1 }, // simple upsert by id for dev
    update: {},
    create: {
      name: 'Tech Favorites',
      userId: user.id,
    },
  });

  // 4. Add some items to watchlist
  for (const asset of assets.slice(0, 3)) {
    await prisma.watchlistItem.upsert({
      where: {
        // composite unique alternative: but we'll just fake by id for dev
        id: asset.id + 1000,
      },
      update: {},
      create: {
        watchlistId: watchlist.id,
        assetId: asset.id,
      },
    });
  }

  console.log('Seeded assets, user, watchlist, items');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
