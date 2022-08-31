import black from '@/assets/black.png'
import white from '@/assets/white.png'

import React from 'react';
import {useCopyToClipboard} from "react-use";

import './index.scss'

type HeaderProps = {
    mode: string,
    selfIsWhite: boolean,
    otherSideOnline: boolean,
    channelId: string
}

const Header: React.FC<HeaderProps> = ({mode, selfIsWhite, otherSideOnline, channelId}) => {
    const [state, copyToClipboard] = useCopyToClipboard();
    const copyLink = () => {
        copyToClipboard(window.location.href)
        if (state.error) {
            alert("当前浏览器不支持复制功能，请手动复制页面链接或直接分享本页面给好友")
        } else {
            alert("邀请链接已复制，可以粘贴发给好友或直接分享本页面给好友")
        }
    };

    return mode !== 'local' ?
        <div className="header">
            <div className="color-piece">
                <img className="piece-img" src={!selfIsWhite ? white : black} alt=""/>
                <span>对方{mode === "remote" ? otherSideOnline ? '在线' : '离线或无人' : ''}</span>
            </div>
            {mode === "remote" && otherSideOnline ?
                <div className="channel">
                    <span>房间：{channelId}</span>
                    <button onClick={copyLink}>邀请
                    </button>
                </div> : <></>
            }
        </div> : <></>
}

export default Header;
