import React from 'react'

interface GearFormProps {}

const GearForm = ({}: GearFormProps) => {
    return (
        <form>
            <label>Name :</label>
            <input type="text" />

            <label>Distance: </label>
            <input type="number" />

            <label>Time: </label>
            <input type="number" />

            <button type="submit">Save</button>
        </form>
    )
}

export default GearForm