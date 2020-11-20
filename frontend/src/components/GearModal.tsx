import React from 'react'
import './css/GearModal.css'
import GearForm from './GearForm'

interface ModalProps {
    contents: any,
    toggle: any,
}

interface GearModalProps {
    toggle: any,
    defaults: any,
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

const GearModal = ({toggle, defaults}: GearModalProps) => 
    <Modal contents={<GearForm defaults={defaults} />} toggle={toggle} />

export default GearModal