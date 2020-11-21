import React from 'react'
import { Gear, Bike } from '../api'
import './css/GearForm.css'
import unitAbbreviations from '../helpers/unitAbbreviations'
import MultiSelect from './MultiSelect'

interface GearFormProps {
    gear: Gear,
    bikes: Bike[]
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
                <input defaultValue={gear.duration.days}type="number" />
                <label>d</label>  
                <input defaultValue={gear.duration.hours}type="number" />
                <label>h</label>  
                <input defaultValue={gear.duration.minutes}type="number" />
                <label>m</label>  
                <input defaultValue={gear.duration.seconds}type="number" />
                <label>s</label>  
            </div>

            <label>Track: </label>
            <input type="checkbox" />

            <MultiSelect options={[
                

            ]} />

            <button type="submit">Save</button>
        </form>
    )
}

export default GearForm