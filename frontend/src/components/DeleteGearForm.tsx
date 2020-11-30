import React from 'react'

interface DeleteGearFormProps {
    onSubmit: any,
}

const DeleteGearForm = ({onSubmit}: DeleteGearFormProps) => {

    const handleSubmit = (e: any) => {
        e.preventDefault()
        console.log('fgfg')
        onSubmit()
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-title">Really?</div>
            <div className="form-section">
                <button type="submit">Yes, delete gear</button>
                <button type="button">Cancel</button>
            </div>
        </form>
    )
}

export default DeleteGearForm