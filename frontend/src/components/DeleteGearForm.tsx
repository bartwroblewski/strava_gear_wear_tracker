import React from 'react'

interface DeleteGearFormProps {
    onSubmit: any,
    onCancel: any,
}

const DeleteGearForm = ({onSubmit, onCancel}: DeleteGearFormProps) => {

    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log('fgfg')
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-title">Really?</div>
            <div className="form-section form-buttons">
                <button type="submit">Yes, delete gear</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    )
}

export default DeleteGearForm