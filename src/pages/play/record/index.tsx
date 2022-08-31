import {Game, Modal} from "@/components";
import {boardScale, boardSize} from "@/config/board";
import {usePieces, useRemoteGo, useStore} from "@/hooks";
import {GameFrameData} from "@/stores/game";
import history, {goto} from "@/stores/history";

import React, {useEffect, useState} from 'react';

import './index.scss'

type RecordProps = {
    open: boolean
    mode: string
    onClose: () => void
}

const StepRecord: React.FC<RecordProps> = ({open, mode, onClose}) => {
    const gameStore = useStore(state => state.game);
    const [stepIndex, setStepIndex] = useState(1);
    const [gameInfo, setGameInfo] = useState<GameFrameData>({});
    const pieces = usePieces(gameInfo?.board, gameInfo?.selfIsWhite);
    const go = useRemoteGo(mode);
    const scale = 0.8;

    useEffect(() => {
        const pastElement = history.past?.[stepIndex - 1];
        setGameInfo(pastElement?.state)
    }, [stepIndex, open])

    useEffect(() => {
        setStepIndex(history.past?.length)
    }, [open])

    const onClick = () => {
        setStepIndex(stepIndex + 1);
    }

    const gotoStep = () => {
        go(goto(stepIndex - 1))
        onClose()
    }

    return <Modal
        open={open}
        width={boardSize.board * scale + 40}
        onClose={() => {
            onClose()
            setStepIndex(1)
        }}
    >
        <div className="step-boards">
            <Game
                stepIsSelf={gameStore.selfIsWhite === gameStore.stepIsWhite}
                boardSize={boardScale(scale)}
                pieces={pieces}
            />
            <div className="step-group">
                <span>{stepIndex}/{gameStore.steps}</span>
            </div>
            <div className="step-group">
                <button onClick={() => setStepIndex(stepIndex - 1)} disabled={stepIndex === 1}>
                    上一步
                </button>
                <button style={{margin: "0 10px"}} onClick={gotoStep}>
                    回到这里
                </button>
                <button onClick={onClick} disabled={stepIndex === gameStore.steps}>
                    下一步
                </button>
            </div>
        </div>
    </Modal>;
}

export default StepRecord;
