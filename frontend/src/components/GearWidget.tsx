import React from 'react'
import { Gear, Bike, toggleGearTracking } from '../api'
import './css/GearWidget.css'
import {addOrChangeGear} from '../api'

interface GearWidgetProps {
    gear?: Gear,
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
        if (name) {
            e.target.elements[0].focus()
            e.target.elements[0].blur()

            addOrChangeGear(name, gear.pk, mileage)
            //onSubmit()
        }
    }
    return (
        <div className="gear-widget">
            <form onSubmit={(e: any) => handleSubmit(e)}>
                <div className="form-input-container">
                    <label>Name: </label>
                    <input 
                        type="text" 
                        className={gear ? "input-masked" : null}
                        value={name}
                        onChange={(e: any) => setName(e.target.value)}   
                        placeholder="Please fill in this field"
                    />
                </div>
                <div className="form-input-container">
                    <label>Mileage: </label>
                    <input
                        type="number" 
                        min="0"
                        className="input-masked"
                        value={mileage}
                        onChange={(e: any) => setMileage(e.target.value)}
                    />
                </div>
                <div className="form-input-container">
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
        </div>
    )
}            

export const AddGearWidget = () => {}