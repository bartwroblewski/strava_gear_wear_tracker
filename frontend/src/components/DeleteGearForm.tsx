import React from 'react'
import './css/Forms.css'

interface DeleteGearFormProps {
    onSubmit: any,
    onCancel: any,
}

const DeleteGearForm = ({onSubmit, onCancel}: DeleteGearFormProps) => {

    const handleSubmit = (e: any) => {
        e.preventDefault()
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-title">Really delete gear?</div>
            <div className="form-section form-buttons">
                <button type="submit" className="achtung">Yes</button>
                <button type="button" onClick={onCancel}>No</button>
            </div>
        </form>
    )
}

export default DeleteGearForm