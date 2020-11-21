import React from 'react'
import { Gear } from '../api'
import './css/GearForm.css'
import unitAbbreviations from '../helpers/unitAbbreviations'

interface GearFormProps {
    gear: Gear,
    onSubmit: any,
}

const GearForm = ({gear, onSubmit}: GearFormProps) => {

    const handleSubmit = e => {
        e.preventDefault()
        onSubmit({
            name: gear.name + 'sdfeg',
            //pk: gear.pk,
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <label>Name :</label>
            <input defaultValue={gear.name}type="text" />

            <label>Distance: </label>
            <div>
                <input defaultValue={gear.distance} type="number" />
                <span>{unitAbbreviations[gear.athlete.distance_unit]}</span>
            </div>

            <label>Time: </label>
            <div>
                <input defaultValue={gear.moving_time}type="number" />
                <label>d</label>  
                <input defaultValue={gear.moving_time}type="number" />
                <label>h</label>  
                <input defaultValue={gear.moving_time}type="number" />
                <label>m</label>  
                <input defaultValue={gear.moving_time}type="number" />
                <label>s</label>  
            </div>

            <button type="submit">Save</button>
        </form>
    )
}

export default GearForm