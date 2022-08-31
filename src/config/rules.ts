// 棋盘规则
// num棋盘上的棋子，1表示走的棋，2表示被吃掉的棋，0表示空位
// killed表示被吃掉的棋子的坐标
const rules = {
    "112": {
        "title": "二打一",
        "desc": "A走棋后在行/列形成AAB的棋形，且剩余一格为空，此行/列的B棋子被杀掉",
        "rule": [{num: 2110, killed: [0]},
            {num: 211, killed: [1]}, // 0211
            {num: 1120, killed: [2]},
            {num: 112, killed: [3]}, // 0112
        ]
    },
    "1122": {
        "title": "二打二",
        "desc": 'A走棋后在行/列形成AABB的棋形，此行/列的两个B棋子被杀掉',
        "rule": [
            {num: 2211, killed: [0, 1]},
            {num: 1122, killed: [2, 3]},
        ],
    },
    "121": {
        "title": "二夹一",
        "desc": "A走棋后在行/列形成ABA的棋形，且剩余一格为空，此行/列的B棋子被杀掉",
        "rule": [
            {num: 1210, killed: [1]},
            {num: 121, killed: [2]}, // 0121
        ]
    },
    "1221": {
        "title": "二夹二",
        "desc": "A走棋后在行/列形成ABBA的棋形，此行/列的两个B棋子被杀掉",
        "rule": [{num: 1221, killed: [1, 2]}],
    },
    "2112": {
        "title": "二挑二",
        "desc": "A走棋后在行/列形成BAAB的棋形，此行/列的两个B棋子被杀掉",
        "rule": [{num: 2112, killed: [0, 3]}],
    },
    "212": {
        "title": "一挑二",
        "desc": "A走棋后在行/列形成BAB的棋形，且剩余一格为空，此行/列的两个B棋子被杀掉",
        "rule": [
            {num: 2120, killed: [0, 2]},
            {num: 212, killed: [1, 3]}, // 0212
        ]
    },
};

export const defaultRule = {
    "112": true,
    "1122": false,
    "121": false,
    "1221": false,
    "2112": false,
    "212": false,
}

export default rules;
export type RuleKey = keyof typeof rules;

export type Rule = typeof defaultRule
