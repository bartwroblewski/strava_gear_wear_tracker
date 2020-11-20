import React from 'react'
import './css/GearModal.css'
import GearForm from './GearForm'

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

const GearModal = () => <Modal contents={<GearForm />} />

export default GearModal