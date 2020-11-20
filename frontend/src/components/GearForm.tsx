import React from 'react'

interface GearFormProps {
    defaults: any,
}

const GearForm = ({defaults}: GearFormProps) => {
    return (
        <form>
            <label>Name :</label>
            <input defaultValue={defaults.name}type="text" />

            <label>Distance: </label>
            <input defaultValue={defaults.distance} type="number" />

            <label>Time: </label>
            <input defaultValue={defaults.time}type="number" />

            <button type="submit">Save</button>
        </form>
    )
}

export default GearForm