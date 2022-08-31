import Konva from "konva";
import React, {useEffect, useRef} from "react";
import {Group, Line} from "react-konva";

type SelectLineProps = {
    boardGrid: number
}

const SelectLine: React.FC<SelectLineProps> = ({boardGrid}) => {
    const lineNode = useRef<Konva.Line>(null);
    const groupNode = useRef<Konva.Group>(null);

    const strokeWidth = boardGrid / 12;
    const x1 = boardGrid / 3;
    const y1 = boardGrid / 3;
    // round = 2πr ,  r = boardGrid/3 * √2
    const slice = boardGrid * 2.96191 / 6;
    const solid = slice / 2;
    const blank = slice - solid;

    useEffect(() => {
        const angularSpeed = 45;
        const anim = new Konva.Animation(function (frame) {
            const angleDiff = (frame!.timeDiff * angularSpeed) / 1000;
            lineNode.current && lineNode.current.rotate(angleDiff);
        }, groupNode);
        anim.start();
        return () => {
            anim.stop()
        };
    })

    return <Group ref={groupNode}>
        <Line
            ref={lineNode}
            points={[
                x1, y1,
                x1, -y1,
                -x1, -y1,
                -x1, y1,
            ]}
            stroke='red'
            lineCap='round'
            lineJoin='round'
            dash={[solid, blank]}
            tension={0.5}
            closed={true}
            strokeWidth={strokeWidth}
        />
    </Group>;
}
export default SelectLine;
