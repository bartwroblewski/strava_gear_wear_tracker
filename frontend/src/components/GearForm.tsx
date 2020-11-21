import React from 'react'
import { Gear } from '../api'

interface GearFormProps {
    gear: Gear,
    onSubmit: any,
}

const GearForm = ({gear, onSubmit}: GearFormProps) => {

    const handleSubmit = e => {
        e.preventDefault()
        onSubmit({name:'SOME NAME'})
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Name :</label>
            <input defaultValue={gear.name}type="text" />

            <label>Distance: </label>
            <input defaultValue={gear.distance} type="number" />

            <label>Time: </label>
            <input defaultValue={gear.moving_time}type="number" />

            <button type="submit">Save</button>
        </form>
    )
}

export default GearForm