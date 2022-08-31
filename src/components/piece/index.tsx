import black from '@/assets/black.png';
import white from '@/assets/white.png';
import {SelectLine} from "@/components";
import {PieceMoveData} from "@/stores/game";

import Konva from "konva";
import React, {useEffect, useRef, useState} from 'react';
import {Group, Image as KImage} from "react-konva";

type NavProps = {
    num: number; // 当前棋子
    select: boolean; // 是否被选择
    rowIndex: number; // 所在行
    colIndex: number; // 所在列
    boardGrid: number; // 棋盘格子大小
    animation: boolean; // 是否播放移动动画
    radius: number; // 半径
    draggable: boolean; // 是否可被拖动
    onMove: (data: PieceMoveData) => void; // 移动回调
    onSelect?: (num: number) => void; // 选择回调
}

const redrawNum = () => Math.random() * 0.1;

const Piece: React.FC<NavProps> = ({
                                       num,
                                       select,
                                       rowIndex,
                                       colIndex,
                                       boardGrid,
                                       radius,
                                       draggable,
                                       animation,
                                       onMove,
                                       onSelect,
                                   }) => {
    const nodeRef = useRef<Konva.Group>(null);
    const [redraw, setRedraw] = useState(redrawNum());

    const x = colIndex * boardGrid;
    const y = rowIndex * boardGrid;

    const [nx, setNx] = useState(x);
    const [ny, setNy] = useState(y);

    const fx = animation ? nx : x;
    const fy = animation ? ny : y;

    function onClick(num: number) {
        onSelect && onSelect(num)
    }

    useEffect(() => {
        if (nodeRef.current && animation) {
            const duration = 0.2
            const tween = new Konva.Tween({
                node: nodeRef.current,
                duration, x, y,
            });
            tween.play();
            setTimeout(() => {
                setNx(x);
                setNy(y);
            }, duration * 1000);
        }
    }, [animation, x, y])

    const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        onMove({
            x: e.target.x(),
            y: e.target.y(),
            num: num
        })
        setRedraw(redrawNum())
    };

    const image = new Image();
    image.src = num > 0 ? white : black;


    return (
        <Group
            ref={nodeRef}
            x={fx + redraw}
            y={fy + redraw}
            draggable={draggable}
            onDragEnd={onDragEnd}
            onTap={() => onClick(num)}
            onClick={() => onClick(num)}
        >
            <KImage
                image={image}
                width={radius * 2}
                height={radius * 2}
                x={-radius}
                y={-radius}
                shadowColor="#000"
                shadowBlur={4}
                shadowOffset={{x: 4, y: 6}}
                shadowOpacity={0.2}
            />
            {select ? <SelectLine boardGrid={boardGrid}/> : <></>}
        </Group>
    );
}

export default Piece;
