import logo from '@/assets/logo.svg'
import {nanoid} from "@reduxjs/toolkit";

import React from 'react';
import {useNavigate} from "react-router-dom";

import './index.scss'

function Home() {
    const navigate = useNavigate();
    return (
        <div className="home">
            <img className="logo" src={logo} alt=""/>
            <h1>六子冲棋</h1>
            <button onClick={() => navigate("/play/local")}>
                本地与人对战
            </button>
            <button onClick={() => navigate(`/play/remote/${nanoid()}`)}>
                线上与人对战
            </button>
            <button onClick={() => navigate("/play/ai")}>
                与机器对战
            </button>
        </div>
    );
}

export default Home;
