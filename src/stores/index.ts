import {AnyAction, configureStore} from '@reduxjs/toolkit'
import {Reducer} from "react";
import game from "./game";
import history from './history';

const historyStore = (reducer: Reducer<any, AnyAction>) => (state = history.present, action: AnyAction) => {
    switch (action.type) {
        case 'history/undo':
            history.undo(action.payload);
            break;
        case 'history/redo':
            history.redo(action.payload);
            break;
        case 'history/goto':
            history.gotoState(action.payload);
            break;
        default:
            const newState = reducer(state, action);
            if (action.type && action.type.startsWith('game')) {
                if (newState.steps === 0) {
                    history.clear()
                    history.push({state: newState, action});
                } else if (JSON.stringify(newState.steps) !== JSON.stringify(state.steps)) {
                    history.push({state: newState, action});
                } else {
                    return newState
                }
            } else {
                return newState
            }
    }
    return history.present.state;
};

export const store = configureStore({
    reducer: {
        game: historyStore(game),
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
