import {Board, Piece} from "@/components";
import {BoardSizeType} from "@/config/board";
import {PieceMoveData, PieceType} from "@/stores/game";

import React, {useEffect, useRef, useState} from 'react';
import {Layer, Stage} from "react-konva";

import {MoveData} from "../board";

type GameProps = {
    pieces: PieceType[]; // 棋子数据
    selectPiece?: number; // 选择的棋子
    stepIsSelf: boolean; // 是否轮到自己
    boardSize: BoardSizeType; // 棋盘规格

    pieceDraggable?: (num: number) => boolean;
    onPieceMove?: (data: PieceMoveData) => void;
    onPieceSelect?: (data: number) => void;
}

const Game: React.FC<GameProps> = ({
                                       pieces, selectPiece = 0,
                                       stepIsSelf, boardSize,
                                       pieceDraggable, onPieceMove, onPieceSelect
                                   }) => {
    const [nPieces, setNPieces] = useState(pieces);
    const oldPieces = useRef(pieces);
    const {board, boardGrid, boardEdge, pieceRadius} = boardSize

    const sameLength = oldPieces.current.length === pieces.length;
    const killedPieces = oldPieces.current.filter(piece => !pieces.find(newPiece => newPiece.num === piece.num));

    const fPieces = sameLength || !stepIsSelf ? pieces : nPieces === pieces ? nPieces : [...pieces, ...killedPieces]

    useEffect(() => {
        oldPieces.current = pieces
    }, [pieces])

    useEffect(() => {
        if (!sameLength && stepIsSelf) {
            setTimeout(() => {
                setNPieces(pieces);
            }, 200);
        }
    }, [sameLength, stepIsSelf, pieces, setNPieces])

    const onMoveTo = (data: MoveData) => {
        if (selectPiece !== 0) {
            onMove({...data, num: selectPiece});
        }
    }

    const onMove = (data: PieceMoveData) => {
        onPieceMove && onPieceMove(data);
    }

    return (
        <Stage width={board} height={board}>
            <Board boardSize={boardSize}
                   onMoveTo={onMoveTo}/>
            <Layer x={boardGrid / 2 + boardEdge} y={boardGrid / 2 + boardEdge}>
                {fPieces.map(piece => {
                    return <Piece key={piece.num}
                                  num={piece.num}
                                  select={selectPiece === piece.num}
                                  animation={false}
                                  rowIndex={piece.rowIndex}
                                  colIndex={piece.colIndex}
                                  boardGrid={boardGrid}
                                  radius={pieceRadius}
                                  draggable={pieceDraggable ? pieceDraggable(piece.num) : false}
                                  onMove={onMove}
                                  onSelect={(num) => onPieceSelect && onPieceSelect(num)}
                    />;
                })}
            </Layer>
        </Stage>
    );
}

export default Game;
