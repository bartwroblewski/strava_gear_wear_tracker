import React from 'react'
import { EditableGearWidget } from './GearWidget'

const Test = () => {

    const handleSubmit = (e: any) => {
        alert('submit')
    }

    return (
        <div>
            <form id="form" onSubmit={handleSubmit}>
                <input type="text"/>
                <select form="form">
                    <option>a</option>
                    <option>b</option>
                </select>
                <input type="submit"/>
            </form>

        </div>
    )
}

export default Test