import home from '@/assets/home.svg'

import React, {useCallback} from 'react';
import {useNavigate} from "react-router-dom";

import './index.scss'

type NavProps = {
    title: string
    onSetting: () => void
    onBack?: () => void
}

const Nav: React.FC<NavProps> = ({title, onSetting, onBack}) => {
    const navigate = useNavigate();

    const goHome = useCallback(() => {
        onBack && onBack()
        navigate('/', {replace: true});
    }, [navigate, onBack]);

    return (
        <div className="nav">
            <div className="actions">
                <div onClick={goHome} className="leftBtn">
                    <img src={home} alt=""/>
                </div>
                <div className="title">{title}</div>
                <div className="show-rules" onClick={onSetting}>📖 规则</div>
            </div>
        </div>
    );
}

export default Nav;
