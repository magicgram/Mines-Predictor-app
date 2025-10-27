export interface User {
    id: string;
    predictionCount: number;
    awaitingDeposit: boolean;
    knownRedeposits: number;
}

export type GridCellState = 'hidden' | 'star' | 'bomb';
