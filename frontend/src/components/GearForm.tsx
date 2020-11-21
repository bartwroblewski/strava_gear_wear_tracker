import React from 'react'

interface GearFormDefaults {
    name: string,
    distance: number,
    time: number,
}

interface GearFormProps {
    defaults: GearFormDefaults,
    onSubmit: any,
}

const GearForm = ({defaults, onSubmit}: GearFormProps) => {

    const handleSubmit = e => {
        e.preventDefault()
        onSubmit({name:'SOME NAME'})
    }
    return (
        <form onSubmit={handleSubmit}>
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