import React, {PropsWithChildren} from 'react';

import './index.scss'

type ModalProps = {
    open: boolean,
    width?: number,
    height?: number,
    onClose: () => void
} & PropsWithChildren

const Modal: React.FC<ModalProps> = ({open, width, height, onClose, children}) => {
    width = width ?? Math.min(600, document.documentElement.clientWidth - 40)
    return open ?
        <div
            className="modal"
            style={{
                width: `${width}px`,
                height: height ? `${height}px` : 'auto',
                marginLeft: `${-(width / 2)}px`,
                // marginTop: `${-(height / 2)}px`,
            }}
        >
            <div className="modal-mask" onClick={onClose}></div>
            <div className="modal-close" onClick={onClose}>X</div>
            <div className="modal-body">
                {children}
            </div>
        </div> : <></>;
}

export default Modal;
