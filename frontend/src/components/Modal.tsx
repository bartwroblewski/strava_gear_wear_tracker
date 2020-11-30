import React from 'react'
import './css/Modal.css'

interface ModalProps {
    contents: any,
    hide: any,
}

const Modal = ({contents, hide}: ModalProps) => {

    const handleClick = e => {
        if (e.target.className === 'modal') hide()
    }

    return (
        <div className="modal" onClick={handleClick}>
            <div className="modal-contents">
                {contents}
            </div>
        </div>
    )
}

export default Modal