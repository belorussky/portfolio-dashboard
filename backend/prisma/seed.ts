import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randomWalkCandles(days: number, startPrice: number) {
  const candles: {
    time: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[] = [];

  let price = startPrice;

  // generate in the past: today - days ... today - 1
  const now = new Date();
  for (let i = days; i >= 1; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    d.setUTCHours(0, 0, 0, 0);

    const open = price;
    const delta = (Math.random() - 0.5) * 4; // -2..2
    const close = Math.max(1, open + delta);

    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;

    const volume = 1_000_000 + Math.random() * 3_000_000;

    candles.push({
      time: d,
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(Math.max(0.01, low).toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Number(volume.toFixed(0)),
    });

    price = close;
  }

  return candles;
}

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

  // 5. Seed price candles
  // Seed candles (1D) for last 365 days for each asset
for (const asset of assets) {
  const startPrice = 50 + Math.random() * 200;
  const candles = randomWalkCandles(365, startPrice);

  for (const c of candles) {
    await prisma.priceCandle.upsert({
      where: {
        assetId_timeframe_time: {
          assetId: asset.id,
          timeframe: '1D',
          time: c.time,
        },
      },
      update: {
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume,
      },
      create: {
        assetId: asset.id,
        timeframe: '1D',
        time: c.time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume,
      },
    });
  }
}

  console.log('Seeded assets, user, watchlist, items, price candles');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
