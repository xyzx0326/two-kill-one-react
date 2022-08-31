import {PieceType} from "@/stores/game";

export const usePieces = (board?: number[], selfIsWhite?: boolean) => {
    return board ? board.reduce((result: PieceType[], piece: number, index: number) => {
        if (piece === 0) {
            return result;
        }
        const rowIndex = Math.floor(index / 4);
        const colIndex = index % 4;
        result.push({
            rowIndex: selfIsWhite ? 3 - rowIndex : rowIndex,
            colIndex: selfIsWhite ? 3 - colIndex : colIndex,
            num: piece,
        });
        return result;
    }, [] as PieceType[]) : [] as PieceType[];
}
