import {BoardSizeType} from "@/config/board";

import Konva from "konva";
import React, {useEffect, useState} from 'react';
import {Group, Layer, Rect} from "react-konva";

type BoardProps = {
    boardSize: BoardSizeType;
    onMoveTo?: (data: MoveData) => void
}

export type MoveData = {
    x: number;
    y: number;
}

const Board: React.FC<BoardProps> = ({boardSize, onMoveTo}) => {
    const [rects, setRects] = useState<Konva.RectConfig[]>([]);
    const {board, boardGrid, boardEdge} = boardSize;

    useEffect(() => {
        const ret = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                ret.push({
                    row: i,
                    col: j,
                    x: boardGrid * i,
                    y: boardGrid * j,
                    width: boardGrid,
                    height: boardGrid,
                    fill: i % 2 === j % 2 ? '#729b17' : '#4a7d0c',
                });
            }
        }
        setRects(ret)
    }, [boardGrid])

    function onClick(x: number, y: number) {
        onMoveTo && onMoveTo({x, y});
    }

    return (

        <Layer>
            <Rect
                width={board}
                height={board}
                fill='#FFE35B'
            />
            <Group x={boardEdge} y={boardEdge}>
                {rects.map((rect, i) =>
                    <Rect
                        key={i}
                        x={rect.x}
                        y={rect.y}
                        width={rect.width}
                        height={rect.height}
                        fill={rect.fill}
                        onClick={() => onClick(rect.x! + boardGrid / 2, rect.y! + boardGrid / 2)}
                        onTap={() => onClick(rect.x! + boardGrid / 2, rect.y! + boardGrid / 2)}
                    />
                )}
            </Group>
        </Layer>
    );
}

export default Board;
