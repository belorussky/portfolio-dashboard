-- CreateTable
CREATE TABLE "PriceCandle" (
    "id" SERIAL NOT NULL,
    "assetId" INTEGER NOT NULL,
    "timeframe" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceCandle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PriceCandle_assetId_timeframe_time_idx" ON "PriceCandle"("assetId", "timeframe", "time");

-- CreateIndex
CREATE UNIQUE INDEX "PriceCandle_assetId_timeframe_time_key" ON "PriceCandle"("assetId", "timeframe", "time");

-- AddForeignKey
ALTER TABLE "PriceCandle" ADD CONSTRAINT "PriceCandle_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
