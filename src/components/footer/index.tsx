import black from '@/assets/black.png'
import white from '@/assets/white.png'

import React, {PropsWithChildren} from 'react';

import './index.scss'

export type FooterProps = {
    mode: string,
    selfIsWhite: boolean
} & PropsWithChildren

const Footer: React.FC<FooterProps> = ({mode, selfIsWhite, children}) => {
    return (
        <div className="footer">
            {mode !== 'local' ?
                <div className="color-piece">
                    <img className="piece-img"
                         src={selfIsWhite ? white : black}
                         alt=""
                    />
                    <span>己方执{selfIsWhite ? '白' : '黑'}</span>
                </div> : <></>
            }
            <div className="btns">
                {children}
            </div>
        </div>
    )
}

export default Footer;
