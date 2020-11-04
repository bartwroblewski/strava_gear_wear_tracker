import React from 'react'
import { EditableGearWidget } from './GearWidget'

const Form = () => {

    const handleSubmit = (e: any) => {
        alert('submitting')
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" required />
                <select onChange={handleSubmit}>
                    <option>a</option>
                    <option>b</option>
                </select>
                <input type="submit"/>
            </form>
        </div>
    )
}

const Test = () => <Form />

export default Test