import rules, {Rule, RuleKey} from "@/config/rules";

export interface Step {
    num: number;
    rowIndex: number;
    colIndex: number;
}

export interface AiNextStep extends Step {
    score: number;
}

export class GameUtils {
    /**
     * 机器人走棋
     * @param board 棋盘
     * @param stepIsWhite 步骤是否是白棋
     * @param selfIsWhite 自己是否是白棋
     * @returns
     */
    static aiNextStep(
        board: number[],
        stepIsWhite: boolean,
        selfIsWhite: boolean,
        rule: Rule,
    ) {
        let aiNextSteps: AiNextStep[] = [];
        const calcAiNextStep = (
            board: number[],
            stepIsWhite: boolean,
            selfIsWhite: boolean,
            deep = 0,
            nextStepIndex = 0,
        ) => {
            let scoreScale = selfIsWhite === stepIsWhite ? 1 : -1; // 正反馈还是负反馈
            if (deep > 0) {
                scoreScale = scoreScale / Math.pow(3, deep);
            }

            for (let i = 0; i < board.length; i++) {
                if (board[i] !== 0 && (board[i] > 0) === stepIsWhite) {
                    const rowIndex = Math.floor(i / 4);
                    const colIndex = i % 4;
                    const nextPositions = [
                        [rowIndex - 1, colIndex],
                        [rowIndex + 1, colIndex],
                        [rowIndex, colIndex - 1],
                        [rowIndex, colIndex + 1],
                    ];
                    for (const [nextRowIndex, nextColIndex] of nextPositions) {
                        if (
                            nextRowIndex >= 0 &&
                            nextRowIndex < 4 &&
                            nextColIndex >= 0 &&
                            nextColIndex < 4 &&
                            board[nextRowIndex * 4 + nextColIndex] === 0
                        ) {
                            if (deep === 0) {
                                nextStepIndex =
                                    aiNextSteps.push({
                                        score: 0,
                                        num: board[i],
                                        rowIndex: nextRowIndex,
                                        colIndex: nextColIndex,
                                    }) - 1;
                            }
                            // 可以走，积1分
                            aiNextSteps[nextStepIndex].score += scoreScale;
                            // 检查是否可以吃掉对方的棋子，吃掉一个棋子，积5分
                            const nextBoard = [...board];
                            nextBoard[rowIndex * 4 + colIndex] = 0;
                            nextBoard[nextRowIndex * 4 + nextColIndex] = board[i];
                            const killed = GameUtils.checkBoard(
                                nextBoard,
                                nextRowIndex,
                                nextColIndex,
                                rule,
                            );
                            aiNextSteps[nextStepIndex].score +=
                                killed.length * scoreScale * 10;

                            if (deep < 3) {
                                for (const k of killed) {
                                    nextBoard[k] = 0;
                                }

                                calcAiNextStep(
                                    nextBoard,
                                    !stepIsWhite,
                                    selfIsWhite,
                                    deep + 1,
                                    nextStepIndex,
                                );
                            }
                        } else if (deep !== 0) {
                            // 不可以走，积-1分
                            aiNextSteps[nextStepIndex].score += scoreScale * -1;
                        }
                    }
                }
            }

            if (deep === 0) {
                if (aiNextSteps.length > 1) {
                    aiNextSteps.sort((a, b) => b.score - a.score);
                    // return Math.random() > 0.2 ? aiNextSteps[0] : aiNextSteps[1];
                }
                return aiNextSteps[0];
            }
        };
        return calcAiNextStep(board, stepIsWhite, selfIsWhite);
    }

    /**
     * 检查棋盘上的棋子是否可以吃掉对方的棋子
     * @param board 棋盘
     * @param line 形成连线的棋子的坐标
     * @param stepIsWhite 当前步骤是否是白棋
     * @param rule 判定规则
     * @returns
     */
    static checkLine(
        board: number[],
        line: number[],
        stepIsWhite: boolean,
        rule: Rule,
    ) {
        let lineNum = 0;
        for (let i = 0; i < 4; i++) {
            if (board[line[i]] !== 0) {
                lineNum +=
                    (stepIsWhite === (board[line[i]] > 0) ? 1 : 2) * Math.pow(10, 3 - i);
            }
        }
        const killed: number[] = [];
        for (const [ruleKey, enable] of Object.entries(rule)) {
            if (enable) {
                rules[ruleKey as RuleKey].rule.forEach((item) => {
                    if (item.num === lineNum) {
                        killed.push(...item.killed);
                    }
                });
            }
        }
        return killed;
    }

    /**
     *
     * @param board 棋盘
     * @param rowIndex 走棋的行坐标
     * @param colIndex 走棋的列坐标
     * @param rule 规则
     * @returns
     */
    static checkBoard(
        board: number[],
        rowIndex: number,
        colIndex: number,
        rule: Rule,
    ) {
        const stepIsWhite = board[rowIndex * 4 + colIndex] > 0;
        // 检查当前行
        const hKilled = GameUtils.checkLine(
            board,
            [rowIndex * 4, rowIndex * 4 + 1, rowIndex * 4 + 2, rowIndex * 4 + 3],
            stepIsWhite,
            rule,
        );
        // 检查当前列
        const vKilled = GameUtils.checkLine(
            board,
            [colIndex, colIndex + 4, colIndex + 8, colIndex + 12],
            stepIsWhite,
            rule,
        );
        return [
            ...hKilled.map((ci) => rowIndex * 4 + ci),
            ...vKilled.map((ri) => ri * 4 + colIndex),
        ];
    }

    /**
     * 检查局面是否结束，即反方没有可移动的棋子
     * @param board 棋盘
     * @param stepIsWhite 当前步骤是否白棋
     * @returns
     */
    static checkGameOver(board: number[], stepIsWhite: boolean) {
        let end = true;
        for (let i = 0; i < board.length; i++) {
            const item = board[i];
            const isOtherSide = stepIsWhite ? item < 0 : item > 0;

            if (isOtherSide) {
                const rowIndex = Math.floor(i / 4);
                const colIndex = i % 4;
                const canMove =
                    [
                        [rowIndex - 1, colIndex],
                        [rowIndex + 1, colIndex],
                        [rowIndex, colIndex - 1],
                        [rowIndex, colIndex + 1],
                    ].findIndex(([r, c]) => {
                        return r >= 0 && r < 4 && c >= 0 && c < 4 && board[r * 4 + c] === 0;
                    }) > -1;
                if (canMove) {
                    end = false;
                    break;
                }
            }
        }
        return end;
    }

}
