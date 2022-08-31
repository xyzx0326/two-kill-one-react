import {Home, Play} from '@/pages';
import {store} from "@/stores";
import {updateBoard, updateRule, updateSelfColor} from "@/stores/game";

import {configClient} from "game-react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import './index.css';
import reportWebVitals from './reportWebVitals';

const game = store.getState().game;

configClient("ws://game.congeer.com/game/ws", {
    maxPlayer: 2,
    baseConfig: [updateRule(game.rule), updateBoard(game.boardKey)],
    playerConfig: [[updateSelfColor(false)], [updateSelfColor(true)]],
    configCallback: store.dispatch,
    actionCallback: store.dispatch
}, "tko")

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(<Provider store={store}>
        <BrowserRouter basename="tko">
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/play/:mode" element={<Play/>}/>
                <Route path="/play/:mode/:roomId" element={<Play/>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
);

reportWebVitals();
