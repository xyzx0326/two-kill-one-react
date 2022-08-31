import {AnyAction} from "@reduxjs/toolkit";
import {sendAction} from "game-react";

import {useGo} from "./index";

export const useRemoteGo = (mode?: string) => {
    const go = useGo();
    return (action: AnyAction) => {
        go(action)
        if (mode && mode === 'remote') {
            sendAction(action);
        }
    };
}
