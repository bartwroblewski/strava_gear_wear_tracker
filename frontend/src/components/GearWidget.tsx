import React from 'react'
import { Gear } from '../api'
import './css/GearWidget.css'
import unitAbbreviations from '../helpers/unitAbbreviations'

interface GearWidgetProps {
    key: number,
    gear: Gear,
    distanceUnit: string,
    onClick: any,
}

export const GearWidget = ({gear, distanceUnit, onClick}: GearWidgetProps) => {
    return (
        <div className="gear-widget" onClick={() => onClick(gear.pk)}>
            <div className="gear-name">{gear.name}</div>
            <ul className="stats">
                <li className="stat">
                    <div className="stat-name">Distance</div>
                    <div>
                        <div className="stat-value">
                            {gear.distance_in_athlete_unit}
                            <span>{' ' + unitAbbreviations[distanceUnit]}</span>
                        </div>
                    </div>
                </li>
                <li className="stat">
                    <div className="stat-name">Time</div>
                    <div className="stat-value">{gear.duration.string}</div>
                </li>
                <li className="stat">
                    <div className="stat-name">Time remaining to milestone</div>
                    <div className="stat-value">{gear.milestones.moving_time.remaining}</div>
                </li>
                <li className="stat">
                    <div className="stat-name">Distance remaining to milestone</div>
                    <div className="stat-value">{gear.milestones.distance.remaining}</div>
                </li>
            </ul>
        </div>
    )
}         

interface AddGearWidgetProps {
    onSubmit: any,
}

export const AddGearWidget = ({onSubmit}: AddGearWidgetProps) => {

    const [name, setName] = React.useState<string>()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        onSubmit({name: name})
        setName('')
    }

    const handleChange = (e: any) => setName(e.target.value)

    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={name}
                type="text"
                placeholder="New gear name?"
                onChange={(e: any) => handleChange(e)}
            />
        </form>
    )
}