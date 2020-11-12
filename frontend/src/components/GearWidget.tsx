import React from 'react'
import { Gear, Bike, toggleGearTracking } from '../api'
import './css/GearWidget.css'
import {addOrChangeGear} from '../api'

interface GearWidgetProps {
    gear: Gear,
    bikes: Bike[],
    onSubmit: any,
    onDelete: any,
}

export const GearWidget = ({gear, bikes, onSubmit, onDelete}: GearWidgetProps) => {

    const [name, setName] = React.useState<string>()
    const [mileage, setMileage] = React.useState<number>()

    React.useEffect(() => {
        setName(gear.name)
        setMileage(gear.mileage)
    }, [gear])

    const handleSubmit = (e: any) => {
        e.preventDefault()

        e.target.elements[0].focus()
        e.target.elements[0].blur()

        addOrChangeGear(name, gear.pk, mileage)
        //onSubmit()
    }
    return (
        <form onSubmit={(e: any) => handleSubmit(e)}>
            <div>
                <label>Name: </label>
                <input 
                    type="text" 
                    className="input-masked"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}   
                />
            </div>
            <div>
                <label>Mileage: </label>
                <input
                    type="number" 
                    className="input-masked"
                    value={mileage}
                    onChange={(e: any) => setMileage(e.target.value)}
                />
            </div>
            <div>
                <label>Track: </label>
                <input
                    type="checkbox"
                    defaultChecked={gear.is_tracked}
                    onChange={(e: any) => {
                        addOrChangeGear(name, gear.pk, mileage, undefined, e.target.checked)
                    }}
                />
            </div>
            <button type="submit" hidden>Submit</button>
        </form>
    )
}

export const AddGearWidget = () => {
    return (
        <div>
            fgfg
        </div>
    )
}
            