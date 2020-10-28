import React from 'react'
import './css/Modals.css'

interface ModalProps {
  toggleModal: (e: any) => void,
  content: JSX.Element,
}

const Modal = ({toggleModal, content}: ModalProps) => {
  return (
    <div className="modal" onClick={toggleModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}> {/*  prevent hiding modal on modal content click */}
        {content}
      </div>
    </div>
  )
}

export default Modal