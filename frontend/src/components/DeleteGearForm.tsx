import React from 'react'

interface DeleteGearFormProps {}

const DeleteGearForm = () => {

    return (
        <form onSubmit={() => {}}>

            <div className="form-title">{'Really delete gear?'} gear</div>
            
            <div className="form-section">
                <label>Name</label>
                <div>
                    <input />
                </div>
            </div>

            <div className="form-section">
                <button type="submit">Save</button>
            </div>
        </form>
    )
}

export default DeleteGearForm