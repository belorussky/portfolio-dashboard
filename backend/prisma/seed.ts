import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const assets = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { symbol: asset.symbol },
      update: {},
      create: asset,
    });
  }

  console.log('Seeded assets');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
