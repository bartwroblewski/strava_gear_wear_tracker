import React from 'react'
interface ModalProps {
    contents: any,
}

const Modal = ({contents}: ModalProps) => {
    return (
        <div className="modal">
            <div className="modal-contents">
                {contents}
            </div>
        </div>
    )
}