export type Asset = {
    id: string;
    name: string;
    symbol: string;
};

export type PriceCandle = {
    id: string;
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number | null;
};