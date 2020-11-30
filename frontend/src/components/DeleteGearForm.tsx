import React from 'react'

interface DeleteGearFormProps {}

const DeleteGearForm = () => {

    return (
        <form onSubmit={() => {}}>
            <div className="form-title">Really?</div>
            <div className="form-section">
                <button type="submit">Yes, delete gear</button>
                <button type="submit">Cancel</button>
            </div>
        </form>
    )
}

export default DeleteGearForm