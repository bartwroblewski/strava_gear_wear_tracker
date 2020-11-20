import React from 'react'
import './css/GearModal.css'
import GearForm from './GearForm'

interface ModalProps {
    contents: any,
    toggle: any,
}

interface GearModalProps {
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

const GearModal = ({toggle}: GearModalProps) => 
    <Modal contents={<GearForm />} toggle={toggle} />

export default GearModal