import {defaultRule, RuleKey} from "@/config/rules";
import {CACHE_BOARD_KEY, CACHE_RULE_KEY, CacheUtils, GameUtils} from "@/utils";
import {createSlice} from '@reduxjs/toolkit'
import boards, {BoardKey} from "../config/board";

export type PieceType = {
    rowIndex: number;
    colIndex: number;
    num: number;
};

export type PieceMoveData = { num: number; x: number; y: number };

export type GameFrameData = {
    steps?: number; // 步数
    board?: number[]; // 棋盘
    selfIsWhite?: boolean; // 自己是白方
    stepIsWhite?: boolean;// 轮到白方走棋
    onlyOnePieceStep?: number;// 某方只剩一个棋子，大于0表示白方，小于0表示黑方，绝对值表示步数
    gameIsEnd?: boolean;// 游戏是否结束
};

const defaultBoardKey = CacheUtils.getItem(CACHE_BOARD_KEY, "6") as BoardKey

const cacheRule = CacheUtils.getItem(CACHE_RULE_KEY, defaultRule);

const initialState = {
    steps: 0,
    board: boards[defaultBoardKey].board,
    selfIsWhite: false,
    stepIsWhite: false,
    onlyOnePieceStep: 0,
    gameIsEnd: false,

    selectPiece: 0, //点选模式当前选中的棋子
    boardKey: defaultBoardKey,
    rule: cacheRule, //规则
}


export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        /**
         * 处理棋子移动事件
         */
        handlePieceMove(state, {payload}) {
            state.selectPiece = 0;
            const oldPointIndex = state.board.findIndex((piece) => piece === payload.num);
            const oldRowIndex = Math.floor(oldPointIndex / 4);
            const oldColIndex = oldPointIndex % 4;

            const newRowIndex = payload.rowIndex;
            const newColIndex = payload.colIndex;

            const newPointIndex = newRowIndex * 4 + newColIndex;

            // 如果移动一格且此格没有棋子，则可以移动
            if (Math.abs(newRowIndex - oldRowIndex) + Math.abs(newColIndex - oldColIndex) === 1
                && state.board[newPointIndex] === 0) {
                state.board[oldPointIndex] = 0;
                state.board[newPointIndex] = payload.num;
                state.steps++;
                const killed = GameUtils.checkBoard(
                    state.board,
                    newRowIndex,
                    newColIndex,
                    state.rule,
                );
                // 将被吃掉的棋子从棋盘上移除
                killed.forEach((killed) => {
                    state.board[killed] = 0;
                });
                const isEnd = GameUtils.checkGameOver(state.board, state.stepIsWhite);
                if (isEnd) {
                    state.gameIsEnd = true;
                } else {
                    // 检查反方是否只剩一个棋子
                    if (state.onlyOnePieceStep === 0) {
                        const otherSideCount = state.board.filter((item) => {
                            return state.stepIsWhite ? item < 0 : item > 0;
                        }).length;
                        if (otherSideCount === 1) {
                            state.onlyOnePieceStep = state.stepIsWhite ? -1 : 1;
                        }
                    } else if (state.stepIsWhite === (state.onlyOnePieceStep > 0)) {
                        state.onlyOnePieceStep += state.onlyOnePieceStep > 0 ? 1 : -1;
                        if (Math.abs(state.onlyOnePieceStep) === 11) {
                            state.gameIsEnd = true;
                        }
                    }
                    state.stepIsWhite = !state.stepIsWhite;
                }
            }
        },

        /**
         * 重开游戏
         */
        handleRestart(state) {
            state.gameIsEnd = false;
            state.onlyOnePieceStep = 0;
            state.stepIsWhite = false;
            state.steps = 0;
            state.selectPiece = 0;
            state.board = [...boards[state.boardKey as BoardKey].board];
        },

        changeSelfColor(state) {
            state.selfIsWhite = !state.selfIsWhite;
        },

        updateSelfColor(state, {payload}) {
            state.selfIsWhite = payload;
        },

        updateSelectPiece(state, {payload}) {
            if (state.selectPiece === payload) {
                state.selectPiece = 0;
            } else {
                state.selectPiece = payload;
            }
        },

        updateRule(state, {payload}) {
            state.rule[payload.key as RuleKey] = payload.value
            CacheUtils.setItem(CACHE_RULE_KEY, state.rule)
        },

        updateBoard(state, {payload}) {
            state.boardKey = payload
            state.board = boards[payload as BoardKey].board
            CacheUtils.setItem(CACHE_BOARD_KEY, payload)
        },

    },
})

export const {
    handlePieceMove,
    handleRestart,
    changeSelfColor,
    updateRule,
    updateBoard,
    updateSelfColor,
    updateSelectPiece
} = gameSlice.actions

export default gameSlice.reducer
