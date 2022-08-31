import {Modal} from "@/components";
import boards, {BoardKey, boardSize} from "@/config/board";
import rules, {RuleKey} from "@/config/rules";
import {useGo, useStore} from "@/hooks";
import {updateBoard, updateRule} from "@/stores/game";

import React from 'react';

import './index.scss'

type SettingProps = {
    open: boolean
    onClose: () => void
}

const RuleSetting: React.FC<SettingProps> = ({open, onClose}) => {
    const go = useGo();
    const gameStore = useStore(state => state.game);
    const ruleList = (Object.keys(rules) as RuleKey[]).map((ruleKey) => {
        const rule = rules[ruleKey];
        return {
            key: ruleKey,
            title: rule.title,
            desc: rule.desc,
            enabled: gameStore.rule[ruleKey],
        }
    });
    const boardList = (Object.keys(boards) as BoardKey[]).map((boardKey) => {
        const board = boards[boardKey];
        return {
            key: boardKey,
            title: board.title,
            enabled: gameStore.boardKey === boardKey,
        }
    });

    const toggleRuleItem = (key: RuleKey, enabled: boolean) => {
        go(updateRule({key: key, value: enabled}))
    }

    function toggleBoardItem(key: BoardKey) {
        go(updateBoard(key))
    }

    return <Modal
        open={open}
        width={boardSize.board * 0.8 + 40}
        onClose={() => {
            onClose()
        }}
    >
        <div className="board-setting">
            <div className="board-item">棋盘规则：</div>
            {boardList.map(board =>
                <div className="board-item"
                     key={board.key}>
                    <div className="board-item-check">
                        <input
                            type="radio"
                            checked={board.enabled}
                            disabled={gameStore.steps > 0}
                            onChange={() => toggleBoardItem(board.key)}
                        />
                    </div>
                    <div className="board-item-info">
                        <div className="board-item-title">{board.title}</div>
                    </div>
                </div>
            )}
        </div>
        <div className="rule-setting">
            <div className="rule-item">棋子规则:</div>
            {ruleList.map(ruleItem =>
                <div className="rule-item"
                     key={ruleItem.key}>
                    <div className="rule-item-check">
                        <input
                            type="checkbox"
                            checked={ruleItem.enabled}
                            disabled={gameStore.steps > 0}
                            onChange={() => toggleRuleItem(ruleItem.key, !ruleItem.enabled)}
                        />
                    </div>
                    <div className="rule-item-info">
                        <div className="rule-item-title">{ruleItem.title}</div>
                        <div className="rule-item-desc">{ruleItem.desc}</div>
                    </div>
                </div>
            )}
        </div>
    </Modal>;
}

export default RuleSetting;
