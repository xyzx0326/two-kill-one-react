// 默认棋盘
// 每四个表示一行，每个数字表示一个棋子，0表示空位
// 大于0表示白棋，小于0表示黑棋
const boards = {
    "6": {
        "title": "六子",
        "board": [
            1, 2, 3, 4,
            5, 0, 0, 6,
            -5, 0, 0, -6,
            -1, -2, -3, -4
        ]
    },
    "5": {
        "title": "五子",
        "board": [
            0, 1, 2, 3,
            -5, 0, 0, 4,
            -4, 0, 0, 5,
            -3, -2, -1, 0
        ]
    },
    "4": {
        "title": "四子",
        "board": [
            1, 2, 3, 4,
            0, 0, 0, 0,
            0, 0, 0, 0,
            -1, -2, -3, -4
        ]
    }
}

export default boards;

export type BoardKey = keyof typeof boards;

const basic = Math.min(window.innerWidth, window.innerHeight, 640) - 20;

export const boardSize = {
    board: basic,
    boardEdge: basic * 0.03,
    boardGrid: basic * 0.235,
    pieceRadius: basic * 0.092
}

export const boardScale = (scale = 1) => {
    return {
        board: boardSize.board * scale,
        boardGrid: boardSize.boardGrid * scale,
        boardEdge: boardSize.boardEdge * scale,
        pieceRadius: boardSize.pieceRadius * scale
    }

}

export type BoardSizeType = typeof boardSize

export const getIndexByBoard = (data: number) => {
    return Math.min(3, Math.max(0, Math.round((data - boardSize.boardEdge) / boardSize.boardGrid)));
}
