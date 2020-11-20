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
    return (
        <div className="modal" onClick={toggle}>
            <div className="modal-contents">
                {contents}
            </div>
        </div>
    )
}

const GearModal = ({toggle}: GearModalProps) => <Modal contents={<GearForm />} toggle={toggle} />

export default GearModal