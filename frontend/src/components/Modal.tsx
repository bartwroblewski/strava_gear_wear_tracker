import React from 'react'
import './css/Modal.css'

interface ModalProps {
    contents: any,
    toggle: any,
}

const Modal = ({contents, toggle}: ModalProps) => {

    const handleClick = e => {
        if (e.target.className === 'modal') toggle()
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